"use client"
import BreadComp from "@/components/Myaccount/BreadComp";
import { MediaQueries } from "@/components/utils";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
const Aboutus = () => {
    const dispatch = useDispatch()
    const { isMobile } = MediaQueries()

    return (
        <Container fluid className="homepagecontainer">
            <BreadComp title={"About Ourshopee"} />
            <div className="footerpagesheader">
                About Ourshopee
            </div>
            <div className="single_banner pt-4">
                <img src={'assets/banners/aboutus.png'} />
            </div>

            <div className="abouts-company">
                <div className="aboutus-title">Welcome to Ourshopee.com</div>
                <div className="aboutus-subtitle">Where Shopping Dreams Come True!</div>
                <div className="aboutus-discription">Since our inception in 2015, Ourshopee.com has blossomed into one of the leading and fastest-growing online shopping platforms, capturing hearts across the UAE, Oman, Qatar, Kuwait, Bahrain, and KSA. As pioneers in the e-commerce realm, we take pride in being one of the oldest and most trusted names in the industry.</div>
                <div className="aboutus-discription">

                    At Ourshopee.com, we curate a captivating collection of top-quality products, carefully handpicked to cater to your every desire. From the latest electronics that spark innovation to the trendiest fashion that sets new standards, we have something for everyone, all within the comfort of your fingertips.</div>
                <div className="aboutus-discription">Our commitment to excellence is unwavering, and our user-friendly interface ensures a seamless and enjoyable shopping experience. Feel secure with our range of trusted payment options and embrace the excitement of swift and reliable deliveries right to your doorstep.</div>
                <div className="aboutus-discription">Join the millions of satisfied customers who have embarked on an extraordinary journey with Ourshopee.com. Discover the joy of shopping with us, where convenience meets trust, and let your shopping dreams soar. Begin your delightful retail adventure today - Happy shopping!</div>
            </div>
            <div className="ourjourny">
                <div className="aboutus-title">Ourshopee Journey</div>
                <div className="single_banner pt-4">
                    <img src={'assets/banners/aboutmap.png'} />
                </div>
            </div>
            <Row className="mt-4">
                <Col lg={6} md={6} sm={12} className="mb-4 ">
                    <div className="about-us-twobanner">
                        <div className="aboutus-twobanner-title">Visions</div>
                        <div className="aboutus-twobanner-subtitle">Our vision is to become a globally trusted e-commerce platform where customer needs are fulfilled</div>
                    </div>
                </Col>
                <Col lg={6} md={6} sm={12} className="mb-4 ">
                    <div className="about-us-twobanner">
                        <div className="aboutus-twobanner-title">Missions</div>
                        <div className="aboutus-twobanner-subtitle">Our mission is to ensure customer satisfaction through faster delivery of genuine products at competitive prices & round the clock services</div>
                    </div>
                </Col>
            </Row>
            <Row className="mt-4 factors">
                <div className="fcatortitle">
                    {
                        isMobile ?
                            <img src={'assets/banners/mobilefactror.png'} /> :
                            <img src={'assets/banners/factors.png'} />

                    }

                    {/* <div className="foutfactor-title">The </div>
                    <div className="fourtitle" >4</div>
                    <div className="foutfactor-title">factors <br></br>
                    that inspire</div> */}
                </div>
                <Col lg={6} md={6} sm={12} className="mb-4">
                    <div className="about-factors about-factorbackground">
                        <div className="about-factorcont">1</div>
                        <div className="about-us-factors-comp">
                            <div className="aboutus-factor-title">Quick Market Acquisition</div>
                            <div className="aboutus-twobanner-subtitle">Since its birth in UAE 6 years ago, the brand has penetrated Oman, Qatar, Bahrain & Kuwait. Every market is served by a localized app</div>
                        </div>
                    </div>
                </Col>
                <Col lg={6} md={6} sm={12} className="mb-4">
                    <div className="about-factors about-factorbackground">
                        <div className="about-factorcont">2</div>
                        <div className="about-us-factors-comp">
                            <div className="aboutus-factor-title">E-fulfillment Centers</div>
                            <div className="aboutus-twobanner-subtitle">Ourshopee will directly control inventory & logistic management to ensure maximum efficiency</div>
                        </div>
                    </div>
                </Col>
                <Col lg={6} md={6} sm={12} className="mb-4 ">
                    <div className="about-factors about-factorbackground">
                        <div className="about-factorcont">3</div>
                        <div className="about-us-factors-comp">
                            <div className="aboutus-factor-title">BNPL Support</div>
                            <div className="aboutus-twobanner-subtitle">BNPL is a tech-enabled payment system where "Buy Now Pay later" is the key and, that too comes with zero interest or cost.</div>
                        </div>
                    </div>
                </Col>
                <Col lg={6} md={6} sm={12} className="mb-4 ">
                    <div className="about-factors about-factorbackground">
                        <div className="about-factorcont">4</div>
                        <div className="about-us-factors-comp">
                            <div className="aboutus-factor-title">Trusted Ancillary Business</div>
                            <div className="aboutus-twobanner-subtitle">Branding out product centered ventures such as Elony Electronics</div>
                        </div>
                    </div>
                </Col>

            </Row>
            <Row className="mt-4 fivecomponet fivebannerbackground">
                <div className="aboutus-title">Ourshopee Journey</div>
                <Col lg={4} md={4} sm={12} className="mb-4 ">
                    <div className="about-fivecomponet-comp  about-fivecomponet-compcard">
                        <div className="aboutus-factor-title">Customer first</div>
                        <div className="aboutus-twobanner-subtitle">We look at the world from our customers point of view</div>
                    </div>
                </Col>
                <Col lg={4} md={4} sm={12} className="mb-4">
                    <div className="about-fivecomponet-comp  about-fivecomponet-compcard">
                        <div className="aboutus-factor-title">Integrity</div>
                        <div className="aboutus-twobanner-subtitle">We strive to do what is right and do what we say we will do.</div>
                    </div>
                </Col>
                <Col lg={4} md={4} sm={12} className="mb-4">
                    <div className="about-fivecomponet-comp  about-fivecomponet-compcard">
                        <div className="aboutus-factor-title">Inclusion</div>
                        <div className="aboutus-twobanner-subtitle">We value the uniqueness in everyone, respect differences, and foster a sense of belonging</div>
                    </div>
                </Col>
                <Col lg={6} md={6} sm={12} className="mb-4">
                    <div className="about-fivecomponet-comp  about-fivecomponet-compcard">
                        <div className="aboutus-factor-title">Bias for Action</div>
                        <div className="aboutus-twobanner-subtitle">We have a strong sense of urgency to solve
                            problems strategically</div>
                    </div>
                </Col>
                <Col lg={6} md={6} sm={12} className="mb-4">
                    <div className="about-fivecomponet-comp  about-fivecomponet-compcard">
                        <div className="aboutus-factor-title">Audacity</div>
                        <div className="aboutus-twobanner-subtitle">We think big and take bold bets. We change the paradigm.</div>
                    </div>
                </Col>


            </Row>
            <Row className="mt-4 ceocomponent fivebannerbackground">
                <Col lg={3} md={6} sm={12}>
                    <img className="ceoimg" src={'assets/banners/ceo.png'} />
                </Col>
                <Col lg={9} md={6} sm={12}>
                    <div className="ceoname">Dr. Shanith Mangalat</div>
                    <div className="aboutceo">Founder & Chairman</div>
                    <div className="aboutceo-discription">Dr. Shanith Mangalat is Chairman of DRS holding based in UAE, with Investments in more than 29 operating companies with aggregate annual revenues of more than USD 100 Million. He chairs the boards of several group operating companies, including ourshopee online store, hnc healthcare group, Ruky Perfumes, Medco pharmaceutical distributors. The DRS holding companies include 29 private listed corporates<br></br>
                        Dr.Shanith Mangalat is an MBBS Graduate from Yenepoya University, Mangalore, and specialist studies in Family Medicine/ Doctorate of Medicine and Post Graduated in Diabetology from India’s prestigious Apollo hospitals, Hyderabad. His business leadership has been recognized by several corporate & community organizations and he has received numerous awards, including</div>
                    <Row className="mt-4 Ceo-main">
                        <div className="Ceo-main-title">
                        <img className="medalimg" src={'assets/banners/Medal.png'} />
                        Achievement's</div>
                        <Col lg={4} md={4} sm={12} className="mb-4 ">
                            <div className="about-ceo-card">
                                <div className="aboutus-ceo-title">Global Leadership Award 2019,2023</div>
                                <div className="aboutus-ceo-subtitle">By American leadership Development Association (ALDA) and Leaders Magazine, Malaysia</div>
                            </div>
                        </Col>
                        <Col lg={4} md={4} sm={12} className="mb-4 ">
                            <div className="about-ceo-card">
                                <div className="aboutus-ceo-title">Asian Business Award 2019</div>
                                <div className="aboutus-ceo-subtitle">By Arab chamber of commerce Hyderabad</div>
                            </div>
                        </Col>
                        <Col lg={4} md={4} sm={12} className="mb-4 ">
                            <div className="about-ceo-card">
                                <div className="aboutus-ceo-title">Regal British Award 2019</div>
                                <div className="aboutus-ceo-subtitle">from World Humanitarian Drive, UK</div>
                            </div>
                        </Col>
                        <Col lg={4} md={4} sm={12} className="mb-4 ">
                            <div className="about-ceo-card">
                                <div className="aboutus-ceo-title">Beat Health Care Brand, Golden Achievements Awards</div>
                                <div className="aboutus-ceo-subtitle">Dubai 5th Edition 2018</div>
                            </div>
                        </Col>
                        <Col lg={4} md={4} sm={12} className="mb-4 ">
                            <div className="about-ceo-card">
                                <div className="aboutus-ceo-title">Best Health Care Brand Award</div>
                                <div className="aboutus-ceo-subtitle">By Middle East Chandrika 2018</div>
                            </div>
                        </Col>
                        <Col lg={4} md={4} sm={12} className="mb-4 ">
                            <div className="about-ceo-card">
                                <div className="aboutus-ceo-title">Young Indian Visionary award 2017</div>
                                <div className="aboutus-ceo-subtitle">By IMG</div>
                            </div>
                        </Col>
                       
                    </Row>

                </Col>
            </Row>

        </Container>
    )
}
export default Aboutus;