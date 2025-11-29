"use client"
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import BreadComp from "@/components/Myaccount/BreadComp";
import { MediaQueries } from "@/components/utils";
const Sellwithus = () => {
    const dispatch = useDispatch()
    const { isMobile } = MediaQueries()

    return (
        <Container fluid className="homepagecontainer">
            <BreadComp title={"Sell with Us"} />
            <div className="footerpagesheader">
            Sell with Us
            </div>
            <div className="single_banner pt-4">
                <img src={'assets/banners/sellus.png'} loading="lazy" />
            </div>

        
            
            <Row className="mt-4 fivecomponet fivebannerbackground1">
                <div className="aboutus-title">Why to sell with Ourshopee</div>
                <Col lg={4} md={4} sm={12} className="mb-4 ">
                    <div className="about-fivecomponet-comp  about-fivecomponet-compcard1">
                        <div className="aboutus-factor-title">Easy Dashboard</div>
                        <div className="aboutus-twobanner-subtitle">Manage your products, orders, account, payments, sales and statements by the very easy dashboard.</div>
                    </div>
                </Col>
                <Col lg={4} md={4} sm={12} className="mb-4">
                    <div className="about-fivecomponet-comp  about-fivecomponet-compcard1">
                        <div className="aboutus-factor-title">Facilitate Work</div>
                        <div className="aboutus-twobanner-subtitle">We strive to do what is right and do what we say we will do.</div>
                    </div>
                </Col>
                <Col lg={4} md={4} sm={12} className="mb-4">
                    <div className="about-fivecomponet-comp  about-fivecomponet-compcard1">
                        <div className="aboutus-factor-title">Reach People</div>
                        <div className="aboutus-twobanner-subtitle">Via OurShopee Platform and connections many people can easily find your products easily.</div>
                    </div>
                </Col>
                <Col lg={6} md={6} sm={12} className="mb-4">
                    <div className="about-fivecomponet-comp  about-fivecomponet-compcard1">
                        <div className="aboutus-factor-title">Boost Your Sale</div>
                        <div className="aboutus-twobanner-subtitle">
                        Through OurShopee Many people are viewing your products, all you have to do is crafting more.
                            </div>
                    </div>
                </Col>
                <Col lg={6} md={6} sm={12} className="mb-4">
                    <div className="about-fivecomponet-comp  about-fivecomponet-compcard1">
                        <div className="aboutus-factor-title">Monitor Performance</div>
                        <div className="aboutus-twobanner-subtitle">OurShopee provides you with the interface to monitor your performance, sale and payment.</div>
                    </div>
                </Col>


            </Row>
            <Row className="mt-4 myworks">
            <div className="aboutus-title">How It Works?
         
                </div>
                <Col lg={12} md={12} sm={12} className="mb-4">
                    <div className="about-factors about-factorbackground1">
                        <div className="about-factorcont sellwithuscount">1</div>
                        <div className="about-us-factors-comp">
                            <div className="aboutus-factor-title">Easy Dashboard</div>
                            <div className="aboutus-twobanner-subtitle">Fill the Registration Form & Read and accept our Seller Agreement</div>
                        </div>
                        <img className="aboutwork-rightimg" src={'assets/banners/aboutwork1.png'} loading="lazy" />
                    </div>
                </Col>
                <Col lg={12} md={12} sm={12} className="mb-4">
                    <div className="about-factors about-factorbackground1">
                        <div className="about-factorcont sellwithuscount">2</div>
                        <div className="about-us-factors-comp">
                            <div className="aboutus-factor-title">Upload Products</div>
                            <div className="aboutus-twobanner-subtitle">Upload your products to start selling</div>
                        </div>
                        <img className="aboutwork-rightimg" src={'assets/banners/aboutwork2.png'} loading="lazy" />
                    </div>
                </Col>
                <Col lg={12} md={12} sm={12} className="mb-4">
                    <div className="about-factors about-factorbackground1">
                        <div className="about-factorcont sellwithuscount">3</div>
                        <div className="about-us-factors-comp">
                            <div className="aboutus-factor-title">Get Orders</div>
                            <div className="aboutus-twobanner-subtitle">You'll be notified when your item is sold. Pack your item ready to send.</div>
                        </div>
                        <img className="aboutwork-rightimg" src={'assets/banners/aboutwork3.png'} loading="lazy" />
                    </div>
                </Col>
                <Col lg={12} md={12} sm={12} className="mb-4">
                    <div className="about-factors about-factorbackground1">
                        <div className="about-factorcont sellwithuscount">4</div>
                        <div className="about-us-factors-comp">
                            <div className="aboutus-factor-title">Ship</div>
                            <div className="aboutus-twobanner-subtitle">Handover the packed item to our courier partner at your doorstep for shipping.</div>
                        </div>
                        <img className="aboutwork-rightimg" src={'assets/banners/aboutwork4.png'} loading="lazy" />
                    </div>
                </Col>
                <Col lg={12} md={12} sm={12} className="mb-4">
                    <div className="about-factors about-factorbackground1">
                        <div className="about-factorcont sellwithuscount">5</div>
                        <div className="about-us-factors-comp">
                            <div className="aboutus-factor-title">Earn</div>
                            <div className="aboutus-twobanner-subtitle">Get payments quickly through your account as per ourshopee Term &Conditons.</div>
                        </div>
                        <img className="aboutwork-rightimg" src={'assets/banners/aboutwork5.png'} loading="lazy" />
                    </div>
                </Col>
            
            
            </Row>

        </Container>
    )
}
export default Sellwithus;