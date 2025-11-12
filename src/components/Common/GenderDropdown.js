"use client";
import React, { useState, useEffect, useRef } from "react";
import uparrow from "@/images/Vectoruparrow.png";
import downarrow from "@/images/Vectordownarrow.png";
import Image from "next/image";
import { useContent, useCurrentLanguage } from "@/hooks";

const GenderDropdown = ({ selectedGender, onSelect, title }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const currentLanguage = useCurrentLanguage();
  
  // Content translations
  const selectGender = useContent("buttons.selectGender");
  const male = useContent("buttons.male");
  const female = useContent("buttons.female");
  const preferNotToSay = useContent("buttons.preferNotToSay");
  
  // Gender options with translations
  const genderOptions = [
    { value: "Male", label: male },
    { value: "Female", label: female },
    { value: "other", label: preferNotToSay },
  ];
  
  // Get display label for selected gender
  const getDisplayLabel = (gender) => {
    const option = genderOptions.find(opt => opt.value === gender);
    return option ? option.label : "";
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setShowDropdown(!showDropdown);
    } else if (event.key === "Escape") {
      setShowDropdown(false);
    }
  };

  const handleOptionSelect = (gender) => {
    onSelect(gender);
    setShowDropdown(false);
  };

  return (
    <div className="inputbox-margin">
      {title && <div className="inputbox-title">{title}</div>}
      <div ref={dropdownRef} className="genderdropdown-container relative">
        <input
          placeholder={selectGender}
          value={getDisplayLabel(selectedGender)}
          onFocus={() => setShowDropdown(!showDropdown)}
          onKeyDown={handleKeyDown}
          readOnly
          className="forminputbox"
          role="combobox"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          aria-label="Gender selection"
          dir={currentLanguage === "ar" ? "rtl" : "ltr"}
        />
        <div 
          className="up-downarrow"
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            ...(currentLanguage === "ar" 
              ? { left: "8px", right: "auto" } 
              : { right: "8px", left: "auto" }
            )
          }}
        >
          {showDropdown ? (
            <img
              src={uparrow.src}
              alt="Collapse options"
              onClick={() => setShowDropdown(false)}
            />
          ) : (
            <img
              src={downarrow.src}
              alt="Expand options"
              onClick={() => setShowDropdown(true)}
            />
          )}
        </div>
        {showDropdown && (
          <div
            className="genderdropdown-options"
            role="listbox"
            aria-label="Gender options"
            dir={currentLanguage === "ar" ? "rtl" : "ltr"}
          >
            {genderOptions.map((option) => (
              <label
                key={option.value}
                className={`flex justify-between items-center subcategory-item cursor-pointer p-2 hover:bg-gray-100 ${
                  currentLanguage === "ar" ? "flex-row-reverse" : ""
                }`}
                role="option"
                aria-selected={selectedGender === option.value}
              >
                <span>{option.label}</span>
                <input
                  type="radio"
                  name="gender"
                  value={option.value}
                  checked={selectedGender === option.value}
                  onChange={() => handleOptionSelect(option.value)}
                  className={currentLanguage === "ar" ? "mr-2" : "ml-2"}
                  aria-label={option.label}
                />
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GenderDropdown;
