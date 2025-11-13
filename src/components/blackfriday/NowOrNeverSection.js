"use client";
import { useSelector } from "react-redux";
import CountdownClock from "../homepage/CountdownClock";
import CarouselWithoutIndicators from "./CarouselWithoutIndicator";
import { useMemo, useEffect, useState } from "react";

function getNextResetTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const resetHours = [5, 11, 17, 23];
  const resetMinutes = 59;
  const resetSeconds = 59;

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

  const nextReset = new Date(now);
  nextReset.setDate(now.getDate() + 1);
  nextReset.setHours(resetHours[0], resetMinutes, resetSeconds, 0);
  return nextReset;
}

function getCurrentProductGroupIndex() {
  const now = new Date();
  const hours = now.getHours();
  // Group 0: 0:00 to 5:59
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

  const products = [
    ...(top_picks?.[0]?.productlist || []),
    ...(top_picks?.[0]?.productlist || []),
    ...(top_picks?.[0]?.productlist || []),
  ];

  const groupedProducts = [
    products.slice(0, 6), // 00:00–05:59
    products.slice(6, 12), // 06:00–11:59
    products.slice(12, 18), // 12:00–17:59
    products.slice(18, 24), // 18:00–23:59
  ];

  const [timeUpdate, setTimeUpdate] = useState(Date.now());

  useEffect(() => {
    function getNextResetTimeMs() {
      const now = new Date();
      const hours = now.getHours();
      const resetHours = [0, 6, 12, 18];

      for (let h of resetHours) {
        if (
          hours < h ||
          (hours === h && now.getMinutes() === 0 && now.getSeconds() === 0)
        ) {
          const nextReset = new Date(now);
          nextReset.setHours(h, 0, 0, 0);
          if (nextReset.getTime() > now.getTime()) {
            return nextReset.getTime();
          }
        }
      }

      const nextReset = new Date(now);
      nextReset.setDate(now.getDate() + 1);
      nextReset.setHours(resetHours[0], 0, 0, 0);
      return nextReset.getTime();
    }

    const now = Date.now();
    const nextResetMs = getNextResetTimeMs();
    const msUntilNextReset = nextResetMs - now;

    const timer = setTimeout(() => {
      setTimeUpdate(Date.now());
    }, msUntilNextReset);

    return () => clearTimeout(timer);
  }, [timeUpdate]);

  const currentGroupIndex = useMemo(
    () => getCurrentProductGroupIndex(),
    [timeUpdate]
  );

  return (
    <div className="">
      <div className="component_1 px-5">
        <div
          className="px-11 py-3 rounded-[16px] overflow-hidden pb-8"
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
              <span className="text-[22px] font-medium text-white">
                GRAB NOW!
              </span>
              <CountdownClock
                endDate={getNextResetTime()}
                labelColor={"#fff"}
                showDays={false}
                separatorColor={"#fff"}
              />
            </div>
          </div>

          <CarouselWithoutIndicators
            products={groupedProducts[currentGroupIndex]}
            type={1}
            inner_bg={"rgba(238, 235, 250, 1)"}
            breakPointsProps={{
              200: { slidesPerView: 1.3 },
              375: { slidesPerView: 1.5 },
              435: { slidesPerView: 2 },
              525: { slidesPerView: 2 },
              600: { slidesPerView: 2 },
              700: { slidesPerView: 2 },
              800: { slidesPerView: 2.2 },
              900: { slidesPerView: 2.6 },
              1000: { slidesPerView: 3 },
              1100: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
              1300: { slidesPerView: 4 },
              1400: { slidesPerView: 6 },
              1500: { slidesPerView: 6 },
              1600: { slidesPerView: 6 },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NowOrNeverSection;
