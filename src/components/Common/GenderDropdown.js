"use client";
import React, { useState, useEffect, useRef } from "react";
import uparrow from "@/images/Vectoruparrow.png";
import downarrow from "@/images/Vectordownarrow.png";
import Image from "next/image";

const GenderDropdown = ({ selectedGender, onSelect, title }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

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
          placeholder="Select Gender"
          value={selectedGender}
          onFocus={() => setShowDropdown(!showDropdown)}
          onKeyDown={handleKeyDown}
          readOnly
          className="forminputbox"
          role="combobox"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          aria-label="Gender selection"
        />
        <div className="up-downarrow">
          {showDropdown ? (
            <img
              src={uparrow}
              alt="Collapse options"
              onClick={() => setShowDropdown(false)}
            />
          ) : (
            <img
              src={downarrow}
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
          >
            {["Male", "Female", "other"].map((gender) => (
              <label
                key={gender}
                className="flex justify-between subcategory-item cursor-pointer p-2 hover:bg-gray-100"
                role="option"
                aria-selected={selectedGender === gender}
              >
                {gender === "other"
                  ? "Prefer not to say"
                  : gender.charAt(0).toUpperCase() + gender.slice(1)}
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={selectedGender === gender}
                  onChange={() => handleOptionSelect(gender)}
                  className="ml-2"
                  aria-label={gender === "other" ? "Prefer not to say" : gender}
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
