import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CollectionManager } from "@/components/collection-manager"

export const dynamic = "force-dynamic"

export default async function KoleksiPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const [{ data: colData }, { data: promptData }] = await Promise.all([
    supabase
      .from("collections")
      .select("id, name, created_at")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false }),
    supabase.from("prompts").select("collection_id").eq("owner_id", user.id),
  ])

  const counts = new Map<string, number>()
  for (const p of promptData ?? []) {
    const cid = p.collection_id as string | null
    if (cid) counts.set(cid, (counts.get(cid) ?? 0) + 1)
  }

  const collections = (colData ?? []).map((c) => ({
    id: c.id as string,
    name: c.name as string,
    count: counts.get(c.id as string) ?? 0,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Koleksi</h1>
        <p className="text-gray-500">Susun prompt kau dalam folder.</p>
      </div>
      <CollectionManager collections={collections} />
    </div>
  )
}
