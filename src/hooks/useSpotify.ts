import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface SpotifyState {
  isReady: boolean;
  error: Error | null;
  isLoading: boolean;
  session: any;
  userData?: SpotifyUserData | null;
}

interface SpotifyUserData {
  id: string;
  display_name: string;
  email: string;
  images: { url: string }[];
  product: string;
  currentTrack: {
    name: string;
    artist: string;
    album: string;
    albumArt: string;
    isPlaying: boolean;
  } | null;
  totalPlaylists: number;
  following: number;
  premium: boolean;
}

export function useSpotify(): SpotifyState {
  const { data: session, status } = useSession();
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [userData, setUserData] = useState<SpotifyUserData | null>(null);

  useEffect(() => {
    const verifySession = async () => {
      if (session?.user?.accessToken) {
        try {
          // Use our API route to verify the session and get user data
          const response = await fetch('/api/user');
          
          if (!response.ok) {
            throw new Error('Failed to verify Spotify session');
          }
          
          const data = await response.json();
          if (data.error) {
            throw new Error(data.error);
          }

          setUserData(data);
          setIsReady(true);
          setError(null);
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Failed to initialize Spotify'));
          setIsReady(false);
          setUserData(null);
        }
      } else {
        setIsReady(false);
        setUserData(null);
      }
    };

    verifySession();

    return () => {
      setIsReady(false);
      setError(null);
      setUserData(null);
    };
  }, [session, status]);

  return {
    isReady,
    error,
    isLoading: status === 'loading',
    session,
    userData
  };
}