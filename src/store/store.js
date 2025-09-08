import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import userslice from "./slice/userslice";
import globalslice from "./slice/globalslice";
import cartslice from "./slice/cartslice";

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
