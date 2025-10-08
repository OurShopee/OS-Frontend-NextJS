import axios from "axios";
import Cookies from "js-cookie";

// Fetch categories

export const checkCouponCode = async (input_data) => {
  const res = await axios.post("/api/checkCouponCode", input_data, {
    headers: { authorization: "Bearer " + Cookies.get("jwt_token") },
  });
  return res.data;
};

export const cartlist = async (input_data) => {
  const res = await axios.post("api/GetFromCart", input_data, {
    headers: { authorization: "Bearer " + Cookies.get("jwt_token") },
  });
  return res;
};

export const addToCartApi = async (input_data) => {
  const res = await axios.post("api/AddToCart", input_data, {
    headers: { authorization: "Bearer " + Cookies.get("jwt_token") },
  });
  return res.data;
};

export const changeCartQuantity = async (input_data) => {
  const res = await axios.post("api/changeCartQuantity", input_data);
  return res.data;
};
export const removeFromCart = async (input_data) => {
  const res = await axios.post("api/removeFromCart", input_data);
  return res.data;
};

export const getWishListsApi = async () => {
  const response = await axios.get("api/getWishLists", {
    headers: { authorization: "Bearer " + Cookies.get("jwt_token") },
  });
  return response;
};

export const postWishListApi = async (input_data) => {
  const response = await axios.post("api/postWishList", input_data, {
    headers: { authorization: "Bearer " + Cookies.get("jwt_token") },
  });
  return response;
};

export const updateCartStatusApi = async (input_data) => {
  const response = await axios.post("api/updateCartStatus", input_data, {
    headers: { authorization: "Bearer " + Cookies.get("jwt_token") },
  });
  return response;
};
