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
import { useContent } from "@/hooks";

const page = () => {
    const { isMobile } = MediaQueries();
    const wallet = useContent("account.wallet");
  return (
    <Container fluid className="homepagecontainer">
                <Row className={!isMobile ? "mt-4" : ""}>
                    {
                        !isMobile &&
                        <Col lg={3}>
                            <MyAccountDashboard />
                        </Col>
                    }
                  
                         

                            <Col lg={9} >
                                {
                                     isMobile ?
                                    <>
                                    <div>
                                        <BreadComp title={wallet} />
                                        <div className="page-titile">hello</div>
                                    </div>
                                    </>
                                    : null
                                }
                              
                                <Row>
                                    <Col sm={12} >
                                    <BreadComp title={wallet} />
                                    <div className="page-titile">hello</div>
                                    </Col>
                                    <Col lg={6} md={6} sm={12} >
                                       hello
                                    </Col>
                                </Row>
                            </Col>
                
                </Row>
            </Container>
  )
}

export default page