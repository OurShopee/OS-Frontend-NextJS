import React, { useRef, useCallback, useState, useEffect } from 'react';
import CarouselProducts from './CarouselProducts';
// import required modules

export default function HalfCarouselProducts() {

  return (
    <div className='carousel_products'>
      <CarouselProducts category_list={[1, 2, 3, 4, 5, 6, 7, 8]}/>
    </div>
  );
}
