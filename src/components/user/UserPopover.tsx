'use client';

import React from 'react';
import Image from 'next/image';
import { User, ExternalLink, Music2, Users, ListMusic, Globe, Crown, AlertCircle } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSpotifyUser } from '@/app/hooks/useSpotifyUser';

interface UserPopoverProps {
  sessionUser: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function UserPopover({ sessionUser }: UserPopoverProps) {
  const { user: spotifyUser, isLoading, isError, mutate } = useSpotifyUser();

  const ProfileImage = ({ size = 'small' }: { size?: 'small' | 'large' }) => {
    const dimension = size === 'small' ? 'w-8 h-8' : 'w-12 h-12';
    const iconSize = size === 'small' ? 'w-4 h-4' : 'w-6 h-6';

    if (!sessionUser.image) {
      return (
        <div className={`${dimension} rounded-full bg-zinc-700 flex items-center justify-center`}>
          <User className={`${iconSize} text-zinc-400`} />
        </div>
      );
    }

    return (
      <div className={`relative ${dimension}`}>
        <Image 
          src={sessionUser.image}
          alt={sessionUser.name || 'User profile'} 
          fill
          className="rounded-full object-cover"
          sizes={size === 'small' ? '32px' : '48px'}
          priority
        />
      </div>
    );
  };

  // Loading state component
  const LoadingState = () => (
    <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-zinc-800/50">
      <Skeleton className="w-8 h-8 rounded-full" />
      <div className="flex flex-col gap-1">
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-32 h-3" />
      </div>
    </div>
  );

  // Error state component
  const ErrorState = () => (
    <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-zinc-800/50 cursor-pointer"
         onClick={() => mutate()}>
      <ProfileImage />
      <div className="flex flex-col">
        <span className="text-sm font-medium text-white">{sessionUser.name}</span>
        <span className="text-xs text-red-400 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Click to retry
        </span>
      </div>
    </div>
  );

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-zinc-800/50 cursor-pointer hover:bg-zinc-800 transition-colors">
          <ProfileImage />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">
              {sessionUser.name}
            </span>
            <span className="text-xs text-zinc-400">
              {sessionUser.email}
            </span>
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-80 bg-zinc-900 border border-zinc-800 p-0 shadow-lg shadow-black/50" align="end">
        {/* Header */}
        <div className="p-4 bg-zinc-800/50">
          <div className="flex items-center gap-3">
            <ProfileImage size="large" />
            <div>
              <h3 className="font-semibold text-white">{sessionUser.name}</h3>
              <p className="text-sm text-zinc-400">{sessionUser.email}</p>
            </div>
          </div>
        </div>

        <Separator className="bg-zinc-800" />

        {/* Account Status */}
        <div className="p-4 space-y-4">
          {/* Premium Status */}
          <div className="flex items-center gap-3 text-sm">
            <Crown className={`w-4 h-4 ${spotifyUser?.premium ? 'text-[#1DB954]' : 'text-zinc-500'}`} />
            <span className="text-zinc-300">
              {spotifyUser?.premium ? 'Premium Account' : 'Free Account'}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-3 text-sm">
            <Globe className="w-4 h-4 text-zinc-500" />
            <span className="text-zinc-300">
              {spotifyUser?.country || 'Location not available'}
            </span>
          </div>

          {/* Currently Playing */}
          {spotifyUser?.currentTrack && (
            <div className="flex items-center gap-3 text-sm group">
              <Music2 className="w-4 h-4 text-[#1DB954] group-hover:text-[#1ed760] transition-colors" />
              <div className="flex flex-col">
                <span className="text-zinc-300 line-clamp-1">
                  {spotifyUser.currentTrack.name}
                </span>
                <span className="text-zinc-500 text-xs line-clamp-1">
                  {spotifyUser.currentTrack.artist}
                </span>
              </div>
            </div>
          )}
        </div>

        <Separator className="bg-zinc-800" />

        {/* Stats */}
        <div className="p-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Users className="w-4 h-4 text-zinc-500" />
              <span className="text-sm font-medium text-white">
                {spotifyUser?.followers?.total.toLocaleString() || '0'}
              </span>
            </div>
            <span className="text-xs text-zinc-500">Followers</span>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Users className="w-4 h-4 text-zinc-500" />
              <span className="text-sm font-medium text-white">
                {spotifyUser?.following?.toLocaleString() || '0'}
              </span>
            </div>
            <span className="text-xs text-zinc-500">Following</span>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <ListMusic className="w-4 h-4 text-zinc-500" />
              <span className="text-sm font-medium text-white">
                {spotifyUser?.totalPlaylists?.toLocaleString() || '0'}
              </span>
            </div>
            <span className="text-xs text-zinc-500">Playlists</span>
          </div>
        </div>

        <Separator className="bg-zinc-800" />

        {/* Footer Actions */}
        <div className="p-4">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm text-zinc-400 hover:text-white hover:bg-zinc-800"
            onClick={() => window.open(`https://open.spotify.com/user/${spotifyUser?.id}`, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Spotify Profile
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}