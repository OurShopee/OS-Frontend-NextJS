"use client";
import { useEffect, useRef, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import logo from "@/images/Logo.png";
import buyimg from "@/images/Buy.png";
import buy1img from "@/images/Buy1.png";
import Pagedropdown from "./Pagedropdown";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

import { MdOutlineQrCodeScanner } from "react-icons/md";
import leftimg from "@/images/Arrow - Left 2.png";
import { setformmodal, setformstatus } from "@/redux/formslice";
import Carousel3D from "../Carousel3D";
import CategorySlider from "../CategorySlider";
import { CurrentLocation } from "../Common";
import Mobileforms from "../Common/Mobileforms";
import { trackCartClick } from "../utils/dataUserpush";
import Categorylist from "./Categorylist";
import CountryDropdown from "./CountryDropdown";
import Modal from "./Modal";
import AppDownloadModal from "./Modals/AppDownloadModal";
import Search from "./Search";
import Sidebar from "./Sidebar";
import ToolTip from "./ToolTip";
import Category from "./desktopViewComponents/Category";

// Custom NavLink component for Next.js App Router
const NavLink = ({ to, children, className, onClick, ...props }) => {
  const pathname = usePathname();
  const isActive = pathname === to;

  return (
    <Link href={to} {...props}>
      <span
        className={`${className} ${isActive ? "active" : ""}`}
        onClick={onClick}
      >
        {children}
      </span>
    </Link>
  );
};

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const isBigScreen = useMediaQuery({ query: "(min-width: 991px)" });
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isToolTip, setIsToolTip] = useState(true);
  const dropdownRef = useRef(null);
  const categoryList = useSelector((state) => state.globalslice.data);
  const formmodal = useSelector((state) => state.globalslice.formmodal);
  const countryDropdown = useSelector(
    (state) => state.globalslice.countryDropdown
  );
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const filteredItems =
    currentcountry?.nav_items?.filter(
      (item) => item?.status === 1 && item?.id === 11
    ) || [];
  const cartlistdata = useSelector((state) => state.cartslice.cartlistdata);
  const addresslistdata = useSelector(
    (state) => state.addresslice.addresslistdata
  );
  const authstatus = useSelector((state) => state.formslice.authstatus);
  const logindata = useSelector((state) => state.formslice.logindata);
  const addressdata = addresslistdata?.data?.filter(
    (ele) => ele.default_address == 1
  );
  const pageName =
    typeof window !== "undefined" ? window.location.pathname : pathname;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loginclick = () => {
    dispatch(setformmodal(!formmodal));
    dispatch(setformstatus(1));
  };

  const handleToolTip = () => {
    setIsToolTip(!isToolTip);
  };

  const [showFirst, setShowFirst] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowFirst((prev) => !prev);
    }, 3000); // Switch every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const flipVariants = {
    enter: {
      opacity: 0,
      rotateY: -180, // Start flipped to the left
      x: -50,
    },
    center: {
      opacity: 1,
      rotateY: 0, // Normal position
      x: 0,
      zIndex: 2,
    },
    exit: {
      opacity: 0,
      rotateY: 180, // Flip to the right
      x: 50,
      zIndex: 1,
    },
  };

  return (
    <>
      {!isBigScreen && isToolTip && (
        <div className="mainheader">
          <ToolTip
            text="Revamped & Ready. Open the App!"
            handleToolTip={handleToolTip}
          />
        </div>
      )}
      <div className="mainheader">
        {/* Middle Header */}
        <div className="header-middle-main primarybackground">
          <div className="header-middle homepagecontainer">
            {/* Sidebar and Logo */}
            <div className="companylogomain flex justify-between">
              {!isBigScreen && (
                <div onClick={() => setSidebarOpen(true)}>
                  <AiOutlineMenu
                    size={20}
                    className="mr-1"
                    style={{ marginTop: 2 }}
                  />
                </div>
              )}
              <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setSidebarOpen(false)}
              />
              <div className="flex items-center gap-6 justify-between">
                <NavLink to="/" className="flex items-center">
                  <Image
                    className="companylogo flex items-center"
                    src={logo}
                    alt="OurShopee Logo"
                    width={120}
                    height={40}
                  />
                </NavLink>

                {isBigScreen && <Category />}
                <div className="flex flex-grow flex-1">
                  {isBigScreen && <Search />}
                </div>
              </div>
            </div>

            {/* Search */}

            <div className="header-middle-right gap-2">
              {isBigScreen && (
                <NavLink
                  to={authstatus ? "/address" : ""}
                  className="headertop-leftcorner delivertext cursor-pointer !no-underline"
                >
                  <img
                    src={"/assets/vector_icons/location.png"}
                    className="headertop-icons"
                    alt="location"
                  />
                  <span className="pl-1 headertoptitle">Deliver to</span>
                  {!authstatus ? (
                    <CurrentLocation />
                  ) : (
                    <span className="pl-1 currentlocation-address">
                      {addressdata?.[0]?.address}
                    </span>
                  )}
                </NavLink>
              )}
              {isBigScreen && (
                <div
                  className="flex gap-1 px-2 items-center cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                >
                  <span>
                    <MdOutlineQrCodeScanner size={21} />
                  </span>
                  <span className="font-[Outfit] font-semibold text-white text-[14px]">
                    Download App
                  </span>
                </div>
              )}

              {/* Modal */}
              <AppDownloadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
              />
              {isBigScreen && (
                <CountryDropdown countryDropdown={countryDropdown} />
              )}

              {/* User */}
              {!authstatus ? (
                <div
                  className="header-middle-rightsub pr-4 cursor-pointer"
                  onClick={loginclick}
                >
                  <div className="cursor-pointer flex usermain items-center">
                    <FaUser size={16} />
                    <span className="pl-2 header-middle-right-title username">
                      Login
                    </span>
                  </div>
                </div>
              ) : (
                <Pagedropdown logindata={logindata} />
              )}
              {/* Cart */}
              <NavLink
                to="/cart"
                className={`header-middle-rightsub flex cart-hover no-underline ${
                  cartlistdata?.data?.result?.length > 0 ? "cart-not-empty" : ""
                }`}
                onClick={() => trackCartClick(currentcountry.name, pageName)}
              >
                <div className="headercart-icon">
                  {/* Show when cart is empty */}
                  {(!cartlistdata?.data?.result?.length ||
                    cartlistdata.data.result.length === 0) && (
                    <>
                      <Image
                        src={buyimg}
                        alt="empty cart"
                        className="cart-image-default"
                      />
                      <Image
                        src={buy1img}
                        alt="hover cart"
                        className="cart-image-hover yellow-filter"
                      />
                    </>
                  )}

                  {/* Show when cart has items */}
                  {cartlistdata?.data?.result?.length > 0 && (
                    <>
                      <img
                        src={buy1img}
                        alt="filled cart"
                        className="cart-image-default yellow-filter mb-1"
                      />
                      <img
                        src={buy1img}
                        alt="hover cart"
                        className="cart-image-hover yellow-filter mb-1"
                      />
                    </>
                  )}

                  {cartlistdata?.data?.result?.length > 0 && (
                    <div className="cartcount">
                      {cartlistdata.data.result.length}
                    </div>
                  )}
                </div>

                {isBigScreen && (
                  <span
                    className={`pl-1 ${
                      cartlistdata?.data?.result?.length > 0
                        ? "cartcolor"
                        : "header-middle-right-title"
                    }`}
                  >
                    Cart
                  </span>
                )}
              </NavLink>
            </div>
          </div>

          {/* Search in Mobile */}
          {!isBigScreen && (
            <div className="mobile-header-search mt-1 mb-2">
              {pathname !== "/" && (
                <Image
                  className="header-leftimg cursor-pointer"
                  src={leftimg}
                  alt="Back"
                  onClick={() => router.back()}
                />
              )}
              <Search />
            </div>
          )}

          {/* Location & Country in Mobile */}
          <div className="flex justify-between items-center">
            {!isBigScreen &&
              (authstatus ? (
                <NavLink
                  to="/address"
                  className="headertop-leftcorner delivertext cursor-pointer no-underline"
                >
                  <img
                    src={"/assets/vector_icons/location.png"}
                    className="headertop-icons"
                    alt=""
                    width={15}
                  />
                  <span className="pl-1 headertoptitle">Deliver to</span>
                  <span className="pl-1 currentlocation-address">
                    {addressdata?.[0]?.address}
                  </span>
                </NavLink>
              ) : (
                <div className="headertop-leftcorner">
                  <img
                    src={"/assets/vector_icons/location.png"}
                    className="headertop-icons"
                    alt=""
                    width={15}
                  />
                  <span className="pl-1 headertoptitle">Deliver to</span>
                  <CurrentLocation />
                </div>
              ))}

            {!isBigScreen && (
              <CountryDropdown countryDropdown={countryDropdown} />
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        {!isBigScreen && (
          <div className="header-bottom-main">
            <div className="header-bottom homepagecontainer">
              {!isBigScreen ? (
                <div className="mobileAll-title">All</div>
              ) : (
                <div ref={dropdownRef}>
                  <Categorylist />
                </div>
              )}
              <div className="header-mobile-bottom">
                {Object.keys(currentcountry).length > 0 &&
                  currentcountry?.nav_items
                    .filter(({ status }) => status == 1)
                    .map((nav_item, index) => {
                      return (
                        <NavLink
                          key={index}
                          to={nav_item.url}
                          className={`header-bottom-titles no-underline ${
                            pathname == nav_item.url ? "active-link" : ""
                          }`}
                        >
                          {nav_item.title}
                        </NavLink>
                      );
                    })}
              </div>
            </div>
          </div>
        )}

        {/* Auth Modals */}
        {isBigScreen ? <Modal /> : <Mobileforms />}
      </div>
      {isBigScreen && pathname === "/" && (
        <div className="flex items-center max-w-full overflow-x-hidden relative">
          {filteredItems?.length > 0 && (
            <NavLink to={filteredItems?.[0]?.url}>
              <div
                className="relative min-w-[150px] flex justify-center items-center h-[80px]"
                style={{ perspective: "1200px" }}
              >
                <AnimatePresence>
                  {showFirst ? (
                    <motion.div
                      key="first"
                      className="flex pl-6 pr-2 items-center justify-center animate-rotate-load absolute inset-0 m-auto"
                      initial={{
                        opacity: 0,
                        scale: 0.8,
                        rotateY: -180,
                        x: -100,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        rotateY: 0,
                        x: 0,
                        zIndex: 2,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.8,
                        rotateY: 180,
                        x: 100,
                        zIndex: 1,
                      }}
                      transition={{
                        duration: 0.5,
                        ease: [0.165, 0.84, 0.44, 1],
                      }}
                      style={{
                        transformStyle: "preserve-3d",
                        backfaceVisibility: "hidden",
                        width: "fit-content",
                        height: "fit-content",
                      }}
                    >
                      <div className="w-[84px] h-[46px]">
                        <img
                          className="w-full h-full"
                          src="/assets/homepage/sale-icon.png"
                          alt=""
                        />
                      </div>
                      <div className="w-[32px] h-[44px] animate-flash-pulse">
                        <img
                          className="w-full h-full"
                          src="/assets/homepage/flash-icon.png"
                          alt=""
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="second"
                      className="absolute inset-0 m-auto"
                      initial={{
                        opacity: 0,
                        scale: 0.8,
                        rotateY: -180,
                        x: -100,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        rotateY: 0,
                        x: 0,
                        zIndex: 2,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.8,
                        rotateY: 180,
                        x: 100,
                        zIndex: 1,
                      }}
                      transition={{
                        duration: 0.5,
                        ease: [0.165, 0.84, 0.44, 1],
                      }}
                      style={{
                        transformStyle: "preserve-3d",
                        backfaceVisibility: "hidden",
                        width: "100px",
                        height: "80px",
                      }}
                    >
                      <img
                        className="w-full h-full"
                        src={filteredItems?.[0]?.image}
                        alt=""
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </NavLink>
          )}

          <div className="px-2">
            <Carousel3D />
          </div>
          <div className="h-[4.5rem] bg-gray-300 px-[1.5px] rounded-full mx-2" />
          <div className="relative flex-grow w-full overflow-x-hidden">
            {/* Left blur overlay */}
            <div
              className="absolute left-0 top-0 h-full w-11 z-10 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to right, rgba(255,255,255,1),rgba(255,255,255,1), rgba(255,255,255,0.8), transparent)",
              }}
            />

            {/* Marquee content */}
            <CategorySlider categoryList={categoryList} />
          </div>
          {/* Right blur overlay */}
          <div
            className="absolute right-0 top-0 h-full w-16 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(to left, rgba(255,255,255,1),rgba(255,255,255,1), rgba(255,255,255,0.8), transparent)",
            }}
          />
        </div>
      )}
    </>
  );
};

export default Header;
