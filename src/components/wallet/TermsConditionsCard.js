import React from "react";
import { GiDiamonds } from "react-icons/gi";

const termsData = [
  {
    title: "Introduction",
    content: (
      <>
        These Terms and Conditions ("Terms") govern the use of the OurShopee
        Wallet ("Wallet"). By using the Wallet, customers agree to these Terms.
        If you do not agree, please stop using the Wallet service.
      </>
    ),
  },
  {
    title: "Eligibility",
    content: (
      <ul className="list-disc ml-5">
        <li>
          Wallet is available only to registered OurShopee customers within the
          registered region.
        </li>
        <li>Customers must maintain accurate and valid account information.</li>
      </ul>
    ),
  },
  {
    title: "Wallet Balance Structure",
    content: (
      <>
        Your Wallet balance may consist of the following:
        <ol className="list-decimal ml-5 mt-2">
          <li>
            <strong>Refund Amounts</strong> – credited for cancelled or returned
            orders.
          </li>
          <li>
            <strong>Adjustment Credits</strong> – manual credits added by
            OurShopee support after verification.
          </li>
        </ol>
        <p className="mt-3 font-semibold">Important</p>
        <ul className="list-disc ml-5">
          <li>
            Wallet balance{" "}
            <strong>cannot be transferred to bank account</strong>,{" "}
            <strong>cannot be withdrawn as cash</strong>, and{" "}
            <strong>cannot be exchanged for money</strong>.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Adding Funds",
    content: (
      <>
        Currently, customers <strong>cannot manually add money</strong> to the
        Wallet.
        <br />
        Wallet balance is updated only through refunds or support adjustments.
      </>
    ),
  },
  {
    title: "Using Wallet Balance",
    content: (
      <ul className="list-disc ml-5">
        <li>
          Wallet balance can be used to pay for orders placed on OurShopee
          website/app.
        </li>
        <li>
          If the wallet amount does not cover the full order total, customers
          must pay the difference via available payment methods.
        </li>
        <li>
          OurShopee reserves the right to set limits on wallet usage based on
          region, order type, or payment mode.
        </li>
      </ul>
    ),
  },
  {
    title: "Refunds to Wallet",
    content: (
      <ul className="list-disc ml-5">
        <li>
          Cancelled or returned orders are refunded{" "}
          <strong>directly to the Wallet</strong> unless otherwise specified.
        </li>
        <li>
          Refund will follow the standard{" "}
          <strong>OurShopee Return & Refund Policy</strong> (link to be given).
        </li>
        <li>
          Refund timelines vary by:
          <ul className="list-disc ml-5 mt-1">
            <li>payment method,</li>
            <li>courier confirmation,</li>
            <li>country-specific processing times.</li>
          </ul>
        </li>
      </ul>
    ),
  },
  {
    title: "Wallet Transaction History",
    content: (
      <ul className="list-disc ml-5">
        <li>
          All credits and debits made to the Wallet will appear in the
          customer's "Wallet Transactions."
        </li>
        <li>
          Customers must check their Wallet regularly and report any issues
          within <strong>7 working days</strong>.
        </li>
      </ul>
    ),
  },
  {
    title: "Expiry of Credits",
    content: (
      <ul className="list-disc ml-5">
        <li>
          Refund amounts do <strong>not</strong> expire.
        </li>
      </ul>
    ),
  },
  {
    title: "Restrictions / Prohibited Use",
    content: (
      <>
        Customers may not:
        <ul className="list-disc ml-5 mt-2">
          <li>
            Use the Wallet for fraudulent activities (multiple accounts, fake
            returns, or manipulation).
          </li>
          <li>Transfer Wallet balance to other users.</li>
          <li>
            Withdraw Wallet balance to banks/cards (except in rare cases
            approved by support for legitimate refundable amounts).
          </li>
        </ul>
        <p className="mt-3">
          OurShopee may block or reverse Wallet amounts if fraudulent activity
          is detected.
        </p>
      </>
    ),
  },
  {
    title: "Account Deactivation or Suspension",
    content: (
      <ul className="list-disc ml-5">
        <li>
          If an account is suspended due to policy violations, the Wallet
          balance may be frozen or forfeited.
        </li>
        <li>
          Customers with legitimate refundable amounts may request verification
          through Customer Support.
        </li>
      </ul>
    ),
  },
  {
    title: "Liability",
    content: (
      <ul className="list-disc ml-5">
        <li>
          OurShopee is not responsible for Wallet misuse caused by sharing
          passwords, OTPs, or account credentials.
        </li>
        <li>Customers must keep their login details confidential.</li>
      </ul>
    ),
  },
  {
    title: "Changes to Wallet Terms",
    content: (
      <ul className="list-disc ml-5">
        <li>OurShopee may update or modify these Terms at any time.</li>
        <li>
          Continued use of the Wallet after updates means acceptance of the new
          Terms.
        </li>
      </ul>
    ),
  },
  {
    title: "Customer Support",
    content: (
      <>
        For questions, discrepancies, or Wallet-related concerns, customers can
        contact:
        <ul className="list-disc ml-5 mt-2">
          <li>
            <strong>Email:</strong> support@ourshopee.com
          </li>
          <li>
            <strong>Hotline:</strong> Based on customer's country
          </li>
        </ul>
      </>
    ),
  },
];


const TermsConditionsCard = () => (
  <div className="bg-white p-8 rounded-[32px] lg:w-[42rem] w-[100vw] h-[72vh] flex flex-col">
    <h2 className="text-2xl font-semibold mb-4">Terms & Conditions</h2>
    <div className="flex flex-col overflow-y-auto flex-1 min-h-0">
      {termsData.map((section, idx) => (
        <div key={section.title} className="mb-6">
          <div className="flex items-center gap-2 mb-1.5">
            <GiDiamonds className="text-[#43494B] text-sm" />
            <span className="font-semibold text-base text-[#191B1C]">
              {section.title}
            </span>
          </div>
          <div className="text-[#43494B] text-sm leading-relaxed mb-4">
            {section.content}
          </div>
          {idx < termsData.length - 1 && <hr className="my-4" />}
        </div>
      ))}
    </div>
  </div>
);

export default TermsConditionsCard;
