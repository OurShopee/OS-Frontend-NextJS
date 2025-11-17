"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { IoClose } from "react-icons/io5";
import Modal from "./Modal";
import { useContent, useCurrentLanguage } from "@/hooks";
import { useDispatch, useSelector } from "react-redux";
import { AiFillLike } from "react-icons/ai";
const CouponModal = ({
  show,
  onHide,
  coupons = [],
  onApplyCoupon,
  inputFieldRef,
  cartTotal = null,
}) => {
  const [enteredCode, setEnteredCode] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isSuccessCardReady, setIsSuccessCardReady] = useState(false);
  const [successModalAnimKey, setSuccessModalAnimKey] = useState(0);
  const [applyError, setApplyError] = useState("");
  const [showGif, setShowGif] = useState(false);

  const currentLanguage = useCurrentLanguage();
  const isRTL = currentLanguage === "ar";
  const dispatch = useDispatch();
  const successCardRef = useRef(null);
  const autoCloseTimerRef = useRef(null);
  const isAnimatingSuccessRef = useRef(false);

  const currentCountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const appliedCouponState = useSelector(
    (state) => state.paymentslice.coupon
  );

  // Content
  const availableCouponsText = useContent("checkout.availableCoupons");
  const enterCouponPlaceholder = useContent("checkout.enterCouponCode");
  const applyButtonText = useContent("buttons.apply");
  const bestCouponsForYou = "Best Coupons For You";
  const moreCoupons = "More Coupons";
  const allCaughtUp = "You're all caught up!";

  // Separate coupons
  const recommendedCoupons =
    coupons?.filter((coupon) => coupon.isRecommended === "true") || [];
  const otherCoupons =
    coupons?.filter((coupon) => coupon.isRecommended === "false") || [];

  const getCouponCode = (coupon) => {
    if (typeof coupon === "string") return coupon;
    return (
      coupon?.promo_code ||
      coupon?.code ||
      coupon?.couponCode ||
      coupon?.coupon ||
      ""
    );
  };

  const locale = currentLanguage === "ar" ? "ar-AE" : "en-AE";

  const parseNumericAmount = (value) => {
    if (value === null || value === undefined || value === "") return null;
    const numericValue = Number(String(value).replace(/[^\d.-]/g, ""));
    return Number.isNaN(numericValue) ? null : numericValue;
  };

  const formatNumberForLocale = (value) => {
    if (value === null) return null;
    try {
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    } catch (error) {
      return value;
    }
  };

  const renderCurrencyAmount = (
    amount,
    { wrapperClassName = "", valueClassName = "", indicatorClassName } = {}
  ) => {
    const parsed = parseNumericAmount(amount);
    if (parsed === null) return "—";
    const formatted = formatNumberForLocale(parsed);

    const directionalMargin = currentLanguage === "ar" ? "ml-1" : "mr-1";
    const appliedIndicatorClass =
      indicatorClassName !== undefined ? indicatorClassName : directionalMargin;

    const countryCurrency = currentCountry?.currency || "AED";
    const isAED = countryCurrency.toUpperCase() === "AED";

    const indicator = isAED ? (
      <img
        src="/assets/feed/aed-icon.svg"
        alt="AED"
        className={`w-4 h-4 inline-block mix-blend-multiply ${appliedIndicatorClass}`}
        style={{ color: "black" }}
      />
    ) : (
      <span className={`currencycode ${appliedIndicatorClass}`}>
        {countryCurrency}
      </span>
    );

    return (
      <span className={`inline-flex items-center gap-1 ${wrapperClassName}`}>
        {indicator}
        <span className={valueClassName}>{formatted}</span>
      </span>
    );
  };

  const getSavingsAmount = (coupon) => {
    if (!coupon || typeof coupon === "string") return null;
    return (
      coupon?.discount_amount ||
      coupon?.discount_value ||
      coupon?.discount ||
      coupon?.value ||
      coupon?.saving_amount ||
      coupon?.amount_saved ||
      null
    );
  };

  const savingsAmount =
    appliedCouponState?.discount ?? getSavingsAmount(appliedCoupon);
  const savingsDisplay = renderCurrencyAmount(savingsAmount, {
    valueClassName: "font-semibold text-[#32A928]",
  });

  const findCouponByCode = (code) => {
    if (!code) return null;
    return coupons?.find(
      (coupon) => getCouponCode(coupon)?.toLowerCase() === code.toLowerCase()
    );
  };

  const isCouponExpired = (coupon) => {
    const expiryDateStr =
      coupon?.enddate ||
      coupon?.valid_until ||
      coupon?.valid_until_date ||
      coupon?.expiry_date;
    if (!expiryDateStr) return false;
    const expiryDate = new Date(expiryDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return expiryDate < today;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleApplyCoupon = async (coupon, couponId, overrideCode) => {
    const couponCode = overrideCode || getCouponCode(coupon);
    if (!couponCode || !onApplyCoupon) return;

    try {
      const result = await onApplyCoupon(couponCode);
      const normalizedStatus = result?.status?.toLowerCase();
      const isFailure =
        normalizedStatus === "faliure" || normalizedStatus === "failure";
      if (isFailure) {
        setApplyError(result?.message || "Invalid coupon");
        return;
      }

      setApplyError("");
      setAppliedCoupon(coupon);

      // Close list modal & show success modal
      handleModalClose();
      requestAnimationFrame(() => {
        setShowSuccessModal(true);
        setIsSuccessCardReady(false);
        setSuccessModalAnimKey((prev) => prev + 1);
        setShowGif(true);
        setTimeout(() => setShowGif(false), 1000);
      });
    } catch (error) {
      setApplyError("Unable to apply coupon. Please try again.");
    }
  };

  const handleManualApply = async () => {
    const trimmedCode = enteredCode.trim();
    if (!trimmedCode) return;
    const matchedCoupon = findCouponByCode(trimmedCode);
    await handleApplyCoupon(
      matchedCoupon || trimmedCode,
      matchedCoupon?.id || trimmedCode,
      trimmedCode
    );
  };

  const getCouponInputElement = useCallback(() => {
    return (
      inputFieldRef?.current ||
      document.querySelector("input.coupan-input") ||
      document.querySelector(".coupan-input")
    );
  }, [inputFieldRef]);

  const highlightCouponInput = useCallback((inputElement) => {
    if (!inputElement) return;
    inputElement.classList.remove("coupon-input-flight-highlight");
    // Force reflow so animation re-triggers reliably
    void inputElement.offsetWidth;
    inputElement.classList.add("coupon-input-flight-highlight");
  }, []);

  const handleModalClose = useCallback(() => {
    setEnteredCode("");
    if (typeof onHide === "function") {
      onHide();
    }
  }, [onHide]);

  /**
   * Brand new animation: the success card shrinks + slides into the coupon input.
   * Runs whenever the user closes the success modal or when it auto-closes.
   */
  const animateSuccessCardToInput = useCallback(() => {
      if (isAnimatingSuccessRef.current) return;
      const cardElement = successCardRef.current;
      const inputElement = getCouponInputElement();

      const cleanup = () => {
        setShowSuccessModal(false);
        isAnimatingSuccessRef.current = false;
      };

      if (!cardElement) {
        cleanup();
        return;
      }

      isAnimatingSuccessRef.current = true;

      const cardRect = cardElement.getBoundingClientRect();
      const computedStyles = window.getComputedStyle(cardElement);

      const floatingShell = document.createElement("div");
      floatingShell.style.position = "fixed";
      floatingShell.style.left = `${cardRect.left}px`;
      floatingShell.style.top = `${cardRect.top}px`;
      floatingShell.style.width = `${cardRect.width}px`;
      floatingShell.style.height = `${cardRect.height}px`;
      floatingShell.style.zIndex = "9999";
      floatingShell.style.pointerEvents = "none";
      floatingShell.style.borderRadius = computedStyles.borderRadius;
      floatingShell.style.overflow = "hidden";
      floatingShell.style.boxShadow =
        "0 25px 70px rgba(0, 0, 0, 0.18), 0 8px 20px rgba(0,0,0,0.08)";
      floatingShell.style.transformOrigin = "center";
      floatingShell.style.background = computedStyles.background || "transparent";

      const cardClone = cardElement.cloneNode(true);
      cardClone.style.width = "100%";
      cardClone.style.height = "100%";
      cardClone.style.transformOrigin = "center";
      floatingShell.appendChild(cardClone);

      document.body.appendChild(floatingShell);
      setShowSuccessModal(false);

      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const viewportWidth =
        window.innerWidth || document.documentElement.clientWidth;

      const runFlight = (targetRect) => {
        const fallbackRect = targetRect || cardRect;
        const startCenterX = cardRect.left + cardRect.width / 2;
        const startCenterY = cardRect.top + cardRect.height / 2;
        const targetCenterX = fallbackRect.left + fallbackRect.width / 2;
        const targetCenterY = fallbackRect.top + fallbackRect.height / 2;

        const translateX = targetCenterX - startCenterX;
        const translateY = targetCenterY - startCenterY;
        const scale =
          Math.min(
            fallbackRect.width / cardRect.width,
            fallbackRect.height / cardRect.height
          ) || 0.25;
        const clampedScale = Math.max(Math.min(scale, 0.9), 0.22);

        const keyframes = [
          {
            transform: "translate3d(0,0,0) scale(1)",
            opacity: 1,
            borderRadius: computedStyles.borderRadius,
          },
          {
            transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${clampedScale})`,
            opacity: 0.1,
            borderRadius: "14px",
          },
        ];

        const timing = {
          duration: 850,
          easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
          fill: "forwards",
        };

        const animation =
          typeof floatingShell.animate === "function"
            ? floatingShell.animate(keyframes, timing)
            : null;

        if (!animation) {
          requestAnimationFrame(() => {
            floatingShell.style.transition =
              "transform 0.85s cubic-bezier(0.22,0.61,0.36,1), opacity 0.85s ease";
            floatingShell.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${clampedScale})`;
            floatingShell.style.opacity = "0.1";
          });
          setTimeout(() => {
            floatingShell.remove();
            highlightCouponInput(inputElement);
            cleanup();
          }, timing.duration + 40);
          return;
        }

        animation.onfinish = () => {
          floatingShell.remove();
          highlightCouponInput(inputElement);
          cleanup();
        };
        animation.oncancel = () => {
          floatingShell.remove();
          highlightCouponInput(inputElement);
          cleanup();
        };
      };

      const proceedWithFlight = () => {
        const targetRect = inputElement?.getBoundingClientRect();
        runFlight(targetRect);
      };

      if (inputElement) {
        const targetRect = inputElement.getBoundingClientRect();
        const isOutOfView =
          targetRect.top < 0 ||
          targetRect.bottom > viewportHeight ||
          targetRect.left < 0 ||
          targetRect.right > viewportWidth;

        if (isOutOfView) {
          inputElement.scrollIntoView({ behavior: "smooth", block: "center" });
          setTimeout(proceedWithFlight, 360);
        } else {
          proceedWithFlight();
        }
      } else {
        runFlight(cardRect);
      }
    },
    [getCouponInputElement, highlightCouponInput]
  );

  useEffect(() => {
    if (showSuccessModal && isSuccessCardReady) {
      autoCloseTimerRef.current = setTimeout(() => {
        animateSuccessCardToInput();
      }, 1800);
    } else if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }

    return () => {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
        autoCloseTimerRef.current = null;
      }
    };
  }, [showSuccessModal, isSuccessCardReady, animateSuccessCardToInput]);

  const handleSuccessModalClose = useCallback(() => {
    setShowGif(false);
    animateSuccessCardToInput();
  }, [animateSuccessCardToInput]);

  const handleSuccessArtLoaded = () => {
    setIsSuccessCardReady(true);
  };

  return (
    <>
      {/* Coupon list modal */}
      <Modal
        show={show}
        onHide={handleModalClose}
        size="md"
        centered
        panelClassName="max-w-[600px]"
        ariaLabel="Available Coupons"
      >
        <div className="p-6" dir={isRTL ? "rtl" : "ltr"}>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#191B1C]">
              {availableCouponsText} ({coupons?.length || 0})
            </h2>
            <button
              onClick={handleModalClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              aria-label="Close"
            >
              <IoClose className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Manual input */}
          <div className="mb-6">
            <input
              type="text"
              placeholder={enterCouponPlaceholder}
              value={enteredCode}
              onChange={(e) => {
                setEnteredCode(e.target.value);
                if (applyError) {
                  setApplyError("");
                }
              }}
              onKeyPress={(e) => e.key === "Enter" && handleManualApply()}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
            />
            {applyError && (
              <p className="mt-2 text-sm text-red-500">{applyError}</p>
            )}
          </div>

          {/* Best Coupons */}
          {recommendedCoupons.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-[#191B1C] mb-4">
                {bestCouponsForYou}
              </h3>
              <div className="space-y-4">
                {recommendedCoupons.map((coupon, index) => {
                  const expired = isCouponExpired(coupon);
                  return (
                    <CouponCard
                      key={coupon.id || coupon.coupon_id || index}
                      coupon={coupon}
                      expired={expired}
                      isRecommended={true}
                      cartTotal={cartTotal}
                      onApply={() =>
                        handleApplyCoupon(
                          coupon,
                          coupon.id || coupon.coupon_id || index
                        )
                      }
                      formatDate={formatDate}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* More Coupons */}
          {otherCoupons.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-[#191B1C] mb-4">
                {moreCoupons}
              </h3>
              <div className="space-y-4">
                {otherCoupons.map((coupon, index) => {
                  const expired = isCouponExpired(coupon);
                  return (
                    <CouponCard
                      key={coupon.id || coupon.coupon_id || index}
                      coupon={coupon}
                      expired={expired}
                      isRecommended={false}
                      cartTotal={cartTotal}
                      onApply={() =>
                        handleApplyCoupon(
                          coupon,
                          coupon.id || coupon.coupon_id || index
                        )
                      }
                      formatDate={formatDate}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {coupons?.length === 0 && (
            <div className="text-center text-gray-400 py-4">
              {allCaughtUp}
            </div>
          )}
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        show={showSuccessModal}
        onHide={handleSuccessModalClose}
        size="sm"
        centered
        panelClassName="max-w-[300px] !bg-transparent !shadow-none p-0"
        ariaLabel="Coupon Applied Successfully"
        closeOnBackdrop={false}
      >
        <div
          className="relative rounded-[32px] overflow-hidden !bg-transparent"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <button
            onClick={handleSuccessModalClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 text-gray-700 flex items-center justify-center"
            aria-label="Close"
          >
            <IoClose className="w-5 h-5" />
          </button>
          <div
            key={successModalAnimKey}
            ref={successCardRef}
            className="success-modal-card relative rounded-[32px] overflow-hidden !bg-transparent p-0"
          >
            <img
              src="https://cdn.ourshopee.com/ourshopee-img/assets/coupons/bg.svg"
              alt="Coupon Applied"
              className="block w-full h-auto object-cover"
              onLoad={handleSuccessArtLoaded}
            />
            {showGif && (
              <img
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-3/4 object-contain"
                src="/assets/animation.gif"
                alt=""
                aria-hidden="true"
              />
            )}
            <div className="absolute inset-x-0 bottom-[2rem] text-center text-lg text-[#1E1E1E] font-medium">
              You saved{" "}
              <span className="font-semibold text-[#32A928]">
                {savingsDisplay}
              </span>{" "}
              on this order.
            </div>
          </div>
        </div>
      </Modal>
      <style jsx global>{`
        @keyframes couponInputFlightPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
            transform: scale(1);
          }
          40% {
            box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.35);
            transform: scale(1.02);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
            transform: scale(1);
          }
        }

        .coupon-input-flight-highlight {
          animation: couponInputFlightPulse 1s ease-out forwards;
        }

        @keyframes successModalPop {
          0% {
            opacity: 0;
            transform: translate3d(0, 16px, 0) scale(0.92);
            filter: blur(2px);
          }
          55% {
            opacity: 1;
            transform: translate3d(0, -6px, 0) scale(1.02);
            filter: blur(0);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
            filter: blur(0);
          }
        }

        .success-modal-card {
          animation: successModalPop 360ms cubic-bezier(0.22, 0.61, 0.36, 1);
          will-change: transform, opacity, filter;
          backface-visibility: hidden;
        }
      `}</style>
    </>
  );
};

const CouponCard = ({
  coupon,
  expired,
  isRecommended,
  onApply,
  formatDate,
  cartTotal,
}) => {
  const applyButtonText = useContent("buttons.apply");
  const expiredText = "EXPIRED";
  const appliedText = "APPLIED";
  const currentCountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const currentLanguage = useCurrentLanguage();
  const appliedCouponState = useSelector(
    (state) => state.paymentslice.coupon
  );

  const getCouponCode = (promo) => {
    return (
      promo?.promo_code ||
      promo?.code ||
      promo?.couponCode ||
      promo?.coupon ||
      "CODE"
    );
  };

  const getDescription = (coupon) => {
    return (
      coupon?.promo_discription ||
      coupon?.promo_description ||
      coupon?.description ||
      ""
    );
  };

  const getMinValue = (coupon) => {
    return coupon?.min_order_value || coupon?.minimum_value || null;
  };

  const parseNumeric = (value) => {
    if (value === null || value === undefined || value === "") return null;
    const numericRaw = Number(String(value).replace(/[^\d.-]/g, ""));
    return Number.isNaN(numericRaw) ? null : numericRaw;
  };

  const couponCode = getCouponCode(coupon);
  const description = getDescription(coupon);
  const minValue = getMinValue(coupon);
  const parsedMinValue = parseNumeric(minValue);
  const parsedCartTotal =
    typeof cartTotal === "number" && !Number.isNaN(cartTotal)
      ? cartTotal
      : parseNumeric(cartTotal);
  const isBelowMinOrder =
    parsedMinValue !== null &&
    parsedCartTotal !== null &&
    parsedCartTotal < parsedMinValue;
  const isApplyDisabled = expired || isBelowMinOrder;

  // Check if this coupon is applied
  const appliedCouponCode = appliedCouponState?.code || appliedCouponState?.coupon || appliedCouponState?.promo_code;
  const isApplied = appliedCouponCode && couponCode && 
    appliedCouponCode.toLowerCase() === couponCode.toLowerCase();

  const locale = currentLanguage === "ar" ? "ar-AE" : "en-AE";
  const countryCurrency = currentCountry?.currency || "AED";
  const isAED = countryCurrency.toUpperCase() === "AED";

  const formatMinValue = (value) => {
    if (!value) return value;
    const parsed = Number(String(value).replace(/[^\d.-]/g, ""));
    if (Number.isNaN(parsed)) return value;
    try {
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parsed);
    } catch (error) {
      return parsed;
    }
  };

  return (
    <div className="relative flex items-center gap-0">
      {/* Recommended Badge */}
      {isRecommended && (
        <div className="absolute -top-2 right-4 z-10 bg-[#E8F5E9] px-2 py-1 rounded-md flex items-center gap-1">
          <AiFillLike className="text-black text-xs font-medium" />
          <span className="text-black text-xs font-medium">RECOMMENDED</span>
        </div>
      )}

      {/* Ticket graphic */}
      <div className="flex-shrink-0 w-24 h-32 relative">
        <img
          src="https://cdn.ourshopee.com/ourshopee-img/assets/coupons/Coupon.svg"
          alt="Coupon"
          className={`w-full h-full object-contain ${
            expired ? "opacity-60" : ""
          }`}
        />
        <span
          className={`absolute inset-0 flex items-center justify-center text-white font-bold text-sm transform -rotate-90 whitespace-nowrap ${
            expired ? "text-gray-500" : ""
          }`}
        >
          {couponCode}
        </span>
      </div>

      {/* Details */}
      <div
        className={`flex-grow flex items-center justify-between p-5 rounded-r-lg min-h-[128px] ${
          expired ? "bg-gray-50 opacity-60" : "bg-white"
        }`}
        style={{
          boxShadow: expired
            ? "0 2px 8px rgba(0, 0, 0, 0.1)"
            : "0 1px 3px rgba(255, 255, 255, 0.9), 0 2px 6px rgba(255, 255, 255, 0.7), 0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="flex-grow">
          <h4
            className={`font-bold text-lg mb-1 ${
              expired ? "text-gray-400" : "text-[#191B1C]"
            }`}
          >
            {description}
          </h4>
          {minValue && (
            <p
              className={`text-sm mb-2 flex items-center gap-0.5 ${
                expired ? "text-gray-400" : "text-gray-600"
              } ${
                currentLanguage === "ar"
                  ? "flex-row-reverse justify-start"
                  : ""
              }`}
            >
              for order above{" "}
              {isAED ? (
                <img
                  src="/assets/feed/aed-icon.svg"
                  alt="AED"
                  className="w-4 h-4 inline-block mix-blend-multiply"
                  style={{ color: "black" }}
                />
              ) : (
                <span
                  className={`currencycode ${
                    currentLanguage === "ar" ? "ml-1" : "mr-1"
                  }`}
                >
                  {countryCurrency}
                </span>
              )}{" "}
              <strong>{formatMinValue(minValue)}</strong>
            </p>
          )}
          {coupon?.enddate && (
            <p
              className={`text-xs ${
                expired ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Valid until <strong>{formatDate(coupon.enddate)}</strong>
            </p>
          )}
        </div>

        {/* Apply / Applied / Expired button */}
        <div className="flex-shrink-0 ml-4">
          {expired ? (
            <button
              disabled
              className="px-6 py-2 bg-gray-400 text-white rounded-lg font-semibold text-sm uppercase cursor-not-allowed"
            >
              {expiredText}
            </button>
          ) : isApplied ? (
            <button
              disabled
              className="px-6 py-2 rounded-lg font-semibold text-sm uppercase border border-[#7C3AED] text-[#7C3AED] bg-transparent cursor-default"
            >
              {appliedText}
            </button>
          ) : (
            <button
              onClick={!isApplyDisabled ? onApply : undefined}
              disabled={isApplyDisabled}
              className={`px-6 py-2 rounded-lg font-semibold text-sm uppercase transition-colors ${
                isApplyDisabled
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-primary hover:bg-[#7C3AED] text-white"
              }`}
            >
              {applyButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponModal;
