import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import userslice from "./slice/userslice";
// Use the slices from /src/redux/ since that's where AppInitializer imports from
import globalslice from "../redux/globalslice";
import cartslice from "../redux/cartslice";
import homeslice from "../redux/homeslice";
import formslice from "../redux/formslice";
import categoryslice from "../redux/categoryslice";
import productslice from "../redux/productslice";
import addresslice from "../redux/addresslice";
import paymentslice from "../redux/paymentslice";

let storage;
if (typeof window !== "undefined") {
  storage = require("redux-persist/lib/storage").default;
} else {
  storage = {
    getItem: () => Promise.resolve(null),
    setItem: () => Promise.resolve(),
    removeItem: () => Promise.resolve(),
  };
}

const rootReducer = combineReducers({
  userslice,
  globalslice,
  cartslice,
  homeslice,
  formslice,
  categoryslice,
  productslice,
  addresslice,
  paymentslice,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
