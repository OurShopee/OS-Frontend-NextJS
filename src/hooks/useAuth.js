import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { setauthstatus } from "../redux/formslice";
import { useSelector, useDispatch } from "react-redux";
import { setcartlistdata } from "../redux/cartslice";
export default function useCart() {
    const cookies = new Cookies();
    const dispatch = useDispatch();

    const logout = async () => {
        cookies.remove("jwt_token",{ path: '/' });
        cookies.remove("cart_ip_address")
        dispatch(setauthstatus(false))
        dispatch(setcartlistdata([]));
    }

    return {  logout };
}