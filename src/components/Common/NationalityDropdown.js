"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import uparrow from "@/images/Vectoruparrow.png";
import downarrow from "@/images/Vectordownarrow.png";
import Image from "next/image";

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

  // Sync input field with selectedNationality label when it changes
  useEffect(() => {
    const match = nationalitydata.find(
      (nation) => nation.value == selectedNationality
    );
    setSearch(match ? match.label : "");
  }, [selectedNationality, nationalitydata]);

  // Filtered dropdown options based on search
  const filteredList = useMemo(() => {
    return nationalitydata?.filter((nation) =>
      nation.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, nationalitydata]);

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

    const exactMatch = nationalitydata.find(
      (nation) => nation.label.toLowerCase() === value.toLowerCase()
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
    const match = nationalitydata.find((nation) => nation.value === value);
    setselected_value(match.label);
    if (match) {
      setSearch(match.label);
      onSelect(value);
      setShowDropdown(false);
      setFocusedIndex(-1);
      inputRef.current?.focus();
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
          placeholder="Search Nationality"
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
        />
        <div className="up-downarrow absolute right-2 top-1/2 -translate-y-1/2">
          {showDropdown ? (
            <img
              src={uparrow}
              alt="Collapse options"
       
              onClick={() => setShowDropdown(false)}
              className="cursor-pointer"
            />
          ) : (
            <img
              src={downarrow}
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
          >
            {filteredList.length > 0 ? (
              filteredList.map((nation, index) => (
                <div
                  key={nation.value}
                  id={`nationality-option-${index}`}
                  className={`cursor-pointer py-2 px-3 hover:bg-gray-100 rounded subcategory-item ${
                    nation.label === selected_value
                      ? "bg-purple-200 text-purple-700"
                      : ""
                  } ${
                    index === focusedIndex ? "bg-blue-100 text-blue-700" : ""
                  }`}
                  onClick={() => handleOptionClick(nation.value)}
                  role="option"
                  aria-selected={nation.label === selected_value}
                >
                  {nation.label}
                </div>
              ))
            ) : (
              <div
                className="cursor-default py-2 px-3 text-gray-500"
                role="option"
              >
                No results found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NationalityDropdown;
