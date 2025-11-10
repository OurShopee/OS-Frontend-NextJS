"use client";
import React, { useRef, useCallback, useState, useEffect, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel, Keyboard, Grid, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/grid";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { MediaQueries } from "../utils";
import { ProductCard } from "../Common";
import Link from "next/link";
import { useSelector } from "react-redux";

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
  topSellingData,
}) {
  console.log(topSellingData,"topSellingData");
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
      200: { slidesPerView: 2 },
      375: { slidesPerView: isMobile ? 2 : 1 },
      425: { slidesPerView: isMobile ? 2 : 1 },
      760: { slidesPerView: isMobile ? 2 : 1 },
      1000: { slidesPerView: 1 },
      1200: { slidesPerView: 2 },
      1400: { slidesPerView: 2 },
      1600: { slidesPerView: 2 },
    };
  }, [breakPointsProps, type, isMobile]);

  // Desktop arrows (unchanged)
  const btnBaseDesktop =
    "hidden lg:grid place-items-center h-28 w-8 rounded-2 border border-gray-200 bg-white/90 shadow-md backdrop-blur cursor-pointer";
  const btnDisabled = "opacity-30 pointer-events-none";

  // Mobile overlay arrows (edge-hugging)
  const btnMobileOverlay =
    "lg:hidden absolute top-1/2 -translate-y-1/2 grid place-items-center h-[58px] w-8 rounded-2 border border-gray-200 bg-white shadow-md z-20";

  return (
    <div className="pt-3.5 px-2 shadow-bg-top-selling max-h-[348px] overflow-hidden">
      <div className="flex items-center justify-between mb-3 px-3.5">
        <div className="flex items-center gap-1.5">
          <h2 className="top-selling-shimmer relative text-[26px] font-[800] italic">
            {topSellingData?.heading}
          </h2>
          {(topSellingData?.icon_image?.[0]?.mobileImage || topSellingData?.icon_image?.[0]?.desktopImage) && 
          <img
            src={isMobile ? topSellingData?.icon_image[0]?.mobileImage : topSellingData?.icon_image[0]?.desktopImage}
            alt=""
            className="w-8 h-8"
          />}
        </div>
        <button className="text-[#43494B] font-semibold flex items-center">
          View all <IoChevronForward size={18} />
        </button>
      </div>

      <div
        className={`carousel_products bg-transparent pt-0 ${
          (type == 2 || type == 3) && "p-0"
        } ${isMobile ? "flex flex-col gap-1" : "flex items-stretch gap-1"}`}
        style={{ background: !isMobile && inner_bg }}
      >
        {/* LEFT ARROW – Desktop (unchanged) */}
        <button
          type="button"
          className={`${btnBaseDesktop} self-center ${
            isBeginning ? btnDisabled : ""
          }`}
          onClick={handlePrev}
          disabled={isBeginning}
          aria-disabled={isBeginning}
          aria-label="Previous"
        >
          <IoChevronBack size={22} />
        </button>

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

        {/* SWIPER: mobile gets inner padding + edge arrows; desktop unchanged */}
        <div className="flex-1 min-w-0">
          <div className="relative lg:static px-6 lg:px-0">
            {/* LEFT ARROW – Mobile (edge) */}
            <button
              type="button"
              className={`${btnMobileOverlay} -left-[.75rem] ${
                isBeginning
                  ? "opacity-30 pointer-events-none"
                  : "pointer-events-auto"
              }`}
              onClick={handlePrev}
              aria-label="Previous"
            >
              <IoChevronBack size={22} />
            </button>

            {/* RIGHT ARROW – Mobile (edge) */}
            <button
              type="button"
              className={`${btnMobileOverlay} -right-[.75rem] ${
                isEnd ? "opacity-30 pointer-events-none" : "pointer-events-auto"
              }`}
              onClick={handleNext}
              aria-label="Next"
            >
              <IoChevronForward size={22} />
            </button>

            <Swiper
              cssMode={!isMobile && true}
              mousewheel={true}
              keyboard={true}
              autoplay={{
                delay: 2000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              // pagination={paginationConfig}
              navigation={false}
              modules={
                isMobile
                  ? [Grid, Pagination, Autoplay]
                  : [
                      Grid,
                      Pagination,
                      Navigation,
                      Mousewheel,
                      Keyboard,
                      Autoplay,
                    ]
              }
              grid={
                type == 1 && isMobile ? { rows: 2, fill: "row" } : undefined
              }
              onSwiper={handleSwiperInit}
              onSlideChange={handleSlideChange}
              breakpoints={breakPoints}
              spaceBetween={isMobile ? 8 : 15}
              className="carouselSwiper h-full"
              ref={swiperContainerRef}
            >
              {topSellingData?.items?.length > 0 &&
                topSellingData?.items?.map((item, index) => {
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

        {/* RIGHT ARROW – Desktop (unchanged) */}
        <button
          type="button"
          className={`${btnBaseDesktop} self-center ${
            isEnd ? btnDisabled : ""
          }`}
          onClick={handleNext}
          disabled={isEnd}
          aria-disabled={isEnd}
          aria-label="Next"
        >
          <IoChevronForward size={22} />
        </button>
      </div>
      <style jsx>{`
        .top-selling-shimmer {
          position: relative;
          color: transparent;
          -webkit-text-fill-color: transparent;
          background: linear-gradient(100deg, #0f0f0f 0%, #838383 40%, #c3c0c0 50%, #838383 60%, #0f0f0f 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          animation: shineText 2.5s linear infinite;
        }

        @keyframes shineText {
          0% { background-position: 200% center; }
          100% { background-position: 0% center; }
        }
      `}</style>
    </div>
  );
}
