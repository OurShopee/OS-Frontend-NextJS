import React, { useMemo, useRef } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/pagination';
import { MediaQueries } from '../utils';
// import required modules

export default function HomeCategories({ category_list, type, breakPointsProps }) {
  const { isMobile } = MediaQueries();

  const sliderRef = useRef(null);

  const breakPoints = useMemo(() => {
    if (breakPointsProps) return breakPointsProps;

    return {
      200: { slidesPerView: 1.3 },
      375: { slidesPerView: type == 2 ? 1.7 : 2 },
      425: { slidesPerView: 2 },
      760: { slidesPerView: type == 2 ? 3 : 3.3 },
      1000: { slidesPerView: type == 2 ? 2 : 4.2 },
      1200: { slidesPerView: type == 2 ? 2.5 : 5.5 },
      1400: { slidesPerView: type == 2 ? 2.5 : 5.5 },
      1600: { slidesPerView: type == 2 ? 3.5 : 7.5 },
    };
  }, [breakPointsProps, type]);

  return (
    <div className="carousel_products">
      <Swiper
        ref={sliderRef}
        breakpoints={breakPoints}
        spaceBetween={10}
        className="carouselSwiper"
      >
        {category_list.map((cat_item) => {
          return (
            <SwiperSlide>
              <div
                className="product_container"
                style={{ height: "305px" }}
              ></div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
