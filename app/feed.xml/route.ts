import { getSortedArticles } from '@/lib/articles'
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { sanitizeSlug } from '@/lib/slug';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const TYPE_LABELS: Record<string, string> = {
  trivia: "Sutra Trivia",
  "market-pulse": "Market Pulse",
  "code-sutra": "Code Sutra",
  "genai-frontiers": "GenAI Frontiers",
  "actuarial-simplified": "Actuarial Simplified",
};

export const dynamic = 'force-dynamic';

export async function GET() {
  const articles = getSortedArticles()
  const siteUrl = 'https://sutra.rohanyashraj.com'

  // Fetch broadcasts from Convex
  let broadcasts: any[] = [];
  try {
    broadcasts = await convex.query(api.broadcasts.getAllBroadcasts);
  } catch (error) {
    console.error("Failed to fetch broadcasts for feed:", error);
  }

  // Combine and sort
  const combinedItems = [
    ...articles.map(a => ({
      title: a.title,
      link: `${siteUrl}/${sanitizeSlug(a.category)}/${a.id}`,
      pubDate: (() => {
        const [day, month, year] = a.date.split('-');
        return new Date(`${year}-${month}-${day}`).toUTCString();
      })(),
      description: a.description,
      category: a.category
    })),
    ...broadcasts.map(b => ({
      title: b.title,
      link: `${siteUrl}/archive/${b.type}/${b.slug}`,
      pubDate: new Date(b.publishedAt).toUTCString(),
      description: `${TYPE_LABELS[b.type] || b.type} - Archived Insight`,
      category: TYPE_LABELS[b.type] || b.type
    }))
  ].sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Sutra - High-Value Actuarial &amp; AI Weekly</title>
    <link>${siteUrl}</link>
    <description>Exploring the thread between actuarial rigor and exponential AI with a fresh insight every morning at 08:00 UTC.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${combinedItems
      .map((item) => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.link}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <description><![CDATA[${item.description}]]></description>
      <category>${item.category.replace(/&/g, '&amp;')}</category>
    </item>`)
      .join('')}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}
