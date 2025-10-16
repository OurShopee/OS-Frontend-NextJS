import React from "react";
import Lottie from "lottie-react";
const SellerCards = ({ data }) => {
  return (
    <div className="grid xl:grid-cols-2 gap-4">
      {data.map((item, idx) => (
        <div
          key={item.id || idx}
          className="bg-[#F7FAFC] rounded-xl border border-primary w-[339px] p-4 xl:p-4 flex flex-col xl:h-[179px] justify-between shadow-sm"
        >
          <div className="flex xl:flex-col items-center xl:items-start gap-[14px]">
            <Lottie
              animationData={item?.icon}
              loop
              autoplay
              className="h-16 w-16 xl:h-10 xl:w-10"
            />
            <div className="flex flex-col gap-[8px]">
              <div className="font-bold xl:text-[22px] text-black">
                {item.title}
              </div>
              <div className="text-base text-[#5A6682] font-normal">
                {item.description}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SellerCards;
