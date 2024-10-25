// Add to existing chat.ts if these types aren't already there
import type { SpotifyTrack } from './spotify';

export interface AIRecommendation {
  id: string;
  track: SpotifyTrack;
  reason: string;
  timestamp: number;
  mood?: string;
  context?: string;
}
// types/chat.ts
export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
  }
  
  export interface ChatState {
    messages: ChatMessage[];
    isLoading: boolean;
    error?: string;
  }
  
  export interface UserPreferences {
    topArtists?: string[];
    favoriteGenres?: string[];
    recentTracks?: {
      name: string;
      artist: string;
    }[];
    currentMood?: string;
  }
  
  export interface ChatResponse {
    message: ChatMessage;
    error?: string;
  }
  
  export interface StreamingChatResponse {
    content: string;
    role: 'assistant';
    id: string;
  }

  // types/chat.ts
export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
  }
  
  export interface ChatState {
    messages: ChatMessage[];
    isLoading: boolean;
    error?: string;
  }