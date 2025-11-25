import { checkCouponCode } from "@/api/cart";
import { GetPlaceOrder } from "@/api/payments";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const GetPlaceOrderapi = createAsyncThunk(
  "fetchGetPlaceOrderdata",
  async (input_data) => {
    const res = await GetPlaceOrder(input_data);
    return res;
  }
);
export const checkCouponCodeapi = createAsyncThunk(
  "fetchcheckCouponCodedata",
  async (input_data) => {
    const res = await checkCouponCode(input_data);
    return { ...res, coupon: input_data.coupon };
  }
);

const paymentslice = createSlice({
  name: "cartslice",
  initialState: {
    loading: false,
    error: null,
    paymentmethodsdata: [],
    coupanmsg: "",
    coupon: null,
    donationfee: "",
    showdonation: true,
    selecteddefaultpaymentmethod: {},
    selecteddeafultoption: [],
    walletValue: 0,
  },
  reducers: {
    setdonationfee: (state, action) => {
      state.donationfee = action.payload;
    },
    setpaymentmethodsdata: (state, action) => {
      state.paymentmethodsdata = action.payload;
    },
    setshowdonation: (state, action) => {
      state.showdonation = action.payload;
    },
    setselecteddefaultpaymentmethod: (state, action) => {
      state.selecteddefaultpaymentmethod = action.payload;
    },
    setselecteddeafultoption: (state, action) => {
      state.selecteddeafultoption = action.payload;
    },
    clearCouponMsg: (state) => {
      state.coupanmsg = "";
    },
    clearCoupon: (state) => {
      state.coupon = null;
    },
    removeCoupon: (state) => {
      state.coupanmsg = "";
      state.coupon = null;
    },
    setwalletValue: (state, action) => {
      state.walletValue = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      //....................place order
      .addCase(GetPlaceOrderapi.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetPlaceOrderapi.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentmethodsdata = action.payload.data;
        if (action.payload.status === "success") {
          state.donationfee = action.payload.data.donation;
          state.selecteddefaultpaymentmethod =
            action.payload.data.payment_method.find((m) => m.selected).id;
          state.walletValue = action.payload.data.wallet;
        }
      })
      .addCase(GetPlaceOrderapi.rejected, (state, action) => {
        state.loading = false;
        state.walletValue = 0;
      })

      //......................coupancode
      .addCase(checkCouponCodeapi.fulfilled, (state, action) => {
        if (action.payload.status === "success") {
          state.coupanmsg = action.payload.data.msg;
          state.coupon = {
            ...action.payload.data,
            coupon: action.payload.coupon,
          };
        } else {
          state.coupanmsg = action.payload.msg || "Invalid Coupon";
          state.coupon = null;
        }
      });
  },
});
export const {
  setdonationfee,
  setshowdonation,
  setselecteddefaultpaymentmethod,
  setselecteddeafultoption,
  setpaymentmethodsdata,
  clearCouponMsg,
  clearCoupon,
  removeCoupon,
  setwalletValue,
} = paymentslice.actions;
export default paymentslice.reducer;
