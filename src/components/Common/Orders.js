import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { MediaQueries } from "../../components/utils";
import DeskOrdertrack from "./DeskOrdertrack";
import Mobiletrack from "./Mobiletrack";
import { useContent, useCurrentLanguage } from "@/hooks";
import { getAssetsUrl } from "../../components/utils/helpers";

const Orders = ({ orderlistdata }) => {
  console.log(orderlistdata);
  const { isMobile } = MediaQueries();
  const currentLanguage = useCurrentLanguage();
  // const orderlistdata = useSelector((state) => state.formslice.orderlistdata);
  const [openOrderId, setOpenOrderId] = useState(null);
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );

  // Content translations - using existing keys where possible
  const orderId = useContent("forms.orderId");
  const referenceNo = useContent("forms.referenceNo");
  const orderTotal = useContent("forms.orderTotal");
  const deliveryBy = useContent("forms.deliveryBy");
  const placedOn = useContent("forms.placedOn");
  const orderDetails = useContent("buttons.orderDetails");
  const cancelled = useContent("forms.cancelled");
  const amountRefundedToWallet = useContent("forms.amountRefundedToWallet");
  const paymentDetails = useContent("forms.paymentDetails");
  const paymentMethod = useContent("checkout.paymentMethod");
  const deliveryAddressDetails = useContent("forms.deliveryAddressDetails");
  const deliveryAddress = useContent("pages.deliveryAddress");
  const priceDetails = useContent("forms.priceDetails");
  const subtotal = useContent("checkout.subtotal");
  const vat = useContent("forms.vat");
  const shippingCharge = useContent("forms.shippingCharge");
  const processingFee = useContent("forms.processingFee");
  const discount = useContent("checkout.discount");
  const walletAmountUsedLabel = useContent("wallet.walletlabel");
  const total = useContent("checkout.total");
  const inclusiveOfVat = useContent("forms.inclusiveOfVat");
  const toggleOrderDetails = (orderId) => {
    setOpenOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const getCurrentStep = (ele) => {
    if (ele.cancelled) {
      if (ele.deliverydateOver) return 5;
      if (ele.dispatchDateOver) return 4;
      if (ele.packDateOver) return 3;
      if (ele.processDateOver) return 2;
      return 1; // Default step if none of the conditions are met
    } else {
      if (ele.deliverydateOver) return 4;
      if (ele.dispatchDateOver) return 3;
      if (ele.packDateOver) return 2;
      if (ele.processDateOver) return 1;
      return 0; // Default step if none of the conditions are met
    }
  };

  return (
    <>
      {orderlistdata.data.map((ele) => {
        const walletAmountUsedValue =
          parseFloat(
            ele?.orderDetail?.walletAmountUsed ?? ele?.walletAmountUsed ?? 0
          ) || 0;
        // console.log(ele)
        return (
          <div
            key={ele.orderId}
            className="mt-4 mb-4"
            dir={currentLanguage === "ar" ? "rtl" : "ltr"}
          >
            <div className="myorder-main">
              {/* Top Order Summary */}
              <div
                className={`myorder-top d-flex flex-wrap ${
                  currentLanguage === "ar"
                    ? "flex-row-reverse justify-content-between"
                    : "justify-content-between"
                }`}
              >
                <div
                  className={`d-flex flex-wrap gap-4 ${
                    currentLanguage === "ar" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div>
                    <div className="order-title">{orderId}:</div>
                    <div className="order-content">{ele.orderId}</div>
                  </div>
                  <div>
                    <div className="order-title">{referenceNo}</div>
                    <div className="order-content">{ele.referenceNo}</div>
                  </div>
                </div>
                <div className="ordertitleend">
                  <div className="order-title">{orderTotal}</div>
                  <div className="order-content flex items-center">
                    {currentcountry?.currency == "AED" ? (
                      <img
                        src={getAssetsUrl("feed/aed-icon.svg")}
                        alt="AED"
                        className="w-3 h-3 inline-block mix-blend-multiply mr-1"
                        style={{ color: "black" }}
                        loading="lazy"
                      />
                    ) : (
                      <>{currentcountry.currency} </>
                    )}
                    {ele.totalAmount}
                  </div>
                </div>
              </div>

              {/* Status & Product List */}
              <div className="myorder-productdetails ">
                <div
                  className={`d-flex align-items-center mb-3 ${
                    currentLanguage === "ar"
                      ? "flex-row-reverse justify-content-between"
                      : "justify-content-between"
                  }`}
                >
                  <div>
                    {/* <div className="myorder-orderstatus d-flex align-items-center gap-2">
                                        <img className="ordersbox-img" src={Deliveybox} alt="box" loading="lazy" />
                                        Ordered
                                    </div> */}
                    {ele.cancelled ? (
                      ele.refundAddedInWallet ? (
                        <div
                          className={`d-flex gap-2 ${
                            currentLanguage === "ar" ? "flex-row-reverse" : ""
                          }`}
                        >
                          <div className="flex items-center  gap-2">
                            <div
                              className="myorder-orderstatus d-flex align-items-center gap-2"
                              style={{
                                background: "#FFDFDF",
                                color: "#F34845",
                              }}
                            >
                              {cancelled}
                            </div>
                            <div
                              className="myorder-orderstatus d-flex align-items-center gap-2"
                              style={{
                                background: "#FFDFDF",
                                color: "#F34845",
                              }}
                            >
                              {amountRefundedToWallet}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="myorder-orderstatus d-flex align-items-center gap-2"
                          style={{ background: "#FFDFDF", color: "#F34845" }}
                        >
                          {cancelled}
                        </div>
                      )
                    ) : (
                      <div
                        className={`d-flex gap-2 ${
                          currentLanguage === "ar" ? "flex-row-reverse" : ""
                        }`}
                      >
                        <div className="order-deliverytitle">{deliveryBy}</div>
                        <div className="order-date">
                          {ele.orderDetail.deliveryDate}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="ordertitleend">
                    <div className="order-title">{placedOn}</div>
                    <div className="order-content">{ele.placedOn}</div>
                  </div>
                </div>

                {/* Product List */}
                {ele.items.map((item, index) => (
                  <Row key={index} className="mb-3">
                    <div className="form-border-bottom"></div>
                    <Col lg={12}>
                      <div
                        className={`d-flex gap-3 mt-3 ${
                          currentLanguage === "ar" ? "flex-row-reverse" : ""
                        }`}
                      >
                        <img
                          src={item.image}
                          className="order-image"
                          alt="product"
                          loading="lazy"
                        />
                        <div className="cartproduct-details">
                          <div className="cartproduct-title">{item.name}</div>
                          <div
                            className={`cartproduct-price flex items-center ${
                              currentLanguage === "ar"
                                ? "flex-row-reverse justify-end"
                                : ""
                            }`}
                          >
                            {currentcountry?.currency == "AED" ? (
                              <img
                                src={getAssetsUrl("feed/aed-icon.svg")}
                                alt="AED"
                                className="w-3 h-3 inline-block mix-blend-multiply mr-1"
                                style={{ color: "black" }}
                                loading="lazy"
                              />
                            ) : (
                              <span className="currencycode">
                                {currentcountry.currency}
                              </span>
                            )}{" "}
                            {item.price}
                          </div>
                        </div>
                      </div>
                    </Col>
                    {/* <Col lg={3}>
                                        {
                                            ele.processDateOver == "false" &&
                                            <div className="cancelreturnbtn"> Cancel </div>
                                        }

                                        {
                                            orderlistdata?.data.deliverydateOver &&

                                            <div className="cancelreturnbtn"> Return</div>
                                        }
                                    </Col> */}
                  </Row>
                ))}
                {isMobile && openOrderId === ele.referenceNo && (
                  <div>
                    <div className="">
                      {isMobile && (
                        <Mobiletrack
                          currentStep={getCurrentStep(ele)}
                          data={ele.orderDetail}
                          ele={ele}
                        />
                      )}
                    </div>

                    <div className="orderdetails-content">
                      <div className="order-paymentdetail-title">
                        {paymentDetails}
                      </div>
                      <div className="payment-type">
                        <div className="order-paymenttype-title">
                          {paymentMethod}
                        </div>
                        <div className="order-paymenttype-cost">
                          {ele.orderDetail.paymode}
                        </div>
                      </div>
                    </div>

                    <div className="orderdetails-content">
                      <div className="order-paymentdetail-title">
                        {deliveryAddressDetails}
                      </div>
                      <div className="payment-type d-block">
                        <div className="order-paymenttype-title">
                          {deliveryAddress}
                        </div>
                        <div className=" order-paymenttype-cost address-style">
                          {ele.orderDetail.shipping_address}
                        </div>
                      </div>
                    </div>

                    <div className="orderdetails-content">
                      <div className="order-paymentdetail-title">
                        {priceDetails}
                      </div>
                      <div className="payment-type">
                        <div className="order-paymenttype-title">
                          {subtotal}
                        </div>
                        <div className="order-paymenttype-cost flex items-center">
                          {currentcountry?.currency == "AED" ? (
                            <img
                              src={getAssetsUrl("feed/aed-icon.svg")}
                              alt="AED"
                              className="w-3 h-3 inline-block mix-blend-multiply mr-1"
                              style={{ color: "black" }}
                              loading="lazy"
                            />
                          ) : (
                            <>{currentcountry.currency} </>
                          )}
                          {parseFloat(ele?.sub_total || 0).toFixed(2)}
                        </div>
                      </div>
                      {currentcountry?.currency !== "KWD" &&
                        currentcountry?.currency !== "QAR" && (
                          <div className="payment-type">
                            <div className="order-paymenttype-title">{vat}</div>
                            <div className="order-paymenttype-cost flex items-center">
                              {currentcountry?.currency == "AED" ? (
                                <img
                                  src={getAssetsUrl("feed/aed-icon.svg")}
                                  alt="AED"
                                  className="w-3 h-3 inline-block mix-blend-multiply mr-1"
                                  style={{ color: "black" }}
                                  loading="lazy"
                                />
                              ) : (
                                <>{currentcountry.currency} </>
                              )}
                              {ele.orderDetail.vat}
                            </div>
                          </div>
                        )}
                      <div className="payment-type">
                        <div className="order-paymenttype-title">
                          {shippingCharge}
                        </div>
                        <div
                          className={`order-paymenttype-cost flex items-center ${
                            currentLanguage === "ar" ? "flex-row-reverse" : ""
                          }`}
                        >
                          {currentcountry?.currency == "AED" ? (
                            <img
                              src={getAssetsUrl("feed/aed-icon.svg")}
                              alt="AED"
                              className="w-3 h-3 inline-block mix-blend-multiply mr-1"
                              style={{ color: "black" }}
                              loading="lazy"
                            />
                          ) : (
                            <>{currentcountry.currency} </>
                          )}
                          {ele.orderDetail.shipping_charge}
                        </div>
                      </div>
                      <div className="payment-type">
                        <div className="order-paymenttype-title">
                          {processingFee}
                        </div>
                        <div className="order-paymenttype-cost flex items-center">
                          {currentcountry?.currency == "AED" ? (
                            <img
                              src={getAssetsUrl("feed/aed-icon.svg")}
                              alt="AED"
                              className="w-3 h-3 inline-block mix-blend-multiply mr-1"
                              style={{ color: "black" }}
                              loading="lazy"
                            />
                          ) : (
                            <>{currentcountry.currency} </>
                          )}
                          {ele.orderDetail.processing_fee}
                        </div>
                      </div>
                      <div className="payment-type">
                        <div className="order-paymenttype-title text-green-500">
                          {discount}
                        </div>
                        <div className="order-paymenttype-cost text-green-500 flex items-center">
                          -{" "}
                          {currentcountry?.currency == "AED" ? (
                            <img
                              src={getAssetsUrl("feed/aed-icon.svg")}
                              alt="AED"
                              className="w-3 h-3 inline-block mix-blend-multiply mr-1"
                              style={{ color: "black" }}
                              loading="lazy"
                            />
                          ) : (
                            <>{currentcountry.currency} </>
                          )}
                          {ele.orderDetail.discount}
                        </div>
                      </div>
                      {walletAmountUsedValue > 0 && (
                        <div className="payment-type">
                          <div className="order-paymenttype-title text-green-500">
                            {walletAmountUsedLabel}
                          </div>
                          <div className="order-paymenttype-cost text-green-500 flex items-center">
                            -{" "}
                            {currentcountry?.currency == "AED" ? (
                              <>
                                <img
                                  src={getAssetsUrl("feed/aed-icon.svg")}
                                  alt="AED"
                                  className={`w-3 h-3 inline-block mix-blend-multiply ${
                                    currentLanguage === "ar" ? "ml-1" : "mr-1"
                                  }`}
                                  style={{ color: "black" }}
                                  loading="lazy"
                                />
                                {walletAmountUsedValue.toFixed(2)}
                              </>
                            ) : (
                              <>
                                {currentcountry.currency}{" "}
                                {walletAmountUsedValue.toFixed(2)}
                              </>
                            )}
                          </div>
                        </div>
                      )}
                      <div className="form-border-bottom"></div>
                      <div className="payment-type pt-3 pb-2">
                        <div className="payment-type-total">
                          {total}{" "}
                          {currentcountry?.currency !== "KWD" &&
                            currentcountry?.currency !== "QAR" && (
                              <span className="totalvat">
                                {inclusiveOfVat}{" "}
                              </span>
                            )}
                        </div>
                        <div
                          className={`payment-type-totalcost flex items-center gap-0.5 ${
                            currentLanguage === "ar"
                              ? "flex-row-reverse justify-end"
                              : ""
                          }`}
                        >
                          {currentcountry?.currency == "AED" ? (
                            <img
                              src={getAssetsUrl("feed/aed-icon.svg")}
                              alt="AED"
                              className="w-4 h-4 inline-block mix-blend-multiply mr-1"
                              style={{ color: "black" }}
                              loading="lazy"
                            />
                          ) : (
                            <>{currentcountry.currency} </>
                          )}
                          {ele.orderDetail.total_amount}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {!isMobile ? (
                  // openOrderId == ele.orderId &&
                  <div
                    className={`order-detailbutton mt-3 d-flex align-items-center ${
                      currentLanguage === "ar" ? "flex-row-reverse" : ""
                    }`}
                    onClick={() => toggleOrderDetails(ele.referenceNo)}
                  >
                    {orderDetails}
                    {openOrderId === ele.referenceNo ? (
                      <img
                        className={currentLanguage === "ar" ? "me-2" : "ms-2"}
                        src={getAssetsUrl("vector_icons/arrow_up.png")}
                        alt="arrow up"
                        style={{
                          transform:
                            currentLanguage === "ar" ? "scaleX(-1)" : "none",
                        }}
                        loading="lazy"
                      ></img>
                    ) : (
                      <img
                        className={currentLanguage === "ar" ? "me-2" : "ms-2"}
                        src={getAssetsUrl("vector_icons/arrow_down.png")}
                        alt="arrow down"
                        style={{
                          transform:
                            currentLanguage === "ar" ? "scaleX(-1)" : "none",
                        }}
                        loading="lazy"
                      ></img>
                    )}
                  </div>
                ) : (
                  <div
                    className={`order-detailbutton mt-3 d-flex align-items-center ${
                      currentLanguage === "ar" ? "flex-row-reverse" : ""
                    }`}
                    onClick={() => toggleOrderDetails(ele.referenceNo)}
                  >
                    {orderDetails}
                    {openOrderId === ele.referenceNo ? (
                      <img
                        className={currentLanguage === "ar" ? "me-2" : "ms-2"}
                        src={getAssetsUrl("vector_icons/arrow_up.png")}
                        alt="arrow up"
                        style={{
                          transform:
                            currentLanguage === "ar" ? "scaleX(-1)" : "none",
                        }}
                        loading="lazy"
                      ></img>
                    ) : (
                      <img
                        className={currentLanguage === "ar" ? "me-2" : "ms-2"}
                        src={getAssetsUrl("vector_icons/arrow_down.png")}
                        alt="arrow down"
                        style={{
                          transform:
                            currentLanguage === "ar" ? "scaleX(-1)" : "none",
                        }}
                        loading="lazy"
                      ></img>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Expanded Order Details */}
            {!isMobile && openOrderId === ele.referenceNo && (
              <div className="order-details">
                <div className="orderdetail-title">{orderDetails}</div>

                <div className="orderdetails-content">
                  {isMobile ? (
                    <Mobiletrack
                      currentStep={getCurrentStep(ele)}
                      data={ele.orderDetail}
                    />
                  ) : (
                    <DeskOrdertrack
                      currentStep={getCurrentStep(ele)}
                      data={ele.orderDetail}
                      ele={ele}
                    />
                  )}
                </div>

                <div className="orderdetails-content">
                  <div className="order-paymentdetail-title">
                    {paymentDetails}
                  </div>
                  <div className="payment-type">
                    <div className="order-paymenttype-title">
                      {paymentMethod}
                    </div>
                    <div className="order-paymenttype-cost">
                      {ele.orderDetail.paymode}
                    </div>
                  </div>
                </div>

                <div className="orderdetails-content">
                  <div className="order-paymentdetail-title">
                    {deliveryAddressDetails}
                  </div>
                  <div className="payment-type">
                    <div className="order-paymenttype-title">
                      {deliveryAddress}
                    </div>
                    <div className="order-paymenttype-cost">
                      {ele.orderDetail.shipping_address}
                    </div>
                  </div>
                </div>

                <div className="orderdetails-content">
                  <div className="order-paymentdetail-title">
                    {priceDetails}
                  </div>
                  <div className="payment-type">
                    <div className="order-paymenttype-title">{subtotal}</div>
                    <div className="order-paymenttype-cost flex items-center">
                      {currentcountry?.currency == "AED" ? (
                        <img
                          src={getAssetsUrl("feed/aed-icon.svg")}
                          alt="AED"
                          className={`w-3 h-3 inline-block mix-blend-multiply ${
                            currentLanguage === "ar" ? "ml-1" : "mr-1"
                          }`}
                          style={{ color: "black" }}
                          loading="lazy"
                        />
                      ) : (
                        <>{currentcountry.currency} </>
                      )}
                      {parseFloat(ele?.sub_total || 0).toFixed(2)}
                    </div>
                  </div>
                  {currentcountry?.currency !== "KWD" &&
                    currentcountry?.currency !== "QAR" && (
                      <div className="payment-type">
                        <div className="order-paymenttype-title">{vat}</div>
                        <div className="order-paymenttype-cost flex items-center">
                          {currentcountry?.currency == "AED" ? (
                            <>
                              <img
                                src={getAssetsUrl("feed/aed-icon.svg")}
                                alt="AED"
                                className={`w-3 h-3 inline-block mix-blend-multiply ${
                                  currentLanguage === "ar" ? "ml-1" : "mr-1"
                                }`}
                                style={{ color: "black" }}
                                loading="lazy"
                              />
                              {ele.orderDetail.vat}
                            </>
                          ) : (
                            <>
                              {currentcountry.currency} {ele.orderDetail.vat}
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  <div className="payment-type">
                    <div className="order-paymenttype-title">
                      {shippingCharge}
                    </div>
                    <div className="order-paymenttype-cost flex items-center">
                      {currentcountry?.currency == "AED" ? (
                        <>
                          <img
                            src={getAssetsUrl("feed/aed-icon.svg")}
                            alt="AED"
                            className={`w-3 h-3 inline-block mix-blend-multiply ${
                              currentLanguage === "ar" ? "ml-1" : "mr-1"
                            }`}
                            style={{ color: "black" }}
                            loading="lazy"
                          />
                          {ele.orderDetail.shipping_charge}
                        </>
                      ) : (
                        <>
                          {currentcountry.currency}{" "}
                          {ele.orderDetail.shipping_charge}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="payment-type">
                    <div className="order-paymenttype-title">
                      {processingFee}
                    </div>
                    <div className="order-paymenttype-cost flex items-center">
                      {currentcountry?.currency == "AED" ? (
                        <>
                          <img
                            src={getAssetsUrl("feed/aed-icon.svg")}
                            alt="AED"
                            className={`w-3 h-3 inline-block mix-blend-multiply ${
                              currentLanguage === "ar" ? "ml-1" : "mr-1"
                            }`}
                            style={{ color: "black" }}
                            loading="lazy"
                          />
                          {ele.orderDetail.processing_fee}
                        </>
                      ) : (
                        <>
                          {currentcountry.currency}{" "}
                          {ele.orderDetail.processing_fee}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="payment-type">
                    <div className="order-paymenttype-title text-green-500">
                      {discount}
                    </div>
                    <div className="order-paymenttype-cost text-green-500 flex items-center">
                      -{" "}
                      {currentcountry?.currency == "AED" ? (
                        <>
                          <img
                            src={getAssetsUrl("feed/aed-icon.svg")}
                            alt="AED"
                            className={`w-3 h-3 inline-block mix-blend-multiply ${
                              currentLanguage === "ar" ? "ml-1" : "mr-1"
                            }`}
                            style={{ color: "black" }}
                            loading="lazy"
                          />
                          {ele.orderDetail.discount}
                        </>
                      ) : (
                        <>
                          {currentcountry.currency} {ele.orderDetail.discount}
                        </>
                      )}
                    </div>
                  </div>
                  {walletAmountUsedValue > 0 && (
                    <div className="payment-type">
                      <div className="order-paymenttype-title text-green-500">
                        {walletAmountUsedLabel}
                      </div>
                      <div className="order-paymenttype-cost text-green-500 flex items-center">
                        -{" "}
                        {currentcountry?.currency == "AED" ? (
                          <>
                            <img
                              src={getAssetsUrl("feed/aed-icon.svg")}
                              alt="AED"
                              className={`w-3 h-3 inline-block mix-blend-multiply ${
                                currentLanguage === "ar" ? "ml-1" : "mr-1"
                              }`}
                              style={{ color: "black" }}
                              loading="lazy"
                            />
                            {walletAmountUsedValue.toFixed(2)}
                          </>
                        ) : (
                          <>
                            {currentcountry.currency}{" "}
                            {walletAmountUsedValue.toFixed(2)}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="form-border-bottom"></div>
                  <div className="payment-type pt-3 pb-2">
                    <div className="payment-type-total">
                      {total}
                      {currentcountry?.currency !== "KWD" &&
                        currentcountry?.currency !== "QAR" && (
                          <span className="totalvat"> {inclusiveOfVat} </span>
                        )}
                    </div>
                    <div
                      className={`payment-type-totalcost flex items-center gap-0.5 ${
                        currentLanguage === "ar"
                          ? "flex-row-reverse justify-end"
                          : ""
                      }`}
                    >
                      {currentcountry?.currency == "AED" ? (
                        <>
                          <img
                            src={getAssetsUrl("feed/aed-icon.svg")}
                            alt="AED"
                            className={`w-4 h-4 inline-block mix-blend-multiply ${
                              currentLanguage === "ar" ? "ml-1" : "mr-1"
                            }`}
                            style={{ color: "black" }}
                            loading="lazy"
                          />
                          {ele.orderDetail.total_amount}
                        </>
                      ) : (
                        <>
                          {currentcountry.currency}{" "}
                          {ele.orderDetail.total_amount}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className={`order-detailbutton mt-3 d-flex align-items-center ${
                    currentLanguage === "ar" ? "flex-row-reverse" : ""
                  }`}
                  onClick={() => toggleOrderDetails(ele.referenceNo)}
                >
                  {orderDetails}
                  {openOrderId === ele.referenceNo ? (
                    <img
                      className={currentLanguage === "ar" ? "me-2" : "ms-2"}
                      src={getAssetsUrl("vector_icons/arrow_up.png")}
                      alt="arrow up"
                      style={{
                        transform:
                          currentLanguage === "ar" ? "scaleX(-1)" : "none",
                      }}
                      loading="lazy"
                    ></img>
                  ) : (
                    <img
                      className={currentLanguage === "ar" ? "me-2" : "ms-2"}
                      src={getAssetsUrl("vector_icons/arrow_down.png")}
                      alt="arrow down"
                      style={{
                        transform:
                          currentLanguage === "ar" ? "scaleX(-1)" : "none",
                      }}
                      loading="lazy"
                    ></img>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default Orders;
