// components/deals/DealsYouMightLike.js

import DealCard from "./DealCard";

export default function DealsYouMightLike({ deals }) {
  return (
    <div className="bg-white p-[14px]">
      <h2 className="text-[22px] font-bold mb-[18px] flex items-center gap-2.5">
        Deals You Might Like
        <img src="/assets/banners/bnpl4.png" className="w-[24px] h-[34px]" />
      </h2>
      <div className="grid grid-cols-2 gap-x-10 gap-y-5">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </div>
  );
}
