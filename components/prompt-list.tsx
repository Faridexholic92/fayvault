"use client"

import { useState } from "react"
import Link from "next/link"

type Item = {
  id: string
  title: string
  description: string | null
  tags: string[] | null
  updated_at: string
}

export function PromptList({ prompts }: { prompts: Item[] }) {
  const [q, setQ] = useState("")
  const [tag, setTag] = useState("")

  const allTags = [...new Set(prompts.flatMap((p) => p.tags ?? []))]

  const filtered = prompts.filter((p) => {
    const hay = (p.title + " " + (p.description ?? "")).toLowerCase()
    const matchQ = hay.includes(q.toLowerCase())
    const matchTag = !tag || (p.tags ?? []).includes(tag)
    return matchQ && matchTag
  })

  if (prompts.length === 0) {
    return (
      <p className="text-gray-500">
        Belum ada prompt. Tekan butang \"+ Prompt Baru\" untuk simpan yang
        pertama.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          placeholder="Cari prompt..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
        />
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Semua tag</option>
          {allTags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <ul className="space-y-2">
        {filtered.map((p) => (
          <li key={p.id}>
            <Link
              href={`/vault/${p.id}`}
              className="block bg-white border rounded-lg p-4 hover:border-gray-400"
            >
              <div className="font-medium">{p.title}</div>
              {p.description && (
                <div className="text-sm text-gray-500 line-clamp-1">
                  {p.description}
                </div>
              )}
              {p.tags && p.tags.length > 0 && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs bg-gray-100 rounded px-2 py-0.5"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
