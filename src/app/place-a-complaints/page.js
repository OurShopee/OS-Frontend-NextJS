"use client"
import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { MediaQueries } from "@/components/utils";
import MyAccountDashboard from "@/components/Myaccount/MyAccountDashboard";
import BreadComp from "@/components/Myaccount/BreadComp";
import PlacecomplaintForm from "@/components/Myaccount/PlacecomplaintForm"
import withAuth from "@/components/Common/withAuth";
import { useContent, useCurrentLanguage } from "@/hooks";

const Placecomplaints = () => {
    const currentLanguage = useCurrentLanguage();
    const placeComplaint = useContent("helpCenter.placeComplaint");
    const manageComplaints = useContent("helpCenter.manageComplaints");
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
                                     <BreadComp title={placeComplaint} title0={manageComplaints} link={"/complaints"} />
                                     <div className="page-titile">{placeComplaint}
                                     </div>
                                     </div>:
                                       <div className="Myaccount-rightsidecard">
                                       <div className="title">{placeComplaint}</div>
                                       <div className="discription">Register Your Complaints here..Our Customer Care Executive will get back to you soon.</div>
                                   </div>
                                }
                              <PlacecomplaintForm/>
                               
                            </Col>
                
                </Row>
            </Container>
        </>
    );
};

export default withAuth(Placecomplaints);
