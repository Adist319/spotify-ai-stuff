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
Your responses should always be natural and conversational.

When recommending music:
1. First list the recommended songs in a clear, numbered format
2. Then provide your conversational commentary
3. Finally include the JSON object with structured recommendations

Example format:
1. "Song Name" by Artist
2. "Another Song" by Another Artist
(etc...)

[Your conversational response here]

---JSON---
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
---JSON---

Only include the JSON section when you are specifically recommending music.
For general music discussions, questions, or conversations that don't involve direct recommendations, respond conversationally without the JSON structure.

Always provide detailed, engaging responses that demonstrate your music knowledge while maintaining a friendly, conversational tone.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,  // Increased from 1024
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
