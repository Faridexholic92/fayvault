import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border rounded-xl p-5">
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </div>
  )
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data } = await supabase
    .from("prompts")
    .select("id, title, tags, created_at, updated_at")
    .eq("owner_id", user.id)
    .order("updated_at", { ascending: false })

  const prompts = data ?? []
  const total = prompts.length

  const tagCounts = new Map<string, number>()
  for (const p of prompts) {
    for (const t of ((p.tags as string[] | null) ?? [])) {
      tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1)
    }
  }
  const uniqueTags = tagCounts.size
  const topTags = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const thisWeek = prompts.filter(
    (p) => new Date(p.created_at as string).getTime() >= weekAgo,
  ).length

  const recent = prompts.slice(0, 5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Ringkasan koleksi prompt kau</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Jumlah Prompt" value={total} />
        <StatCard label="Tag Unik" value={uniqueTags} />
        <StatCard label="Baru Minggu Ni" value={thisWeek} />
      </div>

      <section className="space-y-3">
        <h2 className="font-semibold">Tag Teratas</h2>
        {topTags.length === 0 ? (
          <p className="text-sm text-gray-500">Belum ada tag.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {topTags.map(([t, c]) => (
              <Link
                key={t}
                href={`/vault?tag=${encodeURIComponent(t)}`}
                className="text-sm bg-white border rounded-full px-3 py-1 hover:border-gray-400"
              >
                {t} <span className="text-gray-400">({c})</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Prompt Terkini</h2>
          <Link href="/vault" className="text-sm text-blue-600 hover:underline">
            Lihat semua →
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-sm text-gray-500">Belum ada prompt.</p>
        ) : (
          <ul className="space-y-2">
            {recent.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/vault/${p.id}`}
                  className="block bg-white border rounded-lg p-3 hover:border-gray-400"
                >
                  <div className="font-medium">{p.title}</div>
                  <div className="text-xs text-gray-400">
                    Dikemaskini{" "}
                    {new Date(p.updated_at as string).toLocaleDateString(
                      "ms-MY",
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
