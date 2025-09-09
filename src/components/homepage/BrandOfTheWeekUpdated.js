import React, { useEffect, useRef, useState } from "react";
import CarouselProducts from "./CarouselProducts";
import { MediaQueries } from "../utils";
import Link from "next/link";
import { useSelector } from "react-redux";
import { getImagesByKey } from "../utils/getImagesByKey";
import { pushToDataLayer } from "../utils/dataUserpush";
import { useRouter } from "next/navigation";

const brandData = {
  bannerImage: "assets/11-sale/Image.png",
  bannerLink: "#",
};

export default function BrandOfTheWeekUpdated({ products }) {
  const router = useRouter();
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const { isMobile } = MediaQueries();
  const bannerList = useSelector((state) => state.homeslice.bannerList);
  const rightRef = useRef(null);
  const [rightHeight, setRightHeight] = useState(0);
  const [brandData, setBrandData] = useState({});

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

  return (
    <div
      className="rounded-3xl px-4 py-6 mt-4 !md:p-6 relative overflow-hidden"
      style={{
        backgroundImage: `url(${brandData?.brandWeekBg?.image_web})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex items-center justify-center mb-4 pt-6 pb-2">
        {/* Yellow box with right-side cut */}
        <div
          className=" px-4 z-0"
          style={{
            backgroundColor: "#FACC15",

            /* cut 20px off the right edge */
            clipPath: "polygon(0% 0%, 100% 0%, 90% 100%, 0% 100%)",
          }}
        >
          <span className="inner-shadow-text">
            <span className="brand-inner-shadow font-[Anta] text-[20px] md:text-[38px] lg:text-[60px]">
              BRAND&nbsp;
            </span>
            <span
              className="inner-shadow-text font-[Anta] text-[20px] md:text-[38px] lg:text-[60px]"
              style={{ color: "black" }}
            >
              OF&nbsp;
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
          THE WEEK
        </span>
      </div>

      <div className="rounded-2xl flex flex-wrap md:flex-nowrap items-stretch gap-6 md:gap-1">
        {/* Left Banner */}
        {(!isMobile &&
          brandData?.brandWeekImg?.url_web &&
          brandData?.brandWeekImg?.url_web !== "0" &&
          brandData?.brandWeekImg?.url_web !== "") ||
        (isMobile &&
          brandData?.brandWeekImg?.url_app &&
          brandData?.brandWeekImg?.url_app !== "0" &&
          brandData?.brandWeekImg?.url_app !== "") ? (
          <Link
            href={
              !isMobile
                ? brandData?.brandWeekImg?.url_web
                : brandData?.brandWeekImg?.url_app
            }
            onClick={() => {
              pushToDataLayer("clicked_card_in_section", currentcountry.name, {
                card_name: "Brand of the Week Banner",
                section_name: "Brand of the Week",
                page: router.pathname,
              });
            }}
            className="w-full md:w-[36%] rounded-2xl overflow-hidden cursor-pointer"
            style={!isMobile ? { height: rightHeight } : {}}
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
                alt="banner"
                className="object-cover w-full h-full rounded-2xl"
              />
              {/* <div className="absolute flex flex-col justify-center items-center bottom-8 left-8 md:bottom-16 md:left-16 text-white text-lg font-medium">
                <div className="bg-white/50 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                  <div className="w-8 h-8 bg-white rounded-full" />
                </div>
                <span className="text-[32px]">Buy Here</span>
              </div> */}
            </div>
          </Link>
        ) : (
          <div
            className="w-full md:w-[36%] rounded-2xl overflow-hidden"
            style={!isMobile ? { height: rightHeight } : {}}
            data-aos="fade-right"
            data-aos-easing="ease-in-out"
          >
            <img
              src={
                !isMobile
                  ? brandData?.brandWeekImg?.image_web
                  : brandData?.brandWeekImg?.image_app
              }
              alt="banner"
              className="object-cover w-full h-full rounded-2xl"
            />
          </div>
        )}

        {/* Right Carousel */}
        <div
          className="w-full md:w-[64%] flex items-stretch md:px-4"
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
    </div>
  );
}
