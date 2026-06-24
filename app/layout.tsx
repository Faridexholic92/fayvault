import type { Metadata } from "next"
import { type ReactNode } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Prompt Vault",
  description: "Simpan & susun koleksi prompt kau",
}

const themeScript = `
(function(){try{
  if (localStorage.getItem('pv-dark') === '1') {
    document.documentElement.classList.add('dark');
  }
  var a = localStorage.getItem('pv-accent') || 'green';
  document.documentElement.setAttribute('data-accent', a);
}catch(e){}})();
`

const scriptProps = { __html: themeScript }

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ms" data-accent="green">
      <head>
        <script dangerouslySetInnerHTML={scriptProps} />
      </head>
      <body className="bg-gray-50 text-gray-900">{children}</body>
    </html>
  )
}
