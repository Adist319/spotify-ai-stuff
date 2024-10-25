// components/stats/TopItemsList.tsx
import { ChevronRight, Play, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { TopItem, TopItemType } from '@/types/stats';
import { TopItemsListSkeleton } from './loading';

interface TopItemsListProps {
  items: TopItem[];
  type: TopItemType;
  onItemClick?: (item: TopItem) => void;
  onPlayClick?: (item: TopItem) => void;
  onAddClick?: (item: TopItem) => void;
  loading?: boolean;
  error?: string;
  showRank?: boolean;
  showPlayCount?: boolean;
  maxItems?: number;
  className?: string;
}

export function TopItemsList({
  items,
  type,
  onItemClick,
  onPlayClick,
  onAddClick,
  loading = false,
  error,
  showRank = true,
  showPlayCount = false,
  maxItems,
  className,
}: TopItemsListProps) {
  const displayItems = maxItems ? items.slice(0, maxItems) : items;

  if (loading) {
    return <TopItemsListSkeleton count={maxItems || items.length} showRank={showRank} />;
  }

  if (error) {
    return <div className="text-red-400 text-center py-4">{error}</div>;
  }

  return (
    <div className={cn("space-y-4", className)}>
      {displayItems.map((item, index) => (
        <div 
          key={item.id}
          className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors group"
        >
          <div 
            className="flex items-center gap-4 flex-1 cursor-pointer"
            onClick={() => onItemClick?.(item)}
          >
            {showRank && (
              <span className="text-lg font-medium text-zinc-500 w-6">
                {index + 1}
              </span>
            )}
            <img
              src={item.image}
              alt={item.name}
              className={`w-12 h-12 ${type === 'artist' ? 'rounded-full' : 'rounded'}`}
            />
            <div>
              <p className="font-medium text-white">{item.name}</p>
              <p className="text-sm text-zinc-400">
                {type === 'artist' 
                  ? item.genres?.join(', ')
                  : item.artist}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {onPlayClick && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="hover:bg-green-500 hover:text-black"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayClick(item);
                  }}
                >
                  <Play className="h-4 w-4" />
                </Button>
              )}
              {onAddClick && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="hover:bg-green-500 hover:text-black"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddClick(item);
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}