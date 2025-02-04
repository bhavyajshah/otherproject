//Global
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
//Services
import { getProducts,getColorsAPI, getProductsByFilter } from "@/services/productsAPI";
//Component Types
import { IPaginationResponse, IProductMainPage } from "@/types/componentTypes";
//Redux Types
import { IFavoritesState, IProductsState } from "@/types/reduxTypes";
import { RootState } from "../store";
//State
const initialState: IProductsState = {
  products: [],
  filtered: [],
  category: 0,
  status: "pending",
  searchText: "",
  filters: {
    brand: null,
    color: null,
    price_max: null,
    price_min: null,
    mold: null,
    material: null,
    season: null,
    ordering: null,
  },
  colors:[],
  page: 1,
  count: 0,
  next: null,
  previous: null,
};

export const fetchProducts = createAsyncThunk<IPaginationResponse<IProductMainPage>, number,
{ rejectValue: string }>("productsSlice/fetchProducts", async (_,{ getState,rejectWithValue }) => {

  const productsState = (getState() as RootState).products as IProductsState;

  const filteredFilters = Object.fromEntries(
    Object.entries(productsState.filters).filter(
      ([key, value]) => value !== undefined && value !== null
    )
  );

  // Формируем строку запроса
  const queryParams = new URLSearchParams();
  for (const [key, value] of Object.entries(filteredFilters)) {
    if (Array.isArray(value)) {
      if (value.length > 0)
        value.forEach((val) => queryParams.append(key, val));
    } else {
      if (value !== null) queryParams.append(key, value.toString());
    }
  }

  if(productsState.searchText)
    queryParams.append("search", productsState.searchText);

  if(productsState.category && productsState.category > 0)
  {
    queryParams.append("category", productsState.category.toString());
  }
  queryParams.append("page", productsState.page.toString());

  try {

    return await getProductsByFilter(queryParams.toString());
  } catch (error) {
    return rejectWithValue(`${error}`);
  }
});


export const getColors = createAsyncThunk<any[],undefined,{ rejectValue: string }>("productSlice/getColors", async (_, { rejectWithValue }) => {
  try {
    return await getColorsAPI();
  } catch (error) {
    return rejectWithValue(`${error}`);
  }
});

const productsSlice = createSlice({
  name: "productsSlice",
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = action.payload;
      state.page = 1;
      state.products = [];
    },
    setCategory(state, action) {
      state.searchText = "";
      if(state.category === action.payload) return;
      state.category = action.payload;
      state.page = 1;
      state.products = [];
      state.filters.ordering = null;
    },
    setSearchText(state, action) {
      if(state.searchText === action.payload) return;
      state.searchText = action.payload;
      state.page = 1;
      state.products = [];
      state.filters.ordering = null;
    },
    // setSearchProducts(state, action) {
    //   state.filtered = action.payload;
    // },
    incrementPage(state) {
      if(state.next === null) return;
      state.page += 1;
    },
  },
  extraReducers: builder =>
    builder
      .addCase(fetchProducts.pending, state => {
        state.status = "pending";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.products = [...state.products, ...action.payload.results];
        state.next = action.payload.next;
      })
      .addCase(getColors.pending, state => {
        state.status = "pending";
      })
      .addCase(getColors.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.colors = action.payload;
      }),

});

export const { setCategory, setFilters, setSearchText, incrementPage } = productsSlice.actions;

export default productsSlice.reducer;
