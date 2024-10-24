// components/stats/GenreDistributionCard.tsx
import { Radio } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { GenreDistributionSkeleton } from './loading';
import type { GenreData } from '@/types/stats';

interface GenreDistributionCardProps {
  data?: GenreData[]; // Make data optional
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

export function GenreDistributionCard({
  data = [], // Provide empty array as default
  title = "Genre Distribution",
  description = "Your most listened to music genres",
  loading = false,
  error,
  onGenreClick,
  className,
  showPercentage = true,
  showTrackCount = false,
  maxGenres,
}: GenreDistributionCardProps) {
  // Add null check before applying slice
  const displayData = data && maxGenres ? data.slice(0, maxGenres) : data;

  if (loading) {
    return <GenreDistributionSkeleton />;
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

  // Add empty state
  if (!displayData || displayData.length === 0) {
    return (
      <Card className={cn("bg-zinc-900 border-zinc-800", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Radio className="h-5 w-5 text-green-500" />
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-zinc-400">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="flex items-center justify-center p-6">
          <p className="text-zinc-500">No genre data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("bg-zinc-900 border-zinc-800", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Radio className="h-5 w-5 text-green-500" />
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-zinc-400">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayData.map((genre) => (
            <div 
              key={genre.id} 
              className="space-y-2 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => onGenreClick?.(genre)}
            >
              <div className="flex justify-between text-sm">
                <span className="text-zinc-300">{genre.name}</span>
                <div className="flex items-center gap-4">
                  {showTrackCount && genre.numberOfTracks && (
                    <span className="text-zinc-500">
                      {genre.numberOfTracks} tracks
                    </span>
                  )}
                  {showPercentage && (
                    <span className="text-zinc-400">{genre.value}%</span>
                  )}
                </div>
              </div>
              <Progress 
                value={genre.value} 
                className={cn(
                  "h-2",
                  genre.color && `[&>div]:bg-[${genre.color}]`
                )}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}