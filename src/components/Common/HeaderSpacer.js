"use client";
import { useEffect, useState } from "react";

export default function HeaderSpacer() {
  // Start with a reasonable default based on typical header heights
  // Desktop: ~110px, Mobile: ~80px - using higher value to be safe
  const [headerHeight, setHeaderHeight] = useState(120);

  useEffect(() => {
    const updateHeight = () => {
      // Find all mainheader elements and get the tallest one
      const headers = document.querySelectorAll('.mainheader');
      if (headers.length > 0) {
        let maxHeight = 0;
        headers.forEach((header) => {
          const height = header.offsetHeight;
          if (height > maxHeight) {
            maxHeight = height;
          }
        });
        if (maxHeight > 0) {
          setHeaderHeight(maxHeight);
        }
      }
    };

    // Use multiple attempts to ensure we catch the header after it renders
    const timeouts = [
      setTimeout(updateHeight, 0),
      setTimeout(updateHeight, 50),
      setTimeout(updateHeight, 100),
      setTimeout(updateHeight, 200),
      setTimeout(updateHeight, 500),
    ];

    // Update on resize
    window.addEventListener('resize', updateHeight);
    
    // Use MutationObserver to watch for DOM changes
    const observer = new MutationObserver(updateHeight);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style'],
    });

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
      window.removeEventListener('resize', updateHeight);
      observer.disconnect();
    };
  }, []);

  return (
    <div 
      style={{ 
        height: `${headerHeight}px`,
        minHeight: `${headerHeight}px`,
        width: '100%',
        flexShrink: 0,
      }} 
    />
  );
}

