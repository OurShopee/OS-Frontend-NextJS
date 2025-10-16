"use client"
import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { MediaQueries } from "@/components/utils";
import MyAccountDashboard from "@/components/Myaccount/MyAccountDashboard";
import BreadComp from "@/components/Myaccount/BreadComp";
import { useSelector, useDispatch } from "react-redux";
import { ProductCard } from "@/components/Common";
import { PiTrashSimpleLight } from "react-icons/pi";
import { postWishList, getWishLists } from "@/redux/cartslice";
import { useCart } from "@/hooks";
import Cookies from "universal-cookie";
import Link from "next/link";
const page = () => {
  const { isMobile } = MediaQueries();
  const dispatch = useDispatch();
  const cookies = new Cookies();

  const { add2cart } = useCart();
  const wishListData = useSelector((state) => state.cartslice.wishListData);
  const authstatus = useSelector((state) => state.formslice.authstatus);
  const logindata = useSelector((state) => state.formslice.logindata);

  const handleRemove = async (item) => {
    var input_data = {
      product_id: item.id,
      sku: item.sku,
    };
    await dispatch(postWishList(input_data));
    dispatch(getWishLists());
  };

  const handleClick = async (item) => {
    var input_data = {
      product_id: item.id,
      user_id: authstatus ? logindata.user_id : 0,
      quantity: "1",
    };

    if (cookies.get("cart_ip_address") == undefined) {
      input_data.ip_address = 0;
    } else {
      input_data.ip_address = cookies.get("cart_ip_address");
    }
    add2cart(input_data);
  };

  return (
    <>
      <Container fluid className="homepagecontainer">
        <Row className={!isMobile ? "mt-4" : ""}>
          {!isMobile && (
            <Col lg={3}>
              <MyAccountDashboard />
            </Col>
          )}
          {isMobile ? (
            <Col lg={12}>
              <div>
                <BreadComp title={"My wishlist"} />
                <div className="page-titile">My wishlist</div>
                <div className="Myaccount-rightsidecard">
                  <Row>
                    {wishListData?.map((item) => {
                      return (
                        <Col lg={4} className="mb-3">
                          <Link
                            href={`/details/${item.url}`}
                          >
                            <ProductCard item={item} />
                          </Link>
                          <div className="product_Detail_left_side d-flex wish_list">
                            <div
                              className="product_detail_btn mt-3 w-100"
                              onClick={() => handleClick(item)}
                            >
                              Add to cart
                            </div>
                            <div
                              onClick={() => handleRemove(item)}
                              className="product_detail_btn mt-3 ms-2"
                              style={{
                                background: "#fff",
                                width: "15%",
                                border: "1px solid rgba(206, 210, 212, 1)",
                              }}
                            >
                              <PiTrashSimpleLight
                                size={25}
                                color={"rgba(67, 73, 75, 1)"}
                              />
                            </div>
                          </div>
                        </Col>
                      );
                    })}
                  </Row>
                </div>
              </div>
            </Col>
          ) : (
            <Col lg={9}>
              <div className="Myaccount-rightsidecard">
                <div className="title">My wishlist</div>
                <div className="discription">
                  Save and manage products you'd love to purchase later.
                </div>
                <Row>
                  {wishListData?.map((item) => {
                    return (
                      <Col lg={4} className="mb-3">
                        <Link
                          href={`/details/${item.url}`}
                         
                        >
                          <ProductCard item={item} />
                        </Link>
                        <div className="product_Detail_left_side d-flex wish_list">
                          <div
                            className="product_detail_btn mt-3 w-100"
                            onClick={() => handleClick(item)}
                          >
                            Add to cart
                          </div>
                          <div
                            onClick={() => handleRemove(item)}
                            className="product_detail_btn mt-3 ms-2"
                            style={{
                              background: "#fff",
                              width: "15%",
                              border: "1px solid rgba(206, 210, 212, 1)",
                            }}
                          >
                            <PiTrashSimpleLight
                              size={25}
                              color={"rgba(67, 73, 75, 1)"}
                            />
                          </div>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </div>
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
};

export default page;
