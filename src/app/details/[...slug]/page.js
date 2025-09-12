import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import { getproduct_detail } from "@/api/products";
import { headers } from "next/headers";

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
  const headersList = await headers();
  const req = {
    headers: {
      host: headersList.get("host") || headersList.get("x-forwarded-host"),
    },
  };

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
    description:
      product?.seoDescription || product?.details || "Product description",
    keywords: product?.keywords || product?.category_name || "",
    openGraph: {
      title: product?.seoTitle || product?.name,
      description: product?.seoDescription || product?.details,
      images: product?.images ? [{ url: product.images[0] }] : [],
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/details/${productInfo.productSlug}/${productInfo.productSku}`,
    },
    twitter: {
      card: "summary_large_image",
      title: product?.seoTitle || product?.name,
      description: product?.seoDescription || product?.details,
    },
  };
}

export default async function ProductDetailsPage({ params }) {
  const { slug } = await params;
  const productInfo = extractProductInfo(slug);

  if (!productInfo) {
    notFound();
  }

  // Get headers for server-side country detection
  const headersList = await headers();
  const req = {
    headers: {
      host: headersList.get("host") || headersList.get("x-forwarded-host"),
      "x-forwarded-proto": headersList.get("x-forwarded-proto"),
      "x-forwarded-port": headersList.get("x-forwarded-port"),
    },
  };

  const productData = await getproduct_detail(productInfo.productSku, req);

  if (!productData) {
    notFound();
  }

  return (
    <ProductDetailClient
      initialProductData={productData?.data?.product}
      productInfo={productInfo}
    />
  );
}
