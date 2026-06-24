import { GoogleGenerativeAI } from "@google/generative-ai"
import { fillVariables } from "@/lib/parse-variables"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Perlu log masuk." }, { status: 401 })
    }

    const { body, variables } = await req.json()
    const finalPrompt = fillVariables(body, variables ?? {})

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
    const result = await model.generateContent(finalPrompt)

    return NextResponse.json({ output: result.response.text() })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Gagal jana output. Semak GEMINI_API_KEY." },
      { status: 500 },
    )
  }
}
