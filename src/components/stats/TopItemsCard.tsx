// components/stats/TopItemsCard.tsx
import React, { useState } from 'react';
import { Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TopItemsTabs } from './TopItemsTabs';
import type { TimeRange, TopItemsData } from '@/types/stats';
import { TopItemsListSkeleton } from './loading';

interface TopItemsCardProps {
  title?: string;
  timeRanges?: TimeRange[];
  defaultTimeRange?: string;
  onTimeRangeChange?: (range: 'short_term' | 'medium_term' | 'long_term') => void;
  data?: TopItemsData;
  loading?: boolean;
  error?: string;
  className?: string;
  showTimeRanges?: boolean;
}

export function TopItemsCard({
  title = "Your Top Music",
  timeRanges = [
    { value: 'short_term', label: '4 Weeks' },
    { value: 'medium_term', label: '6 Months' },
    { value: 'long_term', label: 'All Time' }
  ],
  defaultTimeRange = 'medium_term',
  onTimeRangeChange,
  data,
  loading = false,
  error,
  className,
  showTimeRanges = true,
}: TopItemsCardProps) {
  const [timeRange, setTimeRange] = useState(defaultTimeRange);

  const handleTimeRangeChange = (range: 'short_term' | 'medium_term' | 'long_term') => {
    setTimeRange(range);
    onTimeRangeChange?.(range);
  };

  if (loading) {
    return <TopItemsListSkeleton count={5} />;
  }

  if (error) {
    return (
      <Card className={cn("bg-zinc-900 border-zinc-800", className)}>
        <CardContent className="flex items-center justify-center p-6">
          <p className="text-red-400">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("bg-zinc-900 border-zinc-800", className)}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-white">
            <Trophy className="h-5 w-5 text-green-500" />
            {title}
          </CardTitle>
          {showTimeRanges && (
            <div className="flex gap-2">
              {timeRanges.map((range) => (
                <Button
                  key={range.value}
                  variant="outline"
                  size="sm"
                  className={`
                    ${timeRange === range.value 
                      ? 'bg-green-500 text-black border-green-500 hover:bg-green-400 hover:border-green-400' 
                      : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white hover:border-green-500'
                    }
                  `}
                  onClick={() => handleTimeRangeChange(range.value)}
                >
                  {range.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <TopItemsTabs timeRange={timeRange} data={data} />
      </CardContent>
    </Card>
  );
}
