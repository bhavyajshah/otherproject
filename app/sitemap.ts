// app/sitemap.ts
import { MetadataRoute } from 'next'
import { getAllProducts } from '@/services/productsAPI'
import { getAllCategories, getTypes, getSubTypes } from '@/services/categoriesAPI'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://turanline.com'
  const lastModified = new Date()

  // Get all dynamic data
  const products = await getAllProducts()
  const categories = await getAllCategories()
  const types = await getTypes()
  const subTypes = await getSubTypes()

  // Base static routes with priorities
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/catalog`,
      lastModified,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/delivery`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contacts`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/payment`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Product routes
  const productRoutes = products?.results?.map((product) => ({
    url: `${baseUrl}/product/${product.article_number}`,
    lastModified: new Date(product.date_and_time),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  })) || []

  // Category routes
  const categoryRoutes = categories?.map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })) || []

  // Type routes
  const typeRoutes = types?.map((type) => ({
    url: `${baseUrl}/category/${type.slug}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  })) || []

  // SubType routes
  const subTypeRoutes = subTypes?.map((subType) => ({
    url: `${baseUrl}/category/${subType.slug}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  })) || []

  // Combine all routes
  return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...typeRoutes, ...subTypeRoutes]
}