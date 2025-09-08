"use client";
import AOS from "aos";
import "aos/dist/aos.css";
import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
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
  const bundle_clearance = useSelector(
    (state) => state?.homeslice?.bundle_clearance_sale
  );
  const deals_offers = useSelector((state) => state?.homeslice?.deals_offers);
  const DealOfTheDay = useSelector((state) => state?.homeslice?.DealOfTheDay);
  const saver_zone = useSelector((state) => state?.homeslice?.saver_zone);
  const TopSelling = useSelector((state) => state?.homeslice?.TopSelling);
  const top_picks = useSelector((state) => state?.homeslice?.top_picks);
  const brand_week = useSelector((state) => state?.homeslice?.brand_week);
  const deals_loading = useSelector((state) => state?.homeslice?.loading1);
  const loading5 = useSelector((state) => state?.homeslice?.loading5);
  const saver_zone_loading = useSelector((state) => state?.homeslice?.loading3);
  const TopSelling_loading = useSelector((state) => state?.homeslice?.loading4);
  const DealOfTheDay_loading = useSelector((state) => state?.homeslice?.loading2);
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
console.log("currentcountry",currentcountry)
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
    const id = currentcountry.nav_items.find((i) => i.id === 11)?.section_id;
    setSectionId(id);
    const saverId = currentcountry.nav_items.find(
      (i) => i.id === 6
    )?.section_id;
    setSaverId(saverId);
  }, [currentcountry]);

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
    pushToDataLayer("viewed_home_page", currentcountry.name);
  }, []);

  const categoriesToShow = isMobile
    ? (categoryList || [])?.slice(0, 6)
    : (categoryList || [])?.slice(0, 9);

  return (
    <div className="tw-overflow-hidden" style={{ maxWidth: "max-content" }}>
      {/* <SeoMeta
        title="Online Shopping UAE - Mobiles, Laptops, Appliances & More | OurShopee"
        description="Shop online for great deals on electronics, home appliances, perfumes, watches & more at OurShopee UAE. Browse our collections today - Fast Delivery & Easy Returns!"
        keywords="online shopping, deals, offers, electronics, fashion, home appliances"
        image="https://yourcdn.com/assets/og-home-image.webp"
        url="https://www.ourshopee.com/"
      /> */}

      {!loading ? (
        isLaptop ? (
          <Container fluid className="pt-2">
            <HomeMobileCarousel carousel_data={bannerList?.carousel} />
          </Container>
        ) : (
          <HomeCarousel
            carousel_data={bannerList?.carousel}
            searchPage={false}
          />
        )
      ) : (
        <HomeBannerPlaceholder height={424} />
      )}

      <Container fluid>
        {isMobile && <HomeCategories category_list={categoryList} type={1} />}

        {/* Tabs with Sale Ends in Section */}
        <div className="tw-flex tw-h-full tw-flex-col lg:tw-flex-row tw-pt-2">
          {/* Tabs Component - 3/5 Width */}
          <div
            className="tw-w-full tw-h-full lg:tw-w-3/5 tw-pr-3"
            ref={leftColRef}
          >
            <Tabs
              tabs={[
                {
                  title: "Saver zone",
                  endpoint: () => getSaverZoneProducts(saverId),
                  path: "",
                },
                {
                  title: "Top Selling",
                  endpoint: getTopSellingApi,
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
            className="tw-w-full lg:tw-w-2/5"
            style={!isMobile && !isTablet ? { height: leftHeight } : {}}
          >
            <div
              className={`tw-bg-white tw-rounded-3xl tw-pt-4 tw-h-full tw-flex tw-flex-col tw-overflow-hidden ${
                isInWindow ? "tw-gap-5" : ""
              }`}
            >
              {/* Header */}
              <div
                className={`tw-flex tw-justify-between tw-items-center tw-flex-shrink-0 ${
                  isInWindow ? "lg:tw-min-h-[45px]" : "lg:tw-min-h-[65px]"
                }`}
              >
                {isInWindow ? (
                  <>
                    <h2 className="tw-text-xl md:tw-text-2xl tw-font-semibold tw-text-[#2D2D2D] tw-mb-0">
                      {bannerList?.dynamicTopSection?.title}
                    </h2>
                    <div
                      data-aos="fade-left"
                      data-aos-easing="ease-in-out"
                      className="tw-bg-[#ffce0973] tw-text-[#5132c2] tw-text-[16px] md:tw-text-[22px] tw-p-3 tw-rounded-xl tw-flex tw-items-center tw-gap-3 tw-font-semibold tw-leading-[1em] tw-tracking-[0em]"
                    >
                      <MdTimer className="tw-text-lg" />
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
                                <span className="tw-text-[#5132c2] tw-text-opacity-45">
                                  D
                                </span>{" "}
                                : {zeroPad(hours)}
                                <span className="tw-text-[#5132c2] tw-text-opacity-45">
                                  h
                                </span>{" "}
                                : {zeroPad(minutes)}
                                <span className="tw-text-[#5132c2] tw-text-opacity-45">
                                  m
                                </span>{" "}
                                : {zeroPad(seconds)}
                                <span className="tw-text-[#5132c2] tw-text-opacity-45">
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
                  <div className="lg:tw-h-[65px]" />
                )}
              </div>

              {/* Content Grid */}
              <div className="tw-grid tw-grid-cols-12 tw-gap-[15px] tw-flex-1 tw-min-h-0 tw-overflow-hidden">
                {/* Left Promo Box */}
                <div className="tw-col-span-7 tw-h-full tw-min-h-0">
                  {sectionBanners?.sectionBanner1 && (
                    <div
                      data-aos="zoom-in"
                      data-aos-duration="700"
                      data-aos-easing="ease-in-out"
                      className="tw-bg-cover tw-bg-center tw-rounded-2xl tw-h-full tw-relative tw-overflow-hidden tw-cursor-pointer"
                      onClick={() => {
                        const url = !isMobile
                          ? sectionBanners?.sectionBanner1?.url_web
                          : sectionBanners?.sectionBanner1?.url_web;

                        pushToDataLayer("clicked_card", currentcountry.name, {
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
                        className="tw-w-full tw-h-full  tw-rounded-2xl"
                        alt="Banners"
                      />
                    </div>
                  )}
                </div>

                {/* Right Stacked Images */}
                <div className="tw-col-span-5 tw-grid tw-grid-rows-2 tw-gap-[15px] tw-h-full tw-min-h-0">
                  {sectionBanners?.sectionBanner2 && (
                    <div
                      data-aos="fade-left"
                      data-aos-easing="ease-in-out"
                      className="tw-bg-cover tw-bg-center tw-rounded-2xl tw-h-full tw-relative tw-overflow-hidden tw-cursor-pointer tw-min-h-0"
                      onClick={() => {
                        const url = !isMobile
                          ? sectionBanners?.sectionBanner2?.url_web
                          : sectionBanners?.sectionBanner2?.url_web;

                        pushToDataLayer("clicked_card", currentcountry.name, {
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
                        className="tw-w-full tw-h-full tw-rounded-2xl"
                        alt="Banners"
                      />
                    </div>
                  )}
                  {sectionBanners?.sectionBanner3 && (
                    <div
                      data-aos="fade-left"
                      data-aos-easing="ease-in-out"
                      className="tw-bg-cover tw-bg-center tw-rounded-2xl tw-h-full tw-relative tw-overflow-hidden tw-cursor-pointer tw-min-h-0"
                      onClick={() => {
                        const url = !isMobile
                          ? sectionBanners?.sectionBanner3?.url_web
                          : sectionBanners?.sectionBanner3?.url_web;

                        pushToDataLayer("clicked_card", currentcountry.name, {
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
                        className="tw-w-full tw-h-full tw-rounded-2xl"
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
          className={`tw-text-xl mt-4 lg:tw-text-[28px] tw-pl-4 tw-text-[#43494B] tw-font-outfit tw-font-bold mb-4`}
        >
          Shop By Top Brands
        </div>
        <div
          data-aos="fade"
          data-aos-easing="ease-in-out"
          className="tw-mb-4 tw-overflow-hidden tw-max-w-full"
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
            <div className="tw-flex tw-gap-4">
              {topBrands.map((b, index) => {
                return (
                  <Link
                    key={index}
                    href={b?.url}
                    className="tw-bg-[#000000]/[4%] tw-p-6 lg:tw-p-10 tw-rounded-xl tw-flex-shrink-0 tw-w-32 sm:tw-w-40 lg:tw-w-48 last:tw-mr-4"
                    data-aos="fade"
                    data-aos-easing="linear"
                    onClick={() => {
                      const brandName = b.name;
                      pushToDataLayer(
                        "clicked_card_in_section",
                        currentcountry.name,
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
                      className="tw-mix-blend-multiply tw-w-full tw-h-auto tw-object-contain"
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
          className={`tw-text-xl lg:tw-text-[28px] tw-pl-4 tw-pt-7 tw-text-[#43494B] tw-font-outfit tw-font-bold mb-4`}
        >
          Browse Popular Categories
        </div>
        <div className="tw-grid tw-grid-cols-2 md:tw-grid-cols-9 tw-gap-2 tw-overflow-hidden tw-max-w-full">
          {categoriesToShow?.map((cat, idx) => (
            <div
              data-aos="fade"
              data-aos-easing="ease-in-out"
              key={idx}
              className="tw-flex tw-h-full tw-items-center tw-justify-center tw-py-3 tw-cursor-pointer"
              onClick={() => {
                pushToDataLayer(
                  "clicked_card_in_section",
                  currentcountry.name,
                  {
                    card_name: cat.category_name,
                    section_name: "Browse Popular Categories",
                    page: window.location.pathname,
                  }
                );
                router.push("/categories/" + cat.url);
              }}
            >
              <div className="tw-relative tw-transition-transform tw-duration-[300ms] group-hover:tw-duration-[800ms] group-hover:tw-scale-110 tw-z-10 tw-flex tw-flex-col tw-items-center tw-justify-start">
                <div className="tw-w-36 tw-h-36 md:tw-w-16 md:tw-h-16 xl:tw-w-24 xl:tw-h-24 tw-rounded-full tw-flex tw-items-center tw-justify-center">
                  <img
                    src={cat.vector_icon}
                    alt={cat.category_name}
                    className="tw-w-full tw-h-full tw-object-contain"
                    style={{
                      filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.3))",
                    }}
                  />
                </div>
                <h5 className="tw-mt-1 tw-text-base md:tw-text-xs lg:tw-text-base tw-text-center tw-font-medium tw-text-gray-700 tw-break-words tw-whitespace-normal tw-leading-tight tw-min-h-10">
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
        <Row className="multi_banners mt-4">
          {!loading && (
            <>
              {bannerList?.multibanners?.map((banner, index) => {
                return (
                  <Col lg={6} key={banner.banner_id} className="padding_custom">
                    <Link
                      href={banner.url}
                      onClick={() => {
                        pushToDataLayer("clicked_card", currentcountry.name, {
                          card_name: banner.banner_image,
                          page: window.location.pathname,
                        });
                      }}
                    >
                      <img src={banner.banner_image} />
                    </Link>
                  </Col>
                );
              })}
            </>
          )}
        </Row>

        <Row className={`multi_banners_four ${!isMobile && "mt-0"}`}>
          {!loading && (
            <>
              {bannerList?.banner?.map((banner) => {
                return (
                  <Col
                    lg={3}
                    md={3}
                    key={banner.banner_id}
                    sm={6}
                    xs={6}
                    className="pr-unset"
                  >
                    <Link
                      href={banner.url}
                      onClick={() => {
                        pushToDataLayer("clicked_card", currentcountry.name, {
                          card_name: banner.banner_image,
                          page: window.location.pathname,
                        });
                      }}
                    >
                      <img src={banner.banner_image} />
                    </Link>
                  </Col>
                );
              })}
            </>
          )}
        </Row>

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
      </Container>
    </div>
  );
};

export default Home;
