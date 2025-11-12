import React from "react";

const Star = ({ color = "white", size = 14, className }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 14 14"
        fill="none"
      >
        <path
          d="M 7.935 0.655 C 7.617 -0.218 6.383 -0.218 6.065 0.655 L 4.622 4.622 L 0.655 6.065 C -0.218 6.383 -0.218 7.617 0.655 7.935 L 4.622 9.378 L 6.065 13.345 C 6.383 14.218 7.617 14.218 7.935 13.345 L 9.378 9.378 L 13.345 7.935 C 14.218 7.617 14.218 6.383 13.345 6.065 L 9.378 4.622 Z"
          fill={color}
        />
      </svg>
    </div>
  );
};

export default Star;
