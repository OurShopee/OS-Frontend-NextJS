"use client";
import React, { memo } from "react";
import { Container } from "react-bootstrap";
import BreadComp from "../../components/Myaccount/BreadComp";
import starimg from "@/images/Sta5r.png";
import { useCurrentLanguage, useContent } from "@/hooks";

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

const getIntroBlock = (language) => {
    const isArabic = language === "ar";
    
    return (
        <>
            <div className="privacytitle">{isArabic ? "سياسة خصوصية OurShopee" : "OurShopee Privacy Policy"}</div>
            <div className="privacy-discription">
                {isArabic ? (
                    <>
                        يُمتلك هذا الموقع الإلكتروني وتديره شركة OurShopee.com(«OurShopee»، «نحن»، «لنا» أو «خاصتنا»(.<br />
                        من خلال زيارتك لموقع OurShopee.com أو أي من المواقع الإلكترونية أو تطبيقات الهاتف المحمول الأخرى التي تديرها OurShopee أو الشركات التابعة لها (ويُشار إليها مجتمعةً بـ «الموقع»)، فإنك توافق على الممارسات الموضّحة في سياسة الخصوصية هذه.<br />
                        إذا كنت لا توافق على سياسة الخصوصية هذه، يُرجى عدم استخدام الموقع.<br />
                        نوصي بمراجعة هذه الصفحة في كل مرة تزور فيها الموقع للبقاء على اطلاع على أي تحديثات.<br />
                        في OurShopee، تُعد خصوصيتك أولوية بالنسبة لنا، ونحن ملتزمون بحماية وتأمين أي معلومات شخصية تشاركها معنا وفقًا لقوانين حماية البيانات المعمول بها في دولة الإمارات العربية المتحدة والمملكة العربية السعودية وسلطنة عُمان ودولة قطر ودولة الكويت ومملكة البحرين.
                    </>
                ) : (
                    <>
                        This website is owned and managed by OurShopee.com ("OurShopee," "we," "our," or "us").<br />
                        By visiting OurShopee.com or any other websites or mobile applications operated by OurShopee or its affiliates (collectively, the "Site"), you agree to accept the practices described in this Privacy Policy.<br />
                        If you do not agree with this Privacy Policy, please do not use the Site.<br />
                        We recommend reviewing this page each time you visit to stay informed of any updates.<br />
                        At OurShopee, your privacy is our priority. We are committed to protecting and safeguarding any personal information you share with us in accordance with the data protection laws applicable in the United Arab Emirates, Kingdom of Saudi Arabia, Oman, Qatar, Kuwait, and Bahrain.
                    </>
                )}
            </div>
            <div className="footerpage-boderbottem"></div>
        </>
    );
};

const getSectionsData = (language) => {
    const isArabic = language === "ar";
    
    return [
    {
        key: "collect-store",
        title: isArabic ? "ما المعلومات الشخصية التي نجمعها ونحتفظ بها؟" : "What personal information Do We Collect And Store?",
        content: (
            <>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            لتقديم خدماتنا وتوفير تجربة تسوق أفضل، نقوم بجمع المعلومات منك في الحالات التالية:
                        </>
                    ) : (
                        <>
                            To provide our services and deliver a better shopping experience, we collect information from you when you:
                        </>
                    )}
                </div>
                <ul>
                    <li className="policylist">{isArabic ? "عند إنشاء حساب على موقعنا الإلكتروني أو تطبيق الهاتف المحمول." : "Create an account on our website or app"}</li>
                    <li className="policylist">{isArabic ? "عند تقديم طلب شراء." : "Place an order"}</li>
                    <li className="policylist">{isArabic ? "عند التواصل مع فرق خدمة العملاء أو المبيعات أو الدعم الفني." : "Communicate with our customer service, sales, or support teams"}</li>
                    <li className="policylist">{isArabic ? "عند الاشتراك في النشرات التسويقية أو العروض الترويجية." : "Subscribe to marketing newsletters or promotions"}</li>
                    <li className="policylist">{isArabic ? "عند المشاركة في الاستبيانات أو العروض أو المسابقات." : "Participate in surveys, offers, or competitions"}</li>
                </ul>
                <div className="privacy-discription">{isArabic ? "وتشمل أنواع المعلومات التي نجمعها ما يلي:" : "The types of information we collect include:"}</div>
                <ul>
                    <li className="policylist">{isArabic ? "الاسم والعنوان ورقم الاتصال والبريد الإلكتروني." : "Name, address, contact number, and email"}</li>
                    <li className="policylist">{isArabic ? "بيانات الحساب (اسم المستخدم وكلمة المرور)." : "Account credentials (username and password)"}</li>
                    <li className="policylist">{isArabic ? "معلومات الدفع والفواتير (تُعالج بشكل آمن)." : "Payment and billing information (processed securely)"}</li>
                    <li className="policylist">{isArabic ? "تفاصيل الطلبات وتفضيلات التسليم." : "Order details and delivery preferences"}</li>
                    <li className="policylist">{isArabic ? "سجلات التواصل (البريد الإلكتروني، الدردشات، المكالمات)." : "Communication records (emails, chats, calls)"}</li>
                    <li className="policylist">{isArabic ? "بيانات الجهاز والاستخدام (ملفات تعريف الارتباط Cookies، عنوان الـIP، نوع المتصفح)." : "Device and usage data (cookies, IP address, browser type)"}</li>
                </ul>
            </>
        ),
    },
    {
        key: "collecting-uses",
        title: isArabic ? "جمع المعلومات وكيف نستخدمها" : "Collecting information and what we do with it?",
        content: (
            <>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            نحن نحترم خصوصيتك. تُستخدم أي معلومات شخصية نجمعها عنك وتُفصح عنها OurShopee فقط لتقديم الخدمات التي طلبتها، أو لتمكيننا من إدارة أعمالنا كمزوّدين للسلع والخدمات، مثل:
                        </>
                    ) : (
                        <>
                            We respect your privacy. Any personal information that we collect about you will be used and disclosed by us so that we can provide you with the services that you have requested, or otherwise to enable us to carry out our business as suppliers of goods, such as
                        </>
                    )}
                </div>
                <ul>
                    <li className="policylist">{isArabic ? "تقديم خدماتنا." : "Provide our services"}</li>
                    <li className="policylist">{isArabic ? "الرد على استفساراتك." : "Respond to your enquiries"}</li>
                    <li className="policylist">{isArabic ? "تخصيص تجربة المستخدم وقياس مدى اهتمام المستخدمين بخدماتنا وإبلاغهم بالخدمات والتحديثات." : "Customize users' experience, measure interest in our services, and inform users about services and updates"}</li>
                    <li className="policylist">{isArabic ? "معالجة الطلبات وعمليات التسليم والمدفوعات." : "Handle orders, delivery and payments"}</li>
                    <li className="policylist">{isArabic ? "إرسال العروض التسويقية والترويجية إليك." : "Communicate marketing and promotional offers to you"}</li>
                    <li className="policylist">{isArabic ? "تحديث سجلاتنا والحفاظ على أي حساب إلكتروني قد تملكه لدينا." : "Update our records and maintain any online account you may have with us"}</li>
                    <li className="policylist">{isArabic ? "تمكين الأطراف الثالثة من تنفيذ المهام التقنية أو اللوجستية أو غيرها نيابةً عنا." : "Enable third parties to carry out technical, logistical or other functions on our behalf."}</li>
                </ul>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            تتخذ OurShopee.com إجراءات لضمان حماية معلوماتك الشخصية من الوصول غير المصرح به أو الفقد أو سوء الاستخدام أو الكشف أو التعديل.
                            <br />
                            كما نتخذ إجراءات لإتلاف المعلومات الشخصية أو إزالة هويتها بشكل دائم عندما لا تكون هناك حاجة للاحتفاظ بها.
                            <br />
                            وتختلف أنواع التدابير التي نتخذها تبعًا لنوع المعلومات وطريقة جمعها وتخزينها.
                        </>
                    ) : (
                        <>
                            OurShopee.com takes measures to ensure your personal information is protected from unauthorized access, loss, misuse, disclosure or alteration. We also take measures to destroy or permanently de-identify personal information when it is no longer required. The types of measures we take vary with the type of information, and how it is collected and stored.
                        </>
                    )}
                </div>
            </>
        ),
    },
    {
        key: "security",
        title: isArabic ? "حماية البيانات والأمان" : "Data Protection and Security",
        content: (
            <>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            تعتمد OurShopee تدابير أمان متقدمة لحماية بياناتك الشخصية من الوصول غير المصرح به أو الفقد أو سوء الاستخدام أو التعديل، وتشمل هذه التدابير ما يلي:
                        </>
                    ) : (
                        <>
                            OurShopee employs advanced security measures to protect your personal data from unauthorized access, loss, misuse, or alteration. These include:
                        </>
                    )}
                </div>
                <ul>
                    <li className="policylist">{isArabic ? "خوادم آمنة وجدران حماية." : "Secure servers and firewalls"}</li>
                    <li className="policylist">{isArabic ? "نقل البيانات بشكل مشفّر (SSL) أثناء عملية الدفع." : "Encrypted (SSL) data transmission during checkout"}</li>
                    <li className="policylist">{isArabic ? "تقييد وصول الموظفين إلى البيانات الحساسة." : "Restricted employee access to sensitive data"}</li>
                    <li className="policylist">{isArabic ? "تدقيقات منتظمة للأنظمة ومراجعات امتثال." : "Regular system audits and compliance reviews"}</li>
                </ul>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            ولا يتم تخزين أو بيع أو تأجير أو مشاركة أي معلومات متعلقة ببطاقات الائتمان/الخصم أو البيانات الشخصية القابلة للتحديد مع أي طرف ثالث.
                        </>
                    ) : (
                        <>
                            All credit/debit card information and personally identifiable data are NOT stored, sold, rented, or shared with third parties.
                        </>
                    )}
                </div>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            ونشجع المستخدمين على عدم مشاركة كلمات المرور الخاصة بهم.
                            <br />
                            وفي حال الاشتباه بأي إساءة استخدام لحسابك، يُرجى التواصل فورًا عبر البريد الإلكتروني: <a href="mailto:support@ourshopee.com">support@ourshopee.com</a>.
                        </>
                    ) : (
                        <>
                            We encourage users not to share their passwords. If you suspect misuse of your account, please contact{" "}
                            <a href="mailto:support@ourshopee.com">support@ourshopee.com</a> immediately.
                        </>
                    )}
                </div>
            </>
        ),
    },
    {
        key: "disclosure",
        title: isArabic ? "الإفصاح عن المعلومات الشخصية" : "Disclosure of Personal Information",
        content: (
            <>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            تتعامل OurShopee مع جميع معلومات العملاء بسرية تامة.
                            <br />
                            ولا نقوم ببيع أو تأجير بياناتك الشخصية لأي طرف ثالث.
                            <br />
                            ومع ذلك، قد نشارك بعض المعلومات في الحالات التالية:
                        </>
                    ) : (
                        <>
                            OurShopee treats all customer information as strictly confidential. We do not sell or rent your personal data to third parties. However, we may share information in the following cases:
                        </>
                    )}
                </div>
                <ul>
                    <li className="policylist">
                        {isArabic ? (
                            <>
                                <b>مقدمو الخدمات:</b> مع شركائنا الموثوقين في مجالات الخدمات اللوجستية أو الدفع أو التسويق أو تقنية المعلومات الذين يساهمون في تشغيل أعمالنا.
                            </>
                        ) : (
                            <>
                                <b>Service Providers:</b> With trusted logistics, payment, marketing, or IT partners who assist in operating our business.
                            </>
                        )}
                    </li>
                    <li className="policylist">
                        {isArabic ? (
                            <>
                                <b>الامتثال القانوني:</b> عندما يُطلب منا ذلك من قبل الجهات الحكومية أو المحاكم أو سلطات إنفاذ القانون وفقًا للقوانين المعمول بها.
                            </>
                        ) : (
                            <>
                                <b>Legal Compliance:</b> When required by government authorities, courts, or law enforcement under applicable laws.
                            </>
                        )}
                    </li>
                    <li className="policylist">
                        {isArabic ? (
                            <>
                                <b>منع الاحتيال:</b> للكشف عن الأنشطة الاحتيالية أو غير القانونية أو منعها أو التحقيق فيها.
                            </>
                        ) : (
                            <>
                                <b>Fraud Prevention:</b> To detect, prevent, or investigate fraudulent or illegal activities.
                            </>
                        )}
                    </li>
                    <li className="policylist">
                        {isArabic ? (
                            <>
                                <b>المعاملات المؤسسية:</b> في حال خضوع OurShopee لعملية اندماج أو استحواذ أو إعادة هيكلة، قد تُنقل بياناتك ضمن ضمانات سرية مناسبة.
                            </>
                        ) : (
                            <>
                                <b>Corporate Transactions:</b> If OurShopee undergoes a merger, acquisition, or restructuring, your data may be transferred under confidentiality safeguards.
                            </>
                        )}
                    </li>
                </ul>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            وجميع الأطراف الثالثة التي تتعامل مع البيانات مُلزمة بالتقيد الصارم بالتزامات الخصوصية والأمان.
                        </>
                    ) : (
                        <>
                            All third parties handling data are bound by strict privacy and security obligations.
                        </>
                    )}
                </div>
            </>
        ),
    },
    {
        key: "storing",
        title: isArabic ? "تخزين بياناتك وحمايتها" : "Storing and Securing Your Data",
        content: (
            <>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            نتخذ جميع الاحتياطات المعقولة لحماية معلوماتك.
                            <br />
                            تخضع أنظمتنا لحماية بكلمات مرور وتتماشى مع المعايير الدولية لحماية البيانات.
                        </>
                    ) : (
                        <>
                            We take all reasonable precautions to protect your information. Our systems are password-protected and comply with international standards for data protection.
                        </>
                    )}
                </div>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            نحتفظ بمعلوماتك فقط للمدة اللازمة لتحقيق الأغراض التجارية أو القانونية، وعند عدم الحاجة إليها يتم حذف البيانات بشكل آمن أو تحويلها إلى صيغة مجهولة الهوية.
                        </>
                    ) : (
                        <>
                            We retain your information only for as long as necessary to fulfill business or legal purposes. When no longer needed, data is securely deleted or anonymized.
                        </>
                    )}
                </div>
            </>
        ),
    },
    {
        key: "rights",
        title: isArabic ? "حقوق المستخدم" : "User Rights",
        content: (
            <>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            وفقًا لأنظمة الخصوصية الإقليمية المعمول بها في الإمارات العربية المتحدة والمملكة العربية السعودية وسلطنة عُمان ودولة قطر ودولة الكويت ومملكة البحرين، يحق لك ما يلي:
                        </>
                    ) : (
                        <>
                            As per regional privacy regulations across UAE, KSA, Oman, Qatar, Kuwait, and Bahrain, you have the right to:
                        </>
                    )}
                </div>
                <ol>
                    <li className="policylist">{isArabic ? "الوصول: طلب نسخة من المعلومات الشخصية التي نحتفظ بها عنك." : "Access – Request a copy of the personal information we hold about you."}</li>
                    <li className="policylist">{isArabic ? "التصحيح: تحديث أو تصحيح أي معلومات غير دقيقة أو قديمة." : "Correction – Update or rectify incorrect or outdated information."}</li>
                    <li className="policylist">{isArabic ? "الحذف: طلب حذف بياناتك الشخصية، حيثما يسمح القانون بذلك." : "Deletion – Request deletion of your personal data, where legally permissible."}</li>
                    <li className="policylist">{isArabic ? "قابلية نقل البيانات: طلب نسخة من بياناتك بصيغة قابلة للنقل." : "Data Portability – Request a copy of your data in a transferable format."}</li>
                    <li className="policylist">{isArabic ? "التقييد والاعتراض: الاعتراض على بعض أنشطة المعالجة، بما في ذلك التسويق المباشر." : "Restriction & Objection – Object to certain processing activities, including direct marketing."}</li>
                    <li className="policylist">{isArabic ? "سحب الموافقة: سحب أي موافقة سابقة تم منحها." : "Withdraw Consent – Withdraw any previously given consent."}</li>
                    <li className="policylist">{isArabic ? "تقديم شكوى: رفع شكوى إلى هيئة حماية البيانات المحلية إذا كنت تعتقد أن حقوقك قد انتُهكت." : "Complaint – File a complaint with the local data protection authority if you believe your rights are violated."}</li>
                </ol>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            لممارسة هذه الحقوق، يُرجى التواصل عبر البريد الإلكتروني: <a href="mailto:support@ourshopee.com">support@ourshopee.com</a> مرفقًا بإثبات الهوية.
                            <br />
                            سنقوم بالرد خلال مدة لا تتجاوز ٣٠ يومًا وفقًا للقوانين المعمول بها.
                        </>
                    ) : (
                        <>
                            To exercise these rights, contact{" "}
                            <a href="mailto:support@ourshopee.com">support@ourshopee.com</a> with proof of identity. We will respond within 30 days in accordance with applicable laws.
                        </>
                    )}
                </div>
            </>
        ),
    },
    {
        key: "cookies",
        title: isArabic ? "ملفات تعريف الارتباط (Cookies) والتتبع" : "Cookies and Tracking",
        content: (
            <>
                <div className="privacy-discription">{isArabic ? "نستخدم ملفات تعريف الارتباط (Cookies) للأغراض التالية:" : "We use cookies to:"}</div>
                <ul>
                    <li className="policylist">{isArabic ? "تحسين أداء الموقع وسرعته." : "Improve website functionality and speed"}</li>
                    <li className="policylist">{isArabic ? "تخصيص تجربة التسوق الخاصة بك." : "Personalize your shopping experience"}</li>
                    <li className="policylist">{isArabic ? "تحليل حركة المرور وأنماط الاستخدام." : "Analyze traffic and usage patterns"}</li>
                    <li className="policylist">{isArabic ? "عرض الإعلانات ذات الصلة." : "Deliver relevant advertisements"}</li>
                </ul>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            يمكنك إدارة ملفات تعريف الارتباط أو تعطيلها من خلال إعدادات المتصفح لديك، ولكن قد يؤدي ذلك إلى التأثير على بعض ميزات الموقع.
                        </>
                    ) : (
                        <>
                            You can manage or disable cookies via your browser settings, but doing so may affect certain site features.
                        </>
                    )}
                </div>
            </>
        ),
    },
    {
        key: "children",
        title: isArabic ? "خصوصية الأطفال" : "Children's Privacy",
        content: (
            <div className="privacy-discription">
                {isArabic ? (
                    <>
                        يُعد هذا الموقع مخصصًا للجمهور العام، وليس موجهًا للأطفال دون سن ١٣ عامًا.
                        <br />
                        لن نقوم مطلقًا، عن علم، بجمع أي معلومات شخصية يمكن تحديد هوية صاحبها من الأطفال دون سن ١٣ عامًا دون الحصول على موافقة موثوقة من أحد الوالدين.
                        <br />
                        إذا كنت دون سن ١٣ عامًا، يُرجى عدم تزويدنا بأي معلومات شخصية من أي نوع.
                        <br />
                        وفي حال علمنا بأن أحد المستخدمين دون سن ١٣ عامًا قد قدّم معلومات شخصية دون موافقة موثوقة من الوالدين، فسنقوم بحذف تلك المعلومات فورًا من سجلاتنا.
                        <br />
                        ندرك أن الأطفال قد لا يستوعبون بالكامل جميع أحكام إشعار الخصوصية هذا أو لا يستطيعون اتخاذ قرارات مستنيرة بشأن الخيارات المتاحة للمستخدمين البالغين للموقع.
                        <br />
                        لذلك، نشجع الآباء والأوصياء على قضاء وقت مع أطفالهم أثناء استخدام الإنترنت والتعرف على المواقع التي يزورونها.
                        <br />
                        كما أن OurShopee.com لا تبيع منتجاتها للأشخاص دون سن ١٨ عامًا،
                        <br />
                        وفي حال كنت دون سن ١٨ عامًا، يجب عليك الحصول على موافقة أحد والديك أو وصيك القانوني قبل شراء أي منتجات من الموقع.
                    </>
                ) : (
                    <>
                        The Site is a general audience website and is not directed to children under the age of 13. We will never knowingly collect personally identifiable information from children under the age of 13 without verifiable parental consent. If you are under the age of 13, please do not provide us with personally identifiable information of any kind whatsoever. If we become aware that a user is under the age of 13 and has submitted Personal Information without verifiable parental consent, we will remove his or her personally identifiable information from our files. We understand that children may not fully understand all of the provisions of this Privacy Notice or make informed decisions about the choices that are made available to adult users of the Site. We encourage parents and guardians to spend time with their children online and to be familiar with the websites they visit. OurShopee.com does not sell products to persons under the age of 18. If you are under the age of 18, you are required seek the consent of your parent or guardian to purchase products from the Site.
                    </>
                )}
            </div>
        ),
    },
    {
        key: "third-party",
        title: isArabic ? "الروابط والإعلانات من الغير" : "Third-Party Links and Advertising",
        content: (
            <div className="privacy-discription">
                {isArabic ? (
                    <>
                        نُقيم علاقات مع شركاء تابعين من الأطراف الثالثة، ولذلك قد يحتوي موقعنا على روابط لمواقع إلكترونية أخرى.
                        <br />
                        وعلى الرغم من أننا لا نتحكم ولا يمكننا التحكم في أنشطة الأطراف الثالثة التي تدير تلك المواقع، يمكنك التأكد من أننا سنتوقف عن التعامل مع أي شريك يقوم بممارسات مسيئة، مثل البريد العشوائي (Spam) أو انتهاك العلامات التجارية أو الأنشطة غير القانونية.
                        <br />
                        ولا تتحمل OurShopee.com أي مسؤولية عن ممارسات الخصوصية أو محتوى أي مواقع إلكترونية أخرى بخلاف موقعها الرسمي.
                    </>
                ) : (
                    <>
                        We maintain relationships with third party affiliates, thus we may feature links to other websites. Although we do not and cannot control the activities of the third parties that operate such websites, you can be sure that we will stop doing business with any affiliate that engages in abusive practices, including, for example, spam, trademark infringement, or unlawful activities. OurShopee.com is not responsible for the privacy practices or content of any other websites besides its own.
                    </>
                )}
            </div>
        ),
    },
    {
        key: "cross-border",
        title: isArabic ? "نقل البيانات عبر الحدود" : "Cross-Border Data Transfers",
        content: (
            <div className="privacy-discription">
                {isArabic ? (
                    <>
                        قد تُنقل معلوماتك بين كيانات OurShopee ومقدمي الخدمات في الإمارات العربية المتحدة والمملكة العربية السعودية وسلطنة عُمان ودولة قطر ودولة الكويت ومملكة البحرين.
                        <br />
                        تتم جميع عمليات النقل وفقًا لقوانين حماية البيانات الإقليمية، وتشمل ضمانات تعاقدية وتقنية لضمان التعامل الآمن مع معلوماتك.
                    </>
                ) : (
                    <>
                        Your information may be transferred between OurShopee entities and service providers in the UAE, KSA, Oman, Qatar, Kuwait, and Bahrain. All transfers comply with regional data protection laws and include contractual and technical safeguards to ensure your information is handled securely.
                    </>
                )}
            </div>
        ),
    },
    {
        key: "update-delete",
        title: isArabic ? "تحديث أو حذف معلوماتك" : "Updating or Deleting Your Information",
        content: (
            <>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            إذا كنت ترغب في تحديث أو تصحيح أو حذف بياناتك الشخصية، يمكنك القيام بذلك من خلال:
                        </>
                    ) : (
                        <>
                            If you wish to update, correct, or delete your personal data, you can:
                        </>
                    )}
                </div>
                <ul>
                    <li className="policylist">
                        {isArabic ? (
                            <>
                                تسجيل الدخول إلى حسابك وتعديل التفاصيل في قسم «حسابي».
                            </>
                        ) : (
                            <>
                                Log in to your account and edit details under "My Account."
                            </>
                        )}
                    </li>
                    <li className="policylist">
                        {isArabic ? (
                            <>
                                التواصل معنا عبر البريد الإلكتروني: <a href="mailto:info@ourshopee.com">info@ourshopee.com</a> لإجراء أي تصحيحات.
                            </>
                        ) : (
                            <>
                                Contact us via <a href="mailto:info@ourshopee.com">info@ourshopee.com</a> for any corrections.
                            </>
                        )}
                    </li>
                    <li className="policylist">
                        {isArabic ? (
                            <>
                                إلغاء الاشتراك في الرسائل التسويقية بالنقر على خيار « إلغاء الاشتراك»  في الرسائل الإلكترونية أو من خلال التواصل مع فريق الدعم.
                            </>
                        ) : (
                            <>
                                Unsubscribe from marketing by clicking "Unsubscribe" in emails or contacting support.
                            </>
                        )}
                    </li>
                </ul>
            </>
        ),
    },
    {
        key: "ssl",
        title: isArabic ? "طبقة المقابس الآمنة" : "SSL (Secure Socket Layer)",
        content: (
            <div className="privacy-discription">
                {isArabic ? (
                    <>
                        يتم تفعيل تشفير طبقة المقابس الآمنة في صفحات سلة التسوق والدفع.
                        <br />
                        تُنقل جميع البيانات الحساسة، بما في ذلك معلومات الدفع، بشكل آمن.
                        <br />
                        وتحرص OurShopee على معالجة تفاصيل الدفع الخاصة بك عبر بوابات دفع موثوقة تتوافق مع معايير أمان PCI-DSS.
                    </>
                ) : (
                    <>
                        SSL encryption is enabled on cart and checkout pages. All sensitive data, including payment information, is transmitted securely. OurShopee ensures your payment details are handled through trusted payment gateways that comply with PCI-DSS security standards.
                    </>
                )}
            </div>
        ),
    },
    {
        key: "liability",
        title: isArabic ? "حدود المسؤولية" : "Limitation of Liability",
        content: (
            <div className="privacy-discription">
                {isArabic ? (
                    <>
                        لا تتحمل OurShopee.com أو الشركات التابعة لها أو شركاؤها أو المرخصون لها أي مسؤولية عن الأضرار غير المباشرة أو العرضية أو الخاصة أو التبعية الناتجة عن استخدام الموقع أو عدم القدرة على استخدامه، بما في ذلك فقدان البيانات أو الأرباح أو توقف النشاط التجاري، حتى وإن تم إخطارها بإمكانية حدوث مثل هذه الأضرار.
                    </>
                ) : (
                    <>
                        In no event shall OurShopee.com, its affiliates, partners, or licensors be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use the Site, including loss of data, profits, or business interruption, even if advised of the possibility of such damages.
                    </>
                )}
            </div>
        ),
    },
    {
        key: "revisions",
        title: isArabic ? "تعديلات سياسة الخصوصية" : "Policy Revisions",
        content: (
            <div className="privacy-discription">
                {isArabic ? (
                    <>
                        تحتفظ OurShopee بالحق في تعديل أو تحديث سياسة الخصوصية هذه في أي وقت.
                        <br />
                        سيتم نشر أي تغييرات على هذه الصفحة.
                        <br />
                        ونشجعك على مراجعة السياسة بانتظام للبقاء على اطلاع حول كيفية حماية معلوماتك.
                    </>
                ) : (
                    <>
                        OurShopee reserves the right to modify or update this Privacy Policy at any time. Changes will be posted on this page. We encourage you to review the policy regularly to stay informed about how we protect your information.
                    </>
                )}
            </div>
        ),
    },
    {
        key: "questions",
        title: isArabic ? "الاستفسارات أو الملاحظات" : "Questions or Concerns",
        content: (
            <div className="privacy-discription">
                {isArabic ? (
                    <>
                        في حال رغبتك في التواصل معنا أو تقديم ملاحظاتك، فنحن دائمًا في خدمتك، ويسعدنا الاستماع إلى عملائنا الكرام.
                        <br />
                        يُرجى عدم التردد في التواصل مع فريق خدمة العملاء عبر البريد الإلكتروني: <a href="mailto:support@ourshopee.com">support@ourshopee.com</a>.
                    </>
                ) : (
                    <>
                        In case you want to get in touch with us, or to provide your feedback, we are always there for you. In fact it is a pleasure to hear from our valued customers. Kindly feel free to contact our customer care team via email:{" "}
                        <a href="mailto:support@ourshopee.com">support@ourshopee.com</a>.
                    </>
                )}
            </div>
        ),
    },
    ];
};

const PrivacyPolicy = () => {
    const currentLanguage = useCurrentLanguage();
    const privacyTitle = useContent("footer.privacyPolicy");
    const introBlock = getIntroBlock(currentLanguage);
    const sectionsData = getSectionsData(currentLanguage);
    
    return (
        <Container fluid className="homepagecontainer">
            <div className="mt-2">
                <BreadComp title={privacyTitle} />
            </div>

            <div className="footerpagesheader">{privacyTitle}</div>

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