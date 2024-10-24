// types/stats.ts
import { LucideIcon } from 'lucide-react';

export interface TopItem {
  id: string;
  name: string;
  image: string;
  plays: number;
  artist?: string;
  genres?: string[];
  url?: string;
  type?: 'artist' | 'album' | 'track';
  duration?: number;
  previewUrl?: string;
  popularity?: number;
  albumName?: string;
  artistId?: string;
  albumId?: string;
  isPlayable?: boolean;
  isExplicit?: boolean;
  addedAt?: string;
}

export interface TimeRange {
  value: string;
  label: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  additionalData?: Record<string, any>;
}

export interface GenreData {
  id: string;
  name: string;
  value: number;
  color?: string;
  numberOfTracks?: number;
}

export interface QuickStat {
  id: string;
  icon: LucideIcon | React.ReactNode;
  label: string;
  value: string | number;
  subLabel?: string;
  onClick?: () => void;
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
  timeRange: string;
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

export interface ListeningActivityCardProps {
  data: ChartDataPoint[];
  title?: string;
  description?: string;
  height?: number;
  loading?: boolean;
  error?: string;
  onBarClick?: (data: ChartDataPoint) => void;
  className?: string;
  yAxisLabel?: string;
  xAxisLabel?: string;
  barColor?: string;
  showTooltip?: boolean;
}

export interface GenreDistributionCardProps {
  data: GenreData[];
  title?: string;
  description?: string;
  loading?: boolean;
  error?: string;
  onGenreClick?: (genre: GenreData) => void;
  className?: string;
  showPercentage?: boolean;
  showTrackCount?: boolean;
  maxGenres?: number;
}

export interface QuickStatsCardProps {
  stats: QuickStat[];
  title?: string;
  loading?: boolean;
  error?: string;
  className?: string;
  columns?: 1 | 2;
  showDividers?: boolean;
}

// Stats Response Types
export interface StatsError {
  message: string;
  code?: string;
  status?: number;
}

export interface SpotifyStatsResponse {
  topItems: TopItemsData;
  listeningActivity: ChartDataPoint[];
  genreDistribution: GenreData[];
  quickStats: QuickStatsData;
}

export interface QuickStatsData {
  weeklyHours: number;
  weeklyHoursChange: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  tracksPlayed: number;
  tracksPlayedChange: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  uniqueArtists: number;
  albumsPlayed: number;
  countriesRepresented: number;
  totalPlaytime: string;
  avgTracksPerDay?: number;
  favoriteTimeOfDay?: string;
  topGenre?: string;
}

// Hook Types
export interface UseSpotifyStatsOptions {
  initialTimeRange?: string;
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
  refreshInterval?: number;
}

export interface UseSpotifyStatsReturn {
  topItems: TopItemsData | undefined;
  listeningActivity: ChartDataPoint[] | undefined;
  genreDistribution: GenreData[] | undefined;
  quickStats: QuickStatsData | undefined;
  isLoading: boolean;
  isError: boolean;
  error: StatsError | null;
  refreshData: () => Promise<void>;
  selectedTimeRange: string;
  setTimeRange: (range: string) => void;
  isLoadingMore: boolean;
  loadMoreItems: (type: TopItemType) => Promise<void>;
}

// Filter and Sort Types
export interface StatsFilters {
  timeRange: string;
  limit?: number;
  offset?: number;
  includeAudioFeatures?: boolean;
}

export interface SortOption {
  value: string;
  label: string;
  sortFn: (a: TopItem, b: TopItem) => number;
}

// Additional Utility Types
export interface TimeFrameStats {
  start: string;
  end: string;
  totalTracks: number;
  uniqueArtists: number;
  totalDuration: number;
  topGenres: GenreData[];
}

export interface AudioFeatures {
  danceability: number;
  energy: number;
  key: number;
  loudness: number;
  mode: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  tempo: number;
  duration_ms: number;
  time_signature: number;
}

export interface HistoricalStats {
  date: string;
  stats: {
    tracksPlayed: number;
    uniqueArtists: number;
    totalDuration: number;
    topGenres: GenreData[];
  };
}

// Constants
export const TIME_RANGES = {
  SHORT_TERM: 'short_term',
  MEDIUM_TERM: 'medium_term',
  LONG_TERM: 'long_term',
} as const;

export const CHART_COLORS = {
  primary: '#22c55e',
  secondary: '#71717a',
  background: '#18181b',
  border: '#27272a',
  hover: '#3f3f46',
} as const;