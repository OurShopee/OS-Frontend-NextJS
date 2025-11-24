import React, { useState } from "react";

const InfoCardWithModal = ({
  icon, // Pass a react-icons component
  heading,
  description,
  modalTitle,
  modalContent,
  modalActions,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="flex w-full items-center p-6 bg-white rounded-2xl wallet-cards-shadows cursor-pointer transition"
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 text-2xl">
          {icon}
        </div>
        <div className="ml-4 flex flex-col">
          <span className="text-lg font-semibold">{heading}</span>
          <span className="text-gray-500">{description}</span>
        </div>
        <div className="ml-auto">
          <span className="text-2xl text-gray-400">&#8250;</span>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 flex flex-col">
            <div className="flex items-center mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 text-2xl">
                {icon}
              </div>
              <span className="ml-3 text-xl font-semibold">{modalTitle}</span>
              <button
                className="ml-auto text-gray-400 hover:text-gray-600"
                onClick={() => setOpen(false)}
              >
                &#10005;
              </button>
            </div>
            <div className="text-gray-700 mb-6">{modalContent}</div>
            {modalActions && (
              <div className="flex justify-end">{modalActions}</div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default InfoCardWithModal;
