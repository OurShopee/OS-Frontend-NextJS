import React from 'react';

/**
 * Small responsive success modal.
 * - Uses Tailwind classes with `tw-` prefix.
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
  title = 'Thank you!',
  message = 'We\u2019ll get back to you soon.',
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div
      className="tw-fixed tw-inset-0 tw-z-50 tw-flex tw-items-center tw-justify-center tw-bg-black/50 tw-backdrop-blur-sm"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
      aria-describedby="success-modal-desc"
    >
      <div className="tw-w-[90%] tw-max-w-sm tw-rounded-lg tw-bg-white tw-p-5 tw-shadow-xl tw-relative tw-text-center tw-mx-4">
        <button
          onClick={onClose}
          aria-label="Close"
          className="tw-absolute tw-right-3 tw-top-3 tw-rounded-full tw-p-1 tw-text-gray-500 hover:tw-text-gray-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="tw-h-5 tw-w-5">
            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
          </svg>
        </button>

        <div className="tw-mx-auto tw-mb-3 tw-flex tw-h-12 tw-w-12 tw-items-center tw-justify-center tw-rounded-full tw-bg-green-100">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="tw-h-6 tw-w-6 tw-text-green-600">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h3 id="success-modal-title" className="tw-text-lg tw-font-semibold tw-text-gray-900">{title}</h3>
        <p id="success-modal-desc" className="tw-mt-1 tw-text-sm tw-text-gray-600">{message}</p>

        <div className="tw-mt-4">
          <button
            onClick={onClose}
            className="tw-inline-flex tw-items-center tw-justify-center tw-rounded-md tw-bg-blue-600 tw-px-4 tw-py-2 tw-text-white hover:tw-bg-blue-700 tw-transition tw-duration-150"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;


