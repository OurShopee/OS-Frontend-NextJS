"use client";
import complaints from "@/images/Info Square.png";
import trackorder from "@/images/Location.png";
import logout from "@/images/Logout.png";
import profileimg from "@/images/Profile.png";
import whistlistimage from "@/images/Stroke 1.png";
import orderimg from "@/images/order.png";
import { setcartlistdata } from "@/redux/cartslice";
import {
    setauthstatus
} from "@/redux/formslice";
import Cookies from "js-cookie";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

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

const dropdownItems = [
  { to: "/myaccount", img: profileimg.src, label: "My Profile" },
  { to: "/my-orders", img: orderimg.src, label: "My Order" },
  { to: "/my-wishlist", img: whistlistimage.src, label: "Wishlist" },
  { to: "/track-your-order", img: trackorder.src, label: "Track Order" },
  { to: "/address", img: trackorder.src, label: "Address" },
  { to: "/complaints", img: complaints.src, label: "Complaints" },
];

export default function Pagedropdown({ logindata }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const dispatch = useDispatch();

  const closeDropdown = () => setIsOpen(false);
  
  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleMouseLeave = () => {
    // Add a small delay before closing to allow smooth transition to menu
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  const handleMouseEnter = () => {
    // Clear the timeout if user re-enters
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(true);
  };

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
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {/* Dropdown Toggle Button */}
      <div 
        className="cursor-pointer headermain flex usermain items-center"
        onClick={toggleDropdown}
      >
        <FaUser size={16} />
        <span className="pl-2 header-middle-right-title username">
          {logindata.first_name.trim().length > 20
            ? logindata.first_name.trim().substring(0, 20) + "..."
            : logindata.first_name.trim()}
        </span>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="custom-dropdown-menu absolute top-full right-0 mt-3 bg-white shadow-lg rounded-md min-w-[150px] z-50 p-3">
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
                    <img src={item.img} alt={item.label} />
                    <div className="dropdownpages">{item.label}</div>
                  </div>
                </NavLink>
              </div>
            ))}
          <div className="dropdown-item" onClick={logoutclick}>
            <div className="userdropdown no-underline cursor-pointer">
              <img src={logout.src} alt="logout" />
              <div className="dropdownpages">Logout</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
