import React from "react";

const OrderTracker = ({currentStep, data ,ele}) => {
  const stepMapping = [
    { title: "Ordered", key: "orderedDate" },
    { title: "Processing", key: "processedDate" },
    { title: "Packed", key: "packedDate" },
    { title: "Out for Delivery", key: "dispatchedDate" },
    { title: "Delivered", key: "deliveryDate" },
  ];

  // Determine current step based on which step has data


  return (
    <div className="tracker">
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
              <div className="step-title">{(currentStep == index && ele.cancelled) ? 'cancelled' : step.title}</div>
              <div className="step-date">{(currentStep == index && ele.cancelled) ? ele.cancelledDate : data[step.key] || "—"}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderTracker;
