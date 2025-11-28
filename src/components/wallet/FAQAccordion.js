import { useState, useRef } from "react";
import { getAssetsUrl } from "../utils/helpers";
import { GiDiamonds } from "react-icons/gi";

const faqData = [
  {
    question: "How to purchase Saver Zone products?",
    answer:
      "Saver Zone Terms – Grab any branded products in this list with unbeatable offers and save more. Each order is eligible for 1 Saver Zone Product only. Every order should fulfill minimum purchase amount and it varies as per products in this list. Terms and Conditions Applied.",
  },
  {
    question: "What are the refund policies for digital coins?",
    answer:
      "Saver Zone Terms – Grab any branded products in this list with unbeatable offers and save more. Each order is eligible for 1 Saver Zone Product only. Every order should fulfill minimum purchase amount and it varies as per products in this list. Terms and Conditions Applied.",
  },
  {
    question: "How can I check my wallet balance?",
    answer:
      "Saver Zone Terms – Grab any branded products in this list with unbeatable offers and save more. Each order is eligible for 1 Saver Zone Product only. Every order should fulfill minimum purchase amount and it varies as per products in this list. Terms and Conditions Applied.",
  },
  {
    question: "What should I do if my transaction fails?",
    answer:
      "Saver Zone Terms – Grab any branded products in this list with unbeatable offers and save more. Each order is eligible for 1 Saver Zone Product only. Every order should fulfill minimum purchase amount and it varies as per products in this list. Terms and Conditions Applied.",
  },
  {
    question: "Is there a limit on coin refunds?",
    answer:
      "Saver Zone Terms – Grab any branded products in this list with unbeatable offers and save more. Each order is eligible for 1 Saver Zone Product only. Every order should fulfill minimum purchase amount and it varies as per products in this list. Terms and Conditions Applied.",
  },
  {
    question: "How do I contact customer support for wallet issues?",
    answer:
      "Saver Zone Terms – Grab any branded products in this list with unbeatable offers and save more. Each order is eligible for 1 Saver Zone Product only. Every order should fulfill minimum purchase amount and it varies as per products in this list. Terms and Conditions Applied.",
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
    <div className="bg-white p-8 rounded-[32px] lg:w-[42rem] w-[100vw] h-[72vh] overflow-hidden">
      <h2 className="text-2xl font-semibold mb-4">Commonly Asked Questions</h2>
      <div className="flex flex-col gap-1.5 overflow-y-auto">
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
  );
};

export default FAQAccordion;
