"use client";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/free-mode";

import banner from "@/images/blackfridaybanner.png";
import Link from "next/link";
import BudgetSection from "./BudgetSection";
import DiscountCard from "./CardComponent";
import FlashSale from "./FlashSale";
import LowestPriceSection from "./LowestPriceSection";
import MarqueeSale from "./MarqueeSale";
import NowOrNeverSection from "./NowOrNeverSection";
import { useSelector } from "react-redux";

const DesktopView = ({ categoryItems }) => {
  const currentcountry = useSelector(
    (state) => state?.globalslice?.currentcountry
  );
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
        name: "Acessories.png",
        url: "/products-category/Gaming-PC-Accessories",
      },
      {
        title: "Electronics Gadgets",
        percent: "60",
        name: "Electronicgadgets.png",
        url: "/categories/Electronics",
      },
    ],
  };

  return (
    <div className="container overflow-hidden">
      {/* BANNER */}
      <div className="relative">
        <div className="flex items-center justify-center w-full m-auto overflow-hidden">
          <img src={banner.src} alt="" />
        </div>
        <MarqueeSale />
      </div>
      <div className="w-full bg-black">
        <div className="pt-20">
          <img
            src={`https://cdn.ourshopee.com/ourshopee-img/blackFriday/web/sectionBg.png`}
            alt=""
            className="w-full bg-black"
          />
        </div>
      </div>
      <div className="bg-black px-4">
        <div className="flex justify-center text-white text-[34px] font-bold mb-6 text-center">
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
        <div className="grid grid-cols-5 gap-4">
          {categoryItems?.map((item, index) => (
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
                <DiscountCard
                  imageSrc={`${process.env.NEXT_PUBLIC_S3_PREFIX_BLACK_FRIDAY}/popular_categories/${item.mobileImg}`}
                  discount={item.percent}
                  title={item.sub_category_name}
                  className="w-full h-full"
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
          <FlashSale />
        </div>
      </div>

      <div className="mb-4">
        <NowOrNeverSection />
      </div>

      <div className="mb-4">
        <BudgetSection />
      </div>

      <div className="mb-4">
        <LowestPriceSection />
      </div>

      <div className="px-5 mb-4">
        <img
          src={`${process.env.NEXT_PUBLIC_S3_PREFIX_BLACK_FRIDAY}/${currentcountry.currency}/main_banner.png`}
          alt="Banner"
          className="w-full h-full"
        />
      </div>

      <div className="px-5 mb-4">
        <div className="flex items-center space-x-2 mb-3 text-[28px] leading-[44px] font-bold">
          <span className="text-[#FF1D1E]">Deals</span>
          <span className="text-[#42484C]">You Can’t Resist</span>
        </div>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-3">
            {techGadgets.three.map((item) => (
              <Link key={item.name} href={item.url} className="no-underline">
                <div
                  className="group relative w-full h-[170px] rounded-xl flex pt-1 pl-[20px] overflow-hidden bg-cover bg-center"
                  style={{
                    background: "url(/assets/black-friday/bg-gadgets.png)",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                >
                  <div className="flex flex-col max-w-[60%] justify-center gap-1">
                    <div className="flex flex-col">
                      <span className="text-[32px] font-bold text-white leading-none">
                        Upto {item.percent}% OFF
                      </span>
                    </div>
                    <span className="text-lg font-semibold max-w-[120px] whitespace-nowrap text-white">
                      {item.title}
                    </span>
                  </div>

                  <div className="absolute -bottom-[1.4rem] right-0 group-hover:bottom-1 transition-all duration-1000 w-[16rem] h-[11rem] ease-in-out">
                    <img
                      src={`https://cdn.ourshopee.com/ourshopee-img/summer_sale/TechGadgets/${item.name}`}
                      alt={item.title}
                      className="object-contain w-full h-full"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {techGadgets.two.map((item) => (
              <Link key={item.name} href={item.url} className="no-underline">
                <div
                  className="group relative w-full h-[170px] rounded-xl flex pt-1 pl-[20px] overflow-hidden bg-cover bg-center"
                  style={{
                    background: "url(/assets/black-friday/bg-gadgets.png)",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                >
                  <div className="flex flex-col max-w-[60%] justify-center gap-1">
                    <div className="flex flex-col">
                      <span className="text-[32px] font-bold text-white leading-none">
                        Upto {item.percent}% OFF
                      </span>
                    </div>
                    <span className="text-lg font-semibold max-w-[120px] whitespace-nowrap text-white">
                      {item.title}
                    </span>
                  </div>

                  <div className="absolute -bottom-[2.5rem] right-0 group-hover:bottom-0 transition-all duration-1000 w-[12rem] h-[12rem] ease-in-out">
                    <img
                      src={`https://cdn.ourshopee.com/ourshopee-img/summer_sale/TechGadgets/${item.name}`}
                      alt={item.title}
                      className="object-contain w-full h-full"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopView;
