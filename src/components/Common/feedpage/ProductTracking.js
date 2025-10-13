'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import * as gtag from '@/lib/gtag';
import * as fpixel from '@/lib/fpixel';

// ProductTracking Component to handle analytics tracking
function ProductTracking({ product, queryParams, country }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Ensure product and country are available before tracking
    if (product && country) {
      const viewedFeedData = {
        'Country': country,
        'Source': queryParams?.source || '', // Include UTM parameters if available
      };


    } else {
      console.warn("Product or country data missing for tracking.");
    }

  }, [product, queryParams, country]); // Dependencies: product, queryParams, and country

  return null; // No UI rendered
}

export default ProductTracking;
