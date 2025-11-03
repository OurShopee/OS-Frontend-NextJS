import axios from "axios";
import Cookies from "js-cookie";

export const getalladdresses = async (idaddress) => {
  const res = await axios.get(`api/getalladdresses?idaddress=${idaddress}`, {
    headers: { authorization: "Bearer " + Cookies.get("jwt_token") },
  });
  return res.data;
};

export const getMyProfile = async () => {
  const res = await axios.get("api/getMyProfile", {
    headers: { authorization: "Bearer " + Cookies.get("jwt_token") },
  });
  return res.data;
};
export const checkmobileotp = async (input_data) => {
  const res = await axios.post("/api/checkMobile", input_data);
  return res.data;
};

export const updateMyProfile = async (input_data) => {
  const res = await axios.post("/api/updateMyProfile", input_data, {
    headers: { authorization: "Bearer " + Cookies.get("jwt_token") },
  });
  return res.data;
};
export const changePassword = async (input_data) => {
  const res = await axios.post("/api/changePassword", input_data, {
    headers: { authorization: "Bearer " + Cookies.get("jwt_token") },
  });
  return res.data;
};

export const verifyMobileOtp = async (input_data) => {
  const res = await axios.post("/api/verifyMobileOtp", input_data);
  return res.data;
};

export const reSendOtpeOtp = async (input_data) => {
  const res = await axios.post("/api/reSendOtp", input_data);
  return res?.data;
};
export const reSendOtpWhatsapp = async (input_data) => {
  const res = await axios.post("/api/reSendOtpWhatsapp", input_data);
  return res.data;
};

export const logiapi = async (input_data) => {
  const res = await axios.post("api/Login", input_data);
  return res.data;
};
export const forgetPassword = async (input_data) => {
  const res = await axios.post("api/forgotPassword", input_data);
  return res.data;
};
export const resetpassword = async (input_data) => {
  const res = await axios.post("api/resetpassword", input_data);
  return res.data;
};
export const deleteUserAddress = async (input_data) => {
  const res = await axios.post("api/deleteUserAddress", input_data, {
    headers: { authorization: "Bearer " + Cookies.get("jwt_token") },
  });
  return res.data;
};
export const saveDefaultAddress = async (input_data) => {
  const res = await axios.post("api/saveDefaultAddress", input_data, {
    headers: { authorization: "Bearer " + Cookies.get("jwt_token") },
  });
  return res.data;
};
export const CheckEmail = async (input_data) => {
  const res = await axios.post("api/CheckEmail", input_data);
  return res.data;
};
export const checkMobile = async (input_data) => {
  const res = await axios.post("api/checkMobile", input_data, {
    headers: { authorization: "Bearer " + Cookies.get("jwt_token") },
  });
  return res.data;
};

export const Signup = async (input_data) => {
  const res = await axios.post("api/Signup", input_data);
  return res.data;
};

export const postUserAddressApi = async (input_data) => {
  const response = await axios.post(`api/postUserAddress`, input_data, {
    headers: { authorization: "Bearer " + Cookies.get("jwt_token") },
  });
  return response;
};
export const postForgotPasswordLink = async (input_data) => {
  const response = await axios.post(`/api/forgotPassword`, input_data, {
    headers: { authorization: "Bearer " + Cookies.get("jwt_token") },
  });
  return response;
};
export const get_VelidateResetToken = async (input_data) => {
  const response = await axios.get(`/api/reset-password/${input_data}`);
  return response;
};
export const post_changePassword = async (input_data) => {
  const response = await axios.post(
    `/api/reset-password/${input_data.token}`,
    input_data
  );
  return response;
};

export const trackdataorderid = async (input_data) => {
  const response = await axios.get(
    `api/myOrder/trackdata?orderid=${input_data.orderid}&contact=${input_data.phone}`,
    {
      headers: { authorization: "Bearer " + Cookies.get("jwt_token") },
    }
  );
  return response.data;
};

export const myorder = async (input_data) => {
  const response = await axios.get(
    `api/myOrders?page=${input_data.page}&refid=${input_data.referenceid}`,
    {
      headers: { authorization: "Bearer " + Cookies.get("jwt_token") },
    }
  );
  return response.data;
};

export const trackdatabyreferencid = async (input_data) => {
  const response = await axios.get(
    `api/myOrders?page=${input_data.page}&refid=${input_data.referenceid}`,
    {
      headers: { authorization: "Bearer " + Cookies.get("jwt_token") },
    }
  );
  return response.data;
};
