import React from 'react';

const Carousel = ({ 
  fade = false, 
  className = '', 
  controls = true, 
  indicators = true, 
  activeIndex = 0,
  children 
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Main carousel container */}
      <div 
        className={`flex ${fade ? 'transition-opacity duration-500' : 'transition-transform duration-500 ease-out'}`}
        style={fade ? 
          {} : 
          { transform: `translateX(-${activeIndex * 100}%)` }
        }
      >
        {React.Children.map(children, (child, index) => (
          <div 
            key={index}
            className={`w-full flex-shrink-0 ${fade ? (index === activeIndex ? 'opacity-100' : 'opacity-0 absolute inset-0') : ''}`}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Controls - only show if controls prop is true */}
      {/* {controls && (
        <>
          <button className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-50 hover:opacity-100 transition-opacity">
            &#8249;
          </button>
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-50 hover:opacity-100 transition-opacity">
            &#8250;
          </button>
        </>
      )} */}

      {/* Indicators - only show if indicators prop is true */}
      {indicators && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {React.Children.map(children, (_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === activeIndex ? 'bg-white' : 'bg-white/50'
              }`}
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
