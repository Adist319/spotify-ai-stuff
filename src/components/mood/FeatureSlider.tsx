'use client';

import React from 'react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface FeatureSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  icon?: React.ReactNode;
}

export function FeatureSlider({ label, value, onChange, icon }: FeatureSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className="text-green-400">{icon}</span>}
          <span className="text-sm font-medium text-green-400">{label}</span>
        </div>
        <span className="text-sm text-green-400 font-medium">{Math.round(value * 100)}%</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        max={1}
        step={0.01}
        className={cn(
          "w-full [&_.relative]:bg-zinc-800", // Track background
          "[&_.absolute]:bg-green-500", // Range fill
          "[&_.block]:border-green-500", // Thumb border
          "[&_.block]:hover:bg-green-500", // Thumb hover
          "[&_.block]:focus-visible:ring-green-500", // Thumb focus
        )}
      />
    </div>
  );
}
