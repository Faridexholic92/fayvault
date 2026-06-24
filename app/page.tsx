"use client"

import { useState } from "react"
import { PromptEditor } from "@/components/prompt-editor"
import { VariableForm } from "@/components/variable-form"
import { parseVariables } from "@/lib/parse-variables"

export default function Home() {
  const [body, setBody] = useState(
    "Tuliskan email dalam {bahasa} dengan nada {nada} tentang {topik}.",
  )
  const variables = parseVariables(body)

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Prompt Vault</h1>
        <p className="text-gray-500">Demo: tulis prompt, isi variable, Test Live.</p>
      </div>
      <PromptEditor value={body} onChange={setBody} />
      <VariableForm body={body} variables={variables} />
    </main>
  )
}
