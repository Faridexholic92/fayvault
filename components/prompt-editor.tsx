"use client"

import CodeMirror from "@uiw/react-codemirror"
import { markdown } from "@codemirror/lang-markdown"
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
      <CodeMirror
        value={value}
        height="220px"
        extensions={[markdown()]}
        onChange={onChange}
        className="border rounded overflow-hidden"
      />
      <p className="text-sm text-gray-500">
        Variable dikesan:{" "}
        {vars.length ? vars.map((v) => `{${v}}`).join(", ") : "tiada"}
      </p>
    </div>
  )
}
