"use client";
import { ComponentHeader } from "@/components/Common";
import { HomeBannerPlaceholder } from "@/components/Common/Placeholders";
import AOS from "aos";
import "aos/dist/aos.css";
import { toZonedTime } from "date-fns-tz";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import SeoMeta from "../components/Common/SeoMeta";
import {
  bundle_clearance_sale,
  clearance_saleApi,
  getdeal_offersApi,
  getDealOfTheDayApi,
  getSaverZoneProducts,
  getSectionPagesApi,
  getTopSellingApi,
} from "@/api/products";
import { useContent, getDynamicContent, useCurrentLanguage } from "@/hooks";
import Tabs from "@/components/Common/Tabs";
import {
  BrandOfTheWeekUpdated,
  CarouselWithBanner,
  DealsYouMightLike,
  DynamicBanners,
  HomeCarousel,
  HomeCategories,
  HomeMobileCarousel,
  LimitedTimeDeals,
  MastZone,
  ProductBanners,
  PromotionalBanners,
  TopSelling,
} from "@/components/homepage";
import { MediaQueries } from "@/components/utils";
import { pushToDataLayer } from "@/components/utils/dataUserpush";
import { getImagesByKey } from "@/components/utils/getImagesByKey";
import { getcategory_items } from "@/redux/homeslice";

