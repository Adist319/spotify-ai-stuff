// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from './providers/AuthProvider';

export const metadata: Metadata = {
  title: "MySpotifyAI | AI-Powered Music Companion",
  description: "Experience music like never before with AI-powered recommendations and emotional analysis.",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}