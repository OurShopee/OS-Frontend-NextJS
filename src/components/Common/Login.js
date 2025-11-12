"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { loginapidata, setformstatus } from "@/redux/formslice";
import Cookies from "js-cookie";

import Inputbox from "./Inputbox";
import Formvalidation from "@/components/Validation/Formvalidation";
import { toast } from "react-toastify";
import { useContent, useCurrentLanguage } from "@/hooks";

const Login = () => {
  const currentLanguage = useCurrentLanguage();
  const rememberMe = useContent("buttons.rememberMe");
  const forgotPassword = useContent("buttons.forgotPassword");
  const signup = useContent("buttons.signup");
  const login = useContent("buttons.login");
  const emailPlaceholder = useContent("buttons.emailPlaceholder");
  const passwordPlaceholder = useContent("buttons.passwordPlaceholder");
  const ifYouDontHaveAnAccount = useContent("buttons.ifYouDontHaveAnAccount");
  const ifYouHaveAnAccount = useContent("buttons.ifYouHaveAnAccount");
  const dispatch = useDispatch();
  const isBigScreen = useMediaQuery({ query: "(min-width: 991px)" });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    oscad: Cookies.get("cart_ip_address") || "",
  });

  const [errors, setErrors] = useState();
  const handleNext = async () => {
    const res = await dispatch(loginapidata(formData));
    if (res?.payload?.status === "success") {
      toast.success(res.payload.message);
    }
    if (res?.payload?.status === "failure") {
      setErrors(res.payload.message);
    }
  };

  const { handleChange, handleSubmit } = Formvalidation(
    formData,
    setFormData,
    setErrors,
    handleNext
  );

  const openregister = () => {
    dispatch(setformstatus(2));
  };

  const openforgotpassword = () => {
    dispatch(setformstatus(4));
  };

  const isFormValid = formData.email && formData.password;

  return (
    <div className="signup-form">
      {isBigScreen && (
        <div>
          <div
            className="FormHeading"
            style={{ WebkitTextFillColor: "transparent" }}
          >
            {login}
          </div>
          <div className="formsubheading">
            {ifYouHaveAnAccount}
          </div>
          <div className="form-border-bottom"></div>
        </div>
      )}

      <form action="" className="form-mobile-design">
        <div className="mb-6">
          <Inputbox
            id="email"
            type="text"
            placeholder={emailPlaceholder}
            value={formData.email}
            handleChange={handleChange}
          />
        </div>

        <div className="mb-6">
          <Inputbox
            id="password"
            type="password"
            placeholder={passwordPlaceholder}
            value={formData.password}
            handleChange={handleChange}
            error={errors ? errors : ""}
          />
        </div>

        <div className="flex justify-between items-center mb-6">
          <label className="registercheckbox">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="agreeTermFsends"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              <span className={`${currentLanguage === "ar" ? "mr-2" : "ml-2"}`}>{rememberMe}</span>
            </div>
          </label>
          <div
            className="forgotpasswordtext cursor-pointer text-blue-500 hover:underline"
            onClick={openforgotpassword}
          >
            {forgotPassword}
          </div>
        </div>
        <button
          className={
            isFormValid
              ? "activeformsubmitbutton bg-blue-600 text-white px-4 py-2 rounded"
              : "formsubmitbutton bg-gray-300 text-gray-700 px-4 py-2 rounded cursor-not-allowed"
          }
          disabled={!isFormValid}
          onClick={isFormValid && handleSubmit}
        >
          {login}
        </button>

        <div className="formbotton mt-4">
          {ifYouDontHaveAnAccount}
          <span
            className="primarycolor termstitle ml-1 cursor-pointer no-underline text-blue-600"
            onClick={openregister}
          >
            {" "}
            {signup}
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;
