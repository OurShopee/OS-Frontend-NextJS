import React, { useEffect, useRef, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import Link from "next/link";
import { trackBannerClick } from "../utils/dataUserpush";
import { useSelector } from "react-redux";
import DynamicBanners from "./DynamicBanners";
import { useRouter } from "next/navigation";

function HomeCarousel({ carousel_data, searchPage = true }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const leftRef = useRef(null);
  const [leftHeight, setLeftHeight] = useState(null);
  const router = useRouter();
  const isHomePage = router.pathname === "/";
  const safeCarouselData = Array.isArray(carousel_data) ? carousel_data : [];

  const [hasSetHeight, setHasSetHeight] = useState(false);

  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );

  // Use router.pathname instead of window.location.pathname for SSR compatibility
  const pageName = router.pathname;

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

  const carouselColClasses = isHomePage
    ? "col-lg-9 col-md-8 col-sm-12"
    : "col-12"; // full width when not on homepage

  return (
    <div className="container-fluid">
      <div
        className={`row ${isHomePage ? "tw-pr-3" : ""} ${
          searchPage && "tw-mb-3"
        }`}
      >
        {/* Left: Carousel */}
        <div
          className={`${carouselColClasses} tw-relative ${
            !searchPage && "tw-h-[45vh]"
          }`}
          ref={leftRef}
        >
          <Carousel
            fade
            activeIndex={activeIndex}
            onSelect={(i) => setActiveIndex(i)}
            controls={safeCarouselData?.length > 1}
            indicators={false}
            className="home_carousel tw-border tw-rounded-lg"
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
                        className={`tw-rounded-[13px] tw-w-full ${
                          !searchPage && "tw-h-[45vh]"
                        }`}
                        // 🟥 This will set height only once on initial image load
                        onLoad={index === 0 ? handleFirstImageLoad : undefined}
                      />
                    </Link>
                  </Carousel.Item>
                );
              })}
          </Carousel>

          {/* Indicators */}
          <div className="tw-flex tw-gap-2 tw-absolute tw-bottom-4 tw-left-1/2 tw--translate-x-1/2 tw-z-10">
            {safeCarouselData?.map((_, idx) => {
              const isActive = activeIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`tw-relative tw-h-3 ${
                    isActive
                      ? "tw-w-24 tw-rounded-full"
                      : "tw-w-4 tw-rounded-full"
                  } tw-bg-black/20 tw-overflow-hidden tw-transition-all tw-duration-300 tw-cursor-pointer`}
                >
                  {isActive && (
                    <div className="tw-absolute tw-left-0 tw-top-0 tw-h-full tw-bg-black/60 tw-rounded-full tw-animate-progress-bar" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Text/Content */}
        {isHomePage && (
          <div
            className="tw-hidden md:tw-block col-lg-3 col-md-4 !tw-px-0 col-sm-12 tw-relative tw-overflow-hidden tw-rounded-2xl"
            style={leftHeight ? { height: leftHeight } : {}}
          >
            <DynamicBanners
              bannerKey="heroBanner"
              enableAos={false}
              className={`tw-w-full ${
                !searchPage && "tw-h-[50vh]"
              } tw-object-cover tw-rounded-2xl tw-block`}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeCarousel;
