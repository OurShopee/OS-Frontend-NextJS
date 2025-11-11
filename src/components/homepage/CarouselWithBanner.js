"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import CarouselProducts from "./CarouselProducts";
import { MediaQueries } from "../utils";

export default function CarouselWithBanner({
  products,
  bannerImage,
  bannerImageRedirectUrl = "",
  type,
  inner_bg,
  type2,
  eid_sale,
  breakPointsProps,
  section_name,
  backgroundImage,
  className = "",
  style = {},
  ...restProps
}) {
  const { isMobile } = MediaQueries();
  const carouselRef = useRef(null);
  const [carouselHeight, setCarouselHeight] = useState(0);

  const hasBanner = bannerImage && bannerImage.trim() !== "";

  // Update carousel height on mount and resize
  useEffect(() => {
    if (!hasBanner || isMobile) return;

    const updateCarouselHeight = () => {
      if (carouselRef.current) {
        const swiperContainer =
          carouselRef.current.querySelector(".carouselSwiper");
        const container = swiperContainer || carouselRef.current;
        const height = container.offsetHeight;

        if (height > 0) {
          setCarouselHeight(height);
        }
      }
    };

    const timeout1 = setTimeout(updateCarouselHeight, 100);
    const timeout2 = setTimeout(updateCarouselHeight, 300);
    const timeout3 = setTimeout(updateCarouselHeight, 600);

    window.addEventListener("resize", updateCarouselHeight);

    return () => {
      window.removeEventListener("resize", updateCarouselHeight);
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, [hasBanner, products, isMobile]);

  const bannerContent = (
    <img
      data-aos="fade-right"
      data-aos-easing="ease-in-out"
      src={bannerImage}
      alt="Promotional banner"
      className="w-full max-h-[310px] object-cover rounded-2xl aspect-[301/305]"
    />
  );

  return (
    <div
      className={`carousel-with-banner-wrapper ${
        hasBanner ? "with-banner" : "full-width"
      } ${className}`}
      style={style}
    >
      {hasBanner ? (
        <div
          className={`flex gap-4 ${
            isMobile ? "flex-col" : "flex-row items-stretch"
          }`}
        >
          {/* Banner - Responsive */}
          {!isMobile && (
            <div className="flex-shrink-0 overflow-hidden aspect-[301/305] rounded-[20px]">
              {bannerImageRedirectUrl ? (
                <Link href={bannerImageRedirectUrl}>{bannerContent}</Link>
              ) : (
                bannerContent
              )}
            </div>
          )}

          {/* Carousel */}
          <div ref={carouselRef} className="flex-1 min-w-0">
            <CarouselProducts
              products={products}
              type={type}
              inner_bg={inner_bg}
              type2={type2}
              eid_sale={eid_sale}
              breakPointsProps={breakPointsProps}
              section_name={section_name}
              backgroundImage={isMobile ? bannerImage : backgroundImage}
              {...restProps}
            />
          </div>
        </div>
      ) : (
        <div ref={carouselRef}>
          <CarouselProducts
            products={products}
            type={type}
            inner_bg={inner_bg}
            type2={type2}
            eid_sale={eid_sale}
            breakPointsProps={breakPointsProps}
            section_name={section_name}
            backgroundImage={backgroundImage}
            {...restProps}
          />
        </div>
      )}
    </div>
  );
}
