import React, { memo } from "react";
import { Container } from "react-bootstrap";
import BreadComp from "../../components/Myaccount/BreadComp";
import starimg from "@/images/Sta5r.png";

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
        <div className="privacytitle">OurShopee Privacy Policy</div>
        <div className="privacy-discription">
            This website is owned and managed by OurShopee.com (“OurShopee,” “we,” “our,” or “us”).<br />
            By visiting OurShopee.com or any other websites or mobile applications operated by OurShopee or its affiliates (collectively, the “Site”), you agree to accept the practices described in this Privacy Policy.<br />
            If you do not agree with this Privacy Policy, please do not use the Site.<br />
            We recommend reviewing this page each time you visit to stay informed of any updates.<br />
            At OurShopee, your privacy is our priority. We are committed to protecting and safeguarding any personal information you share with us in accordance with the data protection laws applicable in the United Arab Emirates, Kingdom of Saudi Arabia, Oman, Qatar, Kuwait, and Bahrain.
        </div>
        <div className="footerpage-boderbottem"></div>
    </>
);

const sectionsData = [
    {
        key: "collect-store",
        title: "What personal information Do We Collect And Store?",
        content: (
            <>
                <div className="privacy-discription">
                    To provide our services and deliver a better shopping experience, we collect information from you when you:
                </div>
                <ul>
                    <li className="policylist">Create an account on our website or app</li>
                    <li className="policylist">Place an order</li>
                    <li className="policylist">Communicate with our customer service, sales, or support teams</li>
                    <li className="policylist">Subscribe to marketing newsletters or promotions</li>
                    <li className="policylist">Participate in surveys, offers, or competitions</li>
                </ul>
                <div className="privacy-discription">The types of information we collect include:</div>
                <ul>
                    <li className="policylist">Name, address, contact number, and email</li>
                    <li className="policylist">Account credentials (username and password)</li>
                    <li className="policylist">Payment and billing information (processed securely)</li>
                    <li className="policylist">Order details and delivery preferences</li>
                    <li className="policylist">Communication records (emails, chats, calls)</li>
                    <li className="policylist">Device and usage data (cookies, IP address, browser type)</li>
                </ul>
            </>
        ),
    },
    {
        key: "collecting-uses",
        title: "Collecting information and what we do with it?",
        content: (
            <>
                <div className="privacy-discription">
                    We respect your privacy. Any personal information that we collect about you will be used and disclosed by us so that we can provide you with the services that you have requested, or otherwise to enable us to carry out our business as suppliers of goods, such as
                </div>
                <ul>
                    <li className="policylist">Provide our services</li>
                    <li className="policylist">Respond to your enquiries</li>
                    <li className="policylist">Customize users' experience, measure interest in our services, and inform users about services and updates</li>
                    <li className="policylist">Handle orders, delivery and payments</li>
                    <li className="policylist">Communicate marketing and promotional offers to you</li>
                    <li className="policylist">Update our records and maintain any online account you may have with us</li>
                    <li className="policylist">Enable third parties to carry out technical, logistical or other functions on our behalf.</li>
                </ul>
                <div className="privacy-discription">
                    OurShopee.com takes measures to ensure your personal information is protected from unauthorized access, loss, misuse, disclosure or alteration. We also take measures to destroy or permanently de-identify personal information when it is no longer required. The types of measures we take vary with the type of information, and how it is collected and stored.
                </div>
            </>
        ),
    },
    {
        key: "security",
        title: "Data Protection and Security",
        content: (
            <>
                <div className="privacy-discription">OurShopee employs advanced security measures to protect your personal data from unauthorized access, loss, misuse, or alteration. These include:</div>
                <ul>
                    <li className="policylist">Secure servers and firewalls</li>
                    <li className="policylist">Encrypted (SSL) data transmission during checkout</li>
                    <li className="policylist">Restricted employee access to sensitive data</li>
                    <li className="policylist">Regular system audits and compliance reviews</li>
                </ul>
                <div className="privacy-discription">
                    All credit/debit card information and personally identifiable data are NOT stored, sold, rented, or shared with third parties.
                </div>
                <div className="privacy-discription">
                    We encourage users not to share their passwords. If you suspect misuse of your account, please contact{" "}
                    <a href="mailto:support@ourshopee.com">support@ourshopee.com</a> immediately.
                </div>
            </>
        ),
    },
    {
        key: "disclosure",
        title: "Disclosure of Personal Information",
        content: (
            <>
                <div className="privacy-discription">
                    OurShopee treats all customer information as strictly confidential. We do not sell or rent your personal data to third parties. However, we may share information in the following cases:
                </div>
                <ul>
                    <li className="policylist">
                        Service Providers: With trusted logistics, payment, marketing, or IT partners who assist in operating our business.
                    </li>
                    <li className="policylist">
                        Legal Compliance: When required by government authorities, courts, or law enforcement under applicable laws.
                    </li>
                    <li className="policylist">
                        Fraud Prevention: To detect, prevent, or investigate fraudulent or illegal activities.
                    </li>
                    <li className="policylist">
                        Corporate Transactions: If OurShopee undergoes a merger, acquisition, or restructuring, your data may be transferred under confidentiality safeguards.
                    </li>
                </ul>
                <div className="privacy-discription">
                    All third parties handling data are bound by strict privacy and security obligations.
                </div>
            </>
        ),
    },
    {
        key: "storing",
        title: "Storing and Securing Your Data",
        content: (
            <>
                <div className="privacy-discription">
                    We take all reasonable precautions to protect your information. Our systems are password-protected and comply with international standards for data protection.
                </div>
                <div className="privacy-discription">
                    We retain your information only for as long as necessary to fulfill business or legal purposes. When no longer needed, data is securely deleted or anonymized.
                </div>
            </>
        ),
    },
    {
        key: "rights",
        title: "User Rights",
        content: (
            <>
                <div className="privacy-discription">
                    As per regional privacy regulations across UAE, KSA, Oman, Qatar, Kuwait, and Bahrain, you have the right to:
                </div>
                <ol>
                    <li className="policylist">Access – Request a copy of the personal information we hold about you.</li>
                    <li className="policylist">Correction – Update or rectify incorrect or outdated information.</li>
                    <li className="policylist">Deletion – Request deletion of your personal data, where legally permissible.</li>
                    <li className="policylist">Data Portability – Request a copy of your data in a transferable format.</li>
                    <li className="policylist">Restriction & Objection – Object to certain processing activities, including direct marketing.</li>
                    <li className="policylist">Withdraw Consent – Withdraw any previously given consent.</li>
                    <li className="policylist">Complaint – File a complaint with the local data protection authority if you believe your rights are violated.</li>
                </ol>
                <div className="privacy-discription">
                    To exercise these rights, contact{" "}
                    <a href="mailto:support@ourshopee.com">support@ourshopee.com</a> with proof of identity. We will respond within 30 days in accordance with applicable laws.
                </div>
            </>
        ),
    },
    {
        key: "cookies",
        title: "Cookies and Tracking",
        content: (
            <>
                <div className="privacy-discription">We use cookies to:</div>
                <ul>
                    <li className="policylist">Improve website functionality and speed</li>
                    <li className="policylist">Personalize your shopping experience</li>
                    <li className="policylist">Analyze traffic and usage patterns</li>
                    <li className="policylist">Deliver relevant advertisements</li>
                </ul>
                <div className="privacy-discription">
                    You can manage or disable cookies via your browser settings, but doing so may affect certain site features.
                </div>
            </>
        ),
    },
    {
        key: "children",
        title: "Children’s Privacy",
        content: (
            <div className="privacy-discription">
                The Site is a general audience website and is not directed to children under the age of 13. We will never knowingly collect personally identifiable information from children under the age of 13 without verifiable parental consent. If you are under the age of 13, please do not provide us with personally identifiable information of any kind whatsoever. If we become aware that a user is under the age of 13 and has submitted Personal Information without verifiable parental consent, we will remove his or her personally identifiable information from our files. We understand that children may not fully understand all of the provisions of this Privacy Notice or make informed decisions about the choices that are made available to adult users of the Site. We encourage parents and guardians to spend time with their children online and to be familiar with the websites they visit. OurShopee.com does not sell products to persons under the age of 18. If you are under the age of 18, you are required seek the consent of your parent or guardian to purchase products from the Site.
            </div>
        ),
    },
    {
        key: "third-party",
        title: "Third-Party Links and Advertising",
        content: (
            <div className="privacy-discription">
                We maintain relationships with third party affiliates, thus we may feature links to other websites. Although we do not and cannot control the activities of the third parties that operate such websites, you can be sure that we will stop doing business with any affiliate that engages in abusive practices, including, for example, spam, trademark infringement, or unlawful activities. OurShopee.com is not responsible for the privacy practices or content of any other websites besides its own.
            </div>
        ),
    },
    {
        key: "cross-border",
        title: "Cross-Border Data Transfers",
        content: (
            <div className="privacy-discription">
                Your information may be transferred between OurShopee entities and service providers in the UAE, KSA, Oman, Qatar, Kuwait, and Bahrain. All transfers comply with regional data protection laws and include contractual and technical safeguards to ensure your information is handled securely.
            </div>
        ),
    },
    {
        key: "update-delete",
        title: "Updating or Deleting Your Information",
        content: (
            <>
                <div className="privacy-discription">If you wish to update, correct, or delete your personal data, you can:</div>
                <ul>
                    <li className="policylist">Log in to your account and edit details under “My Account.”</li>
                    <li className="policylist">
                        Contact us via <a href="mailto:info@ourshopee.com">info@ourshopee.com</a> for any corrections.
                    </li>
                    <li className="policylist">Unsubscribe from marketing by clicking “Unsubscribe” in emails or contacting support.</li>
                </ul>
            </>
        ),
    },
    {
        key: "ssl",
        title: "SSL (Secure Socket Layer)",
        content: (
            <div className="privacy-discription">
                SSL encryption is enabled on cart and checkout pages. All sensitive data, including payment information, is transmitted securely. OurShopee ensures your payment details are handled through trusted payment gateways that comply with PCI-DSS security standards.
            </div>
        ),
    },
    {
        key: "liability",
        title: "Limitation of Liability",
        content: (
            <div className="privacy-discription">
                In no event shall OurShopee.com, its affiliates, partners, or licensors be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use the Site, including loss of data, profits, or business interruption, even if advised of the possibility of such damages.
            </div>
        ),
    },
    {
        key: "revisions",
        title: "Policy Revisions",
        content: (
            <div className="privacy-discription">
                OurShopee reserves the right to modify or update this Privacy Policy at any time. Changes will be posted on this page. We encourage you to review the policy regularly to stay informed about how we protect your information.
            </div>
        ),
    },
    {
        key: "questions",
        title: "Questions or Concerns",
        content: (
            <div className="privacy-discription">
                In case you want to get in touch with us, or to provide your feedback, we are always there for you. In fact it is a pleasure to hear from our valued customers. Kindly feel free to contact our customer care team via email:{" "}
                <a href="mailto:support@ourshopee.com">support@ourshopee.com</a>.
            </div>
        ),
    },
];

const PrivacyPolicy = () => {
    return (
        <Container fluid className="homepagecontainer">
            <div className="mt-2">
                <BreadComp title={"Privacy Policy"} />
            </div>

            <div className="footerpagesheader">Privacy Policy</div>

            {introBlock}

            {sectionsData.map(({ key, title, content }) => (
                <Section key={key} title={title}>
                    {content}
                </Section>
            ))}
        </Container>
    );
};

export default PrivacyPolicy;