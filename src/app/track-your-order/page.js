"use client"
import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";

import { MediaQueries } from "@/components/utils";
// import MobileAddress from "./MobileAddress";
import MyAccountDashboard from "@/components/Myaccount/MyAccountDashboard";
import TrackbyReferenceid from "@/components/Myaccount/TrackbyReferenceid";
import BreadComp from "@/components/Myaccount/BreadComp";
import withAuth from "@/components/Common/withAuth";
// import righticon from "../../../public/assets/vector_icons/arrow_right.png"
const Ordertrack = () => {

    const { isMobile } = MediaQueries()

    return (
        < >
            <Container fluid className="homepagecontainer">
                <Row className={!isMobile ? "mt-4" : ""}>
                    {
                        !isMobile &&
                        <Col lg={3}>
                            <MyAccountDashboard />
                        </Col>
                    }
                    {
                        isMobile ?
                            <Col lg={12}>
                                <div>
                                    <BreadComp title={"Track your order"} />
                                    <div className="page-titile">Track your order
                                    </div>
                                  
                                    {/* <Link href="/track-your-orderbyid" className="cardmobilecard textdecoration-none">
                                        <div className="tractordermobiletitle">Track by Order ID</div>
                                        <img src='/assets/vector_icons/arrow_right.png' />
                                    </Link> */}
                                    <Link href="/track-your-orderbyrefrrenceid" className="cardmobilecard textdecoration-none">
                                        <div className="tractordermobiletitle">Track by Reference ID</div>
                                        <img src='/assets/vector_icons/arrow_right.png' />
                                    </Link>
                                </div>
                            </Col>
                            :

                            <Col lg={9}>
                                <div className="Myaccount-rightsidecard">
                                    <div className="title">Track your order</div>
                                    <div className="discription">Monitor your order and stay updated on its status.</div>
                                    {/* <Trackorderbyid /> */}
                                    <TrackbyReferenceid />
                                </div>
                            </Col>
                    }
                </Row>
            </Container>
        </>
    );
};

export default withAuth(Ordertrack);
