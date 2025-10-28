# Sitemap Testing Guide

## Quick Start - Test Your Sitemap Now! 🚀

### Step 1: Start Your Dev Server
```bash
npm run dev
```

**Note:** The server will start on the next available port (usually 3000 or 3001).

### Step 2: View the Sitemap
Open your browser and visit:
```
http://localhost:3000/sitemap.xml
```
or
```
http://localhost:3001/sitemap.xml
```
(depending on which port your server started on)

### Step 3: What You Should See
You should see a **beautifully formatted, line-by-line XML sitemap** like this:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ourshopee.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1</priority>
  </url>
  <url>
    <loc>https://ourshopee.com/aboutus</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <!-- More URLs... -->
</urlset>
```

## Testing Checklist ✅

- [ ] Sitemap loads without errors
- [ ] All URLs are properly formatted
- [ ] XML is valid (no syntax errors)
- [ ] Categories are included from your API
- [ ] All 5 regions (UAE, Kuwait, Bahrain, Oman, Qatar) are in the sitemap
- [ ] No duplicate URLs
- [ ] All static pages are included

## Common Issues & Solutions

### Issue: "Cannot GET /sitemap.xml"
**Solution:** Make sure you're in the correct directory and the dev server is running.

### Issue: Empty or incomplete sitemap
**Solution:** 
1. Check if your backend API is accessible
2. Check browser console for errors
3. Verify the Country-Id header is being sent correctly

### Issue: Sitemap shows XML but it's not formatted nicely
**Solution:** This is normal! Next.js handles the formatting. The data structure in the code is what matters.

## Production Testing

Once deployed, test these URLs:
- https://ourshopee.com/sitemap.xml
- https://kuwait.ourshopee.com/sitemap.xml  
- https://bahrain.ourshopee.com/sitemap.xml
- https://oman.ourshopee.com/sitemap.xml
- https://qatar.ourshopee.com/sitemap.xml

## Submit to Search Engines

### Google Search Console
1. Visit: https://search.google.com/search-console
2. Add each property (each country domain)
3. Go to "Sitemaps" → Add sitemap URL → Submit

### Bing Webmaster Tools
1. Visit: https://www.bing.com/webmasters
2. Add sitemap URL for each region
3. Verify and submit

## Validate Your Sitemap

Use these online tools:
- https://www.xml-sitemaps.com/validate-xml-sitemap.html
- https://www.xml-sitemaps.com/sitemap-validator.html

## Next Steps

After successful testing:
1. Deploy to production
2. Submit to Google Search Console
3. Submit to Bing Webmaster Tools
4. Monitor indexing in search console
5. Check for any crawl errors

---

**Tip:** The sitemap is automatically regenerated on each request, so it will always include the latest categories from your API!
