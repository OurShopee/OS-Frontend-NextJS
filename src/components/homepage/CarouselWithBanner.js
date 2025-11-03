"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import CarouselProducts from "./CarouselProducts";
import { MediaQueries } from "../utils";

/**
 * Wrapper component for CarouselProducts with conditional banner layout
 * 
 * @param {Object} props
 * @param {Array} props.products - Products to display in carousel
 * @param {string} props.bannerImage - Optional banner image URL (if provided, shows left banner + right carousel)
 * @param {string} props.bannerImageRedirectUrl - URL to redirect when banner is clicked
 * @param {number} props.type - Product card type for CarouselProducts
 * @param {string} props.inner_bg - Background color for carousel
 * @param {number} props.type2 - Secondary type for CarouselProducts
 * @param {boolean} props.eid_sale - Eid sale flag
 * @param {Object} props.breakPointsProps - Custom breakpoints for Swiper
 * @param {string} props.section_name - Section name for tracking
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 */
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
  className = "",
  style = {},
  ...restProps
}) {
  const { isMobile } = MediaQueries();
  const bannerRef = useRef(null);
  const carouselRef = useRef(null);
  const [bannerHeight, setBannerHeight] = useState(0);

  const hasBanner = bannerImage && bannerImage.trim() !== "";

  // Update banner height when carousel height changes or on resize
  useEffect(() => {
    if (!hasBanner) return;

    const updateHeights = () => {
      if (bannerRef.current && carouselRef.current) {
        // Find the swiper container inside carousel
        const swiperContainer = carouselRef.current.querySelector('.carouselSwiper');
        if (swiperContainer) {
          const carouselHeight = swiperContainer.offsetHeight;
          if (carouselHeight > 0) {
            setBannerHeight(carouselHeight);
          }
        } else {
          // Fallback to carousel container height
          const carouselHeight = carouselRef.current.offsetHeight;
          if (carouselHeight > 0) {
            setBannerHeight(carouselHeight);
          }
        }
        console.log(bannerHeight, "bannerHeight");
      }
    };
    // Initial update with delays to allow carousel to render
    const timeout1 = setTimeout(updateHeights, 100);
    const timeout2 = setTimeout(updateHeights, 300);
    const timeout3 = setTimeout(updateHeights, 600);

    window.addEventListener("resize", updateHeights);

    return () => {
      window.removeEventListener("resize", updateHeights);
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, [hasBanner, products]);

  return (
    <div
      className={`carousel-with-banner-wrapper ${
        hasBanner ? "with-banner" : "full-width"
      } ${className}`}
      style={style}
    >
      {hasBanner ? (
        // Layout with banner: Left banner + Right carousel
        <div
          className={`flex gap-4 ${
            isMobile ? "flex-col" : "flex-row items-stretch"
          }`}
        >
          {/* Left Banner */}
          <div
            ref={bannerRef}
            className={`${isMobile ? "w-full" : "min-w-[200px] lg:min-w-[300px] flex-shrink-0"}`}
            style={
              !isMobile && bannerHeight > 0
                ? { height: `${bannerHeight}px` }
                : isMobile
                ? { maxHeight: "300px" }
                : {}
            }
          >
            {bannerImageRedirectUrl ? (
              <Link href={bannerImageRedirectUrl}>
                <img
                  data-aos="fade-right"
                  data-aos-easing="ease-in-out"
                  src={bannerImage}
                  alt="Promotional banner"
                  className="w-full object-cover rounded-2xl"
                  style={
                    isMobile
                      ? { maxHeight: "300px" }
                      : bannerHeight > 0
                      ? { height: `${bannerHeight}px` }
                      : {}
                  }
                />
              </Link>
            ) : (
              <img
                data-aos="fade-right"
                data-aos-easing="ease-in-out"
                src={bannerImage}
                alt="Promotional banner"
                className="w-full object-cover rounded-2xl"
                style={
                  isMobile
                    ? { maxHeight: "300px" }
                    : bannerHeight > 0
                    ? { height: `${bannerHeight}px !important` }
                    : {}
                }
              />
            )}
          </div>

          {/* Right Carousel */}
          <div ref={carouselRef} className="flex-1 min-w-0">
            <CarouselProducts
              products={products}
              type={type}
              inner_bg={inner_bg}
              type2={type2}
              eid_sale={eid_sale}
              breakPointsProps={breakPointsProps}
              section_name={section_name}
              imgUrl="" // Don't pass imgUrl to CarouselProducts, we handle it in wrapper
              imgPostUrl="" // Don't pass imgPostUrl to CarouselProducts
              {...restProps}
            />
          </div>
        </div>
      ) : (
        // Layout without banner: Full width carousel
        <div ref={carouselRef} >
          <CarouselProducts
            products={products}
            type={type}
            inner_bg={inner_bg}
            type2={type2}
            eid_sale={eid_sale}
            breakPointsProps={breakPointsProps}
            section_name={section_name}
            imgUrl="" // No banner image
            imgPostUrl="" // No post banner image
            {...restProps}
          />
        </div>
      )}
    </div>
  );
}

