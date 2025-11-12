"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";

/**
 * Component that sets the direction (dir) attribute on html and body elements
 * based on the current language from Redux store
 */
export default function RTLDirection() {
  const currentLanguage = useSelector(
    (state) => state.globalslice?.currentLanguage || "en"
  );

  useEffect(() => {
    // Set direction based on language
    const direction = currentLanguage === "ar" ? "rtl" : "ltr";
    const lang = currentLanguage === "ar" ? "ar" : "en";

    // Update html element
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("dir", direction);
      document.documentElement.setAttribute("lang", lang);

      // Update body element
      document.body.setAttribute("dir", direction);

      // Add/remove RTL class for additional styling
      if (direction === "rtl") {
        document.documentElement.classList.add("rtl");
        document.body.classList.add("rtl");
      } else {
        document.documentElement.classList.remove("rtl");
        document.body.classList.remove("rtl");
      }
    }
  }, [currentLanguage]);

  return null; // This component doesn't render anything
}

