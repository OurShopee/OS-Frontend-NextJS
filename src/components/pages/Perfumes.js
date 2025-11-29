"use client";

import React, { useEffect, useState } from "react";
import {
  HomeCarousel,
  HomeMobileCarousel,
  CarouselProducts,
  HalfCarouselProducts,
  TopPicks,
} from "@/components/homepage";
import { HomeBannerPlaceholder } from "@/components/Common/Placeholders";
import {
  CarouselProducts as CarouselProductsplaceholder,
  HalfCarouselProducts as HalfCarouselProductsplaceholder,
} from "@/components/placeholders";
import { Container } from "react-bootstrap";
import { MediaQueries } from "@/components/utils";
import { useSelector, useDispatch } from "react-redux";
import { ComponentHeader, ProductCard } from "@/components/Common";
import { Row, Col } from "react-bootstrap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentHeader2 } from "@/components/Common";
import InfiniteScroll from "react-infinite-scroll-component";
import { Category } from "@/actions";
import { setscrolled_products } from "@/redux/categoryslice";
import { FaChevronUp } from "react-icons/fa";

const Perfumes = () => {
  const section_page_loading = useSelector(
    (state) => state.categoryslice.section_page_loading
  );
  const section_pages_Data = useSelector(
    (state) => state.categoryslice.section_pages_Data
  );
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const scrolled_products = useSelector(
    (state) => state.categoryslice.scrolled_products
  );

  const [current_page, setcurrent_page] = useState(1);
  const [has_more, sethas_more] = useState(true);

  const dispatch = useDispatch();
  const pathname = usePathname();
  const { getInfiniteScrollList } = Category();
  const { getSectionPages } = Category();

  const { isMobile } = MediaQueries();

  useEffect(() => {
    setcurrent_page(1);
    sethas_more(true);
    dispatch(setscrolled_products([]));
    var nav_items = currentcountry?.nav_items.find(
      (item) => item.url == pathname
    );
    if (nav_items?.section_id) getSectionPages(nav_items.section_id);
  }, [pathname]);

  useEffect(() => {
    var nav_items = currentcountry?.nav_items.find(
      (item) => item.url == pathname
    );
    if (nav_items?.infinite_required) {
      getInfiniteScrollList(nav_items.section_id, current_page, sethas_more);
    }
  }, [current_page]);

  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      setShowBackToTop(y > 980);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Container fluid className="pt-2 pb-3">
      {!section_page_loading ? (
        <>
          {isMobile ? (
            <HomeMobileCarousel
              carousel_data={section_pages_Data.slider_images}
            />
          ) : (
            <HomeCarousel carousel_data={section_pages_Data.slider_images} />
          )}
          {section_pages_Data.other_section.map((section) => {
            if (section.type == "multiple_images") {
              return (
                <Row className="multi_banners mt-5" key={section.heading}>
                  <ComponentHeader2
                    title={section.heading}
                    color={
                      "linear-gradient(180deg, #D6AF00 37.55%, #FFF6E9 100%)"
                    }
                  />
                  {section.images.map((banner) => {
                    return (
                      <Col
                        className={banner.list_css}
                        xs={12}
                        sm={12}
                        key={banner.banner_id}
                      >
                        <Link className="brand_item" href={banner.url}>
                          <img src={banner.desktopImage}
                            alt={banner.heading || "Banner"}
                          loading="lazy" />
                        </Link>
                      </Col>
                    );
                  })}
                </Row>
              );
            }
            if (section.type == 1) {
              return (
                <Row
                  className="multi_banners mt-3"
                  key={`type-1-${section.items[0]?.banner_id}`}
                >
                  {section.items.map((banner) => {
                    return (
                      <Col key={banner.banner_id} className="pe-0">
                        <Link href={banner.url}>
                          <img src={banner.sub_category_image}
                            alt={banner.heading || "Category"}
                          loading="lazy" />
                        </Link>
                      </Col>
                    );
                  })}
                </Row>
              );
            }
            if (section.type == "brands") {
              return (
                <div className="multi_brands mt-5" key={section.heading}>
                  <ComponentHeader2
                    title={section.heading}
                    color={"linear-gradient(90deg, #FFC634 0%, #6B4AFF 100%)"}
                  />
                  <Row>
                    {section.items.map((banner) => {
                      return (
                        <Col
                          key={banner.banner_id}
                          lg={2}
                          xs={4}
                          className="p-1"
                        >
                          <Link className="brand_item" href={banner.url}>
                            <img src={banner.desktopImage}
                              alt={banner.heading || "Brand"}
                            loading="lazy" />
                          </Link>
                        </Col>
                      );
                    })}
                  </Row>
                </div>
              );
            }

            if (section.type == "single_image") {
              return (
                <Link
                  href={`${section.images.url}`}
                  key={section.images.desktopImage}
                >
                  <img src={section.images.desktopImage}
                    style={{ borderRadius: 20 }}
                    className="w-100 mt-4 mb-2"
                    alt="Banner"
                  loading="lazy" />
                </Link>
              );
            }

            if (section.type == 8) {
              return (
                <Row
                  className="half_carousel_products mt-5"
                  key={section.heading}
                >
                  <Col lg={12}>
                    <HalfCarouselProducts
                      first_title={section.heading.split(" ")[0]}
                      url={section.url}
                      second_title={section.heading.split(" ")[1]}
                      products={section.items}
                      type={1}
                      title={
                        section.heading != "" &&
                        section.hasOwnProperty("heading")
                          ? section.heading
                          : ""
                      }
                      inner_bg={"rgba(255, 250, 229, 1)"}
                      bg_color={"rgba(255, 207, 10, 1)"}
                      first_string_color={"#000"}
                      second_string_color={"rgba(82, 50, 194, 1)"}
                      view_all={"rgba(82, 50, 194, 1)"}
                    />
                  </Col>
                </Row>
              );
            }
            if (section.type == 9) {
              return (
                <div className="combo_deals mt-5" key={section.heading}>
                  <ComponentHeader2 title={section.heading} color={"#191B1C"} />
                  <Row>
                    {section.items.map((item) => {
                      return (
                        <Col key={item.id} lg={2} sm={6} xs={6} className="p-1">
                          <Link href={`/details/${item.url}`}>
                            <ProductCard item={item} />
                          </Link>
                        </Col>
                      );
                    })}
                  </Row>
                </div>
              );
            }

            if (section.type == "category_items") {
              return (
                <Row className="mt-4" key={section.heading}>
                  <div className="component_1">
                    <ComponentHeader
                      url={section.items[0].url}
                      title={section.heading}
                      first_title={section.heading.split(" ")[0]}
                      second_title={section.heading
                        .split(" ")
                        .slice(1)
                        .join(" ")
                        .toString()}
                      first_string_color={"#000"}
                      second_string_color={null}
                      view_all={"rgba(82, 50, 194, 1)"}
                    />
                    <CarouselProducts
                      products={section.items[0].items}
                      type={1}
                      inner_bg={"rgba(238, 235, 250, 1)"}
                    />
                  </div>
                </Row>
              );
            }
            if (section.type == "items") {
              return (
                <Row className="mt-5" key={`items-${section.items[0]?.id}`}>
                  <div className="component_1">
                    <CarouselProducts
                      products={section.items}
                      type={1}
                      inner_bg={"rgba(238, 235, 250, 1)"}
                    />
                  </div>
                </Row>
              );
            }
          })}

          <div className="mt-4" />

          {currentcountry?.nav_items.find((item) => item.url == pathname)
            ?.infinite_required && (
            <InfiniteScroll
              dataLength={scrolled_products.length}
              next={() => {
                setcurrent_page(current_page + 1);
              }}
              hasMore={has_more}
              scrollThreshold={"80%"}
              loader={
                has_more && (
                  <div style={{ textAlign: "center" }}>
                    <img src="https://www.ourshopee.com/static/media/loader.b7845d8936c686dc2914.gif"
                      alt="Loading..."
                    loading="lazy" />
                  </div>
                )
              }
              style={{ overflow: "hidden" }}
            >
              <Row className="mb-4 gx-2 gy-2">
                {scrolled_products.map((product) => {
                  return (
                    <Col
                      xxl={2}
                      xl={3}
                      lg={3}
                      md={3}
                      sm={6}
                      xs={6}
                      key={product.url}
                    >
                      <Link
                        href={`/details/${product.url}`}
                        className={"text-decoration-none"}
                      >
                        <ProductCard item={product} />
                      </Link>
                    </Col>
                  );
                })}
              </Row>
            </InfiniteScroll>
          )}
        </>
      ) : (
        <>
          <HomeBannerPlaceholder height={300} />
          <div className="mt-4">
            {[1, 2, 3, 4, 5].map((item) => {
              return (
                <div key={item}>
                  <CarouselProductsplaceholder
                    category_list={[1, 2, 3, 4, 5, 6, 7, 8]}
                    type={1}
                  />
                  <div className="mt-3"></div>
                </div>
              );
            })}
          </div>
        </>
      )}
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
    </Container>
  );
};

export default Perfumes;
