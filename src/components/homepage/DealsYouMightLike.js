// components/deals/DealsYouMightLike.js

import DealCard from "./DealCard";
import { getDynamicContent, useCurrentLanguage } from "@/hooks";

export default function DealsYouMightLike({ deals }) {
  const currentLanguage = useCurrentLanguage();
  return (
    <div className="bg-white p-[14px]">
      <h2 className="text-[22px] font-bold mb-[7px] sm:mb-[18px] flex items-center gap-2.5">
        {getDynamicContent(deals, "heading", currentLanguage)}
        {deals?.icon_image.length > 0 && (
          <img src={deals?.icon_image} className="w-[24px] h-[34px]" loading="lazy" />
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
