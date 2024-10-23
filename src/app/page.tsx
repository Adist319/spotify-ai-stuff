'use client';

import React from 'react';
import { Sparkles, MessageCircle, Brain, ArrowRight, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-500 to-green-300 text-transparent bg-clip-text">
            Your AI-Powered Music Companion
          </h1>
          <p className="text-xl text-zinc-400 mb-8">
            Experience music like never before with personalized recommendations powered by artificial intelligence.
          </p>
          <Button
            onClick={() => handleNavigation(session ? '/discover' : '/features')}
            className="bg-green-500 hover:bg-green-400 text-black font-bold py-6 px-8 rounded-full text-lg inline-flex items-center gap-2"
          >
            {session ? 'Discover Music' : 'Explore Features'}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Sparkles className="h-8 w-8 text-green-500" />}
            title="Smart Playlists"
            description="Create AI-curated playlists based on your mood, activity, or musical taste."
          />
          <FeatureCard 
            icon={<MessageCircle className="h-8 w-8 text-green-500" />}
            title="Music Chat"
            description="Ask questions about songs, artists, and get personalized music recommendations."
          />
          <FeatureCard 
            icon={<Brain className="h-8 w-8 text-green-500" />}
            title="Mood Analysis"
            description="Discover music that matches your current mood using our emotional intelligence engine."
          />
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl p-12">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block p-3 bg-green-500/10 rounded-full mb-6">
              <Heart className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-4xl font-bold mb-6">Start Your Musical Journey</h2>
            <p className="text-zinc-400 mb-8 text-lg">
              {session 
                ? "Ready to explore new music? Head to your personalized discovery page."
                : "Join MySpotifyAI today and let AI help you discover music that speaks to your soul."}
            </p>
            <Button
              onClick={() => handleNavigation(session ? '/discover' : '/features')}
              className="bg-zinc-800 hover:bg-zinc-700 text-white py-6 px-8 rounded-full text-lg inline-flex items-center gap-2"
            >
              {session ? 'Go to Discovery' : 'Learn More'}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

// Feature Card Component
const FeatureCard = ({ icon, title, description }: { icon: JSX.Element, title: string, description: string }) => (
  <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 hover:border-green-500 transition-colors">
    <div className="mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-zinc-400">{description}</p>
  </div>
);