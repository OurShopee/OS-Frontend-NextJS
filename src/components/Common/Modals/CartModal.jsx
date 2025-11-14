"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/navigation";
import { useContent, useCurrentLanguage, useDynamicContent } from "@/hooks";

const CartModal = ({ show, onHide, productData, quantity, onBuyNow }) => {
  const cartlistdata = useSelector((state) => state.cartslice.cartlistdata);
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const [savedPrice, setSavedPrice] = useState(0);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const router = useRouter();
  const currentLanguage = useCurrentLanguage();
  
  // Content translations
  const youSaved = useContent("buttons.youSaved");
  const qty = useContent("buttons.qty");
  const continueShopping = useContent("buttons.continueShopping");
  const checkoutNow = useContent("buttons.checkoutNow");
  
  // Get localized product name
  const productName = useDynamicContent(productData, "name");

  useEffect(() => {
    const offData = productData?.old_price * (productData?.percentage / 100);
    setSavedPrice(offData ? offData.toFixed(2) : 0);
  }, [productData]);

  // Focus management for accessibility
  useEffect(() => {
    if (show) {
      // Trap focus in modal when opened
      const modal = document.querySelector('[role="dialog"]');
      const focusableElements = modal?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements?.length > 0) {
        focusableElements[0].focus();
      }
    }
  }, [show]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && show) {
        onHide();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [show, onHide]);

  if (!show) return null;

  return (
    <div className="pb-3 homepagecontainer max-w-full mx-auto px-4">
      <div
        className="modal-backdrop-custom"
        onClick={onHide}
        aria-hidden="true"
      ></div>
      <div className="modal-custom-wrapper">
        <div
          className="modal-custom-content"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-modal-title"
          aria-describedby="cart-modal-description"
          dir={currentLanguage === "ar" ? "rtl" : "ltr"}
        >
          <div className="modal-custom-body pb-4">
            <h2 id="cart-modal-title" className="sr-only">
              Item added to cart
            </h2>
            <div id="cart-modal-description" className="sr-only">
              Product details and options to continue shopping or checkout
            </div>

            <div className="cart-item gap-3">
              <div className="relative inline-block">
                <img
                  src={productData.image}
                  alt={`${productName} product image`}
                  className="cart-item-image"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
                <img
                  src="/assets/vector_icons/successfull.gif"
                  alt=""
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-5px",
                    width: "28px",
                    height: "28px",
                  }}
                />
              </div>

              <div className="cart-item-info">
                <span
                  className="item-name flex-1 font-medium block"
                  style={{ fontWeight: 500 }}
                >
                  {productName.split(" ").length > 12
                    ? productName.split(" ").slice(0, 12).join(" ") +
                      "..."
                    : productName}
                </span>

                <div
                  className="item-price font-semibold py-1"
                  style={{ fontFamily: "Outfit", fontSize: "16px" }}
                >
                  <div className="flex items-center">
                    {currentcountry?.currency == "AED" ? (
                      <img
                        src="/assets/feed/aed-icon.svg"
                        alt="AED"
                        className={`w-3 h-3 inline-block mix-blend-multiply ${currentLanguage === "ar" ? "ml-1" : "mr-1"}`}
                        style={{ color: "black" }}
                      />
                    ) : (
                      <span>{currentcountry?.currency}&nbsp;</span>
                    )}
                    <span className="" style={{ fontWeight: 600 }}>
                      {productData.display_price * quantity}&nbsp;
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                      <span
                        className="text-muted line-through flex items-center"
                        style={{
                          fontWeight: 400,
                          color: "#9EA5A8",
                          fontSize: "13px",
                        }}
                      >
                        {currentcountry?.currency == "AED" ? (
                          <>
                            <img
                              src="/assets/feed/aed-icon.svg"
                              alt="AED"
                              className={`w-3 h-3 inline-block mix-blend-multiply ${currentLanguage === "ar" ? "ml-1" : "mr-1"}`}
                              style={{ color: "#9EA5A8" }}
                            />
                            {Math.ceil(productData?.old_price * quantity)}
                          </>
                        ) : (
                          <>
                            <span className="text-[16px]">
                              {currentcountry?.currency}
                            </span>{" "}
                            {Math.ceil(productData?.old_price * quantity)}
                          </>
                        )}
                      </span>

                    {savedPrice > 0 && (
                      <div className="save-cartModal flex items-center justify-center px-2 gap-0">
                        <div className="py-2 flex items-center">
                        <span className={`${currentLanguage === "ar" ? "ml-2" : "mr-2" } badge-icon inline-flex items-center justify-center`}>
                        <img
                              src="/assets/vector_icons/Vector.png"
                              alt=""
                              aria-hidden="true"
                              width={13}
                              height={13}
                            />
                          </span>
                          <span
                            style={{
                              fontFamily: "Outfit",
                              fontSize: "12px",
                              fontWeight: "500",
                            }}
                          >
                            {youSaved}{" "}
                            <span
                              style={{
                                fontFamily: "Outfit",
                                fontSize: "12px",
                                fontWeight: "600",
                              }}
                            >
                              {currentcountry?.currency == "AED" ? (
                                <img
                                  src="/assets/feed/aed-icon.svg"
                                  alt="AED"
                                  className={`w-3 h-3 inline-block mix-blend-multiply ${currentLanguage === "ar" ? "ml-1" : "mr-1"}`}
                                  style={{ color: "black" }}
                                />
                              ) : (
                                <>{currentcountry.currency}{" "}</>
                              )}
                              {Math.ceil(savedPrice * quantity)}
                            </span>
                          </span>
                        </div>
                      </div> 
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className="item-qty border font-semibold rounded-full px-3 py-1"
                    style={{ fontFamily: "Outfit", fontSize: "10px" }}
                  >
                    {qty} {quantity} 
                  </div>
                  <span
                    className="text-green-600"
                    style={{ fontFamily: "Outfit" }}
                  ></span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={`modal-custom-footer flex gap-1 items-center ${
            currentLanguage === "ar" ? "flex-row-reverse" : ""
          }`}>
            <div className="w-1/2">
              <button
                className="w-full h-12 rounded-xl bg-white text-black font-semibold "
                onClick={onHide}
                style={{
                  fontFamily: "Outfit",
                  fontWeight: 600,
                  fontSize: "14px",
                  lineHeight: "140%",
                  border: "2px solid #ccc",
                  borderRadius: "12px",
                }}
              >
                {continueShopping}
              </button>
            </div>

            <div className="w-1/2">
              <button
                onClick={() => onBuyNow(productData.id, quantity)}
                className="w-full bg-[#5232C2] border-0 uppercase select-none relative inline-flex items-center justify-center h-12 rounded-xl font-medium text-white overflow-hidden hover:rotate-[-1deg] hover:shadow-[-4px_4px_0_#1c1c1c] transition-all ease-in-out"
                aria-label="Proceed to checkout with selected items"
              >
                <span
                  className="z-10 whitespace-nowrap font-semibold"
                  style={{ fontSize: "14px", fontFamily: "Outfit" }}
                >
                  {checkoutNow}
                </span>
                <div className="absolute inset-0 pointer-events-none flex gap-2 justify-center items-center shimmer-overlay">
                  <div className="h-20 w-10 bg-gradient-to-tr from-transparent to-[#8c70ff] opacity-60 skew-y-12"></div>
                  <div className="h-20 w-3 bg-gradient-to-tr from-transparent to-[#8c70ff] opacity-60 skew-y-12"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
