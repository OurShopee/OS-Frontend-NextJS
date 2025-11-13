import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { CarouselProducts } from "../homepage";
import page from "./images/mwebPage.png";
import Section from "./Section";
import SectionMweb from "./SectionMweb";
import ShopByPopularCategoryMobile from "./ShopByPopularCategoryMobile";
import TopBrandsMweb from "./TopBrandsMweb";

const MobileView = ({
  sectionData,
  categories,
  categoryItems,
  topBrands,
  clearanceItems,
  rows,
  productsAtOne,
}) => {
  const midClearanceItems = Math.ceil(clearanceItems.length / 2);
  const firstHalf = clearanceItems.slice(0, midClearanceItems);
  const secondHalf = clearanceItems.slice(midClearanceItems);
  console.log(categoryItems);
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const [productAtRight, setProductAtRight] = useState([]);
  const navigate = useNavigate();

  // State to store bottom sections with headings, items, and colors
  const [bottomSections, setBottomSections] = useState([]);

  const tabbyBanner = sectionData?.find((d) => d.type === "single_image");

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
    two: [
      {
        title: "Gaming Essentials",
        name: "eyewares.png",
        url: "/products-category/Sunglasses",
        percent: "70",
      },
      {
        title: "Toyes",
        name: "scooters.png",
        url: "/products-category/Ride-Ons-Tricycles-Scooters",
        percent: "70",
      },
    ],
    three: [
      {
        title: "Eyewares",
        name: "perfumes.png",
        url: "/products-category/Perfumes",
        percent: "70",
      },
      {
        title: "Scooters",
        name: "gaming.png",
        url: "/categories/Gaming-Accessories",
        percent: "70",
      },
      {
        title: "Perfumes",
        name: "toys.png",
        url: "/categories/baby-products-toys",
        percent: "70",
      },
    ],
  };

  const lifestyle = {
    one: [
      {
        title: "Home",
        name: "home.png",
        url: "/categories/Home-Essentials-Kitchen-and-Dining",
        percent: "70",
      },
      {
        title: "TVs and Projectors",
        name: "tvProjector.png",
        url: "/products-category/Television-Accessories",
        percent: "70",
      },
    ],
    two: [
      {
        title: "Kitchen Appliances",
        name: "kitchenAppliances.png",
        url: "/categories/Home-Kitchen-Appliances",
        percent: "70",
      },
      {
        title: "beauty",
        name: "beauty.png",
        url: "/categories/Health-Beauty",
        percent: "70",
      },
    ],
  };

  const techGadgets = {
    one: [
      {
        title: "Home",
        name: "preownedTablets.png",
        url: "/products-category/Pre-Owned-Tablets",
        percent: "70",
      },
      {
        title: "TVs and Projectors",
        name: "preOwnedLaptops.png",
        url: "/products-category/Pre-Owned-Laptops",
        percent: "70",
      },
    ],
    three: [
      {
        title: "Home",
        name: "accessories.png",
        url: "/products-category/Gaming-PC-Accessories",
        percent: "70",
      },
    ],
    two: [
      {
        title: "Kitchen Appliances",
        name: "mobiles.png",
        url: "/products-category/Pre-Owned-Mobiles",
        percent: "70",
      },
      {
        title: "Toyes",
        name: "electronics.png",
        url: "/products-category/Headphones-Earphones",
        percent: "70",
      },
    ],
  };

  useEffect(() => {
    const evenProducts =
      productsAtOne.length % 2 !== 0
        ? productsAtOne.slice(0, -1)
        : productsAtOne;

    setProductAtRight(evenProducts);
  }, [productsAtOne]);

  // Divide into two equal parts without mutating state
  const leftItemCount = Math.floor(productAtRight.length / 2);
  const productleftItem = productAtRight.slice(0, leftItemCount);
  const productrightItem = productAtRight.slice(leftItemCount);

  return (
    <div>
      {/* Banner section */}
      <div className="h-full w-full flex items-center justify-center relative overflow-hidden rounded-b-2xl">
        <img
          src="https://cdn.ourshopee.com/ourshopee-img/summer_sale/mwebBanners.png"
          alt=""
          className="h-full w-full"
        />
      </div>

      {/* Popular Categories */}
      <SectionMweb title="SCHOOL ESSENTIALS" titleClass="mb-4" isMobile>
        {/* First row: 2 columns */}
        <div className="grid grid-cols-2 gap-2 mb-2 font-outfit">
          {categoryItems?.slice(0, 2).map((item, i) => (
            <NavLink
              key={item?.id || i}
              to={item?.url}
              className="no-underline block w-full h-full"
            >
              <img
                src={`https://cdn.ourshopee.com/ourshopee-img/summer_sale/mwebCategories/${item.mobileImg}`}
                alt=""
                className="w-full h-full object-cover rounded-lg"
              />
            </NavLink>
          ))}
        </div>

        {/* Second row: 3 columns */}
        <div className="grid grid-cols-3 gap-2 font-outfit">
          {categoryItems?.slice(2, 5).map((item, i) => (
            <NavLink
              key={item?.id || i}
              to={item?.url}
              className="no-underline block w-full h-full"
            >
              <img
                src={`https://cdn.ourshopee.com/ourshopee-img/summer_sale/mwebCategories/${item.mobileImg}`}
                alt=""
                className="w-full h-full object-cover rounded-lg"
              />
            </NavLink>
          ))}
        </div>
      </SectionMweb>

      <ShopByPopularCategoryMobile rows={rows} />

      {/* Tabby banner */}
      {currentcountry?.isTabbyRequired && (
        <Section>
          <img
            data-aos="zoom-in"
            data-aos-duration="800"
            data-aos-easing="ease-in-out"
            loading="lazy"
            src={tabbyBanner?.images?.mobileImage}
            alt="tabby"
            className="w-full rounded-xl"
          />
        </Section>
      )}

      {/* Unbeatable Deals section */}
      {/* <section className="my-4 relative overflow-hidden">
        <img
          src="https://cdn.ourshopee.com/ourshopee-img/summer_sale/mWebPageCard.png"
          alt="Save Big on School Supplies"
          className="block w-full h-[500px]"
        />

        <div className="absolute inset-0 mt-[7.5rem] flex flex-col items-center justify-center gap-4 px-4">
  
          <div className="flex items-center justify-center gap-4 w-full">
            {pagesSection.slice(0, 3).map((item, idx) => (
              <NavLink
                data-aos="fade-down"
                data-aos-delay={idx * 200}
                data-aos-duration="800"
                data-aos-easing="ease-out-cubic"
                key={idx}
                to={item.url}
                className="relative w-[100px] flex-shrink-0"
              >
                <img
                  src={item.image}
                  alt={`Under ${item.amount}`}
                  className="block w-full h-auto object-contain"
                />

                <div className="text-[#266B4A] mt-1 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                  <div
                    className="flex flex-col text-center gap-0"
                    style={{ fontFamily: "'Fredoka', cursive" }}
                  >
                    <span className="text-xl uppercase leading-none font-semibold">
                      UNDER
                    </span>
                    <span className="text-5xl font-extrabold leading-none">
                      {item.amount}
                    </span>
                  </div>
                  <span className="text-xl uppercase font-[fredoka] leading-none font-extrabold">
                    {currentcountry.currency}
                  </span>
                </div>
              </NavLink>
            ))}
          </div>

          {pagesSection.length > 3 && (
            <div className="flex items-center justify-center gap-4 w-full">
              {pagesSection.slice(3, 5).map((item, idx) => (
                <NavLink
                  data-aos="fade-up"
                  data-aos-delay={idx * 200}
                  data-aos-duration="800"
                  data-aos-easing="ease-out-cubic"
                  key={idx + 3}
                  to={item.url}
                  className="relative w-[100px] flex-shrink-0"
                >
                  <img
                    src={item.image}
                    alt={`Under ${item.amount}`}
                    className="block w-full h-auto object-contain"
                  />

                  <div className="text-[#266B4A] mt-1 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                    <div
                      className="flex flex-col text-center gap-0"
                      style={{ fontFamily: "'Fredoka', cursive" }}
                    >
                      <span className="text-xl uppercase leading-none font-semibold">
                        UNDER
                      </span>
                      <span className="text-5xl font-extrabold leading-none">
                        {item.amount}
                      </span>
                    </div>
                    <span className="text-xl font-[Fredoka] uppercase leading-none font-extrabold">
                      {currentcountry.currency}
                    </span>
                  </div>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </section> */}

      <SectionMweb title="HOME & LIVING" titleClass="mb-4" color="3E2745">
        <div className="grid grid-cols-2 gap-2 mb-2 font-outfit">
          {homeLiving.two.map((item, idx) => {
            return (
              <NavLink
                key={idx}
                to={item.url}
                className="no-underline block w-full h-full"
              >
                <img
                  src={`https://cdn.ourshopee.com/ourshopee-img/summer_sale/homeLivingMweb/${item.name}`}
                  alt=""
                  className="w-full h-full object-cover rounded-lg"
                />
              </NavLink>
            );
          })}
        </div>
        <div className="grid grid-cols-3 gap-2 mb-2 font-outfit">
          {homeLiving.three.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.url}
              className="no-underline block w-full h-full"
            >
              <img
                src={`https://cdn.ourshopee.com/ourshopee-img/summer_sale/homeLivingMweb/${item.name}`}
                alt=""
                className="w-full h-full object-cover rounded-lg"
              />
            </NavLink>
          ))}
        </div>
      </SectionMweb>

      <SectionMweb title="LIFESTYLE & FUN" titleClass="mb-4" color="443527">
        <div className="w-full pr-2">
          <div className="grid grid-cols-[50%_50%] gap-2 mb-2 font-outfit w-full">
            {lifestyle.one.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.url}
                className="no-underline block w-full h-full"
              >
                <img
                  src={`https://cdn.ourshopee.com/ourshopee-img/summer_sale/lifestyleMweb/${item.name}`}
                  alt=""
                  className="w-full h-full object-cover rounded-lg"
                />
              </NavLink>
            ))}
          </div>
          <div className="grid grid-cols-[56%_44%] gap-2 mb-2 font-outfit w-full">
            {lifestyle.two.map((item, idx) => (
              <NavLink key={idx} to={item.url} className={`w-full h-full`}>
                <img
                  src={`https://cdn.ourshopee.com/ourshopee-img/summer_sale/lifestyleMweb/${item.name}`}
                  alt=""
                  className="w-full h-full rounded-lg"
                />
              </NavLink>
            ))}
          </div>
        </div>
      </SectionMweb>

      <section className="">
        <TopBrandsMweb topBrands={topBrands} />
      </section>

      <SectionMweb title="TECH & GADGETS" titleClass="mb-4" color="2C466B">
        <div className="grid grid-cols-2 gap-2 mb-2 font-outfit">
          {techGadgets.one.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.url}
              className="no-underline block w-full h-full"
            >
              <img
                src={`https://cdn.ourshopee.com/ourshopee-img/summer_sale/TechGadgetsMweb/${item.name}`}
                alt=""
                className="w-full h-full object-cover rounded-lg"
              />
            </NavLink>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-2 mb-2 font-outfit">
          {techGadgets.three.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.url}
              className="no-underline block w-full h-full"
            >
              <img
                src={`https://cdn.ourshopee.com/ourshopee-img/summer_sale/TechGadgetsMweb/${item.name}`}
                alt=""
                className="w-full h-full object-cover rounded-lg"
              />
            </NavLink>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2 font-outfit">
          {techGadgets.two.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.url}
              className="no-underline block w-full h-full"
            >
              <img
                src={`https://cdn.ourshopee.com/ourshopee-img/summer_sale/TechGadgetsMweb/${item.name}`}
                alt=""
                className="w-full h-full object-cover rounded-lg"
              />
            </NavLink>
          ))}
        </div>
      </SectionMweb>

      {/* Bottom Sections - Now using state */}
      {bottomSections.map((section, index) => {
        if (section.products.length > 0) {
          return (
            <SectionMweb
              key={section.title}
              title={section.title}
              sectionClass="py-3"
              color="403586"
            >
              <div className="gap-4 bg-[#EEEBFA] p-4 rounded-xl mt-4">
                <CarouselProducts
                  slides={5}
                  products={section.products}
                  breakPointsProps={{
                    200: { slidesPerView: 1.3 },
                    375: { slidesPerView: 2.2 },
                    425: { slidesPerView: 2.2 },
                    500: { slidesPerView: 2.7 },
                    600: { slidesPerView: 3 },
                    800: { slidesPerView: 3.3 },
                    1000: { slidesPerView: 3.5 },
                    1200: { slidesPerView: 4 },
                    1400: { slidesPerView: 4 },
                    1600: { slidesPerView: 5 },
                  }}
                  url={section.url}
                  sectionName={section.title}
                />
              </div>
            </SectionMweb>
          );
        }
      })}
    </div>
  );
};

export default MobileView;
