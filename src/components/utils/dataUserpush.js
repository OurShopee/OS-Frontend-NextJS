/* global gtag */
import Cookies from 'universal-cookie';
import {jwtDecode} from "jwt-decode";
import { utc } from 'moment';


// Function to get user_id (from cookies)
export const getUserId = () => {
  // console.log("inside")
  const cookies = new Cookies();
  const token = cookies.get("jwt_token");
  if(token){
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.user_id;
    return userId ; 
  }else{
    return "guest";
  }
};


// Function to get UTM parameters from URL
const getQueryParams = () => {
  const events= JSON.parse(localStorage.getItem("events"));
  return {
    source: events.utm_source,
    medium: events.utm_medium ,
    campaign: events.utm_campaign ,
    content: events.utm_content,
    landing: events.landing
  };
};

// Function to push events dynamically to GTM Data Layer
export const pushToDataLayer = (eventName,region, eventData = {}, excludeUTM = false) => {
    // alert(region)


   const userId = getUserId();

    let eventPayload = {
      event: eventName,
      user_id: userId,   
      region: region,
      send_to: "G-D46Y4GMH65",
      ...eventData, 
    };

    // Only include UTM parameters if excludeUTM is false
    if (!excludeUTM) {
        // alert()
      eventPayload = { ...eventPayload, ...getQueryParams() };
    }
    else{
        eventPayload = { ...eventPayload };
    }
    if (typeof gtag === "function") {
      console.log(eventPayload,"eventPayload")
      gtag('event', eventName, eventPayload);
    } else {
    }
    // window.dataLayer.push(eventPayload);
} ;


export const trackBannerClick = (bannerName, sectionName, pageName, region) => {
  // const userId = getUserId(); 

  pushToDataLayer(
    "clicked_banner",
    region,
    {
      page_name: pageName,
      banner_name: bannerName,
      section_name: sectionName,
    },
    true 
  );
};


export const trackCartClick = (region, pageName) => {
  // const userId = getUserId(); // Fetch user ID
  // const pageName = window.location.pathname; 
  pushToDataLayer("clicked_cart",region,  { page_name: pageName, region:region }, false);
};


export const trackQuickViewClick = (region, productName, sectionName,pageName) => {
  // const userId = getUserId(); // Fetch user ID
  // const pageName = window.location.pathname; 

  pushToDataLayer(
    "clicked_quick_view",
    region,
    {
      product_name: productName,
      section_name: sectionName || "default_section",
      page_name: pageName,
    },
    true // Exclude UTM parameters
  );
};

export const handleCategoryClick = (category, region) => {
  // const userId = getUserId(); 
  const pageName = "home_top_carousel"; 

  pushToDataLayer("clicked_category_from_grid", region, {
    category_selected: category.category_name,
    page: pageName,
  });

  window.location.href = `/categories/${category.url}`;  
};

export const handleCardClick = (data, sectionName) => {
  const productName = data?.name || "Unknown Product"; 
  const pageName = window.location.pathname;
  const cardType = data?.category || "product";  

  pushToDataLayer("clicked_card", { 
    card_type: cardType,  
    card_name: productName,  
    page_name: pageName,  
    section_name: sectionName,
  });
};
export const selectaddressclick = (eventName, region,selectedaddress) => {
    const userId = getUserId();
  // const pageName = window.location.pathname;
//  alert()
let eventPayload = {
    event: eventName,
    user_id: userId,   
    region: region,
    selected_address:selectedaddress 
  };
  pushToDataLayer(eventName, region, { 
    selected_address:selectedaddress,
    region: region,
  },false);
  // window.dataLayer.push(eventPayload);
};

export const handleSummerCard = (region, data) => {
// console.log("region", region);
// console.log("data", data);
  pushToDataLayer("clicked_card_in_section",region ,data);
};