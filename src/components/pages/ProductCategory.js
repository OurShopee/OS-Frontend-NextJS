"use client";
import Link from "next/link";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaChevronUp } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Category } from "../../actions";
import { Navigationapi } from "../../api/products";
import { Loader } from "../../app/loader";
import { sethas_more } from "../../redux/categoryslice";
import { ComponentHeader, ProductCard } from "../Common";
import BreadComps from "../Common/Breadcomps";
import LoadMoreButton from "../Common/LoadMoreButton";
import { HomeBannerPlaceholder } from "../Common/Placeholders";
import Pricerange from "../Common/Pricerange";
import { HomeCarousel, HomeCategories, HomeMobileCarousel } from "../homepage";
import { ProductCardPlaceHolder, SubcategoryPlaceHolder } from "../placeholders/ProductCategory";
import { MediaQueries } from "../utils";
import { pushToDataLayer } from "../utils/dataUserpush";

const ProductCategory = () => {
  const sort_byArray = [
    { id: 1, title: "New Arrivals", slug: "new arrival" },
    { id: 2, title: "Low to High Price", slug: "Low to High" },
    { id: 3, title: "High to Low Price", slug: "High to Low" },
    { id: 4, title: "Position", slug: "Position" },
  ];

  // Debouncing utility function
  const debounce = useCallback((func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }, []);

  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { isMobile } = MediaQueries();
  const segments = pathname.split("/");
  const mainCategory = segments[2];
  const categorytype = segments[1];
  const lastTwoSegments = segments.slice(-2).join("/");
  const searchParams = useSearchParams();
  const urlParams = new URLSearchParams(searchParams);
  const setUrlParams = (params) => {
    const newUrl = `${pathname}?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  };
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const slug1 =
    Array.isArray(params.slug) && params.slug.length > 1
      ? params.slug[1]
      : undefined;
  const slug2 =
    Array.isArray(params.slug) && params.slug.length > 2
      ? params.slug[2]
      : undefined;

  const [show, setShow] = useState(false);
  const [sort_show, setsort_show] = useState(false);
  const [sort_show_desktop, setsort_show_desktop] = useState(false);
  const [show_filters, setshow_filters] = useState(false);

  const [page, setCurrentPage] = useState(0);
  const [catdata, setcatdata] = useState([]);
  const [subcatdatass, setsubcatselected] = useState();
  const [subsubcategory, setsubsubcategory] = useState();
  const [searchInputs, setSearchInputs] = useState({});

  const [selected, selected_filters] = useState([]);
  const [mobile_selected, mobile_selected_filters] = useState(0);
  const [limited_items, setlimited_items] = useState([]);
  const [selected_items, setselected_items] = useState([]);

  const [filters, setFilters] = useState([]);
  const sortDropdownRef = useRef(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    const handleClick = (event) => {
      const isDropdownToggle = event.target.closest(".dropdown_title");
      if (isDropdownToggle) return;

      if (swiperRef.current && swiperRef.current.contains(event.target)) {
        setsort_show(false);
        setsort_show_desktop(false);
        return;
      }

      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setsort_show(false);
        setsort_show_desktop(false);
      }
    };

    const timeoutId = setTimeout(() => {
      if (sort_show || sort_show_desktop) {
        document.addEventListener("mousedown", handleClick);
        document.addEventListener("touchstart", handleClick);
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [sort_show, sort_show_desktop]);

  useEffect(() => {
    setsort_show(false);
    setsort_show_desktop(false);
  }, [pathname]);

  // Redux state
  const subcategoryScreen = useSelector((state) => state.categoryslice.subcategoryScreen);
  const displayed_products = useSelector((state) => state.categoryslice.displayed_products);
  const catloading = useSelector((state) => state.categoryslice.catloading);

  const [categorydata, setCategoryData] = useState();
  const currentcountry = useSelector((state) => state.globalslice.currentcountry);
  const has_more = useSelector((state) => state.categoryslice.has_more);
  const categoryList = useSelector((state) => state.globalslice.data);
  const categoryloading = useSelector((state) => state.globalslice.loading);

  const [showBackToTop, setShowBackToTop] = useState(false);
  const [priceRangeKey, setPriceRangeKey] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      setShowBackToTop(y > 980);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { getSubCatScreenList } = Category();

  useEffect(() => {
    setFilters(subcategoryScreen);
  }, [slug, subcategoryScreen]);

  const getSubSubCatData = async () => {
    let catdataLocal = categorydata;
    if (!categorydata) {
      // Use existing categoryList from Redux instead of making new API call
      if (categoryList && categoryList.length > 0) {
        catdataLocal = categoryList;
        setCategoryData(categoryList);
      } else {
        // Only fetch if not available in Redux
        const data = await Navigationapi();
        catdataLocal = data.data;
        setCategoryData(data?.data);
      }
    }
    const matchedData = catdataLocal.filter((category) =>
      category.subcategory?.some(
        (sub) => sub.url.toLowerCase() === mainCategory.toLowerCase()
      )
    );
    const matchedSubcategory = matchedData[0]?.subcategory?.find(
      (sub) => sub.url.toLowerCase() === mainCategory.toLowerCase()
    );
    let subSubCatSelected;
    if (matchedSubcategory) {
      subSubCatSelected = {
        title: matchedSubcategory.sub_category_name,
        url: matchedSubcategory.url,
        id: matchedSubcategory.sub_category_id,
        data: matchedSubcategory,
      };
    }
    return { matchedData, subSubCatSelected };
  };

  useEffect(() => {
    if (!mainCategory) return;
    let canceled = false;
    (async () => {
      try {
        const { matchedData = [], subSubCatSelected = null } = await getSubSubCatData();
        if (canceled) return;

        setcatdata?.(matchedData);
        setsubcatselected?.(subSubCatSelected);

        if (categorytype !== "products-category") {
          const subcat = matchedData?.[0]?.subcategory?.find((sc) =>
            sc?.sub_subcategory?.some(
              (s) => (s?.url || "").toLowerCase() === (lastTwoSegments || "").toLowerCase()
            )
          );

          const found = subcat?.sub_subcategory?.find(
            (s) => (s?.url || "").toLowerCase() === (lastTwoSegments || "").toLowerCase()
          );

          setsubsubcategory?.(found?.sub_subcategory_name);
        }
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      canceled = true;
    };
  }, [categorydata, mainCategory, categorytype, lastTwoSegments]);

  const handleSelectFilter = (id) => {
    if (selected.includes(id)) {
      selected_filters(selected.filter((ele) => ele != id));
    } else {
      selected_filters([...selected, id]);
    }
    if (limited_items.includes(id)) {
      setlimited_items(limited_items.filter((ele) => ele != id));
    }
  };

  const handleMobileSelectFilter = (id) => {
    mobile_selected_filters(id);
  };

  const handleSelectItem = (event, id, item) => {
    event.stopPropagation();

    const [rawValue, filterKey] = item.value.split("@"); // eg: 407_46, subcategory
    const isSortBy = id === "sortby";
    const valueAlreadySelected = selected_items.includes(rawValue);

    setCurrentPage(0);
    dispatch(sethas_more(true));

    if (isSortBy) {
      const allSortOptions = sort_byArray.map(({ slug }) => slug);
      const hasSort = selected_items.some((v) => allSortOptions.includes(v));
      const updatedSelected = hasSort
        ? [...selected_items.filter((v) => !allSortOptions.includes(v)), rawValue]
        : [...selected_items, rawValue];

      setselected_items(updatedSelected);
      urlParams.set(filterKey, rawValue);
      setUrlParams(urlParams);
      setsort_show(false);
      return;
    }

    const existingParam = urlParams.get(filterKey);
    let currentValues = existingParam ? existingParam.split(",") : [];
    if (valueAlreadySelected) {
      const updated = selected_items.filter((v) => v !== rawValue);
      setselected_items(updated);
      const cleaned = currentValues.filter((v) => v !== rawValue);
      if (cleaned.length > 0) {
        urlParams.set(filterKey, cleaned.join(","));
      } else {
        urlParams.delete(filterKey);
      }
    } else {
      const updated = [...selected_items, rawValue];
      setselected_items(updated);
      if (urlParams.has(filterKey)) {
        const newValueSet = [...new Set([...currentValues, rawValue])];
        urlParams.set(filterKey, newValueSet.join(","));
      } else {
        urlParams.set(filterKey, rawValue);
      }
    }

    if (!isMobile) setUrlParams(urlParams);
  };

  const handleSelectedAll = (event, id) => {
    event.stopPropagation();
    if (limited_items.includes(id)) {
      setlimited_items(limited_items.filter((ele) => ele != id));
    } else {
      setlimited_items([...limited_items, id]);
    }
  };

  const parseUrlParams = (params) => {
    const queryObj = Object.fromEntries([...params]);
    return Object.entries(queryObj).map(([key, value]) => ({
      title: key,
      value: value.split(","),
    }));
  };

  useEffect(() => {
    const finalInput = parseUrlParams(urlParams);
    setselected_items(finalInput.map((ele) => ele.value).flat());

    if (finalInput.length > 0) {
      selected_filters([
        ...finalInput
          .filter(({ title }) => title === "subsubcategory")
          .flatMap((ele) => ele.value.map((item) => parseInt(item.split("_")[1]))),
        ...finalInput.filter(({ title }) => title !== "subsubcategory").map((ele) => ele.title),
      ]);
    } else if (filters?.filters?.length > 0) {
      selected_filters([
        ...filters?.filters?.categories.slice(0, 1).map(({ sub_category_id }) => sub_category_id),
        ...filters?.filters?.checkbox.slice(0, 2).map(({ title }) => title),
      ]);
    }
  }, [slug, slug2]);

  const generateFilterInputs = async (urlParamsObj, slugPart1) => {
    const { subSubCatSelected } = await getSubSubCatData();
    const queryObj = Object.fromEntries([...urlParamsObj.entries()]);

    const filtered_items = Object.entries(queryObj)
      .map(([key, value]) => ({
        title: key,
        value: value.split(",").map((ele) => ele.split("_")[0]),
      }))
      .filter(({ title }) => title !== "min" && title !== "max");

    const SearchInput = filtered_items.filter(({ title }) => title !== "subcategory");

    const price_range = Object.entries(queryObj).reduce((acc, [key, value]) => {
      if (key === "min" || key === "max") acc[key] = [value];
      return acc;
    }, {});
    const priceInput = Object.keys(price_range).length ? [price_range] : [];

    let arr = [];
    const sub_cat_array = filtered_items.filter(
      ({ title }) => title === "subcategory" || title === "subsubcategory"
    );

    if (sub_cat_array.length === 0 && subSubCatSelected) {
      if (slugPart1 !== undefined) {
        const data = subSubCatSelected.data?.sub_subcategory?.find(({ url }) => {
          const urlParts = url.split("/");
          const lastPart = urlParts[urlParts.length - 1];
          return lastPart === slugPart1 || urlParts[1] === slugPart1 || url === slugPart1;
        });
        if (data) {
          arr = [{ title: "subsubcategory", value: [data.sub_subcategory_id] }];
        }
      } else {
        arr = [{ title: "subcategory", value: [subSubCatSelected.id] }];
      }
    }
    return { filtered_items, SearchInput, priceInput, subCategoryArray: arr };
  };

  const getInputData = async () => {
    const { filtered_items, SearchInput, priceInput, subCategoryArray } =
      await generateFilterInputs(urlParams, slug1);

    let input_data = {};
    if (pathname.includes("brands")) {
      input_data = {
        ...(slug && { slug }),
        filtered_items: [{ title: "brands", value: [slug] }, ...filtered_items],
        ...(priceInput.length > 0 && { price_range: priceInput }),
        limit: 50,
      };
    } else if (pathname.includes("search-result")) {
      input_data = {
        filtered_items,
        searchString: slug,
        ...(priceInput.length > 0 && { price_range: priceInput }),
        subcategory_id: "search",
        limit: 50,
      };
    } else if (pathname.includes("products-subcategory")) {
      input_data = {
        ...(slug && { slug }),
        ...(slug1 && { slug1 }),
        filtered_items: [...filtered_items, ...subCategoryArray],
        ...(priceInput.length > 0 && { price_range: priceInput }),
        searchString: slug,
        limit: 50,
      };
    } else {
      input_data = {
        ...(slug && { slug }),
        ...(slug1 && { slug1 }),
        filtered_items: [...filtered_items, ...subCategoryArray],
        ...(priceInput.length > 0 && { price_range: priceInput }),
        limit: 50,
      };
    }
    return input_data;
  };

  useEffect(() => {
    dispatch(sethas_more(true));
    setCurrentPage(0);
    getNextPageData(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, slug1, slug2, searchParams.toString()]);

  const [totalCount, setTotalCount] = useState(0);
  
  const getNextPageData = async (forcedPage) => {
    const nextPage = forcedPage ?? page;
    const input_data = await getInputData();
    const res = await getSubCatScreenList({ ...input_data, page: nextPage });
    setTotalCount(res?.display_items?.total_count);
    setCurrentPage((prev) => (forcedPage != null ? nextPage + 1 : prev + 1));
  };

  // Debounced version of getNextPageData to prevent multiple rapid calls
  const debouncedGetNextPageData = useMemo(
    () => debounce(getNextPageData, 300),
    [getNextPageData, debounce]
  );

  useEffect(() => {
    if (displayed_products?.length >= totalCount) {
      dispatch(sethas_more(false));
    } else {
      dispatch(sethas_more(true));
    }
  }, [displayed_products, totalCount, dispatch]);

  const fetchTitle = (item) => {
    let queryObj = {};
    for (const entry of urlParams.entries()) {
      queryObj = Object.fromEntries([...urlParams]);
    }
    const finalInput = Object.entries(queryObj).map(([key, value]) => ({
      title: key,
      value:
        key == "subsubcategory" || key == "subcategory"
          ? value.split(",").map((ele) => ele)
          : value.split(",").map((ele) => ele.split("_")[0]),
    }));

    return finalInput
      .map((ele) => {
        if (ele.value.includes(item)) {
          return { title: ele.title, value: item };
        }
      })
      .filter((v) => v != undefined);
  };

  const deleteItem = (item) => {
    setCurrentPage(0);
    dispatch(sethas_more(true));
    const value = fetchTitle(item);
    setselected_items(selected_items.filter((ele) => ele != item));
    const ParamsValue = urlParams.get(value[0]?.title);
    const paramsArray = ParamsValue.split(",");
    const filteredArray = paramsArray.filter((ele) => ele !== value[0].value);
    urlParams.set(value[0].title, filteredArray.toString());
    if (filteredArray.length <= 0) urlParams.delete(value[0].title);
    setUrlParams(urlParams);
  };

  const deletePriceRange = () => {
    setCurrentPage(0);
    dispatch(sethas_more(true));
    urlParams.delete("min");
    urlParams.delete("max");
    setUrlParams(new URLSearchParams(urlParams));
    setselected_items(
      selected_items.filter((item) => !item.includes("price") && !item.includes("min") && !item.includes("max"))
    );
    setPriceRangeKey((prev) => prev + 1);
    getNextPageData(0);
  };

  const clear_all = async () => {
    let queryObj = {};
    for (const entry of urlParams.entries()) {
      queryObj = Object.fromEntries([...urlParams]);
    }
    const finalInput = Object.entries(queryObj).map(([key]) => ({ title: key }));
    finalInput.forEach((ele) => {
      urlParams.delete(ele.title);
      urlParams.delete("subsubcategory");
    });
    setUrlParams(new URLSearchParams(urlParams));
    setselected_items([]);
    setShow(false);
  };

  const apply_all = async () => {
    setUrlParams(urlParams);
    if (selected_items.length > 0) setshow_filters(true);
    setShow(false);
  };

  useEffect(() => {
    let eventData = {};
    if (categorytype === "products-category") {
      eventData = { subcategory_name: subcatdatass?.title };
    } else if (categorytype === "products-subcategory") {
      eventData = { subcategory2_name: subsubcategory };
    }
    pushToDataLayer("viewed_category_page", currentcountry.name, eventData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [openCategory, SetOpenCategory] = useState(true);
  const handleCategoryToggle = () => SetOpenCategory(!openCategory);

  // ----- Tailwind "Modal" shells -----
  const Overlay = ({ children, onClose, center = false }) => (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`${center ? "" : "h-full w-full"} relative`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );

  return (
    <>
      <div className="w-full pt-2 pb-3 px-3">
        {/* Breadcrumbs */}
        {!isMobile &&
          (categorytype === "products-category" ? (
            <BreadComps
              title0={catdata[0]?.category_name}
              link0={catdata[0]?.url}
              activetitle={subcatdatass?.title}
            />
          ) : categorytype === "products-subcategory" ? (
            <BreadComps
              title0={catdata[0]?.category_name}
              link0={catdata[0]?.url}
              title1={subcatdatass?.title}
              link1={subcatdatass?.url}
              activetitle={subsubcategory}
            />
          ) : null)}

        {/* Main grid */}
        <div className="mt-3 grid grid-cols-12 gap-4">
          {/* Left: Filters (desktop) */}
          <div className="hidden lg:block col-span-12 lg:col-span-3">
            {!isMobile && (
              <>
                <h5 className="text-lg font-semibold mb-2">Filters</h5>
                <hr />

                {/* Category */}
                <div
                  onClick={handleCategoryToggle}
                  className="cursor-pointer flex items-center justify-between mb-3 mt-1.5"
                >
                  <h5 className="mb-0 text-base font-semibold">Category</h5>
                </div>

                <div className="border-b pb-3 mb-3">
                  {filters?.filters?.categories
                    ?.filter((cat) => Array.isArray(cat.children) && cat.children.length > 0)
                    .map((cat) => (
                      <div
                        className="pb-2"
                        onClick={() => handleSelectFilter(cat.sub_category_id || cat.category_id)}
                        key={cat.sub_category_id}
                      >
                        <div className="flex items-center justify-between mb-3 cursor-pointer">
                          <h5 className="mb-0 text-[15px] font-medium">{cat.label}</h5>
                          {selected.includes(cat.sub_category_id || cat.category_id) ? (
                            <img src="/assets/vector_icons/arrow_up.png" />
                          ) : (
                            <img src="/assets/vector_icons/arrow_down.png" />
                          )}
                        </div>

                        {selected.includes(cat.sub_category_id || cat.category_id) &&
                          cat.children.map((child) => (
                            <div
                              className="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 rounded filter_item"
                              onClick={(e) => handleSelectItem(e, "subsubcategory", child)}
                              key={child.value}
                            >
                              <input
                                type="checkbox"
                                className="form-checkbox"
                                checked={selected_items.includes(child.value.split("@")[0])}
                                readOnly
                              />
                              <span className="text-sm">{child.label}</span>
                            </div>
                          ))}
                      </div>
                    ))}
                </div>

                {/* Price Range */}
                {filters?.filters?.slider_range.length > 0 && (
                  <Pricerange
                    key={priceRangeKey}
                    urlParams={urlParams}
                    setUrlParams={setUrlParams}
                    currency={currentcountry.currency}
                    max_value={filters?.filters?.slider_range[0].max_value}
                    min_value={filters?.filters?.slider_range[0].min_value}
                  />
                )}

                {/* Checkbox groups */}
                {filters?.filters?.checkbox.map((cat) => {
                  const isSelected = selected.includes(cat.title);
                  const searchValue = searchInputs[cat.title] || "";

                  const filteredList =
                    isSelected && Array.isArray(cat.list)
                      ? cat.list.filter((child) => child?.name?.toLowerCase().includes(searchValue))
                      : [];

                  const visibleList = limited_items.includes(cat.title)
                    ? filteredList
                    : filteredList.slice(0, 5);

                  return (
                    <div className="pb-4 border-b" key={cat.title}>
                      <div
                        className="flex items-center justify-between mb-3 cursor-pointer"
                        onClick={() => handleSelectFilter(cat.title)}
                      >
                        <h5 className="mb-0 text-base font-semibold">{cat.title}</h5>
                        <img
                          src={isSelected ? "/assets/vector_icons/arrow_up.png" : "/assets/vector_icons/arrow_down.png"}
                          alt="arrow"
                        />
                      </div>

                      {isSelected && (
                        <div className="relative mb-2">
                          <input
                            type="text"
                            placeholder="Search"
                            className="w-full rounded border border-gray-300 py-2 pl-3 pr-9 text-sm"
                            value={searchInputs[cat.title] || ""}
                            onChange={(e) => {
                              e.stopPropagation();
                              setSearchInputs({
                                ...searchInputs,
                                [cat.title]: e.target.value.toLowerCase(),
                              });
                            }}
                          />
                          <img
                            src="/assets/vector_icons/filtersearch.png"
                            alt="Search"
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                          />
                        </div>
                      )}

                      {isSelected &&
                        visibleList.map((child) => (
                          <div
                            className="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 rounded"
                            key={child.name}
                            onClick={(e) =>
                              handleSelectItem(e, cat.title, { value: `${child.name}@${cat.title}` })
                            }
                          >
                            <input
                              type="checkbox"
                              className="form-checkbox"
                              checked={selected_items.includes(child.name)}
                              readOnly
                            />
                            <span className="text-sm">{child.name}</span>
                          </div>
                        ))}

                      {isSelected && filteredList.length > 8 && (
                        <h6
                          className="mt-2 text-sm text-indigo-600 cursor-pointer"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleSelectedAll(event, cat.title);
                          }}
                        >
                          {limited_items.includes(cat.title) ? "See less" : "See all"}
                        </h6>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* Right: Content */}
          <div className="col-span-12 lg:col-span-9">
            {/* Banners - Full width of right column */}
            {!catloading && filters?.display_items?.hasOwnProperty("banners") ? (
              isMobile ? (
                <div className="mb-3">
                  <HomeMobileCarousel carousel_data={filters.display_items.banners} />
                </div>
              ) : (
                <div className="mb-3">
                  <HomeCarousel carousel_data={filters.display_items.banners} searchPage={true} />
                </div>
              )
            ) : (
              <div className="mb-3">
                <HomeBannerPlaceholder height={isMobile ? 125 : 250} />
              </div>
            )}

            <div className="grid grid-cols-12 gap-3">

              {/* Subcategories */}
              {slug1 == undefined &&
                !pathname.split("/").includes("brands") &&
                !pathname.split("/").includes("search-result") &&
                (!categoryloading ? (
                  (() => {
                    const subCategories = categoryList && categoryList.length > 0
                      ? categoryList
                          .map((item) => item?.subcategory)
                          .flat()
                          .filter(({ url }) => url == slug)[0]?.sub_subcategory || []
                      : [];
                    
                    return subCategories.length > 0 ? (
                      <div className="col-span-12">
                        <div className="component_1 cat_carousel">
                          <ComponentHeader title={"Shop by Sub-Categories"} view_all={"rgba(82, 50, 194, 1)"} />
                          <HomeCategories
                            category_list={subCategories}
                            type={slug1 == undefined ? 5 : 3}
                          />
                        </div>
                      </div>
                    ) : null;
                  })()
                ) : (
                  <>
                    {[1, 2, 3, 4, 5, 6].map((product, i) => (
                      <div className="col-span-6 md:col-span-4 lg:col-span-2 mb-4" key={i}>
                        <SubcategoryPlaceHolder />
                      </div>
                    ))}
                  </>
                ))}

              {/* Selected chips + Sort */}
              <div className="col-span-12 flex flex-col md:flex-row md:items-center md:justify-between">
                {/* Selected filters chips */}
                {!catloading && (isMobile ? show_filters : true) && (
                  <div className="flex flex-wrap gap-2 mb-3 md:mb-0">
                    {selected_items.map((item) => {
                      const [subId, catId] = item?.split("-");
                      let data = null;
                      if (filters?.filters?.categories?.length > 0) {
                        if (pathname.split("/").includes("search-result")) {
                          const category = filters?.filters?.categories.find((c) => String(c.categoryid) === catId)
                            ?.children;
                          data = category?.find((c) => String(c.subcategoryid) === subId);
                        } else {
                          data = filters?.filters?.categories
                            .filter((cat) => String(cat.subcategoryid) === catId)
                            .flatMap((cat) => cat.children)
                            .find((child) => String(child.subsubcategoryid) === subId);
                        }
                      }
                      return (
                        data && (
                          <button
                            key={item}
                            className="flex items-center gap-2 rounded-full bg-gray-100 hover:bg-gray-200 px-3 py-1"
                            onClick={() => deleteItem(item)}
                          >
                            <span className="text-sm">{data.label}</span>
                            <IoCloseOutline size={18} />
                          </button>
                        )
                      );
                    })}

                    {/* Price range chip */}
                    {(() => {
                      const minPrice = urlParams.get("min");
                      const maxPrice = urlParams.get("max");
                      if (minPrice || maxPrice) {
                        const currency = currentcountry?.currency || "";
                        let priceLabel = "";
                        if (minPrice && maxPrice) {
                          priceLabel = `Price: ${currency} ${minPrice} - ${currency} ${maxPrice}`;
                        } else if (minPrice) {
                          priceLabel = `Min Price: ${currency} ${minPrice}`;
                        } else if (maxPrice) {
                          priceLabel = `Max Price: ${currency} ${maxPrice}`;
                        }
                        return (
                          <button
                            key="price-range"
                            className="flex items-center gap-2 rounded-full bg-gray-100 hover:bg-gray-200 px-3 py-1"
                            onClick={() => deletePriceRange()}
                          >
                            <span className="text-sm">{priceLabel}</span>
                            <IoCloseOutline size={18} />
                          </button>
                        );
                      }
                      return null;
                    })()}
                  </div>
                )}

                {/* Desktop Sort dropdown */}
                {!isMobile && (
                  <div ref={sortDropdownRef} className="relative">
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm text-gray-700">Sort by</h5>
                      <button
                        className="dropdown_title inline-flex items-center gap-2 rounded border px-3 py-2 text-sm"
                        onClick={() => setsort_show_desktop(!sort_show_desktop)}
                      >
                        <span className="mb-0">
                          {selected_items.filter((value) =>
                            sort_byArray.map(({ slug }) => slug).flat().includes(value)
                          ) != ""
                            ? selected_items.filter((value) =>
                                sort_byArray.map(({ slug }) => slug).flat().includes(value)
                              )
                            : sort_byArray[0].title}
                        </span>
                        <img src="/assets/vector_icons/arrow_down.png" width={20} height={20} />
                      </button>
                    </div>

                    {sort_show_desktop && (
                      <div className="absolute right-0 mt-2 w-56 rounded-lg border bg-white p-3 shadow-lg z-[60]">
                        {sort_byArray.map((child) => (
                          <button
                            key={child.id}
                            className={`w-full text-left mb-2 text-sm ${
                              selected_items.includes(child.slug) ? "text-indigo-600 font-semibold" : "font-normal"
                            }`}
                            onClick={(e) => {
                              setsort_show_desktop(false);
                              handleSelectItem(e, "sortby", { value: child.slug + "@sortby" });
                            }}
                          >
                            {child.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Total count */}
              {!catloading && filters?.display_items?.total_count !== undefined && (
                <div className="col-span-12">
                  <h6 className="mb-0 text-xl font-semibold">
                    Products ({filters.display_items.total_count})
                  </h6>
                </div>
              )}

              {/* Products grid */}
              <div className="col-span-12">
                {!catloading ? (
                  displayed_products.length > 0 ? (
                    <>
                      <div className="grid grid-cols-12 gap-2 md:gap-3 mb-4">
                        {displayed_products.map((product) => (
                          <div
                            className="col-span-6 sm:col-span-6 md:col-span-4 lg:col-span-3"
                            key={product.url}
                          >
                            <Link href={`/details/${product.url}`} className="no-underline">
                              <ProductCard item={product} />
                            </Link>
                          </div>
                        ))}
                      </div>

                      {has_more && displayed_products.length > 0 && (
                        <div className="flex justify-center">
                          <LoadMoreButton onClick={() => debouncedGetNextPageData()} />
                        </div>
                      )}
                    </>
                  ) : !has_more ? (
                    <div className="flex items-center justify-center py-20">
                      <h4 className="text-lg">We're lining up great choices for you — Check back soon.</h4>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-20">
                      <h4>
                        <Loader />
                      </h4>
                    </div>
                  )
                ) : (
                  <div className="grid grid-cols-12 gap-3">
                    {[1, 2, 3, 4, 5].map((idx) => (
                      <div key={idx} className="col-span-6 md:col-span-4 lg:col-span-3 mb-4">
                        <ProductCardPlaceHolder />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filters Modal */}
        {show && (
          <Overlay onClose={() => setShow(false)}>
            <div className="bg-white h-full w-full flex flex-col">
              <div className="flex items-center justify-between border-b p-4">
                <h4 className="text-lg font-semibold">Filters</h4>
                <img
                  src="/assets/vector_icons/close.png"
                  width={16}
                  height={16}
                  className="cursor-pointer"
                  onClick={() => setShow(false)}
                />
              </div>

              <div className="flex-1 overflow-hidden flex">
                {/* left list */}
                <div className="w-40 border-r overflow-y-auto">
                  {!catloading && (
                    <>
                      {filters?.filters?.categories.map((cat) => (
                        <div
                          key={cat.sub_category_id || cat.category_id}
                          className={`flex items-center justify-between px-3 py-3 cursor-pointer ${
                            (mobile_selected == cat.sub_category_id || mobile_selected == cat.category_id) &&
                            "border-l-4 border-indigo-600 bg-white"
                          }`}
                          onClick={() => handleMobileSelectFilter(cat.sub_category_id || cat.category_id)}
                        >
                          <h5
                            className={`text-sm ${
                              (mobile_selected == cat.sub_category_id || mobile_selected == cat.category_id) &&
                              "text-indigo-600 font-semibold"
                            }`}
                          >
                            {cat.label}
                          </h5>
                          <img
                            alt="arrow"
                            src="/assets/vector_icons/arrow_up_2.png"
                            className={`w-[15px] h-[15px] transition-transform ${
                              mobile_selected === cat.sub_category_id || mobile_selected === cat.category_id
                                ? "rotate-90"
                                : "rotate-0"
                            }`}
                          />
                        </div>
                      ))}

                      {filters?.filters?.checkbox.map((cat) => (
                        <div
                          key={cat.title}
                          className={`flex items-center justify-between px-3 py-3 cursor-pointer ${
                            mobile_selected == cat.title && "border-l-4 border-indigo-600 bg-white"
                          }`}
                          onClick={() => handleMobileSelectFilter(cat.title)}
                        >
                          <h5 className="text-sm font-semibold">{cat.title}</h5>
                          <img
                            src={
                              mobile_selected == cat.title
                                ? "/assets/vector_icons/arrow_up_2.png"
                                : "/assets/vector_icons/arrow_down.png"
                            }
                            className="w-[15px] h-[15px]"
                          />
                        </div>
                      ))}
                    </>
                  )}
                </div>

                {/* right list */}
                <div className="flex-1 overflow-y-auto p-3">
                  {!catloading &&
                    filters?.filters?.categories
                      .filter(
                        (ele) => ele.sub_category_id == mobile_selected || ele.category_id == mobile_selected
                      )
                      .slice(0, 1)
                      .flatMap((ele) => ele.children)
                      .map((child) => (
                        <label
                          className="flex items-center justify-between px-2 py-2 cursor-pointer hover:bg-gray-50 rounded"
                          key={child.value}
                          onClick={(e) => handleSelectItem(e, "subsubcategory", child)}
                        >
                          <span className="text-sm">{child.label}</span>
                          <input
                            type="checkbox"
                            checked={selected_items.includes(child.value.split("@")[0])}
                            readOnly
                          />
                        </label>
                      ))}

                  {!catloading &&
                    filters?.filters?.checkbox
                      .filter((ele) => ele.title == mobile_selected)
                      .slice(0, 1)
                      .flatMap((ele) => ele.list)
                      .map((child) => (
                        <label
                          className="flex items-center justify-between px-2 py-2 cursor-pointer hover:bg-gray-50 rounded"
                          key={child.name}
                          onClick={(e) =>
                            handleSelectItem(e, mobile_selected, {
                              value:
                                child.name +
                                "@" +
                                subcategoryScreen.filters.checkbox.filter((ele) => ele.title == mobile_selected)[0]
                                  .title,
                            })
                          }
                        >
                          <span className="text-sm">{child.name}</span>
                          <input type="checkbox" checked={selected_items.includes(child.name)} readOnly />
                        </label>
                      ))}
                </div>
              </div>

              {isMobile && (
                <div className="flex justify-between gap-3 p-3 border-t">
                  <button
                    className="w-1/2 rounded-md border border-gray-300 py-2 text-sm font-medium"
                    onClick={clear_all}
                  >
                    Clear All
                  </button>
                  <button
                    className="w-1/2 rounded-md bg-indigo-600 text-white py-2 text-sm font-medium"
                    onClick={apply_all}
                  >
                    Apply Now
                  </button>
                </div>
              )}
            </div>
          </Overlay>
        )}

        {/* Mobile Sort Modal */}
        {sort_show && (
          <Overlay onClose={() => setsort_show(false)} center>
            <div className="bg-white w-[92vw] max-w-md rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between border-b p-4">
                <h4 className="text-lg font-semibold">Sort By</h4>
                <img
                  src="/assets/vector_icons/close.png"
                  width={16}
                  height={16}
                  className="cursor-pointer"
                  onClick={() => setsort_show(false)}
                />
              </div>
              <div className="p-0">
                {sort_byArray.map((child) => (
                  <button
                    key={child.id}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left ${
                      selected_items.includes(child.slug) ? "bg-indigo-50" : ""
                    }`}
                    onClick={(e) => handleSelectItem(e, "sortby", { value: child.slug + "@sortby" })}
                  >
                    <span
                      className={`text-sm ${
                        selected_items.includes(child.slug) ? "text-indigo-600 font-semibold" : ""
                      }`}
                    >
                      {child.title}
                    </span>
                    <input type="radio" checked={selected_items.includes(child.slug)} readOnly name="sort_by" />
                  </button>
                ))}
              </div>
            </div>
          </Overlay>
        )}
      </div>

      {/* Back to top */}
      {showBackToTop && (
        <div className="fixed bottom-4 right-4 z-[120]">
          <button
            className="bg-[#43494B] text-white rounded-full p-2 flex items-center justify-center"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <FaChevronUp size={20} />
          </button>
        </div>
      )}

      {/* Mobile bottom bar */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-[111] bg-white border-t flex">
          <button
            className="flex-1 flex items-center justify-center gap-2 py-3 border-r"
            onClick={() => setsort_show(true)}
          >
            <img src="/assets/vector_icons/swap.png" />
            <span className="text-sm">Sort By</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3" onClick={() => setShow(true)}>
            <img src="/assets/vector_icons/filter.png" />
            <span className="text-sm">Filter</span>
          </button>
        </div>
      )}
    </>
  );
};

export default memo(ProductCategory);