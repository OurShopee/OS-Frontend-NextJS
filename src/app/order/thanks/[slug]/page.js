"use client";

import notcartimg from "@/images/approval.png";
import { updateCartStatusApi } from "@/api/cart";
import { get_orderSuccessItems, getOrderPaymentStatus } from "@/api/payments";
import { pushToDataLayer } from "@/components/utils/dataUserpush";
import failImg from "@/images/payfail.png";
import { setcartlistdata } from "@/redux/cartslice";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useContent } from "@/hooks/useContent";

const Ordersuccess = () => {
  const searchParams = useSearchParams();
  const yourOrderNumberIs = useContent("orders.yourOrderNumberIs");
  const viewYourOrders = useContent("orders.viewYourOrders");
  const keepExploring = useContent("orders.keepExploring");
  const callUpdate = searchParams.get("callUpdate");
  const params = useParams();
  const orderId = params?.slug;
  const pathname = usePathname();
  const dispatch = useDispatch();

  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const currency = currentcountry?.currency || "AED";

  const [paymentStatus, setPaymentStatus] = useState("Due");
  const [orderBundle, setOrderBundle] = useState(null);

  const toNumber = (v) => {
    const n = Number(v ?? 0);
    return Number.isFinite(n) ? n : 0;
  };
  const preferNumber = (...vals) => {
    for (const v of vals) {
      const n = toNumber(v);
      if (n > 0) return n;
    }
    return 0;
  };

  useEffect(() => {
    setOrderBundle(null);
  }, [orderId]);

  useEffect(() => {
    setPaymentStatus("Due");
    setOrderBundle(null);
  }, [orderId]);

  const startedRef = useRef(null);
  const controllerRef = useRef(null);

  useEffect(() => {
    if (paymentStatus !== "Due") {
      startedRef.current = null;
      controllerRef.current?.abort();
      controllerRef.current = null;
      return;
    }

    if (!startedRef.current) startedRef.current = Date.now();
    const cutoffMs = 10_000;

    let cancelled = false;
    let timeoutId = null;

    const poll = async () => {
      if (cancelled) return;

      const elapsed = Date.now() - startedRef.current;
      if (elapsed >= cutoffMs) {
        setPaymentStatus("Stuck");
        return;
      }

      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;
      const { signal } = controller;

      try {
        const data = await getOrderPaymentStatus(orderId, { signal });
        if (cancelled) return;

        const next = data?.payment_status ?? "Due";
        setPaymentStatus(next);
      } catch (err) {
        if (err?.name !== "AbortError") {
        }
      } finally {
        if (!cancelled) {
          timeoutId = setTimeout(poll, 500);
        }
      }
    };

    poll();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
      controllerRef.current?.abort();
      controllerRef.current = null;
    };
  }, [orderId, paymentStatus]);

  const placedOrderIdRef = useRef(null);
  useEffect(() => {
    if (paymentStatus === "Paid") {
      pushToDataLayer("order_placed", currentcountry?.name, {
        page_name: pathname,
        orderId,
      });
    }
    placedOrderIdRef.current = orderId;
  }, [paymentStatus, currentcountry?.name, pathname, orderId]);

  const fetchData = useCallback(async () => {
    if (!orderId) return;
    try {
      const data = await get_orderSuccessItems(orderId);
      setOrderBundle(data);
    } catch (e) {
      pushToDataLayer("order_fetch_failed", currentcountry?.name, {
        page_name: pathname,
        orderId,
        error: e?.message || "unknown_error",
      });
      console.error("get_orderSuccessItems failed", e);
    }
  }, [orderId, currentcountry?.name, pathname]);

  useEffect(() => {
    if (!orderId) return;

    fetchData();

    if (callUpdate !== "false") {
      dispatch(setcartlistdata({}));
      updateCartStatusApi();
    }
  }, [orderId, callUpdate, dispatch, fetchData]);

  const { items, orderFinalAmount, transactionId } = useMemo(() => {
    const order = orderBundle?.order;
    const orderDetails = orderBundle?.orderDetails || [];

    const derivedItems =
      orderDetails.map((od) => ({
        item_id: od?.product_sku || undefined,
        item_name: od?.product?.title || od?.title || "Unknown Item",
        item_category: od?.product?.categoryid
          ? String(od.product.categoryid)
          : undefined,
        price: toNumber(od?.selling_price) || 0,
        quantity: toNumber(od?.quantity) || 1,
      })) || [];

    const computedValue = preferNumber(
      order?.total_amount,
      toNumber(order?.sub_total) +
        toNumber(order?.tax_amount) +
        toNumber(order?.shipping_charges) +
        toNumber(order?.processing_fee) +
        toNumber(order?.donation_fee) -
        toNumber(order?.discount_amount) -
        toNumber(order?.coupon_amount) -
        toNumber(order?.credit_amount)
    );

    const txId = String(order?.orderid || orderId || "");

    return {
      items: derivedItems,
      orderFinalAmount: computedValue,
      transactionId: txId,
    };
  }, [orderBundle, currency, orderId]);

  const purchaseOrderIdRef = useRef(null);
  useEffect(() => {
    if (!orderBundle) return;
    if (!orderId) return;
    if (purchaseOrderIdRef.current === orderId) return;

    const order = orderBundle.order;
    if (paymentStatus === "Paid") {
      pushToDataLayer("purchase", currentcountry?.name, {
        page_name: pathname,
        currency,
        transaction_id: transactionId,
        value: orderFinalAmount,
        details: {
          tax: toNumber(order?.tax_amount),
          coupon: order?.promo_code || "N/A",
          items,
          orderId: order?.orderid || orderId,
        },
      });
    }

    purchaseOrderIdRef.current = orderId;
  }, [
    orderBundle,
    orderId,
    currency,
    transactionId,
    orderFinalAmount,
    items,
    currentcountry?.name,
    paymentStatus,
    pathname,
  ]);

  return (
    <div className="notlogin">
      {paymentStatus === "Due" && (
        <>
          <img
            className="w-[72px] h-[72px]"
            src="/assets/GIF/loader.gif"
            alt="Loading"
          />
          <h1 className="notlogintitle mt-3">
            Sit tight — your order is under process.
          </h1>
        </>
      )}
      {paymentStatus === "Paid" && (
        <>
          <img src={notcartimg.src} alt="Order Success" />
          <div className="notlogintitle">
            Your order was placed successfully.
          </div>
          <div className="notloginsubtitle">
              {yourOrderNumberIs} <strong>{orderId}</strong>
          </div>
          <div className="d-flex">
            <Link
              href="/my-orders"
              className="success-vieworderbtn notloginbtn textdecoration-none me-3"
            >
              {viewYourOrders}
            </Link>
            <Link href="/" className="notloginbtn textdecoration-none">
              {keepExploring}
            </Link>
          </div>
        </>
      )}
      {paymentStatus === "Fail" && (
        <>
          <img src={failImg.src} alt="Payment Failed" />
          <div className="notlogintitle">Oh no! Your payment failed.</div>
          <div className="notloginsubtitle">
            An error occurred while processing your payment.
          </div>
          <div className="d-flex">
            <Link href="/Payment" className="notloginbtn textdecoration-none">
              Try again
            </Link>
          </div>
        </>
      )}
      {paymentStatus === "Stuck" && (
        <>
          <img src="/assets/orderhold.svg" alt="Order on hold" />
          <div className="notlogintitle">
            Your order's in the queue — we're reviewing it before processing.
          </div>
          <div className="notloginsubtitle">
            Your order number is <strong>{orderId}</strong>
          </div>
          <div className="d-flex">
            <Link
              href="/my-orders"
              className="success-vieworderbtn notloginbtn textdecoration-none me-3"
            >
              View your orders
            </Link>
            <Link href="/" className="notloginbtn textdecoration-none">
              Keep exploring
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Ordersuccess;
