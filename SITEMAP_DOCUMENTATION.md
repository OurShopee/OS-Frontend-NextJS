# Sitemap Documentation

## Overview
This project includes a dynamic sitemap that generates URLs for all 5 regions:
- **UAE**: ourshopee.com
- **Kuwait**: kuwait.ourshopee.com
- **Bahrain**: bahrain.ourshopee.com
- **Oman**: oman.ourshopee.com
- **Qatar**: qatar.ourshopee.com

## Files Created

### 1. `src/app/sitemap.js`
The main sitemap file that generates dynamic sitemaps for all regions. It includes:
- Static pages (home, about, contact, privacy, terms, etc.)
- Category pages (from navigation API)
- Product category pages
- Product subcategory pages
- Country-specific deal pages
- Special pages from nav_items

### 2. `src/lib/sitemapHelpers.js`
Helper functions for sitemap generation:
- `fetchCategoriesForCountry()` - Fetches categories for each country
- `extractCategoryUrls()` - Extracts URLs from category hierarchy
- `getSpecialPages()` - Gets special pages from nav_items
- `getStaticPages()` - Returns common static pages
- `getCountrySpecificPages()` - Returns country-specific deal pages

## How It Works

1. The sitemap generator iterates through all countries in `multi_countries.js`
2. For each country, it:
   - Fetches categories from the backend API with country-specific headers
   - Extracts all category, subcategory, and sub-subcategory URLs
   - Adds static pages and special pages
   - Generates XML entries with priorities and change frequencies

## Code Quality & Beautification

The sitemap code has been beautified and improved with:
- ✅ Clean, well-documented functions with JSDoc comments
- ✅ Organized imports and logical function grouping
- ✅ Proper spacing and consistent formatting
- ✅ Inline comments explaining complex logic
- ✅ Consistent naming conventions
- ✅ Removed unnecessary lastModified fields
- ✅ Simplified country-specific page logic

## What's Included in the Sitemap

### All Regions Include:
- Home page (priority: 1.0, daily)
- About Us, Contact Us, FAQs
- Privacy Policy, Terms & Conditions, Return Policy
- Affiliate Program, Sell With Us, Seller Portal
- Brands listing
- Clearance Sale, Deals of the Day
- Perfumes, Time Fest, TV Super Sale, Mobile Fest
- Bundle Deals
- All categories with subcategories and sub-subcategories

### Country-Specific Pages:
- UAE: AED-1-to-20 deals
- Oman: OMR-0-to-2 deals
- Qatar: QAR-1-to-20 deals
- Kuwait: KD-0-to-2 deals
- Bahrain: BHD-0-to-2 deals

## Priority Structure
- **Priority 1.0**: Home page
- **Priority 0.9**: Deals of the Day, Country-specific special pages
- **Priority 0.8**: Categories, Clearance, Deal pages
- **Priority 0.7**: Product categories, Special sale pages
- **Priority 0.6**: Product subcategories, Brands
- **Priority 0.5**: About, Contact, FAQs
- **Priority 0.4**: Affiliate, Sell With Us, Seller
- **Priority 0.3**: Legal pages, Sitemap

## Testing the Sitemap

### 1. Local Development Testing

Run the development server:
```bash
npm run dev
```

Then visit:
- http://localhost:3000/sitemap.xml (UAE)
- http://localhost:5900/sitemap.xml (Oman)
- http://localhost:5700/sitemap.xml (Kuwait)
- http://localhost:3001/sitemap.xml (Qatar)
- http://localhost:3002/sitemap.xml (Bahrain)

### 2. Production Testing

After deploying, visit:
- https://ourshopee.com/sitemap.xml
- https://kuwait.ourshopee.com/sitemap.xml
- https://bahrain.ourshopee.com/sitemap.xml
- https://oman.ourshopee.com/sitemap.xml
- https://qatar.ourshopee.com/sitemap.xml

### 3. Validate Sitemap Format

Use online tools to validate your sitemap:
- [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)
- [Google Search Console](https://search.google.com/search-console)

### 4. Test in Browser

Open the sitemap URL in your browser - you should see a **beautifully formatted, line-by-line XML sitemap** with:
- `<urlset>` root element
- Multiple `<url>` entries
- Each `<url>` contains `<loc>`, `<changefreq>`, and `<priority>`

**Note:** The sitemap is automatically formatted by Next.js for optimal readability, with each URL on its own line.

### 5. Expected Output Example

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ourshopee.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1</priority>
  </url>
  <url>
    <loc>https://ourshopee.com/categories/electronics</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://ourshopee.com/products-category/smartphones</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <!-- More URLs for all regions... -->
</urlset>
```

## Submit to Search Engines

### Google Search Console
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select your property (each country domain)
3. Go to "Sitemaps" in the left menu
4. Enter `sitemap.xml` and click "Submit"

### Bing Webmaster Tools
1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Select your property
3. Go to "Sitemaps"
4. Add sitemap URL and submit

## Troubleshooting

### Issue: Sitemap returns 404
- Ensure `src/app/sitemap.js` exists
- Check that the file exports a default function
- Verify Next.js version is 13+ (you're using 15.3.4 ✓)

### Issue: Empty or incomplete sitemap
- Check network tab in browser dev tools
- Verify backend API is accessible
- Check console for API errors
- Ensure Country-Id header is being sent correctly

### Issue: Categories not appearing
- Verify categories API endpoint is working: `api/getcategorylist`
- Check Country-Id is being set in API requests
- Verify backend API base URL is correct

### Issue: Sitemap too large (>50MB)
- Consider splitting into multiple sitemap files (sitemap index)
- Limit to 50,000 URLs per sitemap
- Only include most important pages

## Notes

- **No Product URLs**: Since there's no API to fetch all products, individual product pages are not included in the sitemap. Only category and subcategory pages are included.
- **Dynamic Generation**: The sitemap is generated server-side on each request to ensure it's always up-to-date.
- **Country Detection**: The sitemap automatically detects which country's categories to fetch based on the backend API headers.
- **Build Time**: Sitemap is generated at runtime, not at build time, ensuring it includes the latest categories.

## Future Enhancements

Consider adding:
1. Product detail pages (when API is available)
2. Sitemap index for better organization
3. Image sitemaps for product images
4. Video sitemaps for product videos
5. Caching mechanism for better performance
