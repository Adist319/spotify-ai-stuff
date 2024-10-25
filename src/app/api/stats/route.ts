// app/api/stats/route.ts
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { TopItem, TopItemsData, StatsError } from '@/types/stats';

export async function GET(req: Request) {
  try {
    const token = await getToken({ req });
    
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = new URL(req.url).searchParams;
    const timeRange = searchParams.get('timeRange') || 'medium_term';

    // Fetch data from Spotify API
    const [topArtists, topTracks, recentlyPlayed, userProfile, following, playlists] = await Promise.all([
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
      })
    ]);

    if (!topArtists.ok || !topTracks.ok || !recentlyPlayed.ok || 
        !userProfile.ok || !following.ok || !playlists.ok) {
      throw new Error('Failed to fetch data from Spotify');
    }

    const [
      artistsData,
      tracksData,
      recentData,
      profileData,
      followingData,
      playlistsData
    ] = await Promise.all([
      topArtists.json(),
      topTracks.json(),
      recentlyPlayed.json(),
      userProfile.json(),
      following.json(),
      playlists.json()
    ]);

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
      albums: [] // Spotify API doesn't provide top albums directly
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
        totalPlaylists: playlistsData.total
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