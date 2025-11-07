"use client";

import CountdownClock from "./CountdownClock";
import LimitedDealCard from "./LimitedDealCard";

export default function LimitedTimeDeals({
  deals,
}) {
  const countdownTimestamp = deals?.timer;
  console.log(deals)
  return (
    <div className="">
      {/* Content */}
      <div className="relative z-10 p-[14px]">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-[22px] font-bold text-black">{deals?.heading}</h2>
          {countdownTimestamp && (
            <CountdownClock endDate={countdownTimestamp} />
          )}
        </div>
        <div className="grid grid-cols-2 gap-x-14 gap-y-3">
          {deals?.multiple_image?.map((deal) => (
            <LimitedDealCard key={deal.id} deal={deal} />
          ))}
        </div>
      </div>
    </div>
  );
}
