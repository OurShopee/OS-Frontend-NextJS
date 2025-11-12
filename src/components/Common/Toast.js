"use client";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCurrentLanguage } from "@/hooks";

const Toast = () => {
  const currentLanguage = useCurrentLanguage();
  const isRTL = currentLanguage === "ar";

  return (
    <ToastContainer
      position={isRTL ? "top-left" : "top-right"}
      rtl={isRTL}
      newestOnTop
      closeOnClick
      pauseOnFocusLoss
      pauseOnHover
      draggable
      theme="light"
      autoClose={4000}
      bodyClassName={isRTL ? "text-right" : undefined}
    />
  );
};

export default Toast;
