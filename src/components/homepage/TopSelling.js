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
import { useSelector } from "react-redux";
import { MdNavigateNext } from "react-icons/md";

export default function TopSelling({
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
  const products_brand = useSelector((state) => state?.homeslice?.brand_week);
  const products = products_brand?.[0]?.items;

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

  useEffect(() => {
    const updateSwiperHeight = () => {
      if (swiperContainerRef.current) {
        setSwiperHeight(swiperContainerRef.current.offsetHeight);
      }
    };
    updateSwiperHeight();
    window.addEventListener("resize", updateSwiperHeight);
    return () => window.removeEventListener("resize", updateSwiperHeight);
  }, [products]);

  const paginationConfig = useMemo(() => {
    if (!isMobile) return false;
    return { clickable: true };
  }, [isMobile]);

  const handleSwiperInit = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
    setTimeout(() => {
      if (swiperContainerRef?.current) {
        setSwiperHeight(swiperContainerRef?.current?.offsetHeight);
      }
      if (swiper?.slides?.length > swiper?.params?.slidesPerView) {
        setIsEnd(swiper?.isEnd);
        setIsBeginning(swiper?.isBeginning);
      } else {
        setIsEnd(true);
        setIsBeginning(true);
      }
    }, 200);
  };

  const breakPoints = useMemo(() => {
    if (breakPointsProps) return breakPointsProps;
    return {
      200: { slidesPerView: 1 },
      375: { slidesPerView: isMobile ? 2 : 1 },
      425: { slidesPerView: isMobile ? 2 : 1 },
      760: { slidesPerView: isMobile ? 2 : 1 },
      1000: { slidesPerView: 1 },
      1200: { slidesPerView: 1.2 },
      1400: { slidesPerView: 2 },
      1600: { slidesPerView: 2 },
    };
  }, [breakPointsProps, type]);

  // Simple shared button styles (Tailwind)
  const btnBase =
    "hidden lg:grid place-items-center h-28 w-8 rounded-2 border border-gray-200 bg-white/90 shadow-md backdrop-blur cursor-pointer";
  const btnDisabled = "opacity-3 pointer-events-none"; // collapse when disabled

  return (
    <div className="pt-3.5 px-2 shadow-bg-top-selling max-h-[348px] overflow-hidden">
      <div className="flex items-center justify-between mb-3 px-3.5">
        <div className="flex items-center gap-1.5">
          <h2 className="text-[26px] font-[800] italic text-black">
            Top Selling
          </h2>
          <img
            src="/assets/homepage/flash-icon.png"
            alt="Discount"
            className="w-8 h-8"
          />
        </div>
        <button className="text-[#43494B] font-semibold flex items-center">
          View all
          <IoChevronForward size={18} />
        </button>
      </div>
      <div
        className={`carousel_products bg-transparent pt-0 ${
          (type == 2 || type == 3) && "p-0"
        } ${isMobile ? "flex flex-col gap-1" : "flex items-stretch gap-1"}`}
        style={{ background: !isMobile && inner_bg }}
      >
        {/* LEFT ARROW – sits BEFORE any media/slider */}
        {!isMobile && (
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
            <IoChevronBack size={22} />
          </button>
        )}

        {/* Optional left banner */}
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
                    ? { maxHeight: "300px" }
                    : swiperHeight > 0
                    ? { height: `${swiperHeight}px` }
                    : {}
                }
              />
            </div>
          </Link>
        )}

        {/* SWIPER as a flex item so arrows don't overlay */}
        <div className="flex-1 min-w-0">
          <Swiper
            cssMode={!isMobile && true}
            mousewheel={true}
            keyboard={true}
            pagination={paginationConfig}
            navigation={false}
            modules={
              isMobile
                ? [Grid, Pagination]
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
                const url = item?.url?.split("/");
                return (
                  <SwiperSlide key={index}>
                    {item.hasOwnProperty("sku") ? (
                      url?.length >= 2 ? (
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

        {/* Optional right banner */}
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
                    ? { maxHeight: "300px" }
                    : swiperHeight > 0
                    ? { height: `${swiperHeight}px` }
                    : {}
                }
              />
            </div>
          </Link>
        )}

        {/* RIGHT ARROW – sits AFTER the last column (end) */}
        {!isMobile && (
          <button
            type="button"
            className={`${btnBase} self-center ${isEnd ? btnDisabled : ""}`}
            onClick={handleNext}
            aria-disabled={isEnd}
            aria-label="Next"
          >
            <IoChevronForward size={22} />
          </button>
        )}
      </div>
    </div>
  );
}
