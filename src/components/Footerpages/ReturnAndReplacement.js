import React, { memo } from "react";
import { Container } from "react-bootstrap";
import BreadComp from "../../components/Myaccount/BreadComp";
import starimg from "../../images/Sta5r.png";

const Section = memo(function Section({ title, children }) {
    return (
        <section className="footer-section">
            <div className="privacy-policy-min-titles">
                <img className="starimg" src={starimg.src} alt="decorative star" loading="lazy" />
                {title}
            </div>
            {children}
            <div className="footerpage-boderbottem"></div>
        </section>
    );
});

const introBlock = (
    <>
        <div className="privacytitle">Return and Replacement Policy</div>
        <div className="privacy-discription">
            At OurShopee, we want you to shop with confidence. If you’re not fully satisfied with your purchase, we’re here to help. If you are looking for how to raise a refund or a return, please proceed to this page Claims.
        </div>
        <div className="footerpage-boderbottem"></div>
    </>
);

const sectionsData = [
    {
        key: "eligibility",
        title: "Return Eligibility",
        content: (
            <>
                <div className="privacy-discription">
                    Thanks for shopping at Ourshopee. We appreciate the fact that you like to shop with us. We also want to make sure you have a rewarding experience while you’re exploring, evaluating, and purchasing our products.
                </div>
                <div className="privacy-discription">
                    As with any shopping experience, there are terms and conditions that apply to transactions at Ourshopee. We’ll be as brief as our attorneys will allow. The main thing to remember is that by placing an order via COD or making a purchase at Ourshopee website/app, you agree to the terms set forth below along with Return Policy.
                </div>
                <div className="privacy-discription">
                    You can request a return within 7 days of receiving your order if:
                </div>
                <ul>
                    <li className="policylist">The product is damaged, defective, or not as described</li>
                    <li className="policylist">You received a wrong or missing item</li>
                    <li className="policylist">The product is unused, in original packaging, and includes all accessories or manuals</li>
                </ul>
                <div className="privacy-discription">
                    Ourshopee reserves the right to reject a return request and return the product to the customer if it does not meet the return criteria outlined below.
                </div>
            </>
        ),
    },
    {
        key: "replacement",
        title: "Replacement Eligibility",
        content: (
            <>
                <div className="privacy-discription">
                    For product replacement, the customer must first hand over the original item before the replacement can be processed.
                </div>
                <div className="privacy-discription">
                    Basis inspection, our Agent will coordinate and arrange for a pickup in case of Replacement.
                </div>
                <div className="privacy-discription">
                    If a return request is declined by a customer, Ourshopee will attempt to deliver the product back to the customer twice using approved courier services.
                </div>
                <div className="privacy-discription">
                    If both delivery attempts are unsuccessful, Ourshopee will hold the product for three (3) business days at its delivery hub.
                </div>
                <div className="privacy-discription">
                    If later customers are still interested, RETURN FEE will apply if claimed back.
                </div>
                <div className="privacy-discription">
                    The total replacement process can take 7-15 days depending on customer coordination with our CS agent.
                </div>
                <div className="privacy-discription">
                    All replacements are processed in accordance with OurShopee’s Terms & Conditions
                </div>
            </>
        ),
    },
    {
        key: "nonreturnable",
        title: "Non-Returnable Items",
        content: (
            <>
                <div className="privacy-discription">The following items cannot be returned:</div>
                <ul>
                    <li className="policylist">
                        Categories like Toys & Games, Home Essentials, Kitchen & Dining, Clothing, Bags & Shoes, Home Furniture, Perfume, Health & Beauty.
                    </li>
                    <li className="policylist">Software, games, or digital products once opened or activated.</li>
                    <li className="policylist">Mother and Baby electronics products once opened.</li>
                    <li className="policylist">Items damaged due to misuse or wear and tear.</li>
                    <li className="policylist">Products without original packaging or serial numbers removed.</li>
                </ul>
                <div className="privacy-discription">
                    For Pre-Owned, you can return a product for a change of mind reason. We might still deduct a fee to compensate for operational expenses. This fee could be between 0 and 20% of the item price + shipping fees.
                </div>
            </>
        ),
    },
    {
        key: "request",
        title: "How to Request a Return/Replacement",
        content: (
            <>
                <div className="privacy-discription">You can reach out through any support channels like :</div>
                <ul>
                    <li className="policylist">Hotline - (971) 4 4120000</li>
                    <li className="policylist">Whatsapp - (971) 521881678</li>
                    <li className="policylist">
                        Email - <a href="mailto:support@ourshopee.com">support@ourshopee.com</a>
                    </li>
                </ul>
            </>
        ),
    },
    {
        key: "refund",
        title: "Refund Process (7 Days)",
        content: (
            <>
                <div className="privacy-discription">
                    Once the product is received and inspected, we’ll issue a refund based on your payment method:
                </div>
                <div className="privacy-discription">
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Payment Method</th>
                                    <th>Refund Method</th>
                                    <th>Refund Timeline</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Credit / Debit Card</td>
                                    <td>OurShopee Wallet/ Payment Gateway</td>
                                    <td>Within 7 business days</td>
                                </tr>
                                <tr>
                                    <td>Tabby / Tamara/ Other</td>
                                    <td>OurShopee Wallet/ Payment Gateway</td>
                                    <td>Within 7 business days</td>
                                </tr>
                                <tr>
                                    <td>Cash on Delivery</td>
                                    <td>OurShopee Wallet /Payment Gateway</td>
                                    <td>Within 7 business days</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        ),
    },
    {
        key: "regional",
        title: "Regional Policy",
        content: (
            <>
                <div className="privacy-discription">UAE: Payments via Tabby, Tamara, and Credit/Debit Cards are supported.</div>
                <div className="privacy-discription">
                    Oman, KSA, Qatar, Bahrain, Kuwait, KSA: Payments via Credit/Debit Card or COD. Refunds are processed through payment links or wallet credit.
                </div>
            </>
        ),
    },
    {
        key: "warranty",
        title: "Warranty Claims",
        content: (
            <>
                <div className="privacy-discription">Pre-Owned 1yr Warranty covered by Ourshopee.com.</div>
                <div className="privacy-discription">
                    Products covered under manufacturer warranty can be serviced or replaced as per brand, product terms. Categories: Sports, Fitness & Cycling, Mobiles & Tablets, Laptops & Computers, Gaming Console, Electronics, Cameras, Television & Accessories, Tools & Hardware Equipments, Watches - Branded, Baby & Mother care.
                </div>
                <div className="privacy-discription">
                    You can raise a warranty request by contacting our support team with your order ID and product details.
                </div>
                <div className="privacy-discription">If there is any physical damage, it is not covered in warranty.</div>
                <div className="privacy-discription">
                    We can offer A+ Service upon request; however, it will incur additional charges for the customer depending on the SKU.
                </div>
            </>
        ),
    },
    {
        key: "notes",
        title: "Important Notes",
        content: (
            <>
                <div className="privacy-discription">
                    For product replacement, the customer must first hand over the original item before the replacement can be processed.
                </div>
                <div className="privacy-discription">
                    Items returned will be approved by the Ourshoppe team before it is accepted.
                </div>
                <div className="privacy-discription">
                    Refund timelines may vary during public holidays or high-sale periods.
                </div>
                <div className="privacy-discription">
                    OurShopee reserves the right to reject returns that do not meet the above conditions.
                </div>
            </>
        ),
    },
    {
        key: "consent",
        title: "Your Consent",
        content: (
            <>
                <div className="privacy-discription">
                    By using our website, registering an account, or making a purchase, you hereby consent to our Return & Refund Policy and agree to its terms.
                </div>
                <div className="privacy-discription">
                    Should we update, amend or make any changes to this document so that they accurately reflect our Service and policies. Unless otherwise required by law, those changes will be prominently posted here. Then, if you continue to use the Service, you will be bound by the updated Return & Refund Policy. If you do not want to agree to this or any updated Return & Refund Policy, you can delete your account.
                </div>
                <div className="privacy-discription">
                    Personal Data and information on devices are the responsibility of customers and customers are advised to make back-ups for their data, switch off FMI, remove lock/password prior to servicing the device.
                </div>
            </>
        ),
    },
    {
        key: "help",
        title: "Need Help?",
        content: (
            <>
                <div className="privacy-discription">
                    If, for any reason, You are not completely satisfied with any good or service that we provide, don’t hesitate to contact us and we will discuss any of the issues you are going through with our product. For any assistance, reach out to us:
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
                        <a href="mailto:support@ourshopee.com">support@ourshopee.com</a>
                    </li>
                    <li className="policylist">Available 7 days a week, 11 AM – 8 PM</li>
                </ul>
            </>
        ),
    },
    {
        key: "signature",
        title: "OurShopee – Your Trusted Online Store Across GCC",
        content: (
            <>
                <i>Fast Delivery • Secure Payments • Hassle-Free Returns</i>
                <div className="p-2"></div>
            </>
        ),
    },
];

const ReturnReplacementPolicy = () => {
    return (
        <Container fluid className="homepagecontainer">
            <div className="mt-2">
                <BreadComp title={"Return & Replacement Policy"} />
            </div>

            <div className="footerpagesheader">Return & Replacement Policy</div>

            {introBlock}

            {sectionsData.map(({ key, title, content }) => (
                <Section key={key} title={title}>
                    {content}
                </Section>
            ))}
        </Container>
    );
};

export default ReturnReplacementPolicy;
