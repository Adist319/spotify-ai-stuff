'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, MessageCircle, Sparkles } from 'lucide-react';
import { AudioFeatures } from '@/types/mood';

interface AIMoodInputProps {
  onFeaturesGenerated: (features: AudioFeatures) => void;
  onSuggestionsReceived: (suggestions: {
    moodDescription: string;
    recommendedGenres: string[];
    contextualNotes: string;
  }) => void;
}

export function AIMoodInput({ onFeaturesGenerated, onSuggestionsReceived }: AIMoodInputProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/mood/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze mood');
      }

      const data = await response.json();
      onFeaturesGenerated(data.audioFeatures);
      onSuggestionsReceived({
        moodDescription: data.moodDescription,
        recommendedGenres: data.recommendedGenres,
        contextualNotes: data.contextualNotes,
      });
      
    } catch (error) {
      console.error('Error analyzing mood:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your desired mood... (e.g., 'energetic but not too intense')"
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={isLoading}
          />
          <p className="mt-2 text-sm text-zinc-400">
            Let AI help you find the perfect mood for your music
          </p>
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-green-500 hover:bg-green-400 text-black font-medium px-6 h-12"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Sparkles className="h-5 w-5" />
          )}
        </Button>
      </div>
    </form>
  );
}
