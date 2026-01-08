import { MetadataRoute } from 'next'
import { getSortedArticles } from '@/lib/articles'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
    const articles = getSortedArticles()
    const baseUrl = 'https://sutra.rohanyashraj.com'

    const articleUrls = articles.map((article) => ({
        url: `${baseUrl}/${article.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        ...articleUrls,
    ]
}
