"use client"
import React, { useState } from "react";
import starimg from "@/images/Sta 5r.png"
import { Container } from "react-bootstrap";
import BreadComp from "@/components/Myaccount/BreadComp";
const FAQs = () => {
    const [expanded, setExpanded] = useState(1);

    const handleClick = (id) => {
        if(id == expanded){
            setExpanded(0);
        }else{
            setExpanded(id);
        }
    };

    var faqList = [
        {
          "id": 1,
          "question": "How to purchase Saver Zone products?",
          "answer": "Saver Zone Terms - Grab any branded products in this list with unbeatable offers and save more. Each order is eligible for 1 Saver Zone Product only. Every order should fulfill minimum purchase amount and it varies as per products in this list. Terms and Conditions Applied."
        },
        {
          "id": 2,
          "question": "How to purchase deal of the day products?",
          "answer": "• One offer product can be added per order with total minimum purchase amount of AED 35, 100 AED for free shipping.\n• After adding offer product to the cart, it can be removed incase if the customer wants to add another offer product.\n• Customer need to click on view cart and unselect any chosen product so that they can add a new offer product."
        },
        {
          "id": 3,
          "question": "Can you please update me if the size is back in stock?",
          "answer": "You shall be updated on priority as soon as we get your pick in stock."
        },
        {
          "id": 4,
          "question": "How can I reach you other than the contact number?",
          "answer": "The phone lines were disrupted. We regret the inconvenience caused to you. You can drop us a message and our customer service representative will connect with you."
        },
        {
          "id": 5,
          "question": "How can I make an inquiry about the product or know the order status?",
          "answer": "Want to know about the order status or inquire about the product? Give us a call at (971) 4 2582959 or drop an email at info@ourshopee.com , app@ourshopee.com"
        },
        {
          "id": 6,
          "question": "What can I do if your Customer Service Representative does not satisfy my need?",
          "answer": "In case the customer service representative does not satisfy you, we will appoint Chief Manager-Customer Service to resolve your issues. He will take 1 day to review the dispute and respond."
        },
        {
          "id": 7,
          "question": "How can I apply for jobs at Ourshopee.com?",
          "answer": "If you are interested to apply, drop in your email at [REACT_APP_CAREER_EMAIL] or through the career session on our website [REACT_APP_PRODUCT_URL]careers"
        },
        {
          "id": 8,
          "question": "How do I place an order?",
          "answer": "You can place the order online through our portal www.ourshoppe.com."
        },
        {
          "id": 9,
          "question": "How can I modify my order? Will you charge extra for it?",
          "answer": "Unfortunately, you cannot modify the order after you have placed it. The addition or the removal of the products is not possible. However, you can cancel the order and place a new one."
        },
        {
          "id": 10,
          "question": "What if I wish to change the delivery address after placing the order?",
          "answer": "Once you have placed the order, you cannot change the delivery address. However, you can cancel the order and place a new one with the preferred address."
        },
        {
          "id": 11,
          "question": "Can the delivery date be changed?",
          "answer": "You are requested to speak to the courier boy in this regard. Packaging and delivery from our end is always on time."
        },
        {
          "id": 12,
          "question": "What is the general order processing time?",
          "answer": "It generally takes a period of 2–5 days to process the order and dispatch it."
        },
        {
          "id": 13,
          "question": "How can I be assured that my order is placed successfully?",
          "answer": "Once you place the order, you will be given a confirmation message and an e-mail with the details of the products."
        },
        {
          "id": 14,
          "question": "If I receive my multiple product order at different times, should I pay the price for the respective product only or pay for the complete order?",
          "answer": "No, you will have to pay for the complete order as soon as you receive the first product."
        },
        {
          "id": 15,
          "question": "How can I update my billing address?",
          "answer": "You can update the billing address under the Profile Section. Go to the profile section → settings → address change → save the update."
        },
        {
          "id": 16,
          "question": "Can I cancel my order? If yes, how?",
          "answer": "Yes. You can cancel the order."
        },
        {
          "id": 17,
          "question": "Will I get a refund for my cancelled order?",
          "answer": "Yes, you can get a refund for the orders if it satisfies our normal terms and conditions."
        },
        {
          "id": 18,
          "question": "Do we have cancellation timeline?",
          "answer": "You can check the order status online. If in case, it has not been dispatched you can cancel the order. Post the dispatch, we do not accept complete cancellation. You can deny the acceptance of the products and will have to pay the amount. You can then later shop for the products of your choice."
        },
        {
          "id": 19,
          "question": "Can I return one/few products if I change my mind?",
          "answer": "Yes, we accept the return of one/ few products if you change your mind."
        },
        {
          "id": 20,
          "question": "Do you have any app so that I can shop over the phone?",
          "answer": "Yes, we do have a utility app powered by Android that can simplify your shopping experience."
        },
        {
          "id": 21,
          "question": "In case I am not satisfied with the products purchased after receiving the delivery, what can I do for it?",
          "answer": "If you do not find the products satisfactory as described, you can get the products exchanged within a period of 15 days or so."
        },
        {
          "id": 22,
          "question": "What should I do if the color of the outfit received is completely different from that displayed in the picture?",
          "answer": "This is rare to happen. You should always read the product description as well. However, if this has happened to you, you can get the product changed/replaced immediately."
        },
        {
          "id": 23,
          "question": "Do you deliver worldwide?",
          "answer": "We have a strong network of delivery channels across UAE, OMAN, QATAR, KUWAIT, BAHRAIN."
        },
        {
          "id": 24,
          "question": "Can I get number of a single item in one order or I have to make multiple orders?",
          "answer": "We do not entertain bulk orders. However, if it is about only one plus types of similar items, we can do it."
        },
        {
          "id": 25,
          "question": "What can be done if the size doesn’t fit at all?",
          "answer": "You can immediately place the request to exchange the product. In case we have the item in smaller/bigger size, we will exchange it. Or else you can buy another product in exchange for it."
        },
        {
          "id": 26,
          "question": "How can I add an item in the existing order that has already been placed?",
          "answer": "Unluckily, there is no such option. You will have to place a new order."
        },
        {
          "id": 27,
          "question": "What are the acceptable payment methods?",
          "answer": "Some of the popular payment methods that we accept are: Credit Card, Debit Card, Net Banking, Cash-On-Delivery."
        },
        {
          "id": 28,
          "question": "Do you levy extra charges if there is a Cash-on-Delivery purchase made?",
          "answer": "No. We don’t charge an additional fee for Cash on Delivery. You only have to pay the normal delivery charges stipulated by us."
        },
        {
          "id": 29,
          "question": "What should I do if the payment fails, but my account is debited with the amount?",
          "answer": "In case the payment is a failure and still the account gets debited, the payment will be credited back within 7 business days."
        },
        {
          "id": 30,
          "question": "Do you pose any hidden charges?",
          "answer": "The product price displayed includes all the taxes. Only the delivery charges will be extra in some cases."
        },
        {
          "id": 31,
          "question": "Do I get a notification before the delivery of the order?",
          "answer": "The customers will receive a notification via SMS. The courier person can also make a call to arrange convenient delivery."
        },
        {
          "id": 32,
          "question": "The committed delivery time of my order is over. What should I do?",
          "answer": "We regret the inconvenience. In such a case, you should immediately email or call customer care for support."
        },
        {
          "id": 33,
          "question": "Do you deliver orders on all weekdays?",
          "answer": "We complete all our order deliveries from Monday to Saturday except National and State Holidays."
        },
        {
          "id": 34,
          "question": "How do I track my order?",
          "answer": "You can track the order via email, SMS, or by calling customer care toll-free. Use your order number in all cases to know the status."
        },
        {
          "id": 35,
          "question": "The order delivery time has been exceeded. What should I do?",
          "answer": "We regret the inconvenience. If you haven’t received the delivery, please contact us at info@ourshopee.com, support@ourshopee.com, use the live chat on the website, or call us at (971) 4 2582959."
        },
        {
          "id": 36,
          "question": "Every time I browse your web page, it asks me to register. Is it necessary to get that done?",
          "answer": "No, it is not necessary, but registration can improve the shopping experience for you."
        },
        {
          "id": 37,
          "question": "I forgot my password. What should I do now?",
          "answer": "If you forgot your password, click on the “Lost your password” link below the login window to reset it."
        },
        {
          "id": 38,
          "question": "I feel bored entering the address and other details every time I shop. Is there an option to store this information?",
          "answer": "Yes, once you enter all the information, you can click on “save the details” to store it."
        },
        {
          "id": 39,
          "question": "How will you notify me for the deals, arrivals and discounts?",
          "answer": "We will notify you via SMS and email on your account."
        },
        {
          "id": 40,
          "question": "Which items can be exchanged?",
          "answer": "All items except innerwear, lingerie, beauty products, swimsuits, jewelry, and fragrances can be exchanged."
        },
        {
          "id": 41,
          "question": "I do not own a credit card/debit card/net banking. How can I make the payment?",
          "answer": "The customers can opt for the Cash-on-Delivery option."
        },
        {
          "id": 42,
          "question": "Do you limit the shopping for the Cash on Delivery options?",
          "answer": "No, we don’t keep any limit for the Cash-on-Delivery options."
        },
        {
          "id": 43,
          "question": "The Cash-on-Delivery option is not available for my location. How else can I make the payment?",
          "answer": "You can make the payment through other payment modes like Credit Card, Debit Card, and Net Banking."
        },
        {
          "id": 44,
          "question": "I realized that my card details have been compromised. What should I do?",
          "answer": "We do not store the card or bank details of customers. If this happens, please contact your bank immediately."
        },
        {
          "id": 45,
          "question": "How will the items be packed?",
          "answer": "We take care of each item in the order. The packaging will be waterproof with plastic or bubble wrap, especially for fragile items."
        },
        {
          "id": 46,
          "question": "How will the product delivery be done?",
          "answer": "We ensure on-time delivery with the help of authentic courier service companies."
        },
        {
          "id": 47,
          "question": "What should I do if I find (on delivery) that the product has been tampered with?",
          "answer": "If you feel that the product has been tampered with, do not accept the courier. You can call us immediately."
        },
        {
          "id": 48,
          "question": "After opening my packet, I found one of the products was broken. What should I do?",
          "answer": "You should pack the items along with its pieces intact. Then, drop an e-mail or contact the customer care representative."
        },
        {
          "id": 49,
          "question": "Where can I give my feedback?",
          "answer": "You are requested to give your valuable feedback on our 'Feedback' page. You can also rate us through our Facebook, Twitter, Instagram, and other social media pages."
        },
        {
          "id": 50,
          "question": "Can you keep me posted on the latest additions?",
          "answer": "Check our website for the latest additions. Register your email ID to receive regular updates."
        },
        {
          "id": 51,
          "question": "Please tell me about the return/refund policy?",
          "answer": "We do provide refund facilities, but only for certain products. Customers may also request exchanges. The process usually takes 3–7 days."
        },
        {
          "id": 52,
          "question": "Looking for pocket-friendly products?",
          "answer": "• Ourshopee refurbished products are a great option for your needs and budget.\n• Refurbished products are in better condition than second-hand items.\n• All refurbished products undergo a rigorous quality check to fix all issues.\n• A team of professionals tests and restores them to perfect working condition.\n• Refurbished products show little to no sign of external damage.\n• For your peace of mind, we provide a 1-month Ourshopee warranty."
        }
      ];

    return (
        <Container fluid className="homepagecontainer">
            <div className="mt-2 ">

                <BreadComp title={"FAQ’s"} />
            </div>
            <div className="footerpagesheader">
                Commonly searched FAQ’s
            </div>

            <div className="faq_list">
                {
                    faqList.map((item) => {
                        return (
                            <div className="mb-3">
                                <div className="faq_item" onClick={() => handleClick(item.id)} style={{background : expanded != item.id && '#fff'}}>
                                    <div className="d-flex align-items-center justify-content-center">
                                        <img src={starimg.src} />
                                        <h6 className="ms-2 mb-0">{item.question}</h6>
                                    </div>
                                    {
                                        expanded == item.id ?
                                            <img src={'/assets/vector_icons/arrow_up.png'} />
                                            :
                                            <img src={'/assets/vector_icons/arrow_down.png'} />

                                    }
                                </div>
                                {
                                    expanded == item.id &&
                                    <div className="faq_body">
                                        <p>{item.answer}</p>
                                    </div>
                                }
                            </div>
                        )
                    })
                }

            </div>

        </Container>
    )
}
export default FAQs;