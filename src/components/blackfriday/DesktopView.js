import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/free-mode";
import Section from "./Section";

import Link from "next/link";
import Marquee from "react-fast-marquee";
import { useSelector } from "react-redux";
import { CarouselProducts } from "../homepage";
import BeatTheHeat from "./BeatTheHeat";
import DiscountCard from "./CardComponent";
import SectionNew from "./SectionNew";
import TopBrands from "./TopBrands";
import bluebg from "./images/bluebg.png";
import banner from "@/images/blackfridaybanner.png";
import page from "./images/page.png";
import peachbg from "./images/peachbg.png";
import purplebg from "./images/purplebg.png";
import MarqueeSale from "./MarqueeSale";
import FlashSale from "./FlashSale";
import NowOrNeverSection from "./NowOrNeverSection";
import LowestPriceSection from "./LowestPriceSection";
import BudgetSection from "./BudgetSection";

const DesktopView = ({
  sectionData,
  categories,
  categoryItems,
  rows,
  productsAtOne,
  topBrands,
  clearanceItems,
}) => {
  const tabbyBanner = sectionData?.find((d) => d.type === "single_image");
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  console.log(categoryItems);
  // State to store bottom sections with headings, items, and colors
  const [bottomSections, setBottomSections] = useState([]);

  // Define section colors for rotation
  const sectionColors = ["443527", "3E2745", "2C466B", "", "2C466B"];

  // Initialize bottom sections when sectionData changes
  useEffect(() => {
    if (sectionData && sectionData.length > 0) {
      const sectionsConfig = [
        {
          title: "Best Sellers",
          heading: null, // Special case - uses clearanceItems
          color: "",
          isSpecial: true,
          data: clearanceItems,
          url: "/clearance",
        },
        {
          title: "School Bags",
          heading: "School Bags",
          color: "443527",
        },
        {
          title: "School Stationery",
          heading: "School Stationery",
          color: "3E2745",
        },
        {
          title: "School Footwear",
          heading: "School Footwear",
          color: "2C466B",
        },
        {
          title: "School Lunchboxes",
          heading: "School Lunch Box",
          color: "",
        },
        {
          title: "School Water Bottles",
          heading: "School Water Bottles",
          color: "2C466B",
        },
        {
          title: "Perfumes",
          heading: "Perfumes",
          color: "2C466B",
        },
        {
          title: "Gaming Essentials",
          heading: "Gaming Essentials",
          color: "2C466B",
        },
      ];

      const processedSections = sectionsConfig.map((section) => {
        if (section.isSpecial) {
          return {
            ...section,
            products: section.data,
            url: section.url,
          };
        }

        const sectionDataItem = sectionData.find(
          (d) => d.heading === section.heading
        );
        return {
          ...section,
          products: sectionDataItem?.items?.[0]?.items || [],
          url: sectionDataItem?.items?.[0]?.url || "",
        };
      });

      setBottomSections(processedSections);
    }
  }, [sectionData, clearanceItems]);

  const pagesSection = [
    {
      image: page,
      amount: "49",
      url: "/btss",
    },
    {
      image: page,
      amount: "99",
      url: "/bts",
    },
    {
      image: page,
      amount: "199",
      url: "/bts",
    },
    {
      image: page,
      amount: "299",
      url: "/bts",
    },
    {
      image: page,
      amount: "499",
      url: "/bts",
    },
  ];

  const homeLiving = {
    three: [
      {
        title: "Eyewares",
        name: "eyeware.png",
        url: "/products-category/Sunglasses",
        percent: "70",
      },
      {
        title: "Scooters",
        name: "scooter.png",
        url: "/products-category/Ride-Ons-Tricycles-Scooters",
        percent: "50",
      },
      {
        title: "Perfumes",
        name: "perfume.png",
        url: "/products-category/Perfumes",
        percent: "70",
      },
    ],
    two: [
      {
        title: "Gaming Essentials",
        name: "gaming.png",
        url: "/categories/Gaming-Accessories",
        percent: "50",
      },
      {
        title: "Toys",
        name: "toys.png",
        url: "/categories/baby-products-toys",
        percent: "70",
      },
    ],
  };

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

  const lifestyle = [
    {
      percent: "20",
      title: "Home Appliances",
      name: "homeappliances.png",
      url: "/categories/Home-Kitchen-Appliances",
    },
    {
      percent: "35",
      title: "TVs and Projectors",
      name: "tvandprojector.png",
      url: "/products-category/Television-Accessories",
    },
    {
      percent: "30",
      title: "Kitchen Appliances",
      name: "kitchenappliances.png",
      url: "/categories/Home-Essentials-Kitchen-and-Dining",
    },
    {
      percent: "50",
      title: "Beauty",
      name: "Beauty.png",
      url: "/categories/Health-Beauty",
    },
  ];

  return (
    <div className="container overflow-hidden">
      {/* BANNER */}
      <div className="relative">
        <div className="flex items-center justify-center w-full m-auto overflow-hidden">
          <img src={banner.src} alt="" />
        </div>
        <MarqueeSale />
      </div>
      <div className="w-full bg-black mt-4">
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
        className="relative"
        style={{
          background: "linear-gradient(180deg, #070707 91.75%, #FAFAFA 100%)",
        }}
      >
        <div className="pb-12">
          <FlashSale />
        </div>
        {/* <div className="absolute top-[95%] w-100 h-[80px] -z-10 sale-overlay"></div> */}
      </div>

      <NowOrNeverSection />

      <BudgetSection />

      {/* Lowest Price Section */}
      <LowestPriceSection />

      {/* pages section */}

      <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-2">
        {/* HOME & LIVING */}
        <SectionNew title="HOME & LIVING" titleClass="mb-4" color="3E2745">
          <div className="flex flex-col gap-[14px]">
            <div className="grid grid-cols-3 gap-[14px] w-full">
              {homeLiving.three.map((item, i) => (
                <Link key={item.name} href={item.url} className="no-underline">
                  <div
                    className="group relative w-full h-[150px] rounded-xl flex pt-1 pl-[20px] overflow-hidden bg-cover bg-center"
                    style={{ backgroundImage: `url(${purplebg})` }}
                  >
                    <div className="flex flex-col max-w-[60%] justify-center gap-1">
                      <div className="flex flex-col">
                        <span className="text-[26px] font-extrabold text-[#3E2745] leading-none">
                          upto
                        </span>
                        <span className="text-[26px] font-extrabold whitespace-nowrap text-[#3E2745]">
                          {item.percent}% OFF
                        </span>
                      </div>
                      <span className="text-lg font-semibold max-w-[120px] text-[#3E2745]">
                        {item.title}
                      </span>
                    </div>

                    <div
                      className={`absolute ${
                        i === 0 ? "-bottom-[2.5rem]" : "-bottom-[1.4rem]"
                      } -right-[1.5rem] group-hover:bottom-1 transition-all duration-1000 w-[9rem] h-40 ease-in-out`}
                    >
                      <img
                        src={`https://cdn.ourshopee.com/ourshopee-img/summer_sale/HomeLiving/${item.name}`}
                        alt={item.title}
                        className="object-contain w-full h-full"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-[14px] w-full">
              {homeLiving.two.map((item) => (
                <Link key={item.name} href={item.url} className="no-underline">
                  <div
                    className="group relative w-full h-[150px] rounded-xl flex pt-1 pl-[20px] overflow-hidden bg-cover bg-center"
                    style={{ backgroundImage: `url(${purplebg})` }}
                  >
                    <div className="flex flex-col max-w-[60%] justify-center gap-1">
                      <div className="flex flex-col gap-2">
                        <span className="text-[28px] font-extrabold text-[#3E2745] leading-none">
                          upto
                        </span>
                        <span className="text-[28px] font-extrabold whitespace-nowrap text-[#3E2745] leading-none">
                          {item.percent}% OFF
                        </span>
                      </div>
                      <span className="text-lg font-semibold max-w-[120px] whitespace-nowrap text-[#3E2745]">
                        {item.title}
                      </span>
                    </div>

                    <div className="absolute -bottom-[1.5rem] right-[1.3rem] group-hover:bottom-1 transition-all duration-1000 w-40 h-[9rem] ease-in-out">
                      <img
                        src={`https://cdn.ourshopee.com/ourshopee-img/summer_sale/HomeLiving/${item.name}`}
                        alt={item.title}
                        className="object-contain w-full h-full"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </SectionNew>

        {/* LIFESTYLE & FUN */}
        <SectionNew title="LIFESTYLE & FUN" titleClass="mb-4" color="443527">
          <div className="grid grid-cols-2 grid-rows-2 gap-[14px] w-full">
            {lifestyle.map((item) => (
              <Link key={item.name} href={item.url} className="no-underline">
                <div
                  className="group relative w-full h-[150px] rounded-xl flex pt-1 pl-[20px] overflow-hidden bg-cover bg-center"
                  style={{ backgroundImage: `url(${peachbg})` }}
                >
                  <div className="flex flex-col max-w-[60%] justify-center">
                    <div className="flex flex-col">
                      <span className="text-[28px] font-extrabold text-[#493F2D] leading-none">
                        upto
                      </span>
                      <span className="text-[28px] font-extrabold whitespace-nowrap text-[#493F2D]">
                        {item.percent}% OFF
                      </span>
                    </div>
                    <span className="text-lg font-semibold whitespace-nowrap max-w-[120px] text-[#493F2D]">
                      {item.title}
                    </span>
                  </div>

                  <div className="absolute -bottom-[1.5rem] right-[1.3rem] group-hover:bottom-1 transition-all duration-1000 w-40 h-[9rem] ease-in-out">
                    <img
                      src={`https://cdn.ourshopee.com/ourshopee-img/summer_sale/lifestyle/${item.name}`}
                      alt={item.title}
                      className="object-contain w-full h-full"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </SectionNew>
      </div>

      {currentcountry?.isTabbyRequired && (
        <Section>
          <img
            loading="lazy"
            src={tabbyBanner?.images?.desktopImage}
            alt="tabby"
            className="w-full rounded-xl mb-3"
            data-aos="zoom-in"
            data-aos-easing="ease-in-out"
            data-aos-delay="200"
            data-aos-offset="100"
          />
        </Section>
      )}

      {/* Top Brands */}
      <TopBrands topBrands={topBrands} />

      <SectionNew title="TECH & GADGETS" color="2C466B" titleClass="mb-4">
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-3">
            {techGadgets.three.map((item) => (
              <Link key={item.name} href={item.url} className="no-underline">
                <div
                  className="group relative w-full h-[170px] rounded-xl flex pt-1 pl-[20px] overflow-hidden bg-cover bg-center"
                  style={{ backgroundImage: `url(${bluebg})` }}
                >
                  <div className="flex flex-col max-w-[60%] justify-center gap-1">
                    <div className="flex flex-col">
                      <span className="text-[32px] font-extrabold text-[#2C466B] leading-none">
                        upto
                      </span>
                      <span className="text-[32px] font-extrabold whitespace-nowrap text-[#2C466B]">
                        {item.percent}% OFF
                      </span>
                    </div>
                    <span className="text-lg font-semibold whitespace-nowrap max-w-[120px] text-[#2C466B]">
                      {item.title}
                    </span>
                  </div>

                  <div className="absolute -bottom-[1.4rem] right-[2.5rem] group-hover:bottom-1 transition-all duration-1000 w-[16rem] h-[11rem] ease-in-out">
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
                  style={{ backgroundImage: `url(${bluebg})` }}
                >
                  <div className="flex flex-col max-w-[60%] justify-center gap-1">
                    <div className="flex flex-col">
                      <span className="text-[32px] font-extrabold text-[#2C466B] leading-none">
                        upto
                      </span>
                      <span className="text-[32px] font-extrabold whitespace-nowrap text-[#2C466B]">
                        {item.percent}% OFF
                      </span>
                    </div>
                    <span className="text-lg font-semibold max-w-[120px] whitespace-nowrap text-[#2C466B]">
                      {item.title}
                    </span>
                  </div>

                  <div className="absolute -bottom-[2.5rem] right-[4.5rem] group-hover:bottom-0 transition-all duration-1000 w-[12rem] h-[12rem] ease-in-out">
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
      </SectionNew>

      {/* Bottom Sections - Now using state */}
      {bottomSections.map((section, index) => {
        if (section.products.length > 0) {
          return (
            <SectionNew
              key={section.title}
              title={section.title}
              sectionClass="py-3"
              color="403586"
            >
              <div className="gap-4 bg-[#EEEBFA] p-4 rounded-xl mt-4">
                <CarouselProducts
                  slides={6}
                  products={section.products}
                  url={section.url}
                  sectionName={section.title}
                />
              </div>
            </SectionNew>
          );
        }
      })}
    </div>
  );
};

export default DesktopView;
