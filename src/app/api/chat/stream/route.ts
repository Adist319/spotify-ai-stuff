import { NextRequest, NextResponse } from 'next/server';
import { anthropic } from '@/lib/claude';
import { getToken } from 'next-auth/jwt';

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req: req as any });
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messages } = await req.json();

    if (!anthropic) {
      throw new Error('Anthropic client not initialized');
    }

    const systemPrompt = `You are a knowledgeable and personalized music recommendation assistant. 
When recommending music, always structure your response in two parts:

1. A natural, conversational response to the user
2. A JSON object containing the structured recommendations

The JSON should be formatted as follows:
{
  "recommendations": [{
    "track": {
      "name": string,
      "artist": string,
      "reason": string
    },
    "mood"?: string,
    "context"?: string
  }]
}

Always wrap the JSON section with ---JSON--- markers.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      temperature: 0.7,
      system: systemPrompt,
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }))
    });

    // Extract the text content from the response
    const content = response.content[0].type === 'text'
      ? response.content[0].text
      : '';

    return NextResponse.json({ content });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
