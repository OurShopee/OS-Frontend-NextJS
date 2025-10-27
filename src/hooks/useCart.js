"use client"
import { addToCartApi } from "@/api/cart";
import { cartlistapi } from "@/redux/cartslice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
export default function useCart() {
  const [isLoading, setIsLoading] = useState(false);
  const cookies = new Cookies();
  const dispatch = useDispatch();
  const authstatus = useSelector((state) => state.formslice.authstatus);
  const logindata = useSelector((state) => state.formslice.logindata);

  const add2cart = async (input_data) => {
    setIsLoading(true);
    const response = await addToCartApi(input_data);
    if (response.status == "success") {
      cookies.set("cart_ip_address", response.data.ip_address, {
        httpOnly: false,
        path: "/",
        maxAge: 60 * 60 * 24 * 5,
      });
      const input_data = {
        ip_address: authstatus ? 0 : response.data.ip_address,
        user_id: authstatus ? logindata.user_id : 0,
      };
      dispatch(cartlistapi(input_data));
      setIsLoading(false);
      toast.success('Added To Cart', {
          autoClose: 1000,
        });
    } else {
      setIsLoading(false);
    }
  };

  return { add2cart, isLoading };
}
