import axios from "axios";
import Cookies from "js-cookie";

export const blogByCatId = async (input_data) => {
  const res = await axios.get(
    `api/blogByCatId?${input_data.key}=${input_data.value}`
  );
  return res.data;
};

export const getblogs = async () => {
  const res = await axios.get("api/blogs");
  return res.data;
};

export const getnationality = async () => {
  const res = await axios.get("api/GetNationality");
  return res.data;
};

export const addComplaint = async (input_data) => {
  const res = await axios.post("api/addComplaint", input_data);
  return res.data;
};
export const getComplaint = async (input_data) => {
  const res = await axios.post("api/getComplaint", input_data, {
    headers: { authorization: "Bearer " + Cookies.get("jwt_token") },
  });
  return res.data;
};

export const addFeed = async (data) => {
  const response = await axios.post("api/addFeed", data);
  return response;
};

export const getLocationsApi = async () => {
  const response = await axios.get(`api/getLocations`);
  return response;
};
export const getAreasApi = async (id) => {
  const response = await axios.get(`api/getAreas?emirateid=${id}`);
  return response;
};
