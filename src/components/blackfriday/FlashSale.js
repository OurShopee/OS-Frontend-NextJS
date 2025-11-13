"use client"
import { useSelector } from "react-redux";
import CountdownClock from "../homepage/CountdownClock";
import CarouselWithoutIndicators from "./CarouselWithoutIndicator";

const FlashSale = () => {
      const top_picks = useSelector((state) => state?.homeslice?.top_picks);
  return (
    <div>
      <div className="component_1 p-4">
        <div className="component_header">
          <div>
            <img src="/assets/black-friday/flash-sale.gif" className="w-[210px] h-full" />
          </div>

          <CountdownClock
            endDate={new Date("2025-11-22")}
            labelColor={"#fff"}
          />
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
  );
};

export default FlashSale;
