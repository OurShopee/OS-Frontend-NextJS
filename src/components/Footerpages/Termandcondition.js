import React, { memo } from "react";
import { Container } from "react-bootstrap";
import BreadComp from "../../components/Myaccount/BreadComp";
import starimg from "@/images/Sta5r.png";
import Link from "next/link";

const Section = memo(function Section({ title, children }) {
    return (
        <section className="footer-section">
            <div className="privacy-policy-min-titles">
                <img
                    className="starimg"
                    src={starimg.src}
                    alt="decorative star"
                    loading="lazy"
                />
                {title}
            </div>
            {children}
            <div className="footerpage-boderbottem"></div>
        </section>
    );
});

const sectionsData = [
    {
        key: "about",
        title: "About OurShopee",
        content: (
            <p className="privacy-discription">
                OurShopee Group operates an e-commerce platform serving customers across the GCC. We provide a range of new and pre-owned products through our official website and mobile application.
                <br />
                By using our Platform, you agree that all purchases, deliveries, returns, and service interactions are governed by these Terms, our Return & Replacement Policy, and our Privacy Policy.
            </p>
        ),
    },
    {
        key: "ordering",
        title: "Ordering and Payment",
        content: (
            <>
                <div className="privacy-discription">
                    Orders may be placed directly through our website or mobile app. Payment methods include prepaid options (credit/debit card, wallet credit), cash on delivery (COD), and installments via Tabby/ Tamara (UAE only).
                </div>
                <div className="p-2" />
                <div className="privacy-discription">
                    <b>We reserve the right to:</b>
                </div>
                <ul>
                    <li className="policylist">
                        Accept or decline any order at our discretion.
                    </li>
                    <li className="policylist">
                        Cancel or modify orders in case of pricing or stock errors, payment verification issues, or suspected fraudulent activity.
                    </li>
                </ul>
                <div className="privacy-discription">
                    Customers may not cancel an order once it has been dispatched.
                </div>
            </>
        ),
    },
    {
        key: "cod",
        title: "Cash on Delivery (COD)",
        content: (
            <div className="privacy-discription">
                COD is available only within eligible regions and may be subject to order-value limits that can change without prior notice. We do not charge additional fees for COD orders.
                <br />
                Repeated order rejections or misuse of COD service may result in restriction or suspension of the customer’s account.
            </div>
        ),
    },
    {
        key: "shipping",
        title: "Shipping and Delivery",
        content: (
            <div className="privacy-discription">
                Deliveries are handled through a mix of in-house logistics and trusted third-party couriers, depending on region. Estimated delivery times vary by location and product type.
                <br />
                Risk of loss or damage transfers to the customer once the order is delivered to the registered address. OurShopee is not responsible for delays caused by courier partners, customs, or unforeseen circumstances.
            </div>
        ),
    },
    {
        key: "returns",
        title: "Returns, Replacements & Refunds",
        content: (
            <div className="privacy-discription">
                Our return and refund process is governed by our dedicated&nbsp;
                <Link
                    href="/return-and-replacement-policy"
                    className="footerlinks !underline text-primary"
                >
                    Return & Replacement Policy
                </Link>
                &nbsp;page.
                <br />
                You can request a return within seven (7) days of receiving your order, subject to eligibility conditions listed in that policy.
                <br />
                Refunds are processed within seven (7) business days of inspection and approval, using the same payment channel where possible or via wallet credit.
                <br />
                For full details on timelines, non-returnable items, and warranty coverage, please refer to the official Return & Replacement Policy available on our website.
            </div>
        ),
    },
    {
        key: "preowned",
        title: "Pre-Owned Product Authenticity",
        content: (
            <div className="privacy-discription">
                Pre-Owned items listed on OurShopee are verified and tested by our quality-control team before sale. These items may show minimal signs of previous use but are guaranteed to be functional.
                <br />
                All pre-owned products come with warranty coverage as described in the Return & Replacement Policy. Customers acknowledge that cosmetic differences from new products do not constitute defects.
            </div>
        ),
    },
    {
        key: "pricing",
        title: "Pricing, Promotions & Offers",
        content: (
            <div className="privacy-discription">
                Prices and promotions on OurShopee are subject to change without prior notice.
                If a product is listed at an incorrect price or with an error in details due to human or technical mistake, we reserve the right to cancel, modify, or refuse any such order.
                <br />
                Offers, coupon codes, and promotional campaigns are limited-time and cannot be combined unless explicitly stated. Some offers may apply exclusively to prepaid purchases.
            </div>
        ),
    },
    {
        key: "accounts",
        title: "User Accounts and Guest Checkout",
        content: (
            <div className="privacy-discription">
                Customers may shop as guests or by creating an account. If you choose to register, you are responsible for maintaining the confidentiality of your login credentials and ensuring all information provided is accurate and up to date.
                <br />
                OurShopee reserves the right to suspend or terminate accounts engaged in fraudulent activity, misuse, or violation of these Terms.
            </div>
        ),
    },
    {
        key: "reviews",
        title: "Content and Customer Reviews",
        content: (
            <div className="privacy-discription">
                We may allow customers to submit reviews, photos, or feedback. By doing so, you grant OurShopee a non-exclusive, royalty-free license to use this content for promotional and marketing purposes across any medium.
                <br />
                Submitted content must be lawful, original, and respectful. We reserve the right to remove content that violates these standards.
            </div>
        ),
    },
    {
        key: "liability",
        title: "Limitation of Liability",
        content: (
            <div className="privacy-discription">
                To the maximum extent permitted by law, OurShopee Trading LLC shall not be liable for any indirect, incidental, or consequential damages, including loss of profits, data, or business opportunities, arising from your use of our Platform or purchase of products.
                <br />
                Our total liability for any claim related to an order shall not exceed the total value paid for that order.
                <br />
                We are not responsible for delays, interruptions, or issues caused by third-party service providers, couriers, payment gateways, or external factors beyond our control.
            </div>
        ),
    },
    {
        key: "law",
        title: "Governing Law & Jurisdiction",
        content: (
            <div className="privacy-discription">
                These Terms are governed by the applicable laws of the country where the purchase is made. In the event of any conflict, UAE law shall prevail. Disputes will be subject to the jurisdiction of competent courts within the applicable region.
            </div>
        ),
    },
    {
        key: "updates",
        title: "Updates to These Terms",
        content: (
            <div className="privacy-discription">
                We may update or revise these Terms at any time without prior notice. Updates will be published on this page, and continued use of our Platform after such updates constitutes your acceptance of the revised Terms.
                <br />
                We encourage you to review this page periodically to stay informed of any changes.
            </div>
        ),
    },
    {
        key: "contact",
        title: "Contact Information",
        content: (
            <>
                <div className="privacy-discription">
                    For questions, complaints, or assistance, reach out to us through:
                    <br />
                </div>
                <ul>
                    <li className="policylist">
                        <b>Hotline:</b> (+971) 4 412 0000
                    </li>
                    <li className="policylist">
                        <b>WhatsApp:</b> (+971) 521 881 678
                    </li>
                    <li className="policylist">
                        <b>Email: </b>
                        <a className="underline text-primary" href="mailto:support@ourshopee.com">support@ourshopee.com</a>
                    </li>
                    <li className="policylist">
                        <b>Support Hours:</b> 11 AM – 8 PM, seven days a week
                    </li>
                </ul>
            </>
        ),
    },
    {
        key: "signature",
        title: "OurShopee Trading LLC",
        content: (
            <>
                <div className="privacy-discription">
                    <b>Your trusted online store across the GCC —</b>
                </div>
                <i>Fast Delivery • Secure Payments • Hassle-Free Returns</i>
                <div className="p-2" />
            </>
        ),
    },
];

const Termandcondition = () => {
    return (
        <Container fluid className="homepagecontainer">
            <div className="mt-2">
                <BreadComp title={" Terms & Conditions"} />
            </div>

            <div className="footerpagesheader">Terms & Conditions</div>

            {sectionsData.map(({ key, title, content }) => (
                <Section key={key} title={title}>
                    {content}
                </Section>
            ))}
        </Container>
    );
};

export default Termandcondition;