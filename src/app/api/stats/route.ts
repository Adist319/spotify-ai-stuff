// app/api/stats/route.ts
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { ChartDataPoint, GenreData, SpotifyStatsResponse } from '@/types/stats';

export async function GET(req: Request) {
  try {
    const token = await getToken({ req });
    
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = new URL(req.url).searchParams;
    const timeRange = searchParams.get('timeRange') || 'medium_term';

    // Fetch data from Spotify API
    const [topArtists, topTracks, recentlyPlayed] = await Promise.all([
      fetch('https://api.spotify.com/v1/me/top/artists?limit=20&time_range=' + timeRange, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      }),
      fetch('https://api.spotify.com/v1/me/top/tracks?limit=20&time_range=' + timeRange, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      }),
      fetch('https://api.spotify.com/v1/me/player/recently-played?limit=50', {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      }),
    ]);

    if (!topArtists.ok || !topTracks.ok || !recentlyPlayed.ok) {
      throw new Error('Failed to fetch data from Spotify');
    }

    const [artistsData, tracksData, recentData] = await Promise.all([
      topArtists.json(),
      topTracks.json(),
      recentlyPlayed.json(),
    ]);

    // Process the data
    const processedData: SpotifyStatsResponse = {
      topItems: {
        artists: artistsData.items.map((artist: any) => ({
          id: artist.id,
          name: artist.name,
          image: artist.images[0]?.url,
          genres: artist.genres,
          type: 'artist',
          plays: 0, // This would need to be calculated from listening history
          url: artist.external_urls.spotify,
        })),
        albums: [], // We'll need to process this from tracks data
        tracks: tracksData.items.map((track: any) => ({
          id: track.id,
          name: track.name,
          image: track.album.images[0]?.url,
          artist: track.artists[0].name,
          type: 'track',
          plays: 0, // This would need to be calculated from listening history
          url: track.external_urls.spotify,
          duration: track.duration_ms,
          previewUrl: track.preview_url,
        })),
        timeRange,
      },
      listeningActivity: processListeningActivity(recentData.items),
      genreDistribution: calculateGenreDistribution(artistsData.items),
      quickStats: calculateQuickStats(recentData.items, artistsData.items),
    };

    return NextResponse.json(processedData);
  } catch (error) {
    console.error('Stats API Error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch stats data' },
      { status: 500 }
    );
  }
}

// Helper functions
function processListeningActivity(recentTracks: any[]): ChartDataPoint[] {
  const last7Days = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const activityMap = recentTracks.reduce((acc: Record<string, number>, track: any) => {
    const date = new Date(track.played_at).toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  return last7Days.map(date => ({
    label: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
    value: activityMap[date] || 0,
  }));
}

function calculateGenreDistribution(artists: any[]): GenreData[] {
  const genreCounts: Record<string, number> = {};
  let totalGenres = 0;

  artists.forEach(artist => {
    artist.genres.forEach((genre: string) => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      totalGenres++;
    });
  });

  return Object.entries(genreCounts)
    .map(([name, count]) => ({
      id: name,
      name,
      value: Math.round((count / totalGenres) * 100),
      numberOfTracks: count,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5 genres
}

function calculateQuickStats(recentTracks: any[], topArtists: any[]) {
  const uniqueArtists = new Set(recentTracks.map(item => item.track.artists[0].id)).size;
  const totalDuration = recentTracks.reduce((acc, item) => acc + item.track.duration_ms, 0);

  return {
    weeklyHours: Math.round(totalDuration / (1000 * 60 * 60)), // Convert ms to hours
    weeklyHoursChange: {
      value: 5, // This would need to be calculated by comparing to previous week
      trend: 'up' as const,
    },
    tracksPlayed: recentTracks.length,
    tracksPlayedChange: {
      value: 10, // This would need to be calculated by comparing to previous period
      trend: 'up' as const,
    },
    uniqueArtists,
    albumsPlayed: new Set(recentTracks.map(item => item.track.album.id)).size,
    countriesRepresented: new Set(topArtists.map(artist => artist.name)).size,
    totalPlaytime: `${Math.round(totalDuration / (1000 * 60 * 60))}h`,
  };
}