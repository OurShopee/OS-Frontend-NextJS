"use client"
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { MediaQueries } from "@/components/utils";
import MyAccountDashboard from "@/components/Myaccount/MyAccountDashboard";
import BreadComp from "@/components/Myaccount/BreadComp";
import Mangecomplaintform from "@/components/Myaccount/Mangecomplaintform"
import Invitefriend from "@/components/Common/Invitefriend"
import withAuth from "@/components/Common/withAuth";
import { useContent } from "@/hooks";
const ManageComplaints = () => {

    const { isMobile } = MediaQueries()
    const placeComplaint = useContent("account.placeComplaint");
    const manageComplaints = useContent("account.manageComplaints");
    const trackYourComplaints = useContent("account.trackYourComplaints");
    const complaintSupportDescription = useContent("account.complaintSupportDescription");

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
                                    <BreadComp title={placeComplaint} title0={manageComplaints} />
                                    <div className="page-titile">{trackYourComplaints}
                                    </div>
                                </div> :
                                <div className="Myaccount-rightsidecard">
                                    <div className="title">{trackYourComplaints}</div>
                                    <div className="discription">{complaintSupportDescription}</div>
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
