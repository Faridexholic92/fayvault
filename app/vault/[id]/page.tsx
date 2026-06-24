import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PromptForm } from "@/components/prompt-form"

export const dynamic = "force-dynamic"

export default async function EditPromptPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: prompt } = await supabase
    .from("prompts")
    .select("*")
    .eq("id", params.id)
    .eq("owner_id", user.id)
    .single()

  if (!prompt) notFound()

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Edit Prompt</h1>
      <PromptForm prompt={prompt} />
    </div>
  )
}
