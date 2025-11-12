// DiscountCard.js
import React from "react";
import mwebGreenCard from "./images/mwebGreenCard.png";

const MobileViewCard = ({
  imageSrc,
  discount,
  title,
  className = "",
  width,
  height,
}) => {
  return (
    <div
      className={`
        relative w-full h-[130px]
        rounded-xl overflow-hidden
        bg-cover bg-center
        px-3 pt-2
        ${className}
      `}
      style={{ backgroundImage: `url(${mwebGreenCard})` }}
    >
      {/* Text block */}
      <div
        className="relative z-[1] flex flex-col max-w-[60%] "
        style={{ fontFamily: "'Readex Pro', sans-serif" }}
      >
        <span className="text-[18px] leading-[14px] font-extrabold text-[#3E4130]">
          upto
        </span>

        <span className="text-[18px] leading-[23px] whitespace-nowrap font-extrabold text-[#3E4130]">
          {discount}% OFF
        </span>

        <span className="mt-1 text-[12px] leading-[14px] font-semibold text-[#3E4130]">
          {title}
        </span>
      </div>

      {/* Product image */}
      <div className="absolute right-1 bottom-0  flex items-end justify-end pointer-events-none">
        <img
          src={imageSrc}
          alt={title}
          className="h-full w-auto object-contain"
          style={{
            width: width ?? "auto",
            height: height ?? "100%",
          }}
        />
      </div>
    </div>
  );
};

export default MobileViewCard;
