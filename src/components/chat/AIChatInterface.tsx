// components/AIChatInterface.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Loader2, MessageCircle, Trash2 } from 'lucide-react';
import { useChat } from '@/app/hooks/useChat';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { ChatMessage } from '@/types/chat';
import { cn } from '@/lib/utils';
import { AIChatTypingIndicator } from './AIChatTypingIndicator';
import toast from 'react-hot-toast';

export function AIChatInterface() {
  const [inputMessage, setInputMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, error, sendMessage, clearChat } = useChat();

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const message = inputMessage;
    setInputMessage('');
    
    try {
      await sendMessage(message);
      toast.success('Message sent successfully!');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-zinc-900 rounded-lg border border-zinc-800">
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <h2 className="text-lg font-semibold text-white">AI Music Assistant</h2>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            className="text-zinc-400 hover:text-white"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Chat
          </Button>
        )}
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-zinc-400 text-center mt-8">
            <MessageCircle className="h-8 w-8 mx-auto mb-4 text-green-500" />
            <p className="text-lg mb-2">Start a conversation about music!</p>
            <p className="text-sm">Try:</p>
            <p className="text-sm italic">"Find me something like Radiohead but more electronic"</p>
            <p className="text-sm italic">"I'm feeling energetic, what should I listen to?"</p>
            <p className="text-sm italic">"Create a playlist for a dinner party"</p>
          </div>
        ) : (
          <>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'mb-4 rounded-lg p-4',
                  message.role === 'assistant' 
                    ? 'bg-zinc-800' 
                    : 'bg-green-500/10'
                )}
              >
                <p className="text-white whitespace-pre-wrap">{message.content}</p>
              </div>
            ))}
            {isLoading && <AIChatTypingIndicator />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      <div className="p-4 border-t border-zinc-800">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask anything about music..."
            disabled={isLoading}
            className="flex-1 bg-zinc-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          />
          <Button 
            type="submit"
            disabled={isLoading}
            className="bg-green-500 hover:bg-green-400 text-black font-medium transition-all duration-300 shadow-[0_0_15px_rgba(29,185,84,0.3)] hover:shadow-[0_0_20px_rgba(29,185,84,0.5)]"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <MessageCircle className="h-5 w-5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
