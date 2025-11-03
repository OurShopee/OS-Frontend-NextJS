import { useSelector } from "react-redux";
import { content } from "@/content";

/**
 * React hook to get content based on the current language from Redux store
 * This hook will re-render when the language changes
 *
 * @param {string} path - Dot-notation path to the content (e.g., 'nav.home', 'buttons.addToCart')
 * @param {string} fallbackLanguage - Optional fallback language if content not found (default: 'en')
 * @returns {string} The translated content or the path if not found
 *
 * @example
 * const homeText = useContent('nav.home'); // Returns 'Home' or 'الرئيسية' based on current language
 * const addToCartText = useContent('buttons.addToCart'); // Returns 'Add to Cart' or 'أضف إلى السلة'
 */
export const useContent = (path, fallbackLanguage = "en") => {
  const currentLanguage = useSelector(
    (state) => state.globalslice?.currentLanguage || fallbackLanguage
  );

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
  return content[currentLanguage] || content.en;
};
