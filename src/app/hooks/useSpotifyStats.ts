// hooks/useSpotifyStats.ts
import useSWR from 'swr';
import type { UseSpotifyStatsOptions, UseSpotifyStatsReturn } from '@/types/stats';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('Failed to fetch stats data') as Error & { status?: number };
    error.status = res.status;
    throw error;
  }
  return res.json();
};

export function useSpotifyStats({ timeRange }: UseSpotifyStatsOptions): UseSpotifyStatsReturn {
  const { data, error, isLoading } = useSWR(
    `/api/stats?timeRange=${timeRange}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 30000, // Refresh every 30 seconds
    }
  );

  return {
    topItems: data?.topItems,
    recentTracks: data?.recentTracks,
    userProfile: data?.userProfile,
    isLoading,
    error: error ? {
      message: error.message,
      status: error.status
    } : undefined
  };
}