// lib/spotify.ts

import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

const SPOTIFY_API = 'https://api.spotify.com/v1';

async function getAccessToken(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  return token?.accessToken as string;
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