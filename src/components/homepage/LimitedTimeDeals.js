"use client";

import CountdownClock from "./CountdownClock";
import LimitedDealCard from "./LimitedDealCard";
import { getDynamicContent, useCurrentLanguage } from "@/hooks";
import { Swiper, SwiperSlide } from "swiper/react";
import { MediaQueries } from "../utils";
import "swiper/css";

export default function LimitedTimeDeals({
  deals,
}) {
  const countdownTimestamp = deals?.timer;
  const currentLanguage = useCurrentLanguage();
  const { isMobile } = MediaQueries();
  
  return (
    <div className="">
      {/* Content */}
      <div className="relative z-10 p-[14px]">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg sm:text-[22px] font-bold text-black">{getDynamicContent(deals, "heading", currentLanguage)}</h2>
          {countdownTimestamp && (
            <CountdownClock endDate={countdownTimestamp} />
          )}
        </div>
        {isMobile ? (
          <Swiper
            slidesPerView={2.5}
            spaceBetween={12}
            className="limited-deals-carousel"
          >
            {deals?.multiple_image?.map((deal) => (
              <SwiperSlide key={deal.id}>
                <LimitedDealCard deal={deal} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 sm:gap-x-14 gap-y-3">
            {deals?.multiple_image?.map((deal) => (
              <LimitedDealCard key={deal.id} deal={deal} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
