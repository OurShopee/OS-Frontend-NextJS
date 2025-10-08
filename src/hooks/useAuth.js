import { useDispatch } from "react-redux";
import Cookies from "universal-cookie";
import { setcartlistdata } from "../redux/cartslice";
import { setauthstatus } from "../redux/formslice";
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