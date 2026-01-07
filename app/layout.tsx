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
        className={`${cormorantGaramond.variable} ${outfit.variable} bg-white text-zinc-900 antialiased selection:bg-zinc-900 selection:text-white flex flex-col min-h-screen`}
      >
        <div className="flex-grow">
          {children}
        </div>
        <footer className="border-t border-zinc-100 py-12 mt-20">
          <div className="mx-auto w-11/12 lg:w-3/4 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-zinc-400 text-xs font-medium tracking-wider">
              © 2026, Sutra by <span className="text-zinc-950">Rohan Yashraj Gupta</span>
            </p>
            <a 
              href="https://rohanyashraj.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-zinc-950 text-xs font-bold uppercase tracking-[0.2em] transition-colors"
            >
              rohanyashraj.com
            </a>
          </div>
        </footer>
      </body>
    </html>
  )
}
