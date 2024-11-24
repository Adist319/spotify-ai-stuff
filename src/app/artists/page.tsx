'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import Image from 'next/image';
import { Search, Users, BarChart3, ArrowLeft } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import debounce from 'lodash/debounce';
import { Artist } from '@/types/artist';

export const dynamic = 'force-dynamic';

export default function ArtistsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [loadingTopArtists, setLoadingTopArtists] = useState(true);
  const [timeRange, setTimeRange] = useState<'short_term' | 'medium_term' | 'long_term'>('medium_term');

  useEffect(() => {
    if (session?.user?.accessToken) {
      setLoadingTopArtists(true);
      fetchTopArtists();
    }
  }, [session, timeRange]);

  const fetchTopArtists = async () => {
    try {
      if (!session?.user?.accessToken) {
        throw new Error('No access token available');
      }

      const response = await fetch(`/api/me/top-artists?time_range=${timeRange}`);
      if (response.status === 401) {
        await signIn('spotify');
        return;
      }
      
      if (!response.ok) throw new Error('Failed to fetch top artists');
      const data = await response.json();
      setTopArtists(data.items);
    } catch (error) {
      console.error('Error fetching top artists:', error);
      setTopArtists([]);
    } finally {
      setLoadingTopArtists(false);
    }
  };

  const searchArtists = async (query: string) => {
    try {
      if (!session?.user?.accessToken) {
        throw new Error('No access token available');
      }

      const response = await fetch(`/api/search/artists?q=${encodeURIComponent(query)}`);
      if (response.status === 401) {
        await signIn('spotify');
        return;
      }

      if (!response.ok) throw new Error('Failed to search artists');
      const data = await response.json();
      setArtists(data.artists.items);
    } catch (error) {
      console.error('Error searching artists:', error);
      setArtists([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = debounce(searchArtists, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const navigateToArtist = (artistId: string) => {
    router.push(`/artist/${artistId}`);
  };

  const renderArtistCard = (artist: Artist) => (
    <Card
      key={artist.id}
      className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900 transition-colors cursor-pointer p-4"
      onClick={() => navigateToArtist(artist.id)}
    >
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16">
          <Image
            src={artist.images[0]?.url || '/api/placeholder/64/64'}
            alt={artist.name}
            fill
            className="object-cover rounded-full"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white truncate">{artist.name}</h3>
          <div className="flex items-center gap-4 text-sm text-zinc-400">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {artist.followers.total.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <BarChart3 className="w-3 h-3" />
              {artist.popularity}%
            </span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {artist.genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="px-2 py-0.5 rounded-full bg-zinc-800 text-xs text-zinc-300"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );

  if (!session) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <div className="container mx-auto px-6 py-8">
          <p className="text-center text-zinc-400">Please sign in to explore artists.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full hover:bg-zinc-800"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-white">Artists</h1>
            <p className="text-zinc-400">Explore your favorite artists</p>
          </div>
        </div>
        <div className="flex flex-col space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Explore Artists</h2>
            <p className="text-zinc-400">
              Search for any artist to dive deep into their music, stats, and more.
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              type="text"
              placeholder="Search artists..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 bg-zinc-900 border-zinc-800"
            />
          </div>

          <div className="space-y-6">
            {searchQuery ? (
              <div>
                <h2 className="text-xl font-semibold mb-4">Search Results</h2>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Card key={i} className="bg-zinc-900/50 border-zinc-800 p-4">
                        <div className="flex items-center gap-4">
                          <Skeleton className="w-16 h-16 rounded-full" />
                          <div className="flex-1">
                            <Skeleton className="h-4 w-48 mb-2" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : artists.length > 0 ? (
                  <div className="space-y-4">
                    {artists.map(renderArtistCard)}
                  </div>
                ) : (
                  <p className="text-center text-zinc-400">No artists found.</p>
                )}
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Your Top Artists</h2>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => setTimeRange('short_term')}
                      className={`${
                        timeRange === 'short_term'
                          ? 'bg-[#1DB954] text-black hover:bg-[#1ed760] hover:text-black'
                          : 'bg-zinc-900 text-white hover:bg-zinc-800'
                      }`}
                    >
                      Last 4 Weeks
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setTimeRange('medium_term')}
                      className={`${
                        timeRange === 'medium_term'
                          ? 'bg-[#1DB954] text-black hover:bg-[#1ed760] hover:text-black'
                          : 'bg-zinc-900 text-white hover:bg-zinc-800'
                      }`}
                    >
                      Last 6 Months
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setTimeRange('long_term')}
                      className={`${
                        timeRange === 'long_term'
                          ? 'bg-[#1DB954] text-black hover:bg-[#1ed760] hover:text-black'
                          : 'bg-zinc-900 text-white hover:bg-zinc-800'
                      }`}
                    >
                      All Time
                    </Button>
                  </div>
                </div>
                {loadingTopArtists ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Card key={i} className="bg-zinc-900/50 border-zinc-800 p-4">
                        <div className="flex items-center gap-4">
                          <Skeleton className="w-16 h-16 rounded-full" />
                          <div className="flex-1">
                            <Skeleton className="h-4 w-48 mb-2" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : topArtists.length > 0 ? (
                  <div className="space-y-4">
                    {topArtists.map(renderArtistCard)}
                  </div>
                ) : (
                  <p className="text-center text-zinc-400">No top artists found.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
