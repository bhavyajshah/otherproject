import { getCategoryBySlug, getAllCategories, getTypes, getSubTypes } from "@/services/categoriesAPI"
import { notFound } from "next/navigation"
import CategoryPageClient from "./CategoryPageClient"

export async function generateStaticParams() {
  try {
    const parentCategories = await getAllCategories()
    const types = await getTypes()
    const subTypes = await getSubTypes()

    // Check if the fetched data is an array
    if (!Array.isArray(parentCategories) || !Array.isArray(types) || !Array.isArray(subTypes)) {
      throw new Error("Fetched data is not an array")
    }

    // Create array of arrays like [parent, [parent, type], [parent, type, subtype]]
    const parent = parentCategories.map(({ id, slug }) => ({ id, slug }))
    const type = types.map(({ id, slug, parent }) => ({ id, slug, parent }))
    const subtype = subTypes.map(({ id, slug, parent }) => ({ id, slug, parent }))
    const result = []

    parent.forEach((parent) => {
      result.push([parent.slug])
      type.forEach((type) => {
        if (type.parent === parent.id) {
          result.push([parent.slug, type.slug])
          subtype.forEach((subtype) => {
            if (subtype.parent === type.id) {
              result.push([parent.slug, type.slug, subtype.slug])
            }
          })
        }
      })
    })

    return result.map((cat) => ({
      params: { category: cat },
    }))
  } catch (error) {
    // Log any errors that occur during the static params generation
    console.log("Error in generateStaticParams:", error)
    return []
  }
}

export async function generateMetadata({ params }: { params: { category: string[] } }) {
  try {
    const [categorySlug, typeSlug, subtypeSlug] = params.category
    let title = categorySlug
    if (typeSlug) title += ` - ${typeSlug}`
    if (subtypeSlug) title += ` - ${subtypeSlug}`
    return { title }
  } catch (error) {
    // Log any errors that occur during metadata generation
    console.log("Error in generateMetadata:", error)
    return { title: "Category" }
  }
}

export default async function Category({ params }: { params: { category: string[] } }) {
  console.log("params", params)
  try {
    const [categorySlug, typeSlug, subtypeSlug] = params.category

    // Get category data
    const categoryData = await getCategoryBySlug(categorySlug)
    if (!categoryData) return notFound()

    const pageData: any = { category: categoryData }
console.log("pageDatas",pageData)
    // If we have a type slug, fetch type and subtype data
    if (typeSlug) {
      const allTypes = await getTypes()
      const typeData = allTypes.find((t) => t.slug === typeSlug && t.parent === categoryData.id)

      if (typeData) {
        pageData.type = typeData

        // If we have a subtype slug, fetch subtype data
        if (subtypeSlug) {
          const allSubtypes = await getSubTypes()
          const subtypeData = allSubtypes.find((st) => st.slug === subtypeSlug && st.parent === typeData.id)
          if (subtypeData) {
            pageData.subtype = subtypeData
          }
        }

        // Fetch all subtypes for this type
        const allSubtypes = await getSubTypes()
        pageData.subtypes = allSubtypes.filter((st) => st.parent === typeData.id)
      } else {
        // If type is not found, get all types and subtypes for this category
        const categoryTypes = allTypes.filter((t) => t.parent === categoryData.id)
        const allSubtypes = await getSubTypes()
        pageData.subtypes = allSubtypes.filter((st) => categoryTypes.some((t) => t.id === st.parent))
      }
    }

    return (
      <main className="container mx-auto mt-[30px] px-[15px] lg:px-[30px]">
        <CategoryPageClient pageData={pageData} params={params.category} />
      </main>
    )
  } catch (error) {
    // Log any errors that occur during the page rendering
    console.log("Error in Category page:", error)
    return notFound()
  }
}