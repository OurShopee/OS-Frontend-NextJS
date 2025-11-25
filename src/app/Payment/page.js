"use client";
import { availableCoupons, checkoutSingleProd } from "@/api/payments";
import Breadcomp from "@/components/Common/Breadcomp";
import CheckCoupan from "@/components/Common/CheckCoupan";
import Donation from "@/components/Common/Donation";
import Paymentdetails from "@/components/Common/Paymentdetails";
import withAuth from "@/components/Common/withAuth";
import { MediaQueries } from "@/components/utils";
import { pushToDataLayer } from "@/components/utils/dataUserpush";
import { getAssetsUrl } from "@/components/utils/helpers";
import { useContent, useCurrentLanguage } from "@/hooks";
import {
  clearCouponMsg,
  GetPlaceOrderapi,
  setselecteddeafultoption,
  setselecteddefaultpaymentmethod,
} from "@/redux/paymentslice";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { AiOutlineEdit } from "react-icons/ai";
import { BsWallet2 } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

const Payment = () => {
  const searchParams = useSearchParams();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [walletSelected, setWalletSelected] = useState(false);
  const [walletValue, setWalletValue] = useState(130);
  const [usedWalletValue, setUsedWalletValue] = useState(0);
  const [walletUpdatedValue, setWalletUpdatedValue] = useState(usedWalletValue);
  const [walletUpdateModalOpen, setWalletUpdateModalOpen] = useState(false);
  const [availableCoupon, setAvailableCoupon] = useState([]);
  const prodId = searchParams.get("prodId");
  const qty = searchParams.get("qty");
  const sku = searchParams.get("sku");
  const price = searchParams.get("price");
  const addresslistdata = useSelector(
    (state) => state.addresslice.addresslistdata
  );
  const currentLanguage = useCurrentLanguage();
  const isRTL = currentLanguage === "ar";
  const logindata = useSelector((state) => state.formslice.logindata);
  const dispatch = useDispatch();
  const router = useRouter();
  const paymentmethodsdata = useSelector(
    (state) => state.paymentslice.paymentmethodsdata
  );
  const selecteddeafultoption = useSelector(
    (state) => state.paymentslice.selecteddeafultoption
  );
  const selecteddefaultpaymentmethod = useSelector(
    (state) => state.paymentslice.selecteddefaultpaymentmethod
  );
  const { isMobile } = MediaQueries();
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const defaultAddress = addresslistdata?.data?.find(
    (add) => add.default_address === 1
  );

  // Language content
  const selectPaymentMethod = useContent("payment.selectPaymentMethod");
  const shopeeWallet = useContent("payment.shopeeWallet");
  const orderSummary = useContent("checkout.orderSummary");
  const deliveryAddress = useContent("checkout.deliveryAddress");
  const changeAddress = useContent("checkout.changeAddress");
  const selectAddress = useContent("checkout.selectAddress");
  const pleaseSelectDeliveryAddress = useContent(
    "checkout.pleaseSelectDeliveryAddress"
  );

  const fetchAvailableCoupons = async () => {
    const res = await availableCoupons();
    if (res.status === "success") {
      setAvailableCoupon(res.data.availableCoupons);
    }
  };
  useEffect(() => {
    if (Cookies.get("jwt_token") !== undefined) {
      dispatch(GetPlaceOrderapi(logindata.user_id));
    }
    fetchAvailableCoupons();
  }, [dispatch, logindata.user_id]);

  useEffect(() => {
    const fetchCheckoutData = async () => {
      if (prodId && qty) {
        try {
          const res = await checkoutSingleProd({
            cartIds: `${prodId}|${qty}|${7656}`,
          });
          if (res.status === 200) {
            setPaymentMethods(res.data.data);
          }
        } catch (error) {
          console.error("Single checkout fetch failed", error);
        }
      } else {
        setPaymentMethods(paymentmethodsdata);
      }
    };

    fetchCheckoutData();
  }, [prodId, qty, paymentmethodsdata]);

  useEffect(() => {
    pushToDataLayer("view_payment_page", currentcountry.name, {
      payment_method: selecteddeafultoption?.[0]?.payment_method,
      amount: paymentMethods?.final_total,
    });
  }, []);

  useEffect(() => {
    dispatch(
      setselecteddeafultoption(
        paymentMethods?.payment_method?.filter(
          (ele) => ele.id == selecteddefaultpaymentmethod
        )
      )
    );
  }, [paymentMethods, selecteddefaultpaymentmethod, dispatch]);

  useEffect(() => {
    dispatch(clearCouponMsg());
  }, [dispatch]);

  const handlePaymentChange = (id, processing_fee) => {
    dispatch(setselecteddefaultpaymentmethod(id));
    pushToDataLayer("clicked_paymentmethod", currentcountry.name, {
      payment_method: selecteddeafultoption[0]?.payment_method,
    });
  };

  const handleChangeAddress = () => {
    if (prodId && qty) {
      router.push(`/deliveryaddress?prodId=${prodId}&qty=${qty}&sku=${sku}`);
    } else {
      router.push("/deliveryaddress");
    }
  };

  const handleWalletChange = () => {
    setWalletSelected(!walletSelected);
    if (!walletSelected) {
      setUsedWalletValue(walletValue);
    } else {
      setUsedWalletValue(0);
    }
  };

  useEffect(() => {
    setWalletUpdatedValue(usedWalletValue);
  }, [usedWalletValue]);

  const handleWalletAmountChange = (value) => {
    if (value === "") {
      setWalletUpdatedValue(0);
      return;
    }
    const numericValue = Math.max(0, Math.min(Number(value), walletValue));
    setWalletUpdatedValue(numericValue);
  };

  const handleSubmitWalletAmount = () => {
    setUsedWalletValue(walletUpdatedValue);
    setWalletUpdateModalOpen(false);
  };

  return (
    <div className="mobile-marginbottom">
      <Container fluid className="homepagecontainer">
        <div className={`${isMobile ? "pt-1 pb-1" : "pt-3 pb-3"}`}>
          <Breadcomp prodId={prodId} qty={qty} sku={sku} />
        </div>

        <div className="Cart-titile">{selectPaymentMethod}</div>
        <Row>
          <Col lg={8}>
            <div className="Cartitem-maindiv">
              {paymentMethods?.payment_method?.map((ele, index) => (
                <div>
                  <div
                    key={ele.id}
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={ele.id}
                      checked={selecteddefaultpaymentmethod === ele.id}
                      onChange={() =>
                        handlePaymentChange(ele.id, ele.processing_fee)
                      }
                      className="me-2 payment-radiobtn"
                    />
                    <div
                      onClick={() =>
                        handlePaymentChange(ele.id, ele.processing_fee)
                      }
                    >
                      <div className="paymentmethod-label flex">
                        {" "}
                        {ele.image && (
                          <img
                            src={ele.image}
                            alt={ele.label}
                            className="paymentmethod-image"
                            loading="lazy"
                          />
                        )}
                        {ele.label}
                      </div>
                      <div className="paymentmethod-sublabel">
                        {ele.sub_label}
                      </div>
                    </div>
                  </div>
                  {index !== paymentMethods.payment_method.length - 1 && (
                    <div className="payment-border-bottom"></div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4">
              <div className="Cart-titile">{shopeeWallet}</div>
              <div
                className={`Cartitem-maindiv ${
                  walletSelected && "walletpaybg"
                }`}
              >
                <div>
                  <div className="flex items-center cursor-pointer select-none w-full">
                    <input
                      type="radio"
                      name="walletpayment"
                      checked={walletSelected}
                      onClick={handleWalletChange}
                      className="me-2 payment-radiobtn"
                    />
                    <div className="flex flex-col sm:flex-row sm:justify-between items-start w-full">
                      <div
                        onClick={handleWalletChange}
                        className="font-semibold select-none text-lg sm:text-xl text-[#191B1C] flex items-center justify-center gap-2"
                      >
                        Pay with Shopee Wallet{" "}
                        {/* <img
                          src={"/assets/payment/shopee_wallet.png"}
                          alt={"ele.label"}
                          className="paymentmethod-image"
                          loading="lazy"
                        /> */}
                        <BsWallet2 />
                      </div>
                      <div className="font-normal text-sm sm:text-lg text-[#43494B] flex items-center justify-center gap-2">
                        Total {usedWalletValue > 0 ? "Used" : "Available" } Balance :
                        <div className="font-semibold text-[#191B1C] text-xl flex items-center">
                          {currentcountry?.currency == "AED" ? (
                            <img
                              src={getAssetsUrl("feed/aed-icon.svg")}
                              alt="AED"
                              className={`w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] inline-block mix-blend-multiply ${
                                isRTL ? "ml-0.5" : "mr-0.5"
                              }`}
                              style={{ color: "black" }}
                              loading="lazy"
                            />
                          ) : (
                            <span
                              className={`text-[#191B1C] text-lg sm:text-xl font-semibold ${
                                isRTL ? "ml-0.5" : "mr-0.5"
                              }`}
                            >
                              {currentcountry?.currency}
                            </span>
                          )}
                          {usedWalletValue > 0 ? usedWalletValue : walletValue}
                          {walletSelected && (
                            <AiOutlineEdit
                              className="ml-1"
                              fill="#3B82F6"
                              onClick={() => setWalletUpdateModalOpen(true)}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col lg={4}>
            <div
              className={!isMobile ? "pricedetails" : "p-2 mobilepricedetails"}
            >
              <div className="ordersummary-title">{orderSummary}</div>
              <div className="payment-border-bottom"></div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div className="coupan-title !pb-0">{deliveryAddress}</div>
                  <button
                    onClick={() => handleChangeAddress()}
                    className="flex items-center gap-1 px-3 py-1.5 border-blue rounded-lg !text-[#3B82F6] font-medium text-sm bg-white"
                  >
                    <img
                      src={getAssetsUrl("vector_icons/Edit.svg")}
                      alt="edit"
                      loading="lazy"
                    />
                    <div className="">
                      {defaultAddress ? changeAddress : selectAddress}
                    </div>
                  </button>
                </div>
                {!defaultAddress && (
                  <p
                    className={`text-red-500 mb-0 ${
                      isMobile && "text-sm font-normal"
                    }`}
                  >
                    {pleaseSelectDeliveryAddress}
                  </p>
                )}
                <p
                  className={`text-[#43494B] mb-0 ${
                    isMobile && "text-sm font-normal"
                  }`}
                >
                  {defaultAddress?.address}
                </p>
                <p
                  className={`text-[#43494B] mb-0 ${
                    isMobile && "text-sm font-normal"
                  }`}
                >
                  {defaultAddress?.mobile}
                </p>
              </div>
              <div className="payment-border-bottom border-b-[1px] border-gray-200"></div>
              <CheckCoupan
                prodId={prodId}
                qty={qty}
                sku={sku}
                paymentMethods={paymentMethods}
                coupons={availableCoupon}
                price={price}
              />
              <div className="payment-border-bottom"></div>
              {currentcountry.isDonationRequired && (
                <Donation donation={paymentMethods?.donation} />
              )}
              {<div className="payment-border-bottom"></div>}
              <Paymentdetails
                prodId={prodId}
                qty={qty}
                address={defaultAddress}
                sku={sku}
              />
            </div>
          </Col>
        </Row>
      </Container>

      {walletUpdateModalOpen && (
        <div className="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-30 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-[24px] w-[90%] sm:w-full max-w-[410px] p-8 shadow-[0_4px_12px_0_rgba(0,0,0,0.06)]">
            {/* Close button */}
            <button
              className="absolute top-5 right-6 text-[#191B1C] hover:text-gray-600 transition"
              onClick={() => setWalletUpdateModalOpen(false)}
            >
              <IoCloseSharp className="w-7 h-7" />
            </button>
            {/* Heading and subtext */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-[#191B1C] mb-1">
                Edit Amount
              </h3>
              <p className="text-[#43494B] text-lg font-normal">
                Adjust the shopee wallet amount to apply
                <br />
                for your payment.
              </p>
            </div>
            {/* Input and Save button */}
            <div className="flex gap-3">
              <div
                className={`flex items-center px-6 py-1 bg-white rounded-[12px] border-[2px] text-lg opacity-100 text-[#43494B] font-semibold transition-all duration-300 w-full
              ${
                !(walletUpdatedValue == 0 || walletUpdatedValue > walletValue)
                  ? "border-[#2775EC]"
                  : "border-[#E8E8E8]"
              }`}
              >
                <span className="flex text-lg font-medium text-[#43494B] mr-0.5">
                  {currentcountry?.currency == "AED" ? (
                    <img
                      src={getAssetsUrl("feed/aed-icon.svg")}
                      alt="AED"
                      className={`w-[16px] h-[16px] inline-block mix-blend-multiply ${
                        isRTL ? "ml-0.5" : "mr-0.5"
                      }`}
                      style={{ color: "black" }}
                      loading="lazy"
                    />
                  ) : (
                    <span
                      className={`text-[#191B1C] text-xl font-semibold ${
                        isRTL ? "ml-0.5" : "mr-0.5"
                      }`}
                    >
                      {currentcountry?.currency}
                    </span>
                  )}
                </span>

                <input
                  type="number"
                  min="1"
                  max={walletValue}
                  step="1"
                  value={walletUpdatedValue}
                  onChange={(e) => handleWalletAmountChange(e.target.value)}
                  className="bg-transparent outline-none w-full font-semibold text-lg text-[#191B1C]"
                />
              </div>
              {/* Save button */}
              <button
                className={`rounded-lg w-[124px] h-[46px] text-base font-semibold transition
              ${
                !(walletUpdatedValue == 0 || walletUpdatedValue > walletValue)
                  ? "bg-[#5B32C2] text-white hover:bg-[#47269E] cursor-pointer"
                  : "bg-[#E8E8E8] text-[#43494B] cursor-not-allowed"
              }`}
                disabled={
                  walletUpdatedValue === 0 || walletUpdatedValue > walletValue
                }
                onClick={() => handleSubmitWalletAmount()}
              >
                SAVE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(Payment);
