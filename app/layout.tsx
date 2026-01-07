import type { Metadata } from "next"
import { Cormorant_Garamond, Outfit } from "next/font/google"
import "./globals.css"

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant-garamond",
  weight: ["300", "400", "600"],
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "600", "700"],
})

export const metadata: Metadata = {
  title: "sutra - a simple actuarial blog",
  description: "A minimalist space for actuarial science, AI, and technology insights.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${cormorantGaramond.variable} ${outfit.variable} bg-white text-zinc-900 antialiased selection:bg-zinc-900 selection:text-white`}
      >
        {children}
      </body>
    </html>
  )
}
