"use client";
import { useState, useRef, useEffect } from "react";
import flag from "@/images/Flag.png";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { useSelector } from "react-redux";

const options = [
  { name: "Dubai", flag: flag },
  { name: "UAE", flag: flag },
  { name: "Oman", flag: flag },
  { name: "Kuwait", flag: flag },
  { name: "Qatar", flag: flag },
];

export default function CountryDropdown({ countryDropdown }) {
  const [selected, setSelected] = useState(options[0]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option) => {
    if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
      window.open(option.dev_url, "_blank");
    } else {
      window.open(option.url, "_blank");
    }

    setSelected(option);
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className="relative font-semibold cursor-pointer"
      // onMouseEnter={() => setIsOpen(true)}
      // onMouseLeave={() => setIsOpen(false)}
      onClick={() => setIsOpen(!isOpen)}
    >
      {currentcountry && Object.keys(currentcountry).length > 0 && (
        <div className="flex items-center">
          <img
            src={`/flags/${currentcountry?.image}`}
            alt={currentcountry?.name || "Country"}
            className="mr-2"
            width="20"
          />
          <span className="text-white text-sm font-outfit font-semibold md:text-sm">
            {currentcountry?.name}
          </span>
          {isOpen ? (
            <FaAngleUp className="ml-1 text-secondary" />
          ) : (
            <FaAngleDown className="ml-1" />
          )}
        </div>
      )}

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 p-2.5 z-50 min-w-[120px]">
          {countryDropdown?.length > 0 &&
            countryDropdown
              ?.filter(({ id }) => id != currentcountry.id)
              ?.map((option) => (
                <div
                  key={option.name}
                  onClick={() => handleOptionClick(option)}
                  className="flex items-center px-3 py-2 text-sm font-semibold text-primary hover:bg-purple-50 hover:text-primary rounded cursor-pointer transition-colors duration-150"
                >
                  <img
                    src={`/flags/${option.image}`}
                    alt={option.name}
                    className="mr-2"
                    width="20"
                  />
                  {option.name}
                </div>
              ))}
        </div>
      )}
    </div>
  );
}
