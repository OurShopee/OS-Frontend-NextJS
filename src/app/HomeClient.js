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
import Tabs from "@/components/Common/Tabs";
import {
  CarouselWithBanner,
  HomeCarousel,
  HomeCategories,
  HomeMobileCarousel
} from "@/components/homepage";
import BrandOfTheWeekUpdated from "@/components/homepage/BrandOfTheWeekUpdated";
import DealsYouMightLike from "@/components/homepage/DealsYouMightLike";
import DynamicBanners from "@/components/homepage/DynamicBanners";
import LimitedTimeDeals from "@/components/homepage/LimitedTimeDeals";
import MastZone from "@/components/homepage/MastZone";
import ProductBanners from "@/components/homepage/ProductBanners";
import PromotionalBanners from "@/components/homepage/PromotionalBanners";
import TopSelling from "@/components/homepage/TopSelling";
import { MediaQueries } from "@/components/utils";
import { pushToDataLayer } from "@/components/utils/dataUserpush";
import { getImagesByKey } from "@/components/utils/getImagesByKey";
import { getcategory_items } from "@/redux/homeslice";

const HomeClient = ({
  initialNavigationData,
  initialBannerListData,
  initialSectionPagesData,
  initialCategoryItemsData,
  initialSectionsData,
  initialBrandOfTheWeekData
}) => {

  const router = useRouter();
  const bannerListFromRedux = useSelector(
    (state) => state?.homeslice?.bannerList
  );
  const bannerList = initialBannerListData?.data || bannerListFromRedux;
  const brandOfTheWeekData = initialBrandOfTheWeekData?.data
  const loadingFromRedux = useSelector((state) => state?.homeslice?.loading);
  const loading = initialBannerListData ? false : loadingFromRedux;
  const loading6FromRedux = useSelector((state) => state?.homeslice?.loading6);
  const loading6 = initialCategoryItemsData ? false : loading6FromRedux;
  const loading8 = useSelector((state) => state?.homeslice?.loading8);
  const loading9 = useSelector((state) => state?.homeslice?.loading9);
  const home_category_itemsFromRedux = useSelector(
    (state) => state?.homeslice?.home_category_items
  );
  const home_category_items =
    initialCategoryItemsData || home_category_itemsFromRedux;

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
    // Use server-side data if available, otherwise fetch client-side
    if (
      initialSectionPagesData &&
      initialSectionPagesData?.status === "success"
    ) {
      setSaleData(initialSectionPagesData.data);
    } else {
      const getData = async () => {
        const res = await getSectionPagesApi(sectionId);
        if (res?.data?.status === "success") {
          setSaleData(res.data.data);
        }
      };
      if (sectionId && !(sectionId?.length === 0)) {
        getData();
      }
    }
  }, [sectionId, initialSectionPagesData]);

  useEffect(() => {
    // Use server-side navigation data if available, otherwise use Redux state
    const navItems =
      initialNavigationData?.data?.nav_items || currentcountry?.nav_items;

    const id = navItems?.find((i) => i.id === 11)?.section_id;
    setSectionId(id);
    const saverId = navItems?.find((i) => i.id === 6)?.section_id;
    setSaverId(saverId);
  }, [currentcountry?.nav_items, initialNavigationData]);

  useEffect(() => {
    const sectionData = saleData?.other_section;
    const topBrands = sectionData?.find(
      (d) => d.heading === "Top Brands"
    )?.items;
    setTopBrands(topBrands || []);
  }, [saleData]);

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
  
  const dealsYouMightLikeData = initialSectionsData?.data?.other_section?.find(
    (section) => section.section_id === "253"
  );
  const limitedTimeDealsData = initialSectionsData?.data?.other_section?.find(
    (section) => section.section_id === "248"
  );
  const section238Data = initialSectionsData?.data?.other_section?.find(
    (section) => section.section_id === "243"
  );
  const section59Data = initialSectionsData?.data?.other_section?.find(
    (section) => section.section_id === "259"
  );
  const topSellingData = initialSectionsData?.data?.other_section?.find(
    (section) => section.section_id === "74"
  );


  let mastZoneBgImage = section238Data?.background_image[0].desktopImage;
  let namasteZoneBgImage = section59Data?.background_image[0].desktopImage;

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
            title={"Top Picks"}
            view_all={"rgba(82, 50, 194, 1)"}
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
                  <img
                    src={
                      limitedTimeDealsData?.background_image[0]?.desktopImage
                    }
                    alt="Limited Time Deals Background"
                    fill
                    className="object-cover w-full h-full"
                    priority
                  />
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
                    title={section.subcategory_name}
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
                    section_name={section.subcategory_name}
                  />
                </div>
              );
            })}
          </>
        )}
        {/* Brand of the week */}
        <BrandOfTheWeekUpdated products={brandOfTheWeekData} />
        {/* Next 2 Categories Sections */}
        {!loading6 && (
          <>
            {home_category_items?.slice(3, 6)?.map((section) => {
              return (
                <div className="component_1 mt-4" key={section.url}>
                  <ComponentHeader
                    title={section.subcategory_name}
                    url={`/products-category/${section.url}`}
                    view_all={"rgba(82, 50, 194, 1)"}
                  />
                  <CarouselWithBanner
                    products={section.items}
                    bannerImage={
                      isMobile ? section?.image_app : section?.image_web || section?.image
                    }
                    bannerImageRedirectUrl={`/products-category/${section.url}`}
                    type={1}
                    inner_bg={"rgba(238, 235, 250, 1)"}
                    section_name={section.subcategory_name}
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
                    title={section.subcategory_name}
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
                    section_name={section.subcategory_name}
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
                      title={section.subcategory_name}
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

export default HomeClient;
