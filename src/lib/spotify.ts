// lib/spotify.ts

import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { Session } from "next-auth";

const SPOTIFY_API = 'https://api.spotify.com/v1';

async function getAccessToken(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  return token?.accessToken as string;
}

interface SpotifyClient {
  get: (endpoint: string) => Promise<Response>;
  post: (endpoint: string, body?: any) => Promise<Response>;
}

export async function getSpotifyClient(session: Session): Promise<SpotifyClient | null> {
  if (!session?.user || !(session.user as any).accessToken) {
    return null;
  }

  const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${SPOTIFY_API}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${(session.user as any).accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (response.status === 401) {
      // Token expired, trigger refresh on client side
      throw new Error('Token expired');
    }

    return response;
  };

  return {
    get: (endpoint: string) => makeRequest(endpoint),
    post: (endpoint: string, body?: any) => 
      makeRequest(endpoint, {
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
      }),
  };
}

async function spotifyFetch(endpoint: string, accessToken: string) {
  const res = await fetch(`${SPOTIFY_API}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error.message);
  }

  return res.json();
}

export async function getCurrentUserProfile(accessToken: string) {
  return spotifyFetch('/me', accessToken);
}

export async function getCurrentlyPlaying(accessToken: string) {
  return spotifyFetch('/me/player/currently-playing', accessToken);
}

export async function getUserPlaylists(accessToken: string) {
  return spotifyFetch('/me/playlists', accessToken);
}

export async function getFollowing(accessToken: string) {
  return spotifyFetch('/me/following?type=artist', accessToken);
}