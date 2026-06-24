"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createCollection, deleteCollection } from "@/app/vault/actions"

type Col = { id: string; name: string; count: number }

export function CollectionManager({ collections }: { collections: Col[] }) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState("")

  async function add() {
    if (!name.trim()) return
    setBusy(true)
    setMsg("")
    const r = await createCollection(name)
    setBusy(false)
    if ("error" in r) {
      setMsg(r.error)
      return
    }
    setName("")
    router.refresh()
  }

  async function remove(id: string) {
    if (!confirm("Padam koleksi ni? Prompt di dalamnya tak dipadam.")) return
    const r = await deleteCollection(id)
    if ("error" in r) {
      alert(r.error)
      return
    }
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama koleksi baru..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={add}
          disabled={busy || !name.trim()}
          className="btn-primary rounded px-4 py-2 disabled:opacity-50"
        >
          {busy ? "..." : "Tambah"}
        </button>
      </div>
      {msg && <p className="text-sm text-red-600">{msg}</p>}
      {collections.length === 0 ? (
        <p className="text-gray-500">Belum ada koleksi. Tambah satu di atas.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {collections.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between bg-white border rounded-lg p-4"
            >
              <div>
                <div className="font-medium">📁 {c.name}</div>
                <div className="text-sm text-gray-500">{c.count} prompt</div>
              </div>
              <button
                onClick={() => remove(c.id)}
                className="text-red-500 hover:text-red-700 text-lg"
                aria-label="Padam koleksi"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
