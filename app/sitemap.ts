import { MetadataRoute } from 'next'
import { getSortedArticles, getCategorisedArticles } from '@/lib/articles'

export const dynamic = 'force-static'

// Helper to convert category to URL-friendly slug
const categoryToSlug = (category: string) => category.toLowerCase().replace(/\s+/g, '-')

export default function sitemap(): MetadataRoute.Sitemap {
    const articles = getSortedArticles()
    const categories = Object.keys(getCategorisedArticles())
    const baseUrl = 'https://sutra.rohanyashraj.com'

    const categoryUrls = categories.map((category) => ({
        url: `${baseUrl}/${categoryToSlug(category)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }))

    const articleUrls = articles.map((article) => ({
        url: `${baseUrl}/${categoryToSlug(article.category)}/${article.id}`,
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
        ...categoryUrls,
        ...articleUrls,
    ]
}
