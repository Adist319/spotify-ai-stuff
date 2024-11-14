'use client';

import React, { useState } from 'react';
import { Sparkles, MessageCircle, Brain, ArrowRight, Heart, Clock, ExternalLink, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { SpotlightCard } from '@/components/ui/spotlight-card';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [navigating, setNavigating] = useState<string | null>(null);

  const handleNavigation = async (path: string) => {
    if (!session) {
      router.push('/features');
      return;
    }
    setNavigating(path);
    await router.push(path);
    setNavigating(null);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 glow-text">
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
      <TooltipProvider>
        <section className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
            {/* Smart Playlists - Coming Soon */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <FeatureCard 
                    icon={<Sparkles className="h-8 w-8 text-green-500" />}
                    title="Smart Playlists"
                    description="Create AI-curated playlists based on your mood, activity, or musical taste."
                    comingSoon
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px]">
                <p>Coming soon!</p>
              </TooltipContent>
            </Tooltip>

            {/* Music Chat - Links to discover page */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <FeatureCard 
                    icon={<MessageCircle className="h-8 w-8 text-green-500" />}
                    title="Music Chat"
                    description="Ask questions about songs, artists, and get personalized music recommendations. Chat with our AI to discover new music and get insights about your taste."
                    onClick={() => handleNavigation('/discover')}
                    isLoading={navigating === '/discover'}
                    requiresAuth={!session}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px]">
                {!session ? (
                  <p>Login required to access this feature</p>
                ) : (
                  <p>Ask questions about songs, artists, and get personalized music recommendations. Chat with our AI to discover new music and get insights about your taste.</p>
                )}
              </TooltipContent>
            </Tooltip>

            {/* Mood Mixer - Links to mood-mixer */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <FeatureCard 
                    icon={<Brain className="h-8 w-8 text-green-500" />}
                    title="Mood Mixer"
                    description="Create personalized playlists based on your mood using our emotional intelligence engine."
                    onClick={() => handleNavigation('/mood-mixer')}
                    isLoading={navigating === '/mood-mixer'}
                    requiresAuth={!session}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px]">
                {!session ? (
                  <p>Login required to access this feature</p>
                ) : (
                  <p>Create personalized playlists based on your mood using our emotional intelligence engine.</p>
                )}
              </TooltipContent>
            </Tooltip>

            {/* Time Machine */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <FeatureCard 
                    icon={<Clock className="h-8 w-8 text-green-500" />}
                    title="Music Time Machine"
                    description="Rediscover your musical journey through time and explore your listening history. See what songs defined different periods of your life."
                    onClick={() => handleNavigation('/time-machine')}
                    isLoading={navigating === '/time-machine'}
                    requiresAuth={!session}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px]">
                {!session ? (
                  <p>Login required to access this feature</p>
                ) : (
                  <p>Rediscover your musical journey through time and explore your listening history. See what songs defined different periods of your life.</p>
                )}
              </TooltipContent>
            </Tooltip>

            {/* Music Quiz */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <FeatureCard 
                    icon={<Trophy className="h-8 w-8 text-green-500" />}
                    title="Music Quiz"
                    description="Test your music knowledge and memory with personalized quizzes about your listening history. Challenge yourself with questions about your favorite songs and artists."
                    onClick={() => handleNavigation('/quiz')}
                    isLoading={navigating === '/quiz'}
                    requiresAuth={!session}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px]">
                {!session ? (
                  <p>Login required to access this feature</p>
                ) : (
                  <p>Test your music knowledge and memory with personalized quizzes about your listening history. Challenge yourself with questions about your favorite songs and artists.</p>
                )}
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <FeatureCard 
                    icon={<Brain className="h-8 w-8 text-green-500" />}
                    title="Music Stats"
                    description="Dive deep into your listening habits with detailed analytics. Discover your top artists, favorite genres, listening patterns, and how your music taste evolves over time."
                    onClick={() => handleNavigation('/stats')}
                    isLoading={navigating === '/stats'}
                    requiresAuth={!session}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px]">
                {!session ? (
                  <p>Login required to access this feature</p>
                ) : (
                  <p>Get insights into your music preferences with detailed statistics about your listening history, top artists, genres, and more. Perfect for understanding your unique musical taste!</p>
                )}
              </TooltipContent>
            </Tooltip>
          </div>
        </section>
      </TooltipProvider>

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
const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  onClick,
  comingSoon,
  isLoading,
  requiresAuth
}: { 
  icon: JSX.Element, 
  title: string, 
  description: string,
  onClick?: () => void,
  comingSoon?: boolean,
  isLoading?: boolean,
  requiresAuth?: boolean
}) => (
  <SpotlightCard
    className={`h-[180px] flex flex-col ${
      onClick && !requiresAuth ? 'cursor-pointer hover:scale-[1.02]' : 
      comingSoon || requiresAuth ? 'opacity-75' : ''
    }`}
    onClick={!isLoading && !comingSoon && !requiresAuth ? onClick : undefined}
  >
    {isLoading ? (
      <>
        <Skeleton className="h-8 w-8 bg-zinc-800 mb-4" />
        <Skeleton className="h-6 w-3/4 bg-zinc-800 mb-2" />
        <Skeleton className="h-20 w-full bg-zinc-800" />
      </>
    ) : (
      <>
        <div className="mb-3">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          {title}
          {onClick && !comingSoon && !requiresAuth && (
            <ExternalLink className="h-4 w-4 text-green-500 inline-block" />
          )}
        </h3>
        <p className="text-zinc-400 text-sm line-clamp-2">{description}</p>
      </>
    )}
  </SpotlightCard>
);
