import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AudioFeatures } from '@/types/mood';

interface GenerateRequest {
  features: AudioFeatures;
  aiSuggestions?: {
    moodDescription: string;
    recommendedGenres: string[];
    contextualNotes: string;
  };
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { features, aiSuggestions } = (await req.json()) as GenerateRequest;

    // Get user's top tracks as seed tracks
    const topTracksResponse = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=5', {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!topTracksResponse.ok) {
      throw new Error('Failed to fetch top tracks');
    }

    const topTracks = await topTracksResponse.json();
    const seedTracks = topTracks.items.map((track: any) => track.id).slice(0, 2);

    // Get recommendations based on audio features and seeds
    const params = new URLSearchParams({
      limit: '20',
      seed_tracks: seedTracks.join(','),
      target_energy: features.energy.toString(),
      target_valence: features.valence.toString(),
      target_danceability: features.danceability.toString(),
      target_acousticness: features.acousticness.toString(),
      target_instrumentalness: features.instrumentalness.toString(),
    });

    if (aiSuggestions?.recommendedGenres?.length) {
      const seedGenres = aiSuggestions.recommendedGenres
        .slice(0, 3)
        .map(genre => genre.toLowerCase())
        .join(',');
      params.append('seed_genres', seedGenres);
    }

    const recommendationsResponse = await fetch(
      `https://api.spotify.com/v1/recommendations?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (!recommendationsResponse.ok) {
      throw new Error('Failed to get recommendations');
    }

    const recommendations = await recommendationsResponse.json();

    // Create a new playlist
    const createPlaylistResponse = await fetch(
      `https://api.spotify.com/v1/users/${session.user.id}/playlists`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `Mood Mix: ${aiSuggestions?.moodDescription || 'Custom Mood'}`,
          description: `Generated by Mood Mixer${
            aiSuggestions?.contextualNotes ? `: ${aiSuggestions.contextualNotes}` : ''
          }`,
          public: false,
        }),
      }
    );

    if (!createPlaylistResponse.ok) {
      throw new Error('Failed to create playlist');
    }

    const playlist = await createPlaylistResponse.json();

    // Add tracks to the playlist
    const trackUris = recommendations.tracks.map((track: any) => track.uri);
    await fetch(
      `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uris: trackUris,
        }),
      }
    );

    return NextResponse.json({
      playlistId: playlist.id,
      tracks: recommendations.tracks,
    });
  } catch (error) {
    console.error('Error generating playlist:', error);
    return NextResponse.json(
      { error: 'Failed to generate playlist' },
      { status: 500 }
    );
  }
}
