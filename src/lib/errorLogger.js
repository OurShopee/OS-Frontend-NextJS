import axios from "axios";

/**
 * Error Logger Utility
 * Sends error logs to the server for monitoring and debugging
 */

// Configuration
const ERROR_LOG_ENDPOINT = "api/log-error"; // Your backend endpoint for logging errors
const ENABLE_CONSOLE_LOG = true; // Set to false in production to disable console logs

/**
 * Formats error data for logging
 * @param {Error} error - The error object
 * @param {Object} config - The axios request config
 * @returns {Object} Formatted error log
 */
const formatErrorLog = (error, config) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    url: error.config?.url || config?.url,
    method: error.config?.method?.toUpperCase() || config?.method?.toUpperCase() || "GET",
    baseURL: error.config?.baseURL || config?.baseURL,
    fullURL: error.config?.baseURL 
      ? `${error.config?.baseURL}${error.config?.url}` 
      : config?.baseURL 
        ? `${config?.baseURL}${config?.url}` 
        : error.config?.url || config?.url,
    
    // Response error details
    status: error.response?.status || null,
    statusText: error.response?.statusText || null,
    responseData: error.response?.data || null,
    responseHeaders: error.response?.headers || null,
    
    // Request details
    requestData: config?.data || null,
    requestParams: config?.params || null,
    requestHeaders: config?.headers || null,
    
    // Error details
    errorMessage: error.message || "Unknown error",
    errorCode: error.code || null,
    errorName: error.name || "Error",
    stack: error.stack || null,
    
    // Additional context
    userAgent: typeof window !== "undefined" ? window.navigator?.userAgent : null,
    location: typeof window !== "undefined" ? window.location?.href : null,
    countryId: error.config?.headers?.["Country-Id"] || config?.headers?.["Country-Id"] || null,
    
    // Environment
    environment: process.env.NEXT_PUBLIC_NODE_ENV || "unknown",
    isServerSide: typeof window === "undefined",
  };

  return errorLog;
};

/**
 * Console log error (for development/debugging)
 * @param {Object} errorLog - Formatted error log
 */
const consoleLogError = (errorLog) => {
  if (!ENABLE_CONSOLE_LOG) return;

  console.group(`🔴 API Error: ${errorLog.method} ${errorLog.url}`);
  console.log("Status:", `${errorLog.status} ${errorLog.statusText}`);
  console.log("Error:", errorLog.errorMessage);
  console.log("URL:", errorLog.fullURL);
  console.log("Timestamp:", errorLog.timestamp);
  
  if (errorLog.requestData) {
    console.log("Request Data:", errorLog.requestData);
  }
  
  if (errorLog.responseData) {
    console.log("Response Data:", errorLog.responseData);
  }
  
  if (errorLog.countryId) {
    console.log("Country ID:", errorLog.countryId);
  }
  
  console.groupEnd();
};

/**
 * Send error log to server
 * @param {Object} errorLog - Formatted error log
 * @returns {Promise} - Axios request promise
 */
const sendErrorToServer = async (errorLog) => {
  try {
    // Don't try to log errors from the logging endpoint itself to avoid infinite loops
    if (errorLog.url?.includes(ERROR_LOG_ENDPOINT)) {
      return;
    }

    // Create a basic axios instance without interceptors to send the log
    const logAxios = axios.create();
    
    // Send to server in a fire-and-forget manner
    await logAxios.post(
      `${errorLog.baseURL || ""}${ERROR_LOG_ENDPOINT}`,
      errorLog,
      {
        timeout: 5000, // 5 second timeout
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (logError) {
    // Silently fail logging errors to prevent infinite loops
    // Optionally log to console in development
    if (ENABLE_CONSOLE_LOG) {
      console.error("Failed to send error log to server:", logError);
    }
  }
};

/**
 * Main error logging function
 * @param {Error} error - The error object
 * @param {Object} config - The axios request config
 */
export const logError = async (error, config) => {
  try {
    const errorLog = formatErrorLog(error, config);
    
    // Log to console (for development)
    consoleLogError(errorLog);
    
    // Send to server (for production monitoring)
    await sendErrorToServer(errorLog);
  } catch (logError) {
    // If error logging itself fails, at least try to log to console
    console.error("Error logging failed:", logError);
    console.error("Original error:", error);
  }
};

/**
 * Log successful API calls (optional, for access logging)
 * @param {Object} response - The axios response object
 */
export const logSuccess = async (response) => {
  try {
    const logData = {
      timestamp: new Date().toISOString(),
      url: response.config?.url,
      method: response.config?.method?.toUpperCase(),
      baseURL: response.config?.baseURL,
      fullURL: response.config?.baseURL 
        ? `${response.config?.baseURL}${response.config?.url || response.config?.url}` 
        : response.config?.url || response.config?.url,
      status: response.status,
      statusText: response.statusText,
      countryId: response.config?.headers?.["Country-Id"] || null,
      environment: process.env.NEXT_PUBLIC_NODE_ENV || "unknown",
      isServerSide: typeof window === "undefined",
    };

    // Uncomment the line below if you want to log successful requests too
    // await sendErrorToServer({ ...logData, type: 'success' }, 'api/log-access');
    
  } catch (logError) {
    // Silently fail
  }
};

