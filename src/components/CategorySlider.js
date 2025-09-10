"use client";
import React from "react";
import Marquee from "react-fast-marquee";
import { useRouter } from "next/navigation";
import { pushToDataLayer } from "./utils/dataUserpush";
import { useSelector } from "react-redux";

export default function CategorySlider({ categoryList }) {
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const router = useRouter();

  return (
    <div className="w-full bg-white pt-2 overflow-visible">
      <Marquee
        autoFill={true}
        speed={10}
        play={true}
        pauseOnHover
        pauseOnClick
        gradient={false}
        className="gap-1 overflow"
      >
        {categoryList.map((cat, idx) => (
          <div
            key={idx}
            className="group w-[6.3rem] mx-0 relative flex flex-col items-center justify-start overflow-visible cursor-pointer"
            onClick={() => {
              pushToDataLayer("clicked_category", currentcountry.name, {
                category_name: cat.category_name,
                page:
                  typeof window !== "undefined" ? window.location.pathname : "",
              });
              router.push("/categories/" + cat.url);
            }}
          >
            <div className="relative transition-transform duration-[300ms] group-hover:duration-[800ms] group-hover:scale-110 z-10 flex flex-col items-center justify-start">
              <div className="w-16 h-16 rounded-full flex items-center justify-center">
                <img
                  src={cat.vector_icon}
                  alt={cat.category_name}
                  className="w-full h-full object-contain"
                  style={{
                    filter: "drop-shadow(0px 4px 2px rgba(0, 0, 0, 0.2))",
                  }}
                />
              </div>
              <h5 className="mt-1 text-[13px] text-center font-medium text-gray-700 leading-tight min-h-10">
                {cat.category_name}
              </h5>
            </div>
          </div>
        ))}
      </Marquee>
    </div>
  );
}
