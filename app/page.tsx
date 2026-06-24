import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function Home({
  searchParams,
}: {
  searchParams: { code?: string }
}) {
  // Link pengesahan email kadang mendarat di root dengan ?code=...
  // Alihkan ke /auth/callback untuk tukar code jadi sesi.
  if (searchParams.code) {
    redirect(`/auth/callback?code=${searchParams.code}`)
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  redirect(user ? "/vault/dashboard" : "/login")
}
