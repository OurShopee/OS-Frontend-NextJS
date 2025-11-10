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
 * Fetch all products for a country (no limit - fetches ALL products)
 * @param {number} countryId - Country ID
 * @param {string} backendApi - Backend API base URL
 * @returns {Array} Array of product URL objects
 */
export async function fetchProductsForCountry(countryId, backendApi) {
  try {
    const axiosInstance = axios.create({
      baseURL: backendApi,
      headers: {
        "Country-Id": countryId,
        "Content-Type": "application/json",
      },
    });

    // First, get all categories
    const categoriesResponse = await axiosInstance.get("api/getcategorylist");
    const categories = categoriesResponse.data.data || [];

    const productUrls = [];
    const seenSkus = new Set(); // To avoid duplicates

    // Fetch products from each category
    for (const category of categories) {
      if (!category.url) continue;

      try {
        let page = 1;
        let hasMore = true;

        // Fetch all pages for this category
        while (hasMore) {
          const response = await axiosInstance.get(
            `api/getallitems?cat_url=${category.url}&page=${page}`
          );

          const products = response.data?.data || [];

          // If no products returned, stop fetching more pages
          if (!products || products.length === 0) {
            hasMore = false;
            break;
          }

          // Process products
          for (const product of products) {
            if (!product.sku || seenSkus.has(product.sku)) continue;

            seenSkus.add(product.sku);

            // Build product URL
            if (product.url || product.slug) {
              const productSlug = product.url || product.slug;
              productUrls.push({
                url: `/details/${productSlug}/${product.sku}`,
                changefreq: "weekly",
                priority: 0.5,
              });
            }
          }

          // If fewer than expected products, likely last page
          if (products.length < 50) {
            // Assuming 50 items per page
            hasMore = false;
          } else {
            page++;
          }
        }

       
      } catch (error) {
        // Log but continue with other categories
        console.error(
          `Error fetching products for category ${category.url}:`,
          error
        );
      }
    }

    return productUrls;
  } catch (error) {
    console.error(`Error fetching products for country ${countryId}:`, error);
    return [];
  }
}

/**
 * Extract all URLs from category hierarchy (categories, subcategories, sub-subcategories, and brands)
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

    // Add subcategory URLs and brands
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
        if (
          subcategory.sub_subcategory &&
          subcategory.sub_subcategory.length > 0
        ) {
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

        // Add brand URLs
        if (subcategory.brands && subcategory.brands.length > 0) {
          subcategory.brands.forEach((brand) => {
            if (brand.url || brand.slug) {
              urls.push({
                url: `/brands/${brand.url || brand.slug}`,
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

    // User account and support pages (public accessible)
    { url: "/cart", changefreq: "daily", priority: 0.5 },
    { url: "/track-your-order", changefreq: "monthly", priority: 0.3 },
    { url: "/place-a-complaints", changefreq: "monthly", priority: 0.3 },

    // Utility pages
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
