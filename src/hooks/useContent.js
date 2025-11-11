import { useSelector } from "react-redux";
import { content } from "@/json_data/content";

export const useContent = (path, fallbackLanguage = "en") => {
  const currentLanguage = useSelector(
    (state) => state.globalslice?.currentLanguage || fallbackLanguage
  );

  // Navigate through the nested object using dot notation
  const keys = path.split(".");
  let result = content;

  // Navigate to the content item
  for (const key of keys) {
    if (result && typeof result === "object" && key in result) {
      result = result[key];
    } else {
      console.warn(`Content path not found: ${path}`);
      return path;
    }
  }

  // Now result should be an object with en and ar properties
  if (result && typeof result === "object" && (result.en !== undefined || result.ar !== undefined)) {
    // Return the value for current language, fallback to fallbackLanguage, then to en
    return result[currentLanguage] || result[fallbackLanguage] || result.en || result.ar || path;
  }

  // If it's not a language object, return as is (for backward compatibility)
  return result || path;
};

/**
 * React hook to get the current language from Redux store
 * @returns {string} Current language code ('en' or 'ar')
 */
export const useCurrentLanguage = () => {
  return useSelector((state) => state.globalslice?.currentLanguage || "en");
};

/**
 * React hook to get all content for the current language
 * @returns {object} All content object for the current language
 */
export const useAllContent = () => {
  const currentLanguage = useSelector(
    (state) => state.globalslice?.currentLanguage || "en"
  );

  // Transform the content structure to language-first format for backward compatibility
  function transformToLanguageFirst(obj, lang) {
    if (!obj || typeof obj !== "object") return obj;

    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === "object" && (value.en !== undefined || value.ar !== undefined)) {
        // It's a language object
        result[key] = value[lang] || value.en || value.ar || "";
      } else {
        // It's a nested object, recurse
        result[key] = transformToLanguageFirst(value, lang);
      }
    }
    return result;
  }

  return transformToLanguageFirst(content, currentLanguage);
};

/**
 * Utility function to get dynamic content from backend based on current language
 * For Arabic: returns fieldName_arabic if available, otherwise falls back to fieldName
 * For English: returns fieldName
 * 
 * @param {object} data - The data object from backend (e.g., product, category, etc.)
 * @param {string} fieldName - The field name to get (e.g., 'name', 'title', 'category_name')
 * @param {string} currentLanguage - Current language code ('en' or 'ar')
 * @returns {string|any} The value of the field based on current language
 * 
 * @example
 * const product = { name: 'Product Name', name_arabic: 'اسم المنتج' };
 * const displayName = getDynamicContent(product, 'name', 'ar'); // Returns 'اسم المنتج'
 * const displayName = getDynamicContent(product, 'name', 'en'); // Returns 'Product Name'
 */
export const getDynamicContent = (data, fieldName, currentLanguage = "en") => {
  if (!data || !fieldName) {
    return "";
  }

  // If Arabic is selected, try to get the Arabic version first
  if (currentLanguage === "ar") {
    const arabicField = `${fieldName}_arabic`;
    if (data[arabicField] !== undefined && data[arabicField] !== null && data[arabicField] !== "") {
      return data[arabicField];
    }
    // Fallback to English version if Arabic is not available
    return data[fieldName] || "";
  }

  // For English, return the English version
  return data[fieldName] || "";
};

/**
 * React hook version of getDynamicContent that automatically gets current language
 * 
 * @param {object} data - The data object from backend (e.g., product, category, etc.)
 * @param {string} fieldName - The field name to get (e.g., 'name', 'title', 'category_name')
 * @returns {string|any} The value of the field based on current language
 * 
 * @example
 * const product = { name: 'Product Name', name_arabic: 'اسم المنتج' };
 * const displayName = useDynamicContent(product, 'name'); // Automatically uses current language
 */
export const useDynamicContent = (data, fieldName) => {
  const currentLanguage = useSelector(
    (state) => state.globalslice?.currentLanguage || "en"
  );

  return getDynamicContent(data, fieldName, currentLanguage);
};
