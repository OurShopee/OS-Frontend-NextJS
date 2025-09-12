import React, { useEffect, useState } from 'react';
import Odometer from 'react-odometerjs';
import 'odometer/themes/odometer-theme-default.css';

const OdometerCounter = ({ value = 0, duration = 2000, format = "(,ddd)" }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDisplayValue(value);
    }, 100); // small delay to trigger odometer animation

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <Odometer
      value={displayValue}
      format={format}
      duration={duration}
      theme="default"
    />
  );
};

export default OdometerCounter;
