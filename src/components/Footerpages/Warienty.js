import React from "react";
import starimg from "@/images/Sta 5r.png";
import { Container } from "react-bootstrap";
import BreadComp from "@/components/Myaccount/BreadComp";

const WarrantyReturnPolicy = () => {
  return (
    <Container fluid className="homepagecontainer">
      <div className="mt-2">
        <BreadComp title={"Warranty & Return Policy"} />
      </div>

      <div className="footerpagesheader">Warranty & Return Policy</div>

      {/* General Policy */}
      <div className="privacy-policy-min-titles">
        <img className="starimg" src={starimg.src} alt="star" />
        General Policy
      </div>
      <div className="privacy-discription">
        Applicable only for products with technical issues within the warranty period. For damaged products, customers must raise a complaint within 24 hours of delivery.
        No refund or exchange will be accepted if the product has no issues.
        Refunds are only processed for the product price—delivery and processing fees are non-refundable.
      </div>

      {/* Customer Satisfaction */}
      <div className="footerpage-boderbottem"></div>
      <div className="privacy-policy-min-titles">
        <img className="starimg" src={starimg} alt="star" />
        Customer Satisfaction Policy
      </div>
      <div className="privacy-discription">
        <ul>
          <li className="policylist">Replacement/Exchange: within 7 days</li>
          <li className="policylist">Refund: within 3 days</li>
          <li className="policylist">Restocking Fee: Yes</li>
        </ul>
      </div>

      {/* Promotions & Deals */}
      <div className="footerpage-boderbottem"></div>
      <div className="privacy-policy-min-titles">
        <img className="starimg" src={starimg} alt="star" />
        Promotional & Discount Products
      </div>
      <div className="privacy-discription">
        <ul>
          <li className="policylist">Replacement: Not allowed</li>
          <li className="policylist">Refund: within 24 hours</li>
          <li className="policylist">Restocking Fee: Yes</li>
        </ul>
        No warranty or return accepted beyond the allowed 24-hour period.
      </div>

      {/* Mobile Phones (Warrantied) */}
      <div className="footerpage-boderbottem"></div>
      <div className="privacy-policy-min-titles">
        <img className="starimg" src={starimg} alt="star" />
        Mobile Phones & Smartphones (Warrantied Models Only)
      </div>
      <div className="privacy-discription">
        <ul>
          <li className="policylist">Replacement: within 7 days (unopened, new)</li>
          <li className="policylist">Refund: within 3 days (unopened, full box contents, complaint within 24hrs)</li>
          <li className="policylist">Warranty: As per invoice</li>
          <li className="policylist">Pickup/Drop: Free within 7 days (UAE only)</li>
        </ul>
        Restocking Fee applies. No warranty assumed if not mentioned on the invoice.
      </div>

      {/* Non-Acceptable Conditions */}
      <div className="footerpage-boderbottem"></div>
      <div className="privacy-policy-min-titles">
        <img className="starimg" src={starimg} alt="star" />
        Conditions Not Accepted for Return/Warranty
      </div>
      <div className="privacy-discription">
        <ul>
          <li className="policylist">Physical damage</li>
          <li className="policylist">Missing manufacturer labels or accessories</li>
          <li className="policylist">No invoice proof</li>
          <li className="policylist">Violation of manufacturer or customer satisfaction policies</li>
        </ul>
      </div>

      {/* Tablets, Laptops, Cameras, Refurbished */}
      <div className="footerpage-boderbottem"></div>
      <div className="privacy-discription">
        Similar policies apply to Tablets, Laptops, Netbooks, Desktops, and Cameras as mentioned above with respective replacement/refund periods and warranty conditions. Non-warrantied models and health/beauty products are **not eligible** for return, replacement, or warranty.
      </div>

      <div className="footerpage-boderbottem"></div>
    </Container>
  );
};

export default WarrantyReturnPolicy;
