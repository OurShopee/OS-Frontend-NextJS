"use client";
import { animate, motion } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Cookies from "js-cookie";
import deleteimg from "@/images/Delete.png";
import { FiMinus, FiPlus } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { RiDiscountPercentFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  GetPlaceOrderapi,
  setpaymentmethodsdata,
} from "@/redux/paymentslice";
import { CalculatePaymentDetails } from "@/components/utils/Cart";
import {
  cartlistWithoutLoaderapi,
  changeCartQuantityapi,
  removeFromCartapi,
} from "@/redux/cartslice";
import { setformmodal, setformstatus } from "@/redux/formslice";
import AlertModal from "../AlertModal";
import OdometerCounter from "@/components/OdometerCounter";
import { getDynamicContent, useContent, useCurrentLanguage } from "@/hooks";

// Custom NavLink component for Next.js App Router
const NavLink = ({ to, children, className, onClick, ...props }) => {
  const pathname = usePathname();
  const isActive = pathname === to;

  return (
    <Link href={to} {...props}>
      <span
        className={`${className} ${isActive ? "active" : ""}`}
        onClick={onClick}
      >
        {children}
      </span>
    </Link>
  );
};

const CartModalDesktop = ({ show, onHide }) => {
  const currentLanguage = useCurrentLanguage();
  const removeItem = useContent("buttons.removeItem");
  const removeItemDescription = useContent("buttons.removeItemDescription");
  const inCart = useContent("product.inCart");
  const yourCartIsEmpty = useContent("product.yourCartIsEmpty");
  const totalCartValue = useContent("product.totalCartValue");
  const yourTotalSavings = useContent("product.yourTotalSavings");
  const checkoutNow = useContent("buttons.checkoutNow");
  const off = useContent("product.off");
  const dispatch = useDispatch();
  const router = useRouter();
  const debounceTimers = useRef({});
  const modalRef = useRef(null);
  const previouslyFocusedElement = useRef(null);
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
  const prevTotalSavings = useRef(0);

  const cartItems = useMemo(() => {
    const result = cartlistdata?.data?.result;
    if (!Array.isArray(result)) return [];

    return result.map((item) => ({
      ...item,
      localizedName: getDynamicContent(item, "name", currentLanguage),
    }));
  }, [cartlistdata, currentLanguage]);

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

  // Focus management and accessibility
  useEffect(() => {
    if (show) {
      // Save previous focus and prevent body scroll
      previouslyFocusedElement.current = document.activeElement;
      document.body.style.overflow = "hidden";

      // Focus modal after it renders
      const timer = setTimeout(() => {
        modalRef.current?.focus();
      }, 100);

      // Handle keyboard events for accessibility
      const handleKeydown = (e) => {
        if (e.key === "Escape") {
          onHide();
          return;
        }

        if (e.key === "Tab") {
          const focusableElements = modalRef.current?.querySelectorAll(
            'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements && focusableElements.length > 0) {
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
              if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
              }
            } else {
              if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
              }
            }
          }
        }
      };

      document.addEventListener("keydown", handleKeydown);

      return () => {
        clearTimeout(timer);
        document.removeEventListener("keydown", handleKeydown);
      };
    } else {
      // Restore focus and body scroll
      document.body.style.overflow = "auto";
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    }
  }, [show, onHide]);

  useEffect(() => {
    const start = Math.max(0, totalSavings - 5);
    const controls = animate(start, totalSavings, {
      duration: 1.5,
      onUpdate(value) {
        setAnimatedValue(value);

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
    if (cartlistdata?.data?.result?.length) {
      const initialQuantities = {};
      cartlistdata.data.result.forEach((item) => {
        initialQuantities[item.cart_id] = item.quantity;
      });
      setCartQuantities(initialQuantities);
    } else if (cartlistdata?.data?.result?.length === 0 && show && Object.keys(cartQuantities).length > 0) {
      // Only auto-hide if cart becomes empty after previously having items
      // This prevents closing on initial open when cart is being populated
      onHide();
    }
  }, [cartlistdata, onHide, show]);

  const handleQuantityChange = (cart_id, newQty) => {
    // if (
    //   cartlistdata.data.result.find((ele) => ele.cart_id === cart_id)
    //     .available_quantity < newQty
    // ) {
    //   toast.warning("You've reached the maximum quantity available");
    //   return;
    // }
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
        router.push("/Payment");
      } else {
        router.push("/deliveryaddress");
      }
    }
  };

  const navigateToProduct = (url, sku) => {
    router.push(`/details/${url}/${sku}`);
    onHide();
  };

  if (!show) return null;

  return (
    <>
      {show && (
        <div
          className="modal-backdrop-custom fixed inset-0 bg-black bg-opacity-50 z-[999]"
          onClick={onHide}
          aria-hidden="true"
        />
      )}
      <div
        className={`modal-custom-wrapper-desktop fixed top-0 ${
          currentLanguage === "ar" ? "" : "right-0"
        } h-screen w-[25vw] z-[1000] ${
          show
            ? currentLanguage === "ar"
              ? "modal-slide-in-rtl"
              : "modal-slide-in"
            : currentLanguage === "ar"
            ? "modal-slide-out-rtl"
            : "modal-slide-out"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-modal-title"
        aria-describedby="cart-modal-description"
        ref={modalRef}
        tabIndex={-1}
        dir={currentLanguage === "ar" ? "rtl" : "ltr"}
      >
        <div
          className={`flex flex-col h-full bg-white ${
            currentLanguage === "ar" ? "rounded-r-xl" : "rounded-l-xl"
          }`}
        >
          <div className="flex-1 overflow-y-auto py-4 pt-0 px-4">
            <div className="sticky py-4 top-0 z-20 bg-white border-b flex justify-between items-center select-none">
              <h2
                id="cart-modal-title"
                className="flex items-center gap-1 text-[#43494B] mb-0"
              >
                <span className="font-[700] text-[24px]">{inCart}</span>
                <span className="text-[19px] font-[600]">
                  ({cartItems.length})
                </span>
              </h2>
              <button
                onClick={onHide}
                className="text-3xl cursor-pointer text-[#43494B] hover:text-gray-600 transition-colors bg-transparent border-0 p-1 rounded"
                aria-label="Close cart"
                type="button"
              >
                <IoClose />
              </button>
            </div>

            <div
              className="flex-1 overflow-y-auto p-0"
              id="cart-modal-description"
              aria-label="Shopping cart items"
            >
              {cartItems.length > 0 ? (
                cartItems.map((item, i) => {
                  const displayName = item.localizedName || item.name || "";
                  return (
                    <React.Fragment key={i}>
                    <article className="flex items-center gap-3 py-2">
                      <button
                        onClick={() => navigateToProduct(item.url, item.sku)}
                        className="cursor-pointer object-contain w-[25%] h-max bg-transparent border-0 p-0"
                          aria-label={`View ${displayName} details`}
                        type="button"
                      >
                        <img
                          src={item.image}
                            alt={`${displayName} product image`}
                          className="w-full h-full object-contain"
                        />
                      </button>

                      <div className="cart-item-info flex-1">
                        <button
                          onClick={() => navigateToProduct(item.url, item.sku)}
                          className="cursor-pointer item-name font-semibold flex-1 text-left bg-transparent border-0 p-0"
                          type="button"
                        >
                          {displayName.split(" ").length > 15
                            ? displayName.split(" ").slice(0, 15).join(" ") +
                              "..."
                            : displayName}
                        </button>

                        <div className="flex justify-between my-2 select-none">
                          <div
                            className="flex items-center justify-center border rounded-lg gap-3 p-1"
                            role="group"
                            aria-label={`Quantity controls for ${displayName}`}
                          >
                            {cartQuantities[item.cart_id] === 1 ? (
                              <button
                                onClick={() => openAlertModel(item)}
                                className="cursor-pointer bg-transparent border-0 p-1 hover:bg-red-100 rounded transition-colors"
                                aria-label={`Remove ${displayName} from cart`}
                                type="button"
                              >
                                <img
                                  src={deleteimg.src}
                                  alt=""
                                  aria-hidden="true"
                                />
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.cart_id,
                                    cartQuantities[item.cart_id] - 1
                                  )
                                }
                                className="cursor-pointer bg-transparent border-0 p-1 hover:bg-gray-100 rounded transition-colors"
                                aria-label={`Decrease quantity of ${displayName}`}
                                type="button"
                              >
                                <FiMinus />
                              </button>
                            )}

                            <span
                              className="min-w-[40px] text-center"
                              aria-live="polite"
                              aria-label={`Current quantity: ${
                                cartQuantities[item.cart_id]
                              }`}
                            >
                              {cartQuantities[item.cart_id]}
                            </span>

                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.cart_id,
                                  cartQuantities[item.cart_id] + 1
                                )
                              }
                              className="cursor-pointer bg-transparent border-0 p-1 hover:bg-gray-100 rounded transition-colors"
                              aria-label={`Increase quantity of ${displayName}`}
                              type="button"
                            >
                              <FiPlus />
                            </button>
                          </div>
                        </div>

                        <div className={`text-lg font-semibold flex flex-col gap-1`}>
                          <div className={`flex items-center gap-1`}>
                            <span
                              aria-label={`Current price: ${
                                currentcountry?.currency
                              } ${(item.single_price * item.quantity).toFixed(
                                2
                              )}`}
                              className={`flex gap-1 items-center ${currentLanguage === "ar" ? "flex-row-reverse" : ""}`}
                            >
                              {currentcountry?.currency == "AED" ? (
                                <img
                                  src="/assets/feed/aed-icon.svg"
                                  alt="AED"
                                  className={`w-4 h-4 inline-block mix-blend-multiply`}
                                  style={{ color: "black" }}
                                />
                              ) : (
                                <>{currentcountry?.currency}{" "}</>
                              )}
                              {(item.single_price * item.quantity).toFixed(2)}
                            </span>

                            <span className="text-sm font-semibold text-[#33B056]">
                              {currentLanguage === "ar" ? (
                                <>
                                   {item.percentage}% {off}
                                </>
                              ) : (
                                <>
                                  {item.percentage}% {off}
                                </>
                              )}
                            </span>
                          </div>
                          <div className={`text-sm line-through text-[#9EA5A8] ${currentLanguage === "ar" ? "text-right" : "text-left"}`}>
                            <span
                              aria-label={`Original price: ${currentcountry?.currency} ${(
                                item.old_price * item.quantity
                              ).toFixed(2)}`}
                              className={`flex items-center ${currentLanguage === "ar" ? "flex-row-reverse justify-end" : ""}`}
                            >
                              {currentcountry?.currency == "AED" ? (
                                <>
                                  <img
                                    src="/assets/feed/aed-icon.svg"
                                    alt="AED"
                                    className={`w-3.5 w-3.5 inline-block mix-blend-multiply ${currentLanguage === "ar" ? "ml-1" : "mr-1"}`}
                                    style={{ color: "black" }}
                                  />
                                  {(item.old_price * item.quantity).toFixed(2)}
                                </>
                              ) : (
                                <>{currentcountry?.currency} {(item.old_price * item.quantity).toFixed(2)}</>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                    {i !== cartItems.length - 1 && (
                      <hr className="border-gray my-6" />
                    )}
                    </React.Fragment>
                  );
                })
              ) : (
                <div className="text-center py-4" role="status">
                  {yourCartIsEmpty}
                </div>
              )}
            </div>
          </div>

          <div className="pb-4 shadow-[0_-4px_20px_-1px_rgba(0,0,0,0.1)] relative">
            <div className="flex justify-between items-center p-4 bg-white font-semibold">
              <p className="mb-0 capitalize">{totalCartValue}</p>
              <div className="flex items-center gap-1">
                <p className="mb-0 text-sm line-through text-[#9EA5A8]">
                  <span aria-label={`Original total: ${currentcountry?.currency} ${totalOld}`} className="flex items-center">
                    {currentcountry?.currency == "AED" ? (
                      <span className={`flex items-center gap-0.5 ${currentLanguage === "ar" ? "flex-row-reverse" : ""}`}>
                        <img
                          src="/assets/feed/aed-icon.svg"
                          alt="AED"
                          className={`w-3.5 h-3.5 inline-block mix-blend-multiply`}
                          style={{ color: "black" }}
                        />
                        {totalOld}
                      </span>
                    ) : (
                      <>{currentcountry?.currency} {totalOld}</>
                    )}
                  </span>
                </p>
                <p
                  className="mb-0"
                  aria-label={`Current total: ${cartlistdata?.data?.grand_total}`}
                >
                  {cartlistdata?.data?.grand_total}
                </p>
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
                <RiDiscountPercentFill
                  className="text-2xl"
                  aria-hidden="true"
                />
                <p className="mb-0 font-semibold capitalize">
                  {yourTotalSavings}
                </p>
              </div>
              <div className={`font-semibold text-lg flex items-center gap-1 h-6 ${currentLanguage === "ar" ? "flex-row-reverse" : ""}`}>
                {currentcountry?.currency == "AED" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17.39" viewBox="0 1.3 21 17.39">
                  <g id="surface1">
                  <path style={{ stroke: "none", fillRule: "nonzero", fill: "rgb(51, 176, 86)", fillOpacity: 1 }} d="M 1.765625 1.320312 C 1.773438 1.332031 1.816406 1.386719 1.859375 1.4375 C 2.164062 1.800781 2.394531 2.394531 2.519531 3.140625 C 2.601562 3.628906 2.605469 3.785156 2.605469 5.652344 L 2.605469 7.390625 L 1.769531 7.390625 C 1.007812 7.390625 0.917969 7.386719 0.769531 7.359375 C 0.53125 7.308594 0.289062 7.175781 0.125 7.003906 C -0.0078125 6.863281 -0.00390625 6.855469 0.0078125 7.273438 C 0.015625 7.621094 0.0195312 7.65625 0.0703125 7.847656 C 0.148438 8.144531 0.261719 8.367188 0.425781 8.5625 C 0.652344 8.835938 0.882812 8.988281 1.210938 9.089844 C 1.28125 9.109375 1.429688 9.117188 1.953125 9.121094 L 2.605469 9.132812 L 2.605469 10.867188 L 1.683594 10.859375 L 0.757812 10.855469 L 0.597656 10.789062 C 0.40625 10.714844 0.320312 10.65625 0.136719 10.492188 L 0 10.371094 L 0.0078125 10.753906 C 0.0195312 11.105469 0.0195312 11.144531 0.0703125 11.324219 C 0.242188 11.960938 0.664062 12.414062 1.21875 12.5625 C 1.355469 12.601562 1.410156 12.605469 1.988281 12.613281 L 2.605469 12.621094 L 2.605469 14.410156 C 2.605469 15.492188 2.601562 16.292969 2.589844 16.429688 C 2.578125 16.550781 2.546875 16.785156 2.519531 16.945312 C 2.390625 17.691406 2.15625 18.253906 1.820312 18.617188 L 1.753906 18.691406 L 5.132812 18.691406 C 7.15625 18.691406 8.667969 18.683594 8.890625 18.675781 C 9.28125 18.652344 10.148438 18.566406 10.347656 18.527344 C 10.40625 18.515625 10.523438 18.496094 10.601562 18.484375 C 10.761719 18.460938 11.03125 18.402344 11.414062 18.304688 C 11.960938 18.171875 12.457031 18 12.941406 17.785156 C 13.09375 17.714844 13.53125 17.492188 13.644531 17.425781 C 13.707031 17.386719 13.78125 17.34375 13.808594 17.328125 C 13.886719 17.289062 14.019531 17.203125 14.207031 17.066406 C 14.300781 17 14.394531 16.933594 14.414062 16.921875 C 14.5 16.863281 14.789062 16.621094 14.921875 16.5 C 15.425781 16.039062 15.84375 15.523438 16.171875 14.972656 C 16.214844 14.894531 16.277344 14.792969 16.300781 14.753906 C 16.367188 14.640625 16.640625 14.078125 16.664062 13.996094 C 16.679688 13.957031 16.695312 13.917969 16.703125 13.910156 C 16.753906 13.84375 17.054688 12.898438 17.089844 12.691406 C 17.101562 12.625 17.109375 12.617188 17.15625 12.605469 C 17.191406 12.601562 17.65625 12.601562 18.195312 12.605469 C 19.269531 12.613281 19.269531 12.613281 19.507812 12.722656 C 19.640625 12.785156 19.683594 12.8125 19.828125 12.945312 C 20.023438 13.121094 20.007812 13.148438 19.992188 12.710938 C 19.984375 12.457031 19.976562 12.296875 19.957031 12.234375 C 19.890625 11.988281 19.875 11.9375 19.8125 11.8125 C 19.617188 11.382812 19.289062 11.078125 18.871094 10.933594 L 18.707031 10.871094 L 17.371094 10.855469 L 17.378906 10.621094 C 17.386719 10.3125 17.386719 9.703125 17.378906 9.386719 L 17.371094 9.136719 L 18.261719 9.132812 C 19.027344 9.128906 19.167969 9.132812 19.253906 9.152344 C 19.503906 9.222656 19.675781 9.320312 19.882812 9.511719 L 19.996094 9.617188 L 19.996094 9.320312 C 19.996094 8.96875 19.980469 8.8125 19.90625 8.582031 C 19.765625 8.113281 19.484375 7.761719 19.085938 7.546875 C 18.824219 7.40625 18.808594 7.402344 17.914062 7.394531 C 17.390625 7.390625 17.117188 7.382812 17.105469 7.371094 C 17.09375 7.359375 17.082031 7.339844 17.082031 7.324219 C 17.082031 7.308594 17.050781 7.183594 17.011719 7.046875 C 16.542969 5.390625 15.671875 4.078125 14.390625 3.105469 C 14.21875 2.96875 13.792969 2.6875 13.621094 2.59375 C 13.554688 2.554688 13.480469 2.515625 13.464844 2.503906 C 13.378906 2.457031 12.898438 2.21875 12.777344 2.171875 C 12.707031 2.136719 12.613281 2.097656 12.570312 2.082031 C 11.863281 1.777344 10.679688 1.484375 9.777344 1.394531 C 9.628906 1.382812 9.433594 1.359375 9.34375 1.351562 C 8.933594 1.304688 8.367188 1.300781 5.152344 1.300781 C 2.4375 1.300781 1.757812 1.304688 1.765625 1.320312 Z M 8.378906 2.1875 C 9.054688 2.226562 9.472656 2.277344 9.957031 2.394531 C 11.441406 2.746094 12.484375 3.492188 13.242188 4.734375 C 13.3125 4.851562 13.609375 5.457031 13.652344 5.578125 C 13.863281 6.144531 13.964844 6.480469 14.054688 6.925781 C 14.078125 7.03125 14.109375 7.175781 14.121094 7.242188 C 14.136719 7.308594 14.140625 7.371094 14.136719 7.378906 C 14.125 7.386719 12.117188 7.390625 9.671875 7.386719 L 5.21875 7.382812 L 5.214844 4.8125 C 5.210938 3.402344 5.214844 2.226562 5.21875 2.207031 L 5.226562 2.167969 L 6.648438 2.167969 C 7.429688 2.167969 8.210938 2.175781 8.378906 2.1875 Z M 14.328125 9.191406 C 14.34375 9.277344 14.34375 10.738281 14.328125 10.808594 L 14.316406 10.863281 L 9.769531 10.859375 L 5.21875 10.855469 L 5.214844 10.007812 C 5.210938 9.539062 5.214844 9.152344 5.21875 9.144531 C 5.226562 9.132812 7.164062 9.128906 9.773438 9.128906 L 14.316406 9.128906 Z M 14.125 12.625 C 14.136719 12.65625 14.089844 12.902344 13.988281 13.300781 C 13.878906 13.753906 13.726562 14.207031 13.570312 14.542969 C 13.496094 14.714844 13.304688 15.085938 13.261719 15.15625 C 13.238281 15.1875 13.175781 15.289062 13.117188 15.378906 C 12.757812 15.945312 12.242188 16.457031 11.65625 16.839844 C 11.445312 16.972656 11.003906 17.207031 10.886719 17.242188 C 10.863281 17.246094 10.835938 17.261719 10.824219 17.269531 C 10.8125 17.28125 10.628906 17.347656 10.417969 17.425781 C 10.027344 17.5625 9.285156 17.710938 8.691406 17.773438 C 8.304688 17.8125 8.242188 17.8125 6.757812 17.8125 L 5.21875 17.8125 L 5.21875 12.625 L 9.636719 12.617188 C 12.066406 12.613281 14.066406 12.605469 14.085938 12.601562 C 14.101562 12.601562 14.121094 12.613281 14.125 12.625 Z M 14.125 12.625 ">
                    </path>
                  </g>
                </svg>
                
                ) : (
                  <span className="text-[1.125rem] text-lg">
                    {currentcountry?.currency}
                  </span>
                )}
                <span
                  aria-live="polite"
                  aria-label={`Total savings: ${currentcountry?.currency} ${totalSavings}`}
                  dir="ltr"
                  style={{ display: "inline-block" }}
                >
                  <OdometerCounter
                    value={totalSavings}
                    duration={1500}
                    format="(ddd)"
                  />
                </span>
              </div>
            </div>

            <div className="px-4">
              <button
                onClick={() => handleCheckoutNow()}
                className="hover:text-lg bg-[#5232C2] border-0 select-none mt-3 w-full relative inline-flex items-center justify-center h-12 px-6 rounded-xl font-medium text-white overflow-hidden hover:rotate-[-1deg] hover:shadow-[-4px_4px_0_#1c1c1c] transition-all ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-300"
                aria-label="Proceed to checkout with current cart items"
                type="button"
              >
                <span className="z-10 uppercase font-semibold">
                  {checkoutNow}
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
                alt=""
                aria-hidden="true"
              />
            )}
          </div>
        </div>
      </div>

      <AlertModal
        show={showAlert}
        setShow={setShowAlert}
        title={removeItem}
        message={removeItemDescription}
        action={removeproduct}
        product={deletingProduct}
      />
    </>
  );
};

export default CartModalDesktop;
