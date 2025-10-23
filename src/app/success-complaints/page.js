"use client";
import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MediaQueries } from "../../components/utils";
// import MobileAddress from "./MobileAddress";
import MyAccountDashboard from "@/components/Myaccount/MyAccountDashboard";
import BreadComp from "@/components/Myaccount/BreadComp";

// import righticon from "../../../public/assets/vector_icons/arrow_right.png"
const Complaintsuccss = () => {

    const { isMobile } = MediaQueries()
    const searchParams = useSearchParams();
    const complaint_id = searchParams.get('complaint_id');
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
                                <div className="Myaccount-rightsidecard mt-3 success-complaints">
                                    {/* <div className="mt-1 text-green-700 font-extrabold">Complaint Id - {complaint_id}</div> */}
                            <div className="bg-green-50 border border-green-300 text-green-800 p-3 rounded-lg">
                                Complaint ID – <strong>{complaint_id}</strong> has been submitted successfully.
                                We will get back to you soon.
                            </div>
                                    <Link href={"/manage-complaint"} className="successcomplaint-btn textdecoration-none">Track your Complaint</Link>

                                </div>
                              {/* <PlacecomplaintForm/> */}
                               
                            </Col>
                
                </Row>
            </Container>
        </>
    );
};

export default Complaintsuccss;
