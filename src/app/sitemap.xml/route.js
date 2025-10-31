import { NextResponse } from "next/server";
import countriesData from "@/json_data/multi_countries";
import {
  fetchCategoriesForCountry,
  extractCategoryUrls,
  getSpecialPages,
  getStaticPages,
  getCountrySpecificPages,
} from "@/lib/sitemapHelpers";

async function getCountryFromHost(headersList) {
  const hostname =
    headersList.get("host") || headersList.get("x-forwarded-host");
  if (!hostname) return null;
  const isDevelopment = process.env.NEXT_PUBLIC_NODE_ENV === "development";
  for (const country of countriesData) {
    if (isDevelopment) {
      const devUrl = country.dev_url;
      if (devUrl && hostname.includes(new URL(devUrl).hostname)) return country;
    } else if (country.url) {
      try {
        const countryHostname = new URL(country.url).hostname;
        if (
          hostname === countryHostname ||
          hostname.endsWith(`.${countryHostname}`) ||
          countryHostname.includes(hostname)
        ) {
          return country;
        }
      } catch (_) {
        if (hostname.toLowerCase().includes(country.name.toLowerCase()))
          return country;
      }
    }
  }
  return null;
}

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

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(req) {
  const headersList = req.headers;
  const country = await getCountryFromHost(headersList);
  if (!country) return new NextResponse("", { status: 404 });

  const baseUrl =
    country.url || `https://${getCountryDomain(country.name)}.ourshopee.com`;

  const urls = [];

  // Static pages
  getStaticPages().forEach((page) => {
    urls.push(
      `  <url>\n    <loc>${xmlEscape(
        `${baseUrl}${page.url}`
      )}</loc>\n    <changefreq>${
        page.changefreq
      }</changefreq>\n    <priority>${page.priority}</priority>\n  </url>`
    );
  });

  // Country specific pages
  getCountrySpecificPages(country).forEach((page) => {
    urls.push(
      `  <url>\n    <loc>${xmlEscape(
        `${baseUrl}${page.url}`
      )}</loc>\n    <changefreq>${
        page.changefreq
      }</changefreq>\n    <priority>${page.priority}</priority>\n  </url>`
    );
  });

  // Special pages from nav
  getSpecialPages(country).forEach((page) => {
    urls.push(
      `  <url>\n    <loc>${xmlEscape(
        `${baseUrl}${page.url}`
      )}</loc>\n    <changefreq>${
        page.changefreq
      }</changefreq>\n    <priority>${page.priority}</priority>\n  </url>`
    );
  });

  // Categories
  try {
    const categories = await fetchCategoriesForCountry(
      country.id,
      country.backedn_api || process.env.NEXT_PUBLIC_BACKEND_API
    );
    const categoryUrls = extractCategoryUrls(categories);
    categoryUrls.forEach((item) => {
      urls.push(
        `  <url>\n    <loc>${xmlEscape(
          `${baseUrl}${item.url}`
        )}</loc>\n    <changefreq>${
          item.changefreq
        }</changefreq>\n    <priority>${item.priority}</priority>\n  </url>`
      );
    });
  } catch (_) {}

  // Products from backend API (query-driven)
  try {
    const backendApi =
      country.backedn_api || process.env.NEXT_PUBLIC_BACKEND_API;
    const reqUrl = new URL(req.url);
    const limitParam = reqUrl.searchParams.get("limit") || "5000";
    const pageParam = reqUrl.searchParams.get("page") || "1";

    let apiUrl = new URL("/api/sitemap-xml", backendApi);
    apiUrl.searchParams.set("limit", String(limitParam));
    apiUrl.searchParams.set("page", String(pageParam));
    apiUrl.searchParams.set("country_id", String(country.id));

    let res = await fetch(apiUrl.toString(), {
      headers: {
        "Country-Id": String(country.id),
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const fallback = new URL("/sitemap-xml", backendApi);
      fallback.searchParams.set("limit", String(limitParam));
      fallback.searchParams.set("page", String(pageParam));
      fallback.searchParams.set("country_id", String(country.id));
      res = await fetch(fallback.toString(), {
        headers: {
          "Country-Id": String(country.id),
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });
    }

    if (res.ok) {
      const json = await res.json();
      const data = json?.data || json?.items || [];
      data.forEach((p) => {
        const slug = p?.url || p?.slug || p?.product_url;
        if (!slug) return;
        const loc = `${baseUrl}/details/${slug}`;
        urls.push(
          `  <url>\n    <loc>${xmlEscape(
            loc
          )}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.5</priority>\n  </url>`
        );
      });
    }
  } catch (_) {}

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join(
    "\n"
  )}\n</urlset>`;

  return new NextResponse(body, {
    status: 200,
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
