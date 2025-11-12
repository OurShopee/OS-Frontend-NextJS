"use client"
import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { MediaQueries } from "@/components/utils";
import MyAccountDashboard from "@/components/Myaccount/MyAccountDashboard";
import Orders from "@/components/Common/Orders";
import BreadComp from "@/components/Myaccount/BreadComp";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScroll from 'react-infinite-scroll-component';
import {Order} from "@/actions/index"
import withAuth from "@/components/Common/withAuth";
import { useContent } from "@/hooks";
const page = () => {
    const dispatch = useDispatch();
    const { isMobile } = MediaQueries();
    const { myorderapi } = Order();
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const orderlistdata = useSelector((state) => state.formslice.orderlistdata);
    
    // Language content
    const myOrders = useContent("account.myOrders");
    const myOrdersDescription = useContent("account.myOrdersDescription");
    const noMoreOrders = useContent("cart.noMoreOrders");

  
    useEffect(() => {

        const input_data = {
            referenceid: " ",
             page:  1,
         };
         myorderapi(input_data);
    }, [])

    const loadMoreData = () => {
        setPage(page + 1)
        const input_data = {
           referenceid: " ",
            page: page + 1,
        };
        myorderapi(input_data);
    
    };

    return (
        <Container fluid className="homepagecontainer">
            <Row className={!isMobile ? "mt-4" : ""}>
                {!isMobile && (
                    <Col lg={3}>
                        <MyAccountDashboard />
                    </Col>
                )}

                <Col lg={isMobile ? 12 : 9}>
                    <div className={!isMobile ? "Myaccount-rightsidecard" : ""}>
                        {isMobile && <BreadComp title={myOrders} />}
                        <div className={isMobile ? "page-titile" : "title"}>{myOrders}</div>
                        {!isMobile && (
                            <div className="discription">
                                {myOrdersDescription}
                            </div>
                        )}

                        {orderlistdata?.data?.length > 0 && (
                            <InfiniteScroll
                                dataLength={orderlistdata.data.length}
                                next={loadMoreData}
                                hasMore={hasMore}
                                // loader={<h6 className="text-center">Loading more orders...</h6>}
                                endMessage={<h6 className="text-center text-muted">{noMoreOrders}</h6>}
                                scrollThreshold="80%"
                                style={{ overflow: "hidden" }}
                            >
                                <Orders  orderlistdata={orderlistdata}/>
                            </InfiniteScroll>
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default withAuth(page);
