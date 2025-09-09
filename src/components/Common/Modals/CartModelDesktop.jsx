import { animate, motion } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Cookies from "js-cookie";
import deleteimg from "../../../images/Delete.png";
import { FiMinus, FiPlus } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { RiDiscountPercentFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  GetPlaceOrderapi,
  setpaymentmethodsdata,
} from "../../../redux/paymentslice";
import { CalculatePaymentDetails } from "../../utils/Cart";
import {
  cartlistWithoutLoaderapi,
  changeCartQuantityapi,
  removeFromCartapi,
} from "../../../redux/cartslice";
import { setformmodal, setformstatus } from "../../../redux/formslice";
import AlertModal from "../AlertModal";
import OdometerCounter from "../../OdometerCounter";

const CartModalDesktop = ({ show, onHide }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const debounceTimers = useRef({});
  const [cartQuantities, setCartQuantities] = useState({});
  const cartlistdata = useSelector((state) => state.cartslice.cartlistdata);
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const formmodal = useSelector((state) => state.globalslice.formmodal);
  const addresslistdata = useSelector(
    (state) => state.addresslice.addresslistdata
  );
  const paymentmethodsdata = useSelector(
    (state) => state.paymentslice.paymentmethodsdata
  );
  const logindata = useSelector((state) => state.formslice.logindata);

  const [showGif, setShowGif] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState({});
  const prevTotalSavings = useRef(0); // Track previous totalSavings

  const cartItems = useMemo(() => {
    const result = cartlistdata?.data?.result;
    return Array.isArray(result) ? result : [];
  }, [cartlistdata]);
  const totalSavings = useMemo(() => {
    const rawSavings = cartItems?.reduce((sum, item) => {
      const oldTotal = item.old_price * item.quantity;
      const currentTotal = item.single_price * item.quantity;
      return sum + (oldTotal - currentTotal);
    }, 0);
    return parseFloat(rawSavings.toFixed(2));
  }, [cartItems]);

  const totalOld = useMemo(() => {
    const rawSavings = cartItems.reduce((sum, item) => {
      const oldTotal = item.old_price * item.quantity;
      return sum + oldTotal;
    }, 0);
    return parseFloat(rawSavings.toFixed(2));
  }, [cartItems]);

  const [animatedValue, setAnimatedValue] = useState(0);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const start = Math.max(0, totalSavings - 5);
    const controls = animate(start, totalSavings, {
      duration: 1.5,
      onUpdate(value) {
        setAnimatedValue(value);

        // Only show GIF if savings increased
        if (
          Math.abs(value - totalSavings) < 0.01 &&
          totalSavings > prevTotalSavings.current
        ) {
          setShowGif(true);
          setTimeout(() => setShowGif(false), 2000);
          prevTotalSavings.current = totalSavings;
        } else if (Math.abs(value - totalSavings) < 0.01) {
          prevTotalSavings.current = totalSavings;
        }
      },
    });

    return () => controls.stop();
  }, [totalSavings]);

  useEffect(() => {
    const rounded = parseFloat(animatedValue.toFixed(2));
    setDisplayValue(rounded);
  }, [animatedValue]);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show]);

  useEffect(() => {
    if (cartlistdata?.data?.result?.length) {
      const initialQuantities = {};
      cartlistdata.data.result.forEach((item) => {
        initialQuantities[item.cart_id] = item.quantity;
      });
      setCartQuantities(initialQuantities);
    } else {
      onHide();
    }
  }, [cartlistdata]);

  const handleQuantityChange = (cart_id, newQty) => {
    if (
      cartlistdata.data.result.find((ele) => ele.cart_id === cart_id)
        .available_quantity < newQty
    ) {
      toast.warning("You've reached the maximum quantity available");
      return;
    }
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

  const openAlertModel = (item) => {
    setDeletingProduct(item);
    setShowAlert(true);
  };

  const removeproduct = async (cart_id) => {
    try {
      await dispatch(removeFromCartapi({ cart_id })).unwrap();
      setShowAlert(false);
      setDeletingProduct({});
      const input_data = {
        ip_address:
          Cookies.get("jwt_token") !== undefined
            ? 0
            : Cookies.get("cart_ip_address"),
        user_id: logindata.user_id,
      };
      dispatch(cartlistWithoutLoaderapi(input_data));
      if (Cookies.get("jwt_token")) {
        dispatch(GetPlaceOrderapi(logindata.user_id));
      }
    } catch (error) {}
  };

  const handleCheckoutNow = () => {
    if (!Cookies.get("jwt_token")) {
      dispatch(setformmodal(!formmodal));
      dispatch(setformstatus(1));
    } else {
      if (addresslistdata?.data?.length > 0) {
        navigate("/Payment");
      } else {
        navigate("/deliveryaddress");
      }
    }
  };

  const navigateToProduct = (url, sku) => {
    navigate(`/details/${url}/${sku}`);
    onHide();
  };

  if (!show) return null;
  return (
    <>
      {show && <div className="modal-backdrop-custom" onClick={onHide}></div>}
      <div
        className={`modal-custom-wrapper-desktop fixed top-0 right-0 h-screen w-[25vw] z-[1050] ${
          show ? "modal-slide-in" : "modal-slide-out"
        }`}
      >
        <div className="flex flex-col h-full bg-white rounded-l-xl">
          <div className="flex-1 overflow-y-auto py-4 pt-0 px-4">
            <div className="sticky py-4 top-0 z-20 bg-white border-b flex justify-between items-center select-none">
              <h5 className="flex items-center gap-1 text-[#43494B] mb-0">
                <span className="font-[700] text-[24px]">In Cart</span>{" "}
                <span className="text-[19px] font-[600]">
                  ({cartItems.length})
                </span>
              </h5>
              <IoClose
                onClick={onHide}
                className="text-3xl cursor-pointer text-[#43494B]"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-0">
              {cartItems.length > 0 ? (
                cartItems.map((item, i) => (
                  <React.Fragment key={i}>
                    <div className="flex items-center gap-3">
                      <img
                        onClick={() => navigateToProduct(item.url, item.sku)}
                        src={item.image}
                        alt={item.name}
                        className="cursor-pointer object-contain w-[25%] h-max"
                      />
                      <div className="cart-item-info">
                        <span
                          onClick={() => navigateToProduct(item.url, item.sku)}
                          className="cursor-pointer item-name fw-semibold flex-1"
                        >
                          {item.name.split(" ").length > 15
                            ? item.name.split(" ").slice(0, 15).join(" ") +
                              "..."
                            : item.name}
                        </span>
                        <div className="d-flex justify-content-between my-2 select-none">
                          <div className="flex items-center justify-center border rounded-lg gap-3 !p-1">
                            {cartQuantities[item.cart_id] === 1 ? (
                              <img
                                src={deleteimg}
                                alt="delete"
                                className="cursor-pointer"
                                onClick={() => openAlertModel(item)}
                              />
                            ) : (
                              <FiMinus
                                className="cursor-pointer"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.cart_id,
                                    cartQuantities[item.cart_id] - 1
                                  )
                                }
                              />
                            )}

                            <div>{cartQuantities[item.cart_id]}</div>

                            <FiPlus
                              className="cursor-pointer"
                              onClick={() =>
                                handleQuantityChange(
                                  item.cart_id,
                                  cartQuantities[item.cart_id] + 1
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="text-lg font-semibold">
                          <span>
                            {currentcountry?.currency}{" "}
                            {(item.single_price * item.quantity).toFixed(2)}
                          </span>

                          <span className="text-sm font-semibold mx-1 text-[#33B056]">
                            {item.percentage}% OFF
                          </span>
                          <div className="text-sm line-through text-[#9EA5A8]">
                            AED {(item.old_price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                    {i !== cartItems.length - 1 && (
                      <div className="border-gray my-6 "></div>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <div className="text-center py-4">Your cart is empty.</div>
              )}
            </div>
          </div>

          <div className="pb-4 shadow-[0_-4px_20px_-1px_rgba(0,0,0,0.1)] relative">
            <div className="flex justify-between items-center p-4 bg-white font-semibold">
              <p className="mb-0 capitalize">total cart value</p>
              <div className="flex items-center gap-1">
                <p className="mb-0 text-sm line-through text-[#9EA5A8]">
                  AED {totalOld}
                </p>
                <p className="mb-0">{cartlistdata?.data?.grand_total}</p>
              </div>
            </div>
            <div
              style={{
                backgroundImage:
                  "url('/assets/vector_icons/cart_sidebar_wave.svg')",
              }}
              className="relative select-none flex justify-between px-4 text-[#33B056] items-center bg-no-repeat bg-cover bg-top w-full h-16 overflow-hidden"
            >
              <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-b from-transparent to-white/80"></div>
              <div className="flex items-center gap-1">
                <RiDiscountPercentFill className="text-2xl" />
                <p className="mb-0 font-semibold capitalize">
                  Your total savings
                </p>
              </div>
              <div className="font-semibold text-lg flex items-center gap-1 h-6">
                <span className="text-[1.125rem] text-lg">
                  {currentcountry?.currency}
                </span>
                <OdometerCounter
                  value={totalSavings}
                  duration={1500}
                  format="(ddd)"
                />
              </div>
            </div>

            <div className="px-4">
              <button
                onClick={() => handleCheckoutNow()}
                className="hover:text-lg bg-[#5232C2] border-none select-none mt-3 w-full relative inline-flex items-center justify-center h-12 px-6 rounded-xl font-medium text-white overflow-hidden hover:rotate-[-1deg] hover:shadow-[-4px_4px_0_#1c1c1c] transition-all ease-in-out"
              >
                <span className="z-10 uppercase font-semibold">
                  Checkout now
                </span>
                <div className="absolute inset-0 pointer-events-none flex gap-2 justify-center items-center shimmer-overlay">
                  <div className="h-20 w-10 bg-gradient-to-tr from-transparent to-[#8c70ff] opacity-60 skew-y-12"></div>
                  <div className="h-20 w-3 bg-gradient-to-tr from-transparent to-[#8c70ff] opacity-60 skew-y-12"></div>
                </div>
              </button>
            </div>
            {showGif && (
              <img
                className="absolute inset-0 w-full h-full object-contain bottom-0"
                src="/assets/animation.gif"
                alt="animation"
              />
            )}
          </div>
        </div>
      </div>
      <AlertModal
        show={showAlert}
        setShow={setShowAlert}
        title="Remove Item"
        message="Are you sure you want to remove this item from the cart?"
        action={removeproduct}
        product={deletingProduct}
      />
    </>
  );
};

export default CartModalDesktop;
