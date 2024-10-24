// components/stats/StatItem.tsx
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subLabel?: string;
  onClick?: () => void;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
}

export function StatItem({
  icon,
  label,
  value,
  subLabel,
  onClick,
  change,
}: StatItemProps) {
  return (
    <div 
      className={cn(
        "flex items-center gap-3 p-3 bg-zinc-800 rounded-lg",
        onClick && "cursor-pointer hover:bg-zinc-700 transition-colors"
      )}
      onClick={onClick}
    >
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-zinc-400 truncate">{label}</p>
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold text-white">{value}</p>
          {change && (
            <div 
              className={cn(
                "flex items-center text-xs",
                change.trend === 'up' && "text-green-500",
                change.trend === 'down' && "text-red-500",
                change.trend === 'neutral' && "text-zinc-500"
              )}
            >
              {change.trend === 'up' && <ArrowUp className="h-3 w-3" />}
              {change.trend === 'down' && <ArrowDown className="h-3 w-3" />}
              {change.trend === 'neutral' && <Minus className="h-3 w-3" />}
              <span>{Math.abs(change.value)}%</span>
            </div>
          )}
        </div>
        {subLabel && (
          <p className="text-xs text-zinc-500 truncate">{subLabel}</p>
        )}
      </div>
    </div>
  );
}
