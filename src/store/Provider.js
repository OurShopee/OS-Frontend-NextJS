"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import { configureAxios } from "@/api/config";
import AppInitializer from "./AppInitializer";
import Toast from "@/components/Common/Toast";

export default function ReduxProvider({ children }) {
  useEffect(() => {
    configureAxios();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppInitializer />
        {children}
        <Toast />
      </PersistGate>
    </Provider>
  );
}
