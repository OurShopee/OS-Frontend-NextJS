import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";
import Link from "next/link";
import { Grid, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { ProductCard } from "../Common";
import { MediaQueries } from "../utils";
import TopPicksCarouselProducts from "./TopPicksCarouselProducts";

function BestDeals({ carousel_data, breakPointsProps }) {
  const sliderRef = useRef(null);
  const rightColRef = useRef(null); // step 1: ref
  const { isMobile, isTablet, isLaptop } = MediaQueries();
  const [index, setIndex] = useState(0);
  const [rightHeight, setRightHeight] = useState(0); // step 2: state for height

  const [data, setData] = useState([]);

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
    if (carousel_data[0]?.productlist !== undefined) {
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
    <Row>
      {/* step 4: apply inline height */}
      <Col
        lg={4}
        className="padding_custom"
        style={!isMobile && !isTablet ? { height: rightHeight } : {}}
      >
        <div className="tw-relative tw-rounded-2xl tw-overflow-hidden tw-bg-[#2d2d2d] tw-h-full">
          <Carousel
            fade
            controls={false}
            className="home_carousel top_picks_carousel tw-h-full"
            indicators={false}
            activeIndex={index}
            onSelect={handleSelect}
          >
            {carousel_data.map((item) => (
              <Carousel.Item
                key={item.brand_id}
                className="tw-h-full tw-relative"
              >
                <img
                  src={item.image_slider}
                  alt=""
                  className="tw-w-full tw-h-full tw-rounded-2xl"
                />
              </Carousel.Item>
            ))}
          </Carousel>

          <div className="tw-absolute tw-bottom-8 -tw-right-6 -tw-translate-x-1/2 tw-flex tw-items-center tw-gap-2 tw-z-10">
            {carousel_data.map((_, index1) => (
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
                className="tw-h-2 tw-cursor-pointer"
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
      </Col>

      {/* step 1: apply ref here */}
      <Col lg={8} className={isLaptop && "!tw-mt-3"} ref={rightColRef}>
        {isTablet ? (
          <Swiper
            ref={sliderRef}
            effect={"fade"}
            modules={[Grid]}
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
                  <Link
                    href={`/details/${item.url}`}
                    className={"text-decoration-none"}
                  >
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
      </Col>
    </Row>
  );
}

export default BestDeals;
