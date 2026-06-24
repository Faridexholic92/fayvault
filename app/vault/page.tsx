import { createClient } from "@/lib/supabase/server"
import { PromptList } from "@/components/prompt-list"

export default async function VaultPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("prompts")
    .select("id, title, description, tags, updated_at")
    .order("updated_at", { ascending: false })

  return <PromptList prompts={data ?? []} />
}
