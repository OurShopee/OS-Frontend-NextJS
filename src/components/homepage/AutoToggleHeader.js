// components/AutoToggleHeader.jsx
"use client";

import { useState, useEffect, useRef } from "react";

export default function AutoToggleHeader({ onTabChange }) {
  const [activeTab, setActiveTab] = useState("namaste"); // 'mast' or 'namaste'
  const [resetTrigger, setResetTrigger] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const mastRef = useRef(null);
  const namasteRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({
    mastWidth: 0,
    namasteWidth: 0,
    containerWidth: 0,
  });

  // Measure dimensions whenever activeTab changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mastRef.current && namasteRef.current && containerRef.current) {
        setDimensions({
          mastWidth: mastRef.current.offsetWidth,
          namasteWidth: namasteRef.current.offsetWidth,
          containerWidth: containerRef.current.offsetWidth,
        });
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [activeTab]);

  // Notify parent of tab changes
  useEffect(() => {
    if (onTabChange) {
      onTabChange(activeTab);
    }
  }, [activeTab, onTabChange]);

  // Auto-toggle with reset capability
  useEffect(() => {
    const interval = setInterval(() => {
      handleToggle();
    }, 2000);

    return () => clearInterval(interval);
  }, [resetTrigger, activeTab]);

  // Handle toggle with transition effect
  const handleToggle = () => {
    setIsTransitioning(true);

    // After the corner stretch, switch to the other tab
    setTimeout(() => {
      setActiveTab((prev) => (prev === "mast" ? "namaste" : "mast"));
      setIsTransitioning(false);
    }, 250); // Half of the transition duration
  };

  // Click handlers
  const handleMastClick = () => {
    if (activeTab === "namaste") {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveTab("mast");
        setIsTransitioning(false);
      }, 250);
    }
    setResetTrigger((prev) => prev + 1);
  };

  const handleNamasteClick = () => {
    if (activeTab === "mast") {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveTab("namaste");
        setIsTransitioning(false);
      }, 250);
    }
    setResetTrigger((prev) => prev + 1);
  };

  // Calculate sliding background styles
  const getSliderStyles = () => {
    if (isTransitioning) {
      // During transition, extend to container width
      if (activeTab === "mast") {
        return {
          left: "0px",
          width: `${dimensions.containerWidth}px`,
        };
      } else {
        return {
          left: "0px",
          width: `${dimensions.containerWidth}px`,
        };
      }
    } else {
      // Normal state - match button width
      if (activeTab === "mast") {
        return {
          left: "0px",
          width: `${dimensions.mastWidth}px`,
        };
      } else {
        return {
          left: `${dimensions.mastWidth + 4}px`,
          width: `${dimensions.namasteWidth}px`,
        };
      }
    }
  };

  return (
    <div className="relative z-10 my-3">
      <div
        ref={containerRef}
        className="inline-flex items-center gap-0 rounded-full p-0 transition-all duration-500 relative"
        style={{
          background: "#fff",
        }}
      >
        {/* Sliding Background */}
        <div
          className="absolute top-0 bottom-0 rounded-full transition-all duration-500 ease-in-out shadow-lg"
          style={{
            ...getSliderStyles(),
            background:
              activeTab === "mast"
                ? "linear-gradient(90deg, #00D74F 0%, #02B644 28.37%, #00D74F 62.98%, #009135 100%)"
                : "linear-gradient(90deg, #FF8710 0%, #FFAB57 37.98%, #FF8710 61.54%, #FFA750 95.19%)",
          }}
        />

        {/* Mast Zone Button */}
        <button
          ref={mastRef}
          onClick={handleMastClick}
          className={`relative z-10 py-[5px] pl-3 pr-7 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
            activeTab === "mast" ? "text-white font-semibold" : "text-gray-300"
          }`}
        >
          Mast Zone
          {activeTab === "mast" && (
            <div className="absolute right-1 top-0 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-[10px]">🔥</span>
            </div>
          )}
        </button>

        {/* Namaste Deals Button */}
        <button
          ref={namasteRef}
          onClick={handleNamasteClick}
          className={`relative z-10 py-[5px] pl-3 pr-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1 cursor-pointer ${
            activeTab === "namaste" ? "text-white font-semibold" : "text-gray-400"
          }`}
        >
          {activeTab === "namaste" && (
            <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-[10px]">🔥</span>
            </div>
          )}
          Namaste Deals
        </button>
      </div>
    </div>
  );
}
