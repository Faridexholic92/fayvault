import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PromptList } from "@/components/prompt-list"

export const dynamic = "force-dynamic"

export default async function VaultPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data, error } = await supabase
    .from("prompts")
    .select("id, title, description, tags, updated_at")
    .eq("owner_id", user.id)
    .order("updated_at", { ascending: false })

  if (error) {
    return (
      <p className="text-red-600 text-sm">
        Ralat baca senarai: {error.message}
      </p>
    )
  }

  return <PromptList prompts={data ?? []} />
}
