"use client";
import React, {
  useRef,
  useCallback,
  useState,
  useEffect,
  useMemo,
} from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Mousewheel,
  Keyboard,
  Grid,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/grid";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { MediaQueries } from "../utils";
import { ProductCard } from "../Common";
import Link from "next/link";
import { useCurrentLanguage } from "@/hooks";

export default function CarouselProducts({
  products,
  type,
  inner_bg,
  type2,
  eid_sale,
  breakPointsProps,
  section_name,
  backgroundImage,
  indicators = true,
  color = false,
}) {
  const { isMobile } = MediaQueries();
  const swiperContainerRef = useRef(null);
  const currentLanguage = useCurrentLanguage();
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const isRTL = currentLanguage === "ar";

  const handlePrev = useCallback(() => {
    if (!swiperContainerRef.current) return;
    swiperContainerRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!swiperContainerRef.current) return;
    swiperContainerRef.current.swiper.slideNext();
  }, []);

  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper?.isEnd);
  };

  const handleSwiperInit = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);

    if (swiper?.slides?.length > swiper?.params?.slidesPerView) {
      setIsEnd(swiper?.isEnd);
      setIsBeginning(swiper?.isBeginning);
    } else {
      setIsEnd(true);
      setIsBeginning(true);
    }
  };

  const breakPoints = useMemo(() => {
    if (breakPointsProps) return breakPointsProps;
    return {
      200: { slidesPerView: 1.3 },
      375: { slidesPerView: 1.5 },
      435: { slidesPerView: 2 },
      525: { slidesPerView: 2 },
      600: { slidesPerView: 2 },
      700: { slidesPerView: 2 },
      800: { slidesPerView: 2.2 },
      900: { slidesPerView: 2.6 },
      1000: { slidesPerView: 3 },
      1100: { slidesPerView: 3 },
      1200: { slidesPerView: 4 },
      1300: { slidesPerView: 4 },
      1400: { slidesPerView: 5 },
      1500: { slidesPerView: 5 },
      1600: { slidesPerView: 5 },
    };
  }, [breakPointsProps, type]);

  const btnBase =
    "block lg:grid place-items-center  h-[74px] w-[25px] rounded-2 border border-gray-200 bg-white/90 shadow-md backdrop-blur cursor-pointer";
  const btnDisabled = "opacity-30 pointer-events-none";

  const swiperModules = useMemo(() => {
    return isMobile
      ? [Grid, Pagination]
      : [Grid, Pagination, Navigation, Mousewheel, Keyboard];
  }, [isMobile]);

  const gridConfig = useMemo(() => {
    return type == 1 && isMobile ? { rows: 1, fill: "row" } : undefined;
  }, [type, isMobile]);

  return (
    <div className="relative overflow-hidden">
      <img
        src={backgroundImage}
        className="sm:hidden absolute w-full h-full z-0 border-none"
      />
      <div
        className={`carousel_products px-1 bg-no-repeat bg-center bg-cover ${
          color && "bg-transparent"
        } ${(type == 2 || type == 3) && "p-0"} ${!indicators && "px-5"}`}
      >
        {/* LEFT ARROW - Desktop Only */}
        <div
          className={`${
            isMobile ? "flex gap-1 mt-[144px]" : "flex items-stretch gap-1"
          }`}
        >
          {indicators && (
            <button
              type="button"
              className={`${btnBase} self-center ${
                isBeginning ? btnDisabled : ""
              }`}
              onClick={handlePrev}
              disabled={isBeginning}
              aria-disabled={isBeginning}
              aria-label="Previous"
            >
              <img
                src="/assets/vector_icons/arrow_left.svg"
                alt="Arrow"
                className={`w-4 h-4 cursor-pointer grayscale  transition-transform ${
                  isRTL ? "rotate-180" : ""
                }`}
              />
            </button>
          )}

          {/* SWIPER */}
          <div className={`flex-1 min-w-0`}>
            <Swiper
              key={`carousel-${currentLanguage}`}
              dir={isRTL ? "rtl" : "ltr"}
              cssMode={!isMobile}
              mousewheel={!isMobile}
              keyboard={!isMobile}
              // pagination={paginationConfig}
              navigation={false}
              modules={swiperModules}
              grid={gridConfig}
              onSwiper={handleSwiperInit}
              onSlideChange={handleSlideChange}
              breakpoints={breakPoints}
              spaceBetween={isMobile ? 8 : 15}
              className="carouselSwiper h-full"
              ref={swiperContainerRef}
            >
              {products?.length > 0 &&
                products?.map((item, index) => {
                  const url = item.url.split("/");
                  return (
                    <SwiperSlide key={index}>
                      {item.hasOwnProperty("sku") ? (
                        url.length >= 2 ? (
                          <Link
                            href={`/details/${item.url}`}
                            className="no-underline h-full"
                          >
                            <ProductCard
                              item={item}
                              type={type}
                              type2={type2}
                              eid_sale={eid_sale}
                              section_name={section_name}
                            />
                          </Link>
                        ) : (
                          <Link
                            href={`/details/${item.url}/${item.sku}`}
                            className="no-underline h-full"
                          >
                            <ProductCard
                              item={item}
                              type={type}
                              type2={type2}
                              eid_sale={eid_sale}
                              section_name={section_name}
                            />
                          </Link>
                        )
                      ) : (
                        <Link
                          href={`/details/${item.url}`}
                          className="no-underline h-full"
                        >
                          <ProductCard item={item} eid_sale={eid_sale} />
                        </Link>
                      )}
                    </SwiperSlide>
                  );
                })}
            </Swiper>
          </div>

          {indicators && (
            <button
              type="button"
              className={`${btnBase} self-center ${isEnd ? btnDisabled : ""}`}
              onClick={handleNext}
              aria-disabled={isEnd}
              aria-label="Next"
            >
              <img
                src="/assets/vector_icons/arrow_right.svg"
                alt="Arrow"
                className={`w-4 h-4 cursor-pointer grayscale  transition-transform ${
                  isRTL ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
