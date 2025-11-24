"use client";
import React, { memo } from "react";
import { Container } from "react-bootstrap";
import BreadComp from "../../components/Myaccount/BreadComp";
import Link from "next/link";
import { useCurrentLanguage, useContent } from "@/hooks";
import { getAssetsUrl } from "../../components/utils/helpers";

const Section = memo(function Section({ title, children }) {
    return (
        <section className="footer-section">
            <div className="privacy-policy-min-titles">
                <img
                    className="starimg"
                    src={getAssetsUrl("Sta5r.png")}
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

const getSectionsData = (language) => {
    const isArabic = language === "ar";
    
    return [
    {
        key: "about",
        title: isArabic ? "نبذة عن OurShopee" : "About OurShopee",
        content: (
            <p className="privacy-discription">
                {isArabic ? (
                    <>
                        تدير مجموعة OurShopee منصة للتجارة الإلكترونية تخدم العملاء في جميع أنحاء دول مجلس التعاون الخليجي. ونحن نوفر مجموعة من المنتجات الجديدة والمستعملة من خلال موقعنا الإلكتروني الرسمي وتطبيق الهاتف المحمول.
                        <br />
                        وباستخدامك لمنصتنا، فإنك توافق على أن جميع عمليات الشراء والتسليم والإرجاع والتعاملات الخدمية تخضع لهذه الشروط، ولسياسة الإرجاع والاستبدال، ولسياسة الخصوصية الخاصة بنا.
                    </>
                ) : (
                    <>
                        OurShopee Group operates an e-commerce platform serving customers across the GCC. We provide a range of new and pre-owned products through our official website and mobile application.
                        <br />
                        By using our Platform, you agree that all purchases, deliveries, returns, and service interactions are governed by these Terms, our Return & Replacement Policy, and our Privacy Policy.
                    </>
                )}
            </p>
        ),
    },
    {
        key: "ordering",
        title: isArabic ? "الطلبات والدفع" : "Ordering and Payment",
        content: (
            <>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            يمكن تقديم الطلبات مباشرة عبر موقعنا الإلكتروني أو تطبيق الهاتف المحمول. وتشمل طرق الدفع الخيارات المسبقة الدفع (بطاقة الائتمان/الخصم، رصيد المحفظة)، والدفع عند الاستلام (COD)، والدفع بالتقسيط عبر Tabby / Tamara (في الإمارات العربية المتحدة فقط).
                        </>
                    ) : (
                        <>
                            Orders may be placed directly through our website or mobile app. Payment methods include prepaid options (credit/debit card, wallet credit), cash on delivery (COD), and installments via Tabby/ Tamara (UAE only).
                        </>
                    )}
                </div>
                <div className="p-2" />
                <div className="privacy-discription">
                    <b>{isArabic ? "نحتفظ بالحق في:" : "We reserve the right to:"}</b>
                </div>
                <ul>
                    <li className="policylist">
                        {isArabic ? "قبول أو رفض أي طلب وفقًا لتقديرنا الخاص." : "Accept or decline any order at our discretion."}
                    </li>
                    <li className="policylist">
                        {isArabic ? "إلغاء أو تعديل الطلبات في حال وجود أخطاء في الأسعار أو المخزون، أو مشكلات في التحقق من الدفع، أو الاشتباه في نشاط احتيالي." : "Cancel or modify orders in case of pricing or stock errors, payment verification issues, or suspected fraudulent activity."}
                    </li>
                </ul>
                <div className="privacy-discription">
                    {isArabic ? "لا يمكن للعميل إلغاء الطلب بعد شحنه." : "Customers may not cancel an order once it has been dispatched."}
                </div>
            </>
        ),
    },
    {
        key: "cod",
        title: isArabic ? "الدفع عند الاستلام (COD)" : "Cash on Delivery (COD)",
        content: (
            <div className="privacy-discription">
                {isArabic ? (
                    <>
                        تتوفر خدمة الدفع عند الاستلام فقط في المناطق المؤهلة وقد تخضع لحدود لقيمة الطلب يمكن تعديلها دون إشعار مسبق.
                        <br />
                        لا نفرض أي رسوم إضافية على الطلبات التي تُدفع عند الاستلام.
                        <br />
                        قد يؤدي تكرار رفض الطلبات أو إساءة استخدام خدمة الدفع عند الاستلام إلى تقييد أو تعليق حساب العميل.
                    </>
                ) : (
                    <>
                        COD is available only within eligible regions and may be subject to order-value limits that can change without prior notice. We do not charge additional fees for COD orders.
                        <br />
                        Repeated order rejections or misuse of COD service may result in restriction or suspension of the customer's account.
                    </>
                )}
            </div>
        ),
    },
    {
        key: "shipping",
        title: isArabic ? "الشحن والتسليم" : "Shipping and Delivery",
        content: (
            <div className="privacy-discription">
                {isArabic ? (
                    <>
                        تتم عمليات التسليم من خلال مزيج من خدماتنا اللوجستية الداخلية وشركات الشحن الموثوقة من الغير، وذلك حسب المنطقة.
                        <br />
                        تختلف أوقات التسليم المقدّرة حسب الموقع ونوع المنتج.
                        <br />
                        وتنتقل مخاطر الفقد أو التلف إلى العميل بمجرد تسليم الطلب إلى العنوان المسجل.
                        <br />
                        ولا تتحمل OurShopee أي مسؤولية عن التأخيرات الناتجة عن شركات الشحن أو الجمارك أو الظروف الخارجة عن السيطرة.
                    </>
                ) : (
                    <>
                        Deliveries are handled through a mix of in-house logistics and trusted third-party couriers, depending on region. Estimated delivery times vary by location and product type.
                        <br />
                        Risk of loss or damage transfers to the customer once the order is delivered to the registered address. OurShopee is not responsible for delays caused by courier partners, customs, or unforeseen circumstances.
                    </>
                )}
            </div>
        ),
    },
    {
        key: "returns",
        title: isArabic ? "الإرجاع والاستبدال واسترداد المبالغ" : "Returns, Replacements & Refunds",
        content: (
            <div className="privacy-discription">
                {isArabic ? (
                    <>
                        تخضع عملية الإرجاع واسترداد المبالغ المالية لصفحة سياسة الإرجاع والاستبدال المخصصة لدينا.
                        <br />
                        ويمكنك طلب إرجاع المنتج خلال سبعة (٧) أيام من استلام الطلب، وفقًا لشروط الأهلية الموضّحة في تلك السياسة.
                        <br />
                        وتُعالج عمليات استرداد المبالغ خلال سبعة (٧) أيام عمل من تاريخ الفحص والموافقة، باستخدام نفس وسيلة الدفع متى ما أمكن ذلك، أو عبر رصيد المحفظة.
                        <br />
                        للاطلاع على التفاصيل الكاملة بخصوص الجداول الزمنية، والمنتجات غير القابلة للإرجاع، وتغطية الضمان، يُرجى الرجوع إلى سياسة الإرجاع والاستبدال الرسمية المتوفرة على موقعنا الإلكتروني.
                    </>
                ) : (
                    <>
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
                    </>
                )}
            </div>
        ),
    },
    {
        key: "preowned",
        title: isArabic ? "موثوقية المنتجات المستعملة" : "Pre-Owned Product Authenticity",
        content: (
            <div className="privacy-discription">
                {isArabic ? (
                    <>
                        تخضع المنتجات المستعملة المعروضة على OurShopee للفحص والاختبار من قِبل فريق مراقبة الجودة لدينا قبل عرضها للبيع.
                        <br />
                        وقد تظهر على هذه المنتجات علامات طفيفة تدل على الاستخدام السابق، إلا أنها مضمونة من حيث الأداء والوظيفة.
                        <br />
                        وجميع المنتجات المستعملة تشمل تغطية ضمان وفقًا لما هو موضح في سياسة الإرجاع والاستبدال.
                        <br />
                        ويقرّ العملاء بأن الاختلافات الشكلية مقارنة بالمنتجات الجديدة لا تُعدّ عيوبًا.
                    </>
                ) : (
                    <>
                        Pre-Owned items listed on OurShopee are verified and tested by our quality-control team before sale. These items may show minimal signs of previous use but are guaranteed to be functional.
                        <br />
                        All pre-owned products come with warranty coverage as described in the Return & Replacement Policy. Customers acknowledge that cosmetic differences from new products do not constitute defects.
                    </>
                )}
            </div>
        ),
    },
    {
        key: "pricing",
        title: isArabic ? "الأسعار والعروض والتخفيضات" : "Pricing, Promotions & Offers",
        content: (
            <div className="privacy-discription">
                {isArabic ? (
                    <>
                        تخضع الأسعار والعروض على OurShopee للتغيير دون إشعار مسبق.
                        <br />
                        في حال إدراج منتج بسعر غير صحيح أو وجود خطأ في التفاصيل بسبب خطأ بشري أو تقني، نحتفظ بالحق في إلغاء أو تعديل أو رفض أي طلب متعلق بذلك المنتج.
                        <br />
                        العروض ورموز القسائم والحملات الترويجية محددة المدة ولا يمكن الجمع بينها إلا في حال النص صراحة على ذلك.
                        <br />
                        قد تنطبق بعض العروض حصريًا على عمليات الشراء المسبقة الدفع.
                    </>
                ) : (
                    <>
                        Prices and promotions on OurShopee are subject to change without prior notice.
                        If a product is listed at an incorrect price or with an error in details due to human or technical mistake, we reserve the right to cancel, modify, or refuse any such order.
                        <br />
                        Offers, coupon codes, and promotional campaigns are limited-time and cannot be combined unless explicitly stated. Some offers may apply exclusively to prepaid purchases.
                    </>
                )}
            </div>
        ),
    },
    {
        key: "accounts",
        title: isArabic ? "حسابات المستخدمين وعمليات الشراء كزائر" : "User Accounts and Guest Checkout",
        content: (
            <div className="privacy-discription">
                {isArabic ? (
                    <>
                        يمكن للعملاء التسوق كزائرين أو من خلال إنشاء حساب مستخدم.
                        <br />
                        في حال التسجيل، تكون مسؤولًا عن الحفاظ على سرية بيانات تسجيل الدخول وضمان دقة المعلومات المقدمة وتحديثها بشكل مستمر.
                        <br />
                        تحتفظ OurShopee بالحق في تعليق أو إلغاء أي حساب يثبت تورطه في نشاط احتيالي أو إساءة استخدام أو مخالفة لهذه الشروط.
                    </>
                ) : (
                    <>
                        Customers may shop as guests or by creating an account. If you choose to register, you are responsible for maintaining the confidentiality of your login credentials and ensuring all information provided is accurate and up to date.
                        <br />
                        OurShopee reserves the right to suspend or terminate accounts engaged in fraudulent activity, misuse, or violation of these Terms.
                    </>
                )}
            </div>
        ),
    },
    {
        key: "reviews",
        title: isArabic ? "المحتوى وتقييمات العملاء" : "Content and Customer Reviews",
        content: (
            <div className="privacy-discription">
                {isArabic ? (
                    <>
                        قد نسمح للعملاء بتقديم التقييمات أو الصور أو الملاحظات.
                        <br />
                        وبقيامك بذلك، فإنك تمنح OurShopee ترخيصًا غير حصري وخاليًا من حقوق الملكية لاستخدام هذا المحتوى لأغراض ترويجية وتسويقية عبر أي وسيلة.
                        <br />
                        يجب أن يكون المحتوى المقدّم قانونيًا وأصيلاً ومحترمًا، ونحتفظ بالحق في إزالة أي محتوى يخالف هذه المعايير.
                    </>
                ) : (
                    <>
                        We may allow customers to submit reviews, photos, or feedback. By doing so, you grant OurShopee a non-exclusive, royalty-free license to use this content for promotional and marketing purposes across any medium.
                        <br />
                        Submitted content must be lawful, original, and respectful. We reserve the right to remove content that violates these standards.
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
                        في أقصى حدود يسمح بها القانون، لا تتحمل شركة OurShopee Trading LLC أي مسؤولية عن الأضرار غير المباشرة أو العرضية أو التبعية، بما في ذلك خسارة الأرباح أو البيانات أو فرص العمل، الناتجة عن استخدامك لمنصتنا أو شرائك للمنتجات.
                        <br />
                        ولا تتجاوز مسؤوليتنا الإجمالية عن أي مطالبة تتعلق بطلب ما القيمة الإجمالية المدفوعة لذلك الطلب.
                        <br />
                        ولا نتحمل أي مسؤولية عن التأخيرات أو الانقطاعات أو المشكلات الناتجة عن مقدمي الخدمات من الأطراف الثالثة أو شركات الشحن أو بوابات الدفع أو العوامل الخارجية الخارجة عن سيطرتنا.
                    </>
                ) : (
                    <>
                        To the maximum extent permitted by law, OurShopee Trading LLC shall not be liable for any indirect, incidental, or consequential damages, including loss of profits, data, or business opportunities, arising from your use of our Platform or purchase of products.
                        <br />
                        Our total liability for any claim related to an order shall not exceed the total value paid for that order.
                        <br />
                        We are not responsible for delays, interruptions, or issues caused by third-party service providers, couriers, payment gateways, or external factors beyond our control.
                    </>
                )}
            </div>
        ),
    },
    {
        key: "law",
        title: isArabic ? "القانون والاختصاص القضائي" : "Governing Law & Jurisdiction",
        content: (
            <div className="privacy-discription">
                {isArabic ? (
                    <>
                        تخضع هذه الشروط للقوانين المعمول بها في الدولة التي تم فيها الشراء.
                        <br />
                        وفي حال حدوث أي تعارض، تسود قوانين دولة الإمارات العربية المتحدة.
                        <br />
                        تخضع أي نزاعات للاختصاص القضائي للمحاكم المختصة ضمن المنطقة المعنية.
                    </>
                ) : (
                    <>
                        These Terms are governed by the applicable laws of the country where the purchase is made. In the event of any conflict, UAE law shall prevail. Disputes will be subject to the jurisdiction of competent courts within the applicable region.
                    </>
                )}
            </div>
        ),
    },
    {
        key: "updates",
        title: isArabic ? "تحديثات هذه الشروط" : "Updates to These Terms",
        content: (
            <div className="privacy-discription">
                {isArabic ? (
                    <>
                        يجوز لنا تحديث أو تعديل هذه الشروط في أي وقت دون إشعار مسبق.
                        <br />
                        سيتم نشر التحديثات على هذه الصفحة، ويُعد استمرارك في استخدام منصتنا بعد نشر التحديثات قبولًا منك بالشروط المعدّلة.
                        <br />
                        نوصي بمراجعة هذه الصفحة بشكل دوري للبقاء على اطلاع على أي تغييرات.
                    </>
                ) : (
                    <>
                        We may update or revise these Terms at any time without prior notice. Updates will be published on this page, and continued use of our Platform after such updates constitutes your acceptance of the revised Terms.
                        <br />
                        We encourage you to review this page periodically to stay informed of any changes.
                    </>
                )}
            </div>
        ),
    },
    {
        key: "contact",
        title: isArabic ? "معلومات التواصل" : "Contact Information",
        content: (
            <>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            للاستفسارات أو الشكاوى أو طلب المساعدة، يمكنك التواصل معنا عبر:
                            <br />
                        </>
                    ) : (
                        <>
                            For questions, complaints, or assistance, reach out to us through:
                            <br />
                        </>
                    )}
                </div>
                <ul>
                    <li className="policylist">
                        <b>{isArabic ? "الخط الساخن:" : "Hotline:"}</b> (+971) 4 412 0000
                    </li>
                    <li className="policylist">
                        <b>{isArabic ? "واتساب:" : "WhatsApp:"}</b> (+971) 521 881 678
                    </li>
                    <li className="policylist">
                        <b>{isArabic ? "البريد الإلكتروني: " : "Email: "}</b>
                        <a className="underline text-primary" href="mailto:support@ourshopee.com">support@ourshopee.com</a>
                    </li>
                    <li className="policylist">
                        <b>{isArabic ? "ساعات الدعم:" : "Support Hours:"}</b> {isArabic ? "من الساعة ١١ صباحًا حتى ٨ مساءً، طوال أيام الأسبوع" : "11 AM – 8 PM, seven days a week"}
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
                    <b>{isArabic ? "متجرك الإلكتروني الموثوق في جميع أنحاء دول مجلس التعاون الخليجي —" : "Your trusted online store across the GCC —"}</b>
                </div>
                <i>{isArabic ? "توصيل سريع • مدفوعات آمنة • إرجاع خالٍ من المتاعب" : "Fast Delivery • Secure Payments • Hassle-Free Returns"}</i>
                <div className="p-2" />
            </>
        ),
    },
    ];
};

const Termandcondition = () => {
    const currentLanguage = useCurrentLanguage();
    const termsTitle = useContent("footer.termsAndConditions");
    const sectionsData = getSectionsData(currentLanguage);
    
    return (
        <Container fluid className="homepagecontainer">
            <div className="mt-2">
                <BreadComp title={termsTitle} />
            </div>

            <div className="footerpagesheader">{termsTitle}</div>

            {sectionsData.map(({ key, title, content }) => (
                <Section key={key} title={title}>
                    {content}
                </Section>
            ))}
        </Container>
    );
};

export default Termandcondition;