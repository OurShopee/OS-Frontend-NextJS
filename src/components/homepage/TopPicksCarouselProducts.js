"use client";
import React, { useCallback, useMemo, useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import Link from "next/link";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Grid, Mousewheel } from "swiper/modules";
import { ProductCard } from "../Common";
import { MediaQueries } from "../utils";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
// import required modules

export default function TopPicksCarouselProducts({
  products,
  type,
  inner_bg,
  breakPointsProps,
  section_name,
}) {
  const { isMobile } = MediaQueries();

  const sliderRef = useRef(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const breakPoints = useMemo(() => {
    if (breakPointsProps) return breakPointsProps;

    return {
      200: {
        slidesPerView: 1.3,
      },
      375: {
        slidesPerView: (type == 2 && 1.7) || (type == 1 && 2),
      },
      425: {
        slidesPerView: 2,
      },
      760: {
        slidesPerView: (type == 2 && 3) || (type == 1 && 3.3),
      },
      1000: {
        slidesPerView:
          (type == 2 && 2) || (type == 1 && 4.2) || (type == 3 && 3.5),
      },
      1200: {
        slidesPerView:
          (type == 2 && 2.5) || (type == 1 && 5.5) || (type == 3 && 4.5),
      },
      1400: {
        slidesPerView:
          (type == 2 && 2.5) || (type == 1 && 5.5) || (type == 3 && 4.5),
      },
      1600: {
        slidesPerView:
          (type == 2 && 3.5) || (type == 1 && 7.5) || (type == 3 && 5.5),
      },
    };
  }, [breakPointsProps, type]);

  return (
    <div
      className={`carousel_products p-0`}
      style={{ background: !isMobile && inner_bg }}
    >
      <Swiper
        cssMode={!isMobile && true}
        mousewheel={true}
        keyboard={true}
        pagination={false}
        navigation={false}
        ref={sliderRef}
        modules={[Grid, Mousewheel]}
        grid={type == 1 && isMobile && { rows: 2, fill: "row" }} // 2 rows
        onSwiper={(swiper) => {
          setTimeout(() => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }, 0);
        }}
        onSlideChange={handleSlideChange}
        breakpoints={breakPoints}
        spaceBetween={isMobile ? 8 : 15}
        className="carouselSwiper"
      >
        {products &&
          products.length > 0 &&
          products.map((item, index) => {
            var url = item.url.split("/");

            return (
              <SwiperSlide key={index}>
                {item.hasOwnProperty("sku") ? (
                  <>
                    {url.length >= 2 ? (
                      <Link
                        href={`/details/${item.url}`}
                        className="no-underline"
                      >
                        <ProductCard item={item} section_name={section_name} />
                      </Link>
                    ) : (
                      <Link
                        href={`/details/${item.url}/${item.sku}`}
                        className="no-underline"
                      >
                        <ProductCard item={item} section_name={section_name} />
                      </Link>
                    )}
                  </>
                ) : (
                  <Link href={`/details/${item.url}`} className="no-underline">
                    <ProductCard item={item} section_name={section_name} />
                  </Link>
                )}
              </SwiperSlide>
            );
          })}
        {!isMobile && products?.length > 0 && (
          <div className="arrows">
            {/* Show left arrow only when not at the beginning */}
            {!isBeginning ? (
              <div className="left_indicator previous" onClick={handlePrev}>
                <IoChevronBack size={25} />
              </div>
            ) : (
              <div className="left_indicator previous disabled no_bg no_drop_shadow">
                <span className="hidden"></span>
              </div>
            )}

            {/* Show right arrow if more slides are available */}
            {!isEnd ? (
              <div className="right_indicator next" onClick={handleNext}>
                <IoChevronForward size={25} />
              </div>
            ) : (
              <div className="right_indicator next disabled no_bg no_drop_shadow">
                <span className="hidden"></span>
              </div>
            )}
          </div>
        )}
      </Swiper>
    </div>
  );
}
