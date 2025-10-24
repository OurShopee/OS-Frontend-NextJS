"use client";
import { gsap } from "gsap";
import lines from "@/images/lines.svg";
import { useLayoutEffect, useRef } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import MediaQueries from "../utils/MediaQueries";
import { useRouter } from "next/navigation";

const SellerAlignCards = ({ data }) => {
  const leftItems = data.filter((item) => item.id % 2 === 1);
  const rightItems = data.filter((item) => item.id % 2 === 0);
  const containerRef = useRef(null);
  const { isMobile } = MediaQueries();
  const router = useRouter();

  useLayoutEffect(() => {
    const cards = containerRef.current.querySelectorAll("[data-card]");
    gsap.fromTo(
      cards,
      { autoAlpha: 0, y: 40 },
      { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.2, ease: "power3.out" }
    );
  }, []);

  const renderCard = (card, number, offset) => (
    <div
      data-card
      key={number}
      className={`group relative overflow-hidden rounded-2xl shadow-xl w-[263px] h-[334px] flex-shrink-0 ${
        offset ? "mt-[115px] xl:mt-[115px]" : ""
      } xl:mt-0`}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7051DE] to-[#967BF9]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F7F7F7] to-[#F7F7F7] opacity-[90%] xl:opacity-[0%] group-hover:xl:opacity-[90%] transition-opacity duration-500 ease-in-out" />
      </div>

      {/* Lines overlay */}
      <img
        className="absolute inset-0 pointer-events-none z-0 group-hover:opacity-30 transition-all ease-in-out duration-500"
        src={lines.src}
        alt="img"
      />

      {/* Number */}
      <span
        className={`select-none
          absolute top-0 right-4 z-10 text-[3.75rem]  xl:text-[6.2rem] group-hover:font-bold font-bold xl:font-extrabold opacity-[39%]
          transition-all duration-[500ms] ease-[cubic-bezier(0.4,0,0.2,1)]
          group-hover:text-[3.75rem] text-[#5232C2] xl:text-[#F9F8FF] group-hover:text-[#5232C2]
        `}
      >
        {String(number).padStart(2, "0")}
      </span>

      {/* Card Content */}
      <div
        className={`absolute inset-0 flex items-center p-5 z-24 transform 
          ${number === 3 ? "xl:translate-y-[45%]" : "xl:translate-y-[55%]"} 
          group-hover:translate-y-[0%] transition-transform duration-[500ms] 
          ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:bg-[#ffffff73] ${
            isMobile ? "bg-[#ffffff73]" : ""
          } `}
      >
        <div className="flex flex-col gap-8">
          <div>
            <h3 className="text-2xl xl:text-4xl group-hover:text-2xl font-bold transition-all duration-[650ms] text-black xl:text-white group-hover:text-black">
              {card.name}
            </h3>
            <div className="flex gap-2 xl:mb-3">
              <span className="block h-1.5 w-12 rounded-full bg-[#5232C2] opacity-80" />
              <span className="block h-1.5 w-6 rounded-full bg-[#5232C2] opacity-80" />
            </div>
          </div>
          <p className="text-base font-medium text-gray-800 mb-4">
            {card.description}
          </p>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={() => router.push("/onboarding")}
        className="xl:opacity-0 group-hover:opacity-100 duration-500 delay-[150ms] transition-all ease-in-out absolute bottom-4 left-4 bg-[#5232C2] text-white font-medium text-sm px-1.5 py-2 rounded-lg border-none flex items-center gap-2"
      >
        Become a Seller
        <span>
          <FaArrowRightLong />
        </span>
      </button>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="
        xl:flex xl:justify-center xl:gap-5 xl:py-7
        flex flex-row xl:flex-row
        overflow-x-auto xl:overflow-visible
        space-x-5 xl:space-x-0
        py-5
      "
    >
      {/* Mobile: render all items in one row  */}
      {/* Desktop: Keep left/right column split */}
      <div className="hidden xl:flex flex-col items-center space-y-5">
        {leftItems.map((card, i) => renderCard(card, card.id, i === 1))}
      </div>
      <div className="hidden xl:flex flex-col items-end space-y-5">
        {rightItems.map((card, i) => renderCard(card, card.id, i === 0))}
      </div>

      {/* Mobile layout: single horizontal scroll */}
      <div className="flex xl:hidden flex-row gap-5">
        {data.map((card) => renderCard(card, card.id, false))}
      </div>
    </div>
  );
};

export default SellerAlignCards;
