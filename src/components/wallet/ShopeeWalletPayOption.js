import React from "react";

// Emoji can be swapped for <img /> if preferred for brand consistency
const ShopeeWalletPayOption = ({
  checked,
  onChange,
  balance = 103,
  currencySymbol = "₫",
}) => (
  <div className="flex items-center justify-between w-full bg-white rounded-[24px] shadow-[0_4px_12px_0_rgba(0,0,0,0.06)] px-8 py-8 min-h-[88px]">
    {/* Left section: checkbox and label */}
    <div className="flex items-center gap-4">
      <label className="flex items-center cursor-pointer">
        {/* Custom styled checkbox */}
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer sr-only"
        />
        <span className="w-12 h-12 rounded-[16px] border-2 border-[#E5E8EA] flex items-center justify-center bg-white peer-checked:border-[#191B1C] transition-all duration-200">
          {/* Draw checkmark if checked */}
          {checked && (
            <span className="block w-5 h-5 rounded-full bg-[#191B1C]" />
          )}
        </span>
        {/* Label and emoji */}
        <span className="ml-6 text-2xl font-semibold text-[#191B1C] flex items-center gap-2">
          Pay with Shopee Wallet
          <span className="ml-2 text-2xl" role="img" aria-label="wallet">
            👜
          </span>
        </span>
      </label>
    </div>
    {/* Right section: Available balance */}
    <div className="text-xl font-medium text-[#43494B] flex items-center gap-2">
      <span>Total Available Balance&nbsp;:</span>
      <span className="font-bold text-[#191B1C] text-2xl">
        {currencySymbol}
        {balance}
      </span>
    </div>
  </div>
);

export default ShopeeWalletPayOption;
