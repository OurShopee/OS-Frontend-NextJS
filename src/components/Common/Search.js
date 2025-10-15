"use client";
import React, { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { GoArrowUpLeft } from "react-icons/go";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { usePathname, useRouter } from "next/navigation";
import { pushToDataLayer } from "../utils/dataUserpush";
import { Category } from "@/actions";
import { setcurrent_page } from "@/redux/categoryslice";
import { searchapi } from "@/api/products";

const Search = () => {
  const { getSubCatScreenList, filtered_items } = Category();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = usePathname()
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const [isFocused, setIsFocused] = useState(false);
  const smallcsreen = useMediaQuery({ query: "(max-width: 991px)" });
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    if (!location.startsWith("/search-result")) {
      setSearchQuery("");
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [location]); 

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowDropdown(false);
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      const pageName =
        typeof window !== "undefined" ? window.location.pathname : "";
      const term = searchQuery;
      pushToDataLayer(
        "clicked_search",
        currentcountry.name,
        {
          search_query: searchQuery,
          page_name: pageName,
          // user_id: user_id,
          term: term,
        },
        false
      );
      dispatch(setcurrent_page(0));
      getSubCatScreenList({
        page: 0,
        searchString: searchQuery,
        filtered_items: [],
      });
      router.push(`/search-result/${searchQuery}`);
      if (searchResults.length > 0) {
        // alert()
        if (!searchQuery.trim()) return;
        // Push event to GTM Data Layer
        if (searchResults[0].hasOwnProperty("url")) {
          router.push(searchResults[0].url);
        } else {
          router.push(`/search-result/${event.target.value}`);
        }
        setShowDropdown(false);
      }
    }
  };

  const handleSearch = (event) => {
    if (searchResults.length > 0) {
      // alert()
      if (!searchQuery.trim()) return;
      const pageName =
        typeof window !== "undefined" ? window.location.pathname : "";
      // const user_id = localStorage.getItem("user_id") || "guest";
      const term = searchQuery;
      // Push event to GTM Data Layer
      pushToDataLayer(
        "clicked_search",
        currentcountry.name,
        {
          search_query: searchQuery,
          page_name: pageName,
          // user_id: user_id,
          term: term,
        },
        false
      );
      if (searchResults[0].hasOwnProperty("url")) {
        router.push(searchResults[0].url);
      } else {
        router.push(`/search-result/${searchQuery}`);
      }
    }
  };
  // "searchString": slug,

  useEffect(() => {
    const fetchResults = async () => {
      if (searchQuery.length > 1) {
        try {
          const results = await searchapi(searchQuery);
          setSearchResults(results?.data?.products || []);
          setShowDropdown(true);
        } catch (error) {
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    };

    fetchResults(); // Call API immediately when `searchQuery` changes
  }, [searchQuery]);

  const handlenavigate = (item) => {
    console.log("clicked_item", item);
    if (item?.url) {
      if (item.type === "detail") {
        router.push(`/details/${item.url}`);
      } else if (item.type === "search_redirect") {
        router.push(item.url); // this is already in /brands/... format
      } else if (item.type === "subcategory") {
        router.push(`${item.url}`);
      } else if (item.type === "brands") {
        router.push(`${item.url}`);
      } else {
        router.push(
          `/search-result/${item.title}?subcategory=${item.subcategory_id}_${item.category_id}`
        );
      }
    } else {
      router.push(
        `/search-result/${item.title}?subcategory=${item.subcategory_id}_${item.category_id}`
      );
    }
  };

  // Function to highlight search term in results
  const highlightMatch = (text) => {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${searchQuery})`, "gi");
    return text.replace(regex, `<span class="highlight">${searchQuery}</span>`);
  };

  return (
    <div
      className="flex header-searchmain relative"
      onMouseEnter={() => searchResults.length > 0 && setShowDropdown(true)}
      onMouseLeave={() => setShowDropdown(false)}
    >
      <input
        type="text"
        placeholder="What are you looking for?"
        className="header-inputbox w-[350px] text-black"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => {
          setIsFocused(true);
          searchResults.length > 0 && setShowDropdown(true);
        }}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          setIsFocused(false);
          setTimeout(() => setShowDropdown(false), 200);
        }}
      />
      <div className="header-search secondarybackground" onClick={handleSearch}>
        <img src={"/assets/vector_icons/search.png"} />
      </div>
      {smallcsreen && (searchQuery || isFocused) && (
        <div className="searchcanclebtn" onClick={clearSearch}>
          Cancel <MdClose size={10} className="ml-1" />
        </div>
      )}
      {/* Search Dropdown */}
      {showDropdown && (
        <div
          className="search-dropdown p-3"
          onMouseEnter={() => setShowDropdown(true)}
          // onMouseLeave={() => setShowDropdown(false)}
        >
          {searchResults.length > 0 ? (
            searchResults.map((item) => (
              <div
                key={item.url}
                className="search-item flex items-center"
                onClick={() => handlenavigate(item)}
              >
                <div className="flex justify-between items-start w-full">
                  <div className="flex items-start">
                    <div
                      style={{ width: "23px", height: "20px" }}
                      className="flex items-center justify-center mt-1"
                    >
                      <IoSearch size={16} className="iconcolor" />
                    </div>
                    <div className="ml-2">
                      {item.hasOwnProperty("title") ? (
                        <div
                          className="search-title"
                          style={{ width: "100%" }}
                          dangerouslySetInnerHTML={{
                            __html: highlightMatch(item.title),
                          }}
                        />
                      ) : (
                        <div>no tilte</div>
                      )}

                      <div className="search-title">{item.small_title}</div>
                    </div>
                  </div>
                  <div
                    style={{ width: "23px", height: "20px" }}
                    className="flex items-center justify-center mt-1"
                  >
                    <GoArrowUpLeft size={16} className="iconcolor mt-1" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="search-item">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
