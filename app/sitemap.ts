import { MetadataRoute } from 'next'
import { getSortedArticles, getCategorisedArticles } from '@/lib/articles'
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { sanitizeSlug } from '@/lib/slug'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Helper to convert category to URL-friendly slug
const categoryToSlug = (category: string) => sanitizeSlug(category)

const ARCHIVE_TYPES = ['trivia', 'market-pulse', 'code-sutra', 'genai-frontiers', 'actuarial-simplified'];

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const articles = getSortedArticles()
    const categories = Object.keys(getCategorisedArticles())
    const baseUrl = 'https://sutra.rohanyashraj.com'

    // Fetch broadcasts from Convex
    let broadcasts: any[] = [];
    try {
        broadcasts = await convex.query(api.broadcasts.getAllBroadcasts);
    } catch (error) {
        console.error("Failed to fetch broadcasts for sitemap:", error);
    }

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

    const archiveTypeUrls = ARCHIVE_TYPES.map((type) => ({
        url: `${baseUrl}/archive/${type}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.7,
    }))

    const broadcastUrls = broadcasts.map((broadcast) => ({
        url: `${baseUrl}/archive/${broadcast.type}/${broadcast.slug}`,
        lastModified: new Date(broadcast.publishedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
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
            lastModified: new Date('2024-01-01'),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/archive`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.7,
        },
        ...categoryUrls,
        ...articleUrls,
        ...archiveTypeUrls,
        ...broadcastUrls,
    ]
}
