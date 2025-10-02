"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useSWR("/api/auth/me", fetcher, { shouldRetryOnError: false })

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || "Login failed")
      }
      
      // Successfully logged in
      console.log("Login successful:", data)
      
      // Reload the page to update auth state
      window.location.href = "/"
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 max-w-sm mx-auto">
      <div className="grid gap-2">
        <label className="text-sm">Email</label>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <label className="text-sm">Password</label>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
      <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground">
        {loading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  )
}
