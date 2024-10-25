import Anthropic from '@anthropic-ai/sdk';

// Only initialize on server-side
let anthropic: Anthropic | null = null;

if (typeof window === 'undefined') {
  anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  });
}

export const CLAUDE_MODEL = 'claude-3-5-sonnet-20241022';
export const MAX_TOKENS = 4096;

export { anthropic };
