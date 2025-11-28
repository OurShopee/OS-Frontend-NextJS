import { useState, useRef } from "react";
import { getAssetsUrl } from "../utils/helpers";
import { GiDiamonds } from "react-icons/gi";

const faqData = [
  {
    question: "What is OurShopee Wallet?",
    answer:
      "OurShopee Wallet is a secure digital balance where refunds, cashback, and promotional credits are stored. You can use this balance to pay for future orders on OurShopee.",
  },
  {
    question: "How do I add money to my Wallet?",
    answer: (
      <>
        Customers cannot manually add money. The wallet is credited only
        through:
        <ul className="list-disc ml-5 mt-2">
          <li>Refunds for returned/cancelled orders</li>
          <li>Cashback or promotional rewards</li>
          <li>Compensation approved by Customer Support</li>
        </ul>
      </>
    ),
  },
  {
    question: "How can I use my Wallet balance?",
    answer: (
      <>
        You can use your wallet balance during checkout:
        <ul className="list-disc ml-5 mt-2">
          <li>Select 'Use Wallet Balance' during checkout</li>
          <li>The balance will be auto-deducted from your order total</li>
          <li>Any remaining amount can be paid via Cash/Card/Online payment</li>
        </ul>
      </>
    ),
  },
  {
    question: "Does the Wallet balance expire?",
    answer: (
      <ul className="list-disc ml-5">
        <li>Refund amount: No expiry</li>
        <li>
          Cashback & promotional credits: Valid only for the campaign period or
          as mentioned in offer terms
        </li>
      </ul>
    ),
  },
  {
    question: "How do I check my Wallet balance?",
    answer:
      "Go to: My Account → Wallet → Wallet Balance & Transactions to view your current balance and transaction history.",
  },
  {
    question: "Can I transfer my Wallet balance to another user?",
    answer:
      "No. Wallet balance is non-transferable and can only be used for purchases on OurShopee.",
  },
  {
    question: "Can I withdraw my Wallet balance as cash?",
    answer:
      "No. Wallet balance cannot be withdrawn, transferred to a bank, or converted into cash.",
  },
  {
    question: "What happens if my order is cancelled?",
    answer:
      "If you paid using Wallet, the amount will be refunded back to your Wallet instantly.",
  },
  {
    question: "What happens if the Wallet balance is not enough?",
    answer: (
      <>
        You can still complete your order:
        <ul className="list-disc ml-5 mt-2">
          <li>The wallet will partially pay the amount</li>
          <li>
            Remaining amount can be paid via Cash on Delivery / Credit/Debit
            Card / Online Payment
          </li>
        </ul>
      </>
    ),
  },
  {
    question: "How are Wallet transactions tracked?",
    answer: (
      <>
        You can view complete transaction history under: Wallet → Statement /
        Transactions
        <br />
        Each entry includes date, amount, type (credit/debit), and reference.
      </>
    ),
  },
  {
    question: "Can I use Wallet balance with COD orders?",
    answer:
      "Yes. Wallet can be used for any order. The remaining unpaid amount is collected via COD.",
  },
  {
    question: "Is Wallet balance applied automatically?",
    answer:
      "Yes, if enabled. You can toggle 'Apply Wallet Balance' during checkout.",
  },
  {
    question: "How do I contact support for Wallet issues?",
    answer: (
      <>
        You may contact: Customer Support support@ourshopee.com
        <br />
        <br />
        Provide order number, transaction ID, or screenshot for quick
        assistance.
      </>
    ),
  },
];

const FAQAccordion = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const answerRefs = useRef([]);

  const handleToggle = (index) => {
    setOpenIndex(index === openIndex ? null : index);

    setTimeout(() => {
      if (index !== openIndex && answerRefs.current[index]) {
        answerRefs.current[index].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }, 350);
  };

  return (
    <div className="bg-white p-8 rounded-[32px] lg:w-[42rem] w-[100vw]  overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-4">Commonly Asked Questions</h2>
      <div className="h-[65vh] overflow-y-auto">
        <div className="flex flex-col gap-1.5 ">
          {faqData.map((faq, i) => (
            <>
              <div
                key={faq.question}
                className={`rounded-xl ${
                  openIndex === i ? "bg-[#EDEDED]" : "bg-white"
                } border border-[#E7E8E9] overflow-hidden transition-shadow shadow-sm`}
              >
                <button
                  className="w-full flex items-center text-left px-3 py-6 focus:outline-none"
                  onClick={() => handleToggle(i)}
                >
                  <GiDiamonds className="text-[#43494B] mr-1 text-sm" />
                  <span className="text-sm font-normal text-[#191B1C]">
                    {faq.question}
                  </span>
                  <span className="ml-auto text-[#191B1C]">
                    <img
                      src={getAssetsUrl("vector_icons/arrow_right.svg")}
                      className={`w-3 h-3 transition-transform duration-300 ${
                        openIndex === i ? "-rotate-90" : "rotate-90"
                      }`}
                    />
                  </span>
                </button>
              </div>
              {faq.answer && (
                <div
                  ref={(el) => (answerRefs.current[i] = el)}
                  style={{
                    maxHeight: openIndex === i ? "200px" : "0px",
                    opacity: openIndex === i ? 1 : 0,
                    transition: "max-height 0.3s ease, opacity 0.3s ease",
                    overflow: "hidden",
                  }}
                >
                  <div className="text-sm my-1.5 font-normal text-[#191B1C] rounded-xl px-3 py-6 bg-[#EDEDED] border border-[#E7E8E9] overflow-hidden transition-shadow shadow-sm">
                    {faq.answer}
                  </div>
                </div>
              )}
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQAccordion;
