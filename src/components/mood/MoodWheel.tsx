'use client';

import React from 'react';
import { MoodPreset } from '@/types/mood';

interface MoodWheelProps {
  presets: MoodPreset[];
  selectedPreset?: MoodPreset;
  onPresetSelect: (preset: MoodPreset) => void;
}

export function MoodWheel({ presets, selectedPreset, onPresetSelect }: MoodWheelProps) {
  const radius = 150; // Wheel radius in pixels
  const centerX = radius;
  const centerY = radius;

  return (
    <div className="space-y-6">
      <p className="text-center text-zinc-400">
        Click a mood to get started
      </p>
      <div className="relative" style={{ width: radius * 2, height: radius * 2 }}>
        {presets.map((preset, index) => {
          const angle = (index * 2 * Math.PI) / presets.length;
          const x = centerX + radius * Math.cos(angle) * 0.7; // 0.7 to bring items closer to center
          const y = centerY + radius * Math.sin(angle) * 0.7;

          return (
            <button
              key={preset.name}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full flex flex-col items-center justify-center
                ${selectedPreset?.name === preset.name 
                  ? 'bg-green-500 text-black shadow-lg shadow-green-500/20' 
                  : 'bg-zinc-800 text-white hover:bg-zinc-700 hover:shadow-lg hover:shadow-white/5'
                } transition-colors`}
              style={{
                left: x,
                top: y,
              }}
              onClick={() => onPresetSelect(preset)}
              title={preset.description}
            >
              <span className="text-2xl">{preset.emoji}</span>
              <span className="text-sm font-medium mt-1">{preset.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
