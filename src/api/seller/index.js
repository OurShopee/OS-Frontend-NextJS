import axios from "axios";
import Cookies from "js-cookie";

export const addVendorApi = async (formData) => {
    const response = await axios.post(`/api/add-vendor`, formData);
    return response;
  };

  export const sent_mobile_email_otp = async (input_data) => {
    const response = await axios.post(`/api/send-otps`, input_data);
    return response;
  };

  export const verifyMobileOtpForSeller = async (input_data) => {
    const res = await axios.post("/api/verifyMobileOtp", input_data);
    return res;
  };