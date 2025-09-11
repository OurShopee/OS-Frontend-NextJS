// components/ProductImageGallery.jsx
'use client';

import React, { useState, useRef } from 'react';
import Slider from 'react-slick';
import Image from 'next/image';

const ProductImageGallery = ({ images = [], videoLink = null, productName = "Product" }) => {
  const [showVideo, setShowVideo] = useState(false);
  const sliderRef = useRef(null);

  const mainSliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: images.length > 1,
    fade: true,
  };

  // Parse YouTube embed URL
  const getYouTubeEmbedUrl = (url) => {
    try {
      const u = new URL(url);
      const id = u.hostname === 'youtu.be'
        ? u.pathname.slice(1)
        : u.searchParams.get('v') || u.pathname.split('/').pop();
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1` : null;
    } catch {
      return null;
    }
  };

  const embedVideoUrl = getYouTubeEmbedUrl(videoLink);
  const hasVideo = !!embedVideoUrl;

  const handleShowVideo = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowVideo(true);
  };

  const handleShowImage = () => {
    setShowVideo(false);
    const iframe = document.getElementById('youtube-video-iframe');
    iframe?.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
  };

  return (
    <div className="position-relative">
      {/* Video Overlay */}
      {showVideo && hasVideo && (
        <div className="position-absolute top-0 start-0 end-0 bottom-0 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center" style={{ zIndex: 20 }}>
          <div className="position-relative w-100 mw-xl p-4" style={{ aspectRatio: '16/9' }}>
            <button
              onClick={handleShowImage}
              className="position-absolute top-0 end-0 translate-middle bg-white text-dark rounded-circle p-1 btn btn-sm"
              style={{ zIndex: 30 }}
              aria-label="Close video"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <iframe
              id="youtube-video-iframe"
              src={embedVideoUrl}
              title="Product Video"
              className="w-100 h-100"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* Image Slider */}
      <div className={`${showVideo ? 'opacity-0 invisible' : 'opacity-100 visible'} transition`}>
        <Slider {...mainSliderSettings} ref={sliderRef}>
          {images.map((src, i) => (
            <div key={i} className="position-relative" style={{ aspectRatio: '1/1' }}>
              <Image
                src={src || '/images/placeholder.png'}
                alt={`${productName} - Image ${i + 1}`}
                layout="fill"
                objectFit="contain"
                priority={i === 0}
                className="w-100 h-100"
              />
              {/* Video play button on first image */}
              {i === 0 && hasVideo && !showVideo && (
                <button
                  onClick={handleShowVideo}
                  className="position-absolute top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-center bg-dark bg-opacity-25 hover-bg-opacity-50"
                  style={{ zIndex: 10 }}
                  aria-label="Play video"
                >
                  <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
                </button>
              )}
            </div>
          ))}
        </Slider>
      </div>

      {/* Optional: Watch Video Button */}
      {hasVideo && !showVideo && (
        <button
          onClick={handleShowVideo}
          className="mt-4 w-100 btn btn-primary py-2"
        >
          Watch Video
        </button>
      )}
    </div>
  );
};

export default ProductImageGallery;
