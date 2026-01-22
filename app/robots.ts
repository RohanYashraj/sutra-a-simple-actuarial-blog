import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://sutra.rohanyashraj.com'

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/unsubscribe/'],
            },
            {
                userAgent: [
                    'GPTBot',
                    'Claude-WebCheck',
                    'Anthropic-AI',
                    'PerplexityBot',
                    'YouBot',
                    'CCBot',
                    'Google-Extended',
                    'Amazonbot',
                    'FacebookBot',
                    'Applebot',
                    'Cohere-ai',
                    'Omgilibot',
                    'Bytespider'
                ],
                allow: '/',
                disallow: ['/api/', '/unsubscribe/'],
            }
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        // Added IndexNow location as recommended for discovery
        // Host: https://www.bing.com/indexnow?url=https://sutra.rohanyashraj.com/&key=c17efa90160a454196e1be8669fd0689
    }
}
