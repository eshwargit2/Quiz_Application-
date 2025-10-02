import { SignupForm } from "@/components/auth/signup-form"

export default function SignupPage() {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <main className="w-full max-w-md px-4">
        <div className="glass-effect rounded-xl p-8 border-2 border-white/20 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
            ✨ Join the Fun!
          </h1>
          <SignupForm />
        </div>
      </main>
    </div>
  )
}
