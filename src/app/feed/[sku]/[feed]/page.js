import { getproduct_detail } from "@/api/products";
import ProductPageLayout from "@/components/Common/feedpage/ProductPageLayout";
import { getServerSideHeaders } from "@/lib/serverUtils";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const resolvedParams = await Promise.resolve(params);
  const { sku } = resolvedParams;

  // Get headers for locale/country detection (optional)
  const req = await getServerSideHeaders();

  const productData = await getproduct_detail(sku, req);

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
    },
    twitter: {
      card: "summary_large_image",
      title: product?.seoTitle || product?.name,
      description: product?.seoDescription || product?.details,
    },
  };
}

export default async function WebfeedPage({ params }) {
  const resolvedParams = await Promise.resolve(params);
  const { sku } = resolvedParams;

  const req = await getServerSideHeaders();

  const productData = await getproduct_detail(sku, req);

  if (!productData) {
    notFound();
  }
  return (
    <ProductPageLayout
      product={productData?.data?.product[0]}
      // queryParams={Object.fromEntries(searchParams?.entries() || [])}
      // country={effectiveCountry}
    />
  );
}
