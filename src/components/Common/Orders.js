import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { MediaQueries } from "../../components/utils";
import DeskOrdertrack from "./DeskOrdertrack";
import Mobiletrack from "./Mobiletrack";
const Orders = ({ orderlistdata }) => {
  const { isMobile } = MediaQueries();
  // const orderlistdata = useSelector((state) => state.formslice.orderlistdata);
  const [openOrderId, setOpenOrderId] = useState(null);
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const toggleOrderDetails = (orderId) => {
    setOpenOrderId((prev) => (prev === orderId ? null : orderId));
  };

  // const orderlistdata = {
  //     data: [
  //         {
  //             "referenceNo": "1531974Z549J",
  //             "orderId": "OMRSSOP3236",
  //             "totalAmount": 7.4,
  //             "placedOn": "2025-05-05 17:13:58",
  //             "items": [
  //                 {
  //                     "name": "Vacuum Suction Magnetic Car Phone Holder Electric Magnetic Phone Holder",
  //                     "image": "https://www.ourshopee.com/ourshopee-img/ourshopee_products/300/920473381Car-Phone-Stand-with-360-Rotation-Vacuum-Suction-Cup-and-Strong-Magnetic-Adsorption-for-Universal-Phone-Holder.jpg",
  //                     "product_id": 234756,
  //                     "price": 5.9,
  //                     "quantity": 1
  //                 }
  //             ],
  //             "cancelled": true,
  //             "cancelledText": "As per your request, your item has been cancelled",
  //             "cancelledDate": "2025-05-06T17:56:54.000Z",
  //             "processDateOver": true,
  //             "packDateOver": true,
  //             "dispatchDateOver": false,
  //             "deliverydateOver": false,
  //             "orderDetail": {
  //                 "order_id": 1531974,
  //                 "order_refid": "1531974Z549J",
  //                 "user_name": "sai murali",
  //                 "mobile": "5074125889",
  //                 "paymode": "cash",
  //                 "total_amount": 7.4,
  //                 "shipping_charge": 1,
  //                 "processing_fee": "0.500",
  //                 "discount": "0.000",
  //                 "order_date": "2025-05-05T17:13:58.000Z",
  //                 "order_status": "Pending",
  //                 "shipping_address": "C85H+P9G,NehruOuterRingRd,FinancialDistrict,Nanakramguda,Hyderabad,Telangana500032,India",
  //                 "vat": "0.352",
  //                 "orderedDate": "Mon, May 05",
  //                 "processedDate": "Mon, May 05",
  //                 "packedDate": "Mon, May 07",
  //                 "dispatchedDate": "Tue, May 08",
  //                 "deliveryDate": "Thu, May 10"
  //             }
  //         }
  //     ]
  // }

  // Logic to determine current step based on order status

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
      {orderlistdata?.data?.map((ele) => {
        // console.log(ele)
        return (
          <div key={ele.orderId} className="mt-4 mb-4">
            <div className="myorder-main">
              {/* Top Order Summary */}
              <div className="myorder-top d-flex justify-content-between flex-wrap">
                <div className="d-flex flex-wrap gap-4">
                  <div>
                    <div className="order-title">Order ID:</div>
                    <div className="order-content">{ele.orderId}</div>
                  </div>
                  <div>
                    <div className="order-title">Reference No.:</div>
                    <div className="order-content">{ele.referenceNo}</div>
                  </div>
                </div>
                <div className="ordertitleend">
                  <div className="order-title">Order Total:</div>
                  <div className="order-content">
                    {currentcountry.currency} {ele.totalAmount}
                  </div>
                </div>
              </div>

              {/* Status & Product List */}
              <div className="myorder-productdetails ">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    {/* <div className="myorder-orderstatus d-flex align-items-center gap-2">
                                        <img className="ordersbox-img" src={Deliveybox} alt="box" />
                                        Ordered
                                    </div> */}
                    <div className="d-flex gap-2">
                      <div className="order-deliverytitle">Delivery by</div>
                      <div className="order-date">
                        {ele.orderDetail.deliveryDate}
                      </div>
                    </div>
                  </div>
                  <div className="ordertitleend">
                    <div className="order-title">Placed on:</div>
                    <div className="order-content">{ele.placedOn}</div>
                  </div>
                </div>

                {/* Product List */}
                {ele.items.map((item, index) => (
                  <Row key={index} className="mb-3">
                    <div className="form-border-bottom"></div>
                    <Col lg={12}>
                      <div className="d-flex gap-3 mt-3">
                        <img
                          src={item.image}
                          className="order-image"
                          alt="product"
                        />
                        <div className="cartproduct-details">
                          <div className="cartproduct-title">{item.name}</div>
                          <div className="cartproduct-price">
                            <span className="currencycode">
                              {currentcountry.currency}
                            </span>{" "}
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
                        Payment Details
                      </div>
                      <div className="payment-type">
                        <div className="order-paymenttype-title">
                          Payment Method
                        </div>
                        <div className="order-paymenttype-cost">
                          {ele.orderDetail.paymode}
                        </div>
                      </div>
                    </div>

                    <div className="orderdetails-content">
                      <div className="order-paymentdetail-title">
                        Delivery Address Details
                      </div>
                      <div className="payment-type d-block">
                        <div className="order-paymenttype-title">
                          Delivery Address
                        </div>
                        <div className=" order-paymenttype-cost address-style">
                          {ele.orderDetail.shipping_address}
                        </div>
                      </div>
                    </div>

                    <div className="orderdetails-content">
                      <div className="order-paymentdetail-title">
                        Price Details
                      </div>
                      <div className="payment-type">
                        <div className="order-paymenttype-title">Subtotal</div>
                        <div className="order-paymenttype-cost">
                          {currentcountry.currency}{" "}
                          {(
                            parseFloat(ele?.sub_total || 0)
                          ).toFixed(2)}
                        </div>
                      </div>
                      {(currentcountry?.currency !== "KWD" &&
                        currentcountry?.currency !== "QAR") && (
                          <div className="payment-type">
                            <div className="order-paymenttype-title">VAT</div>
                            <div className="order-paymenttype-cost">
                              {currentcountry.currency} {ele.orderDetail.vat}
                            </div>
                          </div>
                        )}
                      <div className="payment-type">
                        <div className="order-paymenttype-title">
                          Shipping Charge
                        </div>
                        <div className="order-paymenttype-cost">
                          {currentcountry.currency}{" "}
                          {ele.orderDetail.shipping_charge}
                        </div>
                      </div>
                      <div className="payment-type">
                        <div className="order-paymenttype-title">
                          Processing Fee
                        </div>
                        <div className="order-paymenttype-cost">
                          {currentcountry.currency}{" "}
                          {ele.orderDetail.processing_fee}
                        </div>
                      </div>
                      <div className="payment-type">
                        <div className="order-paymenttype-title text-green-500">Discount</div>
                        <div className="order-paymenttype-cost text-green-500">
                         - {currentcountry.currency} {ele.orderDetail.discount}
                        </div>
                      </div>
                      <div className="form-border-bottom"></div>
                      <div className="payment-type pt-3 pb-2">
                        <div className="payment-type-total">
                          Total 
                          {(currentcountry?.currency !== "KWD" &&
                            currentcountry?.currency !== "QAR") && (
                              <span className="totalvat">
                                (Inclusive of VAT){" "}
                              </span>
                            )}
                        </div>
                        <div className="payment-type-totalcost">
                          {currentcountry.currency}{" "}
                          {ele.orderDetail.total_amount}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {!isMobile ? (
                  // openOrderId == ele.orderId &&
                  <div
                    className="order-detailbutton mt-3"
                    onClick={() => toggleOrderDetails(ele.referenceNo)}
                  >
                    Order Details
                    {openOrderId === ele.referenceNo ? (
                      <img
                        className="ms-2"
                        src="/assets/vector_icons/arrow_up.png"
                      ></img>
                    ) : (
                      <img
                        className="ms-2"
                        src="/assets/vector_icons/arrow_down.png"
                      ></img>
                    )}
                  </div>
                ) : (
                  <div
                    className="order-detailbutton mt-3"
                    onClick={() => toggleOrderDetails(ele.referenceNo)}
                  >
                    Order Details
                    {openOrderId === ele.referenceNo ? (
                      <img
                        className="ms-2"
                        src="/assets/vector_icons/arrow_up.png"
                      ></img>
                    ) : (
                      <img
                        className="ms-2"
                        src="/assets/vector_icons/arrow_down.png"
                      ></img>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Expanded Order Details */}
            {!isMobile && openOrderId === ele.referenceNo && (
              <div className="order-details">
                <div className="orderdetail-title">Order Details</div>

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
                    Payment Details
                  </div>
                  <div className="payment-type">
                    <div className="order-paymenttype-title">
                      Payment Method
                    </div>
                    <div className="order-paymenttype-cost">
                      {ele.orderDetail.paymode}
                    </div>
                  </div>
                </div>

                <div className="orderdetails-content">
                  <div className="order-paymentdetail-title">
                    Delivery Address Details
                  </div>
                  <div className="payment-type">
                    <div className="order-paymenttype-title">
                      Delivery Address
                    </div>
                    <div className="order-paymenttype-cost">
                      {ele.orderDetail.shipping_address}
                    </div>
                  </div>
                </div>

                <div className="orderdetails-content">
                  <div className="order-paymentdetail-title">Price Details</div>
                  <div className="payment-type">
                    <div className="order-paymenttype-title">Subtotal</div>
                    <div className="order-paymenttype-cost">
                      {currentcountry.currency}{" "}
                      {(
                        parseFloat(ele?.sub_total || 0)
                      ).toFixed(2)}

                    </div>
                  </div>
                  {(currentcountry?.currency !== "KWD" &&
                    currentcountry?.currency !== "QAR") && (
                      <div className="payment-type">
                        <div className="order-paymenttype-title">VAT</div>
                        <div className="order-paymenttype-cost">
                          {currentcountry.currency} {ele.orderDetail.vat}
                        </div>
                      </div>
                    )}
                  <div className="payment-type">
                    <div className="order-paymenttype-title">
                      Shipping Charge
                    </div>
                    <div className="order-paymenttype-cost">
                      {currentcountry.currency}{" "}
                      {ele.orderDetail.shipping_charge}
                    </div>
                  </div>
                  <div className="payment-type">
                    <div className="order-paymenttype-title">
                      Processing Fee
                    </div>
                    <div className="order-paymenttype-cost">
                      {currentcountry.currency} {ele.orderDetail.processing_fee}
                    </div>
                  </div>
                  <div className="payment-type">
                    <div className="order-paymenttype-title text-green-500">Discount</div>
                    <div className="order-paymenttype-cost text-green-500">
                     - {currentcountry.currency} {ele.orderDetail.discount}
                    </div>
                  </div>
                  <div className="form-border-bottom"></div>
                  <div className="payment-type pt-3 pb-2">
                    <div className="payment-type-total">
                      Total
                      {(currentcountry?.currency !== "KWD" &&
                        currentcountry?.currency !== "QAR") && (
                          <span className="totalvat">(Inclusive of VAT) </span>
                        )}
                    </div>
                    <div className="payment-type-totalcost">
                      {currentcountry.currency} {ele.orderDetail.total_amount}
                    </div>
                  </div>
                </div>

                <div
                  className="order-detailbutton mt-3"
                  onClick={() => toggleOrderDetails(ele.referenceNo)}
                >
                  Order Details
                  {openOrderId === ele.referenceNo ? (
                    <img
                      className="ms-2"
                      src="/assets/vector_icons/arrow_up.png"
                    ></img>
                  ) : (
                    <img
                      className="ms-2"
                      src="/assets/vector_icons/arrow_down.png"
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
