"use client";
import AOS from "aos";
import "aos/dist/aos.css";
import React, { useEffect, useRef, useState } from "react";
import Countdown, { zeroPad } from "react-countdown";
import { toZonedTime } from "date-fns-tz";
import { MdTimer } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ComponentHeader } from "@/components/Common";
import { HomeBannerPlaceholder } from "@/components/Common/Placeholders";
// import SeoMeta from "../components/Common/SeoMeta";
import {
  CarouselProducts,
  HomeCarousel,
  HomeCategories,
  HomeMobileCarousel,
} from "@/components/homepage";
import BestDeals from "@/components/homepage/BestDeals";
import BrandOfTheWeekUpdated from "@/components/homepage/BrandOfTheWeekUpdated";
import DynamicBanners from "@/components/homepage/DynamicBanners";
import { MediaQueries } from "@/components/utils";
import { pushToDataLayer } from "@/components/utils/dataUserpush";
import { getcategory_items } from "@/redux/homeslice";
import Tabs from "@/components/Common/Tabs";
import { duration } from "moment";
import Marquee from "react-fast-marquee";
import { getImagesByKey } from "@/components/utils/getImagesByKey";
import {
  bundle_clearance_sale,
  clearance_saleApi,
  getdeal_offersApi,
  getDealOfTheDayApi,
  getSaverZoneProducts,
  getSectionPagesApi,
  getTopSellingApi,
} from "@/api/products";

