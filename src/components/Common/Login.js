"use client";
import { loginapidata, setformstatus } from "@/redux/formslice";
import Cookies from "js-cookie";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useMediaQuery } from "react-responsive";

import Formvalidation from "@/components/Validation/Formvalidation";
import Inputbox from "./Inputbox";

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
    if (res?.payload?.status === "failure") {
      setErrors(res.payload.message.split("err:")[1]);
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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      handleSubmit();
    }
  };

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

      <form
        onSubmit={handleFormSubmit}
        className="form-mobile-design"
        noValidate
      >
        <div className="inputbox-margin">
          <Inputbox
            id="email"
            type="email"
            placeholder="Enter Email"
            value={formData.email}
            handleChange={handleChange}
            aria-label="Email address"
            aria-required="true"
          />
        </div>

        <div className="inputbox-margin">
          <Inputbox
            id="password"
            type="password"
            placeholder="Enter password"
            value={formData.password}
            handleChange={handleChange}
            error={errors ? errors : ""}
            aria-label="Password"
            aria-required="true"
            aria-describedby={errors ? "password-error" : undefined}
          />
        </div>

        <div className="flex justify-between items-center">
          <label className="registercheckbox flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="agreeTermFsends"
              checked={formData.agreeTerms || false}
              onChange={handleChange}
              className="mr-2"
              aria-label="Remember me"
            />
            <span className="ml-2">Remember me</span>
          </label>
          <button
            type="button"
            className="forgotpasswordtext cursor-pointer bg-transparent border-0 p-0 underline text-blue-600 hover:text-blue-800"
            onClick={openforgotpassword}
            aria-label="Reset your password"
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          className={
            isFormValid ? "activeformsubmitbutton" : "formsubmitbutton"
          }
          disabled={!isFormValid}
          aria-label="Sign in to your account"
        >
          Login
        </button>

        <div className="formbotton">
          If you don't have an account,
          <button
            type="button"
            className="primarycolor termstitle bg-transparent border-0 p-0 ml-1 underline cursor-pointer hover:opacity-80"
            onClick={openregister}
            aria-label="Create a new account"
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
