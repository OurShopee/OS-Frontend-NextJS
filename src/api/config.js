import axios from "axios";
import countryDropdown from "@/json_data/multi_countries";
import { normalizeUrl } from "@/components/utils/helpers.js";

let isInterceptorSetup = false;

// Server-side country detection using request headers
export const getCountryDataFromRequest = (req) => {
  if (!req?.headers?.host) {
    return null;
  }

  const hostname = req.headers.host;
  let data;

  if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
    const origin = `http://${hostname}`;
    data = countryDropdown.find(({ dev_url }) => dev_url === origin);
  } else {
    const normalized = normalizeUrl(`https://${hostname}`);
    data = countryDropdown.find(({ url }) => url === normalized);
  }
  return data;
};

// Client-side country detection (existing)
export const getCountryData = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const origin = window.location.origin;
  let data;

  if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
    data = countryDropdown.find(({ dev_url }) => dev_url === origin);
  } else {
    const normalized = normalizeUrl(origin);
    data = countryDropdown.find(({ url }) => url === normalized);
  }

  return data;
};

// Create axios instance with dynamic baseURL
export const createAxiosInstance = (req = null) => {
  const axiosInstance = axios.create();

  let countryData = null;

  if (typeof window !== "undefined") {
    // Client-side
    countryData = getCountryData();
  } else if (req) {
    // Server-side with request context
    countryData = getCountryDataFromRequest(req);
  }

  if (countryData?.backedn_api) {
    axiosInstance.defaults.baseURL = countryData.backedn_api;
    console.log("axiosInstance.defaults.baseURL", axiosInstance.defaults.baseURL)
    console.log("axiosInstance.defaults.baseURL", axiosInstance.defaults.headers)
  } else {
    axiosInstance.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_API;
   
  }
  if (countryData?.id) {
    axiosInstance.defaults.headers.common["Country-Id"] = countryData.id;
    axiosInstance.defaults.headers.common["Content-Type"] = "application/json";
    console.log("axiosInstance.defaults.headers", axiosInstance.defaults.headers)
  }
  return axiosInstance;
};

// Client-side axios configuration (existing)
export const configureAxios = () => {
  const countryData = getCountryData();
  if (countryData && countryData.backedn_api) {
    axios.defaults.baseURL = countryData.backedn_api;
  } else {
    axios.defaults.baseURL = process.env.NEXT_PUBLIC_UAE_BACKEND_API;
  }

  if (!isInterceptorSetup && typeof window !== "undefined") {
    axios.interceptors.request.use(
      (config) => {
        console.log("config", config)
        const countryDataForRequest = getCountryData();
        if (countryDataForRequest && countryDataForRequest.id) {
          config.headers["Country-Id"] = countryDataForRequest.id;
          console.log("config.headers", config.headers)
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    isInterceptorSetup = true;
  }
};
