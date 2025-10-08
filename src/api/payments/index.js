import axios from "axios";
import Cookies from "js-cookie";

export const GetPlaceOrder = async (userId) => {
  const res = await axios.get(`api/GetPlaceOrder?userId=${userId}`, {
    headers: { authorization: "Bearer " + Cookies.get("jwt_token") },
  });
  return res.data;
};

export const checkoutSingleProd = async (input_data) => {
  const res = await axios.post("/api/GetDirectPlaceOrder", input_data, {
    headers: { authorization: "Bearer " + Cookies.get("jwt_token") },
  });
  return res;
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
