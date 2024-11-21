'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { MoodWheel } from '@/components/mood/MoodWheel';
import { FeatureSlider } from '@/components/mood/FeatureSlider';
import { AIMoodInput } from '@/components/mood/AIMoodInput';
import { DEFAULT_PRESETS, type AudioFeatures, type MoodPreset } from '@/types/mood';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Music2, 
  Smile, 
  Volume2, 
  Waves,
  RefreshCcw,
  PlayCircle,
  Loader2,
  AlertCircle,
  Zap
} from 'lucide-react';
import { useSpotify } from '@/hooks/useSpotify';
import Navigation from '@/components/Navigation';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PlaylistResult } from '@/components/mood/PlaylistResult';
import { useToast } from "@/hooks/use-toast";

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  external_urls: {
    spotify: string;
  };
  moodContribution?: string;
}

interface PlaylistResponse {
  playlistId: string;
  playlistUrl: string;
  tracks: SpotifyTrack[];
}

export default function MoodMixerPage() {
  const [selectedPreset, setSelectedPreset] = useState<MoodPreset>();
  const [features, setFeatures] = useState<AudioFeatures>({
    energy: 0.5,
    valence: 0.5,
    danceability: 0.5,
    acousticness: 0.5,
    instrumentalness: 0.3,
    tempo: 120,
  });
  const [aiSuggestions, setAiSuggestions] = useState<{
    moodDescription: string;
    recommendedGenres: string[];
    contextualNotes: string;
  }>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlaylist, setGeneratedPlaylist] = useState<PlaylistResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { isReady, isLoading, userData } = useSpotify();

  const handlePresetSelect = (preset: MoodPreset) => {
    setSelectedPreset(preset);
    setFeatures(preset.features);
    setAiSuggestions(undefined); // Clear AI suggestions when preset is selected
  };

  const handleFeatureChange = (feature: keyof AudioFeatures, value: number) => {
    setFeatures(prev => ({ ...prev, [feature]: value }));
    setSelectedPreset(undefined); // Clear preset when manually adjusting
  };

  const handleAIFeatures = (newFeatures: AudioFeatures) => {
    setFeatures(newFeatures);
    setSelectedPreset(undefined);
  };

  const handleAISuggestions = (suggestions: {
    moodDescription: string;
    recommendedGenres: string[];
    contextualNotes: string;
  }) => {
    setAiSuggestions(suggestions);
    setSelectedPreset(undefined); // Clear preset when AI suggestions are received
  };

  const generatePlaylist = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      const response = await fetch('/api/mood/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          features,
          aiSuggestions,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401 || (errorData.error && errorData.error.includes('Token expired'))) {
          // Token expired, refresh the session
          await signIn('spotify');
          return;
        }
        throw new Error(errorData.error || 'Failed to generate playlist');
      }

      const data = await response.json();
      setGeneratedPlaylist(data);
      toast({
        title: "Success!",
        description: "Your playlist has been generated successfully.",
      });
    } catch (error) {
      console.error('Error generating playlist:', error);
      const errorMessage = (error as Error).message || 'Failed to generate playlist';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 glow-text">
            Mood Mixer
          </h1>
          <p className="text-xl text-zinc-400">
            Create the perfect playlist by mixing different moods and letting AI help you discover the right balance.
          </p>
          {userData && (
            <p className="text-sm text-zinc-500 mt-4">
              Connected as {userData.display_name} • {userData.totalPlaylists} Playlists
              {userData.currentTrack && (
                <> • Currently playing: {userData.currentTrack.name} by {userData.currentTrack.artist}</>
              )}
            </p>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
          </div>
        ) : !isReady ? (
          <div className="text-center">
            <p className="text-zinc-400">Please sign in with Spotify to continue.</p>
          </div>
        ) : (
          <SpotlightCard className="p-6">
            <div className="space-y-8">
              {/* Mood Wheel Section */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Mood Selection</h3>
                <div className="flex justify-center mb-8">
                  <MoodWheel
                    presets={DEFAULT_PRESETS}
                    selectedPreset={selectedPreset}
                    onPresetSelect={handlePresetSelect}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FeatureSlider
                    label="Energy"
                    value={features.energy}
                    onChange={(value) => handleFeatureChange('energy', value)}
                    icon={<Zap className="h-4 w-4" />}
                  />
                  <FeatureSlider
                    label="Happiness"
                    value={features.valence}
                    onChange={(value) => handleFeatureChange('valence', value)}
                    icon={<Smile className="h-4 w-4" />}
                  />
                  <FeatureSlider
                    label="Danceability"
                    value={features.danceability}
                    onChange={(value) => handleFeatureChange('danceability', value)}
                    icon={<Music2 className="h-4 w-4" />}
                  />
                  <FeatureSlider
                    label="Acousticness"
                    value={features.acousticness}
                    onChange={(value) => handleFeatureChange('acousticness', value)}
                    icon={<Volume2 className="h-4 w-4" />}
                  />
                  <FeatureSlider
                    label="Instrumentalness"
                    value={features.instrumentalness}
                    onChange={(value) => handleFeatureChange('instrumentalness', value)}
                    icon={<Waves className="h-4 w-4" />}
                  />
                </div>
              </div>

              {/* AI Assistant Section */}
              <div className="pt-8 border-t border-zinc-800">
                <h3 className="text-lg font-semibold text-white mb-4">AI Mood Assistant</h3>
                <AIMoodInput
                  onFeaturesGenerated={handleAIFeatures}
                  onSuggestionsReceived={handleAISuggestions}
                />
                {aiSuggestions && (
                  <div className="mt-6 space-y-4">
                    <p className="text-zinc-300">{aiSuggestions.moodDescription}</p>
                    <div>
                      <h4 className="text-sm font-medium text-zinc-400 mb-2">Recommended Genres</h4>
                      <div className="flex flex-wrap gap-2">
                        {aiSuggestions.recommendedGenres.map((genre) => (
                          <span
                            key={genre}
                            className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-sm"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-zinc-400">{aiSuggestions.contextualNotes}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={() => {
                    setFeatures({
                      energy: 0.5,
                      valence: 0.5,
                      danceability: 0.5,
                      acousticness: 0.5,
                      instrumentalness: 0.3,
                      tempo: 120,
                    });
                    setSelectedPreset(undefined);
                    setAiSuggestions(undefined);
                  }}
                  variant="outline"
                  className="flex-1 h-12 bg-white hover:bg-zinc-100 text-black"
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button
                  onClick={generatePlaylist}
                  disabled={!isReady || isGenerating || !aiSuggestions}
                  className="flex-1 h-12 bg-green-500 hover:bg-green-400 text-black font-medium disabled:bg-green-500/50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Music2 className="mr-2 h-4 w-4" />
                      {!isReady
                        ? 'Login Required'
                        : !aiSuggestions
                        ? 'Describe Your Mood First'
                        : 'Generate Playlist'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </SpotlightCard>
        )}
      </section>

      {/* Playlist Result */}
      {generatedPlaylist && (
        <div className="mt-8">
          <PlaylistResult
            playlistId={generatedPlaylist.playlistId}
            tracks={generatedPlaylist.tracks}
            moodDescription={aiSuggestions?.moodDescription}
            contextualNotes={aiSuggestions?.contextualNotes}
            onClose={() => setGeneratedPlaylist(null)}
          />
        </div>
      )}
    </div>
  );
}
