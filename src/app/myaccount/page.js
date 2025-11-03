"use client"
import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import MyAccountDashboard from "@/components/Myaccount/MyAccountDashboard";
import ProfileView from "@/components/Myaccount/ProfileView";
import { MediaQueries } from "@/components/utils";
import withAuth from "@/components/Common/withAuth";
import { useContent } from "@/hooks";


const MyAccount = () => {
    const { isMobile } = MediaQueries();
    
    // Language content
    const profile = useContent("account.profile");
    const editPersonalAddress = useContent("account.editPersonalAddress");

    return (
        < >
            <Container fluid className="homepagecontainer">
                <Row className="mt-4">
                    <Col lg={3}>
                        <MyAccountDashboard />
                    </Col>

                    {
                        !isMobile &&
                        <Col lg={9}>
                            <div className="Myaccount-rightsidecard">
                                <div className="title">{profile}</div>
                                <div className="discription">{editPersonalAddress}</div>
                                <ProfileView />
                            </div>
                        </Col>
                    }
                </Row>
            </Container>
        </>
    );
};

export default withAuth(MyAccount);
