import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const AuthError = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case 'OAuthSignin':
        return 'An error occurred during Spotify authentication initialization. This may be due to incorrect client credentials or missing environment variables.';
      case 'OAuthCallback':
        return 'An error occurred while processing the authentication callback from Spotify.';
      case 'OAuthCreateAccount':
        return 'Could not create a user account using the Spotify credentials.';
      case 'EmailCreateAccount':
        return 'Could not create a user account with the provided email address.';
      case 'Callback':
        return 'An error occurred during the authentication callback process.';
      case 'AccessDenied':
        return 'Access was denied to your Spotify account. Please ensure you approve the necessary permissions.';
      case 'Configuration':
        return 'There is a server configuration error. Please check the server settings.';
      default:
        return 'An unexpected authentication error occurred. Please try again.';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900 rounded-lg p-8 shadow-lg">
        <div className="flex items-center justify-center mb-6">
          <AlertTriangle className="h-12 w-12 text-yellow-500" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-4">Authentication Error</h1>
        <p className="text-zinc-400 text-center mb-6">
          {getErrorMessage(error)}
        </p>
        <div className="space-y-4">
          <div className="bg-zinc-800 rounded p-4 text-sm">
            <p className="text-zinc-400">Error Code: <span className="text-white">{error}</span></p>
          </div>
          <div className="flex flex-col gap-4">
            <Link 
              href="/"
              className="bg-zinc-800 hover:bg-zinc-700 text-white py-2 px-4 rounded text-center transition-colors"
            >
              Return Home
            </Link>
            <button 
              onClick={() => window.location.href = '/api/auth/signin'}
              className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold py-2 px-4 rounded transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthError;