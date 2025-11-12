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
    w-[300px] !h-[150px]
    rounded-xl
    flex
    pt-1
    pl-[20px]
    overflow-hidden
    bg-cover bg-center
    ${className}
  `}
      style={{ backgroundImage: `url(${cardBg})` }}
    >
      {/* Text block */}
      <div className="flex flex-col max-w-[60%] justify-center gap-1">
        <div className="flex flex-col gap-2">
          <span className="text-[30px] font-extrabold text-[#3E4130] leading-none">
            upto
          </span>
          <span className="text-[30px] font-extrabold whitespace-nowrap text-[#3E4130] leading-none -mt-1">
            {discount}% OFF
          </span>
        </div>
        <span className="text-lg font-semibold max-w-[120px] text-[#3E4130]">
          {title}
        </span>
      </div>

      {/* Product image */}
      <div
        className={`absolute -bottom-10 group-hover:-bottom-5 transition-all duration-1000 ease-in-out right-0 w-36 h-40 flex-shrink-0`}
      >
        <img
          src={imageSrc}
          alt={title}
          className="object-contain w-full h-full"
        />
      </div>
    </div>
  );
};

export default DiscountCard;
