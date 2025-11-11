"use client";
import React from "react";
import { useSelector } from "react-redux";

const PhoneInput = ({
  title,
  areaCode,
  setAreaCode,
  phoneNumber,
  handlePhoneInput,
}) => {
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const areaCodes =
    currentcountry && currentcountry.id === 7
      ? ["50", "51", "53", "54", "55", "56", "57", "58", "59"]
      : ["50", "52", "54", "55", "56", "58"];

  return (
    <div className="inputbox-margin">
      <div className="flex flex-col mb-2">
        {title && <div className="inputbox-title">{title}</div>}
        <div className="flex">
          <span className="w-[100px]">
            <input
              className="form-control phonecountrycode"
              type="text"
              value={currentcountry.country_code}
              disabled
              aria-label="Country code"
            />
          </span>
          {currentcountry.isAreaCodeRequired ? (
            <span className="preSpan flex ml-2 mr-2 w-[105px]">
              <select
                name="pre"
                onChange={(e) => setAreaCode(e.target.value)}
                value={areaCode}
                className="phoneareacode pl-1 border-0 w-full"
                aria-label="Area code"
              >
                {areaCodes.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </span>
          ) : (
            <span className="mr-2"></span>
          )}

          <span className="w-full">
            <input
              type="text"
              placeholder="Enter Number"
              className="forminputbox mobileno w-full"
              value={phoneNumber}
              onChange={handlePhoneInput}
              aria-label="Phone number"
            />
          </span>
        </div>
      </div>
    </div>
  );
};

export default PhoneInput;
