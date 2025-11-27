"use client";
import { getAssetsUrl } from "../utils/helpers";
import { setcartlistdata } from "@/redux/cartslice";
import { setauthstatus } from "@/redux/formslice";
import Cookies from "js-cookie";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useContent, useCurrentLanguage } from "@/hooks";
import { IoWallet } from "react-icons/io5";

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

// Note: dropdownItems will be populated inside component to use useContent hook

export default function Pagedropdown({ logindata }) {
  const currentLanguage = useCurrentLanguage();
  const [isOpen, setIsOpen] = useState(true);
  const dropdownRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const dispatch = useDispatch();

  // Language content
  const myProfile = useContent("header.myProfile");
  const myOrder = useContent("header.myOrder");
  const wishlist = useContent("header.wishlist");
  const trackOrder = useContent("header.trackOrder");
  const address = useContent("header.address");
  const complaints = useContent("header.complaints");
  const logout = useContent("header.logout");
  const wallet = useContent("header.wallet");
  const logoutText = useContent("header.logout");

  const dropdownItems = [
    { to: "/myaccount", img: getAssetsUrl("Profile.png"), label: myProfile },
    { to: "/my-orders", img: getAssetsUrl("order.png"), label: myOrder },
    { to: "/wallet", img: getAssetsUrl("wallet-drop.svg"), label: wallet },
    { to: "/my-wishlist", img: getAssetsUrl("Stroke 1.png"), label: wishlist },
    { to: "/track-your-order", img: getAssetsUrl("Location.png"), label: trackOrder },
    { to: "/address", img: getAssetsUrl("Location.png"), label: address },
    { to: "/complaints", img: getAssetsUrl("Info Square.png"), label: complaints },
  ];

  const isWallet = dropdownItems.find(item => item.to === "/wallet");

  const closeDropdown = () => setIsOpen(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleMouseLeave = () => {
    // Add a small delay before closing to allow smooth transition to menu
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  // const handleMouseEnter = () => {
  //   // Clear the timeout if user re-enters
  //   if (closeTimeoutRef.current) {
  //     clearTimeout(closeTimeoutRef.current);
  //     closeTimeoutRef.current = null;
  //   }
  //   setIsOpen(true);
  // };

  const logoutclick = () => {
    Cookies.remove("jwt_token");
    Cookies.remove("cart_ip_address");
    dispatch(setauthstatus(false));
    dispatch(setcartlistdata([]));
    closeDropdown();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className="header-middle-rightsub countrydropdown relative"
      ref={dropdownRef}
      // onMouseLeave={handleMouseLeave}
      // onMouseEnter={handleMouseEnter}
    >
      {/* Dropdown Toggle Button */}
      <div
        className="cursor-pointer headermain flex usermain items-center"
        onClick={toggleDropdown}
      >
        <FaUser size={16} />
        {/* <span className={`header-middle-right-title username ${currentLanguage === "ar" ? "pr-2" : "pl-2"}`}>
          {logindata.first_name.trim().length > 20
            ? logindata.first_name.trim().substring(0, 20) + "..."
            : logindata.first_name.trim()}
        </span> */}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`custom-dropdown-menu absolute top-full ${currentLanguage === "ar" ? "!left-0" : "right-0"} mt-3 bg-white shadow-lg rounded-md min-w-[200px] z-50 p-3`}>
          {dropdownItems.length > 0 &&
            dropdownItems.map((item, index) => (
              <div key={item.to} className="dropdown-item">
                <NavLink
                  key={index}
                  className="userdropdown no-underline block"
                  to={item.to}
                  onClick={closeDropdown}
                >
                  <div className="flex items-center">
                    <img src={item.img} alt={item.label} loading="lazy" className="w-5 h-5"/>
                    <div className={`flex items-center ${currentLanguage === "ar" ? "pr-[10px]" : "pl-[10px]"}`}>
                      {item.label}
                      {item.to === "/wallet" && (
                        <span
                          className={`rounded-full bg-[#5232C2] px-2 py-[2px] text-[10px] font-semibold uppercase text-white ${
                            currentLanguage === "ar" ? "mr-2" : "ml-2"
                          }`}
                        >
                          New
                        </span>
                      )}
                    </div>
                  </div>
                </NavLink>
              </div>
            ))}
          <div className="dropdown-item" onClick={logoutclick}>
            <div className="userdropdown no-underline cursor-pointer">
              <img src={getAssetsUrl("Logout.png")} alt="logout" loading="lazy" />
              <div className={`${currentLanguage === "ar" ? "pr-[10px]" : "pl-[10px]"}`}>{logoutText}</div>
            </div>
          </div>
        </div>
       )} 
    </div>
  );
}