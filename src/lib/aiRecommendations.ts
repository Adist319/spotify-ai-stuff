import type { SpotifyTrack } from '@/types/spotify';

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
  // This is a basic implementation - you might want to make it more sophisticated
  const recommendations: Partial<AIRecommendation>[] = [];
  
  // Look for patterns like "I recommend [song] by [artist]" or similar
  const matches = content.match(/(?:recommend|suggest|try)\s+"([^"]+)"\s+by\s+([^,\n.]+)/g);
  
  if (matches) {
    matches.forEach(match => {
      const [_, title, artist] = match.match(/(?:recommend|suggest|try)\s+"([^"]+)"\s+by\s+([^,\n.]+)/) || [];
      if (title && artist) {
        recommendations.push({
          track: {
            name: title.trim(),
            artists: [{ name: artist.trim() }]
          } as SpotifyTrack,
          reason: match,
          timestamp: Date.now()
        });
      }
    });
  }

  return recommendations;
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