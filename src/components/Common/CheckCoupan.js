"use client";

import React, { useEffect, useState } from "react";
import {
  checkCouponCodeapi,
  clearCouponMsg,
  removeCoupon,
} from "@/redux/paymentslice";
import { useDispatch, useSelector } from "react-redux";
import { HiMiniCheckBadge } from "react-icons/hi2";

const CheckCoupan = ({ prodId, qty, sku, paymentMethods, price }) => {
  const dispatch = useDispatch();
  const [singleCheckout, setSingleCheckout] = useState(false);
  const cartlistdata = useSelector((state) => state.cartslice.cartlistdata);
  const coupanmsg = useSelector((state) => state.paymentslice.coupanmsg);
  const coupon = useSelector((state) => state.paymentslice.coupon);
  const [coupancode, setCoupancode] = useState("");
  const skulist = cartlistdata?.data?.result?.map((ele) => ele.sku);

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
    <div>
      <div className="coupan-title">Coupon code</div>
      <div className="d-flex footercontactus align-items-stretch w-100">
        <div className="position-relative flex-grow-1 min-w-0">
          <input
            type="text"
            placeholder="Enter coupon Code"
            value={coupancode}
            onChange={onchange}
            className="header-inputbox coupan-input pe-4 w-100"
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
                right: "10px",
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
          className="min-w-[90px] max-w-[90px] text-[#191B1C] flex justify-center items-center rounded-tr-[8px] rounded-br-[8px] bg-secondary border-none flex-shrink-0"
          onClick={checkcoupan}
          style={{
            whiteSpace: "nowrap", // Prevents text wrapping
          }}
        >
          Apply
        </button>
      </div>

      {coupanmsg && (
        <div
          className="text-danger mt-1"
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
        <div className="viewavailable-title cursor-pointer">
          <HiMiniCheckBadge className="text-2xl" />
          Coupon applied
        </div>
      )}
    </div>
  );
};

export default CheckCoupan;
