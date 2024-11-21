'use client';

import React from 'react';
import Image from 'next/image';
import { ExternalLink, Music2, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PlaylistResultProps {
  playlistId: string;
  tracks: SpotifyTrack[];
  moodDescription?: string;
  contextualNotes?: string;
  onClose: () => void;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  external_urls: {
    spotify: string;
  };
  moodContribution?: string;
}

export function PlaylistResult({
  playlistId,
  tracks,
  moodDescription,
  contextualNotes,
  onClose,
}: PlaylistResultProps) {
  const openInSpotify = () => {
    window.open(`https://open.spotify.com/playlist/${playlistId}`, '_blank');
  };

  return (
    <Card className="w-full bg-zinc-900 border-zinc-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-white">Playlist Generated!</CardTitle>
            <CardDescription className="text-zinc-400 mt-2">
              {moodDescription && (
                <p className="text-green-400 font-medium mb-1">{moodDescription}</p>
              )}
              {contextualNotes && <p>{contextualNotes}</p>}
            </CardDescription>
          </div>
          <Button
            onClick={openInSpotify}
            className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in Spotify
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {tracks.map((track, index) => (
              <div
                key={`${track.id}-${index}`}
                className="flex flex-col gap-2 p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 group transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                      src={track.album.images[2]?.url || '/api/placeholder/48/48'}
                      alt={track.album.name}
                      width={48}
                      height={48}
                      className="rounded"
                    />
                    <a
                      href={track.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded"
                    >
                      <PlayCircle className="h-6 w-6 text-white" />
                    </a>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{track.name}</p>
                    <p className="text-sm text-zinc-400 truncate">
                      {track.artists.map(a => a.name).join(', ')}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Music2 className="h-4 w-4 text-zinc-500" />
                  </div>
                </div>
                {track.moodContribution && (
                  <p className="text-sm text-zinc-400 pl-16">{track.moodContribution}</p>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
