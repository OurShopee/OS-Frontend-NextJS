"use client";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/free-mode";

import Link from "next/link";
import { ComponentHeader } from "../Common";
import { CarouselWithBanner } from "../homepage";
import { MediaQueries } from "../utils";
import BudgetSection from "./BudgetSection";
import DiscountCard from "./CardComponent";
import FlashSale from "./FlashSale";
import LowestPriceSection from "./LowestPriceSection";
import MarqueeSale from "./MarqueeSale";
import NowOrNeverSection from "./NowOrNeverSection";

const MobileViewCard = ({
  categoryItems,
  NowOrNeverDeals,
  FlashSaleItems,
  LowestPriceEver,
  AppUpdateBanner,
  OurshoppeFridayBanner,
  FlashSaleBanner,
  BeautyBanner,
  BudgetSectionData,
  rows,
}) => {
  const mwebImg = [
    {
      path: "img-1.png",
      url: "/categories/pre-owned",
    },
    {
      path: "img-2.png",
      url: "/products-category/perfumes",
    },
    {
      path: "img-3.png",
      url: "/products-category/Analog-Watches",
    },
    {
      path: "img-4.png",
      url: "/categories/home-appliances",
    },
    {
      path: "img-5.png",
      url: "/categories/health-beauty",
    },
  ];
  const mwebImg2 = [
    {
      path: "img-1.png",
      url: "/categories/gaming-accessoriess",
    },
    {
      path: "img-2.png",
      url: "/products-category/pre-owned-laptops",
    },
    {
      path: "img-3.png",
      url: "/products-category/pre-owned-mobiles",
    },
    {
      path: "img-4.png",
      url: "/categories/accessories",
    },
    {
      path: "img-5.png",
      url: "/categories/electronics",
    },
  ];
  const { isMobile } = MediaQueries();
  const techGadgets = {
    three: [
      {
        title: "Pre-Owned Tablets",
        percent: "60",
        name: "tablets.png",
        url: "/products-category/Pre-Owned-Tablets",
      },
      {
        title: "Pre-Owned Laptops",
        percent: "60",
        name: "laptops.png",
        url: "/products-category/Pre-Owned-Laptops",
      },
      {
        title: "Pre-Owned Mobiles",
        percent: "60",
        name: "mobiles.png",
        url: "/products-category/Pre-Owned-Mobiles",
      },
    ],
    two: [
      {
        title: "Acessories",
        percent: "60",
        name: "acessories.png",
        url: "/products-category/Gaming-PC-Accessories",
      },
      {
        title: "Electronics Gadgets",
        percent: "60",
        name: "gadgets.png",
        url: "/categories/Electronics",
      },
    ],
  };

  return (
    <div className="container overflow-hidden">
      {/* BANNER */}
      <div className="relative">
        <div className="w-full">
          <img
            src={`${process.env.NEXT_PUBLIC_S3_PREFIX_BLACK_FRIDAY}/blackfridaybannermweb.png`}
            alt=""
            className="w-full h-full"
          />
        </div>
        <MarqueeSale />
      </div>
      <div className="w-full bg-black">
        <div className="pt-12 md:pt-20">
          <img
            src={`https://cdn.ourshopee.com/ourshopee-img/blackFriday/web/sectionBg.png`}
            alt=""
            className="w-full bg-black"
          />
        </div>
      </div>
      <div className="bg-black px-4">
        <div className="flex justify-center text-white text-xl md:text-[34px] font-bold mb-6 text-center">
          <span>Most &nbsp;</span>
          <span
            className=""
            style={{
              color: "#fff",
              paddingRight: "10px",
              background: "linear-gradient(90deg, #070707 0%, #707070 100%)",
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
              // adjusts 94% to control the angle, lower means deeper diagonal
            }}
          >
            Popular Categories
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          {mwebImg?.slice(0, 2).map((item, index) => (
            <Link key={index} href={item.url} className="no-underline">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.2,
                  duration: 0.4,
                  ease: "easeOut",
                }}
              >
                <img
                  src={`${process.env.NEXT_PUBLIC_S3_PREFIX_BLACK_FRIDAY}/mweb/popularCat/${item.path}`}
                />
              </motion.div>
            </Link>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {mwebImg?.slice(2, 5).map((item, index) => (
            <Link key={index} href={item.url} className="no-underline">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.2,
                  duration: 0.4,
                  ease: "easeOut",
                }}
              >
                <img
                  src={`${process.env.NEXT_PUBLIC_S3_PREFIX_BLACK_FRIDAY}/mweb/popularCat/${item.path}`}
                />
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      <div
        className="relative mb-4"
        style={{
          background: "linear-gradient(180deg, #070707 91.75%, #FAFAFA 100%)",
        }}
      >
        <div className="pb-12">
          <FlashSale
            FlashSaleItems={FlashSaleItems}
            FlashSaleBanner={FlashSaleBanner}
          />
        </div>
      </div>

      <div className="mb-4">
        <LowestPriceSection LowestPriceEver={LowestPriceEver} />
      </div>

      <div className="mb-4">
        <BudgetSection BudgetSectionData={BudgetSectionData} />
      </div>

      <div className="component_1 mb-4 px-5">
        <ComponentHeader
          title={"Pre Owned Mobiles"}
          url={rows?.[8].url}
          view_all={"rgba(82, 50, 194, 1)"}
        />
        <CarouselWithBanner
          products={rows?.[8].items}
          bannerImage={rows?.[17]?.desktopImage}
          bannerImageRedirectUrl={rows?.[17].url}
          type={1}
          inner_bg={"rgba(238, 235, 250, 1)"}
          section_name={"Pre Owned Mobiles"}
        />
      </div>
      <div className="component_1 mb-4 px-5">
        <ComponentHeader
          title={"Pre Owned Laptops"}
          url={rows?.[0].url}
          view_all={"rgba(82, 50, 194, 1)"}
        />
        <CarouselWithBanner
          products={rows?.[0].items}
          bannerImage={rows?.[9]?.desktopImage}
          bannerImageRedirectUrl={rows?.[9].url}
          type={1}
          inner_bg={"rgba(238, 235, 250, 1)"}
          section_name={"Pre Owned Laptops"}
        />
      </div>

      <div className="mb-4">
        <NowOrNeverSection NowOrNeverDeals={NowOrNeverDeals} />
      </div>

      <div className="component_1 mb-4 px-5">
        <ComponentHeader
          title={"Watches"}
          url={rows?.[1].url}
          view_all={"rgba(82, 50, 194, 1)"}
        />
        <CarouselWithBanner
          products={rows?.[1].items}
          bannerImage={rows?.[10]?.desktopImage}
          bannerImageRedirectUrl={rows?.[10].url}
          type={1}
          inner_bg={"rgba(238, 235, 250, 1)"}
          section_name={"Watches"}
        />
      </div>

      <div className="component_1 mb-4 px-5">
        <ComponentHeader
          title={"Perfumes"}
          url={rows?.[2].url}
          view_all={"rgba(82, 50, 194, 1)"}
        />
        <CarouselWithBanner
          products={rows?.[2].items}
          bannerImage={rows?.[11]?.desktopImage}
          bannerImageRedirectUrl={rows?.[11].url}
          type={1}
          inner_bg={"rgba(238, 235, 250, 1)"}
          section_name={"Perfumes"}
        />
      </div>

      <div className="component_1 mb-4 px-5">
        <ComponentHeader
          title={"Health & Beauty"}
          url={rows?.[3].url}
          view_all={"rgba(82, 50, 194, 1)"}
        />
        <CarouselWithBanner
          products={rows?.[3].items}
          bannerImage={rows?.[12]?.desktopImage}
          bannerImageRedirectUrl={rows?.[12].url}
          type={1}
          inner_bg={"rgba(238, 235, 250, 1)"}
          section_name={"Health & Beauty"}
        />
      </div>

      <div className="px-5 mb-4">
        <img
          src={
            isMobile
              ? OurshoppeFridayBanner?.mobileImage
              : OurshoppeFridayBanner?.desktopImage
          }
          alt="Banner"
          className="w-full h-full rounded-xl"
        />
      </div>

      <div className="component_1 mb-4 px-5">
        <ComponentHeader
          title={"Accessories"}
          url={rows?.[4].url}
          view_all={"rgba(82, 50, 194, 1)"}
        />
        <CarouselWithBanner
          products={rows?.[4].items}
          bannerImage={rows?.[13]?.desktopImage}
          bannerImageRedirectUrl={rows?.[13].url}
          type={1}
          inner_bg={"rgba(238, 235, 250, 1)"}
          section_name={"Accessories"}
        />
      </div>

      <div className="component_1 mb-4 px-5">
        <ComponentHeader
          title={"Home Appliances"}
          url={rows?.[5].url}
          view_all={"rgba(82, 50, 194, 1)"}
        />
        <CarouselWithBanner
          products={rows?.[5].items}
          bannerImage={rows?.[14]?.desktopImage}
          bannerImageRedirectUrl={rows?.[14].url}
          type={1}
          inner_bg={"rgba(238, 235, 250, 1)"}
          section_name={"Home Appliances"}
        />
      </div>

      <div className="px-5 mb-4">
        <img
          src={
            isMobile ? BeautyBanner?.mobileImage : BeautyBanner?.desktopImage
          }
          alt="Banner"
          className="w-full h-full rounded-xl"
        />
      </div>

      <div className="component_1 mb-4 px-5">
        <ComponentHeader
          title={"Baby & Mother care"}
          url={rows?.[6].url}
          view_all={"rgba(82, 50, 194, 1)"}
        />
        <CarouselWithBanner
          products={rows?.[6].items}
          bannerImage={rows?.[15]?.desktopImage}
          bannerImageRedirectUrl={rows?.[15].url}
          type={1}
          inner_bg={"rgba(238, 235, 250, 1)"}
          section_name={"Baby & Mother care"}
        />
      </div>

      <div className="px-5 mb-4">
        <div className="flex items-center space-x-2 mb-3 text-[28px] leading-[44px] font-bold">
          <span className="text-[#FF1D1E]">Deals</span>
          <span className="text-[#42484C]">You Can’t Resist</span>
        </div>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2 mb-1">
            {mwebImg2?.slice(0, 2).map((item, index) => (
              <Link key={index} href={item.url} className="no-underline">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.2,
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                >
                  <img
                    src={`${process.env.NEXT_PUBLIC_S3_PREFIX_BLACK_FRIDAY}/resist/${item.path}`}
                  />
                </motion.div>
              </Link>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {mwebImg2?.slice(2, 5).map((item, index) => (
              <Link key={index} href={item.url} className="no-underline">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.2,
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                >
                  <img
                    src={`${process.env.NEXT_PUBLIC_S3_PREFIX_BLACK_FRIDAY}/resist/${item.path}`}
                  />
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 mb-4">
        <img
          src={
            isMobile
              ? AppUpdateBanner?.mobileImage
              : AppUpdateBanner?.desktopImage
          }
          alt="Banner"
          className="w-full h-full rounded-xl"
        />
      </div>

      <div className="component_1 mb-4 px-5">
        <ComponentHeader
          title={"Toys & Games"}
          url={rows?.[7].url}
          view_all={"rgba(82, 50, 194, 1)"}
        />
        <CarouselWithBanner
          products={rows?.[7].items}
          bannerImage={rows?.[17]?.desktopImage}
          bannerImageRedirectUrl={rows?.[16].url}
          type={1}
          inner_bg={"rgba(238, 235, 250, 1)"}
          section_name={"Toys & Games"}
        />
      </div>
    </div>
  );
};

export default MobileViewCard;
