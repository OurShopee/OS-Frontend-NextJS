import React from "react";
import { FaLock } from "react-icons/fa6";

const PayNowFinal = ({ onPayNow = () => {}, formData }) => {
  console.log(formData)
  const paymentOptions = [
    { id: "card", label: "Pay by Card", fee: "฿44", feeLabel: "Processing Fees" },
    {
      id: "tabby",
      label: "Pay by Tabby : Free Installment Debit Card Accepted",
      fee: "฿44",
      feeLabel: "Processing Fees",
      tag: "tabby",
    },
    { id: "cod", label: "Cash On Delivery", fee: "FREE", feeLabel: "Processing Fees" },
  ];

  return (
    <div className="bg-white">
      <div className="flex flex-col lg:flex-row gap-6 p-6 lg:p-10">
        {/* Left column */}
        <div className="flex-1 space-y-6">
          <div className="rounded-3xl border border-[#F0F0F0] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-[#212121]">Order Summary</h2>
              <button className="text-sm font-semibold text-[#2F80ED] border border-[#DDEBFF] px-4 py-1.5 rounded-2xl">
                Edit Address
              </button>
            </div>
            <div className="space-y-1 text-[#4F4F4F]">
              <p className="font-medium">Delivery Address</p>
              <p>1/4 Pragatnagar Flats, opp. Jain derasaar , near Jain derasaar,</p>
              <p>Vijaynagar road , fheuhufeufhfnv</p>
              <p className="font-semibold">+971 42567834</p>
            </div>
          </div>

          <div className="rounded-3xl border border-[#F0F0F0] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] space-y-6">
            <h3 className="text-xl font-semibold text-[#212121]">Payment Options</h3>
            <div className="space-y-3">
              {paymentOptions.map((option, idx) => (
                <label
                  key={option.id}
                  className={`flex gap-4 items-start border rounded-2xl px-5 py-4 cursor-pointer transition-all ${
                    idx === 2 ? "border-[#2F80ED] bg-[#F8FBFF]" : "border-[#EAEAEA]"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentOption"
                    defaultChecked={option.id === "cod"}
                    className="mt-1"
                  />
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <p className="font-semibold text-[#1E1E1E]">{option.label}</p>
                      {option.tag && (
                        <span className="text-xs font-semibold uppercase bg-[#00E6B8] text-[#025E3C] px-2 py-1 rounded-md">
                          {option.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#6C7275]">
                      {option.feeLabel}: <span className="font-semibold text-[#1E1E1E]">{option.fee}</span>
                    </p>
                  </div>
                </label>
              ))}
            </div>

            <div className="rounded-2xl border border-[#EAEAEA] p-4 space-y-4">
              <label className="flex items-center gap-3 text-[#1E1E1E] font-semibold">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                Donate and make a difference
              </label>
              <p className="text-sm text-[#6C7275]">
                Your donation goes directly to those in need, bringing real hope and lasting change.
              </p>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-[#1E1E1E]">฿</span>
                <input
                  type="number"
                  min="1"
                  defaultValue={1}
                  className="w-24 rounded-xl border border-[#DADADA] px-3 py-2 focus:outline-none focus:border-[#2F80ED]"
                />
              </div>
              <div className="flex items-center gap-6 pt-2">
                <div className="h-8 w-20 rounded-lg bg-[#E8F5E9]" />
                <div className="h-8 w-20 rounded-lg bg-[#E3F2FD]" />
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="w-full lg:w-[360px]">
          <div className="rounded-3xl border border-[#F0F0F0] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] space-y-6">
            <h3 className="text-xl font-semibold text-[#212121]">Price Details</h3>

            <div className="space-y-3 text-[#4F4F4F] text-sm">
              {[
                { label: "Subtotal", value: "฿513" },
                { label: "Processing Fee", value: "฿39" },
                { label: "Donation", value: "฿6" },
                { label: "Shipping Charge", value: "FREE", emphasize: true },
              ].map((item) => (
                <div key={item.label} className="flex justify-between">
                  <span>{item.label}</span>
                  <span className={`${item.emphasize ? "text-[#27AE60] font-semibold" : "font-medium"}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center border-t border-[#F3F4F6] pt-4">
              <div>
                <p className="text-sm text-[#6C7275]">Total (Inc. of VAT)</p>
                <p className="text-2xl font-bold text-[#1E1E1E]">฿4366</p>
              </div>
              <p className="text-sm font-semibold text-[#2F80ED] cursor-pointer">View available offers</p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-[#1E1E1E]">Coupons</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="ENTER COUPON CODE"
                  className="flex-1 rounded-2xl border border-[#DADADA] px-4 py-2 text-sm uppercase tracking-wide focus:outline-none focus:border-[#2F80ED]"
                />
                <button className="px-4 py-2 rounded-2xl bg-[#E4E6EB] text-sm font-semibold text-[#1E1E1E]">
                  Apply
                </button>
              </div>
              <div className="rounded-2xl bg-[#E8FCEE] px-4 py-3">
                <p className="text-sm font-semibold text-[#1C7C54]">Your total saving ฿0</p>
              </div>
            </div>

            <button
              onClick={onPayNow}
              className="w-full rounded-2xl bg-[#FFC107] py-3 text-lg font-semibold text-[#1E1E1E] shadow-[0_10px_20px_rgba(255,193,7,0.35)]"
            >
              PAY NOW ฿4366
            </button>

            <div className="flex items-center justify-center gap-3 text-[#219653] text-sm font-semibold pt-2">
              <FaLock />
              <span>Safe & Secure Payment Transaction</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayNowFinal;