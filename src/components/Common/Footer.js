"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { SiMinutemailer } from "react-icons/si";
import { TiSocialInstagram } from "react-icons/ti";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useContent } from "@/hooks";

import ConsumerRights from "@/images/ConsumerRights.png";
import footerlogo from "@/images/Logo.svg";
import appstore from "@/images/appstore.png";
import Footerbottomimg2 from "@/images/footer-cash.png";
import Footerbottomimg4 from "@/images/footer-master.png";
import Footerbottomimg3 from "@/images/footer-tabby.png";
import Footerbottomimg1 from "@/images/footer-visa.png";
import playstore from "@/images/playstore.png";

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

  // Language content
  const aboutCompany = useContent("footer.aboutCompany");
  const connectWithUs = useContent("footer.connectWithUs");
  const enterYourMail = useContent("footer.enterYourMail");
  const keepInTouch = useContent("footer.keepInTouch");
  const customerService = useContent("footer.customerService");
  const quickLinks = useContent("footer.quickLinks");
  const information = useContent("footer.information");
  const aboutUs = useContent("footer.aboutUs");
  const contactUs = useContent("footer.contactUs");
  const faqs = useContent("footer.faqs");
  const privacyPolicy = useContent("footer.privacyPolicy");
  const termsAndConditions = useContent("footer.termsAndConditions");
  const returnPolicy = useContent("footer.returnPolicy");
  const returnAndReplacementPolicy = useContent(
    "footer.returnAndReplacementPolicy"
  );
  const sitemap = useContent("footer.sitemap");
  const affiliateProgram = useContent("footer.affiliateProgram");
  const sellWithUs = useContent("footer.sellWithUs");
  const trackYourOrder = useContent("footer.trackYourOrder");
  const changePassword = useContent("footer.changePassword");
  const deliveryAddress = useContent("footer.deliveryAddress");

  return (
    <div className="">
      <div className="footermain primarybackground px-4">
        <div className="container">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-3">
              <img src={footerlogo.src} alt="Footer Logo" />
              <div className="footer-discription">{aboutCompany}</div>
              <div>
                <img
                  src={ConsumerRights.src}
                  alt="Consumer Rights"
                  className="w-20"
                />
                {isBigScreen && (
                  <>
                    <div className="footer-titles">{connectWithUs}</div>
                    <div className="flex footercontactus">
                      <input
                        type="text"
                        placeholder={enterYourMail}
                        className="header-inputbox"
                      />
                      <div className="header-search secondarybackground">
                        <SiMinutemailer />
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="footer-titles">{keepInTouch}</div>
              <div className="flex">
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
            </div>

            <div className="col-span-6 sm:col-span-6 md:col-span-4 lg:col-span-2">
              <div className="footerlink-titles">Online Shopping</div>
              <div className="footer-pages-main">
                {footerdata &&
                  footerdata.length > 0 &&
                  footerdata.slice(0, 10).map((ele) => (
                    <NavLink
                      href={`/categories/${ele.url}`}
                      className="footerlinks no-underline"
                      key={ele.category_id}
                    >
                      {ele.category_name}
                    </NavLink>
                  ))}
              </div>
            </div>

            <div className="col-span-6 sm:col-span-6 md:col-span-4 lg:col-span-2 footer-pages-main">
              <div className="footerlink-titles">Customer Policies</div>
              <NavLink href="/aboutus" className="footerlinks no-underline">
                {aboutUs}
              </NavLink>
              <NavLink href="/contactus" className="footerlinks no-underline">
                {contactUs}
              </NavLink>
              <NavLink href="/blogs" className="footerlinks no-underline">
                Our Blog
              </NavLink>
              <NavLink
                href="/terms-and-conditions"
                className="footerlinks no-underline"
              >
                {termsAndConditions}
              </NavLink>
              <NavLink href="/faqs" className="footerlinks no-underline">
                {faqs}
              </NavLink>
              <NavLink
                href="/privacy-policy"
                className="footerlinks no-underline"
              >
                {privacyPolicy}
              </NavLink>
              <NavLink
                href="/return-and-replacement-policy"
                className="footerlinks textdecoration-none"
              >
                {returnAndReplacementPolicy}
              </NavLink>
            </div>

            <div className="col-span-6 sm:col-span-6 md:col-span-4 lg:col-span-2 footer-pages-main">
              <div className="footerlink-titles">Useful Links</div>
              <NavLink href="/sitemap" className="footerlinks no-underline">
                {sitemap}
              </NavLink>
              <NavLink
                href="/sell-with-us"
                className="footerlinks no-underline"
              >
                {sellWithUs}
              </NavLink>
              <NavLink
                href="/affiliate-program"
                className="footerlinks no-underline"
              >
                {affiliateProgram}
              </NavLink>
            </div>

            {!isBigScreen && (
              <div className="col-span-9 sm:col-span-6 md:col-span-6">
                <div className="footer-titles">{connectWithUs}</div>
                <div className="flex footercontactus">
                  <input
                    type="text"
                    placeholder={enterYourMail}
                    className="header-inputbox"
                  />
                  <div className="header-search secondarybackground">
                    <SiMinutemailer />
                  </div>
                </div>
              </div>
            )}

            <div className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
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
                    <img
                      src={appstore.src}
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
                    <img
                      src={playstore.src}
                      className="pb-2 applinks"
                      alt="Play Store"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footercopyrights">
        <div className="container">
          <div className="grid grid-cols-12 gap-4">
            {!isBigScreen && (
              <div className="flex col-span-12 sm:col-span-12 md:col-span-6 lg:col-span-6">
                <img
                  className="pr-2 w-10"
                  src={Footerbottomimg1.src}
                  alt="Footer Bottom 1"
                />
                <img
                  className="pr-2 w-10"
                  src={Footerbottomimg2.src}
                  alt="Footer Bottom 2"
                />
                <img
                  className="pr-2 w-10"
                  src={Footerbottomimg3.src}
                  alt="Footer Bottom 3"
                />
                <img
                  className="pr-2 w-10"
                  src={Footerbottomimg4.src}
                  alt="Footer Bottom 4"
                />
              </div>
            )}
            <div className="col-span-12 sm:col-span-12 md:col-span-6 lg:col-span-6">
              <div className="copyright-contant">
                © Copyright 2025 www.{window.location.hostname}. All rights
                reserved.
              </div>
            </div>
            {isBigScreen && (
              <div className="col-span-12 sm:col-span-12 md:col-span-6 lg:col-span-6">
                <div className="footerbottom">
                  <img
                    className="pr-2 w-10"
                    src={Footerbottomimg1.src}
                    alt="Footer Bottom 1"
                  />
                  <img
                    className="pr-2 w-10"
                    src={Footerbottomimg2.src}
                    alt="Footer Bottom 2"
                  />
                  <img
                    className="pr-2 w-10"
                    src={Footerbottomimg3.src}
                    alt="Footer Bottom 3"
                  />
                  <img
                    className="pr-2 w-10"
                    src={Footerbottomimg4.src}
                    alt="Footer Bottom 4"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
