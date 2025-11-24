"use client";
import { getWalletTransactions } from "@/api/user";
import Transactions from "@/components/Common/transactions";
import withAuth from "@/components/Common/withAuth";
import BreadComp from "@/components/Myaccount/BreadComp";
import MyAccountDashboard from "@/components/Myaccount/MyAccountDashboard";
import { MediaQueries } from "@/components/utils";
import { getAssetsUrl } from "@/components/utils/helpers";
import FAQAccordion from "@/components/wallet/FAQAccordion";
import InfoCardWithModal from "@/components/wallet/InfoCardWithModal";
import ShopeeWalletHowTo from "@/components/wallet/ShopeeWalletHowTo";
import TermsConditionsCard from "@/components/wallet/TermsConditionsCard";
import { useContent } from "@/hooks";
import { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";

import { HiArrowsUpDown } from "react-icons/hi2";
const page = () => {
  const { isMobile } = MediaQueries();
  const [isFilterUse, setIsFilterUse] = useState(false);
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterDropdownRef = useRef(null);
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
  const seeMore = useContent("wallet.seeMore");
  const [transactions, setTransactions] = useState([]);
  const [walletBalance, setWalletBalance] = useState({ amount: 0 });

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target)
      ) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchWalletTransactions = async () => {
      try {
        // If filterType is "REFUND", use "CREDIT", otherwise use "DEBIT" or empty string
        const txType =
          filterType === "REFUND"
            ? "CREDIT"
            : filterType === "DEBIT"
            ? "DEBIT"
            : "";
        const response = await getWalletTransactions(page, 20, txType);
        console.log(response);
        setTransactions(response?.data?.transactions || []);
        setWalletBalance(response?.data?.wallet);
      } catch (error) {
        console.error("Failed to fetch wallet transactions", error);
        setTransactions([]);
        setWalletBalance({ amount: 0 });
      }
    };
    fetchWalletTransactions();
  }, [page, filterType]);

  const handleFilterChange = (type) => {
    if (type === "DEBIT" || type === "REFUND") {
      setIsFilterUse(true);
    } else {
      setIsFilterUse(false);
    }
    setFilterType(type);
    setIsFilterOpen(false);
    setPage(1); // Reset to first page when filter changes
  };
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
                          {currentCountry?.currency}
                        </span>
                      )}
                      <span className="text-[52px] font-bold bg-gradient-to-b from-[#125810] to-[#45D441] bg-clip-text text-transparent leading-none">
                        {parseFloat(walletBalance?.amount).toFixed(2)}
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

                <div className="flex  w-full">
                  <div className="complaintCard w-full max-w-[1000px] rounded-2xl bg-white wallet-cards-shadows px-5 py-6">
                    <div className="flex flex-col gap-7">
                      <div className="flex items-center justify-between text-xl font-semibold text-gray-900">
                        <span>{transactionHistory}</span>

                        {(isFilterUse || transactions.length > 0) && (
                          <div className="flex items-center justify-center gap-2 ">
                            <div ref={filterDropdownRef} className="relative">
                              <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className=" bg-[#E7E8E9] px-2 w-max py-2 rounded-[12px] "
                              >
                                <img
                                  src={getAssetsUrl("wallet/Filter.svg")}
                                  alt="Filter"
                                  className="h-[18px] w-auto"
                                />
                              </button>
                              {isFilterOpen && (
                                <div className="absolute right-0 mt-2 bg-white rounded-[12px] shadow-lg border border-gray-200 z-50  overflow-hidden py-2">
                                  <label
                                    onClick={() => handleFilterChange("")}
                                    className="flex items-center w-full px-4 py-2 text-sm font-medium hover:bg-[#E7E8E9] transition-colors cursor-pointer"
                                  >
                                    <input
                                      type="radio"
                                      name="transactionFilter"
                                      value=""
                                      checked={filterType === ""}
                                      onChange={() => handleFilterChange("")}
                                      className="mr-3 w-4 h-4 text-[#43494B] focus:ring-[#43494B] focus:ring-2 cursor-pointer"
                                    />
                                    <span
                                      className={
                                        filterType === ""
                                          ? "text-[#5232C2]"
                                          : "text-gray-700"
                                      }
                                    >
                                      All
                                    </span>
                                  </label>
                                  <label
                                    onClick={() => handleFilterChange("REFUND")}
                                    className="flex items-center w-full px-4 py-2 text-sm font-medium hover:bg-[#E7E8E9] transition-colors cursor-pointer"
                                  >
                                    <input
                                      type="radio"
                                      name="transactionFilter"
                                      value="REFUND"
                                      checked={filterType === "REFUND"}
                                      onChange={() =>
                                        handleFilterChange("REFUND")
                                      }
                                      className="mr-3 w-4 h-4 text-[#43494B] focus:ring-[#43494B] focus:ring-2 cursor-pointer"
                                    />
                                    <span
                                      className={
                                        filterType === "REFUND"
                                          ? "text-[#5232C2]"
                                          : "text-gray-700"
                                      }
                                    >
                                      Refund
                                    </span>
                                  </label>
                                  <label
                                    onClick={() => handleFilterChange("DEBIT")}
                                    className="flex items-center w-full px-4 py-2 text-sm font-medium hover:bg-[#E7E8E9] transition-colors cursor-pointer"
                                  >
                                    <input
                                      type="radio"
                                      name="transactionFilter"
                                      value="DEBIT"
                                      checked={filterType === "DEBIT"}
                                      onChange={() =>
                                        handleFilterChange("DEBIT")
                                      }
                                      className="mr-3 w-4 h-4 text-[#43494B] focus:ring-[#43494B] focus:ring-2 cursor-pointer"
                                    />
                                    <span
                                      className={
                                        filterType === "DEBIT"
                                          ? "text-[#5232C2]"
                                          : "text-gray-700"
                                      }
                                    >
                                      Used
                                    </span>
                                  </label>
                                </div>
                              )}
                            </div>
                            <button className="flex text-lg items-center justify-center gap-1 text-[#43494B] bg-[#E7E8E9] font-semibold w-full py-2 px-2 rounded-[12px] ">
                              <HiArrowsUpDown />
                            </button>
                          </div>
                        )}
                      </div>
                      {transactions.length == 0 ? (
                        <div className="flex flex-col items-center justify-center gap-4 pb-6">
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
                        <div className="flex flex-col items-center justify-between  w-full">
                          <h3 className="text-xl font-semibold text-gray-900 w-full">
                            <Transactions transactions={transactions} />
                          </h3>
                          {/* see more button */}
                          <button className="flex text-lg items-center justify-center gap-1 text-[#43494B] bg-[#E7E8E9] font-semibold w-full py-2 rounded-[12px] mt-4">
                            <span>{seeMore}</span>
                            <img
                              src={getAssetsUrl("vector_icons/arrow_right.svg")}
                              alt="Arrow Right"
                              className="w-[15px] h-[15px]"
                            />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <InfoCardWithModal
                  icon={"wallet/question.svg"}
                  heading="How To Use?"
                  description="Use Shopee Wallet for hassle-free checkout by easily applying your available balance"
                  modalContent={<ShopeeWalletHowTo />}
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
                  modalContent={<TermsConditionsCard />}
                />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default withAuth(page);
