"use client";
import { useSelector } from "react-redux";
import CountdownClock from "../homepage/CountdownClock";
import CarouselWithoutIndicators from "./CarouselWithoutIndicator";
import { MediaQueries } from "../utils";

const FlashSale = ({ FlashSaleItems, FlashSaleBanner }) => {
  
  function getNextWednesdayOrSunday() {
    const now = new Date();
    const day = now.getDay();

    const nextDayDate = (targetDay) => {
      let diff = (targetDay + 7 - day) % 7;
      if (diff === 0) {
        const targetTime = new Date(now);
        targetTime.setHours(23, 59, 59, 0);
        if (now < targetTime) {
          return targetTime;
        }
        diff = 7;
      }
      const nextDate = new Date(now);
      nextDate.setDate(now.getDate() + diff);
      nextDate.setHours(23, 59, 59, 0);
      return nextDate;
    };

    const nextWednesday = nextDayDate(3);
    const nextSunday = nextDayDate(0);

    return nextWednesday < nextSunday ? nextWednesday : nextSunday;
  }

  return (
    <div className="">
      <div className="component_1 p-4">
        <div className="component_header">
          <div>
            <img src={`${process.env.NEXT_PUBLIC_S3_PREFIX_BLACK_FRIDAY}/flash-sale.gif`}
              className="w-[146px] md:w-[210px] h-full"
            loading="lazy" />
          </div>

          <CountdownClock
            endDate={getNextWednesdayOrSunday()}
            labelColor={"#fff"}
            separatorColor={"#fff"}
          />
        </div>

        <CarouselWithoutIndicators
          products={FlashSaleItems.slice(0, 5)}
          bannerImage={FlashSaleBanner.desktopImage}
          bannerImageRedirectUrl={FlashSaleBanner?.url}
          type={1}
          inner_bg={"#f5f5f5"}
        />
      </div>
    </div>
  );
};

export default FlashSale;
