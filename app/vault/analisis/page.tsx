import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

function Bar({
  label,
  value,
  max,
  color,
}: {
  label: string
  value: number
  max: number
  color: string
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="text-gray-500">{value}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded">
        <div
          className={`h-2 rounded ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default async function AnalisisPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data } = await supabase
    .from("prompts")
    .select("tags, visibility")
    .eq("owner_id", user.id)

  const prompts = data ?? []
  const total = prompts.length

  const tagCounts = new Map<string, number>()
  for (const p of prompts) {
    for (const tag of ((p.tags as string[] | null) ?? [])) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1)
    }
  }
  const topTags = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
  const maxTag = topTags[0]?.[1] ?? 0

  const publicCount = prompts.filter((p) => p.visibility === "public").length
  const privateCount = total - publicCount

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Analisis</h1>
        <p className="text-gray-500">Pecahan terperinci koleksi prompt kau.</p>
      </div>

      <section className="bg-white border rounded-xl p-5 space-y-4">
        <h2 className="font-semibold">Taburan Tag (Top 10)</h2>
        {topTags.length === 0 ? (
          <p className="text-sm text-gray-500">Belum ada tag.</p>
        ) : (
          <div className="space-y-3">
            {topTags.map(([tag, c]) => (
              <Bar
                key={tag}
                label={tag}
                value={c}
                max={maxTag}
                color="bg-purple-500"
              />
            ))}
          </div>
        )}
      </section>

      <section className="bg-white border rounded-xl p-5 space-y-4">
        <h2 className="font-semibold">Keterlihatan</h2>
        <Bar label="Private" value={privateCount} max={total} color="bg-gray-700" />
        <Bar label="Public" value={publicCount} max={total} color="bg-emerald-500" />
      </section>
    </div>
  )
}
