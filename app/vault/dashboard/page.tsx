import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { TrendChart } from "@/components/trend-chart"
import { PromptThumb } from "@/components/prompt-thumb"

export const dynamic = "force-dynamic"

function StatCard({
  label,
  value,
  sub,
  valueClass,
  subClass,
}: {
  label: string
  value: string
  sub: string
  valueClass: string
  subClass?: string
}) {
  return (
    <div className="bg-white border rounded-xl p-5">
      <div className="text-sm text-gray-500">{label}</div>
      <div className={`text-3xl font-bold mt-1 ${valueClass}`}>{value}</div>
      <div className={`text-xs mt-1 ${subClass ?? "text-gray-400"}`}>{sub}</div>
    </div>
  )
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const [{ data: promptData }, { data: colData }] = await Promise.all([
    supabase
      .from("prompts")
      .select("id, title, description, tags, collection_id, created_at, updated_at")
      .eq("owner_id", user.id)
      .order("updated_at", { ascending: false }),
    supabase.from("collections").select("id, name").eq("owner_id", user.id),
  ])

  const prompts = promptData ?? []
  const collections = colData ?? []
  const t = (s: string) => new Date(s).getTime()

  const total = prompts.length

  // Tag counts
  const tagCounts = new Map<string, number>()
  for (const p of prompts) {
    for (const tag of ((p.tags as string[] | null) ?? [])) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1)
    }
  }
  const uniqueTags = tagCounts.size
  const topTags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1])
  const topTag = topTags[0]?.[0] ?? "—"

  // Growth bulan ini vs bulan lepas
  const now = new Date()
  const startThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
  const startLastMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1,
  ).getTime()
  const thisMonth = prompts.filter((p) => t(p.created_at) >= startThisMonth)
    .length
  const lastMonth = prompts.filter((p) => {
    const x = t(p.created_at)
    return x >= startLastMonth && x < startThisMonth
  }).length
  const growth =
    lastMonth === 0
      ? thisMonth > 0
        ? 100
        : 0
      : Math.round(((thisMonth - lastMonth) / lastMonth) * 1000) / 10

  // Minggu ni
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const thisWeek = prompts.filter((p) => t(p.created_at) >= weekAgo).length
  const avgPerDay = (thisWeek / 7).toFixed(1)

  // Koleksi paling aktif
  const colCounts = new Map<string, number>()
  for (const p of prompts) {
    const cid = p.collection_id as string | null
    if (cid) colCounts.set(cid, (colCounts.get(cid) ?? 0) + 1)
  }
  let activeCol = "—"
  let activeMax = -1
  for (const c of collections) {
    const cnt = colCounts.get(c.id as string) ?? 0
    if (cnt > activeMax) {
      activeMax = cnt
      activeCol = c.name as string
    }
  }

  // Tren 30 hari
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const trend: { label: string; value: number }[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const start = d.getTime()
    const end = start + 86400000
    const value = prompts.filter((p) => {
      const x = t(p.created_at)
      return x >= start && x < end
    }).length
    trend.push({
      label: `${d.getDate()} ${d.toLocaleDateString("ms-MY", {
        month: "short",
      })}`,
      value,
    })
  }

  const monthLabel = now.toLocaleDateString("ms-MY", {
    month: "long",
    year: "numeric",
  })
  const recent = prompts.slice(0, 6)

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-3xl font-bold">
            Selamat Kembali ke Prompt Vault!
          </h1>
          <p className="text-gray-500 mt-1">
            Ringkasan data dan tren koleksi prompt anda.
          </p>
        </div>
        <div className="text-sm text-gray-400">
          Dikemaskini {now.toLocaleDateString("ms-MY")}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Prompts"
          value={total.toLocaleString("ms-MY")}
          valueClass="text-emerald-600"
          sub={`${growth >= 0 ? "+" : ""}${growth}% vs bulan lepas`}
          subClass={growth >= 0 ? "text-emerald-600" : "text-red-500"}
        />
        <StatCard
          label="Tag Unik"
          value={uniqueTags.toLocaleString("ms-MY")}
          valueClass="text-purple-600"
          sub={`Paling banyak: ${topTag}`}
        />
        <StatCard
          label="Baru Minggu Ni"
          value={thisWeek.toLocaleString("ms-MY")}
          valueClass="text-blue-600"
          sub={`Avg. ${avgPerDay} prompt/hari`}
        />
        <StatCard
          label="Koleksi Terbina"
          value={`${collections.length} Koleksi`}
          valueClass="text-gray-900"
          sub={`Paling aktif: ${activeCol}`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-xl p-5">
          <h2 className="font-semibold mb-3">
            Tren Penciptaan Prompt ({monthLabel})
          </h2>
          <TrendChart data={trend} />
        </div>

        <div className="bg-white border rounded-xl p-5">
          <h2 className="font-semibold mb-3">Prompt Terkini</h2>
          {recent.length === 0 ? (
            <p className="text-sm text-gray-500">Belum ada prompt.</p>
          ) : (
            <ul className="divide-y">
              {recent.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/vault/${p.id}`}
                    className="flex items-center gap-3 py-2.5 hover:bg-gray-50 rounded-lg px-1"
                  >
                    <PromptThumb title={p.title as string} />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{p.title}</div>
                      {p.description && (
                        <div className="text-sm text-gray-500 truncate">
                          {p.description}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 shrink-0">
                      {new Date(p.updated_at as string).toLocaleDateString(
                        "ms-MY",
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/vault"
            className="block text-center text-sm text-blue-600 hover:underline mt-3 pt-3 border-t"
          >
            Lihat Semua Prompt
          </Link>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="font-semibold">Tag Teratas</h2>
        {topTags.length === 0 ? (
          <p className="text-sm text-gray-500">Belum ada tag.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {topTags.slice(0, 12).map(([tag, c]) => (
              <Link
                key={tag}
                href={`/vault?tag=${encodeURIComponent(tag)}`}
                className="text-sm bg-white border rounded-full px-3 py-1 hover:border-gray-400"
              >
                {tag} <span className="text-gray-400">({c})</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
