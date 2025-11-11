"use client";
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import rightimg from "@/images/Arrow - Right 2.png";
import BreadComp from "@/components/Myaccount/BreadComp";
import Link from "next/link";
import { useContent, getDynamicContent, useCurrentLanguage } from "@/hooks";
const Sitemap = () => {
  const categorydata = useSelector((state) => state.globalslice.data);
  const sitemapText = useContent("pages.sitemap");
  const currentLanguage = useCurrentLanguage();
  return (
    <div>
      <Container fluid className="homepagecontainer">
        <div className="mt-2 ">
          <BreadComp title={sitemapText} />
        </div>
        <div className="footerpagesheader">{sitemapText}</div>
        <Row className="pb-4">
          {categorydata.slice(0, 10).map((ele) => {
            return (
              <Col lg={3} md={4} sm={6} xs={12} className="mt-2 mb-2">
                <div className="sitemapcard">
                  <Link
                    href={`/categories/${ele.url}`}
                    className="sitemapcategory textdecoration-none"
                  >
                    {getDynamicContent(ele, "category_name", currentLanguage)}
                  </Link>
                  <div className="p-1"></div>
                  {ele.subcategory?.slice(0, 6).map((sub) => {
                    // const isActive =
                    // slug == sub.url;

                    return (
                      <Link
                        key={sub.id}
                        href={`/products-category/${sub.url}`}
                        className="sitemapcat textdecoration-none"
                      >
                        {
                          // isActive ?
                          // <img className="blog-cat-rightarrowimg" src={activerightimg} alt="arrow" /> :
                          <img
                            className="blog-cat-rightarrowimg"
                            src={rightimg.src}
                            alt="arrow"
                          />
                        }

                        {getDynamicContent(sub, "sub_category_name", currentLanguage)}
                      </Link>
                    );
                  })}
                </div>
              </Col>
            );
          })}
        </Row>
      </Container>
    </div>
  );
};
export default Sitemap;
