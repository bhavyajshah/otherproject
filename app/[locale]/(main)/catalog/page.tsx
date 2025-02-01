"use client";
//Global
import { useState, useMemo, useEffect, CSSProperties } from "react";
//Components
import { Button, Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { Filter } from "@/components/Modals/Filter/Filter";
import { ProductCard } from "@/components/ProductCard/productCard";
import { EmptyComponent } from "@/components/EmptyComponent/EmptyComponent";
import { Icons } from "@/components/Icons/Icons";
//Hooks
import { useTypedSelector } from "@/hooks/useReduxHooks";
import { useProducts } from "@/hooks/useProducts";
import { useTranslate } from "@/hooks/useTranslate";
import { useInView } from "react-intersection-observer";
//Utils
import { SHOP_ROUTE } from "@/utils/Consts";
//Types
import { IProductsState } from "@/types/reduxTypes";
//Styles
import "swiper/css/pagination";
import "./catalog.scss";
import "swiper/css";

export default function Catalog() {

  const [isOpen, setIsOpen] = useState(false);
  //Hooks
  const { filtered, category, filters, status, searchText, products, page } = useTypedSelector(state => state.products);

  const {ref, inView} = useInView();
  
  const { setAllProducts, handleSearch, onSetFilters, onSetSearchText, onSetCategory, onIncrementPage } = useProducts();
  const translate = useTranslate();

  //Styles
  const buttonStyles: CSSProperties = {
    background: isOpen ? "#282828" : "#0ABAB5",
    color: "white",
    fontSize: "22px",
    textTransform: 'none'
  };
  //ClassNames
  const filterWrapperClassName = isOpen ? "filter_wrapper active" : "filter_wrapper";

  useEffect(() => {
    if (inView) {
      onIncrementPage();
    }
  }, [inView]);

  // const newProducts = handleSearch(searchText, products);
  const setOpen = () => setIsOpen(!isOpen);

  let productsArray = products

  const mapAllProducts = useMemo(() => {
    // if (status === "pending") return <Icons id="spiner" />;

    if (!productsArray?.length && status === "fulfilled") {
      return (
        <EmptyComponent
          title={translate.emptyCatalogTitle}
          text={translate.emptyCatalogText}
          route={SHOP_ROUTE}
          buttonText={translate.emptyCatalogButtonText}
        />
      );
    }

    if (productsArray.length)
      return (
        <div className="main-product-wrapper">
          {productsArray?.map((productInfo, index) => {
            if (index === productsArray.length - 1) {
              return (
                <div ref={ref} key={productInfo?.id}>
                  <ProductCard key={productInfo?.id} productInfo={productInfo} />
                </div>
              );
            }
            return <ProductCard key={productInfo?.id} productInfo={productInfo} />;
          })}
        </div>
      );
  }, [translate, productsArray, status,]);


  const spiner = useMemo(() => {
    if (status === "pending") return <Icons id="spiner" />;
  }, [status]);


  useEffect(() => {
    console.log("Setting all products");
    setAllProducts();
  }, [filters, searchText, category, page]);

  // useEffect(()=>{
  //   const newFilters: IProductsState["filters"] = {
  //     brand: null,
  //     color: null,
  //     price_max:10000,
  //     price_min:0,
  //     mold: null,
  //     material: null,
  //     season: null,
  //   };

  //   onSetFilters(newFilters);
  // },[])


  return (
    <main className="catalog-wrapper container mx-auto px-[15px] lg:px-[30px]">
      <Breadcrumbs>
        <BreadcrumbItem href={SHOP_ROUTE}>{translate.mainPageRoute}</BreadcrumbItem>

        <BreadcrumbItem>{translate.headerCatalog}</BreadcrumbItem>
      </Breadcrumbs>

      <Button
        style={buttonStyles}
        onClick={setOpen}
        className="filters"
        startContent={<Icons id="filter" />}
      >
        {translate.catalogFilter}
      </Button>

      <div className={filterWrapperClassName}>
        <Filter />
      </div>

      {mapAllProducts}
      {spiner}
    </main>
  );
}
