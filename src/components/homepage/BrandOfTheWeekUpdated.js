"use client";
import React, { useEffect, useRef, useState } from "react";
import CarouselProducts from "./CarouselProducts";
import { MediaQueries } from "../utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { getImagesByKey } from "../utils/getImagesByKey";
import { pushToDataLayer } from "../utils/dataUserpush";
import { useContent } from "@/hooks";

const NavLink = ({ to, children, onClick, className, style, ...props }) => {
  const pathname = usePathname();
  const isActive = pathname === to;

  return (
    <Link href={to} {...props}>
      <span
        className={`${className} ${isActive ? "active" : ""}`}
        onClick={onClick}
        style={style}
      >
        {children}
      </span>
    </Link>
  );
};

const brandData = {
  bannerImage: "assets/11-sale/Image.png",
  bannerLink: "#",
};

export default function BrandOfTheWeekUpdated({ products }) {
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const { isMobile } = MediaQueries();
  const bannerList = useSelector((state) => state.homeslice.bannerList);
  const rightRef = useRef(null);
  const [rightHeight, setRightHeight] = useState(0);
  const [brandData, setBrandData] = useState({});
  const pathname = usePathname();

  // Language content
  const brandOfTheWeekShort = useContent("specialPages.brandOfTheWeekShort");
  const theWeek = useContent("specialPages.theWeek");

  useEffect(() => {
    const keys = ["brandWeekBg", "brandWeekImg"];

    const banners = {};
    keys.forEach((key) => {
      const banner = getImagesByKey(bannerList, key);
      if (banner) banners[key] = banner;
    });

    setBrandData(banners);
  }, [bannerList]);

  useEffect(() => {
    if (!isMobile && rightRef.current) {
      setRightHeight(rightRef.current.offsetHeight);
    }
  }, [isMobile, products]);

  const pageName =
    typeof window !== "undefined" ? window.location.pathname : pathname;

  return (
    <section
      className="rounded-3xl px-4 py-6 mt-4 md:p-6 relative overflow-hidden"
      style={{
        backgroundImage: `url(${brandData?.brandWeekBg?.image_web})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      aria-label="Brand of the Week"
    >
      <div className="flex items-center justify-center mb-4 pt-6 pb-2">
        {/* Yellow box with right-side cut */}
        <div
          className="px-4 z-0"
          style={{
            backgroundColor: "#FACC15",
            clipPath: "polygon(0% 0%, 100% 0%, 90% 100%, 0% 100%)",
          }}
          aria-hidden="true"
        >
          <span className="inner-shadow-text">
            <span className="brand-inner-shadow font-[Anta] text-[20px] md:text-[38px] lg:text-[60px]">
              {brandOfTheWeekShort}&nbsp;
            </span>
          </span>
        </div>

        {/* pull "THE" back under the diagonal overlap */}
        <span
          className="rest-inner-shadow font-[Anta] text-[20px] md:text-[38px] lg:text-[60px] z-10 text-black font-bold"
          style={{
            marginLeft: "-20px",
            letterSpacing: "2px",
            textShadow: " 0px 4px 1.5px 0px #8C8C8C40 inset",
          }}
        >
          {theWeek}
        </span>
      </div>

      <div
        className={`rounded-2xl ${
          isMobile ? "flex flex-col" : "flex md:!flex-nowrap"
        } items-stretch  md:gap-1`}
      >
        {/* Main Promotional Image */}
        {(!isMobile &&
          brandData?.brandWeekImg?.url_web &&
          brandData?.brandWeekImg?.url_web !== "0" &&
          brandData?.brandWeekImg?.url_web !== "") ||
        (isMobile &&
          brandData?.brandWeekImg?.url_app &&
          brandData?.brandWeekImg?.url_app !== "0" &&
          brandData?.brandWeekImg?.url_app !== "") ? (
          <a
            href={
              !isMobile
                ? brandData?.brandWeekImg?.url_web
                : brandData?.brandWeekImg?.url_app
            }
            onClick={() => {
              pushToDataLayer("clicked_card_in_section", currentcountry.name, {
                card_name: "Brand of the Week Banner",
                section_name: "Brand of the Week",
                page: pageName,
              });
            }}
            className={`${
              isMobile ? "w-full mb-4" : "w-full md:w-[36%]"
            } rounded-2xl overflow-hidden cursor-pointer block`}
            style={
              !isMobile
                ? { height: rightHeight }
                : { minHeight: isMobile ? "200px" : "auto" }
            }
          >
            <div
              className="relative w-full h-full flex items-stretch"
              data-aos="fade-right"
              data-aos-easing="ease-in-out"
            >
              <img
                src={
                  !isMobile
                    ? brandData?.brandWeekImg?.image_web
                    : brandData?.brandWeekImg?.image_app
                }
                alt="Brand of the Week promotional banner"
                className="object-cover w-full h-full rounded-2xl"
              />
            </div>
          </a>
        ) : (
          <div
            className={`${
              isMobile ? "w-full mb-4" : "w-full md:w-[36%]"
            } rounded-2xl overflow-hidden`}
            style={
              !isMobile
                ? { height: rightHeight }
                : { minHeight: isMobile ? "200px" : "auto" }
            }
            data-aos="fade-right"
            data-aos-easing="ease-in-out"
          >
            <img
              src={
                !isMobile
                  ? brandData?.brandWeekImg?.image_web
                  : brandData?.brandWeekImg?.image_app
              }
              alt="Brand of the Week promotional banner"
              className="object-cover w-full h-full rounded-2xl"
            />
          </div>
        )}

        {/* Product Cards Carousel */}
        <div
          className={`${
            isMobile ? "w-full" : "w-full md:w-[64%]"
          } flex items-stretch md:px-4`}
          ref={rightRef}
        >
          <div className="w-full h-full">
            <CarouselProducts
              products={products}
              type={1}
              inner_bg={"rgba(238, 235, 250, 1)"}
              breakPointsProps={{
                200: { slidesPerView: 1.3 },
                375: { slidesPerView: 2 },
                425: { slidesPerView: 2 },
                760: { slidesPerView: 2 },
                1000: { slidesPerView: 3 },
                1200: { slidesPerView: 3 },
                1400: { slidesPerView: 4 },
                1600: { slidesPerView: 5 },
              }}
              section_name={"Brand Of The Week"}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
