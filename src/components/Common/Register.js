"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Inputbox from "./Inputbox";
import PhoneInput from "./PhoneInput";
import GenderDropdown from "./GenderDropdown";
import NationalityDropdown from "./NationalityDropdown";

import {
  checkmobileotpapi,
  getnationalitydata,
  CheckEmailapi,
  setformmodal,
  Signupapi,
  setformstatus,
  setcheckemailerror,
  setregistermobile,
  setotperror,
} from "../../redux/formslice";
import Formvalidation from "@/components/Validation/Formvalidation";

// Custom NavLink component for Next.js App Router
const NavLink = ({ to, children, className, onClick, ...props }) => {
  const pathname = usePathname();
  const isActive = pathname === to;

  return (
    <Link href={to} {...props}>
      <span
        className={`${className} ${isActive ? "active" : ""}`}
        onClick={onClick}
      >
        {children}
      </span>
    </Link>
  );
};

const SignupForm = () => {
  const dispatch = useDispatch();
  const nationalitydata = useSelector(
    (state) => state.formslice.nationalitydata
  );
  const checkemailerror = useSelector(
    (state) => state.formslice.checkemailerror
  );
  const registerapicall = useSelector(
    (state) => state.formslice.registerapicall
  );
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const isBigScreen = useMediaQuery({ query: "(min-width: 991px)" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getnationalitydata());
    dispatch(setcheckemailerror(""));
  }, [dispatch]);

  const [formData, setFormData] = useState({
    first_name: "",
    gender: "",
    nationality: "",
    email: "",
    password: "",
    agreeTerms: false,
    offersale: false,
  });

  const [areaCode, setAreaCode] = useState("50");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (formData.email.includes("@gmail.com")) {
      dispatch(CheckEmailapi({ email: formData.email }));
    }
  }, [formData.email]);

  const handlePhoneInput = (e) => {
    setPhoneNumber(
      e.target.value.replace(/\D/g, "").slice(0, currentcountry.number_count)
    );
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isFormValid = () =>
    formData.first_name &&
    formData.gender &&
    formData.agreeTerms &&
    formData.offersale &&
    checkemailerror == "" &&
    formData.nationality &&
    validateEmail(formData.email) &&
    formData.password &&
    phoneNumber.length >= currentcountry.number_count;

  const handleNext = async () => {
    if (!isFormValid()) return;

    if (currentcountry.isAreaCodeRequired) {
      var mobileNumber = `${areaCode}${phoneNumber}`;
    } else {
      var mobileNumber = `${phoneNumber}`;
    }

    dispatch(setcheckemailerror(""));
    const res = await dispatch(checkmobileotpapi({ mobile: mobileNumber }));
    if (res.payload.status === "blocked") {
      dispatch(setotperror(res.payload.message));
    }
    dispatch(setregistermobile(mobileNumber));
  };

  const { handleChange, handleSubmit } = Formvalidation(
    formData,
    setFormData,
    setErrors,
    handleNext
  );

  useEffect(() => {
    if (registerapicall) {
      const mobileNumber = `${areaCode}${phoneNumber}`;
      dispatch(Signupapi({ ...formData, mobile: mobileNumber }));
    }
  }, [registerapicall]);

  const handleCloseDropDown = () => {
    dispatch(setformstatus(0));
    dispatch(setformmodal(false));
  };

  return (
    <div className="signup-form">
      {isBigScreen && (
        <>
          <div
            className="FormHeading"
            style={{ WebkitTextFillColor: "transparent" }}
          >
            Create an account
          </div>
          <div className="formsubheading">Looks like you're new here!</div>
          <div className="form-border-bottom"></div>
        </>
      )}

      <Inputbox
        id="first_name"
        type="text"
        value={formData.first_name}
        handleChange={handleChange}
        placeholder="Enter Name"
      />

      <GenderDropdown
        selectedGender={formData.gender}
        onSelect={(gender) => setFormData((prev) => ({ ...prev, gender }))}
      />

      <NationalityDropdown
        nationalitydata={nationalitydata}
        selectedNationality={formData.nationality}
        onSelect={(value) =>
          setFormData((prev) => ({ ...prev, nationality: value }))
        }
      />

      <Inputbox
        id="email"
        type="email"
        value={formData.email}
        handleChange={handleChange}
        placeholder="Enter Email"
        error={checkemailerror && checkemailerror}
      />
      <Inputbox
        id="password"
        type="password"
        value={formData.password}
        handleChange={handleChange}
        placeholder="Enter Password"
      />

      <PhoneInput
        areaCode={areaCode}
        setAreaCode={setAreaCode}
        phoneNumber={phoneNumber}
        handlePhoneInput={handlePhoneInput}
      />

      <label className="registercheckbox mt-4 cursor-pointer">
        <input
          type="checkbox"
          name="agreeTerms"
          checked={formData.agreeTerms}
          onChange={handleChange}
        />
        <span className="ml-3">
          I agree to
          <NavLink
            to={"/terms-and-conditions"}
            onClick={handleCloseDropDown}
            className="no-underline primarycolor termstitle"
          >
            Terms
          </NavLink>
          &
          <NavLink
            to={"/privacy-policy"}
            onClick={handleCloseDropDown}
            className="no-underline primarycolor termstitle"
          >
            Privacy Policy
          </NavLink>
        </span>
      </label>

      <label className="registercheckbox mt-3 cursor-pointer">
        <input
          type="checkbox"
          name="offersale"
          checked={formData.offersale}
          onChange={handleChange}
        />
        <span className="ml-3">
          Yes, I would like to receive news, special offers & other information
          about ourshopee.com
        </span>
      </label>

      <button
        className={
          !isFormValid() ? "formsubmitbutton" : "activeformsubmitbutton"
        }
        onClick={() => isFormValid() && handleSubmit()}
      >
        Sign Up
      </button>

      <div className="formbotton">
        Already have an account?
        <span
          className="primarycolor termstitle"
          onClick={() => dispatch(setformstatus(1))}
        >
          {" "}
          Login{" "}
        </span>
      </div>
    </div>
  );
};

export default SignupForm;
