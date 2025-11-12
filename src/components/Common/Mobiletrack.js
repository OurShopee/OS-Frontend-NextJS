import React from "react";
import { useContent, useCurrentLanguage } from "@/hooks";

const OrderTimeline = ({ currentStep, data,ele }) => {
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

  return (
    <div className="order-timeline" dir={currentLanguage === "ar" ? "rtl" : "ltr"}>
      {stepMapping.map((step, index) => {
        const isCurrent = index === currentStep;
        const isCompletedOrCurrent = index <= currentStep;

        return (
          <div
            className={`timeline-row ${
              (currentStep == index && ele.cancelled) ? 'completed-step_cancelled' : currentStep == index ? "completed-step" : ""
            }`}
            key={index}
          >
            {/* Left: Dot and line */}
            <div className="timeline-indicator">
              <div className="circle-line">
                <div className={`dot ${(currentStep == index && ele.cancelled) ? 'dot-active_canceleld' : isCompletedOrCurrent ? "dot-active" : ""}`}>
                  {(currentStep == index && ele.cancelled) ? 'x' : index <= currentStep ? "✓" : ""}
                </div>
                {index < stepMapping.length - 1 && (
                  <div className="vertical-line" />
                )}
              </div>
            </div>

            {/* Middle: Text */}
            <div className="timeline-content">
              <div className="step-title">{(currentStep == index && ele.cancelled) ? cancelledText : step.title}</div>
              <div className="step-date">
                {(currentStep == index && ele.cancelled) ? ele.cancelledDate : data[step.key] ? data[step.key] : "—"}
              </div>
            </div>

            {/* Right: Only for current step */}
            {isCurrent && (
              <div className="right-icon">
                {/* <span className="right-check">✓</span> */}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;
