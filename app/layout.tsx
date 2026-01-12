import type { Metadata } from "next"
import { Suspense } from "react"

import { Cormorant_Garamond, Outfit } from "next/font/google"
import "./globals.css"
import PHProvider from './providers/PostHogProvider'
import PostHogPageView from "./providers/PostHogPageView"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Footer from "./components/Footer"
import StickySubscribe from "./components/StickySubscribe"

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
        <Footer />
        <StickySubscribe />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

