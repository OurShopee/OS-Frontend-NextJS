"use client"
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import BreadComp from "@/components/Myaccount/BreadComp";
import appstore from "@/images/appstore.png";
import playstore from "@/images/playstore.png";
import Link from "next/link";
const Contactus = () => {
    const currentcountry = useSelector((state) => state.globalslice.currentcountry);

    return (
      <div>
        <Container fluid className="homepagecontainer">
          <div className="mt-2 ">
            <BreadComp title={"Contact Us"} />
          </div>
          <div className="footerpagesheader">Contact Us</div>

          <Row className="pb-4">
            <Col lg={6} className="contactmap">
              <div className="map-section">
                <div className="contactus-title">Map Location</div>
                <iframe
                  title="map"
                  src="https://maps.google.com/maps?q=Al%20Quoz%20Industrial%20Area%203&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            </Col>
            <Col lg={6}>
              <div className="info-section">
                <div className="contactus-title">Reach us</div>
                <div className="pt-2 pb-2">
                  <div className="contact-titles">Phone:</div>
                  <div className="contact-discription">
                    {currentcountry.helpline_numbers.hotline}
                  </div>
                </div>
                <div className="pt-2 pb-2">
                  <div className="contact-titles">Email:</div>
                  <div className="contact-discription">
                    support@ourshopee.com
                  </div>
                </div>
                <div className="pt-2 pb-2">
                  <div className="contact-titles">Address:</div>
                  <div className="contact-discription">
                    {currentcountry.helpline_numbers.address}
                  </div>
                </div>
              </div>
              <div className="app-section">
                <div className="contactus-title">Download Our App</div>
                <div className="store-buttons">
                  <Link
                    href="https://play.google.com/store/apps/details?id=www.ourshopee.com"
                    target="_blank"
                  >
                    <img src={playstore.src} alt="Google Play" />
                  </Link>
                  <Link
                    href="https://apps.apple.com/us/app/ourshopee-online-shopping/id1226954989"
                    target="_blank"
                  >
                    <img src={appstore.src} alt="App Store" />
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
}
export default Contactus;