export interface AudioFeatures {
  energy: number;
  valence: number;
  danceability: number;
  acousticness: number;
  instrumentalness: number;
  tempo: number;
}

export interface MoodPreset {
  name: string;
  emoji: string;
  features: AudioFeatures;
  description: string;
}

export const DEFAULT_PRESETS: MoodPreset[] = [
  {
    name: 'Energetic',
    emoji: '⚡',
    features: {
      energy: 0.8,
      valence: 0.7,
      danceability: 0.75,
      acousticness: 0.2,
      instrumentalness: 0.2,
      tempo: 130
    },
    description: 'High-energy tracks to get you moving'
  },
  {
    name: 'Chill',
    emoji: '😌',
    features: {
      energy: 0.3,
      valence: 0.5,
      danceability: 0.4,
      acousticness: 0.7,
      instrumentalness: 0.4,
      tempo: 90
    },
    description: 'Relaxing tunes for unwinding'
  },
  {
    name: 'Happy',
    emoji: '😊',
    features: {
      energy: 0.6,
      valence: 0.8,
      danceability: 0.7,
      acousticness: 0.4,
      instrumentalness: 0.2,
      tempo: 120
    },
    description: 'Uplifting songs to boost your mood'
  },
  {
    name: 'Focus',
    emoji: '🎯',
    features: {
      energy: 0.4,
      valence: 0.5,
      danceability: 0.3,
      acousticness: 0.5,
      instrumentalness: 0.7,
      tempo: 100
    },
    description: 'Concentration-enhancing music'
  },
  {
    name: 'Party',
    emoji: '🎉',
    features: {
      energy: 0.9,
      valence: 0.8,
      danceability: 0.9,
      acousticness: 0.1,
      instrumentalness: 0.1,
      tempo: 128
    },
    description: 'High-energy party tracks'
  },
  {
    name: 'Melancholic',
    emoji: '🌧️',
    features: {
      energy: 0.3,
      valence: 0.3,
      danceability: 0.4,
      acousticness: 0.6,
      instrumentalness: 0.3,
      tempo: 85
    },
    description: 'Emotional and reflective songs'
  }
];

export interface MoodMixerConfig {
  targetFeatures: AudioFeatures;
  genreSeeds?: string[];
  aiSuggestions?: {
    moodDescription: string;
    recommendedGenres: string[];
    contextualNotes: string;
  };
  tolerance: number;
}
