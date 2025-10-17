"use client"
import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";
import { MediaQueries } from "@/components/utils";
import MyAccountDashboard from "@/components/Myaccount/MyAccountDashboard";
import BreadComp from "@/components/Myaccount/BreadComp";
import Invitefriend from "@/components/Common/Invitefriend";
import inviteimg from "@/images/invite.png"
import editeemaiimg from "@/images/email edit.png"
import trackcomplateimg from "@/images/Group.png"
import withAuth from "@/components/Common/withAuth";
// import righticon from "../../../public/assets/vector_icons/arrow_right.png"
const Complaints = () => {

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
                                     <BreadComp title={"Manage Complaints"} />
                                     <div className="page-titile">Manage Complaints
                                     </div>
                                     </div>:
                                       <div className="Myaccount-rightsidecard">
                                       <div className="title">Manage Complaints</div>
                                       <div className="discription">Place your complaints & Track the status of your complaints.</div>
                                   </div>
                                }
                              
                                <Row>
                                    <Invitefriend/>
                                    <Col lg={6} md={6} sm={12} >
                                        <Link href="/place-a-complaints" className="complaintcard textdecoration-none">

                                            <img className="compliantimg" src={editeemaiimg.src} />
                                            <div className="complianttitle">Place a complaints</div>
                                        </Link>
                                    </Col>
                                    <Col lg={6} md={6} sm={12} >
                                        <Link href="/manage-complaint" className="complaintcard textdecoration-none">

                                            <img className="compliantimg" src={trackcomplateimg.src} />
                                            <div className="complianttitle">Manage Complaints</div>
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
