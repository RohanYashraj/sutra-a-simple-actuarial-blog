import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://sutra.rohanyashraj.com'

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
            },
            {
                userAgent: ['GPTBot', 'CCBot', 'Google-Extended'],
                allow: '/',
            }
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
