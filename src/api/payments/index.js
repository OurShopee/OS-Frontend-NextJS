import axios from "axios";
import Cookies from "js-cookie";

export const GetPlaceOrder = async (userId) => {
  const res = await axios.get(`api/v2/GetPlaceOrder?userId=${userId}`, {
    headers: { authorization: "Bearer " + Cookies.get("jwt_token") },
  });
  return res.data;
};

export const checkoutSingleProd = async (input_data) => {
  const res = await axios.post("/api/v2/GetDirectPlaceOrder", input_data, {
    headers: { authorization: "Bearer " + Cookies.get("jwt_token") },
  });
  return res;
};

export const get_orderSuccessItems = async (ref) => {
  const response = await axios.get(`/api/orderByRefId/${ref}`, {
    headers: { authorization: "Bearer " + Cookies.get("jwt_token") },
  });
  return response.data.data;
};

export const getOrderPaymentStatus = async (ref) => {
  const response = await axios.get(
    `/api/payment-status?order_ref_code=${ref}`,
    {
      headers: { authorization: "Bearer " + Cookies.get("jwt_token") },
    }
  );
  return response.data.data;
};

export const postpostPlaceOrder = async (input_data) => {
  const res = await axios.post("api/postpostPlaceOrder", input_data, {
    headers: { authorization: "Bearer " + Cookies.get("jwt_token") },
  });
  return res.data;
};

export const postSingleCheckout = async (input_data) => {
  const res = await axios.post("api/directBuy", input_data, {
    headers: { authorization: "Bearer " + Cookies.get("jwt_token") },
  });
  return res.data;
};
export const availableCoupons = async () => {
  const res = await axios.get("api/couponList", {
    headers: { authorization: "Bearer " + Cookies.get("jwt_token") },
  });
  return res.data;
};
