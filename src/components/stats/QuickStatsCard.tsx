// components/stats/QuickStatsCard.tsx
import { Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { QuickStatsSkeleton } from './loading';
import { StatItem } from './StatItem';
import type { QuickStat } from '@/types/stats';

interface QuickStatsCardProps {
  stats: QuickStat[];
  title?: string;
  loading?: boolean;
  error?: string;
  className?: string;
  columns?: 1 | 2;
  showDividers?: boolean;
}

export function QuickStatsCard({
  stats,
  title = "Quick Stats",
  loading = false,
  error,
  className,
  columns = 1,
  showDividers = false,
}: QuickStatsCardProps) {
  if (loading) {
    return <QuickStatsSkeleton columns={columns} />;
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
        <CardTitle className="flex items-center gap-2 text-white">
          <Sparkles className="h-5 w-5 text-green-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className={cn(
            "grid gap-4",
            columns === 2 && "grid-cols-2",
            showDividers && "divide-x divide-zinc-800"
          )}
        >
          {stats.map((stat) => (
            <StatItem 
              key={stat.id}
              icon={stat.icon as React.ReactNode}
              label={stat.label}
              value={stat.value}
              subLabel={stat.subLabel}
              onClick={stat.onClick}
              change={stat.change}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}