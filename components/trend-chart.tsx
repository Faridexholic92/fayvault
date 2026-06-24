export function TrendChart({
  data,
}: {
  data: { label: string; value: number }[]
}) {
  const width = 640
  const height = 200
  const padX = 8
  const padY = 16
  const n = data.length
  const max = Math.max(1, ...data.map((d) => d.value))
  const xFor = (i: number) =>
    padX + (i * (width - padX * 2)) / Math.max(1, n - 1)
  const yFor = (v: number) => height - padY - (v / max) * (height - padY * 2)

  const points = data.map((d, i) => [xFor(i), yFor(d.value)] as const)
  const line = points
    .map(
      ([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`,
    )
    .join(" ")
  const area =
    n > 0
      ? `${line} L ${xFor(n - 1).toFixed(1)} ${height - padY} L ${xFor(
          0,
        ).toFixed(1)} ${height - padY} Z`
      : ""

  const labelStep = Math.max(1, Math.floor(n / 6))

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height + 24}`} className="w-full h-auto">
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </linearGradient>
        </defs>
        {area && <path d={area} fill="url(#trendFill)" />}
        {line && (
          <path
            d={line}
            fill="none"
            stroke="#16a34a"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}
        {data.map((d, i) =>
          i % labelStep === 0 ? (
            <text
              key={i}
              x={xFor(i)}
              y={height + 16}
              textAnchor="middle"
              fontSize="11"
              fill="#9ca3af"
            >
              {d.label}
            </text>
          ) : null,
        )}
      </svg>
    </div>
  )
}
