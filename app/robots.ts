// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://turanline.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/catalog',
          '/about',
          '/delivery',
          '/contacts',
          '/product/*',
          '/category/*'
        ],
        disallow: [
          '/api/',
          '/login/',
          '/profile/',
          '/basket/',
          '/favorites/',
          '/order/',
          '/successfulPaymentPage/',
          '/unsuccessfulPaymentPage/',
          '/*?*', // Disallow URL parameters
          '/*.json$', // Disallow JSON files
          '/*.xml$', // Disallow XML files
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: ['/'], // Disallow GPT bot if needed
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}