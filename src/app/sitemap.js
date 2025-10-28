import { headers } from "next/headers";
import countriesData from "@/json_data/multi_countries";
import {
  fetchCategoriesForCountry,
  fetchProductsForCountry,
  extractCategoryUrls,
  getSpecialPages,
  getStaticPages,
  getCountrySpecificPages,
} from "@/lib/sitemapHelpers";

/**
 * Get country data based on the current domain/subdomain
 * @returns {Object} Country data or null
 */
async function getCountryFromCurrentDomain() {
  const headersList = await headers();
  const hostname =
    headersList.get("host") || headersList.get("x-forwarded-host");

  if (!hostname) {
    return null;
  }

  // Determine if development or production
  const isDevelopment = process.env.NEXT_PUBLIC_NODE_ENV === "development";

  // Try to match country by domain
  for (const country of countriesData) {
    if (isDevelopment) {
      // Match by dev_url in development
      const devUrl = country.dev_url;
      if (devUrl && hostname.includes(new URL(devUrl).hostname)) {
        return country;
      }
    } else {
      // Match by production URL
      if (country.url) {
        try {
          const countryHostname = new URL(country.url).hostname;
          // Support both exact match and subdomain match
          if (
            hostname === countryHostname ||
            hostname.endsWith(`.${countryHostname}`) ||
            countryHostname.includes(hostname)
          ) {
            return country;
          }
        } catch (e) {
          // Fallback: check if hostname contains country name
          if (hostname.toLowerCase().includes(country.name.toLowerCase())) {
            return country;
          }
        }
      }
    }
  }

  return null;
}

/**
 * Main sitemap generator - domain/subdomain specific
 * Returns structured data that Next.js converts to XML
 */
export default async function sitemap() {
  const sitemaps = [];

  // Get the country for the current domain
  const country = await getCountryFromCurrentDomain();

  if (!country) {
    console.warn(
      "Could not determine country for current domain, returning empty sitemap"
    );
    return [];
  }

  console.log(`Generating sitemap for: ${country.name}`);

  const baseUrl =
    country.url || `https://${getCountryDomain(country.name)}.ourshopee.com`;

  // Add static pages (home, about, contact, etc.)
  const staticPages = getStaticPages();
  staticPages.forEach((page) => {
    sitemaps.push({
      url: `${baseUrl}${page.url}`,
      changeFrequency: page.changefreq,
      priority: page.priority,
    });
  });

  // Add country-specific deal pages (AED-1-to-20, OMR-0-to-2, etc.)
  const countryPages = getCountrySpecificPages(country);
  countryPages.forEach((page) => {
    sitemaps.push({
      url: `${baseUrl}${page.url}`,
      changeFrequency: page.changefreq,
      priority: page.priority,
    });
  });

  // Add special pages from nav_items (perfumes, clearance, deals, etc.)
  const specialPages = getSpecialPages(country);
  specialPages.forEach((page) => {
    sitemaps.push({
      url: `${baseUrl}${page.url}`,
      changeFrequency: page.changefreq,
      priority: page.priority,
    });
  });

  // Fetch and add category pages
  try {
    const categories = await fetchCategoriesForCountry(
      country.id,
      country.backedn_api || process.env.NEXT_PUBLIC_BACKEND_API
    );

    // Extract category URLs (includes subcategories and sub-subcategories)
    const categoryUrls = extractCategoryUrls(categories);
    categoryUrls.forEach((item) => {
      sitemaps.push({
        url: `${baseUrl}${item.url}`,
        changeFrequency: item.changefreq,
        priority: item.priority,
      });
    });
  } catch (error) {
    console.error(`Error processing categories for ${country.name}:`, error);
  }

  // Fetch and add product pages (ALL products, no limit)
  try {
    console.log(`Fetching ALL products for ${country.name}...`);
    const productUrls = await fetchProductsForCountry(
      country.id,
      country.backedn_api || process.env.NEXT_PUBLIC_BACKEND_API
    );

    console.log(
      `Found ${productUrls.length} total products for ${country.name}`
    );

    productUrls.forEach((product) => {
      sitemaps.push({
        url: `${baseUrl}${product.url}`,
        changeFrequency: product.changefreq,
        priority: product.priority,
      });
    });
  } catch (error) {
    console.error(`Error processing products for ${country.name}:`, error);
  }

  console.log(`Total URLs in sitemap for ${country.name}: ${sitemaps.length}`);
  return sitemaps;
}

/**
 * Helper function to get country subdomain
 * @param {string} countryName - Name of the country
 * @returns {string} Subdomain for the country
 */
function getCountryDomain(countryName) {
  const domainMap = {
    UAE: "",
    Kuwait: "kuwait",
    Qatar: "qatar",
    Oman: "oman",
    Bahrain: "bahrain",
  };

  return domainMap[countryName] || countryName.toLowerCase();
}
