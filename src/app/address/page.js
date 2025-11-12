"use client"
import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { MediaQueries } from "../../components/utils";
import Addresslist from "@/components/Myaccount/Addresslist";
import MobileAddress from "@/components/Myaccount/MobileAddress";
import MyAccountDashboard from "@/components/Myaccount/MyAccountDashboard";
import BreadComp from "@/components/Myaccount/BreadComp";
import withAuth from "@/components/Common/withAuth";
import { useContent, useCurrentLanguage } from "@/hooks";


const Address = () => {
    const { isMobile } = MediaQueries();
    const currentLanguage = useCurrentLanguage();
    
    // Content translations
    const address = useContent("pages.address");
    const myAddress = useContent("buttons.myAddress");
    const editAndSaveYourPersonalAddress = useContent("buttons.editAndSaveYourPersonalAddress");

    return (
        < >
            <Container fluid className="homepagecontainer" dir={currentLanguage === "ar" ? "rtl" : "ltr"}>
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
                                    <BreadComp title={address} />
                                    <div className="page-titile">{myAddress}</div>
                                    <MobileAddress />
                                </div>
                            </Col>
                            :

                            <Col lg={9}>
                                <div className="Myaccount-rightsidecard">
                                    <div className="title">{address}</div>
                                    <div className="discription">{editAndSaveYourPersonalAddress}</div>
                                    <Addresslist />
                                </div>
                            </Col>
                    }
                </Row>
            </Container>
        </>
    );
};

export default withAuth(Address);



