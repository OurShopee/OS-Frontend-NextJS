"use client"; // Enable client-side rendering

import React, { Suspense, useState, useEffect, useMemo, useCallback } from 'react';
import he from 'he'; // Decode HTML entities
import ProductDetailTabs from './ProductDetailTabs';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Loader } from '@/app/feed/[sku]/page';
// Define placeholder image constant
const PLACEHOLDER_IMAGE = '/favicon.png';


const ProductPageLayout = ({
  product,
  locationsData = [],
  queryParams = {},
  country = 'uae',
  Webfeed
}) => {
  const [activeImage, setActiveImage] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const currentcountry = useSelector((state) => state.globalslice.currentcountry);

  // Memoize derived values
  const {
    displayPrice,
    oldPrice,
    galleryImages,
    isOutOfStock,
    productInfoDetails,
    decodedDetails
  } = useMemo(() => ({
    displayPrice: product?.display_price || 'Price not available',
    oldPrice: product?.old_price,
    galleryImages: product?.images?.length ? product.images : (product?.image ? [product.image] : []),
    isOutOfStock:
      product?.stock?.toLowerCase() !== 'in stock' ||
      !product?.display_price ||
      typeof product?.display_price !== 'number',
    productInfoDetails: [
      ...(product?.small_desc_data || [])
        .filter(item => item.title && (item.value || item.value === 0))
        .map(item => ({
          label: item.title,
          value: item.value
        }))
    ],
    decodedDetails: product?.details ? he.decode(product.details) : ''
  }), [product]);
  // Update active image when product changes
  useEffect(() => {
    setActiveImage(galleryImages[0] || null);
    setImageError(false);
    setIsLoading(true);
  }, [product?.id, galleryImages]);
  const handleImageError = useCallback((e) => {
    if (e.currentTarget.src !== PLACEHOLDER_IMAGE) {
      e.currentTarget.src = PLACEHOLDER_IMAGE;
      setImageError(true);
    }
  }, []);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleThumbnailClick = useCallback((imgUrl) => {
    setActiveImage(imgUrl);
    setImageError(false);
    setIsLoading(true);
  }, []);

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <main className="container mx-auto flex-1 py-5 text-center">
          <div className="animate-pulse">
            <div className="mx-auto mb-4 h-8 w-11/12 max-w-3xl rounded bg-gray-200"></div>
            <div className="mx-auto h-64 w-2/3 max-w-2xl rounded bg-gray-200"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Product tracking */}
      <Suspense
        fallback={
          <div className="p-4 text-center">
            <div className="animate-pulse">
              <div className="mx-auto h-4 w-1/4 rounded bg-gray-200"></div>
            </div>
          </div>
        }
      >
        {/* <ProductTracking 
          product={product} 
          queryParams={queryParams} 
          country={country} 
        /> */}
      </Suspense>

      <main className="lg:max-w-[1320px] mx-auto flex-1 py-5 select-none">
        <div className="grid min-h-[calc(100vh-200px)] grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Image Section */}
          <div className="lg:sticky lg:top-4 lg:col-span-5 h-fit">
            <div className="relative mb-2 overflow-hidden rounded border bg-gray-100 shadow-sm" style={{ aspectRatio: '1 / 1' }}>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/75">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500"></div>
                </div>
              )}

              {activeImage ? (
                <img
                  key={activeImage}
                  src={activeImage}
                  alt={product.name || 'Product Image'}
                  className={`h-full w-full object-contain transition-opacity ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                  loading="lazy"
                />
              ) : (
                <div className="text-muted flex h-full w-full items-center justify-center text-gray-500">No Image Available</div>
              )}

              {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="rounded bg-red-600 p-2 text-lg font-semibold text-white">OUT OF STOCK</span>
                </div>
              )}
            </div>

            {/* Thumbnail Slider */}
            {galleryImages.length > 1 && (
              <div className="flex gap-2 overflow-auto py-1">
                {galleryImages.map((imgUrl, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(imgUrl)}
                    className={`flex h-20 w-20 flex-shrink-0 items-center justify-center rounded border p-1 ${activeImage === imgUrl ? 'border-blue-600' : 'border-gray-200'}`}
                    type="button"
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${index + 1}`}
                      className="h-full w-full object-contain"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div
            className="lg:col-span-7 max-h-[calc(100vh-160px)] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="w-full">
              <h1 className="mb-0 border-b pb-2 text-wrap text-dark text-base font-semibold text-gray-900 sm:text-2xl">
                {product.name || 'Product Name Unavailable'}
              </h1>
              <div className="mb-3 flex items-center gap-2 border-b">
                <p className={`mb-0 text-2xl font-bold text-blue-600 ${isOutOfStock ? 'line-through opacity-75' : ''}`}>
                  <span className="text-dark flex items-center gap-1 text-gray-900">
                    <span className="text-base font-semibold">{!isOutOfStock ? currentcountry.currency : ''}</span>
                    <span className="">{typeof displayPrice === 'number' && displayPrice}</span>
                  </span>
                </p>
                {isOutOfStock && (
                  <span className="rounded bg-red-600 px-2 py-1 text-lg font-medium text-white">OUT OF STOCK</span>
                )}
              </div>

              {/* Product Attributes */}
              {productInfoDetails.length > 0 && (
                <div className="w-full pb-4">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-3">
                    {productInfoDetails.map((detail, index) => (
                      <div key={`${detail.label}-${index}`} className="h-full rounded-lg bg-gray-100 p-2">
                        <div className="text-[12px] text-gray-500">{detail.label}</div>
                        <div className="text-[14px] break-words text-gray-900">{detail.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <ProductDetailTabs
              product={product}
              locationsData={locationsData}
              queryParams={queryParams}
              country={country}
              Webfeed={Webfeed}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

ProductPageLayout.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    display_price: PropTypes.string,
    old_price: PropTypes.string,
    stock: PropTypes.string,
    quantity: PropTypes.number,
    sku: PropTypes.string,
    brand: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    image: PropTypes.string,
    small_desc_data: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })),
    details: PropTypes.string
  }),
  locationsData: PropTypes.array,
  queryParams: PropTypes.object,
  country: PropTypes.string,
  Webfeed: PropTypes.object
};

export default ProductPageLayout;
