//Hosts
import { $host,$authHost } from "./index";
//Redux Types
import { IProductsState } from "@/types/reduxTypes";

export const getFamousProducts = async (language: string) => {
  try {
    const { data } = await $host.get("/api/catalog/famous/",{headers: { "Accept-Language": language }});

    return data;
  } catch (error) {
    console.error("Failed get famous products:" + error);
  }
};

export const getAllCities = async () => {
  try {
    const { data,status } = await $authHost.get("/api/city/");

    return { data,status };
  } catch (error: any) {
    if(error) return error;
    console.error("Failed get cities:" + error);
  }
};


export const putProductReciept = async (id: number, changes:any) => {
  try {
    const { data } = await $authHost.patch(`/api/order/${id}/`, changes);


    return data;
  } catch (error) {
    console.log(error)
    throw new Error(`${error}`);
  }
};


export const getColorsAPI = async () => {
  try {
    const { data } = await $authHost.get("/api/color/");
    return data;
  } catch (error) {
    console.error("Failed get colors: " + error);
    throw error;
  }
};

export const getSimilarProducts = async (article_number: string,language: string) => {
  try {
    const { data } = await $host.get(`/api/catalog/${article_number}/similar/`,{headers: { "Accept-Language": language }});

    return data;
  } catch (error) {
    console.error("Failed get similar products:" + error);
  }
};

export const getAllProducts = async () => {
  try {
    // const params: Record<string, string | number> = {};

    // if (category !== "Все категории") {
    //   params.cats = category;
    // }

    // const filterKeys: (keyof IProductsState["filters"])[] = [
    //   "brand",
    //   "color",
    //   "price_max",
    //   "price_min"
    // ];

    // filterKeys.forEach(key => {
    //   const value = filters[key];
    //   if (value) {
    //     params[key === "brand" ? "brands" : key] = value;
    //   }
    // });

    const { data } = await $host.get("/api/catalog/?status=A");

    return data;
  } catch (error) {
    console.error("Error fetching products:" + error);
    throw error;
  }
};

export const getProducts = async (category: number) => {
  try {
    const url = `/api/catalog/?price_max=10000&price_min=0&category=${category}&page=1`
    const { data } = await $host.get(url)
    console.log("data", data.results)
    return data
  } catch (error) {
    console.error("Error fetching products:" + error)
    throw error
  }
}

export const getProductsByFilter = async (filters: any) => {
  try {
    const { data } = await $host.get(`/api/catalog/?${filters}`);

    return data;
  } catch (error) {
    console.error("Error fetching products: " + error);
    throw error;
  }
};

export const getProductBySlug = async (article_number: string, language: string) => {
  try {
    const { data } = await $host.get(`/api/catalog/${article_number}/`, {headers: { "Accept-Language": language }});

    return data;
  } catch (error) {
    console.error("Error get product by article_number:" + error);
  }
};
