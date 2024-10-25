import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import type { SpotifyTrack } from '@/types/spotify';

interface RecommendationResponse {
  tracks: SpotifyTrack[];
  error?: string;
}

export function useSpotifyRecommendations(seeds?: {
  trackIds?: string[];
  artistIds?: string[];
  genres?: string[];
}) {
  const { data: session } = useSession();

  return useSWR<RecommendationResponse>(
    seeds && session ? 
      `/api/recommendations?${new URLSearchParams({
        seed_tracks: seeds.trackIds?.join(',') || '',
        seed_artists: seeds.artistIds?.join(',') || '',
        seed_genres: seeds.genres?.join(',') || ''
      })}` : 
      null,
    {
      revalidateOnFocus: false
    }
  );
}