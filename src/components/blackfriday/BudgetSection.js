import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";

const BudgetSection = () => {
  const currentcountry = useSelector(
    (state) => state?.globalslice?.currentcountry
  );

  const budgetImages = [
    {
      image: "under_1.png",
      url: currentcountry.min_max1 || "",
    },
    {
      image: "under_2.png",
      url: currentcountry.min_max2 || "",
    },
    {
      image: "under_3.png",
      url: currentcountry.min_max3 || "",
    },
    {
      image: "under_4.png",
      url: currentcountry.min_max4 || "",
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
            <Link key={idx} href={i?.url}>
              <img
                src={`${process.env.NEXT_PUBLIC_S3_PREFIX_BLACK_FRIDAY}/${currentcountry.currency}/${i.image}`}
                alt="No image found"
                className="w-[199px] h-[197px] object-contain"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BudgetSection;
