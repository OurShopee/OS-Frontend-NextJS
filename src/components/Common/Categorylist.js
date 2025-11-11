"use client";
import React, { useState, useEffect, useRef } from "react";
import { IoMenuSharp } from "react-icons/io5";
import { useSelector } from "react-redux";
import { AiOutlineMenu } from "react-icons/ai";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BiSolidRightArrow } from "react-icons/bi";
import { pushToDataLayer } from "../utils/dataUserpush";
import { useContent, getDynamicContent, useCurrentLanguage } from "@/hooks";

// Custom NavLink component for Next.js App Router
const NavLink = ({
  to,
  children,
  className,
  onMouseEnter,
  onClick,
  ...props
}) => {
  const pathname = usePathname();
  const isActive = pathname === to;

  return (
    <Link href={to} {...props}>
      <span
        className={`${className} ${isActive ? "active" : ""}`}
        onMouseEnter={onMouseEnter}
        onClick={onClick}
      >
        {children}
      </span>
    </Link>
  );
};

const Categorylist = () => {
  const categorydata = useSelector((state) => state.globalslice.data);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredsubCategory, setHoveredsubCategory] = useState(null);
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const [sub_subcategorydata, setsub_subcategorydata] = useState([]);
  const [brands, setbrands] = useState([]);
  const dropdownRef = useRef(null);
  const currentLanguage = useCurrentLanguage();

  // Language content
  const categoryText = useContent("header.category");
  const shopByCategory = useContent("header.shopByCategory");
  const shopBySubCategory = useContent("header.shopBySubCategory");
  const topBrands = useContent("header.topBrands");

  // Update sub-subcategory when hoveredCategory changes
  useEffect(() => {
    if (hoveredCategory) {
      const firstSubcategory = hoveredCategory.subcategory?.[0]; // Get first subcategory
      setHoveredsubCategory(firstSubcategory || null); // Set first subcategory as hovered
      setsub_subcategorydata(firstSubcategory?.sub_subcategory || []); // Set its sub-subcategories
      setbrands(firstSubcategory?.brands || []);
    } else {
      setHoveredsubCategory(null);
      setsub_subcategorydata([]);
      setbrands([]);
    }
  }, [hoveredCategory]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setHoveredCategory(null);
        setHoveredsubCategory(null);
        setsub_subcategorydata([]);
        setbrands([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update sub-subcategory when hoveredsubCategory changes
  useEffect(() => {
    if (hoveredsubCategory) {
      setsub_subcategorydata(hoveredsubCategory?.sub_subcategory || []);
      setbrands(hoveredsubCategory.brands || []);
    }
  }, [hoveredsubCategory]);

  const handlecategoryclick = (categoryName, region) => {
    pushToDataLayer("clicked_category_from_menu", region, {
      category_name: categoryName,
      page_name: typeof window !== "undefined" ? window.location.pathname : "",
    });
  };

  const handlesubcategoryclick = (categoryName, subCategoryName) => {
    pushToDataLayer("clicked_category_from_menu", currentcountry.name, {
      category_name: categoryName,
      sub_category_name: subCategoryName,
      page_name: typeof window !== "undefined" ? window.location.pathname : "",
    });
  };

  const handlesubcategory2click = (categoryName, subsubCategoryName) => {
    pushToDataLayer("clicked_category_from_menu", currentcountry.name, {
      category_name: categoryName,
      sub_category2_name: subsubCategoryName,
      page_name: typeof window !== "undefined" ? window.location.pathname : "",
    });
  };

  return (
    <div
      ref={dropdownRef}
      className={`headercategorytitle ${
        showDropdown ? "headercatrgtoyclick" : ""
      }`}
      onClick={() => setShowDropdown(!showDropdown)}
    >
      <AiOutlineMenu size={20} className="mr-2" /> {categoryText}
      {showDropdown && (
        <div className="headerdropdowncategory">
          <div className="headerrrr">
            {categorydata.map((ele) => (
              <NavLink
                to={`/categories/${ele.url}`}
                key={ele.id}
                className={`no-underline category-item ${
                  hoveredCategory === ele ? "active-category" : ""
                }`}
                onMouseEnter={() =>
                  setHoveredCategory(ele.subcategory?.length > 0 ? ele : null)
                }
                onClick={() =>
                  handlecategoryclick(getDynamicContent(ele, "category_name", currentLanguage), currentcountry.name)
                }
              >
                {getDynamicContent(ele, "category_name", currentLanguage)}
                <BiSolidRightArrow
                  className="categorylistrightarrow"
                  size={10}
                />
              </NavLink>
            ))}
          </div>
          {hoveredCategory?.subcategory?.length > 0 && (
            <div className="subcategory-dropdown">
              <div className="categorylistcategory">
                <div className="subcategory-titles">{shopByCategory}</div>
                <div className="sucategorydropdown-list">
                  {hoveredCategory.subcategory.map((sub) => (
                    <NavLink
                      to={`/products-category/${sub.url}`}
                      key={sub.sub_category_id}
                      className={`no-underline subcategory-item ${
                        hoveredsubCategory === sub ? "active-subcategory" : ""
                      }`}
                      onMouseEnter={() =>
                        setHoveredsubCategory(
                          sub.sub_subcategory?.length > 0 ? sub : null
                        )
                      }
                      onClick={() =>
                        handlesubcategoryclick(
                          getDynamicContent(hoveredCategory, "category_name", currentLanguage),
                          getDynamicContent(sub, "sub_category_name", currentLanguage)
                        )
                      }
                    >
                      {getDynamicContent(sub, "sub_category_name", currentLanguage)}
                      <BiSolidRightArrow
                        className="categorylistrightarrow"
                        size={10}
                      />
                    </NavLink>
                  ))}
                </div>
              </div>
              <div className="categorylistlastsection">
                <div className="subcategory-titles">{shopBySubCategory}</div>
                <div className="categorylastsectionscrool">
                  {sub_subcategorydata &&
                    sub_subcategorydata.length > 0 &&
                    sub_subcategorydata.map((subsub) => (
                      <NavLink
                        to={`/products-subcategory/${subsub.url}`}
                        key={subsub.sub_subcategory_id}
                        className={`no-underline subcategory-item ml-1 mr-1 ${
                          sub_subcategorydata.includes(subsub)
                            ? "active-sub-subcategorys"
                            : ""
                        }`}
                        onClick={() =>
                          handlesubcategory2click(
                            getDynamicContent(hoveredCategory, "category_name", currentLanguage),
                            getDynamicContent(subsub, "sub_subcategory_name", currentLanguage)
                          )
                        }
                      >
                        {getDynamicContent(subsub, "sub_subcategory_name", currentLanguage)}
                      </NavLink>
                    ))}
                </div>
                <div className="subcategory-titles">{topBrands}</div>
                <div className="categorylastsectionscrool">
                  {brands &&
                    brands.length > 0 &&
                    [
                      ...new Map(
                        brands.map((item) => [item.name, item])
                      ).values(),
                    ].map((ele) => (
                      <NavLink
                        to={`/brands/${ele.url}/${ele.subcategory_id}`}
                        key={ele.name}
                        className="no-underline subcategory-item ml-1 mr-1"
                      >
                        {ele.name}
                      </NavLink>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Categorylist;
