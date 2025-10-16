"use client"
import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { MediaQueries } from "../../components/utils";
import Addresslist from "@/components/Myaccount/Addresslist";
import MyAccountDashboard from "@/components/Myaccount/MyAccountDashboard";
import BreadComp from "@/components/Myaccount/BreadComp";


const Address = () => {

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
                                    <BreadComp title={"Address"} />
                                    <div className="page-titile">My Address</div>
                                    <Mobileaddress />
                                </div>
                            </Col>
                            :

                            <Col lg={9}>
                                <div className="Myaccount-rightsidecard">
                                    <div className="title">Address</div>
                                    <div className="discription">Edit and save your personal address</div>
                                    <Addresslist />
                                </div>
                            </Col>
                    }
                </Row>
            </Container>
        </>
    );
};

export default Address;



