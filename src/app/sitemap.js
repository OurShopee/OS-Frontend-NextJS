import countriesData from "@/json_data/multi_countries";
import {
  fetchCategoriesForCountry,
  extractCategoryUrls,
  getSpecialPages,
  getStaticPages,
  getCountrySpecificPages,
} from "@/lib/sitemapHelpers";

/**
 * Main sitemap generator for all regions
 * Returns structured data that Next.js converts to XML
 */
export default async function sitemap() {
  const sitemaps = [];

  // Process each country
  for (const country of countriesData) {
    const baseUrl = country.url || `https://${getCountryDomain(country.name)}.ourshopee.com`;

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
  }

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
