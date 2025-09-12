"use client";
import { useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";

function AlertModal({ show, setShow, title, message, action, product }) {
  const dispatch = useDispatch();
  const modalRef = useRef(null);
  const removeButtonRef = useRef(null);
  const previouslyFocusedElement = useRef(null);

  // Focus management for accessibility
  useEffect(() => {
    if (show) {
      // Save current focus
      previouslyFocusedElement.current = document.activeElement;

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
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        clearTimeout(timer);
        document.removeEventListener("keydown", handleKeyDown);
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

  return (
    <>
      <Modal
        show={show}
        onHide={handleCancel}
        keyboard={true}
        centered
        dialogClassName="alert-width"
        size="md"
        aria-labelledby="alert-modal-title"
        aria-describedby="alert-modal-description"
      >
        <div
          className="p-6 w-full font-[Outfit]"
          ref={modalRef}
          role="document"
        >
          <div className="flex items-center justify-between border-b pb-3">
            {title && (
              <h2
                id="alert-modal-title"
                className="mb-0 text-xl font-semibold text-center uppercase text-black"
              >
                {title}
              </h2>
            )}
            <div className="modalclose flex cursor-pointer justify-end">
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

          <div className="flex gap-4 mt-5 font-[Outfit]">
            <button
              ref={removeButtonRef}
              type="button"
              onClick={handleRemove}
              className="flex-1 text-sm font-semibold text-[#F34845] px-4 py-3 bg-white uppercase danderborder rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              aria-describedby="alert-modal-description"
            >
              Remove
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 text-sm font-semibold px-4 py-3 bg-[#5232C2] text-white uppercase rounded-lg hover:bg-[#5132c2f1] border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default AlertModal;
