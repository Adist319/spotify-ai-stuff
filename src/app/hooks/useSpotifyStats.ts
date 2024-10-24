// hooks/useSpotifyStats.ts
import { useState, useCallback } from 'react';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import type { 
  SpotifyStatsResponse, 
  TopItem, 
  GenreData 
} from '@/types/stats';

const STATS_CACHE_TIME = 5 * 60 * 1000; // 5 minutes
const RETRY_COUNT = 3;

interface UseSpotifyStatsOptions {
  initialTimeRange?: string;
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
}

interface UseSpotifyStatsReturn {
  topItems: SpotifyStatsResponse['topItems'] | undefined;
  listeningActivity: SpotifyStatsResponse['listeningActivity'] | undefined;
  genreDistribution: SpotifyStatsResponse['genreDistribution'] | undefined;
  quickStats: SpotifyStatsResponse['quickStats'] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | undefined;
  refreshData: () => Promise<void>;
  selectedTimeRange: string;
  setTimeRange: (range: string) => void;
  isLoadingMore: boolean;
  loadMoreItems: (type: 'artists' | 'albums' | 'tracks') => Promise<void>;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('Failed to fetch stats data') as Error & { status?: number };
    error.status = res.status;
    const data = await res.json().catch(() => ({}));
    error.message = data.message || error.message;
    throw error;
  }
  return res.json();
};

export function useSpotifyStats({
  initialTimeRange = 'medium_term',
  revalidateOnFocus = true,
  revalidateOnReconnect = true,
}: UseSpotifyStatsOptions = {}): UseSpotifyStatsReturn {
  const { data: session } = useSession();
  const [selectedTimeRange, setSelectedTimeRange] = useState(initialTimeRange);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Construct the API URL with the time range
  const apiUrl = session?.user
    ? `/api/stats?timeRange=${selectedTimeRange}`
    : null;

  // Use SWR for data fetching
  const { 
    data, 
    error, 
    isLoading, 
    isValidating,
    mutate 
  } = useSWR<SpotifyStatsResponse>(
    apiUrl,
    fetcher,
    {
      revalidateOnFocus,
      revalidateOnReconnect,
      dedupingInterval: STATS_CACHE_TIME,
      onError: (err) => {
        console.error('Stats fetch error:', err);
      },
    }
  );

  // Handle time range changes
  const setTimeRange = useCallback(async (range: string) => {
    setSelectedTimeRange(range);
    // Optionally pre-fetch data for the new time range
    try {
      const newData = await fetcher(`/api/stats?timeRange=${range}`);
      mutate(newData, false); // Update cache without revalidation
    } catch (error) {
      console.error('Error pre-fetching data for new time range:', error);
    }
  }, [mutate]);

  // Handle loading more items
  const loadMoreItems = useCallback(async (
    type: 'artists' | 'albums' | 'tracks'
  ) => {
    if (!data || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const currentItems = data.topItems[type];
      const offset = currentItems.length;
      const response = await fetch(
        `/api/stats/${type}?timeRange=${selectedTimeRange}&offset=${offset}`
      );
      
      if (!response.ok) throw new Error('Failed to load more items');
      
      const newItems: TopItem[] = await response.json();
      
      // Update the cached data with new items
      await mutate({
        ...data,
        topItems: {
          ...data.topItems,
          [type]: [...currentItems, ...newItems],
        },
      }, false);
      
    } catch (error) {
      console.error(`Error loading more ${type}:`, error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [data, isLoadingMore, mutate, selectedTimeRange]);

  // Refresh data manually
  const refreshData = useCallback(async () => {
    try {
      await mutate();
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  }, [mutate]);

  return {
    topItems: data?.topItems,
    listeningActivity: data?.listeningActivity,
    genreDistribution: data?.genreDistribution,
    quickStats: data?.quickStats,
    isLoading: isLoading || isValidating,
    isError: !!error,
    error: error as Error | undefined,
    refreshData,
    selectedTimeRange,
    setTimeRange,
    isLoadingMore,
    loadMoreItems,
  };
}
