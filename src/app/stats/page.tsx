// app/stats/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  ArrowLeft, 
  Clock, 
  Music2, 
  Disc, 
  Globe, 
  Mic2,
  PlayCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import { TopItemsCard } from '@/components/stats/TopItemsCard';
import { ListeningActivityCard } from '@/components/stats/ListeningActivityCard';
import { GenreDistributionCard } from '@/components/stats/GenreDistributionCard';
import { QuickStatsCard } from '@/components/stats/QuickStatsCard';
import { useSpotifyStats } from '@/app/hooks/useSpotifyStats';
import type { TimeRange } from '@/types/stats';

const timeRanges: TimeRange[] = [
  { value: 'short_term', label: '4 Weeks' },
  { value: 'medium_term', label: '6 Months' },
  { value: 'long_term', label: 'All Time' }
];

export default function StatsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('medium_term');

  const {
    topItems,
    listeningActivity,
    genreDistribution,
    quickStats,
    isLoading,
    error,
    refreshData
  } = useSpotifyStats(selectedTimeRange);

  // Handle time range change
  const handleTimeRangeChange = (range: string) => {
    setSelectedTimeRange(range);
  };

  // Handle item clicks
  const handleItemClick = (item: any) => {
    if (item.type === 'artist') {
      router.push(`/artist/${item.id}`);
    } else if (item.type === 'album') {
      router.push(`/album/${item.id}`);
    } else if (item.type === 'track') {
      router.push(`/track/${item.id}`);
    }
  };

  // Handle genre click
  const handleGenreClick = (genre: any) => {
    router.push(`/genre/${genre.id}`);
  };

  // Quick stats configuration
  const statsConfig = [
    {
      id: 'listening-time',
      icon: <Clock className="h-4 w-4 text-green-500" />,
      label: "Hours This Week",
      value: quickStats?.weeklyHours || 0,
      change: quickStats?.weeklyHoursChange,
    },
    {
      id: 'tracks-played',
      icon: <Music2 className="h-4 w-4 text-green-500" />,
      label: "Tracks Played",
      value: quickStats?.tracksPlayed || 0,
      change: quickStats?.tracksPlayedChange,
    },
    {
      id: 'unique-artists',
      icon: <Mic2 className="h-4 w-4 text-green-500" />,
      label: "Unique Artists",
      value: quickStats?.uniqueArtists || 0,
    },
    {
      id: 'total-albums',
      icon: <Disc className="h-4 w-4 text-green-500" />,
      label: "Albums Played",
      value: quickStats?.albumsPlayed || 0,
    },
    {
      id: 'countries',
      icon: <Globe className="h-4 w-4 text-green-500" />,
      label: "Countries",
      value: quickStats?.countriesRepresented || 0,
      subLabel: "Artist origins",
    },
    {
      id: 'playtime',
      icon: <PlayCircle className="h-4 w-4 text-green-500" />,
      label: "Total Playtime",
      value: quickStats?.totalPlaytime || '0h',
      subLabel: "This month",
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/')}
            className="rounded-full hover:bg-zinc-800"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-white">Your Stats</h1>
            <p className="text-zinc-400">Discover insights about your listening habits</p>
          </div>
        </div>

        {error ? (
          <div className="rounded-lg bg-red-500/10 border border-red-500 p-4 text-red-400">
            {error.message}
          </div>
        ) : (
          <>
            {/* Top Items Section */}
            <div className="mb-8">
              <TopItemsCard
                timeRanges={timeRanges}
                defaultTimeRange={selectedTimeRange}
                onTimeRangeChange={handleTimeRangeChange}
                data={topItems}
                loading={isLoading}
                onItemClick={handleItemClick}
              />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Listening Activity */}
                <ListeningActivityCard
                  data={listeningActivity}
                  loading={isLoading}
                  xAxisLabel="Day"
                  yAxisLabel="Hours"
                />

                {/* Genre Distribution */}
                <GenreDistributionCard
                  data={genreDistribution}
                  loading={isLoading}
                  onGenreClick={handleGenreClick}
                  showTrackCount
                />
              </div>

              {/* Sidebar Stats */}
              <div className="space-y-6">
                {/* Quick Stats Upper */}
                <QuickStatsCard
                  stats={statsConfig.slice(0, 3)}
                  loading={isLoading}
                  columns={1}
                />

                {/* Quick Stats Lower */}
                <QuickStatsCard
                  stats={statsConfig.slice(3)}
                  title="More Insights"
                  loading={isLoading}
                  columns={1}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// hooks/useSpotifyStats.ts
import useSWR from 'swr';
import type { TopItemsData, ChartDataPoint, GenreData, QuickStat } from '@/types/stats';

interface SpotifyStatsResponse {
  topItems: TopItemsData;
  listeningActivity: ChartDataPoint[];
  genreDistribution: GenreData[];
  quickStats: {
    weeklyHours: number;
    weeklyHoursChange: { value: number; trend: 'up' | 'down' | 'neutral' };
    tracksPlayed: number;
    tracksPlayedChange: { value: number; trend: 'up' | 'down' | 'neutral' };
    uniqueArtists: number;
    albumsPlayed: number;
    countriesRepresented: number;
    totalPlaytime: string;
  };
}
