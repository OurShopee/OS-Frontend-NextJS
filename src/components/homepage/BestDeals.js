"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import { Grid, Keyboard, Mousewheel, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ProductCard } from "../Common";
import { MediaQueries } from "../utils";
import TopPicksCarouselProducts from "./TopPicksCarouselProducts";
import Carousel from "../Common/Carousel";

function BestDeals({ carousel_data, breakPointsProps }) {
  const sliderRef = useRef(null);
  const rightColRef = useRef(null); // step 1: ref
  const { isMobile, isTablet, isLaptop } = MediaQueries();
  const [index, setIndex] = useState(0);
  const [rightHeight, setRightHeight] = useState(0); // step 2: state for height

  const [data, setData] = useState([]);

  const paginationConfig = useMemo(() => {
    if (!isMobile) return false;

    return {
      clickable: true,
    };
  }, [isMobile]);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
    setTimeout(() => {
      if (carousel_data[selectedIndex].productlist != undefined) {
        setData(carousel_data[selectedIndex].productlist);
      } else {
        setData([]);
      }
    }, 300);
  };

  useEffect(() => {
    if (carousel_data?.[0]?.productlist !== undefined) {
      setData(carousel_data[0].productlist);
    } else {
      setData([]);
    }
  }, [carousel_data]);

  // step 3: sync height after render
  useEffect(() => {
    if (rightColRef.current) {
      setRightHeight(rightColRef.current.offsetHeight);
    }
  }, [data, isTablet, isMobile]); // update height when data or layout changes

  return (
    <div className="flex flex-wrap -mx-2">
      {/* step 4: apply inline height */}
      <div
        className="w-full lg:w-1/3 px-2 padding_custom"
        style={!isMobile && !isTablet ? { height: rightHeight } : {}}
      >
        <div className="relative rounded-2xl overflow-hidden bg-[#2d2d2d] h-full">
          <Carousel
            fade
            controls={false}
            className="home_carousel top_picks_carousel h-full"
            indicators={false}
            activeIndex={index}
            onSelect={handleSelect}
          >
            {carousel_data?.map((item) => (
              <Carousel.Item key={item.brand_id} className="h-full relative">
                <img
                  src={item.image_slider}
                  alt=""
                  className="w-full h-full rounded-2xl"
                />
              </Carousel.Item>
            ))}
          </Carousel>

          <div className="absolute bottom-8 -right-6 -translate-x-1/2 flex items-center gap-2 z-10">
            {carousel_data?.map((_, index1) => (
              <motion.div
                key={index1}
                onClick={() => {
                  setIndex(index1);
                  if (carousel_data[index1].productlist !== undefined) {
                    setData(carousel_data[index1].productlist);
                  } else {
                    setData([]);
                  }
                }}
                className="h-2 cursor-pointer"
                animate={{
                  width: 43,
                  height: index === index1 ? 5 : 3,
                  backgroundColor: index === index1 ? "#facc15" : "#FFFFFF",
                  borderRadius: 9999,
                }}
                transition={{ duration: 0.3 }}
                style={{ height: 8 }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* step 1: apply ref here */}
      <div
        className={`w-full lg:w-2/3 px-2 ${isLaptop && "!mt-3"}`}
        ref={rightColRef}
      >
        {isTablet ? (
          <Swiper
            ref={sliderRef}
            effect={"fade"}
            pagination={paginationConfig}
            modules={
              isMobile
                ? [Grid, Pagination]
                : [Grid, Pagination, Navigation, Mousewheel, Keyboard]
            }
            grid={isTablet ? { rows: 2, fill: "row" } : undefined}
            breakpoints={{
              200: { slidesPerView: 2 },
              375: { slidesPerView: 2 },
              425: { slidesPerView: 2 },
              760: { slidesPerView: 3 },
              1000: { slidesPerView: 3 },
              1200: { slidesPerView: 3 },
              1400: { slidesPerView: 4 },
              1600: { slidesPerView: 4 },
            }}
            spaceBetween={isTablet ? 8 : 15}
            className="carouselSwiper"
          >
            {data.map((item) => {
              return (
                <SwiperSlide key={item.sku}>
                  <Link href={`/details/${item.url}`} className="no-underline">
                    <ProductCard item={item} />
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : (
          <TopPicksCarouselProducts
            products={data}
            type={3}
            inner_bg={"rgba(238, 235, 250, 1)"}
            breakPointsProps={breakPointsProps}
            section_name={"Top Picks"}
          />
        )}
      </div>
    </div>
  );
}

export default BestDeals;
