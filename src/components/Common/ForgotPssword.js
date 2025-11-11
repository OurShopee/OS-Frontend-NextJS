"use client";
import { forgetPassword } from "@/api/user";
import Formvalidation from "@/components/Validation/Formvalidation";
import { setformstatus } from "@/redux/formslice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { toast } from "react-toastify";
import Inputbox from "./Inputbox";
import { useContent, useCurrentLanguage } from "@/hooks";

const ForgotPssword = () => {
  const dispatch = useDispatch();
  const isBigScreen = useMediaQuery({ query: "(min-width: 991px)" });
  const currentLanguage = useCurrentLanguage();

  const incorrectemailstatus = useSelector(
    (state) => state.formslice.incorrectemailstatus
  );

  // Content translations
  const forgotPassword = useContent("buttons.forgotPassword");
  const pleaseFillForm = useContent("buttons.pleaseFillForm");
  const enterEmail = useContent("buttons.emailPlaceholder");
  const sending = useContent("buttons.sending");
  const sendResetLink = useContent("buttons.sendResetLink");
  const ifYouHaveAnAccountPleaseLogin = useContent("buttons.ifYouHaveAnAccountPleaseLogin");
  const login = useContent("buttons.login");

  const [formData, setFormData] = useState({
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNext = async () => {
    try {
      setIsLoading(true);
      setErrors({}); // Clear any previous errors

      if (!validateEmail(formData.email)) {
        setErrors({ email: "Please enter a valid email" });
        setIsLoading(false);
        return;
      }

      const data = await forgetPassword(formData);
      if (data.status === "invalid") {
        setErrors({ email: data.message || "Invalid Email" });
      }
      if (data.status === "success") {
        setErrors({ email: "" });
        setIsLoading(false);
        toast.success(data.message);
      }
    } catch (error) {
      setErrors({ email: error.message || "Something went wrong" });
    } finally {
      setIsLoading(false);
    }
  };

  const { handleChange, handleSubmit } = Formvalidation(
    formData,
    setFormData,
    setErrors,
    handleNext
  );

  const openregister = () => {
    dispatch(setformstatus(1));
  };

  const isFormValid = formData.email && !isLoading;

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
            {forgotPassword}
          </div>
          <div className="formsubheading">
            {pleaseFillForm}
          </div>
          <div className="form-border-bottom"></div>
        </div>
      )}

      <div className="form-mobile-design">
        <form onSubmit={handleFormSubmit} noValidate>
          <div className="inputbox-margin">
            <Inputbox
              id="email"
              type="email"
              placeholder={enterEmail}
              value={formData.email}
              handleChange={handleChange}
              error={
                errors.email || (incorrectemailstatus ? "Incorrect Email" : "")
              }
              aria-label="Email address"
              aria-required="true"
            />
          </div>
          <button
            type="submit"
            className={
              isFormValid ? "activeformsubmitbutton" : "formsubmitbutton"
            }
            disabled={!isFormValid}
            aria-label="Send password reset link"
          >
            {isLoading ? sending : sendResetLink}
          </button>
          <div className="formbotton">
            {ifYouHaveAnAccountPleaseLogin}{" "}
            <button
              type="button"
              className={`primarycolor termstitle bg-transparent border-0 p-0 underline cursor-pointer hover:opacity-80 ${
                currentLanguage === "ar" ? "mr-1" : "ml-1"
              }`}
              onClick={openregister}
              aria-label="Go to login form"
            >
              {login}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPssword;
