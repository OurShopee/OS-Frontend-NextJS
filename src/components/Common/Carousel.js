import React, { useState, useEffect } from 'react';

const Carousel = ({ 
  fade = false, 
  className = '', 
  controls = false, 
  indicators = true, 
  setActiveIndex,
  activeIndex = 0,
  children,
  onIndexChange
}) => {
  const [currentIndex, setCurrentIndex] = useState(activeIndex);
  const totalItems = React.Children.count(children);

  // Update currentIndex when activeIndex prop changes
  useEffect(() => {
    setCurrentIndex(activeIndex);
  }, [activeIndex]);

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? totalItems - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setActiveIndex(newIndex);
    if (onIndexChange) {
      onIndexChange(newIndex);
    }
  };

  const goToNext = () => {
    const newIndex = currentIndex === totalItems - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setActiveIndex(newIndex);
    if (onIndexChange) {
      onIndexChange(newIndex);
    }
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setActiveIndex(index);
    if (onIndexChange) {
      onIndexChange(index);
    }
  };
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Main carousel container */}
      <div 
        className={`flex ${fade ? 'transition-opacity duration-500' : 'transition-transform duration-500 ease-out'}`}
        style={fade ? 
          {} : 
          { transform: `translateX(-${currentIndex * 100}%)` }
        }
      >
        {React.Children.map(children, (child, index) => (
          <div 
            key={index}
            className={`w-full flex-shrink-0 ${fade ? (index === currentIndex ? 'opacity-100' : 'opacity-0 absolute inset-0') : ''}`}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Controls - only show if controls prop is true */}
      {/* {controls && totalItems > 1 && (
        <div className='cursor-pointer'>
          <button 
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/20  text-white p-3 rounded-full hover:bg-white/30 transition-all duration-200 flex items-center justify-center w-10 h-10"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={goToNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-200 flex items-center justify-center w-10 h-10"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )} */}
      {controls && totalItems > 1 && (
  <>
    {/* Prev */}
    <button
      onClick={goToPrevious}
      aria-label="Previous slide"
      className="
        absolute left-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer
        inline-flex items-center justify-center border-none
        w-10 h-10 rounded-full
        bg-white/25 
        ring-1 ring-white/40
        hover:bg-white/35 hover:ring-white/70
        transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80
      "
    >
      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
        <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>

    {/* Next */}
    <button
      onClick={goToNext}
      aria-label="Next slide"
      className="
        absolute right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer
        inline-flex items-center justify-center border-none
        w-10 h-10 rounded-full
        bg-white/25 
        ring-1 ring-white/40

        hover:bg-white/35 hover:ring-white/70
        transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80
      "
    >
      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
        <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  </>
)}


      {/* Indicators - only show if indicators prop is true */}
      {indicators && totalItems > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {React.Children.map(children, (_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Carousel.Item component to match Bootstrap API
Carousel.Item = ({ children, className = '' }) => {
  return (
    <div className={`w-full h-full ${className}`}>
      {children}
    </div>
  );
};

export default Carousel;
