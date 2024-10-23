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