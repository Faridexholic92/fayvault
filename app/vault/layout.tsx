import { type ReactNode } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SignOutButton } from "@/components/signout-button"

export default async function VaultLayout({
  children,
}: {
  children: ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  return (
    <div className="max-w-3xl mx-auto p-6">
      <header className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-6">
          <Link href="/vault/dashboard" className="text-lg font-bold">
            🧰 Prompt Vault
          </Link>
          <nav className="flex items-center gap-4 text-sm text-gray-600">
            <Link href="/vault/dashboard" className="hover:text-black">
              Dashboard
            </Link>
            <Link href="/vault" className="hover:text-black">
              Semua Prompt
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/vault/new"
            className="bg-black text-white text-sm rounded px-3 py-1.5"
          >
            + Prompt Baru
          </Link>
          <SignOutButton />
        </div>
      </header>
      {children}
    </div>
  )
}
