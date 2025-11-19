import React from "react";
import { FiArrowUpRight } from "react-icons/fi";

export default function ProductCategoriesCard({
  title = "Perfumes",
  discount = "55%",
  image,
  color,
  textColor,
}) {
  return (
    <div
      style={{ backgroundColor: `${color}` }}
      className={`relative w-full rounded-xl group px-3 h-max flex flex-col justify-between font-outfit`}
    >
      {/* Discount + Title */}
      <div className="z-10">
        <div className="flex items-end leading-none gap-1 relative">
          <h1
            style={{ color: `${textColor}` }}
            className="text-[6rem] mb-0 font-bayon font-normal text-white/50"
          >
            {discount}
          </h1>
          <p className="text-lg font-semibold mb-6 text-white">OFF</p>
          <div className="h-36 w-40">
            <img
              loading="lazy"
              src={image}
              alt={title}
              className="absolute h-full top-3 object-contain w-auto  transition-transform duration-500 group-hover:-translate-y-2"
            />
          </div>
        </div>
        <p
          style={{ color: `${textColor}` }}
          className="font-medium text-2xl text-black mt-2 mb-0"
        >
          {title}
        </p>

        {/* View Products Link on Hover */}
        <div
          style={{ color: `${textColor}` }}
          className="cursor-pointer flex items-center gap-1 pb-2 text-sm text-black/75 opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-300"
        >
          View Products <FiArrowUpRight size={14} />
        </div>
      </div>
    </div>
  );
}
