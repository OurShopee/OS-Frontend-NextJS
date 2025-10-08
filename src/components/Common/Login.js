"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { loginapidata, setformstatus } from "@/redux/formslice";
import Cookies from "js-cookie";

import Inputbox from "./Inputbox";
import Formvalidation from "@/components/Validation/Formvalidation";
import { toast } from "react-toastify";

const Login = () => {
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
            Login
          </div>
          <div className="formsubheading">
            If you have an account with us, please login.
          </div>
          <div className="form-border-bottom"></div>
        </div>
      )}

      <form action="" className="form-mobile-design">
        <div className="mb-6">
          <Inputbox
            id="email"
            type="text"
            placeholder="Enter Email"
            value={formData.email}
            handleChange={handleChange}
          />
        </div>

        <div className="mb-6">
          <Inputbox
            id="password"
            type="password"
            placeholder="Enter password"
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
              <span className="ml-2">Remember me</span>
            </div>
          </label>
          <div
            className="forgotpasswordtext cursor-pointer text-blue-500 hover:underline"
            onClick={openforgotpassword}
          >
            Forgot Password?
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
          Login
        </button>

        <div className="formbotton mt-4">
          If you don't have an account,
          <span
            className="primarycolor termstitle ml-1 cursor-pointer underline text-blue-600"
            onClick={openregister}
          >
            {" "}
            Sign up{" "}
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;
