"use client";
import React from "react";
import Countdown from "react-countdown";
import { MdTimer } from "react-icons/md";

/**
 * Countdown timer component with timezone support
 * @param {Date} endZoned - End date/time (timezone-aware)
 * @param {string} className - Additional Tailwind classes
 */
export default function CountdownTimer({ endZoned, className = "" }) {
  // Helper function to pad numbers with leading zero
  const zeroPad = (num) => String(num).padStart(2, "0");

  return (
    <div
      data-aos="fade-left"
      data-aos-easing="ease-in-out"
      className={`bg-[#ffce0973] text-[#5132c2] text-[16px] md:text-[22px] p-3 rounded-xl flex items-center gap-3 font-semibold leading-[1em] tracking-[0em] ${className}`}
    >
      <MdTimer className="text-lg flex-shrink-0" />
      <Countdown
        date={endZoned}
        renderer={({ days, hours, minutes, seconds, completed }) => {
          if (completed) {
            return <span>00d 00h 00m 00s</span>;
          }
          return (
            <span>
              {zeroPad(days)}
              <span className="text-[#5132c2] text-opacity-45">D</span> :{" "}
              {zeroPad(hours)}
              <span className="text-[#5132c2] text-opacity-45">h</span> :{" "}
              {zeroPad(minutes)}
              <span className="text-[#5132c2] text-opacity-45">m</span> :{" "}
              {zeroPad(seconds)}
              <span className="text-[#5132c2] text-opacity-45">s</span>
            </span>
          );
        }}
      />
    </div>
  );
}
