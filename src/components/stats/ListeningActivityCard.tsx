// components/stats/ListeningActivityCard.tsx
import { BarChart2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { ChartSkeleton } from './loading';

// Updated to match Spotify's listening history data structure
interface ListeningHistoryPoint {
  hour?: string;       // For hourly breakdown
  day?: string;        // For daily breakdown
  date?: string;       // For longer-term views
  count: number;       // Number of tracks played
  duration?: number;   // Total listening time in ms
}

interface ListeningActivityCardProps {
  data: ListeningHistoryPoint[];
  title?: string;
  description?: string;
  height?: number;
  loading?: boolean;
  error?: string;
  className?: string;
  viewType?: 'hourly' | 'daily' | 'weekly' | 'monthly';
}

export function ListeningActivityCard({
  data,
  title = "Listening Activity",
  description = "Your listening patterns over time",
  height = 300,
  loading = false,
  error,
  className,
  viewType = 'daily'
}: ListeningActivityCardProps) {
  if (loading) {
    return <ChartSkeleton height={height} />;
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

  // Format data based on view type
  const formatXAxis = (value: string) => {
    switch (viewType) {
      case 'hourly':
        // Convert 24h format to 12h format
        const hour = parseInt(value);
        return `${hour % 12 || 12}${hour < 12 ? 'am' : 'pm'}`;
      case 'weekly':
        // Show short day names
        return value.slice(0, 3);
      case 'monthly':
        // Show date without year
        return value.split('-').slice(1, 2).join('/');
      default:
        return value;
    }
  };

  // Format tooltip values
  const formatTooltipValue = (value: number) => {
    if (viewType === 'hourly') {
      return `${value} tracks`;
    }
    // Convert minutes to hours if duration is available
    return `${Math.round(value / 60)} hrs`;
  };

  return (
    <Card className={cn("bg-zinc-900 border-zinc-800", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <BarChart2 className="h-5 w-5 text-green-500" />
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-zinc-400">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div style={{ height, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <XAxis 
                dataKey={viewType === 'hourly' ? 'hour' : viewType === 'daily' ? 'day' : 'date'}
                stroke="#71717a"
                tickLine={false}
                tickFormatter={formatXAxis}
                interval="preserveStartEnd"
              />
              <YAxis 
                stroke="#71717a"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${Math.round(value)}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#18181b',
                  border: '1px solid #27272a',
                  borderRadius: '0.5rem',
                  padding: '8px'
                }}
                formatter={(value: number) => [formatTooltipValue(value), 'Listening Time']}
                cursor={{ fill: '#3f3f46' }}
              />
              <Bar 
                dataKey="count"
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}