const HomeClient = ({
  initialNavigationData,
  initialBannerListData,
  initialCategoryItemsData,
  initialSectionsData,
}) => {
  const currentLanguage = useCurrentLanguage();
  const bannerListFromRedux = useSelector(
    (state) => state?.homeslice?.bannerList
  );
  const bannerList = initialBannerListData?.data || bannerListFromRedux;
  const loadingFromRedux = useSelector((state) => state?.homeslice?.loading);
  const loading = initialBannerListData ? false : loadingFromRedux;
  const loading6FromRedux = useSelector((state) => state?.homeslice?.loading6);
  const loading6 = initialCategoryItemsData ? false : loading6FromRedux;
  const home_category_itemsFromRedux = useSelector(
    (state) => state?.homeslice?.home_category_items
  );
  const home_category_items =
    initialCategoryItemsData || home_category_itemsFromRedux;

  const top_picks = useSelector((state) => state?.homeslice?.top_picks);
  const brand_week = useSelector((state) => state?.homeslice?.brand_week);
  const loading5 = useSelector((state) => state?.homeslice?.loading5);
  const categoryList = useSelector((state) => state?.globalslice?.data);
  const currentcountry = useSelector(
    (state) => state?.globalslice?.currentcountry
  );
  const dispatch = useDispatch();
  const leftColRef = useRef(null);
  const { isMobile, isTablet, isLaptop } = MediaQueries();
  const [saverId, setSaverId] = useState();
  const [sectionBanners, setSectionBanners] = useState({});

  // Language content
  const topSelling = useContent("specialPages.topSelling");
  const saverZone = useContent("specialPages.saverZone");
  const clearanceDeals = useContent("specialPages.clearanceDeals");
  const dealsOfTheDay = useContent("specialPages.dealsOfTheDay");
  const bundleDeals = useContent("specialPages.bundleDeals");
  const excitingOffers = useContent("specialPages.excitingOffers");
  const topPicks = useContent("specialPages.topPicks");

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
    // Use server-side navigation data if available, otherwise use Redux state
    const navItems =
      initialNavigationData?.data?.nav_items || currentcountry?.nav_items;

    const saverId = navItems?.find((i) => i.id === 6)?.section_id;
    setSaverId(saverId);
  }, [currentcountry?.nav_items, initialNavigationData]);


  useEffect(() => {
    // Only dispatch getcategory_items if we don't have server-side data
    if (!initialCategoryItemsData) {
      dispatch(getcategory_items());
    }

    const offset = window.innerHeight * 0.08;
    AOS.init({
      once: true,
      offset: offset,
      delay: 200,
      duration: 500,
    });
  }, [initialCategoryItemsData]);

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

  const dealsByCountry = currentcountry?.dealsByCountry;

  const getSectionData = (label) => {
    const sectionId = dealsByCountry?.[label];

    return initialSectionsData?.data?.other_section?.find((section) => {
      if (sectionId) {
        return String(section.section_id) === String(sectionId);
      }

      return (
        section?.heading === label ||
        section?.title === label ||
        section?.name === label
      );
    });
  };
  const section238Data = getSectionData("Mast Zone");
  const section59Data = getSectionData("Namaste Deals");
  const topSellingData = getSectionData("Top Selling");
  const dealsYouMightLikeData = getSectionData("Deals You Might Like");
  const limitedTimeDealsData = getSectionData("Limited Time Deals");
  let mastZoneBgImage = section238Data?.background_image[0]?.desktopImage;
  let namasteZoneBgImage = section59Data?.background_image[0]?.desktopImage;

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
        {/* Mast Zone, Top Selling, Promotional Banners Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[14px] md:max-h-[360px] md:overflow-hidden my-6">
          {/* Left Section - Mast Zone */}
          <div className="">
            <MastZone
              section238Data={section238Data}
              section59Data={section59Data}
              mastZoneBgImage={mastZoneBgImage}
              namasteZoneBgImage={namasteZoneBgImage}
            />
          </div>

          {/* Middle Section - Top Selling */}
          <div className="md:mt-0.5">
            <TopSelling topSellingData={topSellingData} />
          </div>

          {/* Right Section - Promotional Banners */}
          <div className="">
            <PromotionalBanners sectionBanners={sectionBanners} />
          </div>
        </div>
        {/* Top Picks */}
        <div className="component_1 mt-4">
          <ComponentHeader
            title={topPicks}
            view={false}
            // view_all={"rgba(82, 50, 194, 1)"}
            url={top_picks?.[0]?.url}
          />

          {!loading5 && (
            <CarouselWithBanner
              products={top_picks?.[0]?.productlist}
              bannerImage={top_picks?.[0]?.image_slider}
              bannerImageRedirectUrl={top_picks?.[0]?.url}
              type={1}
              inner_bg={"rgba(238, 235, 250, 1)"}
            />
          )}
        </div>
        {/* Tabs Section */}
        <Tabs
          tabs={[
            {
              title: dealsOfTheDay,
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
              title: bundleDeals,
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
              title: excitingOffers,
              endpoint: getdeal_offersApi,
              path: "exciting_offers",
              imgUrl: !isMobile
                ? sectionBanners?.tabBanner3?.image_web
                : sectionBanners?.tabBanner3?.image_app,
              imgRedirectionUrl: !isMobile
                ? sectionBanners?.tabBanner3?.url_web
                : sectionBanners?.tabBanner3?.url_app,
            },
            {
              title: topSelling,
              endpoint: getTopSellingApi,
              path: "",
            },
            {
              title: saverZone,
              endpoint: () => getSaverZoneProducts(saverId),
              path: "",
            },
            {
              title: clearanceDeals,
              endpoint: clearance_saleApi,
              path: "items",
            },
          ]}
          countdownEndDate={section238Data?.timer}
        />
        {/* Deals You Might Like Section/RoW */}
        <div className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Column - Deals You Might Like */}
            <div className="lg:col-span-1 deals-you-like">
              <DealsYouMightLike deals={dealsYouMightLikeData} />
            </div>

            {/* Middle Column - Limited Time Deals */}
            <div className="lg:col-span-1 deals-you-like relative">
              {limitedTimeDealsData?.background_image?.length > 0 ? (
                <div className="absolute inset-0 z-0">
                  <img src={
                      limitedTimeDealsData?.background_image[0]?.desktopImage
                    }
                    alt="Limited Time Deals Background"
                    fill
                    className="object-cover w-full h-full"
                    priority
                  loading="lazy" />
                  {/* Optional overlay for better text readability */}
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
              ) : (
                <div
                  className={`absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-500 z-0`}
                ></div>
              )}
              <LimitedTimeDeals deals={limitedTimeDealsData} />
            </div>

            {/* Right Column - Product Banners */}
            <div className="lg:col-span-1">
              <ProductBanners />
            </div>
          </div>
        </div>
        {/* Next 2 Categories Sections */}
        {!loading6 && (
          <>
            {home_category_items?.slice(0, 3)?.map((section) => {
              return (
                <div className="component_1 my-4" key={section.url}>
                  <ComponentHeader
                    title={getDynamicContent(section, "subcategory_name", currentLanguage)}
                    url={`/products-category/${section.url}`}
                    view_all={"rgba(82, 50, 194, 1)"}
                  />
                  <CarouselWithBanner
                    products={section.items}
                    bannerImage={
                      isMobile ? section?.image_app : section?.image_web
                    }
                    bannerImageRedirectUrl={`/products-category/${section.url}`}
                    type={1}
                    inner_bg={"rgba(238, 235, 250, 1)"}
                    section_name={getDynamicContent(section, "subcategory_name", currentLanguage)}
                  />
                </div>
              );
            })}
          </>
        )}
        {/* Brand of the week */}
        <BrandOfTheWeekUpdated products={brand_week?.[0]?.items} name={brand_week?.[0]?.brand_name} url={brand_week?.[0]?.url} />
        {/* Next 2 Categories Sections */}
        {!loading6 && (
          <>
            {home_category_items?.slice(3, 6)?.map((section) => {
              return (
                <div className="component_1 mt-4" key={section.url}>
                  <ComponentHeader
                    title={getDynamicContent(section, "subcategory_name", currentLanguage)}
                    url={`/products-category/${section.url}`}
                    view_all={"rgba(82, 50, 194, 1)"}
                  />
                  <CarouselWithBanner
                    products={section.items}
                    bannerImage={
                      isMobile
                        ? section?.image_app
                        : section?.image_web || section?.image
                    }
                    bannerImageRedirectUrl={`/products-category/${section.url}`}
                    type={1}
                    inner_bg={"rgba(238, 235, 250, 1)"}
                    section_name={getDynamicContent(section, "subcategory_name", currentLanguage)}
                  />
                </div>
              );
            })}
          </>
        )}
        <DynamicBanners bannerKey="mainBanner3" enableAos={true} />
        {/* Next 2 Categories Sections */}
        {!loading6 && (
          <>
            {home_category_items?.slice(6, 9)?.map((section) => {
              return (
                <div className="component_1 mt-4" key={section.url}>
                  <ComponentHeader
                    title={getDynamicContent(section, "subcategory_name", currentLanguage)}
                    url={`/products-category/${section.url}`}
                    view_all={"rgba(82, 50, 194, 1)"}
                  />
                  <CarouselWithBanner
                    products={section.items}
                    bannerImage={
                      isMobile ? section?.image_app : section?.image_web
                    }
                    bannerImageRedirectUrl={`/products-category/${section.url}`}
                    type={1}
                    inner_bg={"rgba(238, 235, 250, 1)"}
                    section_name={getDynamicContent(section, "subcategory_name", currentLanguage)}
                  />
                </div>
              );
            })}
          </>
        )}
        <DynamicBanners bannerKey="mainBanner4" enableAos={true} />
        {/* Next 2 Categories Sections */}
        {!loading6 && (
          <>
            {home_category_items
              ?.slice(9, home_category_items.length)
              ?.map((section) => {
                return (
                  <div className="component_1 mt-4" key={section.url}>
                    <ComponentHeader
                      title={getDynamicContent(section, "subcategory_name", currentLanguage)}
                      url={`/products-category/${section.url}`}
                      view_all={"rgba(82, 50, 194, 1)"}
                    />
                    <CarouselWithBanner
                      products={section.items}
                      bannerImage={
                        isMobile ? section?.image_app : section?.image_web
                      }
                      bannerImageRedirectUrl={`/products-category/${section.url}`}
                      type={1}
                      inner_bg={"rgba(238, 235, 250, 1)"}
                      section_name={getDynamicContent(section, "subcategory_name", currentLanguage)}
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

export default HomeClient;
