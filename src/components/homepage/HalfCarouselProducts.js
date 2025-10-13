import { useRef } from 'react';
// Import Swiper React components
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/pagination';
import { ComponentHeader } from '../Common';
import { MediaQueries } from '../utils';
import CarouselProducts from './CarouselProducts';
// import required modules

export default function HalfCarouselProducts({ products, url, type, bg_color, title, first_string_color, second_string_color, view_all, inner_bg, first_title, second_title }) {

  const { isMobile } = MediaQueries()

  const sliderRef = useRef(null);

  return (
    <div className={`carousel_products ${type == 2 && 'pt-4 px-3'}`} style={{ background: bg_color }}>
      <ComponentHeader first_title={first_title} second_title={second_title} url={url} title={title} first_string_color={first_string_color} second_string_color={second_string_color} view_all={view_all} />
      <CarouselProducts products={products} type={type} inner_bg={inner_bg} />
    </div>
  );
}
