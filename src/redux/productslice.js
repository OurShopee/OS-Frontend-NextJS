import { get_relatedItems, getproduct_detail } from "@/api/products";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getProductDetail = createAsyncThunk(
  "getProductDetail",
  async (slug) => {
    const res = await getproduct_detail(slug);
    return res.data.data.product;
  }
);

export const getrelatedItems = createAsyncThunk(
  "getrelatedItems",
  async (input_data) => {
    const res = await get_relatedItems(input_data);
    if (res.status == 204) {
      return [];
    }
    return res.data.data;
  }
);

const productslice = createSlice({
  name: "productslice",
  initialState: {
    productDetail: [],
    productDetail_products: {},
    loading: true,
    loading1: true,
    error: null,
  },
  reducers: {
    setprodcatloading: (state, action) => {
      state.loading1 = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProductDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetail = action.payload;
      })
      .addCase(getProductDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(getrelatedItems.pending, (state) => {
        state.loading1 = true;
      })
      .addCase(getrelatedItems.fulfilled, (state, action) => {
        state.loading1 = false;
        state.productDetail_products = action.payload;
      })
      .addCase(getrelatedItems.rejected, (state, action) => {
        state.loading1 = true;
        state.error = action.error.message;
      });
  },
});

export const { setprodcatloading } = productslice.actions;

export default productslice.reducer;
