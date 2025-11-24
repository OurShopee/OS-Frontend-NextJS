"use client";
import { getWalletBalance } from "@/api/user";
import FAQAccordion from "@/components/Common/FAQAccordion";
import InfoCardWithModal from "@/components/Common/InfoCardWithModal";
import BreadComp from "@/components/Myaccount/BreadComp";
import MyAccountDashboard from "@/components/Myaccount/MyAccountDashboard";
import { MediaQueries } from "@/components/utils";
import { getAssetsUrl } from "@/components/utils/helpers";
import { useContent } from "@/hooks";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";

const page = () => {
  const { isMobile } = MediaQueries();
  const wallet = useContent("account.wallet");
  const walletHeading = useContent("wallet.walletHeading");
  const walletDescription = useContent("wallet.walletDescription");
  const totalAvailableBalance = useContent("wallet.totalAvailableBalance");
  const balanceDescription = useContent("wallet.balanceDescription");
  const currentCountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const transactionHistory = useContent("wallet.transactionHistory");
  const noTransactionHistory = useContent("wallet.noTransactionHistory");
  const [transactions, setTransactions] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  useEffect(() => {
    const fetchWalletBalance = async () => {
      const response = await getWalletBalance();
      setWalletBalance(response.data);
    
    };
    fetchWalletBalance();
  }, []);
  return (
    <Container fluid className="homepagecontainer !px-16 py-3">
      <div className="py-4">
        <BreadComp title={wallet} />
      </div>
      <Row>
        {!isMobile && (
          <Col lg={3}>
            <MyAccountDashboard />
          </Col>
        )}

        <Col lg={9}>
          <Row>
            <Col sm={12}>
              <div className="complaintcard p-8 flex flex-col gap-8">
                <div className="flex justify-start flex-col w-full">
                  <h1 className="text-black text-xl font-semibold">
                    {walletHeading}
                  </h1>
                  <p className="text-black text-sm font-normal py-1">
                    {walletDescription}
                  </p>
                </div>

                <div className="complaintCard w-full flex flex-col justify-center items-center bg-gradient-to-b rounded-2xl from-[#E2FFD3] via-[#ECFFE2] to-[#FFFFFF] p-6 wallet-cards-shadows relative overflow-hidden min-h-[280px]">
                  {/* Title */}
                  <h3 className="text-gray-800 font-medium text-base mb-2 text-center">
                    {totalAvailableBalance}
                  </h3>

                  {/* Balance Display with Icon */}
                  <div className="flex items-center justify-center  mb-1">
                    <div className="flex items-center gap-1">
                      {currentCountry.currency === "AED" ? (
                        <img
                          src={getAssetsUrl("coupons/dirham.svg")}
                          alt="AED"
                          className="w-12 h-[37px] inline-block mix-blend-multiply object-contain"
                          style={{ color: "black" }}
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-5xl font-bold text-green-600">
                          {currentCountry.currency}
                        </span>
                      )}
                      <span className="text-[52px] font-bold bg-gradient-to-b from-[#125810] to-[#45D441] bg-clip-text text-transparent leading-none">
                        0
                      </span>
                    </div>
                    <div className="flex items-center justify-center">
                      <img
                        src={getAssetsUrl("wallet.png")}
                        alt="Image"
                        className="w-[38px] h-[44px] inline-block mix-blend-multiply object-contain"
                        style={{ color: "black" }}
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div className="w-[50%] h-px bg-gradient-to-r from-[#FFFFFF] via-[#81CC59] to-[#FFFFFF] mb-4"></div>

                  {/* Description */}
                  <p className="text-gray-700 text-sm text-center leading-relaxed px-2">
                    {balanceDescription}
                  </p>
                </div>

                <div className="flex justify-center items-center w-full">
                  <div className="complaintCard w-full max-w-[1000px] rounded-2xl bg-white wallet-cards-shadows px-10 py-12">
                    <div className="flex flex-col gap-10">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {transactionHistory}
                      </h3>
                      {transactions.length == 0 ? (
                        <div className="flex flex-col items-center justify-center gap-4 py-6">
                          <img
                            src={getAssetsUrl("no_transac.svg")}
                            alt="Image"
                            className="w-[124px] h-[124px] inline-block mix-blend-multiply object-contain"
                            style={{ color: "black" }}
                            loading="lazy"
                          />
                          <p className="text-md text-gray-500 font-medium">
                            {noTransactionHistory}
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-8 py-6">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {transactionHistory}
                          </h3>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <InfoCardWithModal
                  icon={"wallet/question.svg"}
                  heading="How To Use?"
                  description="Use Shopee Wallet for hassle-free checkout by easily applying your available balance"
                  modalContent={<FAQAccordion />}
                />
                <InfoCardWithModal
                  icon={"wallet/Ticket.png"}
                  heading="Coupons"
                  description="Discover available coupons for your transactions and view details to maximize your savings."
                  modalContent={<FAQAccordion />}
                />
                <InfoCardWithModal
                  icon={"wallet/comments.svg"}
                  heading="Commonly Asked Questions?"
                  description="Quick answers to common questions about using and managing your Shopee Wallet."
                  modalContent={<FAQAccordion />}
                />
                <InfoCardWithModal
                  icon={"wallet/terms.svg"}
                  heading="Terms & Conditions"
                  description="These terms outline your responsibilities and secure payment policies for Shopee Wallet."
                  modalContent={<FAQAccordion />}
                />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default page;
