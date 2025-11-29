"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getAssetsUrl } from "../utils/helpers";
import Image from "next/image";

const Inputbox = ({
  type,
  id,
  value,
  title,
  handleChange,
  error,
  placeholder,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );

  const isPassword = type === "password";
  const actualInputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="inputbox-margin">
      {title && <div className="inputbox-title">{title}</div>}

      <div className="inputbox-field relative">
        {id === "mobile" && (
          <span className="w-[100px] pr-[10px]">
            <input
              className="form-control phonecountrycode"
              type="text"
              value={currentcountry.country_code}
              disabled
            />
          </span>
        )}

        <input
          type={actualInputType}
          id={id}
          name={id}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`forminputbox ${error ? "danderborder" : ""}`}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={error ? "true" : "false"}
        />

        {isPassword && (
          <button
            type="button"
            className="inputboxeye absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer bg-transparent border-0 p-1"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
          >
            <img src={showPassword ? getAssetsUrl("closeeye.png") : getAssetsUrl("openeye.png")}
              alt={showPassword ? "Hide password" : "Show password"}
            loading="lazy" />
          </button>
        )}
      </div>

      {error && (
        <div
          className="text-red-500 flex items-center mt-1"
          id={`${id}-error`}
          role="alert"
        >
          <img src={getAssetsUrl("Danger Triangle.png")} alt="Error" loading="lazy" />
          <span className="incooretinput pl-2">{error}</span>
        </div>
      )}
    </div>
  );
};

export default Inputbox;
