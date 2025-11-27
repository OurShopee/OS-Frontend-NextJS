"use client";
import React, { useMemo } from "react";
import InfoCardWithModal from "@/components/wallet/InfoCardWithModal";
import { getAssetsUrl } from "../utils/helpers";
import { useRouter } from "next/navigation";

const DATE_FORMAT_OPTIONS = {
  day: "2-digit",
  month: "short",
  year: "2-digit",
};

const Transactions = ({ transactions = [], limit = 5 }) => {
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

  const visibleTransactions = useMemo(() => {
    if (!parsedTransactions.length) {
      return [];
    }
    if (typeof limit === "number") {
      return parsedTransactions.slice(0, limit);
    }
    return parsedTransactions;
  }, [parsedTransactions, limit]);

  if (!parsedTransactions.length) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col gap-1 w-full">
        {visibleTransactions.map((tx) => (
          <InfoCardWithModal
            key={tx.id || `${tx.order_id}-${tx.created_at}`}
            modalContent={({ onClose }) => (
              <TransactionModalContent transaction={tx} onClose={onClose} />
            )}
            renderTrigger={({ onOpen }) => (
              <div
                role="button"
                tabIndex={0}
                onClick={onOpen}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onOpen();
                  }
                }}
                className="flex items-center justify-between w-full border-gray-100 pb-6 last:border-b-0 last:pb-0 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7A5AF8] rounded-xl px-1"
              >
                <div className="flex items-center gap-4">
                  <div className="lg:w-[60px] lg:h-[60px] w-[40px] h-[40px] rounded-2xl bg-[#EEEBFA] flex items-center justify-center">
                    <img
                      src={getAssetsUrl("wallet/transaction_wallet.svg")}
                      alt="Wallet"
                      className="lg:w-10 lg:h-10 w-[30px] h-[30px]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-base lg:font-semibold font-medium text-gray-900">
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
                  <span className="text-xs text-gray-500">
                    {tx.formattedDate}
                  </span>
                </div>
              </div>
            )}
          />
        ))}
      </div>
    </>
  );
};
const TransactionModalContent = ({ transaction, onClose }) => {
  console.log("transaction", transaction);
  const router = useRouter();
  if (!transaction) {
    return null;
  }

  const paymentMode =
    transaction?.metadata?.payment_mode ||
    transaction.payment_mode ||
    "Wallet";

  return (
    <div className="relative w-full max-w-md rounded-[32px] bg-[#F5F2FF] p-6 shadow-2xl">
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <p className="text-xl font-semibold text-gray-900">
            Transaction Summary
          </p>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEEBFA]">
                  <img
                    src={getAssetsUrl("wallet/transaction_wallet.svg")}
                    alt="Transaction type"
                    className="h-8 w-8"
                  />
                </span>
                <div className="flex flex-col">
                  <span className="text-base font-semibold text-gray-900">
                    {transaction.source_text ||
                      (transaction.tx_type === "CREDIT"
                        ? "Refund"
                        : "Transaction")}
                  </span>
                  <span className="text-sm text-[#7C8183]">{paymentMode}</span>
                </div>
              </div>
              <span
                className={`text-2xl font-semibold ${
                  transaction.tx_type === "CREDIT"
                    ? "text-[#22C55E]"
                    : "text-[#F97316]"
                }`}
              >
                {formatAmount(transaction)}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="space-y-4 text-sm">
            <DetailRow label="Order ID" value={transaction.order_id || "--"} />
            <DetailRow label="Payment Mode" value={transaction?.order?.order_ref_code || "--"} />
            <DetailRow
              label="Date"
              value={getFormattedDate(transaction.created_at)}
            />
            <DetailRow
              label="Time"
              value={getFormattedTime(transaction.created_at)}
            />
          </div>
        </div>

        <button
          className="w-full rounded-[16px] bg-[#5C2FF1] py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-[#4b25c4] transition-colors"
          onClick={() => router.push("/my-orders")}
        >
          View Order Detail
        </button>
      </div>
    </div>
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

const getFormattedDate = (dateString) => {
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "--";
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch (err) {
    return "--";
  }
};

const getFormattedTime = (dateString) => {
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "--";
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch (err) {
    return "--";
  }
};

export default Transactions;
