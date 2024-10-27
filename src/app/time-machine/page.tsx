"use client"

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Clock,
  ArrowLeft,
  Calendar,
  History,
  Play,
  Plus,
  ChevronRight,
  Timer,
  AlignLeft
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Image from 'next/image';

// Sample data - would be replaced with real Spotify data
const sampleListeningData = [
  { month: 'Jan', plays: 245 },
  { month: 'Feb', plays: 288 },
  { month: 'Mar', plays: 199 },
  { month: 'Apr', plays: 277 },
  { month: 'May', plays: 300 },
  { month: 'Jun', plays: 334 },
];

const sampleOnThisDay = [
  {
    title: "Once in a Lifetime",
    artist: "Talking Heads",
    album: "Remain in Light",
    year: 2023,
    image: "/api/placeholder/40/40"
  },
  {
    title: "Purple Rain",
    artist: "Prince",
    album: "Purple Rain",
    year: 2022,
    image: "/api/placeholder/40/40"
  },
  {
    title: "Heroes",
    artist: "David Bowie",
    album: "Heroes",
    year: 2021,
    image: "/api/placeholder/40/40"
  }
];

const MusicTimeMachine = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState(2024);

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
            <h1 className="text-4xl font-bold text-white">Time Machine</h1>
            <p className="text-zinc-400">Rediscover your musical journey</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Listening Activity Chart */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Timer className="h-5 w-5 text-green-500" />
                  Listening Activity
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Your listening patterns over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sampleListeningData}>
                      <XAxis 
                        dataKey="month" 
                        stroke="#71717a"
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="#71717a"
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#18181b',
                          border: '1px solid #27272a',
                          borderRadius: '0.5rem'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="plays" 
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* On This Day */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Calendar className="h-5 w-5 text-green-500" />
                  On This Day
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Songs you loved on this date in previous years
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleOnThisDay.map((track, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <Image
                          src={track.image}
                          alt={`${track.title} album art`}
                          width={40}
                          height={40}
                          className="rounded"
                        />
                        <div>
                          <p className="font-medium text-white">{track.title}</p>
                          <p className="text-sm text-zinc-400">{track.artist}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-zinc-500">{track.year}</span>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="opacity-0 group-hover:opacity-100 hover:bg-green-500 hover:text-black"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="opacity-0 group-hover:opacity-100 hover:bg-green-500 hover:text-black"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Time Travel */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Clock className="h-5 w-5 text-green-500" />
                  Time Travel
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Jump to a specific time in your musical journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[2024, 2023, 2022, 2021].map((year) => (
                    <Button 
                      key={year}
                      variant="outline" 
                      className={`w-full justify-between bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:border-green-500 transition-all duration-300 text-white ${
                        selectedYear === year ? 'border-green-500 bg-zinc-700' : ''
                      }`}
                      onClick={() => setSelectedYear(year)}
                    >
                      <span>{year}</span>
                      <ChevronRight className="h-4 w-4 text-green-500" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Genres */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <AlignLeft className="h-5 w-5 text-green-500" />
                  Top Genres
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Your most-played genres over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Rock', 'Electronic', 'Hip-Hop', 'Jazz'].map((genre, index) => (
                    <div 
                      key={genre} 
                      className="flex items-center justify-between text-zinc-300 p-2 rounded hover:bg-zinc-800"
                    >
                      <span>{genre}</span>
                      <div 
                        className="h-1.5 w-24 bg-zinc-800 rounded-full overflow-hidden"
                      >
                        <div 
                          className="h-full bg-green-500" 
                          style={{ width: `${100 - (index * 20)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicTimeMachine;
