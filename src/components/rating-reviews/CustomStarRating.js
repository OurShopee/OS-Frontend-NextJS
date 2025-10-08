// components/CustomStarRating.jsx
import React from "react";
import StarRatings from "react-star-ratings";

const CustomStarRating = ({
  editRating,
  setEditRating,
  isSelectable = false,
  rating = 0,
  svgIconViewBox = "0 0 24 24",
  starSpacing="0px",
  color = "#F4B706",
  size = "30px",
  path = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
}) => {
  
  const handleChangeRating = (r) => {
    if (!isSelectable) return;
    setEditRating(r);
  };

  const displayRating = isSelectable ? editRating : rating;
  
  return (
    <StarRatings
      rating={displayRating}
      starRatedColor={color}
      starDimension={size}
      starSpacing={starSpacing}
      starHoverColor="#F4B706"
      changeRating={isSelectable && handleChangeRating}
      starEmptyColor="#d1d5db"
      svgIconViewBox={svgIconViewBox}
      svgIconPath={path}
      numberOfStars={5}
      name="rating"
      isSelectable={isSelectable}
    />
  );
};

export default CustomStarRating;
