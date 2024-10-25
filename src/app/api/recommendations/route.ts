import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { SpotifyTrack, SpotifyError } from '@/types/spotify';

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req: req as any });
    if (!token?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const seed_tracks = searchParams.get('seed_tracks');
    const seed_artists = searchParams.get('seed_artists');
    const seed_genres = searchParams.get('seed_genres');

    const response = await fetch(
      `https://api.spotify.com/v1/recommendations?${new URLSearchParams({
        seed_tracks: seed_tracks || '',
        seed_artists: seed_artists || '',
        seed_genres: seed_genres || '',
        limit: '10'
      })}`,
      {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json() as SpotifyError;
      throw new Error(error.error.message);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Recommendations API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}
