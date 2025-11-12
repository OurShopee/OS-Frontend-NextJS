import { content } from "@/json_data/content";
import store from "@/redux/store";

/**
 * Get content based on the current language from Redux store
 * @param {string} path - Dot-notation path to the content (e.g., 'nav.home', 'buttons.addToCart')
 * @param {string} fallbackLanguage - Optional fallback language if content not found (default: 'en')
 * @returns {string} The translated content or the path if not found
 *
 * @example
 * getContent('nav.home') // Returns 'Home' or 'الرئيسية' based on current language
 * getContent('buttons.addToCart') // Returns 'Add to Cart' or 'أضف إلى السلة'
 */
export const getContent = (path, fallbackLanguage = "en") => {
  const state = store.getState();
  const currentLanguage =
    state.globalslice?.currentLanguage || fallbackLanguage;

  // Get the content object for the current language
  const langContent = content[currentLanguage] || content[fallbackLanguage];

  if (!langContent) {
    console.warn(`Content not found for language: ${currentLanguage}`);
    return path;
  }

  // Navigate through the nested object using dot notation
  const keys = path.split(".");
  let result = langContent;

  for (const key of keys) {
    if (result && typeof result === "object" && key in result) {
      result = result[key];
    } else {
      // If path not found, try fallback language
      if (currentLanguage !== fallbackLanguage) {
        const fallbackContent = content[fallbackLanguage];
        let fallbackResult = fallbackContent;
        for (const fallbackKey of keys) {
          if (
            fallbackResult &&
            typeof fallbackResult === "object" &&
            fallbackKey in fallbackResult
          ) {
            fallbackResult = fallbackResult[fallbackKey];
          } else {
            console.warn(`Content path not found: ${path}`);
            return path;
          }
        }
        return fallbackResult;
      }
      console.warn(`Content path not found: ${path}`);
      return path;
    }
  }

  return result;
};

/**
 * Get the current language from Redux store
 * @returns {string} Current language code ('en' or 'ar')
 */
export const getCurrentLanguage = () => {
  const state = store.getState();
  return state.globalslice?.currentLanguage || "en";
};

/**
 * Get all content for the current language
 * @returns {object} All content object for the current language
 */
export const getAllContent = () => {
  const state = store.getState();
  const currentLanguage = state.globalslice?.currentLanguage || "en";
  return content[currentLanguage] || content.en;
};
