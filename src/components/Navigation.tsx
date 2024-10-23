'use client'

import React, { useState } from 'react'
import { Music, Menu, X, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { useSession, signIn, signOut } from "next-auth/react"
import { UserPopover } from '@/components/user/UserPopover'

const navigationLinks = [
  { name: 'Home', href: '/' },
  { name: 'Features', href: '/features' },
  { name: 'About', href: '/about' },
] as const

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session, status } = useSession()
  const pathname = usePathname()

  const handleAuth = async () => {
    if (session) {
      await signOut()
    } else {
      try {
        const result = await signIn('spotify', { callbackUrl: '/' })
        console.log('SignIn result:', result)
      } catch (error) {
        console.error('SignIn error:', error)
      }
    }
  }

  const isActivePath = (path: string) => {
    if (path === '/' && pathname !== '/') {
      return false
    }
    return pathname?.startsWith(path)
  }

  // Auth button component to maintain DRY principle
  const AuthButton = () => (
    <Button
      onClick={handleAuth}
      className={
        session 
          ? "bg-zinc-800 hover:bg-zinc-700 text-white shadow-[0_0_15px_rgba(29,185,84,0.5)] hover:shadow-[0_0_20px_rgba(29,185,84,0.7)] transition-all duration-300" 
          : "bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold shadow-[0_0_15px_rgba(29,185,84,0.3)] hover:shadow-[0_0_20px_rgba(29,185,84,0.5)] transition-all duration-300"
      }
    >
      {status === 'loading' 
        ? 'Loading...' 
        : session 
          ? 'Sign Out' 
          : 'Login with Spotify'
      }
    </Button>
  )

  // User Info component
  const UserInfo = () => {
    if (!session?.user) return null;
    
    return <UserPopover sessionUser={session.user} />;
  };

  return (
    <nav className="px-6 py-4 border-b border-zinc-800 sticky top-0 bg-black/95 backdrop-blur-sm z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Music className="h-8 w-8 text-[#1DB954]" />
          <span className="text-xl font-bold text-white">MySpotifyAI</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navigationLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`transition-colors relative ${
                isActivePath(link.href)
                  ? "text-[#1DB954] after:content-[''] after:absolute after:left-0 after:bottom-[-8px] after:w-full after:h-[2px] after:bg-[#1DB954]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex items-center gap-4">
            {session && <UserInfo />}
            <AuthButton />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-zinc-900 border-b border-zinc-800 py-4">
          <div className="container mx-auto px-6 flex flex-col gap-4">
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-colors ${
                  isActivePath(link.href)
                    ? "text-[#1DB954]"
                    : "text-zinc-400 hover:text-white"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {session && <UserInfo />}
            <AuthButton />
          </div>
        </div>
      )}
    </nav>
  )
}