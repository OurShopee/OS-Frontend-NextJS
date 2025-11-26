import { useContent } from "@/hooks";
import { availableCoupons, getFeedPlaceOrder } from "@/api/payments";
import React, { useEffect, useState } from "react";
import { FaLock } from "react-icons/fa6";
import CheckCoupan from "../CheckCoupan";
import Donation from "../Donation";
import { useSelector, useDispatch } from "react-redux";
import { setselecteddefaultpaymentmethod } from "@/redux/paymentslice";

const PayNowFinal = ({ onPayNow = () => {}, formData = {}, product = {}, qty = 1, sku = "" }) => {
  console.log(product);
  const {
    form_name = "",
    contact_no = "",
    location = "",
    area = "",
    delivery_address = "",
  } = formData;

  const addressLines = [
    [location, area].filter(Boolean).join(", "),
    delivery_address,
  ].filter(Boolean);
  const [availableCoupon, setAvailableCoupon] = useState([]);
  const [feddData, setFeddData] = useState(null);
  const currentcountry = useSelector((state) => state.globalslice.currentcountry);
  const [paymentOptions, setPaymentOptions] = useState([]);
  const dispatch = useDispatch();
  const selecteddefaultpaymentmethod = useSelector(
    (state) => state.paymentslice.selecteddefaultpaymentmethod
  );
  const fetchAvailableCoupons = async () => {
    const res = await availableCoupons();
    if (res.status === "success") {
      setAvailableCoupon(res.data.availableCoupons);
    }
  };
  const getFeddData = async () => {
    const input_data = {
      product_id: product?.id,
      quantity: qty,
      product_price: product?.display_price,
    };
    const res = await getFeedPlaceOrder(input_data);
    if (res.status === "success") {
      setFeddData(res.data);
      const paymentMethods = res?.data?.payment_method || [];
      setPaymentOptions(paymentMethods);
      console.log("test",feddData);
      
      // Set default selected payment method if available
      const defaultMethod = paymentMethods.find((method) => method.selected);
      if (defaultMethod) {
        dispatch(setselecteddefaultpaymentmethod(defaultMethod.id));
      } else if (paymentMethods.length > 0) {
        dispatch(setselecteddefaultpaymentmethod(paymentMethods[0].id));
      }
    }
  };

  const handlePaymentChange = (id, processingFee) => {
    dispatch(setselecteddefaultpaymentmethod(id));
  };

  useEffect(() => {
    fetchAvailableCoupons();
    getFeddData();
  }, []);
  return (
    <div className="bg-white">
      <div className="flex flex-col lg:flex-row gap-6 p-6 lg:p-10">
        {/* Left column */}
        <div className="flex-1 space-y-6">
          <div className="rounded-3xl border border-[#F0F0F0] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-semibold text-[#212121]">Order Summary</h2>
              <button className="text-sm font-semibold text-[#2F80ED] border border-[#DDEBFF] px-4 py-1.5 rounded-2xl">
                Edit Address
              </button>
            </div>
            <div className="space-y-1 text-[#4F4F4F]">
              <p className="font-medium">Delivery Address</p>
              {form_name && <p className="font-semibold text-[#1E1E1E]">{form_name}</p>}
              {addressLines.length ? (
                addressLines.map((line, idx) => <p key={idx}>{line}</p>)
              ) : (
                <p className="text-[#9E9E9E]">No address provided.</p>
              )}
              {contact_no && <p className="font-semibold">{contact_no}</p>}
            </div>
          </div>

          <div className="rounded-3xl border border-[#F0F0F0] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] space-y-6">
            <h3 className="text-xl font-semibold text-[#212121]">Payment Options</h3>
            <div className="space-y-3">
              {paymentOptions?.length > 0 ? (
                paymentOptions.map((paymentMethod) => {
                  const isSelected = selecteddefaultpaymentmethod === paymentMethod.id;
                  const processingFee = paymentMethod.processing_fee;
                  const isFree = processingFee === 0 || processingFee === "0" || processingFee === "FREE" || !processingFee;
                  
                  return (
                    <div
                      key={paymentMethod.id}
                      className={`rounded-xl border-2 p-4 cursor-pointer transition-all ${
                        isSelected
                          ? "border-[#2F80ED] bg-[#F0F7FF]"
                          : "border-[#E7E8E9] bg-white hover:border-[#D0D5D8]"
                      }`}
                      onClick={() =>
                        handlePaymentChange(
                          paymentMethod.id,
                          paymentMethod.processing_fee
                        )
                      }
                    >
                      <label className="flex items-start cursor-pointer">
                        <input
                          type="radio"
                          name="payment"
                          value={paymentMethod.id}
                          checked={isSelected}
                          onChange={() =>
                            handlePaymentChange(
                              paymentMethod.id,
                              paymentMethod.processing_fee
                            )
                          }
                          className="mt-1 me-3 payment-radiobtn"
                        />
                        <div className="flex-1 flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="paymentmethod-label mb-1">
                              <span className="font-semibold text-[#191B1C]">
                                {paymentMethod.label}
                              </span>
                            </div>
                            {paymentMethod.sub_label && (
                              <div className="paymentmethod-sublabel mb-1">
                                {paymentMethod.sub_label}
                              </div>
                            )}
                            <div
                              className={`text-sm font-medium ${
                                isFree
                                  ? "text-[#27AE60]"
                                  : "text-[#6F787C]"
                              }`}
                            >
                            </div>
                          </div>
                          {paymentMethod.image && (
                            <div className="flex-shrink-0">
                              <img
                                src={paymentMethod.image}
                                alt={paymentMethod.label || "Payment method"}
                                className="h-8 w-auto object-contain"
                                loading="lazy"
                              />
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  );
                })
              ) : (
                <p className="text-[#9E9E9E] text-sm">No payment methods available</p>
              )}
            </div>

            <div className="rounded-2xl border border-[#EAEAEA] p-4 space-y-4">
            {currentcountry.isDonationRequired && (
                <Donation donation={paymentOptions?.donation} />
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="w-full lg:w-[360px]">
          <div className="rounded-3xl border border-[#F0F0F0] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] space-y-6">
            <h3 className="text-xl font-semibold text-[#212121]">Price Details</h3>

            <div className="space-y-3 text-[#4F4F4F] text-sm">
              {[
                { label: "Subtotal", value: "n/a" },
                { label: "Processing Fee", value: "n/a" },
                { label: "Donation", value: "n/a" },
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
              
            </div>

            <div className="space-y-3">
              <CheckCoupan 
              prodId={product?.id}
              qty={qty}
              sku={sku}
              paymentMethods={product?.display_price}
              coupons={availableCoupon}
              price={product?.display_price}
              />
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