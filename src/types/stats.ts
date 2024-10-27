// types/stats.ts
import { LucideIcon } from 'lucide-react';

// src/types/stats.ts
export interface TopItem {
  id: string;
  name: string;
  image: string;
  artist?: string;
  genres?: string[];
  type?: 'artist' | 'album' | 'track';
  addedAt?: string;
  releaseDate?: string;
}

export interface TimeRange {
  value: 'short_term' | 'medium_term' | 'long_term';
  label: string;
}

export interface QuickStat {
  id: string;
  icon: LucideIcon | React.ReactNode;
  label: string;
  value: string | number;
  subLabel?: string;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
}

export type TopItemType = 'artist' | 'album' | 'track';

export interface TopItemsData {
  artists: TopItem[];
  albums: TopItem[];
  tracks: TopItem[];
}

// Component Props Types
export interface TopItemsCardProps {
  title?: string;
  timeRanges?: TimeRange[];
  defaultTimeRange?: string;
  onTimeRangeChange?: (range: string) => void;
  data?: TopItemsData;
  loading?: boolean;
  error?: string;
  className?: string;
  showTimeRanges?: boolean;
}

export interface StatsError {
  message: string;
  code?: string;
  status?: number;
}

export interface RecentTrack {
  track: {
    id: string;
    name: string;
    artists: Array<{ name: string }>;
    album: {
      images: Array<{ url: string }>;
    };
  };
  played_at: string;
}

export interface UserProfile {
  following?: {
    total: number;
  };
  totalPlaylists?: number;
  todayListeningTime?: number; // in minutes
}

// Hook Types
export interface UseSpotifyStatsOptions {
  timeRange: 'short_term' | 'medium_term' | 'long_term';
}

export interface UseSpotifyStatsReturn {
  topItems?: TopItemsData;
  recentTracks?: {
    items: RecentTrack[];
  };
  userProfile?: UserProfile;
  isLoading: boolean;
  error?: StatsError;
}

// Constants
export const TIME_RANGES = {
  SHORT_TERM: 'short_term',
  MEDIUM_TERM: 'medium_term',
  LONG_TERM: 'long_term',
} as const;

// Add to existing interfaces
export interface ListeningStats {
  totalMinutes: number;
  previousTotalMinutes?: number; // For comparison
  percentageChange?: number;
}

export interface GenreData {
  id: string;
  name: string;
  value: number;
  numberOfTracks?: number;
  color?: string;
}
