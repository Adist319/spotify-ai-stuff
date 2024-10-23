// hooks/useSpotifyUser.ts

import useSWR from 'swr';
import { SpotifyUser, CurrentlyPlaying } from '@/types/spotify';

interface SpotifyUserData extends SpotifyUser {
  currentTrack: {
    name: string;
    artist: string;
    album: string;
    albumArt: string;
    isPlaying: boolean;
  } | null;
  totalPlaylists: number;
  following: number;
  premium: boolean;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useSpotifyUser() {
  const { data, error, isLoading, mutate } = useSWR<SpotifyUserData>('/api/user', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds to keep currently playing track updated
    revalidateOnFocus: true,
  });

  return {
    user: data,
    isLoading,
    isError: error,
    mutate,
  };
}