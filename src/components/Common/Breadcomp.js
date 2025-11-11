"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useContent } from "@/hooks";

const Breadcomp = ({ prodId, qty, sku }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const cart = useContent("checkout.cart");
  const address = useContent("checkout.address");
  const payment = useContent("checkout.payment");

  const singleCheckout = prodId && qty;
  const iscartpage = pathname === "/cart";
  const isaddresspage = pathname === "/deliveryaddress";
  const isPaymentPage = pathname === "/Payment";
  const ispaymentfail = pathname === "/order/payment-failure";

  return (
    <div className="d-flex align-items-center">
      <Link
        href="/cart"
        className={`breadcomp-titles textdecoration-none ${
          iscartpage && "activebreadcomp-titles"
        }`}
      >
        {cart}
      </Link>
      <div>/</div>
      <Link
        href={`${
          singleCheckout
            ? `/deliveryaddress?prodId=${prodId}&qty=${qty}&sku=${sku}`
            : "/deliveryaddress"
        }`}
        className={`breadcomp-titles textdecoration-none ${
          isaddresspage && "activebreadcomp-titles"
        }`}
      >
        {address}
      </Link>
      <div>/</div>
      {ispaymentfail ? (
        <div
          className={`breadcomp-titles textdecoration-none ${
            ispaymentfail && "activebreadcomp-titles"
          }`}
        >
          {payment}
        </div>
      ) : (
        <Link
          href={`${
            singleCheckout
              ? `/Payment?prodId=${prodId}&qty=${qty}&sku=${sku}`
              : "/Payment"
          }`}
          className={`breadcomp-titles textdecoration-none ${
            isPaymentPage && "activebreadcomp-titles"
          }`}
        >
          {payment}
        </Link>
      )}
    </div>
  );
};

export default Breadcomp;
