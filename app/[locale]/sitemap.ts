import { MetadataRoute } from 'next'
import { getAllProducts } from '@/services/productsAPI'
import { getAllCategories, getTypes, getSubTypes } from '@/services/categoriesAPI'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://turanline.com'

  // Get all dynamic data
  const products = await getAllProducts()
  const categories = await getAllCategories()
  const types = await getTypes()
  const subTypes = await getSubTypes()

  // Base static routes
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/catalog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contacts`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/delivery`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/payment`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/politics`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ] as MetadataRoute.Sitemap

  // Product routes
  const productRoutes = products?.results?.map((product) => ({
    url: `${baseUrl}/product/${product.article_number}`,
    lastModified: new Date(product.date_and_time),
    changeFrequency: 'weekly',
    priority: 0.8,
  })) || []

  // Category routes
  const categoryRoutes = categories?.map((category) => ({
    url: `${baseUrl}/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  })) || []

  // Type routes
  const typeRoutes = types?.map((type) => ({
    url: `${baseUrl}/${type.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  })) || []

  // SubType routes
  const subTypeRoutes = subTypes?.map((subType) => ({
    url: `${baseUrl}/${subType.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.5,
  })) || []

  return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...typeRoutes, ...subTypeRoutes]
}