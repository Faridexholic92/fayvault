import { type ReactNode } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SignOutButton } from "@/components/signout-button"
import { ThemeControls } from "@/components/theme-controls"

const NAV = [
  { href: "/vault/dashboard", label: "Dashboard" },
  { href: "/vault", label: "Semua Prompt" },
  { href: "/vault/koleksi", label: "Koleksi" },
  { href: "/vault/analisis", label: "Analisis" },
  { href: "/vault/bantuan", label: "Bantuan" },
]

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
    <div className="max-w-6xl mx-auto p-6">
      <header className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-6 flex-wrap">
          <Link href="/vault/dashboard" className="text-lg font-bold">
            🧰 Prompt Vault
          </Link>
          <nav className="flex items-center gap-4 text-sm text-gray-600">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="hover:text-black">
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/vault/new"
            className="btn-primary text-sm rounded px-3 py-1.5"
          >
            + Prompt Baru
          </Link>
          <ThemeControls />
          <SignOutButton />
        </div>
      </header>
      {children}
    </div>
  )
}
