export interface Artist {
  id: string;
  name: string;
  images: { url: string; height: number; width: number; }[];
  genres: string[];
  followers: {
    total: number;
  };
  popularity: number;
  external_urls: {
    spotify: string;
  };
}

export interface TopTracks {
  tracks: {
    id: string;
    name: string;
    duration_ms: number;
    album: {
      name: string;
      images: { url: string; height: number; width: number; }[];
    };
    artists: {
      name: string;
    }[];
    preview_url: string | null;
    external_urls: {
      spotify: string;
    };
  }[];
}

export interface RelatedArtists {
  artists: Artist[];
}

export interface Albums {
  items: {
    id: string;
    name: string;
    images: { url: string; height: number; width: number; }[];
    release_date: string;
    total_tracks: number;
    album_type: string;
    external_urls: {
      spotify: string;
    };
  }[];
}
