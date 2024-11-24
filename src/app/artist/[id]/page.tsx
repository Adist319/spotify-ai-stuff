'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import {
  Users,
  Play,
  Music2,
  Clock,
  ExternalLink,
  Disc3,
  Radio,
  BarChart3,
  Loader2,
  ChevronLeft,
  ArrowLeft
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { useSpotify } from '@/hooks/useSpotify';
import { Artist, TopTracks, RelatedArtists, Albums } from '@/types/artist';

export const dynamic = 'force-dynamic';

export default function ArtistPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { isReady, isLoading } = useSpotify();
  const [artist, setArtist] = React.useState<Artist | null>(null);
  const [topTracks, setTopTracks] = React.useState<TopTracks | null>(null);
  const [albums, setAlbums] = React.useState<Albums | null>(null);
  const [relatedArtists, setRelatedArtists] = React.useState<RelatedArtists | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchArtistData = async () => {
      if (!session?.user?.accessToken || !id) return;
      
      try {
        setLoading(true);
        setError(null);

        // Fetch artist data in parallel
        const [artistData, tracksData, albumsData, relatedData] = await Promise.all([
          fetch(`/api/artist/${id}`).then(res => res.json()),
          fetch(`/api/artist/${id}/top-tracks`).then(res => res.json()),
          fetch(`/api/artist/${id}/albums`).then(res => res.json()),
          fetch(`/api/artist/${id}/related`).then(res => res.json())
        ]);

        setArtist(artistData);
        setTopTracks(tracksData);
        setAlbums(albumsData);
        setRelatedArtists(relatedData);
      } catch (err) {
        console.error('Error fetching artist data:', err);
        setError('Failed to load artist data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchArtistData();
  }, [id, session]);

  if (!session) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <div className="container mx-auto px-6 py-8">
          <p className="text-center text-white">Please sign in to view artist details.</p>
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
            <h1 className="text-4xl font-bold text-white">{artist?.name || 'Artist'}</h1>
            <p className="text-zinc-400">View artist details and top tracks</p>
          </div>
        </div>
        {loading || !artist ? (
          <ArtistPageSkeleton />
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="space-y-8">
            {/* Artist Header */}
            <header className="relative">
              {artist.images?.[0] && (
                <div className="absolute inset-0 opacity-30 blur-xl">
                  <Image
                    src={artist.images[0].url}
                    alt={artist.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 p-8">
                <div className="w-48 h-48 relative rounded-full overflow-hidden">
                  <Image
                    src={artist.images?.[0]?.url || '/api/placeholder/192/192'}
                    alt={artist.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">{artist.name}</h1>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                    {artist.genres?.map((genre) => (
                      <span
                        key={genre}
                        className="px-3 py-1 rounded-full bg-zinc-800 text-sm text-white"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start items-center text-sm text-white">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {artist.followers?.total.toLocaleString()} followers
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      {artist.popularity}% popularity
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button
                    size="lg"
                    className="bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold"
                    onClick={() => window.open(artist.external_urls?.spotify, '_blank')}
                  >
                    <Play className="w-5 h-5 mr-2 text-white" />
                    Play on Spotify
                  </Button>
                </div>
              </div>
            </header>

            {/* Content Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Top Tracks */}
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music2 className="h-5 w-5 text-[#1DB954]" />
                    Top Tracks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {topTracks?.tracks?.map((track, index) => (
                        <div
                          key={track.id}
                          className="flex items-center gap-4 p-2 rounded-lg hover:bg-zinc-800/50 transition-colors group"
                        >
                          <span className="w-6 text-center text-sm text-white">
                            {index + 1}
                          </span>
                          <Image
                            src={track.album.images[2]?.url || '/api/placeholder/40/40'}
                            alt={track.name}
                            width={40}
                            height={40}
                            className="rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-white truncate">
                              {track.name}
                            </p>
                            <p className="text-sm text-white truncate">
                              {track.album.name}
                            </p>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="opacity-0 group-hover:opacity-100 text-white hover:text-white"
                            onClick={() => window.open(track.external_urls.spotify, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Related Artists */}
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Radio className="h-5 w-5 text-[#1DB954]" />
                    Related Artists
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="grid grid-cols-2 gap-4">
                      {relatedArtists?.artists?.map((artist) => (
                        <a
                          key={artist.id}
                          href={`/artist/${artist.id}`}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/50 transition-colors"
                        >
                          <Image
                            src={artist.images[2]?.url || '/api/placeholder/40/40'}
                            alt={artist.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-white truncate">
                              {artist.name}
                            </p>
                            <p className="text-sm text-white">
                              {artist.followers?.total.toLocaleString()} followers
                            </p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Discography */}
              <Card className="bg-zinc-900 border-zinc-800 md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Disc3 className="h-5 w-5 text-[#1DB954]" />
                    Discography
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {albums?.items?.map((album) => (
                        <a
                          key={album.id}
                          href={album.external_urls.spotify}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group"
                        >
                          <div className="relative aspect-square mb-2">
                            <Image
                              src={album.images[0]?.url || '/api/placeholder/300/300'}
                              alt={album.name}
                              fill
                              className="object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                              <Play className="w-12 h-12 text-white" />
                            </div>
                          </div>
                          <p className="font-medium text-white truncate">
                            {album.name}
                          </p>
                          <p className="text-sm text-white">
                            {new Date(album.release_date).getFullYear()} • {album.album_type}
                          </p>
                        </a>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ArtistPageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center gap-8 p-8">
        <Skeleton className="w-48 h-48 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-12 w-64 mb-4" />
          <div className="flex gap-2 mb-4">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <Skeleton className="h-[500px]" />
        <Skeleton className="h-[500px]" />
        <Skeleton className="h-[500px] md:col-span-2" />
      </div>
    </div>
  );
}
