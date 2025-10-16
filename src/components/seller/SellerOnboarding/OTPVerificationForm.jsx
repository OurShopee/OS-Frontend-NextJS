import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  sent_mobile_email_otp,
  verifyMobileOtpForSeller,
} from "../../services/Apis";
import DoubleGradientButton from "../Common/Button";

const OTPVerificationForm = ({ email, mobile, onNext, onBack }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(45);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const inputsRef = useRef([]);

  useEffect(() => {
    if (timer > 0) {
      const int = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(int);
    }
  }, [timer]);

  const handleOtpChange = (v, idx) => {
    const newOtp = [...otp];
    const digitMatch = v.match(/\d/);
    const digit = digitMatch ? digitMatch[0] : "";

    newOtp[idx] = digit;
    setOtp(newOtp);
    if (digit && idx < 5) {
      inputsRef.current[idx + 1].focus();
    }

    if (error) {
      setError("");
    }
  };

  const sendOTP = async (email, phoneNumber) => {
    try {
      let inputdata = {
        email: email,
        mobile: phoneNumber,
      };
      const response = await sent_mobile_email_otp(inputdata);

      if (response.data.status != "success") {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success(response.data.message);

      return response;
    } catch (error) {
      console.error("Error sending OTP:", error);
      throw error;
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError("");

    try {
      const data = await sendOTP(email, mobile.replace(/[\s+]/g, ""));
      setTimer(45);
      setOtp(["", "", "", "", "", ""]);
    } catch (error) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const verifyOTP = async (otpString) => {
    try {
      const response = await verifyMobileOtpForSeller(otpString);
      toast.success(response.data.message);
      return response;
    } catch (err) {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert OTP array to string
    const otpString = otp.join("");

    // Validate OTP length
    if (otpString.length !== 6) {
      setError("Please enter complete 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let inputdata = {
        email: email,
        mobile: mobile.replace(/[\s+]/g, ""),
        otp: otpString,
      };
      const result = await verifyOTP(inputdata);
      if (result.data.status == "success") {
        onNext();
      } else if (result.data.status == "invalid") {
        setOtp(["", "", "", "", "", ""]);
        setError("Please Enter correct one time password.");
      } else {
        setOtp(["", "", "", "", "", ""]);
        setError(result.error);
        toast.error(result.error);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4 sm:space-y-8 mb-4" onSubmit={handleSubmit}>
      <div className="sm:hidden w-full flex justify-center items-center">
        <img
          src="/assets/seller/otp-gif.png"
          alt=""
          className="w-60 h-auto"
          data-aos="bounce-fade-up"
          data-aos-easing="ease-in-out"
          data-aos-duration="600"
        />
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="font-bold text-[22px] sm:text-3xl mb-0">
          We just sent a mail
        </h2>
        <p className="text-mygray">
          Enter the security code we sent to
          <br />
          <span className="text-blue-600 font-semibold">{mobile}</span> &{" "}
          <span className="text-blue-600 font-semibold">{email}</span>
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-6 gap-3 sm:gap-4 my-8">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={(ref) => (inputsRef.current[idx] = ref)}
            type="text"
            pattern="[0-9]*"
            inputMode="numeric"
            className={`h-[4rem] w-full sm:h-[5.5rem] rounded-[12px] bg-[#FCFCFC] text-[22px] sm:text-3xl text-center font-semibold custom-input ${
              error ? "border-red-500" : ""
            } ${digit ? "filled" : ""} input-focus`}
            style={{
              border: error
                ? "1.54px solid #ef4444"
                : digit
                ? "1.54px solid #5232c2"
                : "1.54px solid #d1d1d1",
            }}
            value={digit}
            onChange={(e) => {
              const inputValue = e.target.value.replace(/\D/g, ""); // Only allow digits
              handleOtpChange(inputValue.slice(0, 1), idx); // Take only the first digit
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !otp[idx] && idx > 0) {
                inputsRef.current[idx - 1].focus();
              }
            }}
            disabled={loading || resendLoading}
          />
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <span>
            Didn't get the code?{" "}
            <button
              type="button"
              className={`${
                timer ? "text-[#ac95fe]" : "text-primary"
              } bg-transparent border-none`}
              onClick={handleResendOTP}
              disabled={loading || resendLoading || timer > 0}
            >
              {resendLoading ? "Sending..." : "Resend it"}
            </button>
          </span>
          <span className="flex items-center gap-1 font-semibold text-gray-600">
            {timer > 0 && (
              <>
                {" "}
                <span>&#128337;</span> {timer}s
              </>
            )}
          </span>
        </div>
        <DoubleGradientButton
          title={loading ? "Verifying..." : "Confirm OTP"}
          className={"!mt-2"}
          disabled={loading || resendLoading}
        />
      </div>
    </form>
  );
};

export default OTPVerificationForm;
