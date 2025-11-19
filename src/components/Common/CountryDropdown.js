"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useCurrentLanguage, getDynamicContent } from "@/hooks";

export default function CountryDropdown({ countryDropdown }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const currentLanguage = useCurrentLanguage();
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );

  const localizedCurrentCountryName = useMemo(
    () => getDynamicContent(currentcountry, "name", currentLanguage),
    [currentcountry, currentLanguage]
  );

  const localizedCountryOptions = useMemo(
    () =>
      countryDropdown?.map((option) => ({
        ...option,
        localizedName: getDynamicContent(option, "name", currentLanguage),
      })) || [],
    [countryDropdown, currentLanguage]
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
            alt={localizedCurrentCountryName || currentcountry?.name || "Country"}
            className={`${currentLanguage === "ar" ? "ml-2" : "mr-2"}`}
            width="20"
          />
          <span className="text-white text-sm font-outfit font-semibold md:text-sm">
            {localizedCurrentCountryName || currentcountry?.name}
          </span>
          {isOpen ? (
            <FaAngleUp className={`${currentLanguage === "ar" ? "!mr-1" : "!ml-1"} text-secondary`} />
          ) : (
            <FaAngleDown className={`${currentLanguage === "ar" ? "!mr-1" : "!ml-1"}`} />
          )}
        </div>
      )}

      {isOpen && (
        <div className="absolute top-full -left-1/2 sm:left-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 p-2.5 z-50 min-w-[120px]">
          {localizedCountryOptions?.length > 0 &&
            localizedCountryOptions
              ?.filter(({ id }) => id != currentcountry?.id)
              ?.map((option) => (
                <div
                  key={`${option.name}-${option.id || ""}`}
                  onClick={() => handleOptionClick(option)}
                  className="flex items-center px-3 py-2 text-sm font-semibold text-black hover:bg-purple-50 hover:text-primary rounded cursor-pointer transition-colors duration-150"
                >
                  <img
                    src={`/flags/${option.image}`}
                    alt={option.localizedName || option.name}
                    className={`${currentLanguage === "ar" ? "ml-2" : "mr-2"}`}
                    width="20"
                  />
                  {option.localizedName || option.name}
                </div>
              ))}
        </div>
      )}
    </div>
  );
}
