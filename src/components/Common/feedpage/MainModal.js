import { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { MediaQueries } from "../utils";

const InfoCardWithModal = ({ modalContent }) => {
  const { isMobile } = MediaQueries();
  const [open, setOpen] = useState(false);

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

  const handleClose = () => setOpen(false);

  if (!open) return;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-50 ${
          isMobile ? "flex items-end" : "flex items-center justify-center"
        }`}
        onClick={handleClose}
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
            onClick={handleClose}
          >
            <IoCloseSharp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
};

export default InfoCardWithModal;
