// types/spotify.ts
export interface SpotifyUser {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string | null;
    total: number;
  };
  href: string;
  id: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  product: string;
  type: string;
  uri: string;
}

export interface CurrentlyPlaying {
  item: {
    name: string;
    artists: {
      name: string;
    }[];
    album: {
      name: string;
      images: {
        url: string;
        height: number;
        width: number;
      }[];
    };
  } | null;
  is_playing: boolean;
  progress_ms: number | null;
}

export interface SpotifyError {
  error: {
    status: number;
    message: string;
  };
}

// types/spotify.ts
export interface SpotifyArtist {
  id: string;
  name: string;
  images: { url: string; height: number; width: number; }[];
  genres: string[];
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: {
    id: string;
    name: string;
  }[];
  album: {
    id: string;
    name: string;
    images: { url: string; height: number; width: number; }[];
  };
  duration_ms: number;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyPlayHistory {
  track: SpotifyTrack;
  played_at: string;
  context: {
    type: string;
    uri: string;
  } | null;
}

// Add to existing spotify.ts
export interface SpotifyUserData extends SpotifyUser {
  currentTrack?: {
    name: string;
    artist: string;
    album: string;
    albumArt: string;
    isPlaying: boolean;
  } | null;
  topArtists?: Array<{
    id: string;
    name: string;
    genres: string[];
  }>;
  favoriteGenres?: string[];
  recentTracks?: Array<{
    id: string;
    name: string;
    artist: string;
    album?: string;
    albumArt?: string;
  }>;
  totalPlaylists: number;
  following: number;
  premium: boolean;
}