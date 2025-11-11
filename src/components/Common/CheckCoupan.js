"use client";

import React, { useEffect, useState } from "react";
import {
  checkCouponCodeapi,
  clearCouponMsg,
  removeCoupon,
} from "@/redux/paymentslice";
import { useDispatch, useSelector } from "react-redux";
import { HiMiniCheckBadge } from "react-icons/hi2";
import { useContent, useCurrentLanguage } from "@/hooks";

const CheckCoupan = ({ prodId, qty, sku, paymentMethods, price }) => {
  const dispatch = useDispatch();
  const [singleCheckout, setSingleCheckout] = useState(false);
  const cartlistdata = useSelector((state) => state.cartslice.cartlistdata);
  const coupanmsg = useSelector((state) => state.paymentslice.coupanmsg);
  const coupon = useSelector((state) => state.paymentslice.coupon);
  const [coupancode, setCoupancode] = useState("");
  const skulist = cartlistdata?.data?.result?.map((ele) => ele.sku);
  const currentLanguage = useCurrentLanguage();
  const isRTL = currentLanguage === "ar";
  const couponCodeLabel = useContent("checkout.couponCode");
  const enterCouponPlaceholder = useContent("checkout.enterCouponCode");
  const applyButtonText = useContent("buttons.apply");
  const couponAppliedText = useContent("checkout.couponApplied");

  const onchange = (e) => {
    setCoupancode(e.target.value);
    if (e.target.value === "") {
      dispatch(clearCouponMsg());
    }
  };

  const checkcoupan = async () => {
    const computedCartIds = prodId && qty
      ? `${prodId}|${qty}|${price}`
      : cartlistdata?.data?.result
          .map(
            (each) => `${each.product_id}|${each.quantity}|${each.single_price}`
          )
          .join(",");

    const input_data = {
      cartIds: computedCartIds,
      coupon: coupancode,
      skulist: singleCheckout ? [sku] : skulist,
      offer: 0,
      tamount: singleCheckout
        ? paymentMethods?.sub_total.replace(/[^\d.]/g, "")
        : cartlistdata?.data?.grand_total.replace(/[^\d.]/g, ""),
    };
    await dispatch(checkCouponCodeapi(input_data));
  };

  useEffect(() => {
    if (prodId && qty) {
      setSingleCheckout(true);
    }
    if (coupancode) {
      checkcoupan();
    }
  }, [prodId, qty, sku]);

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <div className="coupan-title">{couponCodeLabel}</div>
      <div
        className={`d-flex footercontactus align-items-stretch w-100 ${
          isRTL ? "flex-row" : ""
        }`}
      >
        <div className="position-relative flex-grow-1 min-w-0">
          <input
            type="text"
            placeholder={enterCouponPlaceholder}
            value={coupancode}
            onChange={onchange}
            className={`header-inputbox coupan-input w-100 ${
              isRTL ? "ps-4 text-start rounded-l-none rounded-r-lg" : "pe-4 rounded-r-none rounded-l-lg"
            }`}
            style={{
              minWidth: 0, // Prevents flex item from overflowing
              boxSizing: "border-box",
            }}
          />
          {coupancode && (
            <span
              onClick={() => {
                dispatch(removeCoupon());
                setCoupancode("");
              }}
              style={{
                position: "absolute",
                [isRTL ? "left" : "right"]: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "16px",
                color: "#999",
                zIndex: 1,
              }}
            >
              ✕
            </span>
          )}
        </div>
        <button
          className={`min-w-[90px] max-w-[90px] text-[#191B1C] flex justify-center items-center bg-secondary border-none flex-shrink-0 ${
            isRTL ? "rounded-tl-[8px] rounded-bl-[8px]" : "rounded-tr-[8px] rounded-br-[8px]"
          }`}
          onClick={checkcoupan}
          style={{
            whiteSpace: "nowrap", // Prevents text wrapping
          }}
        >
          {applyButtonText}
        </button>
      </div>

      {coupanmsg && (
        <div
          className={`mt-1 ${isRTL ? "text-start" : "text-end"}`}
          style={{
            fontFamily: "Outfit",
            fontSize: "14px",
            color: coupon && coupon.discount > 0 ? "green" : "red",
          }}
        >
          {coupanmsg}
        </div>
      )}
      {coupon?.discount && (
        <div className={`viewavailable-title cursor-pointer ${isRTL ? "flex-row-reverse text-end" : ""}`}>
          <HiMiniCheckBadge className="text-2xl" />
          {couponAppliedText}
        </div>
      )}
    </div>
  );
};

export default CheckCoupan;
