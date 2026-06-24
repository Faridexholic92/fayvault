"use client"

import { useState } from "react"

export function VariableForm({
  body,
  variables,
}: {
  body: string
  variables: string[]
}) {
  const [values, setValues] = useState<Record<string, string>>({})
  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function run() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, variables: values }),
      })
      const data = await res.json()
      if (data.error) setError(data.error)
      else setOutput(data.output ?? "")
    } catch {
      setError("Ralat rangkaian.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      {variables.map((name) => (
        <div key={name}>
          <label className="block text-sm font-medium">{name}</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={values[name] ?? ""}
            onChange={(e) =>
              setValues((v) => ({ ...v, [name]: e.target.value }))
            }
          />
        </div>
      ))}
      <button
        onClick={run}
        disabled={loading}
        className="bg-black text-white rounded px-4 py-2 disabled:opacity-50"
      >
        {loading ? "Menjana..." : "Test Live"}
      </button>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {output && (
        <pre className="bg-gray-100 p-3 rounded whitespace-pre-wrap text-sm">
          {output}
        </pre>
      )}
    </div>
  )
}
