"use client";

import { useEffect } from "react";
import { useCurrentLanguage } from "@/hooks";

/**
 * Component that updates Tamara widget configuration when language changes
 */
export default function TamaraConfig() {
  const currentLanguage = useCurrentLanguage();

  useEffect(() => {
    // Update Tamara widget configuration when language changes
    if (typeof window !== "undefined") {
      const lang = currentLanguage === "ar" ? "ar" : "en";
      
      // Initialize or update the config
      if (!window.tamaraWidgetConfig) {
        window.tamaraWidgetConfig = {
          lang: lang,
          country: "AE",
          publicKey: process.env.NEXT_PUBLIC_TAMARA_PUBLIC_KEY || "",
        };
      } else {
        // Update the language in existing config
        window.tamaraWidgetConfig.lang = lang;
      }

      // Dispatch a custom event to notify widgets of config change
      window.dispatchEvent(new CustomEvent("tamara:config:update", {
        detail: { lang: lang }
      }));
    }
  }, [currentLanguage]);

  return null; // This component doesn't render anything
}

