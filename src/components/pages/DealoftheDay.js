"use client";

import React, { useEffect, useState } from "react";
import {
  HomeCarousel,
  HomeMobileCarousel,
  HomeCategories,
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
import { useParams } from "next/navigation";
import InfiniteScroll from "react-infinite-scroll-component";
import { Category } from "@/actions";
import { FaChevronUp } from "react-icons/fa";

const DealoftheDay = ({ type }) => {
  const dispatch = useDispatch();
  const hotDeals = useContent("specialPages.hotDeals");

  const deal_of_the_day_items = useSelector(
    (state) => state.homeslice.deal_of_the_day_items
  );
  const trending_products = useSelector(
    (state) => state.homeslice.trending_products
  );
  const loading7 = useSelector((state) => state.homeslice.loading7);

  const params = useParams();
  const slug = params?.slug;
  const { getdeal_of_the_dayList } = Category();

  const { isMobile } = MediaQueries();

  const [current_page, setcurrent_page] = useState(1);
  const [has_more, sethas_more] = useState(true);

  useEffect(() => {
    getdeal_of_the_dayList(current_page, sethas_more);
  }, [slug, current_page]);

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
    <Container fluid className="pt-2 pb-3 homepagecontainer">
      {!loading7 ? (
        <>
          {isMobile ? (
            <HomeMobileCarousel
              carousel_data={deal_of_the_day_items.banner_image}
            />
          ) : (
            <HomeCarousel carousel_data={deal_of_the_day_items.banner_image} />
          )}

          <Row className="half_carousel_products mt-3">
            <Col lg={12} className="mb-4">
              {loading7 ? (
                <HalfCarouselProductsplaceholder
                  category_list={[1, 2, 3, 4, 5, 6, 7, 8]}
                  type={2}
                />
              ) : (
                <HalfCarouselProducts
                  title={hotDeals}
                  first_title={"Hot"}
                  second_title={"Deals"}
                  products={deal_of_the_day_items.hot_deals}
                  type={1}
                  inner_bg={"rgba(255, 250, 229, 1)"}
                  bg_color={"rgba(255, 207, 10, 1)"}
                  first_string_color={"#000"}
                  second_string_color={"rgba(82, 50, 194, 1)"}
                  view_all={"rgba(82, 50, 194, 1)"}
                />
              )}
            </Col>
          </Row>

          <Row className="mt-4">
            <div className="component_1">
              <div
                className={`carousel_products `}
                style={{ background: !isMobile && "rgba(238, 235, 250, 1)" }}
              >
                <Row className="mb-4 gx-2 gy-2">
                  {deal_of_the_day_items.items.map((product) => {
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
              </div>
            </div>
          </Row>

          <Row className="mt-4">
            <div className="component_1">
              <ComponentHeader
                title={"Trending Products"}
                first_title={"Trending"}
                second_title={"Products"}
                first_string_color={"#000"}
                second_string_color={null}
                view_all={"rgba(82, 50, 194, 1)"}
              />
              <div
                className={`carousel_products `}
                style={{ background: !isMobile && "rgba(238, 235, 250, 1)" }}
              >
                <InfiniteScroll
                  dataLength={trending_products.length}
                  next={() => {
                    setcurrent_page(current_page + 1);
                  }}
                  hasMore={has_more}
                  scrollThreshold={"80%"}
                  loader={
                    has_more && (
                      <div style={{ textAlign: "center" }}>
                        <img
                          src="https://www.ourshopee.com/static/media/loader.b7845d8936c686dc2914.gif"
                          alt="Loading..."
                        />
                      </div>
                    )
                  }
                  style={{ overflow: "hidden" }}
                >
                  <Row className="mb-4 gx-2 gy-2">
                    {trending_products.map((product) => {
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
              </div>
            </div>
          </Row>
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

export default DealoftheDay;
