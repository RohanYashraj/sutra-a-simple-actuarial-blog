import { MetadataRoute } from 'next'
import { getSortedArticles, getCategorisedArticles } from '@/lib/articles'

// Helper to convert category to URL-friendly slug
const categoryToSlug = (category: string) => category.toLowerCase().replace(/\s+/g, '-')

export default function sitemap(): MetadataRoute.Sitemap {
    const articles = getSortedArticles()
    const categories = Object.keys(getCategorisedArticles())
    const baseUrl = 'https://sutra.rohanyashraj.com'

    const categoryUrls = categories.map((category) => ({
        url: `${baseUrl}/${categoryToSlug(category)}`,
        lastModified: new Date('2024-01-01'),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }))

    const articleUrls = articles.map((article) => ({
        url: `${baseUrl}/${categoryToSlug(article.category)}/${article.id}`,
        lastModified: (() => {
            const [day, month, year] = article.date.split('-')
            return new Date(`${year}-${month}-${day}`)
        })(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date('2024-01-01'),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date('2024-01-01'),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        ...categoryUrls,
        ...articleUrls,
    ]
}
