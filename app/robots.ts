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
                userAgent: ['GPTBot', 'CCBot', 'Google-Extended'],
                allow: '/',
                disallow: ['/api/', '/unsubscribe/'],
            }
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
