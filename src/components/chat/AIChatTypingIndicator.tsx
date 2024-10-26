import { Loader2 } from 'lucide-react';

export function AIChatTypingIndicator() {
  return (
    <div className="flex items-center gap-2 p-4 rounded-lg bg-zinc-800 mb-4">
      <Loader2 className="h-4 w-4 text-green-500 animate-spin" />
      <div className="flex gap-1">
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" 
              style={{ animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" 
              style={{ animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" 
              style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}