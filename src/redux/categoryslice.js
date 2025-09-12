import { getCatScreenApi } from "@/api/products";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getCatScreenList = createAsyncThunk(
  "getCatScreenList",
  async (slug) => {
    const res = await getCatScreenApi(slug);
    return res.data.data;
  }
);

const categoryslice = createSlice({
  name: "categoryslice",
  initialState: {
    categoryScreen: {},
    subcategoryScreen: {},
    displayed_products: [],
    scrolled_products: [],
    loading: true,
    has_more: true,
    catloading: true,
    section_page_loading: true,
    section_pages_Data: {},
    error: null,
    initial_page: 1,
  },
  reducers: {
    setcatloading: (state, action) => {
      state.catloading = action.payload;
    },
    setsectionloading: (state, action) => {
      state.section_page_loading = action.payload;
    },
    setsubcategoryScreen: (state, action) => {
      state.subcategoryScreen = action.payload;
    },
    setdisplayed_products: (state, action) => {
      state.displayed_products = action.payload;
    },
    sethas_more: (state, action) => {
      state.has_more = action.payload;
    },
    setcurrent_page: (state, action) => {
      state.initial_page = action.payload;
    },
    setsection_pages_Data: (state, action) => {
      state.section_pages_Data = action.payload;
    },
    setscrolled_products: (state, action) => {
      state.scrolled_products = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCatScreenList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCatScreenList.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryScreen = action.payload;
      })
      .addCase(getCatScreenList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // .addCase(getSubCatScreenList.pending, (state,action) => {
    //         state.catloading = true;
    // })

    // .addCase(getSubCatScreenList.fulfilled, (state, action) => {
    //     state.catloading = false;
    //     state.subcategoryScreen = action.payload.data;
    //     if (action.payload.finalInput.length <= 0) {
    //         state.displayed_products = action.payload.data.display_items.products;
    //     }
    // })
    // .addCase(getSubCatScreenList.rejected, (state, action) => {
    //     state.catloading = false;
    //     state.error = action.error.message;
    // })
  },
});

export const {
  setcatloading,
  setsubcategoryScreen,
  setdisplayed_products,
  sethas_more,
  setcurrent_page,
  setsection_pages_Data,
  setsectionloading,
  setscrolled_products,
} = categoryslice.actions;
export default categoryslice.reducer;
