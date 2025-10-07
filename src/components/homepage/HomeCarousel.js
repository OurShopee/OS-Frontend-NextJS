"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import Carousel from "../Common/Carousel";
import { trackBannerClick } from "../utils/dataUserpush";
import DynamicBanners from "./DynamicBanners";

function HomeCarousel({ carousel_data, searchPage = true }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const leftRef = useRef(null);
  const [leftHeight, setLeftHeight] = useState(null);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const safeCarouselData = Array.isArray(carousel_data) ? carousel_data : [];

  const [hasSetHeight, setHasSetHeight] = useState(false);

  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );

  // Use pathname instead of router.pathname for SSR compatibility
  const pageName = pathname;

  const handleFirstImageLoad = () => {
    if (!hasSetHeight && leftRef.current && window.innerWidth >= 768) {
      setLeftHeight(leftRef.current.offsetHeight);
      setHasSetHeight(true); // prevent future recalculations
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) =>
        prevIndex === safeCarouselData.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [safeCarouselData]);
  const staticPagePrefixes = ["/categories", "/products-category"];
  const shouldWrapWithNavLink = !staticPagePrefixes.some((prefix) =>
    location.pathname.startsWith(prefix)
  );
  const carouselColClasses = isHomePage
    ? "w-full lg:w-3/4 md:w-2/3 sm:w-full"
    : "w-full"; // full width when not on homepage

  return (
    <div className="w-full px-4">
      <div
        className={`flex flex-wrap -mx-2 ${isHomePage ? "pr-3" : ""} ${
          searchPage && "mb-3"
        }`}
      >
        {/* Left: Carousel */}
        <div
          className={`${carouselColClasses} px-2 relative ${
            !searchPage && "h-full"
          }`}
          ref={leftRef}
        >
          <Carousel
            fade
            activeIndex={activeIndex}
            onSelect={(i) => setActiveIndex(i)}
            controls={safeCarouselData?.length > 1}
            indicators={false}
            className="home_carousel  rounded-lg"
          >
            {safeCarouselData.length > 0 &&
              safeCarouselData?.map((item, index) => {
                const urlParts = item.url.split("/").filter(Boolean);
                const lastPart = urlParts[urlParts.length - 1] || "Banner Item";
                const formattedTitle = lastPart.replace(/[-_]/g, " ");

                const formatImageUrl = (url) => {
                  if (url.startsWith("https://www.ourshopee")) {
                    const split = url.split("https://www.ourshopee.com/")[1];
                    return `https://cdn.ourshopee.com/${split}`;
                  } else {
                    return url;
                  }
                };

                return (
                  <Carousel.Item key={item.carousel_id}>
                    <Link
                      href={item.url}
                      onClick={() =>
                        trackBannerClick(
                          formattedTitle,
                          "",
                          pageName,
                          currentcountry.name
                        )
                      }
                    >
                      <img
                        src={formatImageUrl(item.image_url)}
                        alt=""
                        className={`rounded-[13px] w-full ${
                          !searchPage && "aspect-[1200/450]"
                        } ${!shouldWrapWithNavLink ? "cursor-default" : ""}`}
                        // 🟥 This will set height only once on initial image load
                        onLoad={index === 0 ? handleFirstImageLoad : undefined}
                      />
                    </Link>
                  </Carousel.Item>
                );
              })}
          </Carousel>

          {/* Indicators */}
          <div className="flex gap-2 absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
            {safeCarouselData?.map((_, idx) => {
              const isActive = activeIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative h-3 ${
                    isActive ? "w-24 rounded-full" : "w-4 rounded-full"
                  } bg-black/20 overflow-hidden transition-all duration-300 cursor-pointer`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 h-full bg-black/60 rounded-full animate-progress-bar" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Text/Content */}
        {isHomePage && (
          <div
            className="hidden md:block w-full lg:w-1/4 md:w-1/3 px-0 sm:w-full relative overflow-hidden rounded-2xl"
            style={leftHeight ? { height: leftHeight } : {}}
          >
            <DynamicBanners
              bannerKey="heroBanner"
              enableAos={false}
              className={`w-full ${
                !searchPage && "aspect-[410/450]"
              } object-cover rounded-2xl block`}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeCarousel;
