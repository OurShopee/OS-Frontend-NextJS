"use client";
import { availableCoupons, checkoutSingleProd } from "@/api/payments";
import Breadcomp from "@/components/Common/Breadcomp";
import CheckCoupan from "@/components/Common/CheckCoupan";
import Donation from "@/components/Common/Donation";
import Paymentdetails from "@/components/Common/Paymentdetails";
import withAuth from "@/components/Common/withAuth";
import { MediaQueries } from "@/components/utils";
import { pushToDataLayer } from "@/components/utils/dataUserpush";
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
import { useDispatch, useSelector } from "react-redux";
import { useContent } from "@/hooks";

const Payment = () => {
  const searchParams = useSearchParams();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [availableCoupon, setAvailableCoupon] = useState([]);
  const prodId = searchParams.get("prodId");
  const qty = searchParams.get("qty");
  const sku = searchParams.get("sku");
  const price = searchParams.get("price");
  const addresslistdata = useSelector(
    (state) => state.addresslice.addresslistdata
  );
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
  const orderSummary = useContent("checkout.orderSummary");
  const deliveryAddress = useContent("checkout.deliveryAddress");
  const changeAddress = useContent("checkout.changeAddress");
  const selectAddress = useContent("checkout.selectAddress");
  const pleaseSelectDeliveryAddress = useContent("checkout.pleaseSelectDeliveryAddress");
  
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
                    <img src="/assets/vector_icons/Edit.svg" alt="edit" />
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
    </div>
  );
};

export default withAuth(Payment);
