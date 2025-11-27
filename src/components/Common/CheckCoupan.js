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
import { toast } from "react-toastify";
import { pushToDataLayer } from "@/components/utils/dataUserpush";
import { getAssetsUrl } from "../utils/helpers";

const CheckCoupan = ({ prodId, qty, sku, paymentMethods, price, coupons }) => {
  const dispatch = useDispatch();
  const [singleCheckout, setSingleCheckout] = useState(false);
  const cartlistdata = useSelector((state) => state.cartslice.cartlistdata);
  const coupanmsg = useSelector((state) => state.paymentslice.coupanmsg);
  const coupon = useSelector((state) => state.paymentslice.coupon);
  const currentCountry = useSelector(
    (state) => state.globalslice?.currentcountry
  );
  const [coupancode, setCoupancode] = useState("");
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const inputFieldRef = useRef(null);
  const lastPushedCouponRef = useRef(null);

  const skulist = cartlistdata?.data?.result?.map((ele) => ele.sku);
  const currentLanguage = useCurrentLanguage();
  const isRTL = currentLanguage === "ar";

  const couponCodeLabel = useContent("checkout.couponCode");
  const enterCouponPlaceholder = useContent("checkout.enterCouponCode");
  const applyButtonText = useContent("buttons.apply");
  const couponAppliedText = useContent("checkout.couponApplied");
  const availableCoupons = useContent("checkout.availableCoupons");

  const parseAmountToNumber = (rawValue) => {
    if (rawValue === null || rawValue === undefined || rawValue === "") {
      return null;
    }
    const numericValue = Number(String(rawValue).replace(/[^\d.-]/g, ""));
    return Number.isNaN(numericValue) ? null : numericValue;
  };

  const isSingleCheckoutFlow = singleCheckout || (prodId && qty);
  const cartTotalValue = parseAmountToNumber(
    isSingleCheckoutFlow
      ? paymentMethods?.sub_total
      : cartlistdata?.data?.grand_total
  );

  const onchange = (e) => {
    setCoupancode(e.target.value);
    if (e.target.value === "") {
      dispatch(clearCouponMsg());
      setShowSuccessAnimation(false);
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
    try {
      const responseAction = await dispatch(checkCouponCodeapi(input_data));
      const resPayload = responseAction?.payload;
      const status = resPayload?.status?.toLowerCase();

      const message =
        resPayload?.msg || resPayload?.data?.msg || "Invalid Coupon";
      if (couponCode) {
        setCoupancode(couponCode);
      }

      if (status === "failure") {
        toast.error(message);
        setShowSuccessAnimation(false);
        return { status: "faliure", message };
      }

      // Show success animation when coupon is successfully applied
      setShowSuccessAnimation(true);

      // Push to data layer after successful coupon application
      // We'll use a useEffect to track this after Redux state updates
      return { status: "success", message };
    } catch (error) {
      const fallbackMessage = "Unable to verify coupon. Please try again.";
      toast.error(fallbackMessage);
      return { status: "faliure", message: fallbackMessage };
    }
  };

  const handleApplyCouponFromModal = (couponCode) => {
    return checkcoupan(couponCode);
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

  // Hide success animation after 2.5 seconds
  useEffect(() => {
    if (showSuccessAnimation) {
      const timer = setTimeout(() => {
        setShowSuccessAnimation(false);
      }, 3800);
      return () => clearTimeout(timer);
    }
  }, [showSuccessAnimation]);

  // Push to data layer when coupon is successfully applied
  useEffect(() => {
    if (coupon && coupon.discount > 0 && currentCountry?.name) {
      const couponCode =
        coupon.code || coupon.coupon || coupon.promo_code || coupancode;
      const discountAmount =
        coupon.discount || coupon.discount_amount || coupon.discount_value || 0;

      // Prevent duplicate pushes for the same coupon
      if (lastPushedCouponRef.current !== couponCode) {
        pushToDataLayer(
          "coupon_applied",
          currentCountry.name,
          {
            details: {
              coupon_code: couponCode,
              discount_amount: discountAmount,
              currency: currentCountry.currency || "AED",
              source: isSingleCheckoutFlow ? "pdp" : "cart",
            },
          },
          false
        );
        lastPushedCouponRef.current = couponCode;
      }
    } else if (!coupon || !coupon.discount) {
      // Reset when coupon is removed
      lastPushedCouponRef.current = null;
    }
  }, [coupon, currentCountry, coupancode, isSingleCheckoutFlow]);

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <div className="coupan-title flex justify-between items-center">
        <span>{couponCodeLabel}</span>
        <div
          className="flex text-lg font-extrabold items-center gap-[2px] cursor-pointer"
          onClick={() => setShowCouponModal(true)}
        >
          <CiDiscount1
            className="!text-[#3B82F6] !w-[15px] !h-[15px] !text-lg"
            style={{ strokeWidth: 1 }}
          />
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
            <div>
              <span
                onClick={() => {
                  if (!showSuccessAnimation) {
                    dispatch(removeCoupon());
                    setCoupancode("");
                    setShowSuccessAnimation(false);
                  }
                }}
                className="flex justify-center items-center"
                style={{
                  position: "absolute",
                  [isRTL ? "left" : "right"]: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: showSuccessAnimation ? "default" : "pointer",
                  fontSize: "16px",
                  color: "#999",
                  zIndex: 1,
                }}
              >
                {showSuccessAnimation ? (
                  <img
                    ref={inputFieldRef}
                    src={getAssetsUrl("vector_icons/successfull.gif")}
                    alt="Success"
                    style={{
                      width: "24px",
                      height: "24px",
                    }}
                    loading="lazy"
                  />
                ) : (
                  <span className="flex justify-center items-center mr-1">
                    {" "}
                    ✕
                  </span>
                )}
              </span>
            </div>
          )}
        </div>

        <button
          className={`min-w-[90px] max-w-[90px] text-[#191B1C] flex justify-center items-center bg-secondary border-none flex-shrink-0 ${
            isRTL
              ? "rounded-tl-[8px] rounded-bl-[8px]"
              : "rounded-tr-[8px] rounded-br-[8px]"
          }`}
          onClick={() => checkcoupan()}
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
          <HiMiniCheckBadge className="text-xl" />
          <span className="flex items-center gap-[3px]">
            <span className="text-black font-medium text-sm">
              {couponAppliedText}
            </span>
            {currentCountry?.currency?.toUpperCase() === "AED" ? (
              <img
                src={getAssetsUrl("coupons/dirham.svg")}
                alt="AED"
                className={`w-[14px] h-[14px] inline-block mix-blend-multiply ${
                  isRTL ? "" : ""
                }`}
                style={{ color: "black" }}
                loading="lazy"
              />
            ) : (
              <span className={`currencycode ${isRTL ? "" : ""}`}>
                {currentCountry?.currency || "AED"}
              </span>
            )}
            <span className="text-green-[#33B056] font-semibold text-sm">
              {coupon?.discount}
            </span>
          </span>
        </div>
      )}

      {/* Coupon Modal */}
      <CouponModal
        show={showCouponModal}
        onHide={() => setShowCouponModal(false)}
        coupons={coupons}
        onApplyCoupon={handleApplyCouponFromModal}
        inputFieldRef={inputFieldRef}
        cartTotal={cartTotalValue}
      />
    </div>
  );
};

export default CheckCoupan;
