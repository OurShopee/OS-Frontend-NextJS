import React from "react";
import { useSelector } from "react-redux";
import { CarouselProducts } from "../homepage";

const LowestPriceSection = ({ LowestPriceEver }) => {
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  return (
    <div className="px-5">
      <div className="component_1 rounded-[16px] overflow-hidden">
        <div
          className="py-3 w-full"
          style={{
            background:
              "url(https://cdn.ourshopee.com/ourshopee-img/blackFriday/web/lowerPrice.png)",
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            minHeight: "100%",
          }}
        >
          <div className="relative flex items-center justify-center w-full">
            {/* Text: LOWEST PRICE EVER */}
            <img src="//cdn.ourshopee.com/ourshopee-img/blackFriday/web/lowestPrice/lowest_price.png"
              alt="lowest price"
              className="relative z-20 transform -rotate-[5deg] w-[260px] h-[130px] drop-shadow-[2px_3px_2px_rgba(0,0,0,0.5)]"
            loading="lazy" />
            <img src="//cdn.ourshopee.com/ourshopee-img/blackFriday/web/lowestPrice/sale.gif"
              alt="sale"
              className="absolute z-10 transform -rotate-[13deg] translate-x-[90px] translate-y-[0px] w-[80px] h-auto"
            loading="lazy" />
          </div>

          <CarouselProducts
            products={LowestPriceEver}
            type={1}
            className="p-0"
            inner_bg={"transparent"}
            color={true}
            breakPointsProps={{
              200: { slidesPerView: 1.3 },
              375: { slidesPerView: 1.5 },
              425: { slidesPerView: 1.5 },
              500: { slidesPerView: 1.7 },
              660: { slidesPerView: 3 },
              760: { slidesPerView: 3 },
              1000: { slidesPerView: 4 },
              1200: { slidesPerView: 4 },
              1400: { slidesPerView: 6 },
              1600: { slidesPerView: 6 },
            }}
          />
          <div className="flex justify-end px-1">
            <span
              className="text-[12px] md:text-base font-semibold text-white mr-3"
              style={{ fontFamily: "'Atma', sans-serif" }}
            >
              *For Cart Value {currentcountry?.currency}{" "}
              {currentcountry?.min_value} & Above
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LowestPriceSection;
