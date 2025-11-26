import { MediaQueries } from "@/components/utils";
import { useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";

const MainModal = ({ isOpen, onClose, modalContent }) => {
  const { isMobile } = MediaQueries();

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-50 ${
          isMobile ? "flex items-end" : "flex items-center justify-center"
        }`}
        onClick={onClose}
      >
        <div
          className={`relative ${
            isMobile
              ? "w-full max-h-[90vh] bg-white rounded-t-3xl animate-slide-up overflow-visible"
              : ""
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`${isMobile ? "max-h-[90vh] overflow-y-auto" : ""}`}>
            {modalContent}
          </div>
          <button
            className="absolute -top-4 right-5 p-2 shadow-[0_4px_12px_0_rgba(0,0,0,0.06)] bg-[#FCFCFC] rounded-full text-[#191B1C] hover:bg-gray-100 transition-colors z-10"
            onClick={onClose}
          >
            <IoCloseSharp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
};

export default MainModal;
