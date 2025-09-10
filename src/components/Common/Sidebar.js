"use client";
import arrowleft from "@/images/Arrow - Left 2.png";
import userimg from "@/images/sidebaruser.png";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  setformmodal,
  setformstatus
} from "../../redux/formslice";
import { pushToDataLayer } from "../utils/dataUserpush";

// Custom NavLink component for Next.js App Router
const NavLink = ({ to, children, className, onClick, ...props }) => {
  const pathname = usePathname();
  const isActive = pathname === to;

  return (
    <Link href={to} {...props}>
      <span
        className={`${className} ${isActive ? "active" : ""}`}
        onClick={onClick}
      >
        {children}
      </span>
    </Link>
  );
};

const Sidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const categorydata = useSelector((state) => state.globalslice.data);
  const [openSubcategory, setOpenSubcategory] = useState(null);
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const [openSubsubcategory, setOpenSubsubcategory] = useState(null);
  const logindata = useSelector((state) => state.formslice.logindata);
  const formmodal = useSelector((state) => state.globalslice.formmodal);
  const authstatus = useSelector((state) => state.formslice.authstatus);
  const [openStatus, setOpenStatus] = useState(1);

  const handleSubcategoryToggle = (category) => {
    setOpenSubcategory(category);
    setOpenSubsubcategory(null);
    setOpenStatus(2);
  };

  useEffect(() => {
    if (!isOpen) {
      setOpenSubcategory(null);
      setOpenSubsubcategory(null);
      setOpenStatus(1);
    }
  }, [isOpen]);

  const handleSubsubcategoryToggle = (subcategory) => {
    setOpenSubsubcategory(subcategory);
    setOpenStatus(3);
  };

  const loginclick = () => {
    dispatch(setformmodal(!formmodal));
    dispatch(setformstatus(1));
  };

  const signupclick = () => {
    dispatch(setformmodal(!formmodal));
    dispatch(setformstatus(2));
  };

  const backcategory = () => {
    if (openStatus === 1) {
      onClose(); // Close the sidebar
    } else if (openStatus === 2) {
      setOpenSubcategory(null);
      setOpenStatus(1);
    } else if (openStatus === 3) {
      setOpenSubsubcategory(null);
      setOpenStatus(2);
    }
  };

  const handlecategoryclick = (categoryName) => {
    pushToDataLayer("clicked_category_from_menu", currentcountry.name, {
      category_name: categoryName,
      page_name: typeof window !== "undefined" ? window.location.pathname : "",
    });
    onClose();
  };

  const handlesubcategoryclick = (categoryName, subCategoryName) => {
    pushToDataLayer("clicked_category_from_menu", currentcountry.name, {
      category_name: categoryName,
      sub_category_name: subCategoryName,
      page_name: typeof window !== "undefined" ? window.location.pathname : "",
    });
    onClose();
  };

  const handlesubcategory2click = (categoryName, subsubCategoryName) => {
    pushToDataLayer("clicked_category_from_menu", currentcountry.name, {
      category_name: categoryName,
      sub_category2_name: subsubCategoryName,
      page_name: typeof window !== "undefined" ? window.location.pathname : "",
    });
    onClose();
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-content">
        <div className="sidebattopsection">
          <div>
            <img
              src={arrowleft}
              alt="Back arrow"
              onClick={backcategory}
              className="cursor-pointer"
              
            />
          </div>
          <div onClick={onClose}>
            <AiOutlineClose size={20} />
          </div>
        </div>

        <div className="sidebar-top-details">
          <img src={userimg} alt="User" />
          {/* <BiSolidUserCircle size={40} /> */}
          <div className="sidebaruser">
            {!authstatus ? (
              <div className="sidebar-login cursor-pointer">
                {" "}
                <span onClick={loginclick}>Login </span> /{" "}
                <span onClick={signupclick}>Signup</span>
              </div>
            ) : (
              <div className="side-welcome">
                {`Welcome ${
                  logindata?.first_name?.trim().length > 15
                    ? logindata.first_name.trim().substring(0, 15) + "..."
                    : logindata?.first_name?.trim()
                }`}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="sidebarscrool">
        {/* Main Categories */}
        {openStatus === 1 && (
          <div>
            <div className="category-headers">Categories</div>
            {categorydata?.map((category, i) => (
              <NavLink
                className="sidebar-category no-underline"
                key={i}
                to={`/categories/${category.url}`}
                onClick={() => {
                  handlecategoryclick(
                    category.category_name,
                    currentcountry.name
                  );

                  const landingUrl = "/categories/" + category?.url;

                  pushToDataLayer(
                    "clicked_category_from_menu",
                    currentcountry.name,
                    {
                      category_name: category.category_name,
                      page_name: landingUrl,
                    }
                  );
                }}
              >
                {category.category_name}
                {category.subcategory?.length > 0 && (
                  <img
                    src={"/assets/vector_icons/Arrow -right.png"}
                    alt="Right arrow"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleSubcategoryToggle(category);
                    }}
                  />
                  // <FaAngleDown size={16} />
                )}
              </NavLink>
            ))}
          </div>
        )}

        {/* Subcategories */}
        {openStatus === 2 && openSubcategory && (
          <div>
            <div className="category-headers">
              {openSubcategory.category_name}
            </div>
            {openSubcategory.subcategory.map((sub) => (
              <NavLink
                to={`/products-category/${sub.url}`}
                className="sidebar-category no-underline"
                key={sub.category_id}
                onClick={() => {
                  const landingUrl = "/products-category/" + sub?.url;

                  handlesubcategoryclick(
                    openSubcategory.category_name,
                    sub.sub_category_name
                  );

                  pushToDataLayer(
                    "clicked_subcategory_from_menu",
                    currentcountry.name,
                    {
                      category_name: openSubcategory.category_name,
                      sub_category_name: sub.sub_category_name,
                      page_name: landingUrl,
                    }
                  );
                }}
              >
                {sub.sub_category_name}
                {sub.sub_subcategory?.length > 0 && (
                  <img
                    src={"/assets/vector_icons/Arrow -right.png"}
                    alt="Right arrow"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleSubsubcategoryToggle(sub);
                    }}
                  />
                  // <FaAngleDown size={16}  />
                )}
              </NavLink>
            ))}
          </div>
        )}

        {/* Sub-subcategories */}
        {openStatus === 3 && openSubsubcategory && (
          <div>
            <div className="category-headers">
              {" "}
              {openSubsubcategory.sub_category_name}
            </div>
            {openSubsubcategory.sub_subcategory.map((sub) => (
              <NavLink
                onClick={() => {
                  handlesubcategory2click(
                    openSubcategory.category_name,
                    sub.sub_subcategory_name
                  );
                  const landingUrl = "/products-category/" + sub.url;

                  pushToDataLayer(
                    "clicked_subcategory2_from_menu",
                    currentcountry.name,
                    {
                      category_name: openSubsubcategory.sub_category_name,
                      sub_category2_name: sub.sub_subcategory_name,
                      page_name: landingUrl,
                    }
                  );
                }}
                to={`/products-subcategory/${sub.url}`}
                className="no-underline sidebar-category"
                key={sub.sub_subcategory_id}
              >
                {sub.sub_subcategory_name}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
