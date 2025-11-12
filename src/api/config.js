import axios from "axios";
import countryDropdown from "@/json_data/multi_countries";
import { normalizeUrl } from "@/components/utils/helpers.js";
import { logError } from "@/lib/errorLogger.js";

let isInterceptorSetup = false;
let cachedStore = null;

// Helper function to get current language lazily (avoids circular dependency)
const getCurrentLanguageLazy = () => {
  try {
    // Lazy access to store to avoid circular dependency
    if (typeof window !== "undefined") {
      // Cache the store reference to avoid repeated lookups
      if (!cachedStore) {
        try {
          // Try the redux store first (used by getContent.js)
          cachedStore = require("@/redux/store").default;
        } catch (e) {
          // If that fails, try the other store location
          try {
            const storeModule = require("@/store/store");
            cachedStore = storeModule.store || storeModule.default;
          } catch (e2) {
            // Store not available yet, return default
            return "en";
          }
        }
      }
      
      if (cachedStore && typeof cachedStore.getState === "function") {
        const state = cachedStore.getState();
        return state.globalslice?.currentLanguage || "en";
      }
    }
    return "en";
  } catch (error) {
    // Fallback if store is not available
    return "en";
  }
};

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
  } else {
    axiosInstance.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_API;
   
  }
  if (countryData?.id) {
    axiosInstance.defaults.headers.common["Country-Id"] = countryData.id;
    axiosInstance.defaults.headers.common["Content-Type"] = "application/json";
  }
  
  // Add x-language header
  const currentLanguage = getCurrentLanguageLazy();
  axiosInstance.defaults.headers.common["x-language"] = currentLanguage;

  // Add request interceptor to dynamically set x-language header
  axiosInstance.interceptors.request.use(
    (config) => {
      const currentLanguage = getCurrentLanguageLazy();
      config.headers["x-language"] = currentLanguage;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add error interceptor for server-side instances
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      // Log the error
      // await logError(error, error.config);
      return Promise.reject(error);
    }
  );

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
    // Request interceptor
    axios.interceptors.request.use(
      (config) => {
        const countryDataForRequest = getCountryData();
        if (countryDataForRequest && countryDataForRequest.id) {
          config.headers["Country-Id"] = countryDataForRequest.id;
        }
        const currentLanguage = getCurrentLanguageLazy();
        config.headers["x-language"] = currentLanguage;
        return config;
      },
      (error) => {
        console.log(error)
        return Promise.reject(error);
      }
    );

    // Response interceptor for error logging
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Log the error
        // await logError(error, error.config);
        return Promise.reject(error);
      }
    );

    isInterceptorSetup = true;
  }
};
