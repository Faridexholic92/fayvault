"use client"

import { parseVariables } from "@/lib/parse-variables"

export function PromptEditor({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const vars = parseVariables(value)
  return (
    <div className="space-y-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
        placeholder="Tulis isi prompt kau di sini... guna {pemboleh_ubah} untuk medan dinamik"
        className="w-full border rounded p-3 text-sm leading-relaxed font-mono whitespace-pre-wrap break-words resize-y bg-white"
      />
      <p className="text-sm text-gray-500">
        Variable dikesan:{" "}
        {vars.length ? vars.map((v) => `{${v}}`).join(", ") : "tiada"}
      </p>
    </div>
  )
}
