"use client";
import { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useContent, useCurrentLanguage } from "@/hooks";

function AlertModal({ show, setShow, title, message, action, product }) {
  const dispatch = useDispatch();
  const modalRef = useRef(null);
  const removeButtonRef = useRef(null);
  const previouslyFocusedElement = useRef(null);
  const currentLanguage = useCurrentLanguage();
  
  // Content translations
  const remove = useContent("buttons.remove");
  const cancel = useContent("buttons.cancel");

  // Focus management for accessibility
  useEffect(() => {
    if (show) {
      // Save current focus
      previouslyFocusedElement.current = document.activeElement;

      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";

      // Focus first button when modal opens
      const timer = setTimeout(() => {
        if (removeButtonRef.current) {
          removeButtonRef.current.focus();
        }
      }, 100);

      // Handle keyboard events
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          setShow(false);
        }

        // Trap focus within modal
        if (e.key === "Tab" && modalRef.current) {
          const focusableElements = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        clearTimeout(timer);
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "unset";
      };
    } else {
      // Restore focus when modal closes
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    }
  }, [show, setShow]);

  const handleRemove = () => {
    action(product?.cart_id);
  };

  const handleCancel = () => {
    setShow(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShow(false);
    }
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="alert-modal-title"
      aria-describedby="alert-modal-description"
    >
      <div
        className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 transform transition-all duration-300 scale-100 animate-fadeIn"
        ref={modalRef}
        role="document"
        dir={currentLanguage === "ar" ? "rtl" : "ltr"}
      >
        <div className="p-6 w-full font-[Outfit]">
          <div className={`flex items-center justify-between border-b pb-3 ${
            currentLanguage === "ar" ? "flex-row-reverse" : ""
          }`}>
            {title && (
              <h2
                id="alert-modal-title"
                className={`mb-0 text-xl font-semibold uppercase text-black ${
                  currentLanguage === "ar" ? "text-right" : "text-center"
                }`}
              >
                {title}
              </h2>
            )}
            <div className={`modalclose flex cursor-pointer ${
              currentLanguage === "ar" ? "justify-start" : "justify-end"
            }`}>
              <button
                onClick={handleCancel}
                className="bg-transparent border-0 p-1 hover:bg-gray-100 rounded transition-colors"
                aria-label="Close modal"
                type="button"
              >
                <IoClose size={30} />
              </button>
            </div>
          </div>

          {message && (
            <p
              id="alert-modal-description"
              className="mt-2 text-lg text-black font-medium"
            >
              {message}
            </p>
          )}

          <div className={`flex gap-4 mt-5 font-[Outfit] ${
            currentLanguage === "ar" ? "flex-row-reverse" : ""
          }`}>
            <button
              ref={removeButtonRef}
              type="button"
              onClick={handleRemove}
              className="flex-1 text-sm font-semibold text-[#F34845] px-4 py-3 bg-white uppercase danderborder rounded-lg hover:bg-red-50 focus:outline-none  transition-colors"
              aria-describedby="alert-modal-description"
            >
              {remove}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 text-sm font-semibold px-4 py-3 bg-[#5232C2] text-white uppercase rounded-lg hover:bg-[#5132c2f1] border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
            >
              {cancel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlertModal;
