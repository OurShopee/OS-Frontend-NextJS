"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import uparrow from "@/images/Vectoruparrow.png";
import downarrow from "@/images/Vectordownarrow.png";
import { useContent, useCurrentLanguage, getDynamicContent } from "@/hooks";

const NationalityDropdown = ({
  title,
  nationalitydata,
  selectedNationality,
  onSelect,
}) => {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selected_value, setselected_value] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const currentLanguage = useCurrentLanguage();

  // Content translations
  const searchNationality = useContent("buttons.searchNationality");
  const noResultsFound = useContent("buttons.noResultsFound");

  const localizedNationalityData = useMemo(
    () =>
      nationalitydata?.map((nation) => ({
        ...nation,
        localizedLabel: getDynamicContent(nation, "label", currentLanguage) || nation.label || "",
      })) || [],
    [nationalitydata, currentLanguage]
  );

  // Sync input field with selectedNationality label when it changes
  useEffect(() => {
    const match = localizedNationalityData.find(
      (nation) => nation.value === selectedNationality
    );
    const label = match ? match.localizedLabel : "";
    setSearch(label);
    setselected_value(label);
  }, [selectedNationality, localizedNationalityData]);

  // Filtered dropdown options based on search
  const filteredList = useMemo(() => {
    return localizedNationalityData?.filter((nation) =>
      nation.localizedLabel.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, localizedNationalityData]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setFocusedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showDropdown && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      setShowDropdown(true);
      setFocusedIndex(0);
      return;
    }

    if (showDropdown) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev < filteredList.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredList.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (focusedIndex >= 0 && filteredList[focusedIndex]) {
            handleSelect(filteredList[focusedIndex].value);
          }
          break;
        case "Escape":
          e.preventDefault();
          setShowDropdown(false);
          setFocusedIndex(-1);
          inputRef.current?.focus();
          break;
        case "Tab":
          setShowDropdown(false);
          setFocusedIndex(-1);
          break;
      }
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setselected_value("");
    setFocusedIndex(-1);

    const exactMatch = localizedNationalityData.find(
      (nation) => nation.localizedLabel.toLowerCase() === value.toLowerCase()
    );

    if (exactMatch) {
      onSelect(exactMatch.value);
      setShowDropdown(false);
    } else {
      onSelect(""); // Clear selection if no exact match
      setShowDropdown(true); // Show dropdown for fuzzy search
    }
  };

  // Handle item selection from dropdown
  const handleSelect = (value) => {
    const match = localizedNationalityData.find((nation) => nation.value === value);
    const label = match ? match.localizedLabel : "";
    setselected_value(label);
    if (match) {
      setSearch(label);
      onSelect(value);
      setShowDropdown(false);
      setFocusedIndex(-1);
    }
  };

  const handleOptionClick = (value) => {
    handleSelect(value);
  };

  return (
    <div className="inputbox-margin">
      {title && <div className="inputbox-title">{title}</div>}

      <div ref={dropdownRef} className="nationality-dropdown relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={searchNationality}
          value={selected_value != "" ? selected_value : search}
          onChange={handleChange}
          onFocus={() => {
            setSearch("");
            setShowDropdown(true);
          }}
          onKeyDown={handleKeyDown}
          className="forminputbox w-full"
          role="combobox"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-activedescendant={
            focusedIndex >= 0 ? `nationality-option-${focusedIndex}` : undefined
          }
          aria-label="Search and select nationality"
          dir={currentLanguage === "ar" ? "rtl" : "ltr"}
        />
        <div 
          className="up-downarrow"
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
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
              className="cursor-pointer"
            />
          ) : (
            <img
              src={downarrow.src}
              alt="Expand options"
              onClick={() => {
                setSearch("");
                setShowDropdown(true);
              }}
              className="cursor-pointer"
            />
          )}
        </div>

        {showDropdown && (
          <div
            className="absolute bg-white shadow-xl rounded-xl p-2 z-50 max-h-60 overflow-y-auto w-full mt-1 border"
            role="listbox"
            aria-label="Nationality options"
            dir={currentLanguage === "ar" ? "rtl" : "ltr"}
          >
            {filteredList.length > 0 ? (
              filteredList.map((nation, index) => (
                <div
                  key={nation.value}
                  id={`nationality-option-${index}`}
                  className={`cursor-pointer py-2 px-3 hover:bg-gray-100 rounded subcategory-item ${
                    nation.localizedLabel === selected_value
                      ? "bg-purple-200 text-purple-700"
                      : ""
                  } ${
                    index === focusedIndex ? "bg-blue-100 text-blue-700" : ""
                  } ${currentLanguage === "ar" ? "text-right" : "text-left"}`}
                  onClick={() => handleOptionClick(nation.value)}
                  role="option"
                  aria-selected={nation.localizedLabel === selected_value}
                >
                  {nation.localizedLabel}
                </div>
              ))
            ) : (
              <div
                className={`cursor-default py-2 px-3 text-gray-500 ${
                  currentLanguage === "ar" ? "text-right" : "text-left"
                }`}
                role="option"
              >
                {noResultsFound}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NationalityDropdown;
