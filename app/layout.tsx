import type { Metadata } from "next"
import { type ReactNode } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Prompt Vault",
  description: "Simpan & susun koleksi prompt kau",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ms">
      <body className="bg-gray-50 text-gray-900">{children}</body>
    </html>
  )
}
