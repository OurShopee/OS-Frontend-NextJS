import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { MediaQueries } from "../utils";

const BudgetSection = ({ BudgetSectionData }) => {
  const { isMobile } = MediaQueries();
  const currentcountry = useSelector(
    (state) => state?.globalslice?.currentcountry
  );

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
          {!isMobile ? (
            <>
              <span className="italic">SOMETHING FOR EVERY BUDGET</span>
              <span
                role="img"
                aria-label="sparkle"
                className="ml-2 align-middle"
              >
                ✨
              </span>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-[8px]">
                {/* Top line */}
                <span
                  className="text-2xl font-bold italic uppercase relative"
                  style={{
                    color: "#fff",
                    textShadow: "-3px 3px 0 #000, -6px 6px 0 #000",
                    paddingBottom: "0.05em",
                  }}
                >
                  <span className="relative z-10">Something For</span>
                </span>
                {/* Bottom line */}
                <span
                  className="flex justify-end mt-[-18px] text-2xl font-bold italic uppercase relative mr-4"
                  style={{
                    color: "#fff",
                    textShadow: "-3px 3px 0 #000, -6px 6px 0 #000",
                  }}
                >
                  <span className="relative z-10 mr-2">Every Budget</span>
                  {/* Sparkle SVGs */}
                  <span
                    role="img"
                    aria-label="sparkle"
                    className="align-middle"
                  >
                    ✨
                  </span>
                </span>
              </div>
            </>
          )}
        </div>
        {!isMobile ? (
          <div className="flex justify-center flex-wrap gap-14">
            {BudgetSectionData?.map((i, idx) => (
              <Link key={idx} href={i?.url}>
                <img
                  src={i?.desktopImage}
                  alt="No image found"
                  className="w-[199px] h-[197px] object-contain"
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-around gap-2 px-6">
            {BudgetSectionData?.map((i, idx) => (
              <Link key={idx} href={i?.url}>
                <img
                  src={i?.mobileImage}
                  alt="No image found"
                  className="w-[120px] h-[120px] md:w-[199px] md:h-[197px] object-contain"
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetSection;
