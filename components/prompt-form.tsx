"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { parseVariables } from "@/lib/parse-variables"
import { PromptEditor } from "@/components/prompt-editor"
import type { Prompt } from "@/lib/types"

export function PromptForm({ prompt }: { prompt?: Prompt }) {
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState(prompt?.title ?? "")
  const [description, setDescription] = useState(prompt?.description ?? "")
  const [body, setBody] = useState(prompt?.body ?? "")
  const [tagsInput, setTagsInput] = useState((prompt?.tags ?? []).join(", "))
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")

  const variables = parseVariables(body)
  const tags = tagsInput
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)

  async function save() {
    setSaving(true)
    setMsg("")
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setMsg("Sesi tamat. Sila log masuk semula.")
      setSaving(false)
      return
    }

    const payload = {
      owner_id: user.id,
      title,
      description,
      body,
      tags,
      variables,
      updated_at: new Date().toISOString(),
    }

    const res = prompt
      ? await supabase.from("prompts").update(payload).eq("id", prompt.id)
      : await supabase.from("prompts").insert(payload)

    if (res.error) {
      setMsg(res.error.message)
      setSaving(false)
      return
    }
    router.push("/vault")
    router.refresh()
  }

  async function remove() {
    if (!prompt) return
    if (!confirm("Padam prompt ni?")) return
    await supabase.from("prompts").delete().eq("id", prompt.id)
    router.push("/vault")
    router.refresh()
  }

  // ---- Test Live (bonus) ----
  const [values, setValues] = useState<Record<string, string>>({})
  const [output, setOutput] = useState("")
  const [running, setRunning] = useState(false)

  async function testLive() {
    setRunning(true)
    setOutput("")
    const res = await fetch("/api/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body, variables: values }),
    })
    const data = await res.json()
    setOutput(data.output ?? data.error ?? "")
    setRunning(false)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4 bg-white border rounded-xl p-5">
        <div>
          <label className="block text-sm font-medium mb-1">Tajuk</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="cth: Email follow-up client"
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Penerangan ringkas
          </label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional"
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Isi prompt</label>
          <PromptEditor value={body} onChange={setBody} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Tag (pisah dengan koma)
          </label>
          <input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="email, marketing, coding"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={save}
            disabled={saving || !title || !body}
            className="bg-black text-white rounded px-4 py-2 disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
          {prompt && (
            <button
              onClick={remove}
              className="text-red-600 text-sm hover:underline"
            >
              Padam
            </button>
          )}
          {msg && <span className="text-sm text-red-600">{msg}</span>}
        </div>
      </div>

      <details className="bg-white border rounded-xl p-5">
        <summary className="cursor-pointer font-medium">
          ✨ Test Live (bonus) - cuba prompt dengan AI
        </summary>
        <div className="mt-4 space-y-3">
          {variables.length === 0 && (
            <p className="text-sm text-gray-500">
              Tiada variable. Tambah {"{nama}"} dalam isi prompt untuk borang
              auto.
            </p>
          )}
          {variables.map((name) => (
            <div key={name}>
              <label className="block text-sm font-medium">{name}</label>
              <input
                value={values[name] ?? ""}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [name]: e.target.value }))
                }
                className="w-full border rounded px-2 py-1"
              />
            </div>
          ))}
          <button
            onClick={testLive}
            disabled={running || !body}
            className="bg-gray-800 text-white rounded px-4 py-2 disabled:opacity-50"
          >
            {running ? "Menjana..." : "Test Live"}
          </button>
          {output && (
            <pre className="bg-gray-100 p-3 rounded whitespace-pre-wrap text-sm">
              {output}
            </pre>
          )}
        </div>
      </details>
    </div>
  )
}
