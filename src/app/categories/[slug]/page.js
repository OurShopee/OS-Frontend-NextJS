import { notFound } from "next/navigation";
import CategoryClient from "./CategoriesClient";
import { headers } from "next/headers";
import { getCatScreenApi } from "@/api/products";
import { getServerSideHeaders } from "@/lib/serverUtils";

export async function generateMetadata({ params }) {
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;

  // Get headers for locale/country detection (optional)
  const req = await getServerSideHeaders();

  const categoryData = await getCatScreenApi(slug, req);

  if (!categoryData) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found.",
    };
  }

  const category = categoryData?.data?.meta_tags;

  return {
    title: category?.seo_title || category?.name || "Category title",
    description:
      category?.seo_description || category?.details || "Category description",
    keywords: category?.seo_keywords || "Category keywords",
    // openGraph: {
    //   title: category?.seoTitle || category?.name || "Category title",
    //   description: category?.seoDescription || category?.details,
    //   images: category?.images ? [{ url: category.images[0] }] : [],
    //   url: `${process.env.NEXT_PUBLIC_SITE_URL}/categories/${slug}`,
    // },
    // twitter: {
    //   card: "summary_large_image",
    //   title: category?.seoTitle || category?.name,
    //   description: category?.seoDescription || category?.details,
    // },
  };
}

export default async function CategoryPage({ params }) {
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;

  const req = await getServerSideHeaders();

  const categoryData = await getCatScreenApi(slug, req);

  if (!categoryData) {
    notFound();
  }

  return (
    <CategoryClient
      initialCategoryData={categoryData?.data}
      categorySlug={slug}
    />
  );
}
