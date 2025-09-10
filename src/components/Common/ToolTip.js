"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=www.ourshopee.com";
const APP_STORE_URL =
  "https://apps.apple.com/in/app/ourshopee-online-shopping/id1226954989";

const ToolTip = ({ text, handleToolTip }) => {
  const [store, setStore] = useState(null);

  useEffect(() => {
    // Safe browser detection only on client side
    if (typeof window !== "undefined") {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      if (/android/i.test(userAgent)) {
        setStore("android");
      } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        setStore("ios");
      } else {
        setStore("web");
      }
    }
  }, []);

  const renderButton = () => {
    if (store === "android" || store === "ios") {
      const link = store === "android" ? PLAY_STORE_URL : APP_STORE_URL;
      return (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold px-2 py-1 bg-yellow-400 text-black rounded-lg text-sm whitespace-nowrap hover:bg-yellow-500 transition-colors"
        >
          {store === "android" ? "Get on Play Store" : "Download on App Store"}
        </a>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-gray-900 text-white">
      <div className="flex items-center justify-between px-3 py-3 max-w-full overflow-x-auto">
        {/* Left side - Icon and text */}
        <div className="flex items-center gap-2 flex-1">
          <button
            type="button"
            onClick={handleToolTip}
            className="bg-transparent border-0 text-white text-3xl p-0 leading-none hover:text-gray-300 transition-colors"
            aria-label="Close"
          >
            &times;
          </button>
          <img
            src="/favicon.png"
            alt="Ourshopee App Icon"
            style={{ width: 35, height: 35 }}
          />
          <div className="flex flex-col text-sm">
            <span className="font-bold">App–solutely better on the app.</span>
            <span className="text-gray-400 text-xs">
              {store === "android"
                ? "4.1★ rating with 500K+ downloads"
                : store === "ios"
                ? "Available on iPhone, iPad & Mac"
                : "Take me to the app."}
            </span>
          </div>
        </div>

        {/* Right side - Button */}
        <div className="ml-2 flex-shrink-0">{renderButton()}</div>
      </div>
    </div>
  );
};

export default ToolTip;
