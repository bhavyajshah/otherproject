"use client"

import { useState, useMemo, useEffect } from "react"
import { Button, Breadcrumbs, BreadcrumbItem } from "@nextui-org/react"
import { Filter } from "@/components/Modals/Filter/Filter"
import { EmptyComponent } from "@/components/EmptyComponent/EmptyComponent"
import { Icons } from "@/components/Icons/Icons"
import { useTypedSelector } from "@/hooks/useReduxHooks"
import { useProducts } from "@/hooks/useProducts"
import { useTranslate } from "@/hooks/useTranslate"
import { useInView } from "react-intersection-observer"
import { SHOP_ROUTE } from "@/utils/Consts"
import Link from "next/link"
import "swiper/css/pagination"
import "./catalog.scss"
import "swiper/css"
import { useLocale } from "next-intl"
import { ProductCard } from "@/components/ProductCard/productCard"

interface PageData {
  category: any
  type?: any
  subtype?: any
  subtypes?: any[]
}

interface CategoryPageClientProps {
  pageData: PageData
  params: string[]
}

export default function CategoryPageClient({ pageData, params }: CategoryPageClientProps) {
  // console.log("pageData", pageData)
  console.log("params", params)
  console.log("pageData", pageData)
  const [isOpen, setIsOpen] = useState(false)
  const { filtered, filters, status, searchText, products, page } = useTypedSelector((state) => state.products)

  {console.log("Products Data", products)}
  const { ref, inView } = useInView()
  const { setAllProducts, onSetCategory, onIncrementPage } = useProducts()
  const translate = useTranslate()
  const locale = useLocale()

  const breadcrumbItems = useMemo(() => {
    const items = [
      { href: `/${locale}${SHOP_ROUTE}`, label: translate.mainPageRoute },
      { href: `/${locale}/${pageData.category.slug}`, label: pageData.category.name },
    ]
    if (pageData.type) {
      items.push({ href: `/${locale}/${pageData.category.slug}/${pageData.type.slug}`, label: pageData.type.name })
    }
    if (pageData.subtype) {
      items.push({
        href: `/${locale}/${pageData.category.slug}/${pageData.type.slug}/${pageData.subtype.slug}`,
        label: pageData.subtype.name,
      })
    }
    return items
  }, [pageData, translate, locale])

  const pageTitle = useMemo(() => {
    return pageData.subtype?.name || pageData.type?.name || pageData.category.name
  }, [pageData])

  useEffect(() => {
    if (inView) {
      onIncrementPage()
    }
  }, [inView, onIncrementPage])

  useEffect(() => {
    const categoryId = pageData.subtype?.id || pageData.type?.id || pageData.category.id
    onSetCategory(categoryId)
    setAllProducts()
  }, [pageData, onSetCategory, setAllProducts])

  const productsDisplay = useMemo(() => {
    if (status === "pending") return <Icons id="spiner" />

    if (!products?.length && status === "fulfilled") {
      return (
        <EmptyComponent
          title={translate.emptyCatalogTitle}
          text={translate.emptyCatalogText}
          route={SHOP_ROUTE}
          buttonText={translate.emptyCatalogButtonText}
        />
      )
    }

    return (
      <div className="main-product-wrapper">
        {products?.map((productInfo, index) => (
          <div ref={index === products.length - 1 ? ref : null} key={productInfo?.id}>
            <ProductCard productInfo={productInfo} />
          </div>
        ))}
      </div>
    )
  }, [products, status, translate, ref])

  const subtypesDisplay = useMemo(() => {
    if (pageData.subtypes && pageData.subtypes.length > 0) {
      return (
        <div className="subtypes-wrapper mt-4 mb-8">
          <h2 className="text-xl font-semibold mb-2">Subtypes:</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {pageData.subtypes.map((subtype) => (
              <Link
                key={subtype.id}
                href={`/${locale}/${pageData.category.slug}/${pageData.type?.slug || params[1]}/${subtype.slug}`}
                className="p-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              >
                {subtype.name}
              </Link>
            ))}
          </div>
        </div>
      )
    }
    return null
  }, [pageData.subtypes, locale, pageData.category.slug, pageData.type, params])

  return (
    <div className="catalog-wrapper">
      <Breadcrumbs>
        {breadcrumbItems.map((item, index) => (
          <BreadcrumbItem key={index} href={item.href}>
            {item.label}
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>

      <h1 className="text-2xl font-bold mb-6">{pageTitle}</h1>

      {subtypesDisplay}

      <Button onClick={() => setIsOpen(!isOpen)} className="filters" startContent={<Icons id="filter" />}>
        {translate.catalogFilter}
      </Button>

      <div className={`filter_wrapper ${isOpen ? "active" : ""}`}>
        <Filter />
      </div>

      {productsDisplay}
      {status === "pending" && <Icons id="spiner" />}
    </div>
  )
}