"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Category as CategoryAction } from "@/actions";
import { useSelector, useDispatch } from "react-redux";
import { FaChevronUp } from "react-icons/fa";
import BreadComps from "@/components/Common/Breadcomps";
import ComponentHeader from "@/components/Common/ComponentHeader";
import HomeCarousel from "@/components/homepage/HomeCarousel";
import HomeMobileCarousel from "@/components/homepage/HomeMobileCarousel";
import HomeCategories from "@/components/homepage/HomeCategories";
import CarouselProducts from "@/components/homepage/CarouselProducts";
import HalfCarouselProducts from "@/components/homepage/HalfCarouselProducts";
import LoadMoreButton from "@/components/Common/LoadMoreButton";
import { getCatScreenList, setscrolled_products } from "@/redux/categoryslice";
import { pushToDataLayer } from "@/components/utils/dataUserpush";
import { MediaQueries } from "@/components/utils";
import { ProductCard } from "@/components/Common";

export default function CategoryClient({ initialCategoryData, categorySlug }) {
  const dispatch = useDispatch();
  const { slug } = useParams();

  const categoryScreen = initialCategoryData;
  const loading = useSelector((state) => state.categoryslice.loading);
  const categoryList = useSelector((state) => state.globalslice.data);
  const categoryloading = useSelector((state) => state.globalslice.loading);
  const scrolled_products = useSelector(
    (state) => state.categoryslice.scrolled_products
  );
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );

  const [breadcompdata, setBreadcompdata] = useState({});
  const [current_page, setcurrent_page] = useState(1);
  const [has_more, sethas_more] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const { isMobile } = MediaQueries();
  const { getAllItems } = CategoryAction();

  useEffect(() => {
    const matchedData = categoryList.find((ele) => ele.url === slug);
    setBreadcompdata(matchedData || {});
  }, [slug, categoryList]);

  useEffect(() => {
    pushToDataLayer("viewed_category_page", currentcountry.name, {
      category_name: breadcompdata?.category_name,
    });
  }, [breadcompdata, currentcountry]);

  useEffect(() => {
    setcurrent_page(1);
    sethas_more(true);
    dispatch(setscrolled_products([]));
    dispatch(getCatScreenList(slug));
  }, [slug, dispatch]);

  useEffect(() => {
    getAllItems(slug, current_page, sethas_more);
  }, [current_page]);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 980) setShowBackToTop(true);
      else setShowBackToTop(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="w-full pt-2 pb-3 homepagecontainer px-4">
        {!isMobile && !categoryloading && (
          <BreadComps activetitle={breadcompdata?.category_name} />
        )}

        <div className="mt-3" />

        {!loading ? (
          isMobile ? (
            <HomeMobileCarousel
              carousel_data={categoryScreen?.category_image}
            />
          ) : (
            <HomeCarousel carousel_data={categoryScreen?.category_image} />
          )
        ) : (
          // Add your loading placeholder here
          <div className="h-[300px] bg-gray-200 animate-pulse" />
        )}
        <div className="mt-4" />
        {!categoryloading && (
          <div className="component_1 cat_carousel">
            <ComponentHeader
              title={"Shop by Sub-Categories"}
              view_all={"rgba(82, 50, 194, 1)"}
            />
            <HomeCategories
              category_list={
                categoryList?.find(({ url }) => url == slug)?.subcategory
              }
              type={2}
            />
          </div>
        )}
        <div className="mt-4" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
          <div className="col-span-12">
            {loading ? (
              // placeholder component
              <div className="space-y-4">{/* placeholder items */}</div>
            ) : (
              <HalfCarouselProducts
                first_title={"Hot"}
                second_title={"Deals"}
                products={categoryScreen?.hot_deals}
                type={1}
                title={"Hot Deals"}
                inner_bg={"rgba(255, 250, 229, 1)"}
                bg_color={"rgba(255, 207, 10, 1)"}
                first_string_color={"#000"}
                second_string_color={"rgba(82, 50, 194, 1)"}
                view_all={"rgba(82, 50, 194, 1)"}
              />
            )}
          </div>
        </div>

        {currentcountry.isTabbyRequired && (
          <div className="single_banner">
            <img src="/assets/banners/banner_4.png" alt="Banner" />
          </div>
        )}

        {!loading &&
          categoryScreen?.categories?.map((cat) => (
            <div key={cat.subcategory_name} className="component_1 mt-4">
              <ComponentHeader
                title={cat.subcategory_name}
                url={`/products-category/${cat.url}`}
                first_title={cat.subcategory_name.split(" ")[0]}
                second_title={cat.subcategory_name.split(" ")[1]}
                first_string_color={"#000"}
                second_string_color={null}
                view_all={"rgba(82, 50, 194, 1)"}
              />
              {loading ? (
                <div className="space-y-4">
                  {/* Placeholder carousel products */}
                </div>
              ) : (
                <CarouselProducts
                  products={cat.items}
                  type={1}
                  inner_bg={"rgba(238, 235, 250, 1)"}
                />
              )}
            </div>
          ))}

        <div className="mt-4" />

        <div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-4">
            {scrolled_products.map((product) => (
              <Link
                key={product.url}
                href={`/details/${product.url}`}
                className="no-underline"
              >
                <div>
                  {/* Replace Col and NavLink with Link + div and Tailwind */}
                  <div className="text-decoration-none">
                    {/* Replace ProductCard with your own or imported */}
                    <ProductCard item={product} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {has_more && (
            <LoadMoreButton onClick={() => setcurrent_page(current_page + 1)} />
          )}
        </div>
      </div>

      {showBackToTop && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            className="bg-[#43494B] border-none text-white rounded-full p-2 flex items-center justify-center"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <FaChevronUp size={20} />
          </button>
        </div>
      )}
    </>
  );
}
