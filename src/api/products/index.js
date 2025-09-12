import axios from "axios";
import { createAxiosInstance } from "../config";

export const Navigationapi = async () => {
  const res = await axios.get("api/getcategorylist");
  return res.data;
};

export const getbannerlistapi = async () => {
  const res = await axios.get("api/getbannerlist");
  return res.data;
};

export const getbrand_weekApi = async () => {
  const res = await axios.get("api/brand_week");
  return res.data;
};

// Fetch search products with query
export const searchapi = async (searchQuery) => {
  const res = await axios.get(`api/searchproducts?str=${searchQuery}`);
  return res.data;
};

export const bundle_clearance_saleApi = async () => {
  const res = await axios.get(`api/bundle_clearance_sale`);
  return res.data;
};

export const getbannerApi = async () => {
  const response = await axios.get("api/getbannerlist");
  return response;
};

export const getdeal_offersApi = async () => {
  const response = await axios.get("api/deal_offers");
  return response;
};

export const getDealOfTheDayApi = async () => {
  const response = await axios.get("api/getDealOfTheDay");
  return response;
};

export const getSaverZoneApi = async () => {
  const response = await axios.get("api/getSaverZone");
  return response;
};

export const getInfinteScrollItemsApi = async (type, page) => {
  const response = await axios.get(
    `api/getInfinteScrollItems?type=${type}&page=${page}`
  );
  return response;
};

export const bundle_clearance_sale = async () => {
  const res = await axios.get(`api/bundle_clearance_sale`);
  return res;
};

export const getTopSellingApi = async () => {
  const response = await axios.get("api/getTopSelling");
  return response;
};

export const getTopPicksApi = async () => {
  const response = await axios.get("api/getTopPicks");
  return response;
};

export const getCatScreenApi = async (slug) => {
  const response = await axios.get(`api/getallcategoryItems?cat_url=${slug}`);
  return response;
};

export const getSubCatScreenApi = async (input_data) => {
  let res;
  if (input_data.slug1 == undefined) {
    res = await axios.get(
      `api/getallsubcategoryItems?subcat_url=${input_data.slug}&page=${input_data.page}`
    );
  } else {
    res = await axios.get(
      `api/getallsubcategoryItems?subcat_url=${input_data.slug}&sub_subcat_url=${input_data.slug1}&page=${input_data.page}`
    );
  }
  return res;
};

export const getfiltered_items = async (input_data) => {
  const response = await axios.post("api/filtered_items", input_data);
  return response;
};

export async function getproduct_detail(productSku, req = null) {
  try {
    if (req) {
      const axiosInstance = createAxiosInstance(req);
      const response = await axiosInstance.get(`api/product_detail?sku=${productSku}`);
      console.log("response >>>>>>>>> response", response);
      return response.data;
    } else {
      const response = await axios.get(`api/product_detail?sku=${productSku}`);
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching product detail:", error);
    return null;
  }
}

export const getcategory_itemsApi = async (sku) => {
  const response = await axios.get(`api/category_items`);
  return response;
};

export const getdeal_of_the_dayApi = async (page) => {
  const response = await axios.get(`api/deal_of_the_day?page=${page}`);
  return response;
};
export const clearance_saleApi = async (page = 1, limit = 4) => {
  const response = await axios.get(
    `api/clearance_sale?page=${page}&limit=${limit}`
  );
  return response;
};

export const gettop_selling_productsApi = async (page) => {
  const response = await axios.get(`api/top_selling_products?page=${page}`);
  return response;
};

export const getSectionPagesApi = async (id, eidSale) => {
  let query = `api/saver_zone1?section_id=${id}`;
  if (eidSale !== undefined) {
    query += `&eid_sale=${eidSale}`;
  }
  const response = await axios.get(query);
  return response;
};

export const getSaverZoneProducts = async (id, eidSale) => {
  let query = `api/saver_zone1?section_id=${id}`;
  if (eidSale !== undefined) {
    query += `&eid_sale=${eidSale}`;
  }

  const response = await axios.get(query);

  // Extract only the items array from other_section[0]
  const items = response?.data?.data?.other_section?.[0]?.items || [];

  // Return in the format frontend expects: res.data → items[]
  return {
    data: {
      status: "success", // optional, for frontend checks
      data: items, // matches frontend's `data.data`
    },
  };
};

export const getAllBrandItemsApi = async (input_data) => {
  const response = await axios.get(
    `api/getAllBrandItems?brand_id=0&slug=${input_data.slug}&page=${input_data.page}`
  );
  return response;
};

export const getAllItemsApi = async (slug, page) => {
  const response = await axios.get(
    `api/getallitems?cat_url=${slug}&page=${page}`
  );
  return response;
};

export const getSearchResultApi = async (input_data) => {
  const response = await axios.get(
    `api/search_result_items?string=${input_data.slug}&subcategory=${input_data.subcategoryId}`
  );
  return response;
};

export const get_relatedItems = async (input_data) => {
  const response = await axios.post(`api/get_relatedItems`, input_data);
  return response;
};
