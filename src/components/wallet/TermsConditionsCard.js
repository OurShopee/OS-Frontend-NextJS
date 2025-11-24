import React from "react";
import { GiDiamonds } from "react-icons/gi";

const termsData = [
  {
    title: "Introduction",
    content: [
      "By using the OurShopee platform, you agree to comply with these Terms and Conditions, as well as all applicable laws and regulations. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your device. You agree to be responsible for all activities that occur under your account.",
      "You must not use OurShopee for any illegal or unauthorized purpose. You must not violate any laws in your jurisdiction. You agree not to engage in any activity that disrupts or interferes with the platform. You agree not to reproduce, duplicate, copy, sell, or exploit any portion of the platform.",
      "Violation of these terms may result in termination of your account.",
    ],
  },
  {
    title: "Your account and amendment to the terms of use",
    content: [
      "When you create an account with OurShopee, you agree to provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your password and account and for all activities that occur under your account. OurShopee reserves the right to modify or revise these terms of use at any time.",
    ],
  },
  {
    title: "Your account and amendment to the terms of use",
    content: [
      "When you create an account with OurShopee, you agree to provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your password and account and for all activities that occur under your account.",
    ],
  },
];

const TermsConditionsCard = () => (
  <div className="bg-white p-8 rounded-[32px] w-[42rem] h-[72vh] overflow-y-auto">
    <h2 className="text-2xl font-semibold mb-4">Terms & Conditions</h2>
    <div className="flex flex-col">
      {termsData.map((section, idx) => (
        <div key={section.title} className="mb-6">
          <div className="flex items-center gap-2 mb-1.5">
            <GiDiamonds className="text-[#43494B] text-sm" />
            <span
              className={`font-semibold text-base ${
                idx === 0 ? "text-[#191B1C]" : "text-[#191B1C]"
              }`}
            >
              {section.title}
            </span>
          </div>
          {section.content.map((text, subIdx) => (
            <p
              key={subIdx}
              className="text-[#43494B] text-sm leading-relaxed mb-4 last:mb-0"
            >
              {text}
            </p>
          ))}
          {idx < termsData.length - 1 && (
            <hr className="" />
          )}
        </div>
      ))}
    </div>
  </div>
);

export default TermsConditionsCard;
