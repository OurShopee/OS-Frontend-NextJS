import { useContent } from '@/hooks';
import React from 'react';
import { IoChevronDown } from 'react-icons/io5';

const LoadMoreButton = ({ onClick }) => {
    const loadMore = useContent("buttons.loadMore");
    return (
        <button
            onClick={onClick}
            style={{ border: "1px solid #5232c2", paddingLeft: "20px", paddingRight: "20px" }}
            className="active:scale-95 flex items-center gap-1 text-primary py-2 !px-6 font-medium bg-transparent rounded-full hover:text-white transition-all duration-300 ease-in-out !w-max m-auto bg-white hover:bg-[linear-gradient(90deg,_#5232C2_0%,_#6D53C8_25.48%,_#5232C2_51.44%,_#694AD7_73.56%,_#5232C2_100%)]">
            {loadMore}
            <IoChevronDown size={25} />
        </button>

    );
}

export default LoadMoreButton;
