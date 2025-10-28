import axios from "axios";

/**
 * Fetch categories for a specific country from the backend API
 * @param {number} countryId - Country ID
 * @param {string} backendApi - Backend API base URL
 * @returns {Array} Array of categories
 */
export async function fetchCategoriesForCountry(countryId, backendApi) {
  try {
    const axiosInstance = axios.create({
      baseURL: backendApi,
      headers: {
        "Country-Id": countryId,
        "Content-Type": "application/json",
      },
    });

    const response = await axiosInstance.get("api/getcategorylist");
    return response.data.data || [];
  } catch (error) {
    console.error(`Error fetching categories for country ${countryId}:`, error);
    return [];
  }
}

/**
 * Extract all URLs from category hierarchy (categories, subcategories, sub-subcategories)
 * @param {Array} categories - Array of category objects
 * @returns {Array} Array of URL objects with metadata
 */
export function extractCategoryUrls(categories) {
  const urls = [];

  categories.forEach((category) => {
    // Add main category URL
    if (category.url) {
      urls.push({
        url: `/categories/${category.url}`,
        changefreq: "weekly",
        priority: 0.8,
      });
    }

    // Add subcategory URLs
    if (category.subcategory && category.subcategory.length > 0) {
      category.subcategory.forEach((subcategory) => {
        if (subcategory.url) {
          urls.push({
            url: `/products-category/${subcategory.url}`,
            changefreq: "weekly",
            priority: 0.7,
          });
        }

        // Add sub-subcategory URLs
        if (subcategory.sub_subcategory && subcategory.sub_subcategory.length > 0) {
          subcategory.sub_subcategory.forEach((subSubcategory) => {
            if (subSubcategory.url) {
              urls.push({
                url: `/products-subcategory/${subcategory.url}/${subSubcategory.url}`,
                changefreq: "weekly",
                priority: 0.6,
              });
            }
          });
        }
      });
    }
  });

  return urls;
}

/**
 * Get all active special pages from nav_items
 * @param {Object} country - Country data object
 * @returns {Array} Array of URL objects with metadata
 */
export function getSpecialPages(country) {
  const pages = [];
  
  if (country.nav_items && country.nav_items.length > 0) {
    country.nav_items.forEach((item) => {
      // Only include pages with status 1 (active)
      if (item.status === 1 && item.url) {
        pages.push({
          url: item.url,
          changefreq: "daily",
          priority: 0.9,
        });
      }
    });
  }

  return pages;
}

/**
 * Get static pages that are common across all countries
 * @returns {Array} Array of URL objects with metadata
 */
export function getStaticPages() {
  return [
    // Home and core pages
    { url: "/", changefreq: "daily", priority: 1.0 },
    { url: "/aboutus", changefreq: "monthly", priority: 0.5 },
    { url: "/contactus", changefreq: "monthly", priority: 0.5 },
    { url: "/faqs", changefreq: "monthly", priority: 0.5 },
    
    // Legal pages
    { url: "/privacy-policy", changefreq: "monthly", priority: 0.3 },
    { url: "/terms-and-conditions", changefreq: "monthly", priority: 0.3 },
    { url: "/return-policy", changefreq: "monthly", priority: 0.3 },
    
    // Business pages
    { url: "/affiliate-program", changefreq: "monthly", priority: 0.4 },
    { url: "/sell-with-us", changefreq: "monthly", priority: 0.4 },
    { url: "/seller", changefreq: "monthly", priority: 0.4 },
    
    // Product and deal pages
    { url: "/brands", changefreq: "weekly", priority: 0.6 },
    { url: "/clearance", changefreq: "daily", priority: 0.8 },
    { url: "/deals-of-the-day", changefreq: "daily", priority: 0.9 },
    { url: "/deals/Top-Selling-Products", changefreq: "daily", priority: 0.8 },
    { url: "/perfumes", changefreq: "weekly", priority: 0.7 },
    { url: "/time-fest", changefreq: "weekly", priority: 0.7 },
    { url: "/TV-Super-Sale", changefreq: "weekly", priority: 0.7 },
    { url: "/mobile-fest", changefreq: "weekly", priority: 0.7 },
    { url: "/bundle-deals", changefreq: "daily", priority: 0.8 },
    { url: "/sitemap", changefreq: "weekly", priority: 0.3 },
  ];
}

/**
 * Get country-specific pages based on currency codes
 * @param {Object} country - Country data object
 * @returns {Array} Array of URL objects with metadata
 */
export function getCountrySpecificPages(country) {
  const currencyPages = {
    AED: { url: "/AED-1-to-20", changefreq: "daily", priority: 0.8 },
    OMR: { url: "/OMR-0-to-2", changefreq: "daily", priority: 0.8 },
    QAR: { url: "/QAR-1-to-20", changefreq: "daily", priority: 0.8 },
    KWD: { url: "/KD-0-to-2", changefreq: "daily", priority: 0.8 },
    BHD: { url: "/BHD-0-to-2", changefreq: "daily", priority: 0.8 },
  };

  return country.currency && currencyPages[country.currency]
    ? [currencyPages[country.currency]]
    : [];
}
