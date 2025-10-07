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

export default function CarouselProducts({
  products,
  type,
  inner_bg,
  type2,
  eid_sale,
  breakPointsProps,
  imgUrl = "",
  imgPostUrl = "",
  imgRedirectionUrl = "",
  imgPostRedirectionUrl = "",
  section_name,
}) {
  const { isMobile } = MediaQueries();
  const swiperContainerRef = useRef(null);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [swiperHeight, setSwiperHeight] = useState(0);

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

  // Update swiper height when component mounts and when window resizes
  useEffect(() => {
    const updateSwiperHeight = () => {
      if (swiperContainerRef.current) {
        setSwiperHeight(swiperContainerRef.current.offsetHeight);
      }
    };

    updateSwiperHeight();
    window.addEventListener("resize", updateSwiperHeight);

    return () => {
      window.removeEventListener("resize", updateSwiperHeight);
    };
  }, [products]);

  // Update height when swiper is ready
  const handleSwiperInit = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);

    // Update height after swiper is initialized
    setTimeout(() => {
      if (swiperContainerRef?.current) {
        setSwiperHeight(swiperContainerRef?.current?.offsetHeight);
      }

      // Check if swiper is scrollable (i.e. more slides than visible)
      if (swiper?.slides?.length > swiper?.params?.slidesPerView) {
        setIsEnd(swiper?.isEnd);
        setIsBeginning(swiper?.isBeginning);
      } else {
        setIsEnd(true); // force hide right arrow
        setIsBeginning(true); // force hide left arrow
      }
    }, 200);
  };

  const breakPoints = useMemo(() => {
    if (breakPointsProps) return breakPointsProps;

    return {
      200: { slidesPerView: 1 },
      375: { slidesPerView: type == 2 ? 2 : 2 },
      425: { slidesPerView: 2 },
      760: { slidesPerView: type == 2 ? 3 : 3 },
      1000: { slidesPerView: type == 2 ? 2 : 4 },
      1200: { slidesPerView: type == 2 ? 3 : 4 },
      1400: { slidesPerView: type == 2 ? 3 : 5 },
      1600: { slidesPerView: type == 2 ? 4 : 5 },
    };
  }, [breakPointsProps, type]);

  return (
    <div
      className={`carousel_products ${eid_sale && "bg-transparent"} ${
        (type == 2 || type == 3) && "p-0"
      } ${isMobile ? "flex flex-col gap-4" : "flex gap-4"}`}
      style={{ background: !isMobile && inner_bg }}
    >
      {imgUrl !== "" && (
        <Link href={imgRedirectionUrl}>
          <div className="min-w-[200px] lg:min-w-[300px]">
            <img
              data-aos="fade-right"
              data-aos-easing="ease-in-out"
              src={imgUrl}
              alt={imgUrl}
              className="w-full object-cover rounded-2xl"
              style={
                isMobile
                  ? { maxHeight: "300px" } // ✅ Mobile: limit max height
                  : swiperHeight > 0
                  ? { height: `${swiperHeight}px` } // ✅ Desktop: fixed height
                  : {}
              }
            />
          </div>
        </Link>
      )}
      <Swiper
        cssMode={!isMobile && true}
        mousewheel={true}
        keyboard={true}
        pagination={false} // keep false since you're not showing bullets
        navigation={false} // false since you're using custom arrows
        modules={
          isMobile
            ? [Grid]
            : [Grid, Pagination, Navigation, Mousewheel, Keyboard]
        }
        grid={type == 1 && isMobile ? { rows: 2, fill: "row" } : undefined}
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
      {imgPostUrl !== "" && (
        <Link href={imgPostRedirectionUrl}>
          <div style={{ minWidth: "300px" }}>
            <img
              data-aos="fade-left"
              data-aos-easing="ease-in-out"
              src={imgPostUrl}
              alt={imgPostUrl}
              className="w-full object-cover rounded-2xl"
              style={
                isMobile
                  ? { maxHeight: "300px" } // ✅ Mobile: limit max height
                  : swiperHeight > 0
                  ? { height: `${swiperHeight}px` } // ✅ Desktop: fixed height
                  : {}
              }
            />
          </div>
        </Link>
      )}
    </div>
  );
}
