"use client";
//Global
import { useState } from "react";
import Link from "next/link";
import { useCallback } from "react";
//Actions
import {
  fetchCategories,
  fetchTypes,
  fetchSubtypes,
} from "@/redux/reducers/categoriesSlice";
//Hooks
import { useAppDispatch, useTypedSelector} from "./useReduxHooks";
import { useProducts } from "./useProducts";
import { useTranslate } from "@/hooks/useTranslate";
//Types
import { ICurrentCategory } from "@/types/componentTypes";
//Services
import { getProductsByFilter } from "@/services/productsAPI";
//Styles
import "@/components/Header/Header.scss";
import { showToastMessage } from "@/app/[locale]/toastsChange";
import { useLocale } from "next-intl";



const useCategories = (color: string) => {
  //Hooks
  const translate = useTranslate();
  const locale = useLocale();
  
  const { status, categories, types, subtypes } = useTypedSelector(
    (state) => state.categories
  );
  const { selectedLanguage } = useTypedSelector((state) => state.language);
  const dispatch = useAppDispatch();
  const { setAllProducts, onSetCategory } = useProducts();


  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<ICurrentCategory>({
    id: 0,
    name: "",
  });

  const filterByProperty = <T, K extends keyof T>(
    items: T[],
    property: K,
    value: T[K]
  ) => items.filter((item) => item[property] === value);

  const returnTypesByCategory = (id: number) =>
    filterByProperty(types, "parent", id);

  const returnSubtypesByType = (id: number) =>
    filterByProperty(subtypes, "parent", id);

  const onSetSubtypes = useCallback(
    () => dispatch(fetchSubtypes()),
    [dispatch]
  );

  const onSetTypes = useCallback(() => dispatch(fetchTypes()), [dispatch]);

  const onSetCategories = useCallback(
    () => dispatch(fetchCategories()),
    [dispatch, selectedLanguage]
  );

  

  const getProducts = async (category:number) => {
    try {
      // const products = await getProductsByFilter(`category=${category}`);

      // if(!products?.length){
      //   showToastMessage('warn', translate.emptyCategoryError);
      // }
      // onSetSearchProducts(products.records);
      onSetCategory(category);

    } catch (error) {
      showToastMessage('warn',translate.emptyCategoryError);
    }
  }

  const renderDesktopCategories = () =>
    categories?.map((category) => (
      <Link
        onMouseEnter={() => {
          setCurrentCategory(category);
          setIsOpen(true);
        }}
        key={category?.id}
        href={"/" + locale.toLowerCase() +`/` + category.slug}
        onClick={()=> getProducts(category?.id)}
      >
        {category?.name}
      </Link>
    ));

  // const renderTypesByCategory = () => {
  //   if (!isOpen) return;

  //   return (
  //     <div className="w-full container flex gap-[50px] justify-between flex-wrap text-white">
  //       {returnTypesByCategory(currentCategory.id).map((type) => (
  //         <div key={type.id} className="flex flex-col gap-[10px]">
  //           <Link className="font-bold" href={`/catalog`} onClick={()=> getProducts(type.id)}>
  //             {type.name}
  //           </Link>

  //           <div className="flex flex-col gap-[5px]">
  //             {returnSubtypesByType(type.id).map((subtype) => (
  //               <Link key={subtype.id} href={`/catalog`} onClick={()=> getProducts(subtype.id)}>
  //                 {subtype.name}
  //               </Link>
  //             ))}
  //           </div>
  //         </div>
  //       ))}
  //     </div>
  //   );
  // };


  const renderTypesByCategory = () => {
    if (!isOpen) return;
  
    return (
      <div className="w-full container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-white">

        {returnTypesByCategory(currentCategory.id).map((type) => (
          <div key={type.id} className="flex flex-col gap-2">
            <Link className="font-bold" href={"/" + locale.toLowerCase() + `/` + type.slug} onClick={() => getProducts(type.id)}>
              {type.name}
            </Link>
  
            <div className="flex flex-col gap-1">
              {returnSubtypesByType(type.id).map((subtype) => (
                <Link key={subtype.id} href={"/" + locale.toLowerCase() + `/` + subtype.slug } onClick={() => getProducts(subtype.id)}>
                  {subtype.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  
  const mapCategoriesOnDesktop = () => {
    if (status === "fulfilled")
      return (
        <nav
          onMouseLeave={() => setIsOpen(false)}
          className="header-block flex flex-col justify-center items-center gap-[15px]"
          style={{
            backgroundColor: color,
            padding: "15px 0",
          }}
        >
          <div className="w-full container px-[15px] flex justify-between text-white">
            {renderDesktopCategories()}
          </div>

          {renderTypesByCategory()}
        </nav>
      );
  };

  const mapCategoriesOnPhone = () => {
    if (status === "fulfilled")
      return (
        <div className="flex flex-col max-sm:basis-[50%] gap-[20px] row-span-4">
          {categories?.map((category) => (
            <Link style={{color:"white"}} key={category?.id} href={"/" + locale.toLowerCase() + `/` + category.slug} onClick={()=> getProducts(category.id)}>
              {category?.name}
            </Link>
          ))}
        </div>
      );
  };

  return {
    onSetCategories,
    mapCategoriesOnDesktop,
    mapCategoriesOnPhone,
    onSetTypes,
    onSetSubtypes,
    returnSubtypesByType,
    returnTypesByCategory,
  };
};

export { useCategories };
