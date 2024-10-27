import Navigation from '@/components/Navigation';
import { 
  Sparkles, 
  MessageCircle, 
  Brain, 
  Headphones, 
  Timer, 
  Share2, 
  Workflow,
  Zap,
  Heart
} from 'lucide-react';

export default function Features() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 glow-text">
            Features & Capabilities
          </h1>
          <p className="text-xl text-zinc-400">
            Discover how MySpotifyAI transforms your music discovery experience through intelligent features and personalized interactions.
          </p>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          <FeatureCard
            icon={<Brain className="h-8 w-8 text-green-500" />}
            title="AI-Powered Music Understanding"
            description="Our AI analyzes your music preferences at a deep level, understanding not just genres and artists, but also musical elements like tempo, mood, and instrumentation."
            benefits={[
              "Discovers hidden patterns in your music taste",
              "Learns from your listening history",
              "Adapts to your changing preferences",
              "Understands complex musical relationships"
            ]}
          />

          <FeatureCard
            icon={<MessageCircle className="h-8 w-8 text-green-500" />}
            title="Natural Language Interaction"
            description="Have natural conversations about music with our AI assistant, just like chatting with a knowledgeable friend."
            benefits={[
              "Express music needs in your own words",
              "Get contextual recommendations",
              "Ask follow-up questions",
              "Receive explained recommendations"
            ]}
          />

          <FeatureCard
            icon={<Timer className="h-8 w-8 text-green-500" />}
            title="Emotion-Based Recommendations"
            description="Our emotion analysis system matches music to your current mood and desired emotional state."
            benefits={[
              "Mood-appropriate playlists",
              "Emotional journey tracking",
              "Customized energy levels",
              "Contextual awareness"
            ]}
          />

          <FeatureCard
            icon={<Workflow className="h-8 w-8 text-green-500" />}
            title="Smart Playlist Generation"
            description="Create perfectly curated playlists based on any theme, mood, or occasion you can imagine."
            benefits={[
              "Theme-based curation",
              "Perfect flow and transitions",
              "Mixed genre cohesion",
              "Dynamic updates"
            ]}
          />
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="container mx-auto px-6 py-16 bg-zinc-900/50">
        <h2 className="text-3xl font-bold mb-12 text-center">Advanced Capabilities</h2>
        <div className="max-w-3xl mx-auto space-y-8">
          <AdvancedFeature
            icon={<Zap className="h-6 w-6 text-green-500" />}
            title="Real-Time Adaptation"
            description="The system continuously learns from your interactions and feedback, making increasingly accurate recommendations over time."
            reasoning="Music taste evolves constantly, and static recommendations quickly become outdated. Our real-time adaptation ensures you always get relevant suggestions."
          />

          <AdvancedFeature
            icon={<Heart className="h-6 w-6 text-green-500" />}
            title="Taste Profile Analysis"
            description="Deep analysis of your musical preferences across multiple dimensions, from basic genres to complex audio characteristics."
            reasoning="Understanding the nuances of your taste helps us recommend music you'll love, even from unfamiliar genres or artists."
          />

          <AdvancedFeature
            icon={<Share2 className="h-6 w-6 text-green-500" />}
            title="Collaborative Features"
            description="Share your discoveries and create collaborative playlists with friends, enhanced by AI suggestions."
            reasoning="Music is best enjoyed together. Our collaborative features make sharing and discovering music with friends more interactive and enjoyable."
          />
        </div>
      </section>

      {/* Integration Benefits */}
      <section className="container mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose MySpotifyAI?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <BenefitCard
              icon={<Headphones className="h-6 w-6 text-green-500" />}
              title="Seamless Integration"
              description="Works perfectly with your existing Spotify account and playlists."
            />
            <BenefitCard
              icon={<Sparkles className="h-6 w-6 text-green-500" />}
              title="Intelligent Discovery"
              description="Find new music you'll love, based on sophisticated AI analysis."
            />
            <BenefitCard
              icon={<Brain className="h-6 w-6 text-green-500" />}
              title="Personal Growth"
              description="Expand your musical horizons while staying true to your taste."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

// Add this interface above the FeatureCard component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
}

// Update the FeatureCard component with the interface
const FeatureCard = ({ icon, title, description, benefits }: FeatureCardProps) => (
  <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 hover:border-green-500 transition-colors">
    <div className="mb-4">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <p className="text-zinc-400 mb-6">{description}</p>
    <ul className="space-y-2">
      {benefits.map((benefit, index) => (
        <li key={index} className="flex items-center gap-2 text-zinc-300">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
          {benefit}
        </li>
      ))}
    </ul>
  </div>
);

// Add interface
interface AdvancedFeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  reasoning: string;
}

// Update component signature
const AdvancedFeature = ({ icon, title, description, reasoning }: AdvancedFeatureProps) => (
  <div className="flex gap-6 p-6 bg-zinc-900 rounded-xl">
    <div className="p-2 bg-zinc-800 rounded-lg h-fit">
      {icon}
    </div>
    <div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-zinc-400 mb-3">{description}</p>
      <p className="text-sm text-zinc-500 italic">{reasoning}</p>
    </div>
  </div>
);

// Benefit Card Component
interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const BenefitCard = ({ icon, title, description }: BenefitCardProps) => (
  <div className="text-center">
    <div className="mx-auto w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    <p className="text-zinc-400">{description}</p>
  </div>
);
