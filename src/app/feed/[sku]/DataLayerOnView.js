// app/feed/[sku]/DataLayerOnView.js
'use client';

import { useEffect } from 'react';
import { pushToDataLayer } from '@/components/utils/dataUserpush';

export default function DataLayerOnView({ country, product }) {
  useEffect(() => {
    try {
      pushToDataLayer('viewed_feed_page', country, {
        sku_id: product?.sku,
        product_name: product?.name,
        product_price: `${product?.currency || ''} ${product?.display_price}`,
        source_: 'WebFeed',
      });
    } catch {
      // no-op
    }
  }, [country, product]);

  return null;
}
