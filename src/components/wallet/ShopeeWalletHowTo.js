import React from "react";

// Step data
const steps = [
  {
    number: "1",
    heading: "Select Shopee Wallet",
    description:
      "During checkout, choose the Shopee Wallet as your payment method for quick and secure transaction",
  },
  {
    number: "2",
    heading: "Adjust Payment Amount",
    description:
      "You have the option to edit the amount you want to use from your wallet balance before finalizing your order.",
  },
  {
    number: "3",
    heading: "Complete Your Purchase",
    description:
      "Confirm the payment and successfully place your order, enjoying a hassle-free checkout experience.",
  },
];

const ShopeeWalletHowTo = () => (
  <div className="p-8 rounded-[32px] w-[42rem] h-[72vh] overflow-y-auto bg-gradient-to-br from-[#DBFFC8] to-[#FFFFFF]  flex flex-col items-center relative">
    {/* Title section */}
    <div className="pb-6 text-center w-full">
      <h2 className="text-[22px] font-semibold text-[#125810]">How to Use</h2>

      <span className="text-[32px] font-extrabold text-[#125810]">
        Shopee Wallet?
      </span>
    </div>
    {/* Steps */}
    <div className="w-full flex flex-col gap-[14px] px-6">
      {steps.map(({ number, heading, description }, i) => (
        <div
          key={number}
          className="relative flex bg-white rounded-[20px] p-5 shadow-[0_4px_12px_0_rgba(0,0,0,0.06)]"
        >
          {/* Left big number */}
          <span
            className={`${
              i % 2 == 0
                ? i === 2
                  ? "left-4 -bottom-1"
                  : "left-4 -top-1"
                : "right-4 -top-1"
            } absolute  text-[3.5rem] font-extrabold text-[#D1F3D3] select-none`}
            style={{ lineHeight: "1" }}
          >
            {number}
          </span>
          {/* Card content */}
          <div className={`${i % 2 == 0 ? "pl-9" : ""}`}>
            <span className="text-[22px] font-semibold text-[#43494B] block mb-2">
              {heading}
            </span>
            <span className="text-sm font-normal text-[#43494B]">
              {description}
            </span>
          </div>
        </div>
      ))}
    </div>
    {/* Decorative circles (optional, require SVG/CSS for full background match) */}
  </div>
);

export default ShopeeWalletHowTo;
