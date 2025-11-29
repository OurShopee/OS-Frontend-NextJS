"use client";
import React, { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import moment from "moment";
import "moment/locale/ar";
import { useSelector, useDispatch } from "react-redux";
import { setsnplmodal } from "@/redux/formslice";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrentLanguage, useContent } from "@/hooks";
import { getAssetsUrl } from "../utils/helpers";

// Custom NavLink component for Next.js App Router
const NavLink = ({ to, children, className, ...props }) => {
  const pathname = usePathname();
  const isActive = pathname === to;

  return (
    <Link href={to} {...props}>
      <span className={`${className} ${isActive ? "active" : ""}`}>
        {children}
      </span>
    </Link>
  );
};

const Snplmodal = ({ productcost }) => {
  const dispatch = useDispatch();
  const currentLanguage = useCurrentLanguage();
  const isRTL = currentLanguage === "ar";
  const snplmodal = useSelector((state) => state.formslice.snplmodal);
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );

  // Get translated content
  const paymentOptions = useContent("payment.paymentOptions") || "Payment options";
  const monthly = useContent("payment.monthly") || "Monthly";
  const today = useContent("payment.today") || "Today";
  const learnMore = useContent("buttons.learnMore") || "Learn more";

  const close = () => {
    dispatch(setsnplmodal(false));
  };

  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape" && snplmodal) {
        close();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [snplmodal]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (snplmodal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [snplmodal]);

  if (!snplmodal) return null;

  return (
    <div>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[1050] transition-opacity duration-300"
        onClick={close}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[1055] flex items-center justify-center p-4 overflow-y-auto"
        onClick={close}
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-options-title"
        aria-describedby="payment-options-description"
      >
        <div
          className="relative bg-white rounded-lg shadow-xl max-w-[500px] w-full my-8 animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className="snplmodal">
            <div className={`modalclose flex paymentoptionsnpl pt-2 ${
              isRTL ? "pl-2 flex-row-reverse" : "pr-2"
            }`}>
              <div className="paymentoption-title">
                <div className="paytitle" id="payment-options-title">
                  {paymentOptions}
                </div>
              </div>
              <div>
                <button
                  type="button"
                  onClick={close}
                  className="bg-transparent border-0 p-1 hover:bg-gray-100 rounded transition-colors duration-200"
                  aria-label="Close payment options modal"
                >
                  <IoClose size={20} className="cursor-pointer" />
                </button>
              </div>
            </div>

            <div className="monthlytitle" id="payment-options-description">
              {monthly}
            </div>

            <div className="snpltrack">
              <div
                className="subscription-card"
                role="list"
                aria-label="Monthly payment schedule"
                dir={isRTL ? "rtl" : "ltr"}
              >
                {Array.from({ length: currentcountry?.emi_months || 0 }).map(
                  (_, index) => {
                    // Format date based on language
                    const formattedDate = index === 0
                      ? today
                      : isRTL
                      ? moment()
                          .add(index, "months")
                          .locale(currentLanguage)
                          .format("dddd، D MMMM YYYY")
                      : moment()
                          .add(index, "months")
                          .locale(currentLanguage)
                          .format("dddd, Do MMMM YYYY");

                    return (
                      <div
                        className={`item ${index === 0 ? "activeback today" : ""}`}
                        key={index}
                        role="listitem"
                        aria-label={`Payment ${index + 1} of ${
                          currentcountry?.emi_months || 0
                        }`}
                      >
                        <div
                          className={`indicator ${
                            index === 0 ? "activeindicator" : ""
                          }`}
                          aria-hidden="true"
                          style={isRTL ? { marginRight: 0, marginLeft: "12px" } : {}}
                        ></div>
                        <div
                          className={`label ${index === 0 ? "activetitle" : ""}`}
                          aria-label={`Payment date: ${formattedDate}`}
                        >
                          {formattedDate}
                        </div>
                        <div
                          className={`price ${index === 0 ? "activetitle" : ""} flex items-center flex-row ${isRTL ? "flex-row-reverse" : ""}`}
                          aria-label={`Payment amount: ${currentcountry.currency} ${productcost}`}
                        >
                          {currentcountry?.currency == "AED" ? (
                            <>
                              <img src={getAssetsUrl("feed/aed-icon.svg")}
                                alt="AED"
                                className="w-4 h-4 inline-block mix-blend-multiply"
                                style={{ 
                                  color: "black",
                                  marginRight: isRTL ? "4px" : "0",
                                  marginLeft: isRTL ? "0" : "4px"
                                }}
                              loading="lazy" />
                              {productcost}
                            </>
                          ) : (
                            <>
                              {currentcountry.currency} {productcost}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
                <div 
                  className="track-line" 
                  aria-hidden="true"
                  style={isRTL ? { left: "auto", right: "23px", borderLeft: "none", borderRight: "1px dashed #CED2D4" } : {}}
                ></div>
              </div>

              <NavLink
                to="/tabbyplan"
                className="activeformsubmitbutton no-underline"
                aria-label="Learn more about payment plans"
              >
                {learnMore}
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Snplmodal;
