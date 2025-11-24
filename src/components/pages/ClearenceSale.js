"use client";

import { Category } from "@/actions";
import { ComponentHeader, ProductCard } from "@/components/Common";
import { HomeBannerPlaceholder } from "@/components/Common/Placeholders";
import {
  HalfCarouselProducts,
  HomeCarousel,
  HomeMobileCarousel,
} from "@/components/homepage";
import {
  CarouselProducts as CarouselProductsplaceholder,
  HalfCarouselProducts as HalfCarouselProductsplaceholder,
} from "@/components/placeholders";
import { MediaQueries } from "@/components/utils";
import { useContent } from "@/hooks";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { FaChevronUp } from "react-icons/fa";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";

const ClearenceSale = ({ type }) => {
  const hotDeals = useContent("specialPages.hotDeals");
  const clearanceDeals = useContent("specialPages.clearanceDeals");

  const clearence_sale_items = useSelector(
    (state) => state.homeslice.clearence_sale_items
  );
  const trending_products = useSelector(
    (state) => state.homeslice.trending_products
  );
  const loading10 = useSelector((state) => state.homeslice.loading10);

  const params = useParams();
  const slug = params?.slug;
  const { getclearence_Sale_List } = Category();

  const { isMobile } = MediaQueries();

  const [current_page, setcurrent_page] = useState(1);
  const [limit, setlimit] = useState(50);
  const [has_more, sethas_more] = useState(true);
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

  useEffect(() => {
    getclearence_Sale_List(current_page, sethas_more, limit);
  }, [slug, current_page]);

  return (
    <Container fluid className="pt-2 pb-3 homepagecontainer">
      {!loading10 ? (
        <>
          {isMobile ? (
            <HomeMobileCarousel
              carousel_data={clearence_sale_items.bannerImages}
            />
          ) : (
            <HomeCarousel carousel_data={clearence_sale_items.bannerImages} />
          )}

          <Row className="half_carousel_products mt-3">
            <Col lg={12} className="mb-4">
              {loading10 ? (
                <HalfCarouselProductsplaceholder
                  category_list={[1, 2, 3, 4, 5, 6, 7, 8]}
                  type={2}
                />
              ) : (
                <HalfCarouselProducts
                  title={hotDeals}
                  products={clearence_sale_items.top_items}
                  type={1}
                  inner_bg={"rgba(255, 250, 229, 1)"}
                  bg_color={"rgba(255, 207, 10, 1)"}
                  view_all={"rgba(82, 50, 194, 1)"}
                />
              )}
            </Col>
          </Row>

          <Row className="">
            <div className="component_1">
              <ComponentHeader
                title={clearanceDeals}
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
                        <img src="https://www.ourshopee.com/static/media/loader.b7845d8936c686dc2914.gif"
                          alt="Loading..."
                        loading="lazy" />
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

export default ClearenceSale;
