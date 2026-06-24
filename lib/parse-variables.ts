// Cari semua corak {nama} dalam body prompt -> senarai unik.
export function parseVariables(body: string): string[] {
  const names = new Set<string>()
  for (const m of body.matchAll(/\{([a-zA-Z0-9_]+)\}/g)) names.add(m[1])
  return [...names]
}

// Ganti {nama} dengan nilai yang diisi pengguna.
export function fillVariables(
  body: string,
  values: Record<string, string>,
): string {
  return body.replace(
    /\{([a-zA-Z0-9_]+)\}/g,
    (_, name) => values[name] ?? `{${name}}`,
  )
}
