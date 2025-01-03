// useChat.ts
import { useState, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { nanoid } from 'nanoid';
import { anthropic, CLAUDE_MODEL } from '@/lib/claude';
import type { AIRecommendation, ChatMessage, ChatState } from '@/types/chat';
import { parseClaudeRecommendations } from '@/lib/aiRecommendations';

export function useChat() {
  const { data: session } = useSession();
  const abortControllerRef = useRef<AbortController | null>(null);
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
  });

  const sendMessage = useCallback(async (content: string) => {
    if (!session) {
      throw new Error('Not authenticated');
    }

    const userMessage: ChatMessage = {
      id: nanoid(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: undefined
    }));

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...state.messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        })
      });

      if (!response.ok) {
        const errorMessage = response.status === 429 
          ? 'Too many requests. Please wait a moment.'
          : 'Failed to send message. Click to retry.';
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (!data.content || typeof data.content !== 'string') {
        throw new Error('Invalid response format');
      }

      // Extract conversational part by removing JSON section
      const conversationalContent = data.content
        .split(/---JSON---[\s\S]*?---JSON---/)[0]
        .trim();

      const assistantMessage: ChatMessage = {
        id: nanoid(),
        role: 'assistant',
        content: conversationalContent,
        timestamp: Date.now()
      };

      // Parse recommendations for verification purposes only
      const recommendations = parseClaudeRecommendations(data.content);
      console.log('Parsed recommendations:', recommendations); // For debugging

      setState(prev => ({
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
        error: undefined
      }));

      return { message: assistantMessage };

    } catch (error) {
      console.error('Failed to send message:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to send message',
        isLoading: false
      }));
      throw error;
    }
  }, [session, state.messages]);

  const clearChat = useCallback(() => {
    setState({ messages: [], isLoading: false });
  }, []);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage,
    clearChat,
  };
}
