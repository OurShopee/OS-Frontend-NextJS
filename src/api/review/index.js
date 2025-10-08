import axios from "axios";
import Cookies from "js-cookie";

export const postUserReview = async (input_data) => {
  const response = await axios.post(`api/add-review`, input_data, {
    headers: { authorization: "Bearer " + Cookies.get("jwt_token") },
  });
  return response;
};
export const updateUserReview = async (input_data) => {
  const response = await axios.put(`api/edit-review`, input_data, {
    headers: { authorization: "Bearer " + Cookies.get("jwt_token") },
  });
  return response;
};
export const likeAReview = async (review_id, productid) => {
  const response = await axios.put(
    `api/review/vote-like`,
    { productid, review_id },
    {
      headers: { authorization: "Bearer " + Cookies.get("jwt_token") },
    }
  );
  return response;
};
export const dislikeAReview = async (review_id, productid) => {
  const response = await axios.put(
    `api/review/vote-dislike`,
    { productid, review_id },
    {
      headers: { authorization: "Bearer " + Cookies.get("jwt_token") },
    }
  );
  return response;
};

export const getAllReviews = async (
  productid,
  { page, sort, search, stars } = {}
) => {
  const params = new URLSearchParams();
  if (page) params.append("page", page);
  if (sort) params.append("sort", sort);
  if (search) params.append("search", search);
  if (stars) params.append("stars", stars);

  const response = await axios.get(
    `api/get-review/${productid}?${params.toString()}`,
    {
      headers: { authorization: "Bearer " + Cookies.get("jwt_token") },
    }
  );
  return response;
};

export const deleteReview = async (rating_id, productid) => {
  const response = await axios.delete(`api/delete-review`, {
    data: { productid, rating_id },
    headers: { authorization: "Bearer " + Cookies.get("jwt_token") },
  });
  return response;
};
