import React, { useMemo, useState } from "react";
import { FiRefreshCcw } from "react-icons/fi";
import { getAssetsUrl } from "../utils/helpers";

const DATE_FORMAT_OPTIONS = {
  day: "2-digit",
  month: "short",
  year: "2-digit",
};

const Transactions = ({ transactions = [] }) => {
  const [activeTransaction, setActiveTransaction] = useState(null);

  const parsedTransactions = useMemo(
    () =>
      transactions.map((tx) => ({
        ...tx,
        formattedDate: formatDate(tx.created_at),
        amountLabel: formatAmount(tx),
        amountClass:
          tx.tx_type === "CREDIT" ? "text-green-600" : "text-red-500",
      })),
    [transactions]
  );

  const handleSeeMore = (tx) => {
    setActiveTransaction(tx);
  };

  const closeModal = () => setActiveTransaction(null);

  if (!parsedTransactions.length) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col gap-1 w-full">
        {parsedTransactions.slice(0, 5).map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between w-full  border-gray-100 pb-6 last:border-b-0 last:pb-0"
          >
            <div className="flex items-center gap-4">
              <div className="w-[52px] h-[52px] rounded-2xl bg-[#EEEBFA] flex items-center justify-center">
                <img
                  src={getAssetsUrl("wallet/transaction_wallet.svg")}
                  alt="Wallet"
                  className="w-10 h-10"
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-base font-semibold text-gray-900">
                  {tx.source_text || "Wallet Transaction"}
                </p>
                <p className="text-sm text-[#43494B] font-normal">
                  Order ID:{" "}
                  <span className="font-semibold text-gray-700">
                    {tx.order_id || "--"}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className={`text-lg font-semibold ${tx.amountClass}`}>
                {tx.amountLabel}
              </span>
              <span className="text-xs text-gray-500">{tx.formattedDate}</span>
              {/* <button
                type="button"
                onClick={() => handleSeeMore(tx)}
                className="text-xs font-semibold text-[#7A5AF8] hover:underline"
              >
                See more
              </button> */}
            </div>
          </div>
        ))}
      </div>

      {activeTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {activeTransaction.source_text || "Wallet Transaction"}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(activeTransaction.created_at, {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-800 text-xl leading-none"
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-sm text-gray-600">
              <DetailRow
                label="Transaction Type"
                value={activeTransaction.tx_type}
              />
              <DetailRow
                label="Amount"
                value={formatAmount(activeTransaction)}
              />
              <DetailRow
                label="Balance Before"
                value={formatCurrency(activeTransaction.balance_before)}
              />
              <DetailRow
                label="Balance After"
                value={formatCurrency(activeTransaction.balance_after)}
              />
              <DetailRow
                label="Order ID"
                value={activeTransaction.order_id || "--"}
              />
              <DetailRow
                label="Reason"
                value={activeTransaction?.metadata?.reason || "--"}
              />
            </div>

            <button
              className="mt-6 w-full py-3 bg-[#7A5AF8] text-white rounded-xl font-semibold hover:bg-[#6843f5] transition-colors"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-gray-900">{value}</span>
  </div>
);

const formatDate = (dateString, options = DATE_FORMAT_OPTIONS) => {
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "--";
    return date.toLocaleDateString("en-US", options);
  } catch (err) {
    return "--";
  }
};

const formatAmount = (tx) => {
  const amount = Number(tx.amount) || 0;
  const prefix = tx.tx_type === "CREDIT" ? "+" : "-";
  return `${prefix}${amount.toFixed(2)}`;
};

const formatCurrency = (value) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return "--";
  return numeric.toFixed(2);
};

export default Transactions;
