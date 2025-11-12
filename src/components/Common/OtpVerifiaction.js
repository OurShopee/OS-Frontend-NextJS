"use client";
import { reSendOtpeOtp, reSendOtpWhatsapp } from "@/api/user";
import {
  setformmodal,
  setformstatus,
  setotperror,
  setotpmodal,
  verifyMobileOtpapi,
} from "@/redux/formslice";
import { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { useContent, useCurrentLanguage } from "@/hooks";

export default function OtpVerifiaction() {
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const currentLanguage = useCurrentLanguage();
  const registermobile = useSelector((state) => state.formslice.registermobile);
  const checkotperror = useSelector((state) => state.formslice.checkotperror);
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );

  // Content translations
  const verifyPhoneNumber = useContent("buttons.verifyPhoneNumber");
  const toProceedToCheckout = useContent("buttons.toProceedToCheckout");
  const otpSentTo = useContent("buttons.otpSentTo");
  const changeNumber = useContent("buttons.changeNumber");
  const clickHere = useContent("buttons.clickHere");
  const resendOtpIn = useContent("buttons.resendOtpIn");
  const sec = useContent("buttons.sec");
  const resendOtpViaSms = useContent("buttons.resendOtpViaSms");
  const resendOtpViaWhatsapp = useContent("buttons.resendOtpViaWhatsapp");
  const submitAndVerify = useContent("buttons.submitAndVerify");

  const verifyotp = async () => {
    const input_data = {
      mobile: registermobile,
      otp: otp,
    };
    const res = await dispatch(verifyMobileOtpapi(input_data));
    if (res.payload.status === "success") {
      dispatch(setformstatus(0));
      dispatch(setformmodal(false));
    }
  };

  const handleClose = () => {
    dispatch(setotpmodal(false));
  };

  const [timer, setTimer] = useState(20);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleResend = async (type) => {
    dispatch(setotperror(""));
    // 👇 your resend OTP API call here
    var input_data = {
      mobile: registermobile,
    };
    if (type == 1) {
      const res = await reSendOtpeOtp(input_data);
      if (res.status === "blocked") {
        setTimer(0);
        dispatch(setotperror(res.message));
        return;
      }
    } else {
      const res = await reSendOtpWhatsapp(input_data);
      if (res.status === "blocked") {
        setTimer(0);
        dispatch(setotperror(res.message));
        return;
      }
    }
    setTimer(20);
    setCanResend(false);
  };

  return (
    <div className="otpverification-main" dir={currentLanguage === "ar" ? "rtl" : "ltr"}>
      <div
        style={{ "-webkit-text-fill-color": "transparent" }}
        className="FormHeading"
      >
        {verifyPhoneNumber}
      </div>
      <div className="formsubheading mt-2">
        {toProceedToCheckout}
      </div>
      <div className="formsubheading">
        {otpSentTo} {currentcountry.country_code}-{registermobile}
      </div>
      <div className="formsubheading">
        {changeNumber}{" "}
        <button
          type="button"
          className="link_custome bg-transparent border-0 p-0 underline cursor-pointer hover:opacity-80"
          onClick={handleClose}
          aria-label="Change phone number"
        >
          {clickHere}
        </button>
      </div>

      <div role="group" aria-label="Enter 4-digit verification code">
        <OtpInput
          value={otp}
          onChange={setOtp}
          inputType={"tel"}
          numInputs={4}
          renderSeparator={
            <span className="mx-2" aria-hidden="true">
              {" "}
            </span>
          }
          renderInput={(props, index) => (
            <input
              {...props}
              className="otpinput mt-4"
              aria-label={`Digit ${index + 1} of verification code`}
              autoComplete="one-time-code"
            />
          )}
        />
      </div>

      {timer > 0 && (
        <p className="mt-3" aria-live="polite">
          {resendOtpIn} {timer} {sec}
        </p>
      )}

      {checkotperror && (
        <p
          className="otperror text-red-500 mt-2"
          role="alert"
          aria-live="assertive"
        >
          {checkotperror}
        </p>
      )}

      <button
        className={
          otp.length !== 4 ? "formsubmitbutton" : "activeformsubmitbutton"
        }
        onClick={verifyotp}
        disabled={otp.length !== 4}
        aria-label="Submit and verify OTP"
      >
        {submitAndVerify}
      </button>

      <div className={`w-full flex my-2 px-2 ${
        currentLanguage === "ar" ? "flex-row-reverse justify-between" : "justify-between"
      }`}>
        <button
          type="button"
          className={`link_custome bg-transparent border-0 p-0 underline cursor-pointer hover:opacity-80 ${
            timer > 0 ? "custom_disabled opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => handleResend(1)}
          disabled={timer > 0}
          aria-label="Resend OTP via SMS"
          aria-disabled={timer > 0}
        >
          {resendOtpViaSms}
        </button>
        {currentcountry?.id === 1 && (
          <button
            type="button"
            className={`link_custome bg-transparent border-0 p-0 underline cursor-pointer hover:opacity-80 ${
              timer > 0 ? "custom_disabled opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => handleResend(2)}
            disabled={timer > 0}
            aria-label="Resend OTP via WhatsApp"
            aria-disabled={timer > 0}
          >
            {resendOtpViaWhatsapp}
          </button>
        )}
      </div>
    </div>
  );
}
