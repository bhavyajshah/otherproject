//Components
import { CategoryPageComponent } from "@/components/CategoryPageComponent/CategoryPageComponent";
import { CategoryComponent } from "@/components/CategoryComponent/CategoryComponent";

//Services
import { getCategoryById, getAllCategories, getTypes, getSubTypes, getCategoryBySlug } from "@/services/categoriesAPI";
import { notFound } from "next/navigation";
import CategoryPageClient from "./CategoryPageClient";

export async function generateStaticParams() {
  try {
    const parentCategories = await getAllCategories();
    const types = await getTypes();
    const subTypes = await getSubTypes();

    // Check if the fetched data is an array
    if (!Array.isArray(parentCategories) || !Array.isArray(types) || !Array.isArray(subTypes)) {
      throw new Error("Fetched data is not an array");
    }

    // Create array of arrays like [parent, [parent, type], [parent, type, subtype]]
    const parent = parentCategories.map(({ id, slug }) => ({ id, slug }));
    const type = types.map(({ id, slug, parent }) => ({ id, slug, parent }));
    const subtype = subTypes.map(({ id, slug, parent }) => ({ id, slug, parent }));
    const result = [];

    parent.forEach((parent) => {
      result.push([parent.slug]);
      type.forEach((type) => {
        if (type.parent === parent.id) {
          result.push([parent.slug, type.slug]);
          subtype.forEach((subtype) => {
            if (subtype.parent === type.id) {
              result.push([parent.slug, type.slug, subtype.slug]);
            }
          });
        }
      });
    });

    return result.map((cat) => ({
      params: { category: cat },
    }));
  } catch (error) {
    console.log(error);
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    // const categoriesObject = await getCategoryById(params?.id);
    // const categoryName = Object.keys(categoriesObject)[0];

    return {
      title: `${params?.slug}`,
    };
  } catch (error) {
    console.log(error);
  }
}

export default async function Category({ params }: { params: { category: string } }) {
  try {
    const categoriesObject = await getCategoryBySlug(params.category);
    if (!categoriesObject) return notFound();
    return (
      <main className="container mx-auto mt-[30px] px-[15px] lg:px-[30px]">
        <CategoryPageClient
          categoryObject={categoriesObject}
          categoryId={+params?.category}
        />
        <h1>{params.category}</h1>
      </main>
    );
  } catch (error) {
    console.log(error);
    return notFound();
  }
}
