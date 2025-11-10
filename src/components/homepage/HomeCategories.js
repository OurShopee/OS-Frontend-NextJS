"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Grid, Mousewheel } from "swiper/modules";
import { MediaQueries } from "../utils";

// import required modules

export default function HomeCategories({ category_list, no_bg, type }) {
  const { isMobile } = MediaQueries();

  const sliderRef1 = useRef(null);
  const [scrollProgress, setScroll] = useState(0.4);
  const [slidesPerView, setslidesperView] = useState(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef1.current) return;
    sliderRef1.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef1.current) return;
    sliderRef1.current.swiper.slideNext();
  }, []);

  const category_selected = (category_name) => {
    // handleCategoryClick()
  };

  useEffect(() => {
    if (slidesPerView != null && category_list?.length > 0) {
      setScroll(slidesPerView / category_list?.length);
    }
  }, [slidesPerView, category_list?.length]);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handleSlideChange = (swiper) => {
    const beginning = swiper.isBeginning;
    const end = swiper.isEnd;


    setIsBeginning(beginning);
    setIsEnd(end);
  };

  const params = useParams();

  useEffect(() => {
    if (sliderRef1.current) {
      const swiper = sliderRef1.current.swiper;
      const beginning = swiper.isBeginning;
      const end = swiper.isEnd;

      setIsBeginning(beginning);
      setIsEnd(end);
      swiper.slideTo(0); // optional: reset to start if needed
    }
  }, [params, category_list]);

  // Additional effect to handle initial state after swiper is fully loaded
  useEffect(() => {
    const timer = setTimeout(() => {
      if (sliderRef1.current) {
        const swiper = sliderRef1.current.swiper;
        const beginning = swiper.isBeginning;
        const end = swiper.isEnd;
        setIsBeginning(beginning);
        setIsEnd(end);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [category_list, slidesPerView]);

  const formatImageUrl = (url) => {
    if (
      url?.startsWith("https://www.ourshopee") ||
      url?.startsWith("https://ourshopee")
    ) {
      const split = url?.split("ourshopee.com/")[1];
      return `https://cdn.ourshopee.com/${split}`;
    } else {
      return url;
    }
  };

  return (
    <div
      className={`home_categories relative ${
        isBeginning ? "hide-left-overlay" : ""
      } ${isEnd ? "hide-right-overlay" : ""}`}
    >
      {/* Navigation arrows with original styling but higher z-index */}
      {!isMobile && (
        <div className="arrows inset-0 pointer-events-none items-center">
          {!isBeginning ? (
            <div
              className="left_indicator previous pointer-events-auto"
              onClick={handlePrev}
            >
              <IoChevronBack size={25} />
            </div>
          ) : (
            <div className="left_indicator previous disabled no_bg no_drop_shadow pointer-events-auto" />
          )}
          {!isEnd && (
            <div
              className="right_indicator next pointer-events-auto"
              onClick={handleNext}
            >
              <IoChevronForward size={25} />
            </div>
          )}
        </div>
      )}

      <Swiper
        ref={sliderRef1}
        cssMode={!isMobile && true}
        mousewheel={true}
        keyboard={true}
        pagination={false}
        navigation={false}
        modules={[Grid, Mousewheel]}
        onSwiper={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        grid={isMobile && { rows: 2, fill: "row" }} // 2 rows
        breakpoints={{
          200: {
            slidesPerView: 4,
          },
          450: {
            slidesPerView: 4,
          },
          760: {
            slidesPerView: 5,
          },
          1000: {
            slidesPerView: 6,
          },
          1200: {
            slidesPerView: 10,
          },
          1400: {
            slidesPerView: 10,
          },
          1600: {
            slidesPerView: 10,
          },
        }}
        spaceBetween={isMobile ? 15 : 30}
        onBreakpoint={(swiper, breakpoint) => {
          setslidesperView(isMobile ? 8 : breakpoint.slidesPerView);
          // Re-check beginning/end state after breakpoint change
          setTimeout(() => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }, 50);
        }}
        className="mySwiper"
        onSlideChange={(swiper) => {
          handleSlideChange(swiper);
          if (isMobile) {
            if (
              category_list.length - (swiper.activeIndex + slidesPerView) <
              8
            ) {
              setScroll(1);
            } else {
              setScroll(
                (swiper.activeIndex + slidesPerView) / category_list.length
              );
            }
          } else {
            setScroll(
              (slidesPerView + swiper.activeIndex) / category_list.length
            );
          }
        }}
        onReachBeginning={() => {
          setIsBeginning(true);
        }}
        onReachEnd={() => {
          setIsEnd(true);
        }}
        onFromEdge={() => {
          if (sliderRef1.current) {
            const swiper = sliderRef1.current.swiper;
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }
        }}
      >
        {category_list?.map((cat_item, index) => {
          return (
            <SwiperSlide key={index}>
              <Link
                href={`${
                  (type == 1 && "/categories/" + cat_item.url) ||
                  (type == 2 && "/products-category/" + cat_item.url) ||
                  (type == 3 && "/products-category/" + cat_item.url) ||
                  (type == 5 && "/products-subcategory/" + cat_item.url) ||
                  (type == 4 && cat_item.url)
                }`}
                className={"text-decoration-none"}
              >
                <div
                  className={`relative ${
                    (type == 2 || no_bg != undefined) && "no_bg"
                  }`}
                >
                  <img
                    src={formatImageUrl(
                      cat_item.vector_icon ||
                        cat_item.sub_category_image ||
                        cat_item.sub_subcategory_image
                    )}
                    alt=""
                  />
                </div>
                <p>
                  {cat_item.category_name ||
                    cat_item.sub_category_name ||
                    cat_item.sub_subcategory_name}
                </p>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {isMobile && category_list.length > 5 && (
        <div className="flex justify-center mb-4">
          <div className="progress_trackbar">
            <motion.div
              className="custom_progress_bar"
              style={{ scaleX: scrollProgress }}
              initial={{ borderRadius: 100 }}
              transition={{ type: "spring" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}