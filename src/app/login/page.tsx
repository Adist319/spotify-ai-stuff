'use client';

import { useEffect } from 'react';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  useEffect(() => {
    // Automatically redirect to Spotify OAuth
    signIn('spotify', { callbackUrl: '/' });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting to Spotify...</h1>
        <p className="text-zinc-400">Please wait while we redirect you to Spotify for authentication.</p>
      </div>
    </div>
  );
}

