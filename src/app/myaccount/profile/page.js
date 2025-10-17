"use client"
import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import MyAccountDashboard from "@/components/Myaccount/MyAccountDashboard";
import ProfileView from "@/components/Myaccount/ProfileView";
import { MediaQueries } from "@/components/utils";
import withAuth from "@/components/Common/withAuth";


const MyAccount = () => {

    const { isMobile } = MediaQueries()

    return (
        < >
            <Container fluid className="homepagecontainer">
                <Row className="mt-4">
                   {!isMobile && <Col lg={3}>
                        <MyAccountDashboard />
                    </Col>}
                        <Col lg={9}>
                            <div className="Myaccount-rightsidecard">
                                <div className="title">Profile</div>
                                <div className="discription">Edit and save your personal address</div>
                                <ProfileView />
                            </div>
                        </Col>
                
                </Row>
            </Container>
        </>
    );
};

export default withAuth(MyAccount);
