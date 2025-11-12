"use client";
import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { IoClose } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { setbankoffermodal } from "@/redux/formslice";
import { useCurrentLanguage } from "@/hooks";

const Bankoffermodal = ({ plans }) => {
  const dispatch = useDispatch();
  const currentLanguage = useCurrentLanguage();
  const bankoffermodal = useSelector((state) => state.formslice.bankoffermodal);

  const close = () => {
    dispatch(setbankoffermodal(false));
  };

  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    if (bankoffermodal && Array.isArray(plans) && plans.length > 0) {
      setSelectedPlan(
        plans.find(
          (p) => p?.description && Object.keys(p.description).length > 0
        ) || plans[0]
      );
    }
  }, [plans, bankoffermodal]);

  const handleSelect = (plan) => {
    setSelectedPlan(plan);
  };

  return (
    <div>
      <Modal
        show={bankoffermodal}
        centered
        size="xl"
        onHide={close}
        aria-labelledby="bank-offer-modal-title"
        aria-describedby="bank-offer-modal-description"
        dir={currentLanguage === "ar" ? "rtl" : "ltr"}
      >
        <div className="p-3">
          <div className="snplmodal">
            <div className={`modalclose flex paymentoptionsnpl pt-2 ${
              currentLanguage === "ar" ? "pl-2 flex-row-reverse" : "pr-2"
            }`}>
              <div className="paymentoption-title">
                <div className="paytitle" id="bank-offer-modal-title">
                  ENBD Payment Options
                </div>
              </div>
              <div>
                <button
                  type="button"
                  onClick={close}
                  className="bg-transparent border-0 p-1 hover:bg-gray-100 rounded"
                  aria-label="Close modal"
                >
                  <IoClose size={20} className="cursor-pointer" />
                </button>
              </div>
            </div>
          </div>
          <div className="bankoffersubtitle" id="bank-offer-modal-description">
            You can pick the EMI plans
          </div>

          <div>
            {Array.isArray(plans) && plans.length > 0 ? (
              <>
                <div
                  className="tabs"
                  role="tablist"
                  aria-label="EMI payment plans"
                >
                  {plans.map((plan, index) => (
                    <button
                      key={plan.time_period}
                      className={`tab-btn whitespace-nowrap ${
                        selectedPlan?.time_period === plan.time_period
                          ? "active"
                          : ""
                      }`}
                      onClick={() => handleSelect(plan)}
                      role="tab"
                      aria-selected={
                        selectedPlan?.time_period === plan.time_period
                      }
                      aria-controls={`tabpanel-${index}`}
                      id={`tab-${index}`}
                      type="button"
                    >
                      {plan.time_period}
                    </button>
                  ))}
                </div>

                {selectedPlan?.description &&
                Object.keys(selectedPlan.description).length > 0 ? (
                  <div
                    className="details-box"
                    role="tabpanel"
                    aria-labelledby={`tab-${plans.findIndex(
                      (p) => p.time_period === selectedPlan.time_period
                    )}`}
                    id={`tabpanel-${plans.findIndex(
                      (p) => p.time_period === selectedPlan.time_period
                    )}`}
                  >
                    <div className="emi-line bankoffercard mb-3">
                      <span className="bankofferinterst">
                        {selectedPlan.description.interest}
                      </span>
                      <span className="bankoffercost">
                        {selectedPlan.description.payamount}
                      </span>
                    </div>
                    <div className="bankoffercard mb-3">
                      <div className="details-row pb-3">
                        <span className="bankoffer-titles">Price</span>
                        <span className="bankoffercost">
                          {selectedPlan.description.price}
                        </span>
                      </div>
                      <div className="details-row pb-3">
                        <span className="bankoffer-titles">
                          Bank Processing Fees
                        </span>
                        <span className="bankoffercost">
                          {selectedPlan.description.processing_fee}
                        </span>
                      </div>
                      <div className="details-row">
                        <span className="bankoffer-titles">
                          Interest paid to bank (
                          {selectedPlan.description.interest_num})
                        </span>
                        <span className="bankoffercost">
                          {selectedPlan.description.emi_interest_to_bank}
                        </span>
                      </div>
                    </div>
                    <div className="total-row bankoffercard">
                      <span className="bankoffer-totaltitle">
                        Total Amount Payable (
                        {selectedPlan.description.total_amnt_left})
                      </span>
                      <span className="total">
                        {selectedPlan.description.total_amnt_right}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="no-emi-box" role="status">
                    <h4>No EMI plan available.</h4>
                    <p>
                      Explore better plan options –
                      <br />
                      the perfect fit is just a click away!
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="no-emi-box" role="status">
                <h4>No EMI plans available.</h4>
                <p>Please try again later.</p>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Bankoffermodal;
