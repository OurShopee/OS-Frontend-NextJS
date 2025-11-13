import React from "react";
import { useSelector } from "react-redux";

const BudgetSection = () => {
  const currentcountry = useSelector(
    (state) => state?.globalslice?.currentcountry
  );
  const budgetImages = [
    {
      image: "under_1.png",
    },
    {
      image: "under_2.png",
    },
    {
      image: "under_3.png",
    },
    {
      image: "under_4.png",
    },
  ];

  return (
    <div className="px-5">
      <div
        className="rounded-[18px] overflow-hidden pt-5 pb-8"
        style={{
          background: "url(/assets/black-friday/bg-under-section.png)",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="text-white text-center font-black text-[2.5rem] tracking-wide mb-3 drop-shadow-[2px_2px_0px_black] font-sans">
          <span className="italic">SOMETHING FOR EVERY BUDGET</span>
          <span role="img" aria-label="sparkle" className="ml-2 align-middle">
            ✨
          </span>
        </div>
        <div className="flex justify-center flex-wrap gap-14">
          {budgetImages.map((i, idx) => (
            <img
              key={idx}
              src={`${process.env.NEXT_PUBLIC_S3_PREFIX_BLACK_FRIDAY}/${currentcountry.currency}/${i.image}`}
              alt="No image found"
              className="w-[199px] h-[197px] object-contain"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BudgetSection;
