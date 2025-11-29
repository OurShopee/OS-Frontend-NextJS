import { MediaQueries } from "@/components/utils";
import { useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";

const MainModal = ({
  isOpen = false,
  onClose = () => {},
  modalContent,
  modalWidth = "",
}) => {
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

  if (!isOpen) return;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 backdrop-blur-md z-50 ${
          isMobile ? "flex items-end" : "flex items-center justify-center"
        }`}
      >
        <div
          className={`relative w-auto md:max-w-${modalWidth} mt-16 overflow-hidden ${
            isMobile
              ? "rounded-t-3xl animate-slide-up"
              : "rounded-3xl animate-scale-in"
          }`} // hide native corners
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={`custom-scrollbar1 max-h-[78vh] overflow-y-auto md:max-h-[85vh] -pr-4`}
          >
            {modalContent}
          </div>

          <button
            className="absolute top-4 right-5 p-2 shadow-[0_4px_12px_0_rgba(0,0,0,0.06)] bg-[#FCFCFC] rounded-full text-[#191B1C] z-10"
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
