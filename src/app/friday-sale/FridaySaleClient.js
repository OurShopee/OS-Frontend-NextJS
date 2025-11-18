"use client";
import DesktopView from "@/components/blackfriday/DesktopView";
import MobileViewCard from "@/components/blackfriday/mobileViewCard";
import { MediaQueries } from "@/components/utils";
import { pushToDataLayer } from "@/components/utils/dataUserpush";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const FridaySaleClient = ({ saleData, currentcountry }) => {
  const { isMobile } = MediaQueries();

  useEffect(() => {
    const offset = window.innerHeight * 0.08;
    AOS.init({
      once: true,
      offset: offset,
    });
    pushToDataLayer("view_sale_page", currentcountry?.name);
  }, [currentcountry]);

  const sectionData = saleData?.other_section;

  const NowOrNeverDeals =
    sectionData?.find((d) => d.heading === "NOW OR NEVER DEALS")?.items?.[0]
      ?.items || [];
  const BudgetSectionData =
    sectionData?.find((d) => d.heading === "Something For Every Budget")
      ?.items ||
    sectionData?.find((d) => d.heading === "Something For Every Budget")
      ?.images ||
    [];

  const FlashSale =
    sectionData?.find((d) => d.heading === "Flash Sale")?.items?.[0]?.items ||
    [];

  const LowestPriceEver =
    sectionData?.find((d) => d.heading === "Lowest Price Ever")?.items?.[0]
      ?.items || [];

  const OurshoppeFridayBanner =
    sectionData?.find((d) => d.heading === "Ourshopee Friday")?.images || [];

  const FlashSaleBanner =
    sectionData?.find((d) => d.heading === "Flash Sale Banner")?.images || [];

  const BeautyBanner =
    sectionData?.find((d) => d.heading === "Beauty Single Banner")?.images ||
    [];
  const AppUpdateBanner =
    sectionData?.find((d) => d.heading === "App Update Banner")?.images || [];

  const PreOwnedLaptops =
    sectionData?.find((d) => d.heading === "Pre Owned Laptop")?.items?.[0] ||
    [];
  const Watches =
    sectionData?.find((d) => d.heading === "Watches")?.items?.[0] || [];
  const Perfumes =
    sectionData?.find((d) => d.heading === "Perfumes")?.items?.[0] || [];
  const HealthBeauty =
    sectionData?.find((d) => d.heading === "Health & Beauty")?.items?.[0] || [];
  const Accessories =
    sectionData?.find((d) => d.heading === "Accessories")?.items?.[0] || [];
  const HomeAppliances =
    sectionData?.find((d) => d.heading === "Home Appliances")?.items?.[0] || [];
  const MotherBaby =
    sectionData?.find((d) => d.heading === "Baby & Mother care")?.items?.[0] ||
    [];
  const ToysGames =
    sectionData?.find((d) => d.heading === "Toys & Games")?.items?.[0] || [];
  const PreOwnedMobiles =
    sectionData?.find((d) => d.heading === "Pre-Owned Mobiles")?.items?.[0] ||
    [];
  const PreOwnedLaptopsBanner =
    sectionData?.find((d) => d.heading === "Pre Owned Laptop Banner")?.images ||
    [];
  const WatchesBanner =
    sectionData?.find((d) => d.heading === "Watches Banner")?.images || [];
  const PerfumesBanner =
    sectionData?.find((d) => d.heading === "Perfumes Banner")?.images || [];
  const HealthBeautyBanner =
    sectionData?.find((d) => d.heading === "Health & Beauty Banner")?.images ||
    [];
  const AccessoriesBanner =
    sectionData?.find((d) => d.heading === "Accessories Banner")?.images || [];
  const HomeAppliancesBanner =
    sectionData?.find((d) => d.heading === "Home Appliances Banner")?.images ||
    [];
  const MotherBabyBanner =
    sectionData?.find((d) => d.heading === "Baby & Mother care Banner")
      ?.images || [];
  const ToysGamesBanner =
    sectionData?.find((d) => d.heading === "Toys & Games Banner")?.images || [];
  const PreOwnedMobilesBanner =
    sectionData?.find((d) => d.heading === "Pre-Owned Mobiles Banner")
      ?.images || [];

  const categories = sectionData?.find((d) => d.type === 1) || [];
  const categoryItems = [
    {
      id: 1,
      percent: "60",
      color: "#EED6B2",
      textColor: "#FFFFFFCC",
      url: "/categories/pre-owned",
      sub_category_image: "/assets/11-sale/categories/phone.png",
      sub_category_name: `Pre-Owned Laptops & Mobiles`,
      mobileImg: "preowned.png",
    },
    {
      id: 2,
      percent: "70",
      color: "#4F4537",
      textColor: "#F3E3CA",
      url: "/products-category/perfumes",
      sub_category_image: "/assets/11-sale/categories/sunglass.png",
      sub_category_name: "Perfumes",
      mobileImg: "perfumes.png",
    },
    {
      id: 3,
      percent: "40",
      color: "#B5AA99B2",
      textColor: " #4D4D4D",
      url: "/products-category/Analog-Watches",
      sub_category_image: "/assets/11-sale/categories/Perfume.png",
      sub_category_name: "Watches",
      mobileImg: "watches.png",
    },
    {
      id: 4,
      percent: "60",
      color: "#A9E5DBB2",
      textColor: " #4D4D4D",
      url: "/categories/home-appliances",
      sub_category_image: "/assets/11-sale/categories/Watch.png",
      sub_category_name: "Home Appliances",
      mobileImg: "homeAppliances.png",
    },
    {
      id: 5,
      percent: "50",
      color: "#D2B993",
      textColor: "#F2EEE8",
      url: "/categories/health-beauty",
      sub_category_image: "/assets/11-sale/categories/Tv.png",
      sub_category_name: "Health & Beauty",
      mobileImg: "health.png",
    },
  ];

  const rows = [
    PreOwnedLaptops,
    Watches,
    Perfumes,
    HealthBeauty,
    Accessories,
    HomeAppliances,
    MotherBaby,
    ToysGames,
    PreOwnedMobiles,
    PreOwnedLaptopsBanner,
    WatchesBanner,
    PerfumesBanner,
    HealthBeautyBanner,
    AccessoriesBanner,
    HomeAppliancesBanner,
    MotherBabyBanner,
    ToysGamesBanner,
    PreOwnedMobilesBanner,
  ];

  return (
    <div className="container mx-auto">
      {!isMobile ? (
        <DesktopView
          NowOrNeverDeals={NowOrNeverDeals}
          FlashSaleItems={FlashSale}
          LowestPriceEver={LowestPriceEver}
          OurshoppeFridayBanner={OurshoppeFridayBanner}
          FlashSaleBanner={FlashSaleBanner}
          BudgetSectionData={BudgetSectionData}
          BeautyBanner={BeautyBanner}
          AppUpdateBanner={AppUpdateBanner}
          rows={rows}
          categoryItems={categoryItems}
        />
      ) : (
        <MobileViewCard
          NowOrNeverDeals={NowOrNeverDeals}
          FlashSaleItems={FlashSale}
          LowestPriceEver={LowestPriceEver}
          BudgetSectionData={BudgetSectionData}
          OurshoppeFridayBanner={OurshoppeFridayBanner}
          FlashSaleBanner={FlashSaleBanner}
          AppUpdateBanner={AppUpdateBanner}
          BeautyBanner={BeautyBanner}
          rows={rows}
          categoryItems={categoryItems}
        />
      )}
    </div>
  );
};

export default FridaySaleClient;
