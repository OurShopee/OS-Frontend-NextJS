import { Col, Container, Row } from "react-bootstrap";
import Affiliateprogramform from "@/components/Common/Affiliateprogramform";
import BreadComp from "@/components/Myaccount/BreadComp";
const Affiliateprogram = () => {
    return (
        <Container fluid className="homepagecontainer">
            <div className="mt-2 ">

                <BreadComp title={"FAQ’s"} />
            </div>
            <div className="single_banner pt-4">
                <img src={'assets/banners/affriate.png'} loading="lazy" />
            </div>
            <div className="single_banner pt-4">
                <img src={'assets/banners/company.png'} loading="lazy" />
            </div>
            <Row className="mt-5 mb-5">
                <Col lg={6} md={12} className="affriatemain">
                    <div className="affriateregister-title">Register Here</div>
                    <div className="affriate-subtitle">Please fill the contact form to get more information</div>
                    <div className="affriatecontactus">
                        Contact us at: <span className="">info@ourshopee.com.</span>
                    </div>
                </Col>
                <Col lg={6} md={12}>
                <Affiliateprogramform/>
                </Col>
            </Row>

        </Container>
    )
}
export default Affiliateprogram;