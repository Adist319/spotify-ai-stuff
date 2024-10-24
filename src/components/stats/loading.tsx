// components/stats/loading.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TopItemsListSkeleton({ count = 5, showRank = true }: { count: number; showRank?: boolean }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
          <div className="flex items-center gap-4">
            {showRank && (
              <Skeleton className="w-6 h-6 rounded-full" />
            )}
            <Skeleton className="w-12 h-12 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="w-32 h-4" />
              <Skeleton className="w-24 h-3" />
            </div>
          </div>
          <Skeleton className="w-16 h-8" />
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <Skeleton className="w-48 h-6" />
        <Skeleton className="w-64 h-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className={`w-full h-[${height}px]`} />
      </CardContent>
    </Card>
  );
}

export function GenreDistributionSkeleton() {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <Skeleton className="w-48 h-6" />
        <Skeleton className="w-64 h-4" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-12 h-4" />
              </div>
              <Skeleton className="w-full h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function QuickStatsSkeleton({ columns = 1 }: { columns?: 1 | 2 }) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <Skeleton className="w-32 h-6" />
      </CardHeader>
      <CardContent>
        <div className={`grid gap-4 ${columns === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="space-y-1 flex-1">
                <Skeleton className="w-20 h-4" />
                <Skeleton className="w-12 h-3" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}