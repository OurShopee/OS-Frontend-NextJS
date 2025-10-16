"use client"
import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { MediaQueries } from "@/components/utils";
import Changepassword from "@/components/Common/Changepassword";
import MyAccountDashboard from "@/components/Myaccount/MyAccountDashboard";
import BreadComp from "@/components/Myaccount/BreadComp";

const PasswordChange = () => {

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
                                    <BreadComp title={"Change Password"} />
                                    <div className="page-titile">CHANGE PASSWORD
                                    </div>
                                    <Changepassword />
                                </div>
                            </Col>
                            :

                            <Col lg={9}>
                                <div className="Myaccount-rightsidecard">
                                    <div className="title">Change Password</div>
                                    <div className="discription">Enter your current password and new password to change the password</div>
                                    <Changepassword />
                                </div>
                            </Col>
                    }
                </Row>
            </Container>
        </>
    );
};

export default PasswordChange;
