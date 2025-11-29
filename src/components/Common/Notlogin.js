"use client";
import React from "react";
import { getAssetsUrl } from "../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { setformmodal, setformstatus, setauthstatus } from "../../redux/formslice";
import { useContent, useCurrentLanguage } from "@/hooks";

const Notlogin = () => {
    const dispatch = useDispatch();
    const currentLanguage = useCurrentLanguage();
    const formmodal = useSelector(state => state.globalslice.formmodal);
    const isRTL = currentLanguage === "ar";
    
    // Get translated content
    const loginTitle = useContent("notlogin.loginTitle") || "Login in to continue shopping";
    const loginSubtitle = useContent("notlogin.loginSubtitle") || "Login to see the items you added previously";
    const loginButton = useContent("buttons.login") || "Login";
    
    const loginclick = () => {
        dispatch(setformmodal(!formmodal))
        dispatch(setformstatus(1))
    }
    
    return (
        <div className="notlogin" dir={isRTL ? "rtl" : "ltr"}>
            <img src={getAssetsUrl("notlogin.png")} alt="Not logged in" loading="lazy" />
            <div className="notlogintitle">{loginTitle}</div>
            <div className="notloginsubtitle">{loginSubtitle}</div>
            <button className="notloginbtn" onClick={loginclick}>{loginButton}</button>
        </div>
    )
}
export default Notlogin;