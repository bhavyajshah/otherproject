import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://turanline.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/login/',
        '/profile/',
        '/basket/',
        '/favorites/',
        '/order/',
        '/successfulPaymentPage/',
        '/unsuccessfulPaymentPage/',
      ],
    },
    sitemap: `${baseUrl}/en/sitemap.xml`,
  }
}