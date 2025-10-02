"use client"

import { useState } from "react"
import useSWR, { mutate } from "swr"
import Link from "next/link"
import { fetcher } from "@/lib/fetcher"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ProfileAvatar } from "@/components/ui/profile-avatar"
import type { UserResponse, QuizzesResponse, Quiz } from "@/types"

export default function AdminDashboard() {
  const { data: me } = useSWR<UserResponse>("/api/auth/me", fetcher)
  const { data: quizzesData } = useSWR<QuizzesResponse>("/api/quizzes", fetcher)
  const { data: usersData } = useSWR<{users: any[]}>("/api/admin/users", fetcher)
  const [deletingQuizId, setDeletingQuizId] = useState<string | null>(null)
  
  // Extract quizzes and users array from the responses
  const quizzes: Quiz[] = quizzesData?.quizzes || []
  const users = usersData?.users || []

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { 
        method: "POST", 
        credentials: "include" 
      })
      window.location.href = "/"
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleDeleteQuiz = async (quizId: string, quizTitle: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the quiz "${quizTitle}"? This action cannot be undone.`
    )
    
    if (!confirmed) return

    setDeletingQuizId(quizId)
    
    try {
      const response = await fetch(`/api/quizzes/${quizId}`, {
        method: "DELETE",
        credentials: "include"
      })

      if (response.ok) {
        // Refresh the quizzes list
        mutate("/api/quizzes")
        alert(`✅ Quiz "${quizTitle}" deleted successfully!`)
      } else {
        const errorData = await response.json()
        alert(`❌ Failed to delete quiz: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error("Delete quiz error:", error)
      alert("❌ Network error - please check your connection")
    } finally {
      setDeletingQuizId(null)
    }
  }

  if (!me?.user?.isAdmin) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="glass-effect rounded-xl p-8 border-2 border-white/20 animate-fade-in-up text-center">
          <h2 className="text-2xl font-bold text-white mb-4">🔒 Access Denied</h2>
          <p className="text-white/80">You don't have permission to access this page.</p>
          <Button className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500" onClick={() => window.history.back()}>
            🔙 Go Back
          </Button>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen gradient-bg">
      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-fade-in-up">
          <div className="flex items-center gap-4">
            <ProfileAvatar 
              selectedAvatar={me.user.avatarId || 1} 
              size="lg" 
              animated={true}
            />
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent animate-float">
                ⚡ Admin Dashboard ⚡
              </h1>
              <p className="text-white/70 mt-1">Welcome, {me.user.name || me.user.email}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/">
              <Button className="glass-effect text-white border-white/30 hover:bg-white/20">
                🏠 Home
              </Button>
            </Link>
            <Link href="/profile">
              <Button className="glass-effect text-white border-white/30 hover:bg-white/20">
                ⚙️ Profile
              </Button>
            </Link>
            <Link href="/admin/import">
              <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white border-0">
                📥 Import Questions
              </Button>
            </Link>
            <Button 
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0 transform hover:scale-105 transition-all duration-300"
            >
              🚪 Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-effect border-2 border-white/20 animate-slide-in-left">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                📊 Total Quizzes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                {quizzes?.length || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-2 border-white/20 animate-slide-in-left" style={{animationDelay: '0.1s'}}>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                👥 Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                {users?.length || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-2 border-white/20 animate-slide-in-left" style={{animationDelay: '0.2s'}}>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                🎯 Quiz Attempts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
                N/A
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quiz Management */}
        <Card className="glass-effect border-2 border-white/20 animate-fade-in-up">
          <CardHeader>
            <CardTitle className="text-white text-xl">🎮 Quiz Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quizzes.map((quiz: Quiz, index: number) => (
                <div key={quiz._id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300" style={{animationDelay: `${index * 0.1}s`}}>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{quiz.title}</h3>
                    <p className="text-white/70">{quiz.description}</p>
                    <p className="text-white/50 text-sm">⏱️ 30s per question • 📝 {quiz.questionIds?.length || 0} questions</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/quiz/${quiz._id}`}>
                      <Button size="sm" className="glass-effect text-white border-white/30 hover:bg-white/20">
                        👁️ Preview
                      </Button>
                    </Link>
                    <Button 
                      size="sm" 
                      onClick={() => handleDeleteQuiz(quiz._id, quiz.title)}
                      disabled={deletingQuizId === quiz._id}
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingQuizId === quiz._id ? "🔄 Deleting..." : "🗑️ Delete"}
                    </Button>
                  </div>
                </div>
              ))}
              {(!quizzes || quizzes.length === 0) && (
                <div className="text-center py-8">
                  <p className="text-white/60 text-xl mb-4">📝 No quizzes created yet</p>
                  <Link href="/admin/import">
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0">
                      ➕ Create Your First Quiz
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card className="glass-effect border-2 border-white/20 animate-fade-in-up mt-8">
          <CardHeader>
            <CardTitle className="text-white text-xl">👥 User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user: any, index: number) => (
                <div key={user._id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="text-white font-semibold">{user.name || "No Name"}</h3>
                      <p className="text-white/70">{user.email}</p>
                    </div>
                  </div>
                </div>
              ))}
              {(!users || users.length === 0) && (
                <div className="text-center py-8">
                  <p className="text-white/60 text-xl mb-4">👥 No users found</p>
                  <p className="text-white/50">Users will appear here once they sign up.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-effect border-2 border-white/20 animate-slide-in-left">
            <CardHeader>
              <CardTitle className="text-white">🚀 Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/import">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0">
                  📥 Import Questions from Excel
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button className="w-full glass-effect text-white border-white/30 hover:bg-white/20">
                  🏆 View Leaderboard
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="glass-effect border-2 border-white/20 animate-slide-in-right">
            <CardHeader>
              <CardTitle className="text-white">📊 System Info</CardTitle>
            </CardHeader>
            <CardContent className="text-white/80 space-y-2">
              <p>🔧 Admin: {me?.user?.email}</p>
              <p>🌐 Environment: Development</p>
              <p>📅 Last Updated: {new Date().toLocaleDateString()}</p>
              <p>⚡ Status: Online</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
