"use client";
import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";
import { MediaQueries } from "@/components/utils";
import MyAccountDashboard from "@/components/Myaccount/MyAccountDashboard";
import BreadComp from "@/components/Myaccount/BreadComp";
import { useContent } from "@/hooks";
import { FaWallet } from "react-icons/fa";
import { useSelector } from "react-redux";
import { getAssetsUrl } from "@/components/utils/helpers";

const page = () => {
  const { isMobile } = MediaQueries();
  const wallet = useContent("account.wallet");
  const walletHeading = useContent("wallet.walletHeading");
  const walletDescription = useContent("wallet.walletDescription");
  const totalAvailableBalance = useContent("wallet.totalAvailableBalance");
  const balanceDescription = useContent("wallet.balanceDescription");
  const currentCountry = useSelector((state) => state.globalslice.currentcountry);
  return (
    <Container fluid className="homepagecontainer">
      <Row className={!isMobile ? "mt-4" : ""}>
        {!isMobile && (
          <Col lg={3}>
            <MyAccountDashboard />
          </Col>
        )}

        <Col lg={9}>
          {isMobile ? (
            <>
              <div>
                <BreadComp title={wallet} />
                <div className="page-titile">hello</div>
              </div>
            </>
          ) : null}

          <Row>
            <Col sm={12}>
              <BreadComp title={wallet} />
              <Link
                href="/place-a-complaints"
                className="complaintcard flex justify-start items-start py-4 px-4 text-black"
              >
                <div className="complianttitle p-4 justify-start items-start">
                  <h1 className="text-black text-xl font-semibold">
                    {walletHeading}
                  </h1>
                  <p className="text-black text-sm font-normal py-1">
                    {walletDescription}
                  </p>
                </div>
                <div className="flex justify-center items-center w-full">
                  <div className="complaintCard w-[900px] flex flex-col justify-center items-center bg-gradient-to-b from-[#E2FFD3] via-[#ECFFE2] to-[#FFFFFF] rounded-lg p-6 shadow-sm relative overflow-hidden min-h-[280px]">
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
                </div>
              </Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default page;
