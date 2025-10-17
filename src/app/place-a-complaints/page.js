"use client"
import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { MediaQueries } from "@/components/utils";
import MyAccountDashboard from "@/components/Myaccount/MyAccountDashboard";
import BreadComp from "@/components/Myaccount/BreadComp";
import PlacecomplaintForm from "@/components/Myaccount/PlacecomplaintForm"
import withAuth from "@/components/Common/withAuth";
const Placecomplaints = () => {

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
                                     <BreadComp title={"Place a complaints"} title0={"Manage Complaints"} link={"/complaints"} />
                                     <div className="page-titile">Place a complaints
                                     </div>
                                     </div>:
                                       <div className="Myaccount-rightsidecard">
                                       <div className="title">Place a complaints</div>
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
