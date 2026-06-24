"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [mode, setMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [msg, setMsg] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMsg("")
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) setMsg(error.message)
      else {
        router.push("/vault")
        router.refresh()
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) setMsg(error.message)
      else setMsg("Akaun dicipta. Jika pengesahan email aktif, semak inbox kau.")
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm space-y-4 bg-white p-6 rounded-xl border"
      >
        <h1 className="text-xl font-bold">
          {mode === "login" ? "Log Masuk" : "Daftar Akaun"}
        </h1>
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="password"
          required
          placeholder="Kata laluan"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white rounded py-2 disabled:opacity-50"
        >
          {loading ? "Sebentar..." : mode === "login" ? "Log Masuk" : "Daftar"}
        </button>
        {msg && <p className="text-sm text-red-600">{msg}</p>}
        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="text-sm text-gray-600 hover:underline w-full"
        >
          {mode === "login"
            ? "Belum ada akaun? Daftar"
            : "Dah ada akaun? Log masuk"}
        </button>
      </form>
    </main>
  )
}
