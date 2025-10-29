"use client";
import { createContext, useContext } from "react";

const ServerDataContext = createContext();

export const useServerData = () => {
  const context = useContext(ServerDataContext);
  if (!context) {
    throw new Error("useServerData must be used within a ServerDataProvider");
  }
  return context;
};

export const ServerDataProvider = ({ children, serverData }) => {
  return (
    <ServerDataContext.Provider value={serverData}>
      {children}
    </ServerDataContext.Provider>
  );
};
