// DiscountCard.js
import React from "react";
import cardBg from "./images/cardBg.png";

const DiscountCard = ({
  imageSrc,
  discount,
  title,
  className = "",
  imageDimensions = "md:w-[150px] md:h-[164px]",
}) => {
  return (
    <div
      className={`
        group
        relative
        w-full
        min-h-[145px]
        rounded-xl
        flex
        items-center
        pt-4
        pb-4
        pl-5
        pr-4
        overflow-hidden
        bg-cover bg-center bg-white
        ${className}
      `}
      style={{
        backgroundImage: `url(${cardBg.src})`,
        height: "150px",
      }}
    >
      {/* Text block */}
      <div className="flex flex-col flex-1 justify-center gap-2 z-10">
        <span className="text-[12px] md:text-[16px] max-w-[140px] font-bold text-[#3E4130] leading-tight">
          {title}
        </span>
        <div className="flex flex-col">
          <span className="text-xl md:text-[28px] font-bold text-[#3E4130] group-hover:mt-1 group-hover:text-red-500 leading-none transition-all duration-300 ease-in-out">
            upto
          </span>
          <span className="text-xl md:text-[28px] font-bold text-[#3E4130] group-hover:text-[#FF1D1E]  leading-none transition-colors duration-300">
            {discount}% OFF
          </span>
        </div>
      </div>

      {/* Product image */}
      <div className="absolute -bottom-10 group-hover:-bottom-5 transition-all duration-1000 ease-in-out -right-[25px] w-36 h-40 flex-shrink-0 z-0">
        <img src={imageSrc}
          alt={title}
          className="object-contain w-full h-[135px] aspect-[135/145] group-hover:scale-110 group-hover:-translate-x-3 group-hover:-translate-y-1 transition-all duration-1000 ease-in-out"
        loading="lazy" />
      </div>
    </div>
  );
};

export default DiscountCard;
