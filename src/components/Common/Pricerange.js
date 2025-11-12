import React, { useEffect, useState } from 'react';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import { useParams } from 'next/navigation';
import { useContent } from '@/hooks/useContent';

export default function PriceRangeSlider({ urlParams, setUrlParams, min_value, max_value, currency }) {
  const params = useParams();
  const priceRangeTitle = useContent("product.priceRange");
  const min = useContent("labels.min");
  const max = useContent("labels.max");
  const clearAll = useContent("buttons.clearAll");
  const apply = useContent("buttons.apply");
  const slug = params?.slug;
  const [minimum_value, setminimum_value] = useState(0);
  const [maximum_value, setmaximum_value] = useState(0);

  const handleChange = (values) => {
    setminimum_value(values[0])
    setmaximum_value(values[1])
  };

  useEffect(() => {
    setmaximum_value(max_value)
    setminimum_value(0)
  }, [slug])

  useEffect(() => {
    var queryObj = {};
    for (const entry of urlParams.entries()) {
      queryObj = Object.fromEntries([...urlParams]);
    }
    const matched = Object.entries(queryObj).reduce((acc, [key, value]) => {
      if (key === 'min' || key === 'max') {
        acc[key] = value;
      }
      return acc;
    }, {});

    const priceInput = Object.keys(matched).length ? [matched] : [];
    if (priceInput.length > 0) {
      setminimum_value(parseFloat(priceInput[0].min))
      setmaximum_value(parseFloat(priceInput[0].max))
    } else {
      setminimum_value(min_value)
      setmaximum_value(Math.round(max_value))
    }
  }, [slug])


  const handleInputChange = (event) => {
    if (event.target.name == 'min') {
      setminimum_value(event.target.value)
    }
    if (event.target.name == 'max') {
      setmaximum_value(event.target.value)
    }
  }

  const handleApply = () => {
    urlParams.set('min', minimum_value)
    urlParams.set('max', maximum_value)
    setUrlParams(urlParams)
  }

  const handleClear = () => {
    urlParams.delete('min')
    urlParams.delete('max')
    setUrlParams(urlParams)
  }



  return (
    <div className='mb-4'>
      <div className='pricerange-title'>{priceRangeTitle}</div>
      <RangeSlider
        min={min_value}
        max={max_value}
        step={1}
        value={[minimum_value, maximum_value]}
        onInput={handleChange}
      />
      <div className='flex items-center mt-3'>
        <div className='font-semibold text-sm'>
          <div>{min}</div>
          <input type='text' className='mt-1 slider_range_input_box' name={'min'} value={minimum_value} onChange={handleInputChange} />
        </div>
        <div className='font-semibold text-sm mt-4 mx-4'>to</div>
        <div className='font-semibold text-sm'>
          <div>{max}</div>
          <input type='text' className='mt-1 slider_range_input_box' name={'max'} value={maximum_value} onChange={handleInputChange} />
        </div>
      </div>

      <div className='flex items-center justify-end mt-4'>
        <div className='clear_all cursor-pointer' onClick={handleClear}>{clearAll}</div>
        <div className='ms-3 apply_btn cursor-pointer bg-indigo-600 text-white' onClick={handleApply}>{apply}</div>
      </div>

      {/* <div className='pricerange-price'>{currency} {priceRange.length > 0 ? priceRange[0] : 10} - {currency} {priceRange.length > 0 ? priceRange[1] : max_value}</div> */}

    </div>
  );
}
