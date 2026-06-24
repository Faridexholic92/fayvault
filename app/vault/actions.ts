"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { parseVariables } from "@/lib/parse-variables"

export async function savePrompt(input: {
  id?: string
  title: string
  description: string
  body: string
  tags: string[]
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const payload = {
    owner_id: user.id,
    title: input.title,
    description: input.description,
    body: input.body,
    tags: input.tags,
    variables: parseVariables(input.body),
    updated_at: new Date().toISOString(),
  }

  const res = input.id
    ? await supabase.from("prompts").update(payload).eq("id", input.id)
    : await supabase.from("prompts").insert(payload)

  if (res.error) {
    return { error: res.error.message }
  }

  revalidatePath("/vault")
  redirect("/vault")
}

export async function deletePrompt(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  await supabase.from("prompts").delete().eq("id", id)
  revalidatePath("/vault")
  redirect("/vault")
}
