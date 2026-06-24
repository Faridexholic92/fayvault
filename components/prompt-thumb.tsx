const GRADIENTS = [
  "from-pink-500 to-rose-500",
  "from-indigo-500 to-blue-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-purple-500 to-fuchsia-500",
  "from-cyan-500 to-sky-500",
]

function hash(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

export function PromptThumb({
  title,
  src,
}: {
  title: string
  src?: string | null
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={title}
        className="h-10 w-10 shrink-0 rounded-lg object-cover border"
      />
    )
  }
  const g = GRADIENTS[hash(title) % GRADIENTS.length]
  const letter = (title.trim()[0] ?? "P").toUpperCase()
  return (
    <div
      className={`h-10 w-10 shrink-0 rounded-lg bg-gradient-to-br ${g} flex items-center justify-center text-white font-bold`}
    >
      {letter}
    </div>
  )
}
