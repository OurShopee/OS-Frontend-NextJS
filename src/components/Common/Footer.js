"use client"
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import { useSelector } from "react-redux";
import { SiMinutemailer } from "react-icons/si";
import { TiSocialInstagram } from "react-icons/ti";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { AiFillTwitterCircle } from "react-icons/ai";

// Import your images - place these in the public folder
import footerlogo from "@/images/Logo.png";
import appstore from "@/images/appstore.png";
import playstore from "@/images/playstore.png";
import ConsumerRights from "@/images/ConsumerRights.png";
import Footerbottomimg1 from "@/images/footerbottem4.png";
import Footerbottomimg2 from "@/images/footerboottom(1).png";
import Footerbottomimg3 from "@/images/footerboottom (2).png";
import Footerbottomimg4 from "@/images/footerboottom(3).png";

// Custom NavLink component for Next.js App Router
const NavLink = ({ href, children, className, ...props }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} {...props}>
      <span className={`${className} ${isActive ? "active" : ""}`}>
        {children}
      </span>
    </Link>
  );
};

const Footer = () => {
  const isBigScreen = useMediaQuery({ query: "(min-width: 991px)" });
  const footerdata = useSelector((state) => state.globalslice.data);
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );

  return (
    <>
      <div className="footermain primarybackground">
        <Container fluid>
          <Row>
            <Col lg={3}>
              <Image src={footerlogo} alt="Footer Logo" />
              <div className="footer-discription">
                UAE and Beyond! Established in 2015, Ourshopee.com has proudly
                established itself as a prominent and rapidly growing online
                shopping platform in the region...
              </div>
              <div>
                <Image src={ConsumerRights} alt="Consumer Rights" />
                {isBigScreen && (
                  <>
                    <div className="footer-titles">Connect with us</div>
                    <div className="d-flex footercontactus">
                      <input
                        type="text"
                        placeholder="Enter Your Mail"
                        className="header-inputbox"
                      />
                      <div className="header-search secondarybackground">
                        <SiMinutemailer />
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="footer-titles">Keep in Touch</div>
              <div className="d-flex">
                <Link
                  href={currentcountry?.fb_link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebookF className="footer-contact-icon" />
                </Link>
                <Link
                  href="https://x.com/ourshopee/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter className="footer-contact-icon" />
                </Link>
                <Link
                  href="https://www.linkedin.com/company/ourshopee-com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedinIn className="footer-contact-icon" />
                </Link>
                <Link
                  href={currentcountry?.insta_link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TiSocialInstagram className="footer-contact-icon" />
                </Link>
                <Link
                  href="https://www.youtube.com/@Ourshopee_ae"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaYoutube className="footer-contact-icon" />
                </Link>
              </div>
            </Col>

            <Col lg={2} md={4} sm={6} xs={6}>
              <div className="footerlink-titles">Online Shopping</div>
              <div className="footer-pages-main">
                {footerdata &&
                  footerdata.length > 0 &&
                  footerdata.slice(0, 10).map((ele) => (
                    <NavLink
                      href={`/categories/${ele.url}`}
                      className="footerlinks text-decoration-none"
                      key={ele.category_id}
                    >
                      {ele.category_name}
                    </NavLink>
                  ))}
              </div>
            </Col>

            <Col lg={2} md={4} sm={6} xs={6} className="footer-pages-main">
              <div className="footerlink-titles">Customer Policies</div>
              <NavLink
                href="/aboutus"
                className="footerlinks textdecoration-none"
              >
                About Ourshopee
              </NavLink>
              <NavLink
                href="/contactus"
                className="footerlinks textdecoration-none"
              >
                Contact Us
              </NavLink>
              <NavLink
                href="/blogs"
                className="footerlinks textdecoration-none"
              >
                Our Blog
              </NavLink>
              <NavLink
                href="/terms-and-conditions"
                className="footerlinks textdecoration-none"
              >
                Terms and Conditions
              </NavLink>
              <NavLink href="/faqs" className="footerlinks textdecoration-none">
                FAQs
              </NavLink>
              <NavLink
                href="/privacy-policy"
                className="footerlinks textdecoration-none"
              >
                Privacy Policy
              </NavLink>
            </Col>

            <Col lg={2} md={4} sm={6} xs={6} className="footer-pages-main">
              <div className="footerlink-titles">Useful Links</div>
              <NavLink
                href="/sitemap"
                className="footerlinks textdecoration-none"
              >
                Site Map
              </NavLink>
              <NavLink
                href="/sell-with-us"
                className="footerlinks textdecoration-none"
              >
                Sell With Us
              </NavLink>
              <NavLink
                href="/affiliate-program"
                className="footerlinks textdecoration-none"
              >
                Affiliate Program
              </NavLink>
            </Col>

            {!isBigScreen && (
              <Col md={6} sm={6} xs={9}>
                <div className="footer-titles">Connect with us</div>
                <div className="d-flex footercontactus">
                  <input
                    type="text"
                    placeholder="Enter Your Mail"
                    className="header-inputbox"
                  />
                  <div className="header-search secondarybackground">
                    <SiMinutemailer />
                  </div>
                </div>
              </Col>
            )}

            <Col lg={3} md={4} sm={6} xs={12}>
              <div>
                <div className="footerlink-titles">24/7 Customer Support</div>
                <div className="footer-discription">
                  Ourshopee support team is hard working 24/7 for our customers.
                  We give high priority to troubleshoot and sort out all the
                  complaints and issues of our customers.
                </div>
                <div className="footerlink-titles">
                  We're always here to help you
                </div>
                <div className="footer-discription">
                  Reach out to us through any of these support channels
                </div>
                <div className="footercontact-titles">
                  Hotline:{" "}
                  <span className="footercontact">
                    {currentcountry?.helpline_numbers?.hotline}
                  </span>
                </div>
                <div className="footercontact-titles">
                  WhatsApp:{" "}
                  <span className="footercontact">
                    {currentcountry?.helpline_numbers?.whatsapp}
                  </span>
                </div>
                <div className="footercontact-titles">
                  E-mail:{" "}
                  <span className="footercontact">support@ourshopee.com</span>
                </div>
              </div>
              <div className="footer-applinks-main">
                <div className="footerlink-titles mobilegrtapptitle mobileapplinks">
                  Get App
                </div>
                <div className="mobileapplinks">
                  <Link
                    href="https://apps.apple.com/us/app/ourshopee-online-shopping/id1226954989"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={appstore}
                      className="pb-2 applinks"
                      alt="App Store"
                    />
                  </Link>
                </div>
                <div className="mobileapplinks">
                  <Link
                    href="https://play.google.com/store/apps/details?id=www.ourshopee.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={playstore}
                      className="pb-2 applinks"
                      alt="Play Store"
                    />
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <div className="footercopyrights">
        <Container fluid>
          <Row>
            {!isBigScreen && (
              <Col lg={6} md={6} sm={12}>
                <div>
                  <Image
                    className="pe-2"
                    src={Footerbottomimg1}
                    alt="Footer Bottom 1"
                  />
                  <Image
                    className="pe-2"
                    src={Footerbottomimg2}
                    alt="Footer Bottom 2"
                  />
                  <Image
                    className="pe-2"
                    src={Footerbottomimg3}
                    alt="Footer Bottom 3"
                  />
                  <Image
                    className="pe-2"
                    src={Footerbottomimg4}
                    alt="Footer Bottom 4"
                  />
                </div>
              </Col>
            )}
            <Col lg={6} md={6} sm={12}>
              <div className="copyright-contant">
                © Copyright 2025 [www.ourshopee.com](https://www.ourshopee.com).
                All rights reserved.
              </div>
            </Col>
            {isBigScreen && (
              <Col lg={6} md={6} sm={12}>
                <div className="footerbottom">
                  <Image
                    className="pe-2"
                    src={Footerbottomimg1}
                    alt="Footer Bottom 1"
                  />
                  <Image
                    className="pe-2"
                    src={Footerbottomimg2}
                    alt="Footer Bottom 2"
                  />
                  <Image
                    className="pe-2"
                    src={Footerbottomimg3}
                    alt="Footer Bottom 3"
                  />
                  <Image
                    className="pe-2"
                    src={Footerbottomimg4}
                    alt="Footer Bottom 4"
                  />
                </div>
              </Col>
            )}
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Footer;
