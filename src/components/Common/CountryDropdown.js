"use client";
import { useState } from "react";
import { Dropdown } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
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

  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );

  return (
    <Dropdown
      className="header-middle-rightsub countrydropdown font-semibold"
      show={isOpen}
      onMouseEnter={() => setIsOpen(true)} // Open on hover
      onMouseLeave={() => setIsOpen(false)} // Close on hover out
    >
      {Object.keys(currentcountry).length > 0 && (
        <Dropdown.Toggle className="flex items-center counterslecteddropdown">
          <img
            src={`/flags/${currentcountry.image}`}
            alt={currentcountry.name}
            className="mr-2"
            width="20"
          />
          {currentcountry.name}

          {isOpen ? (
            <FaAngleUp className="ml-1 secondarycolor" />
          ) : (
            <FaAngleDown className="ml-1" />
          )}
        </Dropdown.Toggle>
      )}

      <Dropdown.Menu className="custom-dropdown-menu">
        {countryDropdown.length > 0 &&
          countryDropdown
            .filter(({ id }) => id != currentcountry.id)
            .map((option) => (
              <Dropdown.Item
                key={option.name}
                onClick={() => {
                  if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
                    window.open(option.dev_url, "_blank");
                  } else {
                    window.open(option.url, "_blank");
                  }

                  setSelected(option);
                  setIsOpen(false);
                }}
                className="flex items-center custom-dropdown-item"
              >
                <img
                  src={`/flags/${option.image}`}
                  alt={option.name}
                  className="mr-2"
                  width="20"
                />
                {option.name}
              </Dropdown.Item>
            ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
