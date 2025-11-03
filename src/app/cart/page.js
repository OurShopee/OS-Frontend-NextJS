"use client";

import Breadcomp from "@/components/Common/Breadcomp";
import Nocart from "@/components/Common/Nocart";
import Paymentdetails from "@/components/Common/Paymentdetails";
import { MediaQueries } from "@/components/utils";
import { CalculatePaymentDetails } from "@/components/utils/Cart";
import { pushToDataLayer } from "@/components/utils/dataUserpush";
import deleteimg from "@/images/Delete.png";
import {
    cartlistWithoutLoaderapi,
    changeCartQuantityapi,
    removeFromCartapi,
} from "@/redux/cartslice";
import { setformmodal, setformstatus } from "@/redux/formslice";
import { GetPlaceOrderapi, setpaymentmethodsdata } from "@/redux/paymentslice";
import Cookies from "js-cookie";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { FiMinus, FiPlus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

const Cart = () => {
  const dispatch = useDispatch();
  const authstatus = useSelector((state) => state.formslice.authstatus);
  const cartlistdata = useSelector((state) => state.cartslice.cartlistdata);
  const paymentmethodsdata = useSelector(
    (state) => state.paymentslice.paymentmethodsdata
  );
  const loading = useSelector((state) => state.cartslice.loading);
  const formmodal = useSelector((state) => state.globalslice.formmodal);
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const logindata = useSelector((state) => state.formslice.logindata);

  const [cartQuantities, setCartQuantities] = useState({});
  const debounceTimers = useRef({});
  const { isTablet, isMobile } = MediaQueries();

  useEffect(() => {
    pushToDataLayer("viewed_cart_page", currentcountry.name);
  }, [currentcountry.name]);

  useEffect(() => {
    if (cartlistdata?.data?.result?.length) {
      const initialQuantities = {};
      cartlistdata.data.result.forEach((item) => {
        initialQuantities[item.cart_id] = item.quantity;
      });
      setCartQuantities(initialQuantities);
    }
  }, [cartlistdata]);

  const handleQuantityChange = (cart_id, newQty) => {
    if (newQty < 1) return;

    setCartQuantities((prev) => ({ ...prev, [cart_id]: newQty }));
    dispatch(
      setpaymentmethodsdata({
        ...paymentmethodsdata,
        sub_total:
          currentcountry.currency +
          " " +
          CalculatePaymentDetails(cartlistdata, {
            ...cartQuantities,
            [cart_id]: newQty,
          }),
        final_total: CalculatePaymentDetails(cartlistdata, {
          ...cartQuantities,
          [cart_id]: newQty,
        }),
      })
    );

    if (debounceTimers.current[cart_id]) {
      clearTimeout(debounceTimers.current[cart_id]);
    }

    debounceTimers.current[cart_id] = setTimeout(() => {
      dispatch(changeCartQuantityapi({ cart_id, quantity: newQty }))
        .unwrap()
        .then(() => {
          const input_data = {
            ip_address:
              Cookies.get("jwt_token") !== undefined
                ? 0
                : Cookies.get("cart_ip_address"),
            user_id: logindata.user_id,
          };
          dispatch(cartlistWithoutLoaderapi(input_data));
          if (Cookies.get("jwt_token") !== undefined) {
            dispatch(GetPlaceOrderapi(logindata.user_id));
          }
        })
        .catch((err) => {});
    }, 500);
  };

  const removeproduct = async (cart_id) => {
    try {
      await dispatch(removeFromCartapi({ cart_id })).unwrap();

      const input_data = {
        ip_address:
          Cookies.get("jwt_token") !== undefined
            ? 0
            : Cookies.get("cart_ip_address"),
        user_id: logindata.user_id,
      };
      dispatch(cartlistWithoutLoaderapi(input_data));
      if (Cookies.get("jwt_token") !== undefined) {
        dispatch(GetPlaceOrderapi(logindata.user_id));
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (Cookies.get("jwt_token") !== undefined) {
      dispatch(GetPlaceOrderapi(logindata.user_id));
    }
  }, [dispatch, logindata.user_id]);

  const loginclick = () => {
    dispatch(setformmodal(!formmodal));
    dispatch(setformstatus(1));
  };

  return (
    <div className="mobile-marginbottom">
      {!loading ? (
        cartlistdata?.data?.result?.length > 0 ? (
          <Container fluid className="homepagecontainer">
            {/* <div className={`${isMobile ? "pt-1 pb-1" : "pt-3 pb-3"}`}>
              <Breadcomp />
            </div> */}

            <div className="Cart-titile">My cart</div>
            <Row>
              <Col lg={8}>
                {cartlistdata.data.result.map((ele) => (
                  <div className="Cartitem-maindiv" key={ele.cart_id}>
                    <div className="d-flex">
                      <Link
                        href={`/details/${ele.url}`}
                        className={"text-decoration-none"}
                      >
                        <img
                          src={ele.image}
                          className="cart-productimage"
                          alt="product"
                        />
                      </Link>
                      <div className="cartproduct-details">
                        <Link
                          href={`/details/${ele.url}`}
                          className={"text-decoration-none"}
                        >
                          <div>
                            <div className="cartproduct-title">{ele.name}</div>
                            <div className="cartproduct-price">
                              <span className="currencycode">
                                {currentcountry.currency}
                              </span>{" "}
                              {(
                                ele.single_price * cartQuantities[ele.cart_id]
                              ).toFixed(2)}
                            </div>
                          </div>
                        </Link>
                        {!isTablet && (
                          <div>
                            <div className="quantity-title">Qty</div>
                            <div className="d-flex justify-content-between">
                              <div className="cart-product-quantitybtn">
                                <FiMinus
                                  className="cursorpointer"
                                  onClick={() =>
                                    handleQuantityChange(
                                      ele.cart_id,
                                      cartQuantities[ele.cart_id] - 1
                                    )
                                  }
                                />
                                <div>{cartQuantities[ele.cart_id]}</div>
                                {
                                  <FiPlus
                                    className="cursorpointer"
                                    onClick={() =>
                                      handleQuantityChange(
                                        ele.cart_id,
                                        cartQuantities[ele.cart_id] + 1
                                      )
                                    }
                                  />
                                }
                              </div>
                              <div
                                className="cart-product-quantitybtn hoverbox-shadow"
                                onClick={() => removeproduct(ele.cart_id)}
                              >
                                <img src={deleteimg.src} alt="delete" />
                                <span className="cartremone">Remove</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {isTablet && (
                      <div className="d-flex mobileaddremov-buttons">
                        <div className="cart-product-quantitybtn me-2">
                          <FiMinus
                            className="cursorpointer"
                            onClick={() =>
                              handleQuantityChange(
                                ele.cart_id,
                                cartQuantities[ele.cart_id] - 1
                              )
                            }
                          />
                          <div>{cartQuantities[ele.cart_id]}</div>
                          {
                            <FiPlus
                              className="cursorpointer"
                              onClick={() =>
                                handleQuantityChange(
                                  ele.cart_id,
                                  cartQuantities[ele.cart_id] + 1
                                )
                              }
                            />
                          }
                        </div>
                        <div
                          className="cart-product-removebtn hoverbox-shadow"
                          onClick={() => removeproduct(ele.cart_id)}
                        >
                          <img src={deleteimg.src} alt="delete" />
                          <span className="cartremone">Remove</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </Col>
              <Col lg={4}>
                <div>
                  {authstatus ? (
                    <div className="pricedetails">
                      <Paymentdetails />
                    </div>
                  ) : (
                    <div>
                      {!isMobile && (
                        <>
                          <div className="payment-type">
                            <div className="payment-type-title">Subtotal</div>
                            <div className="payment-type-cost">
                              {currentcountry.currency}{" "}
                              {CalculatePaymentDetails(
                                cartlistdata,
                                cartQuantities
                              )}
                            </div>
                          </div>
                          <div className="payment-cost" onClick={loginclick}>
                            Login/Register
                          </div>
                        </>
                      )}
                      {isMobile && (
                        <div className=" mobile_version_cart_bottom">
                          <div className="mobile-payment-total">
                            <div className="payment-type">
                              <div className="payment-type-title">Subtotal</div>
                              <div className="payment-type-cost">
                                {currentcountry.currency}{" "}
                                {CalculatePaymentDetails(
                                  cartlistdata,
                                  cartQuantities
                                )}
                              </div>
                            </div>
                            <div className="payment-cost" onClick={loginclick}>
                              Login/Register
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </Container>
        ) : (
          <Nocart />
        )
      ) : (
        <Container fluid className="homepagecontainer">
          <Row className="mt-4">
            <Col lg={8}>
              {[1, 2, 3].map((ele) => (
                <div className="Cartitem-maindiv" key={ele}>
                  <div className="d-flex">
                    <div
                      className="placeholder_color"
                      style={{ width: "10%", height: 100, borderRadius: 8 }}
                    />
                    <div className="cartproduct-details">
                      <div>
                        <div className="cartproduct-title">
                          <div
                            className="placeholder_color"
                            style={{
                              width: "40%",
                              height: 10,
                              borderRadius: 8,
                            }}
                          />
                        </div>
                        <div className="cartproduct-price mt-3">
                          <span className="currencycode">
                            <div
                              className="placeholder_color"
                              style={{
                                width: "10%",
                                height: 10,
                                borderRadius: 8,
                              }}
                            />
                          </span>{" "}
                          <div
                            className="placeholder_color mt-3"
                            style={{
                              width: "10%",
                              height: 10,
                              borderRadius: 8,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Col>
            <Col lg={4}>
              <div>
                <div
                  className="placeholder_color mt-3 mb-3"
                  style={{ width: "100%", height: 200, borderRadius: 8 }}
                />
                <div
                  className="placeholder_color mt-3 mb-3"
                  style={{ width: "100%", height: 50, borderRadius: 8 }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
};

export default Cart;
