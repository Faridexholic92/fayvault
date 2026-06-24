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

  const { error } = await supabase.rpc("save_prompt", {
    p_id: input.id ?? null,
    p_title: input.title,
    p_description: input.description,
    p_body: input.body,
    p_tags: input.tags,
    p_variables: parseVariables(input.body),
  })

  if (error) {
    if (error.message.includes("TIDAK_LOG_MASUK")) {
      return { error: "Sesi tamat. Sila log keluar & log masuk semula." }
    }
    return { error: error.message }
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
