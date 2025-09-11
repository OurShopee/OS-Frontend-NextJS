// import React, { useEffect, useState } from 'react';
// import { useParams, useSearchParams } from 'react-router-dom';
// import ProductPageLayout from '../../components/feedpage/ProductPageLayout';
// import { Helmet } from 'react-helmet';
// import { getproduct_detail } from '../../services/Apis';
// import { pushToDataLayer } from '../../components/utils/dataUserpush';
// import { useSelector } from 'react-redux';

// // --- SEO Component ---
// const ProductSEO = ({ product, Webfeed }) => {
//   if (!product) return null;

//   const title = `Buy ${product.name || 'Product'} Online | OurShopee.com | ${product.sku || ''}`;
//   const description = `Buy ${product.name || 'Product'} online at the best price from Ourshopee.com. SKU: ${product.sku || ''}. ${product.brand ? `Brand: ${product.brand}` : ''}`;
//   const keywords = `${product.brand || ''} ${product.name || ''} ${product.category_name || ''} ${product.subcategory_name || ''} ${product.sku || ''}`.replace(/\s+/g, ' ').trim();
//   const canonicalUrl = `https://www.ourshopee.com/feed/${product.id}/${Webfeed}`;

//   return (
//     <Helmet>
//       <title>{title}</title>
//       <meta name="description" content={description} />
//       <meta name="keywords" content={keywords} />
//       <link rel="canonical" href={canonicalUrl} />
      
//       {/* Open Graph Tags */}
//       <meta property="og:title" content={title} />
//       <meta property="og:description" content={description} />
//       <meta property="og:url" content={canonicalUrl} />
//       <meta property="og:site_name" content="OurShopee.com" />
//       <meta property="og:type" content="website" />
//       <meta property="og:image" content={product.image || '/default-og-image.png'} />
//       <meta property="og:image:width" content="800" />
//       <meta property="og:image:height" content="600" />
//       <meta property="og:image:alt" content={product.name || 'Product Image'} />
//     </Helmet>
//   );
// };

// // --- Main product page component ---
// export default function FeedProductPage() {
//   const { slug, slug1 } = useParams();
//   const [searchParams] = useSearchParams();
//   const [productData, setProductData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const currentcountry = useSelector((state) => state.globalslice.currentcountry);
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const data = await getproduct_detail(slug);
//         if (!data) {
//           setError('Product not found');
//         } else {
//           setProductData(data);
//           pushToDataLayer("viewed_feed_page", currentcountry.name, {
//             sku_id: data?.data?.data?.product?.[0]?.sku,
//             product_name: data?.data?.data?.product?.[0]?.name,
//             product_price: `${currentcountry.currency} ${data?.data?.data?.product?.[0]?.display_price}`,
//             source_: slug1
//           });
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [slug]);

//   // Determine country from hostname
//   const hostname = searchParams.get('hostname') || 'www.ourshopee.com';
//   const country = hostname.split('.')[0] === 'www' ? 'uae' : hostname.split('.')[0];

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;
//   if (!productData) return <div>Product not found</div>;

//   return (
//     <>
//       <ProductSEO product={productData?.data?.data?.product?.[0]} Webfeed={slug1} />
//       <ProductPageLayout
//         product={productData?.data?.data?.product?.[0]}
//         queryParams={Object.fromEntries(searchParams.entries())}
//         country={country}
//         Webfeed={slug1}
//       />
//     </>
//   );
// } 

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Head from "next/head";
import { useSelector } from "react-redux";
import ProductPageLayout from "@/components/feedpage/ProductPageLayout";    
import { pushToDataLayer } from "@/components/utils/dataUserpush";
import { getproduct_detail } from "@/api/products";


/* ------------------------- Client-side SEO Head ------------------------- */
function ProductSEO({ product, webfeed }) {
  if (!product) return null;

  const title = `Buy ${product.name || "Product"} Online | OurShopee.com | ${
    product.sku || ""
  }`;
  const description = `Buy ${product.name || "Product"} online at the best price from Ourshopee.com. SKU: ${
    product.sku || ""
  }${product.brand ? `. Brand: ${product.brand}` : ""}`;
  const keywords = `${product.brand || ""} ${product.name || ""} ${
    product.category_name || ""
  } ${product.subcategory_name || ""} ${product.sku || ""}`
    .replace(/\s+/g, " ")
    .trim();
  const canonicalUrl = `https://www.ourshopee.com/feed/${
    product.sku || product.id || ""
  }/${webfeed || ""}`;
  const ogImage = product.image || product.main_image || PLACEHOLDER_OG;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="OurShopee.com" />
      <meta property="og:type" content="product" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="800" />
      <meta property="og:image:height" content="600" />
      <meta property="og:image:alt" content={product.name || "Product Image"} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Head>
  );
}

/* -------------------------- Main Client Page --------------------------- */
export default function FeedProductPage() {
  const { sku, slug } = useParams(); // aligns with /feed/[sku]/[slug]
  const searchParams = useSearchParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Expecting Redux provider at root
  const currentcountry =
    useSelector((s) => s?.globalslice?.currentcountry) || {
      name: "UAE",
      currency: "AED",
    };

  // Prefer query ?hostname=..., else window.location.hostname (client-safe)
  const hostname = useMemo(() => {
    const qHost = searchParams?.get("hostname");
    if (qHost) return qHost;
    if (typeof window !== "undefined") return window.location.hostname;
    return "www.ourshopee.com";
  }, [searchParams]);

  const country = useMemo(() => {
    const label = hostname.split(".")[0];
    return label === "www" ? "uae" : label;
  }, [hostname]);

  const normalizeProduct = (raw) =>
    raw?.data?.data?.product?.[0] ?? raw?.product ?? raw ?? null;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getproduct_detail(sku);
        const prod = normalizeProduct(data);
        if (!prod) throw new Error("Product not found");

        if (!cancelled) {
          setProduct(prod);
          const currency = currentcountry?.currency ?? "AED";
          pushToDataLayer("viewed_feed_page", currentcountry?.name ?? "UAE", {
            sku_id: prod.sku,
            product_name: prod.name,
            product_price: `${currency} ${
              prod.display_price ?? prod.price ?? ""
            }`,
            source_: slug,
          });
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || "Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sku, slug, currentcountry?.name, currentcountry?.currency]);

  const queryParams = useMemo(() => {
    const obj = {};
    if (searchParams) {
      for (const [k, v] of searchParams.entries()) obj[k] = v;
    }
    return obj;
  }, [searchParams]);

  if (loading)
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-transparent"
          aria-label="Loading"
        />
      </div>
    );

  if (error)
    return (
      <div className="mx-auto my-8 max-w-3xl rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
        Error: {error}
      </div>
    );

  if (!product)
    return (
      <div className="mx-auto my-8 max-w-3xl rounded-xl border bg-gray-50 p-4">
        Product not found
      </div>
    );

  return (
    <>
      <ProductSEO product={product} webfeed={slug} />
      <div className="container mx-auto px-3 py-4">
        <ProductPageLayout
          product={product}
          queryParams={queryParams}
          country={country}
          Webfeed={slug}
        />
      </div>
    </>
  );
}
