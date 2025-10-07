"use client";

import { useEffect, useRef, useState } from "react";
import { BiSolidRightArrow } from "react-icons/bi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useSelector } from "react-redux";
import Link from "next/link";
import { Navigationapi } from "@/api/products";

const Categorylist = () => {
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const [categorydata, setCategorydata] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredSubCategory, setHoveredSubCategory] = useState(null);
  const [subSubcategories, setSubSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const dropdownRef = useRef(null);

  const toggleBodyScroll = (disable) => {
    document.body.style.overflow = disable ? "hidden" : "unset";
  };

  useEffect(() => {
    const getProductData = async () => {
      const res = await Navigationapi();
      setCategorydata(res.data);
    };
    getProductData();
  }, []);

  useEffect(() => {
    if (hoveredCategory) {
      const firstSub = hoveredCategory.subcategory?.[0];
      setHoveredSubCategory(firstSub || null);
      setSubSubcategories(firstSub?.sub_subcategory || []);
      setBrands(firstSub?.brands || []);
    } else {
      setHoveredSubCategory(null);
      setSubSubcategories([]);
      setBrands([]);
    }
  }, [hoveredCategory]);

  useEffect(() => {
    if (categorydata && categorydata.length > 0 && showDropdown) {
      setHoveredCategory(categorydata[0]);
    }
  }, [categorydata, showDropdown]);

  useEffect(() => {
    if (hoveredSubCategory) {
      setSubSubcategories(hoveredSubCategory?.sub_subcategory || []);
      setBrands(hoveredSubCategory?.brands || []);
    }
  }, [hoveredSubCategory]);

  useEffect(() => {
    toggleBodyScroll(showDropdown);
    return () => toggleBodyScroll(false);
  }, [showDropdown]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        handleDropdownClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDropdownClose = () => {
    setShowDropdown(false);
    setHoveredCategory(null);
    setHoveredSubCategory(null);
    setSubSubcategories([]);
    setBrands([]);
  };

  return (
    <>
      {showDropdown && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleDropdownClose}
        ></div>
      )}

      <div
        ref={dropdownRef}
        className="relative z-50 select-none"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="flex items-center justify-between gap-1 py-1">
          <img
            src="/assets/vector_icons/burgericon.png"
            height={15}
            width={15}
            className="me-1 text-[17px] cursor-pointer flex"
            alt="burger"
          />
          <span className="text-white font-[Outfit] text-[15px] cursor-pointer font-medium">
            Category
          </span>
          <MdKeyboardArrowDown className="text-white cursor-pointer" />
        </div>

        {showDropdown && (
          <div
            className="absolute left-0 bg-white shadow-xl rounded-xl z-50 p-6"
            style={{ top: "calc(100% + 15px)" }}
          >
            <div className="flex gap-6 items-start h-[500px] w-[850px] xl:w-[1100px] 2xl:w-[1200px]">
              <div className="w-[30%] xl:w-[25%] 2xl:w-[25%] pr-4 h-full overflow-y-auto custom-scrollbar border-r-2 border-[#EEEBFA]">
                {categorydata?.map((cat) => (
                  <Link
                    key={cat.category_id}
                    onMouseEnter={() => setHoveredCategory(cat)}
                    className={`flex items-center justify-between py-2 px-3 rounded-md cursor-pointer text-[15px] text-[#43494B] hover:bg-gray-100 ${
                      hoveredCategory === cat
                        ? "bg-[#EEEBFA] text-[#5232C2]"
                        : ""
                    } font-[Outfit] font-medium`}
                    href={"/categories/" + cat?.url}
                  >
                    {cat.category_name}
                    <BiSolidRightArrow
                      size={12}
                      className={
                        hoveredCategory === cat
                          ? "text-[#5232C2]"
                          : "text-gray-400"
                      }
                    />
                  </Link>
                ))}
              </div>

              <div className="w-[70%] xl:w-[75%] 2xl:w-[75%] h-full overflow-y-auto px-4 custom-scrollbar">
                <div className="mb-6">
                  <h3 className="font-semibold mb-4 text-black font-[Outfit] text-left text-[18px]">
                    Shop by Category
                  </h3>
                  <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                    {hoveredCategory?.subcategory?.map((sub) => (
                      <Link
                        href={`/products-category/${sub.url}`}
                        key={sub.sub_category_id}
                        onMouseEnter={() =>
                          setHoveredSubCategory(
                            sub?.sub_subcategory?.length > 0 ? sub : null
                          )
                        }
                        className={`flex-shrink-0 w-[100px] flex flex-col items-center text-center group ${
                          hoveredSubCategory === sub ? "text-[#5232C2]" : ""
                        }`}
                      >
                        <div className="w-[70px] h-[70px] rounded-full flex items-center justify-center mb-2">
                          <img
                            src={sub.sub_category_image}
                            alt={sub.sub_category_name}
                            className="w-16 h-16 object-contain"
                          />
                        </div>
                        <span
                          className={`text-[15px] font-medium font-[Outfit] leading-[1.2] break-words group-hover:text-[#5232C2] ${
                            hoveredSubCategory === sub
                              ? "text-[#5232C2]"
                              : "text-[#595959]"
                          }`}
                        >
                          {sub.sub_category_name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="flex gap-6 max-h-[270px]">
                  <div className="w-1/2 overflow-y-auto pr-2 custom-scrollbar">
                    <h3 className="font-semibold mb-2 text-black font-[Outfit] text-left text-[18px] sticky top-0 bg-white z-10 py-2">
                      Shop by Sub-Category
                    </h3>
                    <div className="flex flex-col gap-6">
                      {subSubcategories.map((subsub) => (
                        <Link
                          href={`/products-subcategory/${subsub.url}`}
                          key={subsub.sub_subcategory_id}
                          className="group py-1 px-1 rounded font-[Outfit] text-left hover:bg-[#F1EDFE]"
                        >
                          <span className="text-[16px] font-medium text-[#595959] group-hover:text-[#5232C2]">
                            {subsub.sub_subcategory_name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="w-1/2 overflow-y-auto pr-2 custom-scrollbar">
                    {brands?.length > 0 && (
                      <h3 className="font-semibold mb-2 text-black font-[Outfit] text-left text-[18px] sticky top-0 bg-white z-10 py-2">
                        Top Brands
                      </h3>
                    )}
                    <div className="grid grid-cols-3 gap-x-4 xl:gap-x-12 gap-y-4">
                      {[
                        ...new Map(
                          brands.map((item) => [item.name, item])
                        ).values(),
                      ].map((brand) => (
                        <Link
                          href={`/brands/${brand.url}/${brand.subcategory_id}`}
                          key={brand.name}
                          className="group p-2 flex items-center bg-[#F4F4F4] justify-center w-full h-[80px] rounded-xl hover:no-underline transition-all duration-200"
                        >
                          <img
                            src={brand.image}
                            alt={brand.name}
                            className="h-6 mix-blend-multiply w-auto object-contain filter grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-200"
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Categorylist;
