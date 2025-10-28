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
  }, [authstatus]);

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
  // useMemo(() => {
  //   const token = Cookies.get("jwt_token");
  //   if (token !== undefined) {
  //     dispatch(setauthstatus(true));
  //     dispatch(setlogindata(jwtDecode(token)));
  //   }
  // }, [dispatch]);

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
      if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
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

  // On App Load: Fetch Navigation Data (Always needed)
  useMemo(() => {
    dispatch(getnavigation());
  }, [dispatch]);

  // Load Homepage APIs only when on homepage
  useMemo(() => {
    if (pathname === '/') {
      dispatch(getbannerList());
      dispatch(getTopPicksList());
      dispatch(getbrand_week());
    }
  }, [dispatch, pathname]);

  useEffect(() => {
    const token = Cookies.get("jwt_token");
    if (token) {
      dispatch(setauthstatus(true));
      dispatch(setlogindata(jwtDecode(token)));
    }
  }, [dispatch]);

  useEffect(() => {
    const token = Cookies.get("jwt_token");
    const input_data = {
      ip_address: token !== undefined ? 0 : Cookies.get("cart_ip_address"),
      user_id: token !== undefined ? jwtDecode(token).user_id : 0,
    };
    dispatch(cartlistapi(input_data));
  }, [jwtToken]); 

  useMemo(() => {
    if (authstatus) {
      dispatch(getalladdressesapi(0));
      dispatch(getWishLists());
      dispatch(GetPlaceOrderapi(logindata.user_id));
    }
  }, [authstatus]);

  // Function: Load Google Tag Manager (GTM) - Different for each country
  const loadGTM = (gtmContainerId) => {
    // Check if GTM script already exists to prevent duplicates
    const existingGtmScript = document.querySelector(
      `script[src*="googletagmanager.com/gtm.js?id=${gtmContainerId}"]`
    );
    if (existingGtmScript) return;

    // Initialize dataLayer for GTM
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });

    // Load GTM script
    const gtmScript = document.createElement('script');
    gtmScript.async = true;
    gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${gtmContainerId}`;
    document.head.appendChild(gtmScript);

    // Add GTM noscript iframe for cases where JavaScript is disabled
    const gtmNoscript = document.createElement('noscript');
    gtmNoscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmContainerId}" 
      height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
    document.body.insertBefore(gtmNoscript, document.body.firstChild);
    
    console.log("GTM initialized with Container ID:", gtmContainerId);
  };

  // Function: Load Google Analytics 4 (GA4) - Same for all regions
  const loadGA4 = (ga4MeasurementId) => {
    // Check if GA4 script already exists to prevent duplicates
    const existingGa4Script = document.querySelector(
      `script[src*="googletagmanager.com/gtag/js?id=${ga4MeasurementId}"]`
    );
    if (existingGa4Script) return;

    // Load the gtag.js script for GA4
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4MeasurementId}`;
    document.head.appendChild(script);

    // Initialize gtag for GA4
    const inlineScript = document.createElement("script");
    inlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${ga4MeasurementId}');
    `;
    document.head.appendChild(inlineScript);
    
    console.log("GA4 initialized with Measurement ID:", ga4MeasurementId);
  };

  // Load GTM and GA4 Scripts When Current Country Info is Available
  useEffect(() => {
    if (
      currentcountry &&
      Object.keys(currentcountry).length > 0
    ) {
      // Load GTM - different container ID for each country from gtm_tag
      if (currentcountry.gtm_tag) {
        loadGTM(currentcountry.gtm_tag);
      }
      
      // Load GA4 - same measurement ID for all regions
      const ga4MeasurementId = "G-D46Y4GMH65";
      loadGA4(ga4MeasurementId);
    }
  }, [currentcountry]);

  // This component doesn't render anything, it just handles initialization
  return null;
}
