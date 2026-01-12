import type { Metadata } from "next"
import { Suspense } from "react"

import { Cormorant_Garamond, Outfit } from "next/font/google"
import "./globals.css"
import PHProvider from './providers/PostHogProvider'
import PostHogPageView from "./providers/PostHogPageView"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Subscribe from "./components/Subscribe"

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
  description: "The premier actuarial blog exploring the intersection of actuarial science, artificial intelligence, and modern technology. Expert insights on insurance, pension, and data-driven actuarial practices by Rohan Yashraj Gupta.",
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
    "AISEO",
    "Generative AI in Actuarial",
    "Future of Actuarial Science",
    "Actuarial AI Guide",
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
        alt: "Sutra - The Premier Actuarial Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sutra - Actuarial Blog | AI, Risk & Technology Insights",
    description: "The premier actuarial blog exploring the intersection of actuarial science, artificial intelligence, and modern technology. Expert insights by Rohan Yashraj Gupta.",
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
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
}

// JSON-LD WebSite Schema for rich snippets
// JSON-LD Graph Schema for AISEO (Organization, Person, WebSite)
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://sutra.rohanyashraj.com/#website",
      "url": "https://sutra.rohanyashraj.com",
      "name": "Sutra - Actuarial Blog",
      "description": "The premier actuarial blog exploring the intersection of actuarial science, artificial intelligence, and modern technology.",
      "publisher": { "@id": "https://sutra.rohanyashraj.com/#organization" },
      "inLanguage": "en-US"
    },
    {
      "@type": "Organization",
      "@id": "https://sutra.rohanyashraj.com/#organization",
      "name": "Sutra",
      "url": "https://sutra.rohanyashraj.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sutra.rohanyashraj.com/logo.png"
      },
      "founder": { "@id": "https://rohanyashraj.com/#person" }
    },
    {
      "@type": "Person",
      "@id": "https://rohanyashraj.com/#person",
      "name": "Rohan Yashraj Gupta",
      "url": "https://rohanyashraj.com",
      "sameAs": [
        "https://rohanyashraj.com",
        "https://github.com/RohanYashraj"
      ],
      "jobTitle": "Actuary & AI Enthusiast",
      "description": "Rohan Yashraj Gupta is an actuary and technologist specializing in the application of AI and machine learning in actuarial science."
    }
  ]
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${cormorantGaramond.variable} ${outfit.variable} bg-white text-zinc-900 antialiased selection:bg-zinc-900 selection:text-white flex flex-col min-h-screen`}
      >
        <PHProvider>
          <Suspense fallback={null}>
            <PostHogPageView />
          </Suspense>
        <div className="flex-grow">
          {children}
        </div>
        </PHProvider>
        <footer className="border-t border-zinc-100 py-12 mt-20">
          <div className="mx-auto w-11/12 lg:w-3/4 flex flex-col gap-12">
            
            <Subscribe />

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-zinc-100 pt-8">
              <div className="flex items-center gap-4">
                <p className="text-zinc-400 text-xs font-medium tracking-wider">
                   © 2026, Sutra by <span className="text-zinc-700">Rohan Yashraj Gupta</span>
                </p>
                <a 
                  href="/feed.xml" 
                  className="text-zinc-400 hover:text-zinc-600 transition-colors"
                  aria-label="RSS Feed"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M3.75 4.5a.75.75 0 01.75-.75h.75c8.284 0 15 6.716 15 15v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75C18 11.708 13.292 7 7.5 7H6.75a.75.75 0 01-.75-.75V4.5zm0 6a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75H4.5a.75.75 0 01-.75-.75v-.75zm0 6a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75H4.5a.75.75 0 01-.75-.75v-.75z" clipRule="evenodd" />
                    <path d="M3.75 17.25a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0z" />
                  </svg>
                </a>
              </div>

              <a 
                href="https://rohanyashraj.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-zinc-950 text-xs font-bold uppercase tracking-[0.2em] transition-colors"
              >
                rohanyashraj.com
              </a>
            </div>
          </div>
        </footer>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

