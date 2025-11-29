"use client"
import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";
import { MediaQueries } from "@/components/utils";
import MyAccountDashboard from "@/components/Myaccount/MyAccountDashboard";
import BreadComp from "@/components/Myaccount/BreadComp";
import Invitefriend from "@/components/Common/Invitefriend";
import withAuth from "@/components/Common/withAuth";
import { getAssetsUrl } from "@/components/utils/helpers";
import { useContent } from "@/hooks";
// import righticon from "../../../public/assets/vector_icons/arrow_right.png"
const Complaints = () => {
    const { isMobile } = MediaQueries();
    
    // Language content
    const manageComplaints = useContent("account.manageComplaints");
    const manageComplaintsDescription = useContent("account.manageComplaintsDescription");
    const placeComplaint = useContent("account.placeComplaint");

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
                                     <BreadComp title={manageComplaints} />
                                     <div className="page-titile">{manageComplaints}
                                     </div>
                                     </div>:
                                       <div className="Myaccount-rightsidecard">
                                       <div className="title">{manageComplaints}</div>
                                       <div className="discription">{manageComplaintsDescription}</div>
                                   </div>
                                }
                              
                                <Row>
                                    <Invitefriend/>
                                    <Col lg={6} md={6} sm={12} >
                                        <Link href="/place-a-complaints" className="complaintcard textdecoration-none">

                                            <img className="compliantimg" src={getAssetsUrl("email edit.png")} loading="lazy" />
                                            <div className="complianttitle">{placeComplaint}</div>
                                        </Link>
                                    </Col>
                                    <Col lg={6} md={6} sm={12} >
                                        <Link href="/manage-complaint" className="complaintcard textdecoration-none">

                                            <img className="compliantimg" src={getAssetsUrl("Group.png")} loading="lazy" />
                                            <div className="complianttitle">{manageComplaints}</div>
                                        </Link>
                                    </Col>
                                </Row>
                            </Col>
                
                </Row>
            </Container>
        </>
    );
};

export default withAuth(Complaints);
