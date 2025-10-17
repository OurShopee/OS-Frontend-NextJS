import React from "react";
import notloginimg from "../../images/notlogin.png"
import { useDispatch, useSelector } from "react-redux";

import { setformmodal, setformstatus, setauthstatus } from "../../redux/formslice";
const Notlogin = () => {
    const dispatch = useDispatch()
    const formmodal = useSelector(state => state.globalslice.formmodal);
    const loginclick = () => {
        dispatch(setformmodal(!formmodal))
        dispatch(setformstatus(1))

    }
    return (
        <div className="notlogin">
            <img src={notloginimg.src}></img>
            <div className="notlogintitle">Login in to continue shopping</div>
            <div className="notloginsubtitle">Login to see the items you added previously</div>
            <button className="notloginbtn" onClick={loginclick}>Login</button>

        </div>
    )
}
export default Notlogin;