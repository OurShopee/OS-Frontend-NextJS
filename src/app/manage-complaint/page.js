"use client"
import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { MediaQueries } from "@/components/utils";
import MyAccountDashboard from "@/components/Myaccount/MyAccountDashboard";
import BreadComp from "@/components/Myaccount/BreadComp";
import Mangecomplaintform from "@/components/Myaccount/Mangecomplaintform"
import Invitefriend from "@/components/Common/Invitefriend"
import withAuth from "@/components/Common/withAuth";
const ManageComplaints = () => {

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



                    <Col lg={9} md={9} sm={12}>
                        {
                            isMobile ?
                                <div>
                                    <BreadComp title={"Place a complaints"} title0={"Manage Complaints"} />
                                    <div className="page-titile">Track your Complaints
                                    </div>
                                </div> :
                                <div className="Myaccount-rightsidecard">
                                    <div className="title">Track your Complaints</div>
                                    <div className="discription">Register Your Complaints here..Our Customer Care Executive will get back to you soon.</div>
                                </div>
                        }
                         <Invitefriend/>
                        <Mangecomplaintform />

                    </Col>

                </Row>
            </Container>
        </>
    );
};

export default withAuth(ManageComplaints);
