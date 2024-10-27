// app/api/user/route.ts

export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import * as spotify from '@/lib/spotify';

export async function GET(request: Request) {
  try {
    const token = await getToken({ 
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (!token?.accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const accessToken = token.accessToken as string;

    // Fetch all user data in parallel
    const [profile, currentTrack, playlists, following] = await Promise.all([
      spotify.getCurrentUserProfile(accessToken),
      spotify.getCurrentlyPlaying(accessToken).catch(() => null),
      spotify.getUserPlaylists(accessToken),
      spotify.getFollowing(accessToken),
    ]);

    const userData = {
      ...profile,
      currentTrack: currentTrack?.item ? {
        name: currentTrack.item.name,
        artist: currentTrack.item.artists[0].name,
        album: currentTrack.item.album.name,
        albumArt: currentTrack.item.album.images[0]?.url,
        isPlaying: currentTrack.is_playing,
      } : null,
      totalPlaylists: playlists.total,
      following: following.artists.total,
      premium: profile.product === 'premium',
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}
