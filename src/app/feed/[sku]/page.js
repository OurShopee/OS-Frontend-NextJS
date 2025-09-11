// "use client";
// import React, { useEffect, useState } from 'react';
// import { useParams, useSearchParams } from 'react-router-dom';
// import ProductPageLayout from '../../components/feedpage/ProductPageLayout';
// import { Helmet } from 'react-helmet';
// import { getproduct_detail } from '../../services/Apis';
// import { pushToDataLayer } from '../../components/utils/dataUserpush';
// import { useSelector } from 'react-redux';

// // --- Loader Component ---
// export const Loader = () => (
//   <div style={{
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     minHeight: '200px'
//   }}>
//     <div style={{
//       width: '50px',
//       height: '50px',
//       border: '5px solid #f3f3f3',
//       borderTop: '5px solid #3498db',
//       borderRadius: '50%',
//       animation: 'spin 1s linear infinite'
//     }} />
//     <style>
//       {`
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//       `}
//     </style>
//   </div>
// );

// // --- SEO Component ---
// const ProductSEO = ({ product }) => {
//   if (!product) return null;

//   const title = `Buy ${product.name || 'Product'} Online | OurShopee.com | ${product.sku || ''}`;
//   const description = `Buy ${product.name || 'Product'} online at the best price from Ourshopee.com. SKU: ${product.sku || ''}. ${product.brand ? `Brand: ${product.brand}` : ''}`;
//   const keywords = `${product.brand || ''} ${product.name || ''} ${product.category_name || ''} ${product.subcategory_name || ''} ${product.sku || ''}`.replace(/\s+/g, ' ').trim();
//   const canonicalUrl = `https://www.ourshopee.com/feed/${product.id}`;

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
//   const { slug } = useParams();
//   const [searchParams] = useSearchParams();
//   const [productData, setProductData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const currentcountry = useSelector((state) => state.globalslice.currentcountry);
//   const country = currentcountry.name;
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const data = await getproduct_detail(slug);
//         if (!data) {
//           setError('Product not found');
//         } else {
//           setProductData(data);
//           // Push to data layer after we have the product data
//           pushToDataLayer("viewed_feed_page", currentcountry.name, {
//             sku_id: data?.data?.data?.product?.[0]?.sku,
//             product_name: data?.data?.data?.product?.[0]?.name,
//             product_price: `${currentcountry.currency} ${data?.data?.data?.product?.[0]?.display_price}`,
//             source_ : "WebFeed"
//           });
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [slug, currentcountry]);

//   // Determine country from hostname
//   const hostname = searchParams.get('hostname') || 'www.ourshopee.com';
//   // const country = hostname.split('.')[0] === 'www' ? 'uae' : hostname.split('.')[0];

//   if (loading) return <Loader />;
//   if (error) return <div>Error: {error}</div>;
//   if (!productData) return <div>Product not found</div>;


//   return (
//     <>
//       <ProductSEO product={productData?.data?.data?.product?.[0]} />
//       <ProductPageLayout
//         product={productData?.data?.data?.product?.[0]}
//         queryParams={Object.fromEntries(searchParams.entries())}
//         country={country}
//       />
//     </>
//   );
// } 
"use client";

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useParams, useSearchParams } from 'next/navigation';
import ProductPageLayout from '@/components/feedpage/ProductPageLayout';
import { getproduct_detail } from '@/api/products';
import { pushToDataLayer } from '@/components/utils/dataUserpush';
import { useSelector } from 'react-redux';

// --- Loader Component ---
export const Loader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px'
  }}>
    <div style={{
      width: '50px',
      height: '50px',
      border: '5px solid #f3f3f3',
      borderTop: '5px solid #3498db',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);

// --- SEO Component ---
const ProductSEO = ({ product }) => {
  if (!product) return null;

  const title = `Buy ${product.name || 'Product'} Online | OurShopee.com | ${product.sku || ''}`;
  const description = `Buy ${product.name || 'Product'} online at the best price from Ourshopee.com. SKU: ${product.sku || ''}. ${product.brand ? `Brand: ${product.brand}` : ''}`;
  const keywords = `${product.brand || ''} ${product.name || ''} ${product.category_name || ''} ${product.subcategory_name || ''} ${product.sku || ''}`.replace(/\s+/g, ' ').trim();
  const canonicalUrl = `https://www.ourshopee.com/feed/${product.id}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="OurShopee.com" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={product.image || '/default-og-image.png'} />
      <meta property="og:image:width" content="800" />
      <meta property="og:image:height" content="600" />
      <meta property="og:image:alt" content={product.name || 'Product Image'} />
    </Head>
  );
};

// --- Main product page component ---
export default function Page() {
  // For a route at app/feed/[sku]/page.js, Next’s useParams provides { sku }
  const params = useParams();
  const sku = typeof params?.sku === 'string' ? params.sku : Array.isArray(params?.sku) ? params.sku : undefined;

  const searchParams = useSearchParams();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentcountry = useSelector((state) => state.globalslice.currentcountry);
  const country = currentcountry?.name;

  useEffect(() => {
    if (!sku || !country) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getproduct_detail(sku);
        if (!data) {
          setError('Product not found');
        } else {
          setProductData(data);

          // Push to data layer after we have the product data
          const p = data?.data?.data?.product?.[0];
pushToDataLayer("viewed_feed_page", country, {
  sku_id: p?.sku,
  product_name: p?.name,
  product_price: `${currentcountry.currency} ${p?.display_price}`,
  source_: "WebFeed"
});
        }
      } catch (err) {
        setError(err?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [sku, country, currentcountry?.currency]);

  // Determine country from hostname param if present, fallback to redux currentcountry
  const hostname = searchParams?.get('hostname') || 'www.ourshopee.com';
  const effectiveCountry = country;

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;
  if (!productData) return <div>Product not found</div>;

  const product = productData?.data?.data?.product?.[0];

  return (
    <>
      <ProductSEO product={product} />
      <ProductPageLayout
        product={product}
        queryParams={Object.fromEntries(searchParams?.entries() || [])}
        country={effectiveCountry}
      />
    </>
  );
}
