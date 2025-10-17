"use client"
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import rightimg from "@/images/Arrow - Right 2.png"
import BreadComp from "@/components/Myaccount/BreadComp";
import Link from "next/link";
const Sitemap = () => {
    const categorydata = useSelector((state) => state.globalslice.data);
    return (
        <div>
            <Container fluid className="homepagecontainer">
                <div className="mt-2 ">

                    <BreadComp title={"Sitemap"} />
                </div>
                <div className="footerpagesheader">
                Sitemap
                </div>
                <Row className="pb-4">
                    {
                        categorydata.slice(0, 10).map(ele => {
                            return (
                                <Col lg={3} md={4} sm={6} xs={12} className="mt-2 mb-2" >
                                    <div className="sitemapcard">
                                        <Link href={`/categories/${ele.url}`} className="sitemapcategory textdecoration-none">{ele.category_name}</Link>
                                        <div className="p-1"></div>
                                        {
                                            ele.subcategory?.slice(0, 6).map(ele => {
                                                // const isActive =
                                                // slug == ele.url;

                                                return (
                                                    <Link
                                                        key={ele.id}
                                                        href={`/products-category/${ele.url}`}
                                                        className="sitemapcat textdecoration-none"
                                                    >
                                                        {
                                                            // isActive ?
                                                            // <img className="blog-cat-rightarrowimg" src={activerightimg} alt="arrow" /> :
                                                            <img className="blog-cat-rightarrowimg" src={rightimg.src} alt="arrow" />
                                                        }


                                                        {ele.sub_category_name}
                                                    </Link>
                                                );
                                            })
                                        }
                                    </div>
                                </Col>
                            )

                        })
                    }

                </Row>
            </Container>
        </div>
    )
}
export default Sitemap;