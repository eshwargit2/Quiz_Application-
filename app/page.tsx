'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface User {
  _id: string
  email: string
  name: string
  isAdmin: boolean
  avatarId?: number
}

interface Quiz {
  _id: string
  title: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  questions: any[]
  timeLimit: number
}

export default function HomePage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check authentication status
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data?.user || null))
      .catch(() => setUser(null))

    // Fetch available quizzes
    fetch('/api/quizzes')
      .then(res => res.ok ? res.json() : [])
      .then(data => setQuizzes(data))
      .catch(() => setQuizzes([]))
      .finally(() => setIsLoading(false))
  }, [])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500'
      case 'Medium': return 'bg-yellow-500'
      case 'Hard': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen gradient-bg">
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        {/* Animated Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold animate-float bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            🎯 Animated Quiz App ✨
          </h1>
          <p className="text-xl text-white/80 animate-fade-in-up">
            Test your knowledge with our interactive animated quizzes
          </p>
        </div>

        {/* Auth Status & Navigation */}
        <div className="glass-effect rounded-xl p-6 border-2 border-white/20 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {user ? (
              <div className="text-white/90">
                <span className="text-lg">Welcome back! 👋</span>
              </div>
            ) : (
              <div className="text-white/80">
                <span>Ready to start your quiz journey?</span>
              </div>
            )}
            
            <div className="flex gap-3">
              {user ? (
                <>
                  {user.isAdmin && (
                    <Link href="/admin">
                      <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        ⚡ Admin Dashboard
                      </Button>
                    </Link>
                  )}
                  <Link href="/leaderboard">
                    <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                      🏆 Leaderboard
                    </Button>
                  </Link>
                  <Button 
                    onClick={() => {
                      fetch('/api/auth/logout', { method: 'POST' })
                        .then(() => window.location.reload())
                    }}
                    variant="outline" 
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                      🔑 Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      🚀 Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Available Quizzes */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-white text-center animate-slide-in-left">
            🧠 Available Quizzes
          </h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <Card key={i} className="glass-effect border-white/20 animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-white/20 rounded"></div>
                    <div className="h-4 bg-white/10 rounded"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-white/10 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : quizzes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz, index) => (
                <Card 
                  key={quiz._id} 
                  className="glass-effect border-white/20 card-hover animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-white text-lg">{quiz.title}</CardTitle>
                      <Badge className={`${getDifficultyColor(quiz.difficulty)} text-white`}>
                        {quiz.difficulty}
                      </Badge>
                    </div>
                    <CardDescription className="text-white/70">
                      {quiz.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm text-white/60">
                      <span>📝 {quiz.questions?.length || 0} questions</span>
                      <span>⏱️ {quiz.timeLimit} min</span>
                    </div>
                    
                    {user ? (
                      <Link href={`/quiz/${quiz._id}`}>
                        <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                          Start Quiz 🚀
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/login">
                        <Button 
                          variant="outline" 
                          className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          Login to Start 🔐
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="glass-effect border-white/20 animate-fade-in-up">
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-white mb-2">No Quizzes Available</h3>
                <p className="text-white/70">Check back later for new quizzes!</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="glass-effect border-white/20 animate-slide-in-left">
            <CardContent className="text-center py-8">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold text-white mb-2">Fast & Responsive</h3>
              <p className="text-white/70 text-sm">Lightning-fast quiz experience with smooth animations</p>
            </CardContent>
          </Card>
          
          <Card className="glass-effect border-white/20 animate-fade-in-up">
            <CardContent className="text-center py-8">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-lg font-semibold text-white mb-2">Leaderboards</h3>
              <p className="text-white/70 text-sm">Compete with others and track your progress</p>
            </CardContent>
          </Card>
          
          <Card className="glass-effect border-white/20 animate-slide-in-right">
            <CardContent className="text-center py-8">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-white mb-2">Detailed Analytics</h3>
              <p className="text-white/70 text-sm">Get insights into your quiz performance</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
