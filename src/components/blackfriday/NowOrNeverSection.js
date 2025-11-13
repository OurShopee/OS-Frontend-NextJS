"use client";
import { useSelector } from "react-redux";
import CountdownClock from "../homepage/CountdownClock";
import CarouselWithoutIndicators from "./CarouselWithoutIndicator";
import CountdownTimer from "../homepage/CountdownTimer";

const NowOrNeverSection = () => {
  const top_picks = useSelector((state) => state?.homeslice?.top_picks);
  return (
    <div className="">
      <div className="component_1 p-4">
        <div
          className="px-6 py-3"
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
                  // adjusts 94% to control the angle, lower means deeper diagonal
                }}
              >
                NEVER DEALS
              </span>
            </div>

            <div>
              <CountdownTimer
                endDate={new Date("2025-11-22")}
                labelColor={"#fff"}
              />
            </div>
          </div>

          <CarouselWithoutIndicators
            products={top_picks?.[0]?.productlist}
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
