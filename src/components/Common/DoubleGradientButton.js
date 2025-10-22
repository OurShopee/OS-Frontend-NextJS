import React from 'react';

const DoubleGradientButton = ({ title, className, dis }) => {
    return (
        <button type="submit" className={`w-full mt-6 double-gradient border-none text-white py-3 font-bold rounded-lg shadow-[0px_5px_8px_0px_#5B5B5B40] ${className}`}>
            {title}
        </button>
    );
}

export default DoubleGradientButton;
