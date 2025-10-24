import React from "react";

/**
 * Small responsive success modal.
 * - Uses Tailwind classes with `` prefix.
 * - Uses Tailwind classes with `` prefix.
 *
 * Props:
 * - isOpen: boolean – controls visibility
 * - onClose: function – invoked when close button or overlay is clicked
 * - title: string – optional heading (default Thank you!)
 * - message: string – optional message (default We’ll get back to you soon.)
 */
const SuccessModal = ({
  isOpen,
  onClose,
  title = "Thank you!",
  message = "We\u2019ll get back to you soon.",
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
      aria-describedby="success-modal-desc"
    >
      <div className="w-[90%] max-w-sm rounded-lg bg-white p-5 shadow-xl relative text-center mx-4">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-full p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="h-6 w-6 text-green-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h3
          id="success-modal-title"
          className="text-lg font-semibold text-gray-900"
        >
          {title}
        </h3>
        <p id="success-modal-desc" className="mt-1 text-sm text-gray-600">
          {message}
        </p>

        <div className="mt-4">
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition duration-150"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
