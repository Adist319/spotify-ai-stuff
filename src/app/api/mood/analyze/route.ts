import { NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';
import { CLAUDE_MODEL } from '@/lib/claude';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    const { input } = await req.json();

    if (!input) {
      return NextResponse.json(
        { error: 'No input provided' },
        { status: 400 }
      );
    }

    const message = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Given this mood description: "${input}"

Please analyze it and provide:
1. Appropriate Spotify audio feature values (energy, valence, danceability, acousticness, instrumentalness)
2. A natural language description of the mood
3. Recommended music genres that match this mood
4. Additional contextual notes about the musical characteristics

Format your response as JSON with these exact keys:
{
  "audioFeatures": {
    "energy": number (0-1),
    "valence": number (0-1),
    "danceability": number (0-1),
    "acousticness": number (0-1),
    "instrumentalness": number (0-1)
  },
  "moodDescription": string,
  "recommendedGenres": string[],
  "contextualNotes": string
}

Ensure all numeric values are between 0 and 1.`,
      }],
    });

    const response = message.content[0].type === 'text' ? message.content[0].text : '';
    
    try {
      const data = JSON.parse(response);
      return NextResponse.json(data);
    } catch (parseError) {
      console.error('Error parsing Claude response:', response);
      return NextResponse.json(
        { error: 'Failed to parse mood analysis' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error analyzing mood:', error);
    return NextResponse.json(
      { error: 'Failed to analyze mood' },
      { status: 500 }
    );
  }
}
