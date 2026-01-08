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
  metadataBase: new URL('https://sutra.rohanyashraj.com'),
  title: {
    default: "Sutra - Actuarial Blog | AI, Risk & Technology Insights",
    template: "%s | Sutra - Actuarial Blog"
  },
  description: "A leading actuarial blog exploring actuarial science, artificial intelligence, risk modeling, and technology. Expert insights on insurance, pension, and data-driven actuarial practices by Rohan Yashraj Gupta.",
  keywords: [
    "actuarial blog",
    "actuarial science",
    "actuarial science blog",
    "AI in actuarial",
    "actuarial technology",
    "risk modeling",
    "insurance analytics",
    "pension actuarial",
    "data science for actuaries",
    "actuarial AI",
    "actuarial insights",
    "actuarial articles",
  ],
  authors: [{ name: "Rohan Yashraj Gupta", url: "https://rohanyashraj.com" }],
  creator: "Rohan Yashraj Gupta",
  publisher: "Sutra",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sutra.rohanyashraj.com",
    siteName: "Sutra - Actuarial Blog",
    title: "Sutra - Actuarial Blog | AI, Risk & Technology Insights",
    description: "A leading actuarial blog exploring actuarial science, AI, risk modeling, and technology insights.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Sutra - Actuarial Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sutra - Actuarial Blog | AI, Risk & Technology Insights",
    description: "A leading actuarial blog exploring actuarial science, AI, risk modeling, and technology insights.",
    images: ["/logo.png"],
    creator: "@rohanyashraj",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://sutra.rohanyashraj.com",
  },
}

// JSON-LD WebSite Schema for rich snippets
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Sutra - Actuarial Blog",
  description: "A leading actuarial blog exploring actuarial science, AI, risk modeling, and technology insights.",
  url: "https://sutra.rohanyashraj.com",
  author: {
    "@type": "Person",
    name: "Rohan Yashraj Gupta",
    url: "https://rohanyashraj.com",
  },
  publisher: {
    "@type": "Person",
    name: "Rohan Yashraj Gupta",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
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

