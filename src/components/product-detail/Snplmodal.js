"use client";
import React from "react";
import Modal from "react-bootstrap/Modal";
import { IoClose } from "react-icons/io5";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { setsnplmodal } from "@/redux/formslice";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const snplmodal = useSelector((state) => state.formslice.snplmodal);
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );

  const close = () => {
    dispatch(setsnplmodal(false));
  };

  return (
    <div>
      <Modal
        show={snplmodal}
        centered
        onHide={close}
        aria-labelledby="payment-options-title"
        aria-describedby="payment-options-description"
      >
        <div className="snplmodal">
          <div className="modalclose flex paymentoptionsnpl pr-2 pt-2 ">
            <div className="paymentoption-title">
              <div className="paytitle" id="payment-options-title">
                Payment options
              </div>
            </div>
            <div>
              <button
                type="button"
                onClick={close}
                className="bg-transparent border-0 p-1 hover:bg-gray-100 rounded"
                aria-label="Close payment options modal"
              >
                <IoClose size={20} className="cursor-pointer" />
              </button>
            </div>
          </div>

          <div className="monthlytitle" id="payment-options-description">
            Monthly
          </div>

          <div className="snpltrack">
            <div
              className="subscription-card"
              role="list"
              aria-label="Monthly payment schedule"
            >
              {Array.from({ length: currentcountry?.emi_months || 0 }).map(
                (_, index) => (
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
                    ></div>
                    <div
                      className={`label ${index === 0 ? "activetitle" : ""}`}
                      aria-label={`Payment date: ${
                        index === 0
                          ? "Today"
                          : moment()
                              .add(index, "months")
                              .format("dddd, Do MMMM YYYY")
                      }`}
                    >
                      {index === 0
                        ? "Today"
                        : moment()
                            .add(index, "months")
                            .format("dddd, Do MMMM YYYY")}
                    </div>
                    <div
                      className={`price ${index === 0 ? "activetitle" : ""}`}
                      aria-label={`Payment amount: ${currentcountry.currency} ${productcost}`}
                    >
                      {currentcountry.currency} {productcost}
                    </div>
                  </div>
                )
              )}
              <div className="track-line" aria-hidden="true"></div>
            </div>

            <NavLink
              to="/tabbyplan"
              className="activeformsubmitbutton no-underline"
              aria-label="Learn more about payment plans"
            >
              Learn more
            </NavLink>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Snplmodal;
