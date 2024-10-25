// app/stats/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  ArrowLeft, 
  Mic2, 
  ListMusic,
  Users,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import { TopItemsCard } from '@/components/stats/TopItemsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  const [selectedTimeRange, setSelectedTimeRange] = useState<'short_term' | 'medium_term' | 'long_term'>('medium_term');

  const {
    topItems,
    recentTracks,
    userProfile,
    isLoading,
    error,
  } = useSpotifyStats({ timeRange: selectedTimeRange });

  // Quick stats that we can reliably get from the Spotify API
  const quickStats = [
    {
      id: 'following',
      icon: <Users className="h-4 w-4 text-green-500" />,
      label: "Following",
      value: userProfile?.following?.total || 0,
      subLabel: "Artists"
    },
    {
      id: 'playlists',
      icon: <ListMusic className="h-4 w-4 text-green-500" />,
      label: "Playlists",
      value: userProfile?.totalPlaylists || 0
    },
    {
      id: 'recent',
      icon: <Clock className="h-4 w-4 text-green-500" />,
      label: "Recently Played",
      value: recentTracks?.items?.length || 0,
      subLabel: "Last 24 hours"
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
            <p className="text-zinc-400">See your top music and listening activity</p>
          </div>
        </div>

        {error ? (
          <div className="rounded-lg bg-red-500/10 border border-red-500 p-4 text-red-400">
            {error.message}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              {quickStats.map((stat) => (
                <Card key={stat.id} className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      {stat.icon}
                      <div>
                        <p className="text-sm text-zinc-400">{stat.label}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        {stat.subLabel && (
                          <p className="text-xs text-zinc-500">{stat.subLabel}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Top Items */}
            <TopItemsCard
              timeRanges={timeRanges}
              defaultTimeRange={selectedTimeRange}
              onTimeRangeChange={setSelectedTimeRange}
              data={topItems}
              loading={isLoading}
            />

            {/* Recent Tracks */}
            {recentTracks?.items?.length > 0 && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Clock className="h-5 w-5 text-green-500" />
                    Recently Played
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTracks.items.slice(0, 5).map((track: any) => (
                      <div 
                        key={`${track.track.id}-${track.played_at}`}
                        className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={track.track.album.images[2]?.url || '/api/placeholder/40/40'}
                            alt={track.track.name}
                            className="w-10 h-10 rounded"
                          />
                          <div>
                            <p className="font-medium text-white">{track.track.name}</p>
                            <p className="text-sm text-zinc-400">
                              {track.track.artists.map((a: any) => a.name).join(', ')}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-zinc-500">
                          {new Date(track.played_at).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}