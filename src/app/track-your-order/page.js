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
import { useContent } from "@/hooks";
// import righticon from "../../../public/assets/vector_icons/arrow_right.png"
const Ordertrack = () => {
    const { isMobile } = MediaQueries();
    
    // Language content
    const trackYourOrder = useContent("account.trackYourOrder");
    const trackYourOrderDescription = useContent("account.trackYourOrderDescription");
    const trackByReferenceId = useContent("account.trackByReferenceId");

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
                                    <BreadComp title={trackYourOrder} />
                                    <div className="page-titile">{trackYourOrder}
                                    </div>
                                  
                                    {/* <Link href="/track-your-orderbyid" className="cardmobilecard textdecoration-none">
                                        <div className="tractordermobiletitle">Track by Order ID</div>
                                        <img src='/assets/vector_icons/arrow_right.png' />
                                    </Link> */}
                                    <Link href="/track-your-orderbyrefrrenceid" className="cardmobilecard textdecoration-none">
                                        <div className="tractordermobiletitle">{trackByReferenceId}</div>
                                        <img src='/assets/vector_icons/arrow_right.png' />
                                    </Link>
                                </div>
                            </Col>
                            :

                            <Col lg={9}>
                                <div className="Myaccount-rightsidecard">
                                    <div className="title">{trackYourOrder}</div>
                                    <div className="discription">{trackYourOrderDescription}</div>
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
