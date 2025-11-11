"use client"
import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { MediaQueries } from "@/components/utils";
import Changepassword from "@/components/Common/Changepassword";
import MyAccountDashboard from "@/components/Myaccount/MyAccountDashboard";
import BreadComp from "@/components/Myaccount/BreadComp";
import withAuth from "@/components/Common/withAuth";
import { useContent, useCurrentLanguage } from "@/hooks";

const PasswordChange = () => {
    const currentLanguage = useCurrentLanguage();
    const changePassword = useContent("buttons.changePassword");
    const enterCurrentPasswordAndNewPassword = useContent("forms.enterCurrentPasswordAndNewPassword");
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
                                    <BreadComp title={changePassword} />
                                    <div className="page-titile">{changePassword.toUpperCase()}
                                    </div>
                                    <Changepassword />
                                </div>
                            </Col>
                            :

                            <Col lg={9}>
                                <div className="Myaccount-rightsidecard">
                                    <div className="title">{changePassword}</div>
                                    <div className="discription">{enterCurrentPasswordAndNewPassword}</div>
                                    <Changepassword />
                                </div>
                            </Col>
                    }
                </Row>
            </Container>
        </>
    );
};

export default withAuth(PasswordChange);
