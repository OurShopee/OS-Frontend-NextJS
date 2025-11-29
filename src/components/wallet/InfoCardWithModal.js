import React, { useState, useEffect } from "react";
import { getAssetsUrl } from "../utils/helpers";
import { useCurrentLanguage } from "@/hooks";
import { IoCloseSharp } from "react-icons/io5";
import { MediaQueries } from "../utils";

const InfoCardWithModal = ({
  icon,
  heading,
  description,
  modalContent,
  renderTrigger,
  containerClassName = "",
}) => {
  const { isMobile } = MediaQueries();
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

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const renderedModalContent =
    typeof modalContent === "function"
      ? modalContent({ onClose: handleClose })
      : modalContent;

  return (
    <>
      {renderTrigger ? (
        renderTrigger({
          isOpen: open,
          onOpen: handleOpen,
          onClose: handleClose,
        })
      ) : (
        <div
          className={`flex w-full items-center bg-white rounded-2xl wallet-cards-shadows cursor-pointer transition ${
            isMobile ? "gap-3 p-4" : "gap-3 p-6"
          } ${containerClassName}`}
          onClick={handleOpen}
        >
          <div className="h-12 w-12 flex-shrink-0 rounded-lg text-2xl">
            <img src={getAssetsUrl(icon)} alt="" />
          </div>
          <div className="flex flex-col gap-2 min-w-0 flex-1">
            <span className="lg:text-xl text-lg font-semibold text-[#191B1C] leading-tight">
              {heading}
            </span>
            <span className="font-normal text-[#43494B] lg:text-base text-sm leading-snug">
              {description}
            </span>
          </div>
          <div className="ml-auto flex-shrink-0">
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
      )}

      {open && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-40 z-50 ${
            isMobile
              ? "flex items-end"
              : "flex items-center justify-center"
          }`}
          onClick={handleClose}
        >
          <div
            className={`relative ${
              isMobile
                ? "w-full h-[60vh] sm:max-h-[90vh] bg-white rounded-t-3xl animate-slide-up overflow-visible"
                : ""
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`${isMobile ? "max-h-[60vh] overflow-y-auto" : ""}`}>
              {renderedModalContent}
            </div>
            <button
              className="absolute -top-4 right-5 p-2 shadow-[0_4px_12px_0_rgba(0,0,0,0.06)] bg-[#FCFCFC] rounded-full text-[#191B1C] hover:bg-gray-100 transition-colors z-10"
              onClick={handleClose}
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
