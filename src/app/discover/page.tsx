"use client"

import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Music, 
  Sparkles, 
  MessageCircle, 
  History, 
  Radio, 
  ArrowLeft,
  Plus,
  Wand2,
  Clock
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIChatInterface } from '@/components/AIChatInterface';

const DiscoverPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('chat');

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <div className="container mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-zinc-800 rounded mb-4"></div>
            <div className="h-4 w-64 bg-zinc-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show auth error
  if (!session) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        {/* Back button and header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/')}
            className="rounded-full hover:bg-zinc-800"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-white">Discover</h1>
            <p className="text-zinc-400">Let AI help you find your next favorite song</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main AI Chat Section */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="chat" onValueChange={setActiveTab}>
              <TabsList className="bg-zinc-900 border border-zinc-800">
                <TabsTrigger value="chat" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  AI Chat
                </TabsTrigger>
                <TabsTrigger value="radio" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">
                  <Radio className="h-4 w-4 mr-2" />
                  Smart Radio
                </TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">
                  <History className="h-4 w-4 mr-2" />
                  History
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="chat" className="mt-4">
                {activeTab === 'chat' && <AIChatInterface />}
              </TabsContent>
              
              <TabsContent value="radio">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-white">Smart Radio</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Continuous music based on your current mood and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-zinc-400 text-center py-8">
                      <Radio className="h-8 w-8 mx-auto mb-4" />
                      <p>Coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="history">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-white">Discovery History</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Songs and playlists you've discovered through AI
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-zinc-400 text-center py-8">
                      <History className="h-8 w-8 mx-auto mb-4" />
                      <p>Your discovery history will appear here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Wand2 className="h-5 w-5 text-green-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:border-green-500 transition-all duration-300 text-white"
                >
                  <Sparkles className="h-4 w-4 mr-2 text-green-500" />
                  Generate Daily Mix
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:border-green-500 transition-all duration-300 text-white"
                >
                  <Music className="h-4 w-4 mr-2 text-green-500" />
                  Mood-based Playlist
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:border-green-500 transition-all duration-300 text-white"
                >
                  <Plus className="h-4 w-4 mr-2 text-green-500" />
                  Custom Playlist
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/time-machine')}
                  className="w-full justify-start bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:border-green-500 transition-all duration-300 text-white"
                >
                  <Clock className="h-4 w-4 mr-2 text-green-500" />
                  Time Machine
                </Button>
              </CardContent>
            </Card>

            {/* Recent Discoveries */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <History className="h-5 w-5 text-green-500" />
                  Recent Discoveries
                </CardTitle>
                <CardDescription className="text-zinc-400">Songs you've recently found</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-zinc-400 text-center py-8">
                  <Music className="h-8 w-8 mx-auto mb-4" />
                  <p>Start discovering to see your history</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;
