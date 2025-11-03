"use client";
import { useState, useRef, useEffect } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentLanguage } from "@/redux/globalslice";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
];

export default function LanguageDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  const currentLanguage = useSelector(
    (state) => state.globalslice?.currentLanguage || "en"
  );

  const selectedLanguage =
    languages.find((lang) => lang.code === currentLanguage) || languages[0];

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

  const handleLanguageChange = (languageCode) => {
    dispatch(setCurrentLanguage(languageCode));
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className="relative font-semibold cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center">
        <span className="mr-2 text-lg">{selectedLanguage.flag}</span>
        <span className="text-white text-sm font-outfit font-semibold md:text-sm">
          {selectedLanguage.name}
        </span>
        {isOpen ? (
          <FaAngleUp className="ml-1 text-secondary" />
        ) : (
          <FaAngleDown className="ml-1" />
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full -left-1/2 sm:left-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 p-2.5 z-[100] min-w-[120px]">
          {languages
            .filter((lang) => lang.code !== currentLanguage)
            .map((language) => (
              <div
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className="flex items-center px-3 py-2 text-sm font-semibold text-black hover:bg-purple-50 hover:text-primary rounded cursor-pointer transition-colors duration-150"
              >
                <span className="mr-2 text-lg">{language.flag}</span>
                {language.name}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
