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

  // Base static routes - all starting with /en
  const staticRoutes = [
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/en/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/catalog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/contacts`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/delivery`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/payment`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/politics`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ] as MetadataRoute.Sitemap

  // Product routes - all with /en prefix
  const productRoutes = products?.results?.map((product) => ({
    url: `${baseUrl}/en/product/${product.article_number}`,
    lastModified: new Date(product.date_and_time),
    changeFrequency: 'weekly',
    priority: 0.8,
  })) || []

  // Category routes - all with /en prefix
  const categoryRoutes = categories?.map((category) => ({
    url: `${baseUrl}/en/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  })) || []

  // Type routes - all with /en prefix
  const typeRoutes = types?.map((type) => ({
    url: `${baseUrl}/en/${type.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  })) || []
  // SubType routes - all with /en prefix
  const subTypeRoutes = subTypes?.map((subType) => ({
    url: `${baseUrl}/en/${subType.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.5,
  })) || []

  return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...typeRoutes, ...subTypeRoutes]
}