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
  OurshoppeFridayBanner,
  FlashSaleBanner,
  BeautyBanner,
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
      url: "/products-category/Pre-Owned-Tablets/",
    },
    {
      path: "img-2.png",
      url: "/products-category/Pre-Owned-Laptops/",
    },
    {
      path: "img-3.png",
      url: "/products-category/Pre-Owned-Mobiles/",
    },
    {
      path: "img-4.png",
      url: "/products-category/Gaming-PC-Accessories/",
    },
    {
      path: "img-5.png",
      url: "/products-category/electronics/",
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
        <div className="flex items-center justify-center w-full m-auto overflow-hidden">
          <img
            src={`${process.env.NEXT_PUBLIC_S3_PREFIX_BLACK_FRIDAY}/blackfridaybanner.png`}
            alt=""
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
        <BudgetSection />
      </div>

      <div className="component_1 mb-4 px-5">
        <ComponentHeader
          title={"Pre Owned Mobiles"}
          url={FlashSaleBanner.url}
          view_all={"rgba(82, 50, 194, 1)"}
        />
        <CarouselWithBanner
          products={rows?.[8]}
          bannerImage={FlashSaleBanner?.desktopImage}
          bannerImageRedirectUrl={FlashSaleBanner.url}
          type={1}
          inner_bg={"rgba(238, 235, 250, 1)"}
          section_name={"Pre Owned Mobiles"}
        />
      </div>
      <div className="component_1 mb-4 px-5">
        <ComponentHeader
          title={"Pre Owned Laptops"}
          url={FlashSaleBanner.url}
          view_all={"rgba(82, 50, 194, 1)"}
        />
        <CarouselWithBanner
          products={rows?.[0]}
          bannerImage={FlashSaleBanner?.desktopImage}
          bannerImageRedirectUrl={FlashSaleBanner.url}
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
          url={FlashSaleBanner.url}
          view_all={"rgba(82, 50, 194, 1)"}
        />
        <CarouselWithBanner
          products={rows?.[1]}
          bannerImage={FlashSaleBanner?.desktopImage}
          bannerImageRedirectUrl={FlashSaleBanner.url}
          type={1}
          inner_bg={"rgba(238, 235, 250, 1)"}
          section_name={"Watches"}
        />
      </div>

      <div className="component_1 mb-4 px-5">
        <ComponentHeader
          title={"Perfumes"}
          url={FlashSaleBanner.url}
          view_all={"rgba(82, 50, 194, 1)"}
        />
        <CarouselWithBanner
          products={rows?.[2]}
          bannerImage={FlashSaleBanner?.desktopImage}
          bannerImageRedirectUrl={FlashSaleBanner.url}
          type={1}
          inner_bg={"rgba(238, 235, 250, 1)"}
          section_name={"Perfumes"}
        />
      </div>

      <div className="component_1 mb-4 px-5">
        <ComponentHeader
          title={"Health & Beauty"}
          url={FlashSaleBanner.url}
          view_all={"rgba(82, 50, 194, 1)"}
        />
        <CarouselWithBanner
          products={rows?.[3]}
          bannerImage={FlashSaleBanner?.desktopImage}
          bannerImageRedirectUrl={FlashSaleBanner.url}
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
          className="w-full h-full"
        />
      </div>

      <div className="component_1 mb-4 px-5">
        <ComponentHeader
          title={"Accessories"}
          url={FlashSaleBanner.url}
          view_all={"rgba(82, 50, 194, 1)"}
        />
        <CarouselWithBanner
          products={rows?.[4]}
          bannerImage={FlashSaleBanner?.desktopImage}
          bannerImageRedirectUrl={FlashSaleBanner.url}
          type={1}
          inner_bg={"rgba(238, 235, 250, 1)"}
          section_name={"Accessories"}
        />
      </div>

      <div className="component_1 mb-4 px-5">
        <ComponentHeader
          title={"Home Appliances"}
          url={FlashSaleBanner.url}
          view_all={"rgba(82, 50, 194, 1)"}
        />
        <CarouselWithBanner
          products={rows?.[5]}
          bannerImage={FlashSaleBanner?.desktopImage}
          bannerImageRedirectUrl={FlashSaleBanner.url}
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
          className="w-full h-full"
        />
      </div>

      <div className="component_1 mb-4 px-5">
        <ComponentHeader
          title={"Mother & Baby"}
          url={FlashSaleBanner.url}
          view_all={"rgba(82, 50, 194, 1)"}
        />
        <CarouselWithBanner
          products={rows?.[6]}
          bannerImage={FlashSaleBanner?.desktopImage}
          bannerImageRedirectUrl={FlashSaleBanner.url}
          type={1}
          inner_bg={"rgba(238, 235, 250, 1)"}
          section_name={"Mother & Baby"}
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

      <div className="component_1 mb-4 px-5">
        <ComponentHeader
          title={"Toys & Games"}
          url={FlashSaleBanner.url}
          view_all={"rgba(82, 50, 194, 1)"}
        />
        <CarouselWithBanner
          products={rows?.[7]}
          bannerImage={FlashSaleBanner?.desktopImage}
          bannerImageRedirectUrl={FlashSaleBanner.url}
          type={1}
          inner_bg={"rgba(238, 235, 250, 1)"}
          section_name={"Toys & Games"}
        />
      </div>
    </div>
  );
};

export default MobileViewCard;
