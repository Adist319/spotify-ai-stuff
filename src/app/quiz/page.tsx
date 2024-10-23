"use client"

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Brain, 
  ArrowLeft, 
  Trophy, 
  Calendar, 
  Clock, 
  Music2, 
  Share2,
  Timer,
  ChevronRight,
  RefreshCcw,
  ThumbsUp,
  HeartCrack
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

// Sample question types (would be generated based on user's history)
const sampleQuestions = [
  {
    type: 'timeMemory',
    question: "What were you listening to on New Year's Eve 2023?",
    options: [
      'Midnight City - M83',
      'All I Do Is Win - DJ Khaled',
      'Auld Lang Syne - Traditional',
      'Celebration - Kool & The Gang'
    ],
    correct: 2
  },
  {
    type: 'artistInsight',
    question: 'Which of these artists did you listen to most in Summer 2023?',
    options: [
      'Taylor Swift',
      'The Weeknd',
      'Arctic Monkeys',
      'Drake'
    ],
    correct: 0
  },
  {
    type: 'genreChallenge',
    question: 'Your most played genre at work hours (9-5) is:',
    options: [
      'Lo-fi Beats',
      'Classic Rock',
      'Pop',
      'Jazz'
    ],
    correct: 1
  }
];

const MusicQuiz = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizComplete, setQuizComplete] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowAnswer(true);
    
    if (answerIndex === sampleQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }

    // Delay before moving to next question
    setTimeout(() => {
      if (currentQuestion < sampleQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowAnswer(false);
      } else {
        setQuizComplete(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setQuizComplete(false);
    setShowAnswer(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
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
            <h1 className="text-4xl font-bold text-white">Music Quiz</h1>
            <p className="text-zinc-400">Test your musical memory</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Quiz Section */}
          <div className="lg:col-span-2">
            <Card className="bg-zinc-900 border-zinc-800">
              {!quizComplete ? (
                <>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-green-500" />
                        <CardTitle className="text-white">Question {currentQuestion + 1} of {sampleQuestions.length}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Timer className="h-4 w-4 text-zinc-400" />
                        <span className="text-zinc-400">Your Time: 2:45</span>
                      </div>
                    </div>
                    <Progress 
                      value={(currentQuestion + 1) / sampleQuestions.length * 100} 
                      className="bg-zinc-800 h-2"
                    />
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="text-xl font-medium mt-4 text-zinc-100">
                      {sampleQuestions[currentQuestion].question}
                    </div>
                    
                    <div className="grid gap-4">
                      {sampleQuestions[currentQuestion].options.map((option, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className={`w-full justify-start p-6 text-left text-lg transition-all duration-300
                            ${showAnswer
                              ? index === sampleQuestions[currentQuestion].correct
                                ? 'border-green-500 bg-green-500/10 text-green-400'
                                : index === selectedAnswer
                                ? 'border-red-500 bg-red-500/10 text-red-400'
                                : 'border-zinc-700 bg-zinc-800 text-zinc-400'
                              : 'border-zinc-700 bg-zinc-800 text-zinc-100 hover:bg-zinc-700/80 hover:text-white hover:border-green-500/50'
                            }
                          `}
                          onClick={() => !showAnswer && handleAnswer(index)}
                          disabled={showAnswer}
                        >
                          <div className="flex items-center gap-3">
                            {showAnswer && index === sampleQuestions[currentQuestion].correct && (
                              <ThumbsUp className="h-5 w-5 text-green-500" />
                            )}
                            {showAnswer && index === selectedAnswer && index !== sampleQuestions[currentQuestion].correct && (
                              <HeartCrack className="h-5 w-5 text-red-500" />
                            )}
                            {option}
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="p-12 text-center">
                  <Trophy className="h-16 w-16 text-green-500 mx-auto mb-6" />
                  <h2 className="text-3xl glow-text font-bold mb-4">Quiz Complete!</h2>
                  <p className="text-xl text-zinc-400 mb-8">
                    You scored {score} out of {sampleQuestions.length}
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={resetQuiz}
                      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 hover:text-white"
                    >
                      <RefreshCcw className="h-4 w-4 mr-2" />
                      Try Again
                    </Button>
                    <Button
                      className="bg-green-500 hover:bg-green-400 text-black"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Score
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quiz Stats */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Trophy className="h-5 w-5 text-green-500" />
                  Your Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">High Score</span>
                    <span className="text-white font-medium">8/10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Quizzes Completed</span>
                    <span className="text-white font-medium">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Best Time</span>
                    <span className="text-white font-medium">1:45</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quiz Types */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Music2 className="h-5 w-5 text-green-500" />
                  Quiz Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-between bg-zinc-800 border-zinc-700 hover:bg-zinc-700/80 hover:border-green-500/50 text-zinc-100 hover:text-white transition-all duration-300"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-green-500" />
                      Memory Lane
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-between bg-zinc-800 border-zinc-700 hover:bg-zinc-700/80 hover:border-green-500/50 text-zinc-100 hover:text-white transition-all duration-300"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-500" />
                      Time Machine
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-between bg-zinc-800 border-zinc-700 hover:bg-zinc-700/80 hover:border-green-500/50 text-zinc-100 hover:text-white transition-all duration-300"
                  >
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-green-500" />
                      AI Challenge
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicQuiz;