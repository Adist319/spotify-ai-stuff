import React from 'react';
import Navigation from '@/components/Navigation';
import { Music, Code, Cpu, Server, Sparkles, Split } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 glow-text">
            About MySpotifyAI
        </h1>
          <p className="text-xl text-zinc-400">
            Transforming music discovery through the power of artificial intelligence and emotional intelligence.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="bg-zinc-900/50 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-zinc-400 text-lg leading-relaxed">
            MySpotifyAI aims to revolutionize how people discover and experience music. By combining the vast musical landscape of Spotify with cutting-edge AI technology, we create deeply personal and emotionally resonant music recommendations that adapt to your unique taste and mood.
          </p>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Built With Modern Technology</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TechCard
            icon={<Code className="h-8 w-8 text-green-500" />}
            title="Frontend"
            technologies={[
              "Next.js",
              "TypeScript",
              "Tailwind CSS",
              "React Context API"
            ]}
          />
          <TechCard
            icon={<Server className="h-8 w-8 text-green-500" />}
            title="Backend"
            technologies={[
              "Next.js API Routes",
              "TypeScript",
              "NextAuth.js",
              "Spotify Web API"
            ]}
          />
          <TechCard
            icon={<Cpu className="h-8 w-8 text-green-500" />}
            title="AI Integration"
            technologies={[
              "OpenAI GPT-4",
              "Emotion Analysis",
              "Natural Language Processing",
              "Machine Learning"
            ]}
          />
        </div>
      </section>

      {/* Key Features */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Key Features</h2>
        <div className="max-w-3xl mx-auto space-y-8">
          <FeatureRow 
            icon={<Sparkles className="h-6 w-6 text-green-500" />}
            title="AI-Powered Music Discovery"
            description="Intelligent recommendations based on your listening history and preferences."
          />
          <FeatureRow 
            icon={<Split className="h-6 w-6 text-green-500" />}
            title="Emotion Analysis"
            description="Dynamic playlists that adapt to your mood and emotional state."
          />
          <FeatureRow 
            icon={<Music className="h-6 w-6 text-green-500" />}
            title="Seamless Spotify Integration"
            description="Full access to Spotify's vast library with enhanced AI capabilities."
          />
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Experience the Future of Music?</h2>
          <p className="text-zinc-400 mb-8 text-lg">
            Join us in revolutionizing how you discover and experience music.
          </p>
          <button className="bg-green-500 hover:bg-green-400 text-black font-bold py-3 px-8 rounded-full text-lg">
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
}

// Tech Stack Card Component
const TechCard = ({ icon, title, technologies }) => (
  <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 hover:border-green-500 transition-colors">
    <div className="mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-4">{title}</h3>
    <ul className="space-y-2">
      {technologies.map((tech, index) => (
        <li key={index} className="text-zinc-400 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
          {tech}
        </li>
      ))}
    </ul>
  </div>
);

// Feature Row Component
const FeatureRow = ({ icon, title, description }) => (
  <div className="flex items-start gap-4 p-6 bg-zinc-900/50 rounded-xl">
    <div className="p-2 bg-zinc-800 rounded-lg">
      {icon}
    </div>
    <div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-zinc-400">{description}</p>
    </div>
  </div>
);