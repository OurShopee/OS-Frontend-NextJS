"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { PiSealWarningFill } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { Payment } from "@/actions";
import { MediaQueries } from "@/components/utils";
import { toggleMobileAddressModal } from "@/redux/addresslice";
import { setformmodal, setformstatus } from "@/redux/formslice";
import { removeCoupon } from "@/redux/paymentslice";
// import { checkoutSingleProd } from "@/services/Apis";
import { pushToDataLayer } from "../utils/dataUserpush";
import Modal from "./Modal";
import { checkoutSingleProd } from "@/api/payments";

const Paymentdetails = ({ prodId, qty, sku, address }) => {
  const [paymentData, setPaymentData] = useState();
  const [singleCheckout, setSingleCheckout] = useState(false);
  const [cartIds, setCartIds] = useState("");
  const { isMobile } = MediaQueries();
  const router = useRouter();
  const pathname = usePathname();
  const { postpostPlaceOrderapi, SingleCheckout } = Payment();
  const dispatch = useDispatch();
  const paymentmethodsdata = useSelector(
    (state) => state.paymentslice.paymentmethodsdata
  );
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const selecteddeafultoption = useSelector(
    (state) => state.paymentslice.selecteddeafultoption
  );
  const addresslistdata = useSelector(
    (state) => state.addresslice.addresslistdata
  );
  const donationfee = useSelector((state) => state.paymentslice.donationfee);
  const showdonation = useSelector((state) => state.paymentslice.showdonation);
  const coupon = useSelector((state) => state.paymentslice.coupon);
  const iscartpage = pathname === "/cart";
  const isaddresspage = pathname === "/deliveryaddress";
  const isPaymentPage = pathname === "/Payment";
  const [isLoading, setIsLoading] = useState(false);
  const cartlistdata = useSelector((state) => state.cartslice.cartlistdata);

  useEffect(() => {
    const fetchCheckoutData = async () => {
      if (prodId && qty) {
        try {
          const res = await checkoutSingleProd({
            cartIds: `${prodId}|${qty}|${7656}`,
          });

          if (res?.status === 200) {
            const total = res?.data?.data?.final_total;
            const final_total = total.split(" ")[1];

            setPaymentData(res.data.data);
            setSingleCheckout(true);
            setCartIds(`${prodId}|${qty}|${final_total},`);
          }
        } catch (error) {
          console.error("Single checkout fetch failed", error);
        }
      } else {
        setPaymentData(paymentmethodsdata);
        if (cartlistdata?.data?.result?.length) {
          const ids = cartlistdata.data.result
            .map(
              (each) =>
                `${each.product_id}|${each.quantity}|${each.single_price}`
            )
            .join(",");
          setCartIds(ids + ",");
        }
      }
    };

    fetchCheckoutData();
  }, [prodId, qty, dispatch, cartlistdata, paymentmethodsdata]);

  useEffect(() => {
    dispatch(removeCoupon());
  }, [pathname, dispatch]);

  const placeorderclick = async () => {
    if (!address) {
      toast.error("Please select a delivery address!");
      return;
    }
    if (!selecteddeafultoption[0]?.payment_method) {
      toast.error("Please choose a payment method!");
      return;
    }
    pushToDataLayer("begin_checkout", {
      currency: currentcountry.currency,
      value: parseInt(paymentData.final_total.split(" ")[1]),
      items: cartlistdata?.data?.result?.map((each) => {
        return {
          item_id: each.product_id,
          item_name: each.name,
          item_category: each.subcategory_name,
          price: each.single_price,
          quantity: each.quantity,
        };
      }),
    });
    if (cartIds == "") {
      router.push("/cart");
    } else {
      setIsLoading(true);

      const input_data = {
        coupon_code: coupon?.discount ? coupon?.coupon : "",
        ...(currentcountry.isDonationRequired && {
          donation_fee: donationfee !== "" ? donationfee : "0",
        }),
        notes: "Write user note here...",
        payment_method: selecteddeafultoption[0].payment_method,
        processing_fee: selecteddeafultoption[0].processing_fee,
        tabbyType: 1,
        ip_address: Cookies.get("cart_ip_address"),
        cartIds: cartIds,
        discount: coupon?.discount ? coupon.discount : "",
        addressId: address?.idaddress,
      };
      if (prodId && qty) {
        await SingleCheckout(input_data);
      } else {
        await postpostPlaceOrderapi(input_data);
      }
      setIsLoading(false);

      pushToDataLayer("click_order", currentcountry.name, {
        payment_method: selecteddeafultoption[0]?.payment_method,
        amount: paymentData.final_total,
      });
    }
  };
  const addrespageclick = () => {
    if (cartIds == "") {
      router.push("/cart");
    } else if (addresslistdata?.data?.length > 0) {
      if (singleCheckout) {
        router.push(`/Payment?prodId=${prodId}&qty=${qty}&sku=${sku}`);
      } else {
        router.push("/Payment");
      }
    } else {
      if (isMobile) {
        dispatch(toggleMobileAddressModal(true));
      } else {
        dispatch(setformstatus(3));
        dispatch(setformmodal(true));
      }
    }
  };

  return (
    <div>
      <div>
        <div className="payment-details-title">Price Details</div>
        {
          <div className="payment-type">
            <div className="payment-type-title">Subtotal </div>
            <div className="payment-type-cost">{paymentData?.sub_total}</div>
          </div>
        }
        {coupon && coupon.discount > 0 && (
          <div className="payment-type">
            <div className="payment-type-title">Coupon Discount</div>
            <div className="payment-type-cost" style={{ color: "green" }}>
              -{coupon.discount}
            </div>
          </div>
        )}
        {
          <div className="payment-type">
            <div className="payment-type-title">Processing fee </div>
            {selecteddeafultoption && selecteddeafultoption.length > 0 ? (
              <div className="payment-type-cost">
                {selecteddeafultoption?.[0]?.processing_fee}
              </div>
            ) : (
              <div className="payment-type-cost">
                {paymentData?.processing_fee}
              </div>
            )}
          </div>
        }
        {currentcountry.isDonationRequired && showdonation && (
          <div className="payment-type">
            <div className="payment-type-title">Donation fee </div>
            <div className="payment-type-cost">{donationfee}</div>
          </div>
        )}
        {paymentData?.msg && (
          <div
            style={{
              background: "linear-gradient(90deg, #fff2e1 0%, #f8f2fa 100%)",
              padding: "12px 20px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "start",
              margin: "8px 0",
            }}
          >
            <span
              style={{
                color: "#5232c2",
                fontWeight: 700,
                fontSize: "20px",
                marginRight: 8,
              }}
            >
              <PiSealWarningFill />
            </span>
            <span style={{ color: "#444", fontWeight: 500, fontSize: "1rem" }}>
              {paymentData?.msg}
            </span>
          </div>
        )}
        {
          <div className="payment-type-shipping">
            <div className="payment-type-shippingtitle">Shipping </div>
            <div className="payment-type-shippingtitle">
              {paymentData?.shipping_charge}
            </div>
          </div>
        }
        {!isMobile && <div className="form-border-bottom"></div>}

        {!isMobile && (
          <div>
            {
              <div className="payment-type pb-2">
                <div className="payment-type-total">
                  Total<span className="totalvat">(Inclusive of VAT)</span>
                </div>

                <div className="payment-type-totalcost">
                  <span className="pe-2">{currentcountry.currency} </span>
                  {(
                    Number(
                      paymentData?.final_total?.replace(/[^\d.]/g, "") || 0
                    ) +
                    (showdonation && currentcountry.isDonationRequired
                      ? Number(donationfee || 0)
                      : 0) +
                    Number(selecteddeafultoption?.[0]?.processing_fee || 0) -
                    Number(coupon?.discount || 0)
                  ).toFixed(2)}
                </div>
              </div>
            }
            {iscartpage && (
              <Link
                href={paymentData?.showError ? "#" : "/deliveryaddress"}
                className={`text-decoration-none ${
                  paymentData?.showError ? "disabled-link" : ""
                }`}
              >
                <div
                  className={`payment-cost btn ${
                    paymentData?.showError
                      ? "btn-secondary opacity-50"
                      : "btn-primary"
                  }`}
                  style={{
                    cursor: paymentData?.showError ? "not-allowed" : "pointer",
                  }}
                  onClick={() => addrespageclick()}
                >
                  Continue
                </div>
              </Link>
            )}
            {isaddresspage && (
              <div
                className={`payment-cost btn ${
                  paymentData?.showError
                    ? "btn-secondary opacity-50"
                    : "btn-primary"
                }`}
                style={{
                  cursor: paymentData?.showError ? "not-allowed" : "pointer",
                }}
                onClick={() => !paymentData?.showError && addrespageclick()}
                role="button"
                tabIndex={0}
              >
                Continue
              </div>
            )}
            {isPaymentPage && (
              <button
                disabled={isLoading ? true : false}
                className={`payment-cost btn w-100 ${
                  paymentData?.showError
                    ? "btn-secondary opacity-50"
                    : "btn-primary"
                }`}
                style={{
                  cursor: paymentData?.showError ? "not-allowed" : "pointer",
                }}
                onClick={() => !paymentData?.showError && placeorderclick()}
                tabIndex={0}
              >
                Place Order
                {isLoading && (
                  <ClipLoader className="ms-1" size={16} color={"#fff"} />
                )}
              </button>
            )}
          </div>
        )}
      </div>
      {isMobile && (
        <div className="mobile_version_cart_bottom">
          <div className="mobile-payment-total">
            {
              <div className="payment-type pt-3 pb-2">
                <div className="payment-type-total">
                  Total<span className="totalvat">(Inclusive of VAT)</span>
                </div>
                <div className="payment-type-totalcost">
                  {" "}
                  <span className="pe-2">{currentcountry.currency} </span>
                  {(
                    Number(
                      paymentData?.final_total?.replace(/[^\d.]/g, "") || 0
                    ) +
                    (showdonation ? Number(donationfee || 0) : 0) +
                    Number(selecteddeafultoption?.[0]?.processing_fee || 0) -
                    Number(coupon?.discount || 0)
                  ).toFixed(2)}
                </div>
              </div>
            }
            {iscartpage && (
              <Link
                href={paymentData?.showError ? "#" : "/deliveryaddress"}
                className={`text-decoration-none ${
                  paymentData?.showError ? "disabled-link" : ""
                }`}
              >
                <div
                  className={`payment-cost btn ${
                    paymentData?.showError
                      ? "btn-secondary opacity-50"
                      : "btn-primary"
                  }`}
                  style={{
                    cursor: paymentData?.showError ? "not-allowed" : "pointer",
                  }}
                  onClick={() => addrespageclick()}
                >
                  Continue
                </div>
              </Link>
            )}
            {isaddresspage && (
              <div
                className={`payment-cost btn ${
                  paymentData?.showError
                    ? "btn-secondary opacity-50"
                    : "btn-primary"
                }`}
                style={{
                  cursor: paymentData?.showError ? "not-allowed" : "pointer",
                }}
                onClick={() => !paymentData?.showError && addrespageclick()}
                role="button"
                tabIndex={0}
              >
                Continue
              </div>
            )}
            {isPaymentPage && (
              <button
                disabled={isLoading ? true : false}
                className={`payment-cost btn w-100 ${
                  paymentData?.showError
                    ? "btn-secondary opacity-50"
                    : "btn-primary"
                }`}
                style={{
                  cursor: paymentData?.showError ? "not-allowed" : "pointer",
                }}
                onClick={() => !paymentData?.showError && placeorderclick()}
                tabIndex={0}
              >
                Place Order
                {isLoading && (
                  <ClipLoader className="ms-1" size={16} color={"#fff"} />
                )}
              </button>
            )}
          </div>
        </div>
      )}
      <Modal />
    </div>
  );
};
export default Paymentdetails;
