"use client";
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MediaQueries } from "../../components/utils";
// import MobileAddress from "./MobileAddress";
import MyAccountDashboard from "@/components/Myaccount/MyAccountDashboard";
import BreadComp from "@/components/Myaccount/BreadComp";
import { useContent } from "@/hooks";

// import righticon from "../../../public/assets/vector_icons/arrow_right.png"
const Complaintsuccss = () => {

    const { isMobile } = MediaQueries()
    const searchParams = useSearchParams();
    const complaint_id = searchParams.get('complaint_id');
    const placeComplaint = useContent("account.placeComplaint");
    const manageComplaints = useContent("account.manageComplaints");
    const complaintSupportDescription = useContent("account.complaintSupportDescription");
    const trackYourComplaints = useContent("account.trackYourComplaints");
    const complaintSubmitted = useContent("account.complaintSubmitted");
    const contactSoon = useContent("account.weWillContactSoon");
    const trackComplaintCta = useContent("account.trackComplaintCta");
    const complaintSuccessParts = complaintSubmitted.split("{{complaint_id}}");
    const complaintMessageStart = complaintSuccessParts[0] || "";
    const complaintMessageEnd = complaintSuccessParts[1] || "";
    const complaintIdDisplay = complaint_id || "—";
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
                                       <div className="discription">{complaintSupportDescription}</div>
                                   </div>
                                }
                                <div className="Myaccount-rightsidecard mt-3 success-complaints">
                                    {/* <div className="mt-1 text-green-700 font-extrabold">Complaint Id - {complaint_id}</div> */}
                            <div className="bg-green-50 border border-green-300 text-green-800 p-3 rounded-lg">
                                {complaintMessageStart}
                                <strong>{complaintIdDisplay}</strong>
                                {complaintMessageEnd}
                                <div>{contactSoon}</div>
                            </div>
                                    <Link href={"/manage-complaint"} className="successcomplaint-btn textdecoration-none">{trackComplaintCta}</Link>

                                </div>
                              {/* <PlacecomplaintForm/> */}
                               
                            </Col>
                
                </Row>
            </Container>
        </>
    );
};

export default Complaintsuccss;
