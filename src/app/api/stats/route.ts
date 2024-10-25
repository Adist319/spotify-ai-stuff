// app/api/stats/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { TopItem, TopItemsData, StatsError } from '@/types/stats';

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req: req as any });
    
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = new URL(req.url).searchParams;
    const timeRange = searchParams.get('timeRange') || 'medium_term';

    // Fetch data from Spotify API
    const [topArtists, topTracks, recentlyPlayed, userProfile, following, playlists, savedAlbums] = await Promise.all([
      fetch(`https://api.spotify.com/v1/me/top/artists?limit=20&time_range=${timeRange}`, {
        headers: { Authorization: `Bearer ${token.accessToken}` },
      }),
      fetch(`https://api.spotify.com/v1/me/top/tracks?limit=20&time_range=${timeRange}`, {
        headers: { Authorization: `Bearer ${token.accessToken}` },
      }),
      fetch('https://api.spotify.com/v1/me/player/recently-played?limit=20', {
        headers: { Authorization: `Bearer ${token.accessToken}` },
      }),
      fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${token.accessToken}` },
      }),
      fetch('https://api.spotify.com/v1/me/following?type=artist', {
        headers: { Authorization: `Bearer ${token.accessToken}` },
      }),
      fetch('https://api.spotify.com/v1/me/playlists', {
        headers: { Authorization: `Bearer ${token.accessToken}` },
      }),
      fetch('https://api.spotify.com/v1/me/albums?limit=20', {
        headers: { Authorization: `Bearer ${token.accessToken}` },
      })
    ]);

    if (!topArtists.ok || !topTracks.ok || !recentlyPlayed.ok || 
        !userProfile.ok || !following.ok || !playlists.ok || !savedAlbums.ok) {
      throw new Error('Failed to fetch data from Spotify');
    }

    const [
      artistsData,
      tracksData,
      recentData,
      profileData,
      followingData,
      playlistsData,
      albumsData
    ] = await Promise.all([
      topArtists.json(),
      topTracks.json(),
      recentlyPlayed.json(),
      userProfile.json(),
      following.json(),
      playlists.json(),
      savedAlbums.json()
    ]);

    // Calculate today's listening time from recently played tracks
    const today = new Date().setHours(0, 0, 0, 0);
    const todayTracks = recentData.items.filter((item: any) => 
      new Date(item.played_at).setHours(0, 0, 0, 0) === today
    );
    const todayListeningTime = todayTracks.reduce((acc: number, item: any) => 
      acc + (item.track.duration_ms / 1000 / 60), 0); // Convert to minutes

    const topItems: TopItemsData = {
      artists: artistsData.items.map((artist: any) => ({
        id: artist.id,
        name: artist.name,
        image: artist.images[0]?.url || '/api/placeholder/64/64',
        genres: artist.genres,
        type: 'artist'
      })),
      tracks: tracksData.items.map((track: any) => ({
        id: track.id,
        name: track.name,
        image: track.album.images[0]?.url || '/api/placeholder/64/64',
        artist: track.artists.map((a: any) => a.name).join(', '),
        type: 'track'
      })),
      albums: albumsData.items.map((item: any) => ({
        id: item.album.id,
        name: item.album.name,
        image: item.album.images[0]?.url || '/api/placeholder/64/64',
        artist: item.album.artists.map((a: any) => a.name).join(', '),
        type: 'album',
        addedAt: item.added_at // This is unique to saved albums - we can show when they saved it
      }))
    };

    return NextResponse.json({
      topItems,
      recentTracks: {
        items: recentData.items.map((item: any) => ({
          track: {
            id: item.track.id,
            name: item.track.name,
            artists: item.track.artists.map((artist: any) => ({
              name: artist.name
            })),
            album: {
              images: item.track.album.images
            }
          },
          played_at: item.played_at
        }))
      },
      userProfile: {
        following: {
          total: followingData.artists.total
        },
        totalPlaylists: playlistsData.total,
        savedAlbums: albumsData.total,
        todayListeningTime // Add this new field
      }
    });

  } catch (error) {
    console.error('Stats API Error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch stats data' },
      { status: 500 }
    );
  }
}
