// components/deals/DealsYouMightLike.js

import DealCard from "./DealCard";

export default function DealsYouMightLike({ deals }) {
  return (
    <div className="bg-white p-[14px]">
      <h2 className="text-[22px] font-bold mb-[18px] flex items-center gap-2.5">
        {deals?.heading}
        {deals?.icon_image.length > 0 && (
          <img src={deals?.icon_image} className="w-[24px] h-[34px]" />
        )}
      </h2>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 sm:gap-x-10 sm:gap-y-5">
        {deals?.multiple_image?.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </div>
  );
}
