"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  checkCouponCodeapi,
  clearCouponMsg,
  removeCoupon,
} from "@/redux/paymentslice";
import { useDispatch, useSelector } from "react-redux";
import { HiMiniCheckBadge } from "react-icons/hi2";
import { useContent, useCurrentLanguage } from "@/hooks";
import { CiDiscount1 } from "react-icons/ci";
import CouponModal from "./Modals/CouponModal";

const CheckCoupan = ({ prodId, qty, sku, paymentMethods, price, coupons }) => {
  const dispatch = useDispatch();
  const [singleCheckout, setSingleCheckout] = useState(false);
  const cartlistdata = useSelector((state) => state.cartslice.cartlistdata);
  const coupanmsg = useSelector((state) => state.paymentslice.coupanmsg);
  const coupon = useSelector((state) => state.paymentslice.coupon);
  const [coupancode, setCoupancode] = useState("");
  const [showCouponModal, setShowCouponModal] = useState(false);
  const inputFieldRef = useRef(null);

  const skulist = cartlistdata?.data?.result?.map((ele) => ele.sku);
  const currentLanguage = useCurrentLanguage();
  const isRTL = currentLanguage === "ar";

  const couponCodeLabel = useContent("checkout.couponCode");
  const enterCouponPlaceholder = useContent("checkout.enterCouponCode");
  const applyButtonText = useContent("buttons.apply");
  const couponAppliedText = useContent("checkout.couponApplied");
  const availableCoupons = useContent("checkout.availableCoupons");

  const onchange = (e) => {
    setCoupancode(e.target.value);
    if (e.target.value === "") {
      dispatch(clearCouponMsg());
    }
  };

  const checkcoupan = async (couponCode = null) => {
    const codeToUse = couponCode || coupancode;

    const computedCartIds =
      prodId && qty
        ? `${prodId}|${qty}|${price}`
        : cartlistdata?.data?.result
            ?.map(
              (each) =>
                `${each.product_id}|${each.quantity}|${each.single_price}`
            )
            .join(",");

    const input_data = {
      cartIds: computedCartIds,
      coupon: codeToUse,
      skulist: singleCheckout ? [sku] : skulist,
      offer: 0,
      tamount: singleCheckout
        ? paymentMethods?.sub_total.replace(/[^\d.]/g, "")
        : cartlistdata?.data?.grand_total.replace(/[^\d.]/g, ""),
    };

    await dispatch(checkCouponCodeapi(input_data));

    if (couponCode) {
      setCoupancode(couponCode);
    }
  };

  const handleApplyCouponFromModal = (couponCode) => {
    checkcoupan(couponCode);
  };

  useEffect(() => {
    if (prodId && qty) {
      setSingleCheckout(true);
    }
    if (coupancode) {
      checkcoupan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prodId, qty, sku]);

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <div className="coupan-title flex justify-between items-center">
        <span>{couponCodeLabel}</span>
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => setShowCouponModal(true)}
        >
          <CiDiscount1 className="!text-[#3B82F6] w-[15px] h-[15px] font-bold text-lg" />
          <span className="!text-[#3B82F6] text-base font-medium cursor-pointer">
            {availableCoupons}
          </span>
        </div>
      </div>

      <div
        className={`d-flex footercontactus align-items-stretch w-100 ${
          isRTL ? "flex-row" : ""
        }`}
      >
        <div className="position-relative flex-grow-1 min-w-0">
          <input
            ref={inputFieldRef}
            type="text"
            placeholder={enterCouponPlaceholder}
            value={coupancode}
            onChange={onchange}
            className={`header-inputbox coupan-input w-100 ${
              isRTL
                ? "ps-4 text-start rounded-l-none rounded-r-lg"
                : "pe-4 rounded-r-none rounded-l-lg"
            }`}
            style={{
              minWidth: 0,
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
            isRTL
              ? "rounded-tl-[8px] rounded-bl-[8px]"
              : "rounded-tr-[8px] rounded-br-[8px]"
          }`}
          onClick={checkcoupan}
          style={{
            whiteSpace: "nowrap",
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
        <div
          className={`viewavailable-title cursor-pointer ${
            isRTL ? "flex-row-reverse text-end" : ""
          }`}
        >
          <HiMiniCheckBadge className="text-2xl" />
          {couponAppliedText}
        </div>
      )}

      {/* Coupon Modal */}
      <CouponModal
        show={showCouponModal}
        onHide={() => setShowCouponModal(false)}
        coupons={coupons}
        onApplyCoupon={handleApplyCouponFromModal}
        inputFieldRef={inputFieldRef}
      />
    </div>
  );
};

export default CheckCoupan;
