"use client";
import React, { useEffect } from "react";
import logo_new from "../../../src/images/logo_new.png";
import account_logo from "../../../src/images/account_logo.png";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import CountryDropdown from "./CountryDropdown";
import { useSelector } from "react-redux";

const HeaderSeller = () => {
  const router = useRouter();
  const pathname = usePathname();

  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );

  const isBigScreen = useMediaQuery({ query: "(min-width: 991px)" });

  const navLinks = [
    {
      name: "Get Started",
      section: "get-started",
    },
    {
      name: "Benefits",
      section: "benefits",
    },
    {
      name: "Contact Us",
      section: "contact-form",
    },
  ];

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    e.stopPropagation();

     if (sectionId === "contact-form") {
       router.push("/onboarding");
       return;
     }

    if (pathname === "/seller") {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 50);
    } else {
      router.push("/seller");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    }
  };

  return (
    <div className="bg-primary h-[78px] w-[100vw]">
      <div
        className={`w-[100vw] h-full flex align-items-center justify-between px-4 sm:px-12`}
      >
        <div>
          <Link href="/">
            <img className="companylogo" src={logo_new.src} alt="logo" />
          </Link>
        </div>
        <div className="hidden xl:flex gap-5">
          {navLinks.map((item, index) => {
            return (
              <div
                key={index}
                onClick={(e) => handleNavClick(e, item.section)}
                className="font-[Outfit] text-[18px] cursor-pointer font-[500] text-white"
              >
                {item.name}
              </div>
            );
          })}
        </div>
        {pathname !== "/onboarding" ? (
          <div className="flex flex-col xl:flex-row items-start">
            <div
              onClick={() => router.push("/onboarding")}
              className="flex gap-2 items-center pl-2 xl:pl-0 cursor-pointer"
            >
              <img
                className="h-[20px] w-[14px]"
                src={account_logo.src}
                alt="logo"
                style={{ height: "20px", width: "14px" }}
              />
              <span className="text-white font-[Outfit] font-semibold tex-[16px]">
                Become a seller
              </span>
            </div>
          </div>
        ) : (
          <>
            {/* <CountryDropdown countryDropdown={countryDropdown} /> */}
            <div className="flex justify-center items-center gap-1 text-white">
              <img
                src={`/flags/${currentcountry.image}`}
                alt={currentcountry.name}
                className="me-2"
                width="20"
              />
              {currentcountry.name}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HeaderSeller;
