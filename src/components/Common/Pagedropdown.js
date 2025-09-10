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
// import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from "js-cookie";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Dropdown } from "react-bootstrap";
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
  { to: "/myaccount", img: profileimg, label: "My Profile" },
  { to: "/my-orders", img: orderimg, label: "My Order" },
  { to: "/my-wishlist", img: whistlistimage, label: "Wishlist" },
  { to: "/track-your-order", img: trackorder, label: "Track Order" },
  { to: "/address", img: trackorder, label: "Address" },
  { to: "/complaints", img: complaints, label: "Complaints" },
];

export default function Pagedropdown({ logindata }) {
  const closeDropdown = () => setIsDropdownOpen(false);
  const toggleUserDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const logoutclick = () => {
    Cookies.remove("jwt_token");
    Cookies.remove("cart_ip_address");
    dispatch(setauthstatus(false));
    dispatch(setcartlistdata([]));
  };

  const [isOpen, setIsOpen] = useState(false);
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const dispatch = useDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <Dropdown
      className="header-middle-rightsub countrydropdown"
      show={isOpen}
      onMouseEnter={() => setIsOpen(true)} // Open on hover
      onMouseLeave={() => setIsOpen(false)} // Close on hover out
    >
      <Dropdown.Toggle className="cursor-pointer headermain flex usermain items-center">
        <FaUser size={16} />
        <span className="pl-2 header-middle-right-title username">
          {logindata.first_name.trim().length > 20
            ? logindata.first_name.trim().substring(0, 20) + "..."
            : logindata.first_name.trim()}
        </span>
      </Dropdown.Toggle>

      <Dropdown.Menu className="custom-dropdown-menu">
        {dropdownItems.length > 0 &&
          dropdownItems.map((item, index) => (
            <Dropdown.Item key={item.to}>
              <NavLink
                key={index}
                className="userdropdown no-underline"
                to={item.to}
                onClick={closeDropdown}
              >
                <img src={item.img} alt={item.label} />
                <div className="dropdownpages">{item.label}</div>
              </NavLink>
            </Dropdown.Item>
          ))}
        <Dropdown.Item onClick={logoutclick}>
          <div
            className="userdropdown no-underline cursor-pointer"
            onClick={closeDropdown}
          >
            <img src={logout} alt="logout" />
            <div className="dropdownpages">Logout</div>
          </div>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
