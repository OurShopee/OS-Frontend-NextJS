"use client";
import { useSelector } from "react-redux";
import CountdownClock from "../homepage/CountdownClock";
import CarouselWithoutIndicators from "./CarouselWithoutIndicator";
import { useMemo } from "react";

function getNextResetTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const resetHours = [5, 11, 17, 23];
  const resetMinutes = 59;
  const resetSeconds = 59;

  // Find next reset time today or tomorrow
  for (let h of resetHours) {
    if (
      hours < h ||
      (hours === h &&
        (minutes < resetMinutes ||
          (minutes === resetMinutes && seconds < resetSeconds)))
    ) {
      const nextReset = new Date(now);
      nextReset.setHours(h, resetMinutes, resetSeconds, 0);
      return nextReset;
    }
  }

  // If no reset left today, set to first reset next day
  const nextReset = new Date(now);
  nextReset.setDate(now.getDate() + 1);
  nextReset.setHours(resetHours[0], resetMinutes, resetSeconds, 0);
  return nextReset;
}

function getCurrentProductGroupIndex() {
  const now = new Date();
  const hours = now.getHours();
  // Mapping hours to groups:
  // Group 0: 00:00 to 5:59
  // Group 1: 6:00 to 11:59
  // Group 2: 12:00 to 17:59
  // Group 3: 18:00 to 23:59
  if (hours < 6) return 0;
  else if (hours < 12) return 1;
  else if (hours < 18) return 2;
  else return 3;
}

const NowOrNeverSection = () => {
  const top_picks = useSelector((state) => state?.homeslice?.top_picks);

  // Safeguard - if no products
  const products =
    [
      ...top_picks?.[0]?.productlist,
      ...top_picks?.[0]?.productlist,
      ...top_picks?.[0]?.productlist,
    ] || [];

  // Group products in 4 groups of 6 products each (24 total expected)
  const groupedProducts = [
    products.slice(0, 6), // 00:00–05:59
    products.slice(6, 12), // 06:00–11:59
    products.slice(12, 18), // 12:00–17:59
    products.slice(18, 24), // 18:00–23:59
  ];

  // Memo for performance so it won't calculate on every render unnecessarily
  const currentGroupIndex = useMemo(() => getCurrentProductGroupIndex(), []);

  return (
    <div className="">
      <div className="component_1 px-5 py-8">
        <div
          className="px-11 py-3 rounded-[16px] overflow-hidden"
          style={{
            background: "url(/assets/black-friday/now-never-bg.png)",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="component_header">
            <div className="text-[28px] font-bold text-white flex capitalize py-[11px]">
              <span>NOW OR&nbsp;</span>
              <span
                style={{
                  display: "inline-block",
                  color: "#fff",
                  paddingRight: "50px",
                  background:
                    "linear-gradient(90deg, #070707 5.71%, #FF1D1E 100%)",
                  clipPath: "polygon(0 0, 100% 0, 88% 100%, 0% 100%)",
                }}
              >
                NEVER DEALS
              </span>
            </div>

            <div className="flex justify-center items-center gap-5">
              <span className="text-[22px] font-medium text-white">GRAB NOW!</span>
              <CountdownClock
                endDate={getNextResetTime()}
                labelColor={"#fff"}
                showDays={false}
              />
            </div>
          </div>

          {/* Pass only products for current time group */}
          <CarouselWithoutIndicators
            products={groupedProducts[currentGroupIndex]}
            bannerImage={top_picks?.[0]?.image_slider}
            bannerImageRedirectUrl={top_picks?.[0]?.url}
            type={1}
            inner_bg={"rgba(238, 235, 250, 1)"}
          />
        </div>
      </div>
    </div>
  );
};

export default NowOrNeverSection;
