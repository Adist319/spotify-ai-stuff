'use client';

import React from 'react';
import Image from 'next/image';
import { User, ExternalLink, Music2, Users, ListMusic, Globe, Crown } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface UserPopoverProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    // Additional Spotify-specific properties
    premium?: boolean;
    country?: string;
    spotifyId?: string;
    spotifyUri?: string;
    followers?: number;
    following?: number;
    totalPlaylists?: number;
    currentTrack?: {
      name: string;
      artist: string;
    };
  };
}

export function UserPopover({ user }: UserPopoverProps) {
  const ProfileImage = () => {
    if (user.image) {
      return (
        <div className="relative w-8 h-8">
          <Image 
            src={user.image}
            alt={user.name || 'User profile'} 
            fill
            className="rounded-full object-cover"
            sizes="(max-width: 768px) 32px, 32px"
            priority
          />
        </div>
      );
    }

    return (
      <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
        <User className="w-4 h-4 text-zinc-400" />
      </div>
    );
  };

  const LargeProfileImage = () => {
    if (user.image) {
      return (
        <div className="relative w-12 h-12">
          <Image 
            src={user.image}
            alt={user.name || 'User profile'} 
            fill
            className="rounded-full object-cover"
            sizes="(max-width: 768px) 48px, 48px"
            priority
          />
        </div>
      );
    }

    return (
      <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center">
        <User className="w-6 h-6 text-zinc-400" />
      </div>
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-zinc-800/50 cursor-pointer hover:bg-zinc-800 transition-colors">
          <ProfileImage />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">
              {user.name}
            </span>
            <span className="text-xs text-zinc-400">
              {user.email}
            </span>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-zinc-900 border border-zinc-800 p-0 shadow-lg shadow-black/50">
        {/* Header */}
        <div className="p-4 bg-zinc-800/50">
          <div className="flex items-center gap-3">
            <LargeProfileImage />
            <div>
              <h3 className="font-semibold text-white">{user.name}</h3>
              <p className="text-sm text-zinc-400">{user.email}</p>
            </div>
          </div>
        </div>

        <Separator className="bg-zinc-800" />

        {/* Account Status */}
        <div className="p-4 space-y-4">
          {/* Premium Status */}
          <div className="flex items-center gap-3 text-sm">
            <Crown className={`w-4 h-4 ${user.premium ? 'text-[#1DB954]' : 'text-zinc-500'}`} />
            <span className="text-zinc-300">
              {user.premium ? 'Premium Account' : 'Free Account'}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-3 text-sm">
            <Globe className="w-4 h-4 text-zinc-500" />
            <span className="text-zinc-300">{user.country || 'Location not available'}</span>
          </div>

          {/* Currently Playing */}
          {user.currentTrack && (
            <div className="flex items-center gap-3 text-sm">
              <Music2 className="w-4 h-4 text-[#1DB954]" />
              <div className="flex flex-col">
                <span className="text-zinc-300">{user.currentTrack.name}</span>
                <span className="text-zinc-500 text-xs">{user.currentTrack.artist}</span>
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
              <span className="text-sm font-medium text-white">{user.followers || 0}</span>
            </div>
            <span className="text-xs text-zinc-500">Followers</span>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Users className="w-4 h-4 text-zinc-500" />
              <span className="text-sm font-medium text-white">{user.following || 0}</span>
            </div>
            <span className="text-xs text-zinc-500">Following</span>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <ListMusic className="w-4 h-4 text-zinc-500" />
              <span className="text-sm font-medium text-white">{user.totalPlaylists || 0}</span>
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
            onClick={() => window.open(`https://open.spotify.com/user/${user.spotifyId}`, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Spotify Profile
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}