const Home = () => {
  const router = useRouter();
  const bannerList = useSelector((state) => state?.homeslice?.bannerList);
  const loading = useSelector((state) => state?.homeslice?.loading);
  const loading6 = useSelector((state) => state?.homeslice?.loading6);
  const loading8 = useSelector((state) => state?.homeslice?.loading8);
  const loading9 = useSelector((state) => state?.homeslice?.loading9);
  const home_category_items = useSelector(
    (state) => state?.homeslice?.home_category_items
  );
  const top_picks = useSelector((state) => state?.homeslice?.top_picks);
  const brand_week = useSelector((state) => state?.homeslice?.brand_week);
  const loading5 = useSelector((state) => state?.homeslice?.loading5);
  const categoryList = useSelector((state) => state?.globalslice?.data);
  const categoryloading = useSelector((state) => state?.globalslice?.loading);

  const currentcountry = useSelector(
    (state) => state?.globalslice?.currentcountry
  );
  const dispatch = useDispatch();
  const leftColRef = useRef(null);
  const [leftHeight, setLeftHeight] = useState(0);
  const [saleData, setSaleData] = useState(null);
  const { isMobile, isTablet, isLaptop } = MediaQueries();
  const [topBrands, setTopBrands] = useState([]);
  const [sectionId, setSectionId] = useState([]);
  const [saverId, setSaverId] = useState();
  const [sectionBanners, setSectionBanners] = useState({});

  const timeZoneMap = {
    AE: "Asia/Dubai",
    OM: "Asia/Muscat",
    QA: "Asia/Qatar",
    KW: "Asia/Kuwait",
    BH: "Asia/Bahrain",
  };

  const countryCode = currentcountry?.country_code || "AE";
  const timeZone = timeZoneMap[countryCode] || "Asia/Dubai";
  const startUtc = bannerList?.dynamicTopSection?.startTime;
  const endUtc = bannerList?.dynamicTopSection?.endTime;

  const startZoned = toZonedTime(new Date(startUtc), timeZone);
  const endZoned = toZonedTime(new Date(endUtc), timeZone);
  const nowZoned = toZonedTime(new Date(), timeZone);

  const isInWindow = nowZoned >= startZoned && nowZoned <= endZoned;

  useEffect(() => {
    const keys = [
      "sectionBanner1",
      "sectionBanner2",
      "sectionBanner3",
      "tabBanner1",
      "tabBanner2",
      "tabBanner3",
    ];

    const banners = {};
    keys.forEach((key) => {
      const banner = getImagesByKey(bannerList, key);
      if (banner) banners[key] = banner;
    });

    setSectionBanners(banners);
  }, [bannerList]);

  useEffect(() => {
    const getData = async () => {
      const res = await getSectionPagesApi(sectionId);
      if (res?.data?.status === "success") {
        setSaleData(res.data.data);
      }
    };
    if (sectionId && !(sectionId?.length === 0)) {
      getData();
    }
  }, [sectionId]);

  useEffect(() => {
    const id = currentcountry?.nav_items?.find((i) => i.id === 11)?.section_id;
    setSectionId(id);
    const saverId = currentcountry?.nav_items.find(
      (i) => i.id === 6
    )?.section_id;
    setSaverId(saverId);
  }, [currentcountry?.nav_items]);

  useEffect(() => {
    const sectionData = saleData?.other_section;
    const topBrands = sectionData?.find(
      (d) => d.heading === "Top Brands"
    )?.items;
    setTopBrands(topBrands || []);
  }, [saleData]);

  useEffect(() => {
    dispatch(getcategory_items());
    const offset = window.innerHeight * 0.08;
    AOS.init({
      once: true,
      offset: offset,
      delay: 200,
      duration: 500,
    });
  }, []);

  useEffect(() => {
    if (!isMobile && !isTablet && leftColRef.current) {
      const height = leftColRef.current.offsetHeight;
      setLeftHeight(height);
    }
  }, [isMobile, isTablet, isLaptop]);

  useEffect(() => {
    pushToDataLayer("viewed_home_page", currentcountry?.name);
  }, []);

  const categoriesToShow = isMobile
    ? (categoryList || [])?.slice(0, 6)
    : (categoryList || [])?.slice(0, 9);

  return (
    <div className="overflow-hidden" style={{ maxWidth: "max-content" }}>
      {/* <SeoMeta
        title="Online Shopping UAE - Mobiles, Laptops, Appliances & More | OurShopee"
        description="Shop online for great deals on electronics, home appliances, perfumes, watches & more at OurShopee UAE. Browse our collections today - Fast Delivery & Easy Returns!"
        keywords="online shopping, deals, offers, electronics, fashion, home appliances"
        image="https://yourcdn.com/assets/og-home-image.webp"
        url="https://www.ourshopee.com/"
      /> */}

      {!loading ? (
        isLaptop ? (
          <div className="w-full px-4 pt-2">
            <HomeMobileCarousel carousel_data={bannerList?.carousel} />
          </div>
        ) : (
          <HomeCarousel
            carousel_data={bannerList?.carousel}
            searchPage={false}
          />
        )
      ) : (
        <HomeBannerPlaceholder height={424} />
      )}

      <div className="w-full px-4">
        {isMobile && <HomeCategories category_list={categoryList} type={1} />}

        {/* Tabs with Sale Ends in Section */}
        <div className="flex h-full flex-col lg:flex-row pt-2">
          {/* Tabs Component - 3/5 Width */}
          <div className="w-full h-full lg:w-3/5 pr-3" ref={leftColRef}>
            <Tabs
              tabs={[
                {
                  title: "Top Selling",
                  endpoint: getTopSellingApi,
                  path: "",
                },
                {
                  title: "Saver zone",
                  endpoint: () => getSaverZoneProducts(saverId),
                  path: "",
                },
                {
                  title: "Clearance Deals",
                  endpoint: clearance_saleApi,
                  path: "items",
                },
              ]}
              breakPointsProps={{
                200: { slidesPerView: 1.3 },
                375: { slidesPerView: 2 },
                425: { slidesPerView: 2 },
                700: { slidesPerView: 3 },
                1000: { slidesPerView: 3 },
                1200: { slidesPerView: 4 },
                1400: { slidesPerView: 4 },
                1600: { slidesPerView: 5 },
              }}
            />
          </div>

          {/* Sale Ends In Section - 2/5 Width */}
          <div
            className="w-full lg:w-2/5"
            style={!isMobile && !isTablet ? { height: leftHeight } : {}}
          >
            <div
              className={`bg-white rounded-3xl pt-4 h-full flex flex-col overflow-hidden ${
                isInWindow ? "gap-5" : ""
              }`}
            >
              {/* Header */}
              <div
                className={`flex justify-between items-center flex-shrink-0 ${
                  isInWindow ? "lg:min-h-[45px]" : "lg:min-h-[65px]"
                }`}
              >
                {isInWindow ? (
                  <>
                    <h2 className="text-xl md:text-2xl font-semibold text-[#2D2D2D] mb-0">
                      {bannerList?.dynamicTopSection?.title}
                    </h2>
                    <div
                      data-aos="fade-left"
                      data-aos-easing="ease-in-out"
                      className="bg-[#ffce0973] text-[#5132c2] text-[16px] md:text-[22px] p-3 rounded-xl flex items-center gap-3 font-semibold leading-[1em] tracking-[0em]"
                    >
                      <MdTimer className="text-lg" />
                      <Countdown
                        date={endZoned}
                        renderer={({
                          days,
                          hours,
                          minutes,
                          seconds,
                          completed,
                        }) => {
                          if (completed) {
                            return <span>00d 00h 00m 00s</span>;
                          } else {
                            return (
                              <span>
                                {zeroPad(days)}
                                <span className="text-[#5132c2] text-opacity-45">
                                  D
                                </span>{" "}
                                : {zeroPad(hours)}
                                <span className="text-[#5132c2] text-opacity-45">
                                  h
                                </span>{" "}
                                : {zeroPad(minutes)}
                                <span className="text-[#5132c2] text-opacity-45">
                                  m
                                </span>{" "}
                                : {zeroPad(seconds)}
                                <span className="text-[#5132c2] text-opacity-45">
                                  s
                                </span>
                              </span>
                            );
                          }
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="lg:h-[65px]" />
                )}
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-12 gap-[15px] flex-1 min-h-0 overflow-hidden">
                {/* Left Promo Box */}
                <div className="col-span-7 h-full min-h-0">
                  {sectionBanners?.sectionBanner1 && (
                    <div
                      data-aos="zoom-in"
                      data-aos-duration="700"
                      data-aos-easing="ease-in-out"
                      className="bg-cover bg-center rounded-2xl h-full relative overflow-hidden cursor-pointer"
                      onClick={() => {
                        const url = !isMobile
                          ? sectionBanners?.sectionBanner1?.url_web
                          : sectionBanners?.sectionBanner1?.url_web;

                        pushToDataLayer("clicked_card", currentcountry?.name, {
                          card_name: sectionBanners?.sectionBanner1?.image_web,
                          page: window.location.pathname,
                        });
                        router.push(url);
                      }}
                    >
                      <img
                        src={
                          !isMobile
                            ? sectionBanners?.sectionBanner1?.image_web
                            : sectionBanners?.sectionBanner1?.image_web
                        }
                        className="w-full h-full  rounded-2xl"
                        alt="Banners"
                      />
                    </div>
                  )}
                </div>

                {/* Right Stacked Images */}
                <div className="col-span-5 grid grid-rows-2 gap-[15px] h-full min-h-0">
                  {sectionBanners?.sectionBanner2 && (
                    <div
                      data-aos="fade-left"
                      data-aos-easing="ease-in-out"
                      className="bg-cover bg-center rounded-2xl h-full relative overflow-hidden cursor-pointer min-h-0"
                      onClick={() => {
                        const url = !isMobile
                          ? sectionBanners?.sectionBanner2?.url_web
                          : sectionBanners?.sectionBanner2?.url_web;

                        pushToDataLayer("clicked_card", currentcountry?.name, {
                          card_name: sectionBanners?.sectionBanner2?.image_web,
                          page: window.location.pathname,
                        });
                        router.push(url);
                      }}
                    >
                      <img
                        src={
                          !isMobile
                            ? sectionBanners?.sectionBanner2?.image_web
                            : sectionBanners?.sectionBanner2?.image_web
                        }
                        className="w-full h-full rounded-2xl"
                        alt="Banners"
                      />
                    </div>
                  )}
                  {sectionBanners?.sectionBanner3 && (
                    <div
                      data-aos="fade-left"
                      data-aos-easing="ease-in-out"
                      className="bg-cover bg-center rounded-2xl h-full relative overflow-hidden cursor-pointer min-h-0"
                      onClick={() => {
                        const url = !isMobile
                          ? sectionBanners?.sectionBanner3?.url_web
                          : sectionBanners?.sectionBanner3?.url_web;

                        pushToDataLayer("clicked_card", currentcountry?.name, {
                          card_name: sectionBanners?.sectionBanner3?.image_web,
                          page: window.location.pathname,
                        });
                        router.push(url);
                      }}
                    >
                      <img
                        src={
                          !isMobile
                            ? sectionBanners?.sectionBanner3?.image_web
                            : sectionBanners?.sectionBanner3?.image_web
                        }
                        className="w-full h-full rounded-2xl"
                        alt="Banners"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DynamicBanners bannerKey="mainBanner1" enableAos={true} />

        {/* Top Brands Section  */}
        <div
          className={`text-xl mt-4 lg:text-[28px] pl-4 text-[#43494B] font-outfit font-bold mb-4`}
        >
          Shop By Top Brands
        </div>
        <div
          data-aos="fade"
          data-aos-easing="ease-in-out"
          className="mb-4 overflow-hidden max-w-full"
        >
          <Marquee
            autoFill={true}
            speed={20}
            play={true}
            pauseOnHover
            pauseOnClick
            gradient={false}
            className="overflow"
          >
            <div className="flex gap-4">
              {topBrands.map((b, index) => {
                return (
                  <Link
                    key={index}
                    href={b?.url}
                    className="bg-[#000000]/[4%] p-6 lg:p-10 rounded-xl flex-shrink-0 w-32 sm:w-40 lg:w-48 last:mr-4"
                    data-aos="fade"
                    data-aos-easing="linear"
                    onClick={() => {
                      const brandName = b.name;
                      pushToDataLayer(
                        "clicked_card_in_section",
                        currentcountry?.name,
                        {
                          card_name: brandName,
                          section_name: "Shop By Top Brands",
                          page: window.location.pathname,
                        }
                      );
                    }}
                  >
                    <img
                      loading="lazy"
                      className="mix-blend-multiply w-full h-auto object-contain"
                      src={b.desktopImage}
                      alt={`${b.name || "Brand"} logo`}
                    />
                  </Link>
                );
              })}
            </div>
          </Marquee>
        </div>

        <div className="mt-3"></div>

        {/* Second Tabs Section  */}
        <Tabs
          tabs={[
            {
              title: "Deals of the Day",
              endpoint: getDealOfTheDayApi,
              path: "",
              imgUrl: !isMobile
                ? sectionBanners?.tabBanner1?.image_web
                : sectionBanners?.tabBanner1?.image_app,
              imgRedirectionUrl: !isMobile
                ? sectionBanners?.tabBanner1?.url_web
                : sectionBanners?.tabBanner1?.url_app,
            },
            {
              title: "Bundle Deals",
              endpoint: bundle_clearance_sale,
              path: "bundle_deals",
              imgUrl: !isMobile
                ? sectionBanners?.tabBanner2?.image_web
                : sectionBanners?.tabBanner2?.image_app,
              imgRedirectionUrl: !isMobile
                ? sectionBanners?.tabBanner2?.url_web
                : sectionBanners?.tabBanner2?.url_app,
            },
            {
              title: "Exciting Offers",
              endpoint: getdeal_offersApi,
              path: "exciting_offers",
              imgUrl: !isMobile
                ? sectionBanners?.tabBanner3?.image_web
                : sectionBanners?.tabBanner3?.image_app,
              imgRedirectionUrl: !isMobile
                ? sectionBanners?.tabBanner3?.url_web
                : sectionBanners?.tabBanner3?.url_app,
            },
          ]}
          breakPointsProps={{
            200: { slidesPerView: 1.3 },
            375: { slidesPerView: 2 },
            425: { slidesPerView: 2 },
            700: { slidesPerView: 2 },
            900: { slidesPerView: 3 },
            1200: { slidesPerView: 4 },
            1400: { slidesPerView: 4 },
            1600: { slidesPerView: 5 },
          }}
        />

        {/* Category List */}
        <div
          className={`text-xl lg:text-[28px] pl-4 pt-7 text-[#43494B] font-outfit font-bold mb-4`}
        >
          Browse Popular Categories
        </div>
        <div className="grid grid-cols-2 md:grid-cols-9 gap-2 overflow-hidden max-w-full">
          {categoriesToShow?.map((cat, idx) => (
            <div
              data-aos="fade"
              data-aos-easing="ease-in-out"
              key={idx}
              className="flex h-full items-center justify-center py-3 cursor-pointer"
              onClick={() => {
                pushToDataLayer(
                  "clicked_card_in_section",
                  currentcountry?.name,
                  {
                    card_name: cat.category_name,
                    section_name: "Browse Popular Categories",
                    page: window.location.pathname,
                  }
                );
                router.push("/categories/" + cat.url);
              }}
            >
              <div className="relative transition-transform duration-[300ms] group-hover:duration-[800ms] group-hover:scale-110 z-10 flex flex-col items-center justify-start">
                <div className="w-36 h-36 md:w-16 md:h-16 xl:w-24 xl:h-24 rounded-full flex items-center justify-center">
                  <img
                    src={cat.vector_icon}
                    alt={cat.category_name}
                    className="w-full h-full object-contain"
                    style={{
                      filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.3))",
                    }}
                  />
                </div>
                <h5 className="mt-1 text-base md:text-xs lg:text-base text-center font-medium text-gray-700 break-words whitespace-normal leading-tight min-h-10">
                  {cat.category_name}
                </h5>
              </div>
            </div>
          ))}
        </div>

        <DynamicBanners bannerKey="mainBanner2" enableAos={true} />

        {/* Best Deals section */}
        <div className="component_1 mt-4">
          <ComponentHeader
            title={"Top Picks"}
            view_all={"rgba(82, 50, 194, 1)"}
          />
          <div
            className="carousel_products"
            style={{ background: !isMobile && "rgba(238, 235, 250, 1)" }}
          >
            {!loading5 && (
              <BestDeals
                carousel_data={top_picks}
                breakPointsProps={{
                  200: { slidesPerView: 1.3 },
                  375: { slidesPerView: 2 },
                  425: { slidesPerView: 2 },
                  760: { slidesPerView: 2 },
                  1000: { slidesPerView: 3 },
                  1200: { slidesPerView: 4 },
                  1400: { slidesPerView: 4 },
                  1600: { slidesPerView: 5 },
                }}
              />
            )}
          </div>
        </div>

        {/* MultiPle Banners */}
        <div className="flex flex-wrap -mx-2 multi_banners mt-4">
          {!loading && (
            <>
              {bannerList?.multibanners?.map((banner, index) => {
                return (
                  <div
                    key={banner.banner_id}
                    className="w-full lg:w-1/2 px-2 padding_custom"
                  >
                    <Link
                      href={banner.url}
                      onClick={() => {
                        pushToDataLayer("clicked_card", currentcountry?.name, {
                          card_name: banner.banner_image,
                          page: window.location.pathname,
                        });
                      }}
                    >
                      <img src={banner.banner_image} />
                    </Link>
                  </div>
                );
              })}
            </>
          )}
        </div>

        <div
          className={`flex flex-wrap -mx-2 multi_banners_four ${
            !isMobile && "mt-0"
          }`}
        >
          {!loading && (
            <>
              {bannerList?.banner?.map((banner) => {
                return (
                  <div
                    key={banner.banner_id}
                    className="w-full lg:w-1/4 md:w-1/4 sm:w-1/2 px-2 pr-unset"
                  >
                    <Link
                      href={banner.url}
                      onClick={() => {
                        pushToDataLayer("clicked_card", currentcountry?.name, {
                          card_name: banner.banner_image,
                          page: window.location.pathname,
                        });
                      }}
                    >
                      <img src={banner.banner_image} />
                    </Link>
                  </div>
                );
              })}
            </>
          )}
        </div>

        <DynamicBanners bannerKey="mainBanner3" enableAos={true} />

        {/* Brand of the week */}
        <BrandOfTheWeekUpdated products={brand_week?.[0]?.items} />

        <DynamicBanners bannerKey="mainBanner4" />

        <DynamicBanners bannerKey="mainBanner5" />

        {!loading6 && (
          <>
            {home_category_items?.map((section) => {
              return (
                <div className="component_1 mt-4" key={section.url}>
                  <ComponentHeader
                    title={section.subcategory_name}
                    url={`/products-category/${section.url}`}
                    view_all={"rgba(82, 50, 194, 1)"}
                  />
                  <CarouselProducts
                    products={section.items}
                    type={1}
                    inner_bg={"rgba(238, 235, 250, 1)"}
                    section_name={section.subcategory_name}
                  />
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
