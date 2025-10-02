"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

export function SignupForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, isAdmin }),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || "Signup failed")
      }
      
      // Successfully signed up
      console.log("Signup successful:", data)
      
      // Reload the page to update auth state
      window.location.href = "/"
    } catch (err: any) {
      console.error("Signup error:", err)
      setError(err.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 max-w-sm mx-auto">
      <div className="grid gap-2">
        <label className="text-sm">Name</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <label className="text-sm">Email</label>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <label className="text-sm">Password</label>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox checked={isAdmin} onCheckedChange={(v) => setIsAdmin(Boolean(v))} id="adm" />
        <label htmlFor="adm" className="text-sm">
          Admin
        </label>
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
      <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground">
        {loading ? "Creating..." : "Create Account"}
      </Button>
    </form>
  )
}
