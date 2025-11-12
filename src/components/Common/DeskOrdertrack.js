import React from "react";
import { useContent, useCurrentLanguage } from "@/hooks";

const OrderTracker = ({currentStep, data ,ele}) => {
  const currentLanguage = useCurrentLanguage();
  const orderedText = useContent("orders.ordered");
  const processingText = useContent("orders.processing");
  const packedText = useContent("orders.packed");
  const outForDeliveryText = useContent("orders.outForDelivery");
  const deliveredText = useContent("orders.delivered");
  const cancelledText = useContent("orders.cancelled");

  const stepMapping = [
    { title: orderedText, key: "orderedDate" },
    { title: processingText, key: "processedDate" },
    { title: packedText, key: "packedDate" },
    { title: outForDeliveryText, key: "dispatchedDate" },
    { title: deliveredText, key: "deliveryDate" },
  ];

  // Determine current step based on which step has data


  return (
    <div className="tracker" dir={currentLanguage === "ar" ? "rtl" : "ltr"}>
      {stepMapping.map((step, index) => (
        <div className="tracker-step-container" key={index}>
          <div className="step-line-container">
            {index !== 0 && (
              <div
                className={`step-line ${
                  index <= currentStep ? "line-active" : "line-inactive"
                }`}
              ></div>
            )}
          </div>
          <div className="step-circle-container">
            <div
              className={`step-circle ${
                (currentStep == index && ele.cancelled) ? 'cancelled_bg pb-1' : index <= currentStep ? "active-circle" : "inactive-circle"
              }`}
            >
              {(currentStep == index && ele.cancelled) ? 'x' : (index <= currentStep ? "✓" : "")}
            </div>
            <div className="step-text">
              <div className="step-title">{(currentStep == index && ele.cancelled) ? cancelledText : step.title}</div>
              <div className="step-date">{(currentStep == index && ele.cancelled) ? ele.cancelledDate : data[step.key] || "—"}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderTracker;
