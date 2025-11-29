"use client"
import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import { MediaQueries } from "@/components/utils";
// import MobileAddress from "./MobileAddress";
import MyAccountDashboard from "@/components/Myaccount/MyAccountDashboard";
import TrackbyReferenceid from "@/components/Myaccount/TrackbyReferenceid";
import withAuth from "@/components/Common/withAuth";
import { useContent } from "@/hooks";

const Ordertrack = () => {
    const { isMobile } = MediaQueries();
    
    // Language content
    const trackYourOrder = useContent("account.trackYourOrder");
    const trackYourOrderDescription = useContent("account.trackYourOrderDescription");

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
                    {isMobile ? (
                        <Col lg={12}>
                            <TrackbyReferenceid />
                        </Col>
                    ) : (
                        <Col lg={9}>
                            <div className="Myaccount-rightsidecard">
                                <div className="title">{trackYourOrder}</div>
                                <div className="discription">{trackYourOrderDescription}</div>
                                <TrackbyReferenceid />
                            </div>
                        </Col>
                    )}
                </Row>
            </Container>
        </>
    );
};

export default withAuth(Ordertrack);
