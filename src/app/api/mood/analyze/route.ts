import { NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    const { input } = await req.json();

    const message = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
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
    "instrumentalness": number (0-1),
    "tempo": number
  },
  "moodDescription": string,
  "recommendedGenres": string[],
  "contextualNotes": string
}`,
      }],
    });

    const response = message.content[0].text;
    const data = JSON.parse(response);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error analyzing mood:', error);
    return NextResponse.json(
      { error: 'Failed to analyze mood' },
      { status: 500 }
    );
  }
}
