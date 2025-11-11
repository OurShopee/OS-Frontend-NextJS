"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { PiTranslateBold } from "react-icons/pi";
import { useDispatch } from "react-redux";
import { useContent, useCurrentLanguage } from "@/hooks";
import { setCurrentLanguage } from "@/redux/globalslice";

export default function LanguageDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const currentLanguage = useCurrentLanguage();
  const choosePreferredLanguage = useContent("language.choosePreferred");
  const englishLabel = useContent("language.english");
  const arabicLabel = useContent("language.arabic");
  const englishShort = useContent("language.englishShort");
  const arabicShort = useContent("language.arabicShort");

  const languageOptions = useMemo(
    () => [
      { code: "en", name: "English", short: englishShort },
      { code: "ar", name: "العربية", short: arabicShort },
    ],
    [englishLabel, arabicLabel, englishShort, arabicShort]
  );

  const selectedLanguage =
    languageOptions.find((lang) => lang.code === currentLanguage) ||
    languageOptions[0];

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

  const isRTL = currentLanguage === "ar";

  return (
    <div ref={dropdownRef} className="relative font-semibold" dir={isRTL ? "rtl" : "ltr"}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1 text-white hover:bg-primary/90 transition focus:outline-none"
      >
        <span className="flex items-center justify-center rounded-full">
          <img src="/language.svg" alt="Language" className="h-7 w-7" />
          {/* <PiTranslateBold className="h-5 w-5 text-white" /> */}
        </span>
        <span className="text-sm font-outfit font-semibold md:text-base tracking-wide">
          {selectedLanguage.short}
        </span>
        {isOpen ? (
          <FaAngleUp className="text-white" />
        ) : (
          <FaAngleDown className="text-white" />
        )}
      </button>

      {isOpen && (
        <div className={`absolute top-[calc(100%+8px)] w-72 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg z-[110] ${isRTL ? "!right-0" : "!left-0"}`}>
          <p className={`mb-2 text-base font-semibold text-[#525252] ${isRTL ? "text-right" : "text-left"}`}>
            {choosePreferredLanguage}
          </p>
          <div className="">
            {languageOptions.map((language) => {
              const isSelected = currentLanguage === language.code;
              return (
                <button
                  key={language.code}
                  type="button"
                  onClick={() => handleLanguageChange(language.code)}
                  className={`flex w-full border-none items-center gap-3 rounded-xl border p-2 transition ${
                    isSelected
                      ? ""
                      : " hover:border-primary/40 hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#CED2D4]`}
                  >
                    <span
                      className={`h-3.5 w-3.5 rounded-full ${
                        isSelected ? "bg-primary" : "bg-transparent"
                      }`}
                    />
                  </span>
                  <span
                    className={`text-base ${
                      isSelected ? "text-primary font-semibold" : "text-gray-700 font-medium"
                    }`}
                  >
                    {language.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
