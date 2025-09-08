"use client";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/hooks";
import { normalizeUrl } from "@/components/utils/helpers";
import multi_countries from "@/json_data/multi_countries.js";

// Redux Actions - Update these import paths according to your structure
import {
  getnavigation,
  setcountryDropdown,
  setcurrentcountry,
} from "@/redux/globalslice";
import { getalladdressesapi } from "@/redux/addresslice";
import { GetPlaceOrderapi } from "@/redux/paymentslice";
import {
  getbannerList,
  getdeal_offersList,
  getDealOfTheDayList,
  getbundle_clearance_sale,
  getSaverZoneList,
  getTopSellingList,
  getTopPicksList,
  getbrand_week,
} from "@/redux/homeslice";
import {
  setauthstatus,
  setlogindata,
  setformmodal,
  setformstatus,
} from "@/redux/formslice";
import { cartlistapi, getWishLists } from "@/redux/cartslice";

export default function AppInitializer() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { logout } = useAuth();
  const [jwtToken, setJwtToken] = useState(null);

  // Redux State Selectors
  const authstatus = useSelector((state) => state?.formslice?.authstatus);
  const countryDropdown = useSelector(
    (state) => state.globalslice.countryDropdown
  );
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const logindata = useSelector((state) => state?.formslice?.logindata);

  // Track JWT token changes
  useEffect(() => {
    const token = Cookies.get("jwt_token");
    setJwtToken(token);
  }, []);

  // UTM storage logic (runs once on client side)
  useEffect(() => {
    const storeUTMParams = () => {
      const params = new URLSearchParams(window.location.search);
      const utm = {
        utm_source: params.get("utm_source") || "direct",
        utm_medium: params.get("utm_medium") || "none",
        utm_campaign: params.get("utm_campaign") || "default_campaign",
        utm_content: params.get("utm_content") || "default_content",
        landing: pathname,
      };

      // Only set if not already set (first visit/session)
      if (!localStorage.getItem("utm_source")) {
        localStorage.setItem("events", JSON.stringify(utm));
      }
    };

    storeUTMParams();
  }, [pathname]);

  // On App Load: Set Auth Status and Login Data from JWT Token if exists
  useMemo(() => {
    const token = Cookies.get("jwt_token");
    if (token !== undefined) {
      dispatch(setauthstatus(true));
      dispatch(setlogindata(jwtDecode(token)));
    }
  }, [dispatch]);

  // On App Load: Set Country Dropdown Data from JSON (multicountries.json)
  useEffect(() => {
    dispatch(setcountryDropdown(multi_countries));
    // Parse localStorage events if needed
    const events = localStorage.getItem("events");
    if (events) {
      JSON.parse(events);
    }
  }, [dispatch]);

  // Set Current Country Based on URL and Country List
  useEffect(() => {
    // based on url we taking the current country from multi_countries.json file
    // normalizeUrl function is for formatting the url like sometimes https://www.ourshopee.com,
    // sometimes https://ourshopee.com user goes with this any url we have to come here only thats why we formatting
    if (countryDropdown.length > 0) {
      let data;
      if (process.env.NODE_ENV === "development") {
        data = countryDropdown.find(
          ({ dev_url }) => dev_url === window.location.origin
        );
      } else {
        data = countryDropdown.find(
          ({ url }) => url === normalizeUrl(window.location.origin)
        );
      }
      dispatch(setcurrentcountry(data));
    }
  }, [countryDropdown, dispatch]);

  // Global Axios Response Interceptor: Handle 401 Errors (Session Expiry)
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
        if (error.response?.status === 401) {
          logout();
          dispatch(setformmodal(true));
          dispatch(setformstatus(1));
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [logout, dispatch]);

  // On App Load: Fetch All Navigation & Home Page Data Lists(APIs)
  useMemo(() => {
    dispatch(getnavigation());
    dispatch(getbannerList());
    dispatch(getdeal_offersList());
    dispatch(getSaverZoneList());
    dispatch(getTopSellingList());
    dispatch(getDealOfTheDayList());
    dispatch(getTopPicksList());
    dispatch(getbrand_week());
    dispatch(getbundle_clearance_sale());
  }, [dispatch]);

  // On App Load: Again Validate JWT and Set Login Data (second validation as in original)
  useEffect(() => {
    const token = Cookies.get("jwt_token");
    if (token) {
      dispatch(setauthstatus(true));
      dispatch(setlogindata(jwtDecode(token)));
    }
  }, [dispatch]);

  // After JWT Token Change: Call Cart List API (Pass UserID or Cart IP)
  useEffect(() => {
    const token = Cookies.get("jwt_token");
    const input_data = {
      ip_address: token !== undefined ? 0 : Cookies.get("cart_ip_address"),
      user_id: token !== undefined ? jwtDecode(token).user_id : 0,
    };
    dispatch(cartlistapi(input_data));
  }, [jwtToken, dispatch]); // Using jwtToken state to track changes

  // When Auth Status Changes: Fetch User's Address, Wishlist, and Order Info
  useMemo(() => {
    if (authstatus && logindata?.user_id) {
      dispatch(getalladdressesapi(0));
      dispatch(getWishLists());
      dispatch(GetPlaceOrderapi(logindata.user_id));
    }
  }, [authstatus, logindata, dispatch]);

  // Function: Dynamically Load Google Tag Manager Based on Current Country's Tag ID
  const loadGTM = (id) => {
    // Check if GTM script already exists to prevent duplicates
    const existingScript = document.querySelector(
      `script[src*="googletagmanager.com/gtm.js?id=${id}"]`
    );
    if (existingScript) return;

    const script = document.createElement("script");
    script.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;
      j.src='https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}');
    `;
    document.head.appendChild(script);

    const noscript = document.createElement("noscript");
    noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${id}"
      height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
    document.body.insertBefore(noscript, document.body.firstChild);
  };

  // Load GTM Script When Current Country Info is Available
  useEffect(() => {
    if (Object.keys(currentcountry).length > 0 && currentcountry.gtm_tag) {
      loadGTM(currentcountry.gtm_tag);
    }
  }, [currentcountry]);

  // This component doesn't render anything, it just handles initialization
  return null;
}
