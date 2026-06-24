"use client"

import { useEffect, useState } from "react"

const ACCENTS: { id: string; color: string }[] = [
  { id: "green", color: "#16a34a" },
  { id: "blue", color: "#2563eb" },
  { id: "purple", color: "#7c3aed" },
  { id: "pink", color: "#db2777" },
  { id: "orange", color: "#ea580c" },
  { id: "black", color: "#111827" },
]

const dotStyle = (c: string) => ({ backgroundColor: c })

export function ThemeControls() {
  const [dark, setDark] = useState(false)
  const [accent, setAccent] = useState("green")
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"))
    setAccent(
      document.documentElement.getAttribute("data-accent") || "green",
    )
  }, [])

  function toggleDark() {
    const nv = !dark
    setDark(nv)
    document.documentElement.classList.toggle("dark", nv)
    try {
      localStorage.setItem("pv-dark", nv ? "1" : "0")
    } catch {}
  }

  function pick(id: string) {
    setAccent(id)
    document.documentElement.setAttribute("data-accent", id)
    try {
      localStorage.setItem("pv-accent", id)
    } catch {}
  }

  const current = ACCENTS.find((a) => a.id === accent) ?? ACCENTS[0]

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleDark}
        title="Tukar mod gelap/terang"
        aria-label="Tukar mod gelap/terang"
        className="text-lg leading-none px-2 py-1 rounded hover:bg-gray-100"
      >
        {dark ? "☀️" : "🌙"}
      </button>
      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          title="Pilih warna tema"
          aria-label="Pilih warna tema"
          className="h-6 w-6 rounded-full border"
          style={dotStyle(current.color)}
        />
        {open && (
          <div className="absolute right-0 mt-2 z-30 flex gap-2 bg-white border rounded-lg p-2 shadow-lg">
            {ACCENTS.map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  pick(a.id)
                  setOpen(false)
                }}
                aria-label={a.id}
                className={`h-6 w-6 rounded-full border ${
                  accent === a.id ? "ring-2 ring-offset-1 ring-gray-400" : ""
                }`}
                style={dotStyle(a.color)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
