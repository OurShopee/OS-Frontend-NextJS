"use client";

import Transactions from "@/components/Common/transactions";
import { getAssetsUrl } from "@/components/utils/helpers";

const TransactionsModal = ({
  isOpen,
  onClose,
  heading,
  transactions = [],
  emptyMessage = "No transactions available.",
}) => {
  if (!isOpen) {
    return null;
  }

  const hasTransactions = transactions.length > 0;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-label={heading}
    >
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-full shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">{heading}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl leading-none"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <div className="px-6 py-5 overflow-y-auto">
          {hasTransactions ? (
            <Transactions transactions={transactions} />
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
              <img
                src={getAssetsUrl("no_transac.svg")}
                alt="No transactions illustration"
                className="w-[124px] h-[124px] object-contain"
                loading="lazy"
              />
              <p className="text-base text-gray-500 font-medium">{emptyMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsModal;

