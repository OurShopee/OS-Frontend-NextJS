import React from "react";

const OrderTimeline = ({ currentStep, data,ele }) => {
  const stepMapping = [
    { title: "Ordered", key: "orderedDate" },
    { title: "Processing", key: "processedDate" },
    { title: "Packed", key: "packedDate" },
    { title: "Out for Delivery", key: "dispatchedDate" },
    { title: "Delivered", key: "deliveryDate" },
  ];

  return (
    <div className="order-timeline">
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
              <div className="step-title">{(currentStep == index && ele.cancelled) ? 'cancelled' : step.title}</div>
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
