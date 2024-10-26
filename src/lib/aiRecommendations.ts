import type { SpotifyTrack } from '@/types/spotify';
import { nanoid } from 'nanoid';

export interface AIRecommendation {
  id: string;
  track: SpotifyTrack;
  reason: string;
  timestamp: number;
  mood?: string;
  context?: string;
}

// Parse Claude's response to extract track recommendations
export function parseClaudeRecommendations(content: string): Partial<AIRecommendation>[] {
  try {
    // Extract JSON section between markers
    const jsonMatch = content.match(/---JSON---\n([\s\S]*?)\n---JSON---/);
    
    if (!jsonMatch?.[1]) {
      return [];
    }

    const jsonData = JSON.parse(jsonMatch[1]);
    
    return jsonData.recommendations.map((rec: any) => ({
      id: nanoid(),
      track: {
        name: rec.track.name,
        artists: [{ name: rec.track.artist }]
      } as SpotifyTrack,
      reason: rec.track.reason,
      mood: rec.mood,
      context: rec.context,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('Failed to parse recommendations:', error);
    return [];
  }
}

// Store recommendations in localStorage
export function storeRecommendation(recommendation: AIRecommendation) {
  const stored = getStoredRecommendations();
  localStorage.setItem('ai_recommendations', 
    JSON.stringify([recommendation, ...stored].slice(0, 50)) // Keep last 50
  );
}

// Get stored recommendations
export function getStoredRecommendations(): AIRecommendation[] {
  try {
    return JSON.parse(localStorage.getItem('ai_recommendations') || '[]');
  } catch {
    return [];
  }
}
