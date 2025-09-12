import {
  cartlist,
  changeCartQuantity,
  getWishListsApi,
  postWishListApi,
  removeFromCart,
} from "@/api/cart";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const cartlistapi = createAsyncThunk(
  "fetchcartlistdata",
  async (input_data) => {
    const res = await cartlist(input_data);
    if (res.status === 204) {
      return { status: 204 };
    }
    return res.data; // assuming this is already { status: "success", ... }
  }
);

export const cartlistWithoutLoaderapi = createAsyncThunk(
  "cartlistWithoutLoaderapi",
  async (input_data) => {
    const res = await cartlist(input_data);
    if (res.status === 204) {
      return { status: 204 };
    }
    return res.data; // assuming this is already { status: "success", ... }
  }
);

export const changeCartQuantityapi = createAsyncThunk(
  "fetchchangequantitydata",
  async (input_data) => {
    const res = await changeCartQuantity(input_data);
    return res;
  }
);

export const removeFromCartapi = createAsyncThunk(
  "fetchremovecartdata",
  async (input_data) => {
    const res = await removeFromCart(input_data);
    return res;
  }
);

export const getWishLists = createAsyncThunk(
  "getWishLists",
  async (input_data) => {
    const res = await getWishListsApi(input_data);
    return res.data.data;
  }
);

export const postWishList = createAsyncThunk(
  "postWishList",
  async (input_data) => {
    const res = await postWishListApi(input_data);
    return res.data.data;
  }
);

const cartslice = createSlice({
  name: "cartslice",
  initialState: {
    loading: false,
    changecartloader: false,
    removecartloader: false,
    error: null,
    cartlistdata: [],
    wishListData: [],
  },
  reducers: {
    setcartlistdata: (state, action) => {
      state.cartlistdata = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(cartlistapi.pending, (state) => {
        state.loading = true;
      })
      .addCase(cartlistapi.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.status === 204) {
          state.cartlistdata = [];
        } else if (action.payload.status === "success") {
          state.cartlistdata = action.payload;
        }
      })
      .addCase(cartlistapi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(cartlistWithoutLoaderapi.pending, (state) => {
        state.loading = false;
      })
      .addCase(cartlistWithoutLoaderapi.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.status === 204) {
          state.cartlistdata = [];
        } else if (action.payload.status === "success") {
          state.cartlistdata = action.payload;
        }
      })

      .addCase(cartlistWithoutLoaderapi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //....................quantity change
      .addCase(changeCartQuantityapi.pending, (state) => {
        state.changecartloader = true;
      })
      .addCase(changeCartQuantityapi.fulfilled, (state, action) => {
        state.changecartloader = false;
      })
      .addCase(changeCartQuantityapi.rejected, (state, action) => {
        state.changecartloader = false;
      })
      //....................remove cart
      .addCase(removeFromCartapi.pending, (state) => {
        state.removecartloader = true;
      })
      .addCase(removeFromCartapi.fulfilled, (state, action) => {
        state.removecartloader = false;
      })
      .addCase(removeFromCartapi.rejected, (state, action) => {
        state.removecartloader = false;
      })

      .addCase(getWishLists.pending, (state) => {
        state.loading = true;
      })
      .addCase(getWishLists.fulfilled, (state, action) => {
        state.loading = false;
        state.wishListData = action.payload;
      })
      .addCase(getWishLists.rejected, (state, action) => {
        state.loading = false;
      })

      .addCase(postWishList.pending, (state) => {
        state.loading = true;
      })
      .addCase(postWishList.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(postWishList.rejected, (state, action) => {
        state.loading = false;
      });
  },
});
export const { setcartlistdata } = cartslice.actions;
export default cartslice.reducer;
