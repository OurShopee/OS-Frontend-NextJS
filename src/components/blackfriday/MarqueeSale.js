import React from "react";
import { MediaQueries } from "../utils";

const MarqueeSale = () => {
  const { isMobile } = MediaQueries();
  const textStyle = {
    background: "#100f0f",
    border: "3px solid #211e1c",
    fontWeight: "medium",
    color: "transparent",
    WebkitTextStroke: "3px #FF1D1E",
    whiteSpace: "nowrap",
  };

  const trackStyle = {
    display: "flex",
    whiteSpace: "nowrap",
    animationTimingFunction: "linear",
    position: "absolute",
    height: "95px",
    width: "200%",
  };

  return (
    <div className="absolute top-[70%] md:top-[95%] w-full h-[30vh] overflow-visible">
      {/* Top layer scrolling left */}
      <div style={{ rotate: "5deg" }}>
        <div
          className="flex justify-center items-center"
          style={{
            ...trackStyle,
            animationName: "marqueeLeft",
            animationDuration: "15s",
            animationIterationCount: "infinite",
          }}
        >
          {[...Array(100)].map((_, i) => (
            <span
              key={i}
              style={{ ...textStyle }}
              className="border-l-0 border-r-0 px-2.5 text-2xl py-[5px] md:px-[30px] md:text-6xl"
            >
              SALE
            </span>
          ))}
        </div>
      </div>

      {/* Bottom overlapping layer scrolling left */}
      <div style={{ rotate: "-5deg" }}>
        <div
          className="flex justify-center items-center"
          style={{
            ...trackStyle,
            animationName: "marqueeRight",
            animationDuration: "15s",
            animationIterationCount: "infinite",
          }}
        >
          {[...Array(100)].map((_, i) => (
            <span
              key={i}
              style={{ ...textStyle }}
              className="border-l-0 border-r-0 px-2.5 text-2xl py-[5px] md:px-[30px] md:text-6xl"
            >
              50% OFF
            </span>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes marqueeLeft {
          0% {
            left: 0%;
          }
          100% {
            left: -100%;
          }
        }

        @keyframes marqueeRight {
          0% {
            left: -100%;
          }
          100% {
            left: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default MarqueeSale;
