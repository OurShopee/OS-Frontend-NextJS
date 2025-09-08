import { configureStore } from "@reduxjs/toolkit";
import globalslice from "./globalslice";
import homeslice from "./homeslice";
import formslice from "./formslice";
import categoryslice from "./categoryslice";
import productslice from "./productslice";
import cartslice from "./cartslice";
import addresslice from "./addresslice";
import paymentslice from "./paymentslice";

const store = configureStore({
  reducer: {
    globalslice: globalslice,
    homeslice: homeslice,
    formslice: formslice,
    categoryslice: categoryslice,
    productslice: productslice,
    cartslice: cartslice,
    addresslice: addresslice,
    paymentslice: paymentslice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
