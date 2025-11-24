import React, { useState, useEffect } from "react";
import { getAssetsUrl } from "../utils/helpers";
import { useCurrentLanguage } from "@/hooks";
import { IoCloseSharp } from "react-icons/io5";

const InfoCardWithModal = ({ icon, heading, description, modalContent }) => {
  const [open, setOpen] = useState(false);
  const currentLanguage = useCurrentLanguage();
  const isRTL = currentLanguage === "ar";

  useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Cleanup when unmounting
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [open]);

  return (
    <>
      <div
        className="flex w-full gap-1.5 items-center p-6 bg-white rounded-2xl wallet-cards-shadows cursor-pointer transition"
        onClick={() => setOpen(true)}
      >
        <div className="h-12 rounded-lg text-2xl">
          <img src={getAssetsUrl(icon)} alt="" />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xl font-semibold text-[#191B1C]">
            {heading}
          </span>
          <span className="font-normal text-[#43494B]">{description}</span>
        </div>
        <div className="ml-auto">
          <img
            src={getAssetsUrl("vector_icons/arrow_right.svg")}
            alt="Arrow"
            className={`w-3 h-3 md:w-4 md:h-4 cursor-pointer grayscale transition-transform ${
              isRTL ? "rotate-180" : ""
            }`}
            loading="lazy"
          />
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="relative">
            {modalContent}
            <button
              className="absolute -top-4 right-5 p-2 shadow-[0_4px_12px_0_rgba(0,0,0,0.06)] bg-[#FCFCFC] rounded-full text-[#191B1C]"
              onClick={() => setOpen(false)}
            >
              <IoCloseSharp className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default InfoCardWithModal;
