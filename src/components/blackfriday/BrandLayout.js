import React from "react";
import Marquee from "react-fast-marquee";
import { NavLink } from "react-router-dom";

export default function BrandLayout({ topBrands }) {
  return (
    <>
      <h1
        style={{ wordSpacing: "-8px" }}
        className="font-pressStar text-[#6F340F] text-center text-xl uppercase font-semibold leading-6 mb-4"
      >
        Brands you love
      </h1>
      <Marquee
        autoFill={true}
        speed={20}
        play={true}
        pauseOnHover
        pauseOnClick
        gradient={false}
        className="overflow"
      >
        <div className="flex gap-4 flex-wrap w-fit">
          {Array.from({ length: Math.ceil(topBrands.length / 3) }).map(
            (_, groupIndex) => {
              const baseIndex = groupIndex * 3;
              const brand1 = topBrands[baseIndex];
              const brand2 = topBrands[baseIndex + 1];
              const brand3 = topBrands[baseIndex + 2];
              return (
                <div key={groupIndex} className="flex gap-4 last:mr-4">
                  {/* Left Large Box */}
                  {brand1 && (
                    <div className="bg-gradient-to-r relative p-2 from-[#F4E0BB] to-[#FFF6DF] rounded-xl flex items-center justify-center w-[160px] h-[160px]">
                      <NavLink to={brand1?.url}>
                        <img
                          loading="lazy"
                          className="h-full w-full mix-blend-multiply"
                          src={brand1?.mobileImage}
                          alt="brand"
                        />
                      </NavLink>
                    </div>
                  )}

                  {/* Right Side: Two stacked small boxes */}
                  <div className="flex flex-col gap-4">
                    {brand2 && (
                      <div className="bg-gradient-to-r relative p-2 from-[#F4E0BB] to-[#FFF6DF] rounded-xl flex flex-col items-center justify-center w-[160px] h-[75px]">
                        <NavLink to={brand2?.url}>
                          <img
                            loading="lazy"
                            className="h-full w-full mix-blend-multiply"
                            src={brand2?.mobileImage}
                            alt="brand"
                          />
                        </NavLink>
                      </div>
                    )}
                    {brand3 && (
                      <div className="bg-gradient-to-r relative p-2 from-[#F4E0BB] to-[#FFF6DF] rounded-xl flex items-center justify-center w-[160px] h-[75px]">
                        <NavLink to={brand3?.url}>
                          <img
                            loading="lazy"
                            className="h-full w-full mix-blend-multiply"
                            src={brand3?.mobileImage}
                            alt="brand"
                          />
                        </NavLink>
                      </div>
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </Marquee>
    </>
  );
}
