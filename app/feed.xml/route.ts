import { getSortedArticles } from '@/lib/articles'


export async function GET() {
  const articles = getSortedArticles()
  const siteUrl = 'https://sutra.rohanyashraj.com'

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Sutra - Actuarial Blog</title>
    <link>${siteUrl}</link>
    <description>The premier actuarial blog exploring the intersection of actuarial science, artificial intelligence, and modern technology.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${articles
      .map((article) => {
        const url = `${siteUrl}/${article.category.toLowerCase().replace(/\s+/g, '-')}/${article.id}`
        return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(article.date).toUTCString()}</pubDate>
      <description><![CDATA[${article.description}]]></description>
      <category>${article.category}</category>
    </item>`
      })
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
