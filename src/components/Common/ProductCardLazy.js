"use client";
import { lazy, Suspense } from "react";
import ProductCardFallback from "./ProductCardFallback";

// Lazy load the ProductCard component
const ProductCardLazy = lazy(() => import("./ProductCard"));

/**
 * Lazy-loaded ProductCard wrapper with Suspense
 * This component handles the lazy loading of ProductCard with a fallback UI
 */
const ProductCardWithSuspense = (props) => {
  return (
    <Suspense fallback={<ProductCardFallback />}>
      <ProductCardLazy {...props} />
    </Suspense>
  );
};

export default ProductCardWithSuspense;
