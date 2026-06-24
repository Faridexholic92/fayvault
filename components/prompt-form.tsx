"use client"

import { useState, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { parseVariables } from "@/lib/parse-variables"
import { PromptEditor } from "@/components/prompt-editor"
import { savePrompt, deletePrompt } from "@/app/vault/actions"
import { createClient } from "@/lib/supabase/client"
import type { Prompt } from "@/lib/types"

export function PromptForm({ prompt }: { prompt?: Prompt }) {
  const router = useRouter()
  const [supabase] = useState(() => createClient())

  const [title, setTitle] = useState(prompt?.title ?? "")
  const [description, setDescription] = useState(prompt?.description ?? "")
  const [body, setBody] = useState(prompt?.body ?? "")
  const [tagsInput, setTagsInput] = useState((prompt?.tags ?? []).join(", "))
  const [imageUrl, setImageUrl] = useState<string | null>(
    prompt?.image_url ?? null,
  )
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")

  const variables = parseVariables(body)
  const tags = tagsInput
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)

  async function onPickImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setMsg("")
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setMsg("Sesi tamat. Sila log masuk semula.")
      setUploading(false)
      return
    }
    const ext = (file.name.split(".").pop() || "png").toLowerCase()
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`
    const { error } = await supabase.storage
      .from("covers")
      .upload(path, file, { upsert: true, cacheControl: "3600" })
    if (error) {
      setMsg("Upload gambar gagal: " + error.message)
      setUploading(false)
      return
    }
    const { data } = supabase.storage.from("covers").getPublicUrl(path)
    setImageUrl(data.publicUrl)
    setUploading(false)
  }

  async function onSave() {
    setSaving(true)
    setMsg("")
    const result = await savePrompt({
      id: prompt?.id,
      title,
      description,
      body,
      tags,
      imageUrl,
    })
    if ("error" in result) {
      setMsg(result.error)
      setSaving(false)
      return
    }
    router.push("/vault")
    router.refresh()
  }

  async function onDelete() {
    if (!prompt) return
    if (!confirm("Padam prompt ni?")) return
    const result = await deletePrompt(prompt.id)
    if ("error" in result) {
      setMsg(result.error)
      return
    }
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
            placeholder="cth: Poster Iklan Makanan"
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
            placeholder="Optional - cth: sumber ChatGPT"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Gambar cover (optional)
          </label>
          <div className="flex items-center gap-4">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt="cover"
                className="h-20 w-20 rounded-lg object-cover border"
              />
            ) : (
              <div className="h-20 w-20 rounded-lg border border-dashed flex items-center justify-center text-gray-400 text-xs text-center">
                Tiada gambar
              </div>
            )}
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={onPickImage}
                disabled={uploading}
                className="block text-sm"
              />
              {uploading && (
                <p className="text-xs text-gray-500">Memuat naik...</p>
              )}
              {imageUrl && !uploading && (
                <button
                  type="button"
                  onClick={() => setImageUrl(null)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Buang gambar
                </button>
              )}
            </div>
          </div>
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
            placeholder="poster, makanan, marketing"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onSave}
            disabled={saving || uploading || !title || !body}
            className="bg-black text-white rounded px-4 py-2 disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
          {prompt && (
            <button
              onClick={onDelete}
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
