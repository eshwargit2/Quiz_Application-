import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import Quiz from "@/models/quiz"
import { requireAdmin } from "@/lib/auth"

export async function GET() {
  await dbConnect()
  const quizzes = await Quiz.find({}).select("title description category timeLimitSec")
  return NextResponse.json({ quizzes })
}

export async function POST(req: Request) {
  await dbConnect()
  requireAdmin()
  const body = await req.json()
  const { title, description, category, timeLimitSec } = body
  if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 })
  const quiz = await Quiz.create({
    title,
    description: description || "",
    category: category || "General",
    timeLimitSec: timeLimitSec || 60,
    questionIds: [],
  })
  return NextResponse.json({ quiz })
}
