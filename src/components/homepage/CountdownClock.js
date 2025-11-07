// components/deals/CountdownClock.js
"use client";

import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import Image from "next/image";

export default function CountdownClock({
  endDate,
  clockIcon = "/assets/feed/clock.png",
  showDays = true,
  showHours = true,
  showMinutes = true,
  showSeconds = true,
  digitWidth = 12,
  digitHeight = 18,
  digitFontSize = 12,
  labelFontSize = 12,
  separatorSize = "3px",
  separatorColor = "#a80000",
  backgroundColor = "linear-gradient(0deg,#ff3437,#fa2c2c)",
  digitColor = "#fff",
  labelColor = "#000",
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center">
        {clockIcon && (
          <Image
            src={clockIcon}
            alt="Clock icon"
            width={48}
            height={48}
            className="w-12 h-auto"
          />
        )}
        <FlipClockCountdown
          to={endDate}
          labels={["Days", "Hrs", "Min", "Sec"]}
          showLabels={true}
          renderMap={[showDays, showHours, showMinutes, showSeconds]}
          digitBlockStyle={{
            width: digitWidth,
            height: digitHeight,
            fontSize: digitFontSize,
            background: backgroundColor,
            color: digitColor,
            borderRadius: 0,
            fontWeight: 600,
          }}
          separatorStyle={{
            size: separatorSize,
            color: separatorColor,
            fontWeight: "400",
          }}
          labelStyle={{
            fontSize: labelFontSize,
            color: labelColor,
            fontWeight: 600,
            marginTop: 0,
          }}
          duration={0.5}
          showSeparators={true}
        />
      </div>
    </div>
  );
}
