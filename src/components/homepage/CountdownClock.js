// components/deals/CountdownClock.js
"use client";

import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import Image from "next/image";
import { MediaQueries } from "../utils";
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
  const {isMobile} = MediaQueries()
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center">
        {clockIcon && (
          <Image
            src={clockIcon}
            alt="Clock icon"
            width={isMobile ? 48 * 0.8 : 48}
            height={isMobile ? 48 * 0.8 : 48}
            className="w-8 sm:w-12 h-auto "
          />
        )}
        <FlipClockCountdown
          to={endDate}
          labels={["Days", "Hrs", "Min", "Sec"]}
          showLabels={true}
          renderMap={[showDays, showHours, showMinutes, showSeconds]}
          digitBlockStyle={{
            width: isMobile ? digitWidth * 0.8 : digitWidth,
            height: isMobile ? digitHeight * 0.8 : digitHeight,
            fontSize: isMobile ? digitFontSize * 0.8 : digitFontSize,
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
