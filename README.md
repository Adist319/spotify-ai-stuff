# MySpotifyAI 🎵 🤖

MySpotifyAI is an intelligent web-based Spotify client that combines modern web technologies with artificial intelligence to deliver a personalized and immersive music experience. By integrating Spotify's powerful API with advanced AI capabilities, MySpotifyAI offers smart music recommendations based on your listening preferences and emotional state.

## 🌟 Features (Planned)

### 🔐 User Authentication
- Secure OAuth 2.0 authentication flow through Spotify
- Seamless integration with NextAuth.js for session management
- Protected routes and API endpoints
- Persistent user sessions

### 🎵 Spotify Integration
- **Playlist Management**
  - View and browse personal playlists
  - Create new playlists with custom covers
  - Edit playlist details and track order
  - Delete unwanted playlists
  - Collaborative playlist support

- **Music Playback**
  - Full playback control using Spotify's Web Playback SDK
  - Real-time track progress
  - Volume control and shuffle/repeat options
  - Queue management

- **User Library**
  - Access to recently played tracks
  - Display favorite artists and albums
  - Save tracks to library
  - Browse personal music collection

### 🤖 AI-Powered Chat Interface
- **Intelligent Conversation**
  - Natural language interaction using GPT-4/Google Gemini
  - Context-aware music recommendations
  - Music discovery through conversation
  - Playlist generation based on chat input

- **Personalized Recommendations**
  - Analysis of listening history
  - Genre and artist preferences learning
  - Mood-based song suggestions
  - Discovery of similar artists and tracks

### 😊 Emotion Analysis
- **Sentiment Detection**
  - Real-time analysis of chat messages
  - Emotion classification (happy, sad, energetic, calm, etc.)
  - Mood tracking over time

- **Emotional Response**
  - Curated playlists based on current mood
  - Dynamic song suggestions matching emotional state
  - Mood-transition aware recommendations

## 🛠️ Technical Stack

- **Frontend**
  - Next.js 14
  - Shadcn UI
  - React 18
  - TailwindCSS
  - TypeScript
  - SWR for data fetching
  - Radix UI components
  - Recharts for data visualization

- **Backend**
  - Node.js
  - NextAuth.js
  - Spotify Web API
  - Anthropic API

- **Authentication**
  - OAuth 2.0
  - JWT tokens
  - Secure session management

## 📋 Prerequisites

- Node.js (v18 or higher)
- Spotify Developer Account
- Anthropic API key
- Modern web browser with JavaScript enabled

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/spotify-ai-stuff.git
cd spotify-ai-stuff
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables:
```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
ANTHROPIC_API_KEY=your_anthropic_api_key
NEXTAUTH_URL=http://localhost:3000
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔑 API Configuration

### Spotify API Setup
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new application
3. Add `http://localhost:3000/api/auth/callback/spotify` to Redirect URIs
4. Copy Client ID and Client Secret to your `.env.local` file

### Anthropic Claude Setup
1. Obtain API key from [Anthropic](https://anthropic.com)
2. Add key to `.env.local` file
