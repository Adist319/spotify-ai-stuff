// components/stats/TopItemsTabs.tsx
import { Mic2, Disc3, Music } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TopItemsList } from './TopItemsList';
import type { TopItemsData } from '@/types/stats';

interface TopItemsTabsProps {
  timeRange: string;
  data?: TopItemsData;
}

export function TopItemsTabs({ timeRange, data }: TopItemsTabsProps) {
  return (
    <Tabs defaultValue="artists" className="w-full">
      <TabsList className="w-full justify-start bg-zinc-800 border border-zinc-700">
        <TabsTrigger 
          value="artists"
          className="data-[state=active]:bg-green-500 data-[state=active]:text-black"
        >
          <Mic2 className="h-4 w-4 mr-2" />
          Top Artists
        </TabsTrigger>
        <TabsTrigger 
          value="albums"
          className="data-[state=active]:bg-green-500 data-[state=active]:text-black"
        >
          <Disc3 className="h-4 w-4 mr-2" />
          Top Albums
        </TabsTrigger>
        <TabsTrigger 
          value="tracks"
          className="data-[state=active]:bg-green-500 data-[state=active]:text-black"
        >
          <Music className="h-4 w-4 mr-2" />
          Top Tracks
        </TabsTrigger>
      </TabsList>

      <TabsContent value="artists" className="mt-6">
        <TopItemsList items={data?.artists || []} type="artist" />
      </TabsContent>

      <TabsContent value="albums" className="mt-6">
        <TopItemsList items={data?.albums || []} type="album" />
      </TabsContent>

      <TabsContent value="tracks" className="mt-6">
        <TopItemsList items={data?.tracks || []} type="track" />
      </TabsContent>
    </Tabs>
  );
}