"use client";
import React, { memo } from "react";
import { Container } from "react-bootstrap";
import BreadComp from "../../components/Myaccount/BreadComp";
import starimg from "../../images/Sta5r.png";
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
            <div className="privacytitle">{isArabic ? "سياسة الإرجاع والاستبدال" : "Return and Replacement Policy"}</div>
            <div className="privacy-discription">
                {isArabic ? (
                    <>
                        في OurShopee، نرغب في أن تتسوق بثقة تامة.
                        <br />
                        إذا لم تكن راضيًا تمامًا عن عملية الشراء الخاصة بك، فنحن هنا لمساعدتك.
                        <br />
                        إذا كنت تبحث عن كيفية تقديم طلب استرداد أو إرجاع، يُرجى الانتقال إلى صفحة المطالبات (Claims).
                    </>
                ) : (
                    <>
                        At OurShopee, we want you to shop with confidence. If you're not fully satisfied with your purchase, we're here to help. If you are looking for how to raise a refund or a return, please proceed to this page Claims.
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
        key: "eligibility",
        title: isArabic ? "أهلية الإرجاع" : "Return Eligibility",
        content: (
            <>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            شكرًا لتسوقك في OurShopee.
                            <br />
                            نقدّر ثقتك في اختيارك التسوق معنا، ونسعى دائمًا لتقديم تجربة تسوق مُرضية أثناء استكشافك وتقييمك وشرائك لمنتجاتنا.
                        </>
                    ) : (
                        <>
                            Thanks for shopping at Ourshopee. We appreciate the fact that you like to shop with us. We also want to make sure you have a rewarding experience while you're exploring, evaluating, and purchasing our products.
                        </>
                    )}
                </div>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            وكما هو الحال في أي تجربة تسوق، هناك شروط وأحكام تنطبق على المعاملات في OurShopee.
                            <br />
                            سنُبقي الشروط موجزة قدر الإمكان وفق ما يسمح به الإطار القانوني.
                            <br />
                            النقطة الأساسية التي يجب تذكرها هي أنه من خلال تقديم طلب عبر الدفع عند الاستلام (COD) أو إجراء عملية شراء عبر موقع OurShopee الإلكتروني أو تطبيقه، فإنك توافق على الشروط الموضحة أدناه بالإضافة إلى سياسة الإرجاع.
                        </>
                    ) : (
                        <>
                            As with any shopping experience, there are terms and conditions that apply to transactions at Ourshopee. We'll be as brief as our attorneys will allow. The main thing to remember is that by placing an order via COD or making a purchase at Ourshopee website/app, you agree to the terms set forth below along with Return Policy.
                        </>
                    )}
                </div>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            يمكنك طلب إرجاع المنتج خلال ٧ أيام من استلام الطلب في الحالات التالية:
                        </>
                    ) : (
                        <>
                            You can request a return within 7 days of receiving your order if:
                        </>
                    )}
                </div>
                <ul>
                    <li className="policylist">{isArabic ? "إذا كان المنتج تالفًا أو معيبًا أو غير مطابق للوصف." : "The product is damaged, defective, or not as described"}</li>
                    <li className="policylist">{isArabic ? "إذا استلمت منتجًا خاطئًا أو كان هناك منتج مفقود." : "You received a wrong or missing item"}</li>
                    <li className="policylist">{isArabic ? "إذا كان المنتج غير مستخدم، وفي عبوته الأصلية، ويشمل جميع الملحقات أو الكتيبات." : "The product is unused, in original packaging, and includes all accessories or manuals"}</li>
                </ul>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            تحتفظ OurShopee بالحق في رفض طلب الإرجاع وإعادة المنتج إلى العميل إذا لم يستوفِ معايير الإرجاع الموضحة أدناه.
                        </>
                    ) : (
                        <>
                            Ourshopee reserves the right to reject a return request and return the product to the customer if it does not meet the return criteria outlined below.
                        </>
                    )}
                </div>
            </>
        ),
    },
    {
        key: "replacement",
        title: isArabic ? "أهلية الاستبدال" : "Replacement Eligibility",
        content: (
            <>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            لإتمام عملية استبدال المنتج، يجب على العميل أولاً تسليم المنتج الأصلي قبل البدء في إجراءات الاستبدال.
                        </>
                    ) : (
                        <>
                            For product replacement, the customer must first hand over the original item before the replacement can be processed.
                        </>
                    )}
                </div>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            بعد إجراء الفحص اللازم، سيقوم أحد ممثلي OurShopee بالتنسيق وترتيب استلام المنتج في حال الموافقة على الاستبدال.
                        </>
                    ) : (
                        <>
                            Basis inspection, our Agent will coordinate and arrange for a pickup in case of Replacement.
                        </>
                    )}
                </div>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            في حال رفض العميل طلب الإرجاع، ستقوم OurShopee بمحاولة إعادة تسليم المنتج إلى العميل مرتين باستخدام شركات الشحن المعتمدة.
                        </>
                    ) : (
                        <>
                            If a return request is declined by a customer, Ourshopee will attempt to deliver the product back to the customer twice using approved courier services.
                        </>
                    )}
                </div>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            وإذا لم تنجح محاولتا التسليم، ستقوم OurShopee بالاحتفاظ بالمنتج لمدة ثلاثة (٣) أيام عمل في مركز التوزيع الخاص بها.
                        </>
                    ) : (
                        <>
                            If both delivery attempts are unsuccessful, Ourshopee will hold the product for three (3) business days at its delivery hub.
                        </>
                    )}
                </div>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            وفي حال رغب العميل لاحقًا في استلام المنتج، تُطبَّق رسوم إرجاع عند استعادته.
                        </>
                    ) : (
                        <>
                            If later customers are still interested, RETURN FEE will apply if claimed back.
                        </>
                    )}
                </div>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            تستغرق عملية الاستبدال بالكامل مدة تتراوح بين ٧ إلى ١٥ يومًا، وذلك اعتمادًا على مدى تنسيق العميل مع موظف خدمة العملاء.
                        </>
                    ) : (
                        <>
                            The total replacement process can take 7-15 days depending on customer coordination with our CS agent.
                        </>
                    )}
                </div>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            تُنفَّذ جميع عمليات الاستبدال وفقًا للشروط والأحكام الخاصة بـ OurShopee.
                        </>
                    ) : (
                        <>
                            All replacements are processed in accordance with OurShopee's Terms & Conditions
                        </>
                    )}
                </div>
            </>
        ),
    },
    {
        key: "nonreturnable",
        title: isArabic ? "المنتجات غير القابلة للإرجاع" : "Non-Returnable Items",
        content: (
            <>
                <div className="privacy-discription">{isArabic ? "لا يمكن إرجاع المنتجات التالية:" : "The following items cannot be returned:"}</div>
                <ul>
                    <li className="policylist">
                        {isArabic ? (
                            <>
                                الفئات مثل: الألعاب والدمى، المستلزمات المنزلية، المطبخ وأدوات الطعام، الملابس، الحقائب والأحذية، الأثاث المنزلي، العطور، منتجات الصحة والجمال.
                            </>
                        ) : (
                            <>
                                Categories like Toys & Games, Home Essentials, Kitchen & Dining, Clothing, Bags & Shoes, Home Furniture, Perfume, Health & Beauty.
                            </>
                        )}
                    </li>
                    <li className="policylist">{isArabic ? "البرامج أو الألعاب أو المنتجات الرقمية بعد فتحها أو تفعيلها." : "Software, games, or digital products once opened or activated."}</li>
                    <li className="policylist">{isArabic ? "الأجهزة الإلكترونية الخاصة بالأم والطفل بعد فتحها." : "Mother and Baby electronics products once opened."}</li>
                    <li className="policylist">{isArabic ? "المنتجات التي تعرضت للتلف بسبب سوء الاستخدام أو نتيجة الاستهلاك العادي." : "Items damaged due to misuse or wear and tear."}</li>
                    <li className="policylist">{isArabic ? "المنتجات التي لا تحتوي على العبوة الأصلية أو التي تمت إزالة الرقم التسلسلي منها." : "Products without original packaging or serial numbers removed."}</li>
                </ul>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            بالنسبة للمنتجات المستعملة (Pre-Owned)، يمكن للعميل إرجاع المنتج بسبب تغيير الرأي، ومع ذلك قد يتم خصم رسوم لتعويض التكاليف التشغيلية، وتتراوح هذه الرسوم بين ٠٪ و٢٠٪ من سعر المنتج بالإضافة إلى رسوم الشحن.
                        </>
                    ) : (
                        <>
                            For Pre-Owned, you can return a product for a change of mind reason. We might still deduct a fee to compensate for operational expenses. This fee could be between 0 and 20% of the item price + shipping fees.
                        </>
                    )}
                </div>
            </>
        ),
    },
    {
        key: "request",
        title: isArabic ? "كيفية تقديم طلب إرجاع أو استبدال" : "How to Request a Return/Replacement",
        content: (
            <>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            يمكنك التواصل عبر أي من قنوات الدعم التالية:
                        </>
                    ) : (
                        <>
                            You can reach out through any support channels like :
                        </>
                    )}
                </div>
                <ul>
                    <li className="policylist">{isArabic ? "الخط الساخن: (971) 4 4120000" : "Hotline - (971) 4 4120000"}</li>
                    <li className="policylist">{isArabic ? "واتساب: (971) 521881678" : "Whatsapp - (971) 521881678"}</li>
                    <li className="policylist">
                        {isArabic ? (
                            <>
                                البريد الإلكتروني: <a href="mailto:support@ourshopee.com">support@ourshopee.com</a>
                            </>
                        ) : (
                            <>
                                Email - <a href="mailto:support@ourshopee.com">support@ourshopee.com</a>
                            </>
                        )}
                    </li>
                </ul>
            </>
        ),
    },
    {
        key: "refund",
        title: isArabic ? "عملية استرداد المبلغ (٧ أيام)" : "Refund Process (7 Days)",
        content: (
            <>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            بمجرد استلام المنتج وفحصه، سيتم إصدار المبلغ المسترد وفقًا لطريقة الدفع المستخدمة:
                        </>
                    ) : (
                        <>
                            Once the product is received and inspected, we'll issue a refund based on your payment method:
                        </>
                    )}
                </div>
                <div className="privacy-discription">
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>{isArabic ? "طريقة الدفع" : "Payment Method"}</th>
                                    <th>{isArabic ? "طريقة الاسترداد" : "Refund Method"}</th>
                                    <th>{isArabic ? "مدة الاسترداد" : "Refund Timeline"}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{isArabic ? "بطاقة الائتمان/الخصم" : "Credit / Debit Card"}</td>
                                    <td>{isArabic ? "محفظة OurShopee / بوابة الدفع" : "OurShopee Wallet/ Payment Gateway"}</td>
                                    <td>{isArabic ? "خلال ٧ أيام عمل" : "Within 7 business days"}</td>
                                </tr>
                                <tr>
                                    <td>{isArabic ? "Tabby / Tamara / أخرى" : "Tabby / Tamara/ Other"}</td>
                                    <td>{isArabic ? "محفظة OurShopee / بوابة الدفع" : "OurShopee Wallet/ Payment Gateway"}</td>
                                    <td>{isArabic ? "خلال ٧ أيام عمل" : "Within 7 business days"}</td>
                                </tr>
                                <tr>
                                    <td>{isArabic ? "الدفع عند الاستلام" : "Cash on Delivery"}</td>
                                    <td>{isArabic ? "محفظة OurShopee / بوابة الدفع" : "OurShopee Wallet /Payment Gateway"}</td>
                                    <td>{isArabic ? "خلال ٧ أيام عمل" : "Within 7 business days"}</td>
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
        title: isArabic ? "السياسة الإقليمية" : "Regional Policy",
        content: (
            <>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            <b>الإمارات العربية المتحدة:</b> تتوفر خيارات الدفع عبر Tabby وTamara وبطاقات الائتمان/الخصم.
                        </>
                    ) : (
                        <>
                            UAE: Payments via Tabby, Tamara, and Credit/Debit Cards are supported.
                        </>
                    )}
                </div>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            <b>عُمان، المملكة العربية السعودية، قطر، البحرين، الكويت:</b> تتوفر خيارات الدفع عبر بطاقات الائتمان/الخصم أو الدفع عند الاستلام (COD).
                            <br />
                            تُعالج عمليات استرداد المبالغ من خلال روابط دفع إلكترونية أو رصيد المحفظة.
                        </>
                    ) : (
                        <>
                            Oman, KSA, Qatar, Bahrain, Kuwait, KSA: Payments via Credit/Debit Card or COD. Refunds are processed through payment links or wallet credit.
                        </>
                    )}
                </div>
            </>
        ),
    },
    {
        key: "warranty",
        title: isArabic ? "مطالبات الضمان" : "Warranty Claims",
        content: (
            <>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            <b>المنتجات المستعملة (Pre-Owned):</b> تشملها ضمان لمدة سنة واحدة من OurShopee.com.
                        </>
                    ) : (
                        <>
                            Pre-Owned 1yr Warranty covered by Ourshopee.com.
                        </>
                    )}
                </div>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            <b>المنتجات المشمولة بضمان الشركة المصنّعة</b> يمكن صيانتها أو استبدالها وفقًا لشروط العلامة التجارية أو المنتج.
                            <br />
                            <b>الفئات المشمولة بالضمان</b> تشمل: الرياضة، اللياقة البدنية وركوب الدراجات، الهواتف المحمولة والأجهزة اللوحية، أجهزة الكمبيوتر المحمولة والمكتبية، أجهزة الألعاب، الإلكترونيات، الكاميرات، أجهزة التلفزيون والإكسسوارات، الأدوات والمعدات، الساعات ذات العلامات التجارية، ومنتجات العناية بالأم والطفل.
                        </>
                    ) : (
                        <>
                            Products covered under manufacturer warranty can be serviced or replaced as per brand, product terms. Categories: Sports, Fitness & Cycling, Mobiles & Tablets, Laptops & Computers, Gaming Console, Electronics, Cameras, Television & Accessories, Tools & Hardware Equipments, Watches - Branded, Baby & Mother care.
                        </>
                    )}
                </div>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            يمكنك تقديم طلب ضمان عبر التواصل مع فريق الدعم لدينا مع تزويدهم برقم الطلب وتفاصيل المنتج.
                        </>
                    ) : (
                        <>
                            You can raise a warranty request by contacting our support team with your order ID and product details.
                        </>
                    )}
                </div>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            ولا يشمل الضمان أي أضرار ناتجة عن تلف مادي أو كسر.
                        </>
                    ) : (
                        <>
                            If there is any physical damage, it is not covered in warranty.
                        </>
                    )}
                </div>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            ويمكننا تقديم خدمة مميزة (+A Service) بناءً على الطلب، ولكنها ستخضع لرسوم إضافية يتحملها العميل بحسب رقم الصنف (SKU).
                        </>
                    ) : (
                        <>
                            We can offer A+ Service upon request; however, it will incur additional charges for the customer depending on the SKU.
                        </>
                    )}
                </div>
            </>
        ),
    },
    {
        key: "notes",
        title: isArabic ? "ملاحظات هامة" : "Important Notes",
        content: (
            <>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            لإتمام عملية استبدال المنتج، يجب على العميل أولاً تسليم المنتج الأصلي قبل البدء في إجراءات الاستبدال.
                        </>
                    ) : (
                        <>
                            For product replacement, the customer must first hand over the original item before the replacement can be processed.
                        </>
                    )}
                </div>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            تخضع المنتجات المُعادة للموافقة من فريق OurShopee قبل قبولها نهائيًا.
                        </>
                    ) : (
                        <>
                            Items returned will be approved by the Ourshoppe team before it is accepted.
                        </>
                    )}
                </div>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            قد تختلف المدة الزمنية لاسترداد المبلغ خلال العطلات الرسمية أو فترات العروض الكبرى.
                        </>
                    ) : (
                        <>
                            Refund timelines may vary during public holidays or high-sale periods.
                        </>
                    )}
                </div>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            تحتفظ OurShopee بالحق في رفض أي طلب إرجاع لا يستوفي الشروط الموضحة أعلاه.
                        </>
                    ) : (
                        <>
                            OurShopee reserves the right to reject returns that do not meet the above conditions.
                        </>
                    )}
                </div>
            </>
        ),
    },
    {
        key: "consent",
        title: isArabic ? "موافقتك" : "Your Consent",
        content: (
            <>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            باستخدامك لموقعنا الإلكتروني أو تسجيل حساب أو إتمام عملية شراء، فإنك تُقر بموافقتك على سياسة الإرجاع واسترداد المبالغ وتوافق على جميع بنودها.
                        </>
                    ) : (
                        <>
                            By using our website, registering an account, or making a purchase, you hereby consent to our Return & Refund Policy and agree to its terms.
                        </>
                    )}
                </div>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            وفي حال قمنا بتحديث أو تعديل أو إجراء أي تغييرات على هذا المستند لتواكب خدماتنا وسياساتنا، فستُنشر هذه التغييرات بشكل واضح على هذه الصفحة.
                            <br />
                            وباستمرارك في استخدام الخدمة بعد نشر التحديثات، فإنك تكون ملزمًا بسياسة الإرجاع واسترداد المبالغ المحدثة.
                            <br />
                            أما إذا كنت لا ترغب في الموافقة على السياسة الحالية أو المحدثة، يمكنك حذف حسابك في أي وقت.
                        </>
                    ) : (
                        <>
                            Should we update, amend or make any changes to this document so that they accurately reflect our Service and policies. Unless otherwise required by law, those changes will be prominently posted here. Then, if you continue to use the Service, you will be bound by the updated Return & Refund Policy. If you do not want to agree to this or any updated Return & Refund Policy, you can delete your account.
                        </>
                    )}
                </div>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            تُعد البيانات الشخصية والمعلومات المخزنة على الأجهزة مسؤولية العملاء بالكامل، ويُنصح العملاء بإنشاء نسخ احتياطية لبياناتهم، وإيقاف خاصية Find My iPhone (FMI)، وإزالة أي قفل أو كلمة مرور قبل تسليم الجهاز للصيانة.
                        </>
                    ) : (
                        <>
                            Personal Data and information on devices are the responsibility of customers and customers are advised to make back-ups for their data, switch off FMI, remove lock/password prior to servicing the device.
                        </>
                    )}
                </div>
            </>
        ),
    },
    {
        key: "help",
        title: isArabic ? "هل تحتاج إلى المساعدة؟" : "Need Help?",
        content: (
            <>
                <div className="privacy-discription">
                    {isArabic ? (
                        <>
                            إذا لم تكن راضيًا تمامًا عن أي منتج أو خدمة نقدمها، فلا تتردد في التواصل معنا، وسنقوم بمراجعة مشكلتك ومساعدتك بأسرع وقت ممكن.
                            <br />
                            لأي دعم أو استفسار، يمكنك التواصل عبر:
                        </>
                    ) : (
                        <>
                            If, for any reason, You are not completely satisfied with any good or service that we provide, don't hesitate to contact us and we will discuss any of the issues you are going through with our product. For any assistance, reach out to us:
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
                        <a href="mailto:support@ourshopee.com">support@ourshopee.com</a>
                    </li>
                    <li className="policylist">{isArabic ? "متاحون لخدمتك طوال أيام الأسبوع من الساعة ١١ صباحًا حتى ٨ مساءً." : "Available 7 days a week, 11 AM – 8 PM"}</li>
                </ul>
            </>
        ),
    },
    {
        key: "signature",
        title: isArabic ? "OurShopee – متجرك الإلكتروني الموثوق في جميع أنحاء دول مجلس التعاون الخليجي" : "OurShopee – Your Trusted Online Store Across GCC",
        content: (
            <>
                <i>{isArabic ? "توصيل سريع • مدفوعات آمنة • إرجاع خالٍ من المتاعب" : "Fast Delivery • Secure Payments • Hassle-Free Returns"}</i>
                <div className="p-2"></div>
            </>
        ),
    },
    ];
};

const ReturnReplacementPolicy = () => {
    const currentLanguage = useCurrentLanguage();
    const returnPolicyTitle = useContent("footer.returnAndReplacementPolicy");
    const introBlock = getIntroBlock(currentLanguage);
    const sectionsData = getSectionsData(currentLanguage);
    
    return (
        <Container fluid className="homepagecontainer">
            <div className="mt-2">
                <BreadComp title={returnPolicyTitle} />
            </div>

            <div className="footerpagesheader">{returnPolicyTitle}</div>

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
