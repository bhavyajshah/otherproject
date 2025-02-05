"use client"
//Global
import { useState, useCallback } from "react"
import Link from "next/link"
//Actions
import { fetchCategories, fetchTypes, fetchSubtypes } from "@/redux/reducers/categoriesSlice"
//Hooks
import { useAppDispatch, useTypedSelector } from "./useReduxHooks"
import { useProducts } from "./useProducts"
import { useTranslate } from "@/hooks/useTranslate"
//Types
import type { ICurrentCategory } from "@/types/componentTypes"
//Styles
import "@/components/Header/Header.scss"
import { showToastMessage } from "@/app/[locale]/toastsChange"
import { useLocale } from "next-intl"
import { getProducts } from "@/services/productsAPI"

const useCategories = (color: string) => {
  console.log("useCategories hook initialized with color:", color) // Log the color passed to the hook

  //Hooks
  const translate = useTranslate()
  const locale = useLocale()
  const { status, categories, types, subtypes } = useTypedSelector((state) => state.categories)

  const dispatch = useAppDispatch()
  const { setAllProducts, onSetCategory } = useProducts()

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [currentCategory, setCurrentCategory] = useState<ICurrentCategory>({
    id: 0,
    name: "",
    slug: "",
  })

  const filterByProperty = <T, K extends keyof T>(items: T[], property: K, value: T[K]) =>
    items.filter((item) => item[property] === value)

  const returnTypesByCategory = (id: number) => {
    const filteredTypes = filterByProperty(types, "parent", id)
    console.log(`Types for category ${id}:`, filteredTypes)
    return filteredTypes
  }

  const returnSubtypesByType = (id: number) => {
    const filteredSubtypes = filterByProperty(subtypes, "parent", id)
    return filteredSubtypes
  }

  const onSetSubtypes = useCallback(() => {
    return dispatch(fetchSubtypes())
  }, [dispatch])

  const onSetTypes = useCallback(() => {
    return dispatch(fetchTypes())
  }, [dispatch])

  const onSetCategories = useCallback(() => {
    return dispatch(fetchCategories())
  }, [dispatch])

  const getCategoryProduct = async (category: number) => {
    try {
      const allProducts = await getProducts(category)
      console.log("All Products", allProducts)
      onSetCategory(category)
      // setAllProducts(allProducts)
    } catch (error) {
      console.error("Error getting products:", error)
      showToastMessage("warn", translate.emptyCategoryError)
    }
  }

  const renderDesktopCategories = () =>
    categories?.map((category) => {
      console.log("Rendering desktop category:", category)
      return (
        <Link
          onMouseEnter={() => {
            setCurrentCategory(category)
            setIsOpen(true)
          }}
          key={category?.id}
          href={`/${locale.toLowerCase()}/${category.slug}`}
          onClick={() => {
            onSetCategory(category.id)
            getCategoryProduct(category.id)
          }}
        >
          {category?.name}
        </Link>
      )
    })

  const renderTypesByCategory = () => {
    if (!isOpen) return
    return (
      <div className="w-full container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-white">
        {returnTypesByCategory(currentCategory.id).map((type) => {
          return (
            <div key={type.id} className="flex flex-col gap-2">
              <Link
                className="font-bold"
                href={`/${locale.toLowerCase()}/${currentCategory.slug}/${type.slug}`}
                onClick={() => {
                  onSetCategory(type.id)
                  getCategoryProduct(type.id)
                }}
              >
                {type.name}
              </Link>

              <div className="flex flex-col gap-1">
                {returnSubtypesByType(type.id).map((subtype) => {
                  // console.log("Rendering subtype:", subtype) // Log each subtype being rendered
                  return (
                    <Link
                      key={subtype.id}
                      href={`/${locale.toLowerCase()}/${currentCategory.slug}/${type.slug}/${subtype.slug}`}
                      onClick={() => getCategoryProduct(subtype.id)}
                    >
                      {subtype.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const mapCategoriesOnDesktop = () => {
    console.log("Mapping categories on desktop, status:", status) // Log when mapping categories on desktop
    if (status === "fulfilled")
      return (
        <nav
          onMouseLeave={() => {
            setIsOpen(false)
            // console.log("Mouse left categories nav") // Log when mouse leaves the categories nav
          }}
          className="header-block flex flex-col justify-center items-center gap-[15px]"
          style={{
            backgroundColor: color,
            padding: "15px 0",
          }}
        >
          <div className="w-full container px-[15px] flex justify-between text-white">{renderDesktopCategories()}</div>

          {renderTypesByCategory()}
        </nav>
      )
  }

  const mapCategoriesOnPhone = () => {
    console.log("Mapping categories on phone, status:", status) // Log when mapping categories on phone
    if (status === "fulfilled")
      return (
        <div className="flex flex-col max-sm:basis-[50%] gap-[20px] row-span-4">
          {categories?.map((category) => {
            // console.log("Rendering phone category:", category) // Log each category being rendered on phone
            return (
              <Link
                style={{ color: "white" }}
                key={category?.id}
                href={`/${locale.toLowerCase()}/${category.slug}`}
                onClick={() => getCategoryProduct(category.id)}
              >
                {category?.name}
              </Link>
            )
          })}
        </div>
      )
  }

  return {
    onSetCategories,
    mapCategoriesOnDesktop,
    mapCategoriesOnPhone,
    onSetTypes,
    onSetSubtypes,
    returnSubtypesByType,
    returnTypesByCategory,
  }
}

export { useCategories }