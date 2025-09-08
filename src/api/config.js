import axios from "axios";
import countryDropdown from "./json_data/multi_countries";
import { normalizeUrl } from "@/components/utils/helpers.js";

let isInterceptorSetup = false;

// This function can be used to get country data whenever needed on the client-side
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

export const configureAxios = () => {
  const countryData = getCountryData();

  if (countryData && countryData.backedn_api) {
    axios.defaults.baseURL = countryData.backedn_api;
  } else {
    console.error(
      "Could not determine backend API URL for the current location."
    );
  }

  // Setup interceptor only once
  if (!isInterceptorSetup && typeof window !== "undefined") {
    axios.interceptors.request.use(
      (config) => {
        const countryDataForRequest = getCountryData();
        if (countryDataForRequest && countryDataForRequest.id) {
          config.headers["country-id"] = countryDataForRequest.id;
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
