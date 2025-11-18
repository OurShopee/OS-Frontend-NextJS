"use client";
import { addToCartApi } from "@/api/cart";
import { cartlistapi } from "@/redux/cartslice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import { useContent } from "@/hooks";

export default function useCart() {
  const [isLoading, setIsLoading] = useState(false);
  const cookies = new Cookies();
  const dispatch = useDispatch();
  const authstatus = useSelector((state) => state.formslice.authstatus);
  const logindata = useSelector((state) => state.formslice.logindata);

  // Get translated content
  const addedToCart = useContent("product.addedToCart") || "Added To Cart";

  const add2cart = async (input_data) => {
    setIsLoading(true);
    try {
      const response = await addToCartApi(input_data);
      const responseMessage = response?.data?.msg || response?.message;

      if (
        response?.status === "success" ||
        response?.status === 200 ||
        response?.status === "200"
      ) {
        cookies.set("cart_ip_address", response.data.ip_address, {
          httpOnly: false,
          path: "/",
          maxAge: 60 * 60 * 24 * 5,
        });
        const cartInput = {
          ip_address: authstatus ? 0 : response.data.ip_address,
          user_id: authstatus ? logindata.user_id : 0,
        };
        dispatch(cartlistapi(cartInput));
        toast.success(responseMessage || addedToCart, {
          autoClose: 1000,
        });
      } else {
        toast.error(
          responseMessage || "Unable to add the product to your cart right now."
        );
      }
    } catch (error) {
      const errorMessage =
        error?.message ||
        error?.data?.message ||
        error?.error ||
        "Unable to add the product to your cart right now.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { add2cart, isLoading };
}
