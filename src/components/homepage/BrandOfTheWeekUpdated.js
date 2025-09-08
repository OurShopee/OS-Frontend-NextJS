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
      className="tw-rounded-3xl tw-px-4 tw-py-6 mt-4 !md:tw-p-6 tw-relative tw-overflow-hidden"
      style={{
        backgroundImage: `url(${brandData?.brandWeekBg?.image_web})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="tw-flex tw-items-center tw-justify-center tw-mb-4 tw-pt-6 tw-pb-2">
        {/* Yellow box with right-side cut */}
        <div
          className=" tw-px-4 tw-z-0"
          style={{
            backgroundColor: "#FACC15",

            /* cut 20px off the right edge */
            clipPath: "polygon(0% 0%, 100% 0%, 90% 100%, 0% 100%)",
          }}
        >
          <span className="inner-shadow-text">
            <span className="brand-inner-shadow tw-font-[Anta] tw-text-[20px] md:tw-text-[38px] lg:tw-text-[60px]">
              BRAND&nbsp;
            </span>
            <span
              className="inner-shadow-text tw-font-[Anta] tw-text-[20px] md:tw-text-[38px] lg:tw-text-[60px]"
              style={{ color: "black" }}
            >
              OF&nbsp;
            </span>
          </span>
        </div>

        {/* pull "THE" back under the diagonal overlap */}
        <span
          className="rest-inner-shadow tw-font-[Anta] tw-text-[20px] md:tw-text-[38px] lg:tw-text-[60px] tw-z-10 tw-text-black tw-font-bold"
          style={{
            marginLeft: "-20px",
            letterSpacing: "2px",
            textShadow: " 0px 4px 1.5px 0px #8C8C8C40 inset",
          }}
        >
          THE WEEK
        </span>
      </div>

      <div className="tw-rounded-2xl tw-flex tw-flex-wrap md:tw-flex-nowrap tw-items-stretch tw-gap-6 md:tw-gap-1">
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
            className="tw-w-full md:tw-w-[36%] tw-rounded-2xl tw-overflow-hidden tw-cursor-pointer"
            style={!isMobile ? { height: rightHeight } : {}}
          >
            <div
              className="tw-relative tw-w-full tw-h-full tw-flex tw-items-stretch"
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
                className="tw-object-cover tw-w-full tw-h-full tw-rounded-2xl"
              />
              {/* <div className="tw-absolute tw-flex tw-flex-col tw-justify-center tw-items-center tw-bottom-8 tw-left-8 md:tw-bottom-16 md:tw-left-16 tw-text-white tw-text-lg tw-font-medium">
                <div className="tw-bg-white/50 tw-rounded-full tw-w-16 tw-h-16 tw-flex tw-items-center tw-justify-center tw-mb-2">
                  <div className="tw-w-8 tw-h-8 tw-bg-white tw-rounded-full" />
                </div>
                <span className="tw-text-[32px]">Buy Here</span>
              </div> */}
            </div>
          </Link>
        ) : (
          <div
            className="tw-w-full md:tw-w-[36%] tw-rounded-2xl tw-overflow-hidden"
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
              className="tw-object-cover tw-w-full tw-h-full tw-rounded-2xl"
            />
          </div>
        )}

        {/* Right Carousel */}
        <div
          className="tw-w-full md:tw-w-[64%] tw-flex tw-items-stretch md:tw-px-4"
          ref={rightRef}
        >
          <div className="tw-w-full tw-h-full">
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
