import { getproduct_detail } from "@/api/products";
import { getServerSideHeaders } from "@/lib/serverUtils";
import { notFound } from "next/navigation";
import { generateProductHTML } from "./generateProductHTML";
import ProductDetailClient from "./ProductDetailClient";
import ProductHTMLRenderer from "./ProductHTMLRenderer";

function extractProductInfo(slug) {
  if (!slug || slug.length < 2) {
    return null;
  }
  const productSku = slug[slug.length - 1];
  const productSlug = slug.slice(0, -1).join("/");
  return { productSku, productSlug };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const productInfo = extractProductInfo(slug);

  if (!productInfo) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  // Get headers for server-side country detection
  const req = await getServerSideHeaders();

  const productData = await getproduct_detail(productInfo.productSku, req);

  if (!productData) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  const product = productData?.data?.product[0];

  return {
    title: product?.seoTitle || product?.name || "Product Details",
    description: product?.seoDescription || "Product description",
    keywords: product?.keywords || product?.category_name || "",
    openGraph: {
      title: product?.seoTitle || product?.name,
      description: product?.seoDescription,
      images: product?.images ? [{ url: product.images[0] }] : [],
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/details/${productInfo.productSlug}/${productInfo.productSku}`,
    },
    twitter: {
      card: "summary_large_image",
      title: product?.seoTitle || product?.name,
      description: product?.seoDescription,
    },
  };
}

// Force server-side rendering to ensure HTML is in page source
export const dynamic = "force-dynamic";
// Disable streaming to ensure HTML is rendered in body, not in script tags
export const runtime = "nodejs";
// Ensure revalidation is disabled to prevent serialization
export const revalidate = 0;

export const fetchCache = "force-no-store";

export const preferStreaming = false;

export default async function ProductDetailsPage({ params }) {
  const { slug } = await params;
  const productInfo = extractProductInfo(slug);
  if (!productInfo) {
    notFound();
  }

  // Get headers for server-side country detection
  const req = await getServerSideHeaders();
  let productData;
  try {
    productData = await getproduct_detail(productInfo.productSku, req);
  } catch (error) {
    console.log("error", error);
    console.log("error.message", error.message);
  }

  if (!productData) {
    notFound();
  }

  // Ensure data is available before rendering
  const product = productData?.data?.product?.[0];
  if (!product) {
    notFound();
  }

  const cleanedDetails = product?.details || "";

  // Generate pure HTML string
  const htmlContent = generateProductHTML(product, productInfo, cleanedDetails);

  return (
    <div id="product-detail-page">
      {/* Render pure HTML directly without React Server Component wrapper */}
      <ProductHTMLRenderer htmlContent={htmlContent} />
      <ProductDetailClient
        initialProductData={productData?.data?.product}
        productInfo={productInfo}
      />
    </div>
  );
}
