"use client"
import React, { useEffect, useMemo } from "react";
import { IoPerson } from "react-icons/io5";
import { CiLocationOn, CiEdit, CiCircleQuestion } from "react-icons/ci";
import { CiHeart } from "react-icons/ci";
import { PiSignOut } from "react-icons/pi";
import { FiBox } from "react-icons/fi";
import { LiaShippingFastSolid } from "react-icons/lia";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { MediaQueries } from "../../components/utils";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setauthstatus } from "../../redux/formslice";
import { useContent, useCurrentLanguage } from "@/hooks";
import { getAssetsUrl } from "../../components/utils/helpers";
import { IoIosWallet } from "react-icons/io";
const MyAccountDashboard = () => {
    const pathname = usePathname()
    const dispatch = useDispatch()
    const currentLanguage = useCurrentLanguage();
    const logindata = useSelector(state => state.formslice.logindata)
    const authstatus = useSelector(state => state.formslice.authstatus)
    const { isMobile } = MediaQueries()
    
    // Content translations
    const welcome = useContent("labels.welcome");
    const accountSetting = useContent("buttons.accountSetting");
    const profile = useContent("account.profile");
    const address = useContent("pages.address");
    const changePassword = useContent("buttons.changePassword");
    const wishlist = useContent("account.wishlist");
    const orderDetails = useContent("buttons.orderDetails");
    const myOrders = useContent("account.myOrders");
    const wallet = useContent("account.wallet");
    const trackYourOrder = useContent("account.trackYourOrder");
    const helpCenter = useContent("buttons.helpCenter");
    const complaints = useContent("pages.complaints");
    const signOut = useContent("buttons.signOut");
    
    const logoutclick = () => {
        Cookies.remove("jwt_token");
        Cookies.remove("cart_ip_address")
        dispatch(setauthstatus(false))
    }

    const my_profile_data = useMemo(() => [
        {
            id: 1,
            card_title: accountSetting,
            card_items: [
                {
                    id: 1,
                    name: profile,
                    url: `${isMobile ? 'myaccount/profile' : 'myaccount'}`,
                    icon: <IoPerson size={20} color={pathname?.split('/')[1] == 'myaccount' ? "var(--primary_color)" : 'rgba(67, 73, 75, 1)'} />
                },
                {
                    id: 2,
                    name: address,
                    url: 'address',
                    icon: <CiLocationOn size={20} color={pathname?.split('/')[1] == 'address' ? "var(--primary_color)" : 'rgba(67, 73, 75, 1)'} />
                },
                {
                    id: 3,
                    name: changePassword,
                    url: 'change-password',
                    icon: <CiEdit size={20} color={pathname?.split('/')[1] == 'change-password' ? "var(--primary_color)" : 'rgba(67, 73, 75, 1)'} />
                },
                {
                    id: 4,
                    name: wishlist,
                    url: 'my-wishlist',
                    icon: <CiHeart size={20} color={pathname?.split('/')[1] == 'my-wishlist' ? "var(--primary_color)" : 'rgba(67, 73, 75, 1)'} />
                },
            ]
        },
        {
            id: 2,
            card_title: orderDetails,
            card_items: [
                {
                    id: 1,
                    name: myOrders,
                    url: 'my-orders',
                    icon: <FiBox size={20} color={pathname?.split('/')[1] == 'my-orders' ? "var(--primary_color)" : 'rgba(67, 73, 75, 1)'} />
                },
                {
                    id: 2,
                    name: trackYourOrder,
                    url: 'track-your-order',
                    icon: <LiaShippingFastSolid size={20} color={pathname?.split('/')[1] == 'track-your-order' ? "var(--primary_color)" : 'rgba(67, 73, 75, 1)'} />
                }
            ]
        },
        {
          id: 4,
          card_title: wallet,
          card_items: [
              {
                  id: 1,
                  name: wallet,
                  url: 'wallet',
                  icon: <IoIosWallet size={20} color={pathname?.split('/')[1] == 'wallet' ? "var(--primary_color)" : 'rgba(67, 73, 75, 1)'} />
              }
          ]
      },
        {
            id: 3,
            card_title: helpCenter,
            card_items: [
                {
                    id: 1,
                    name: complaints,
                    url: 'complaints',
                    icon: <CiCircleQuestion size={20} color={pathname?.split('/')[1] == 'complaints' ? "var(--primary_color)" : 'rgba(67, 73, 75, 1)'} />
                }
            ]
        }
    ], [accountSetting, profile, address, changePassword, wishlist, orderDetails, myOrders, trackYourOrder, helpCenter, complaints, isMobile, pathname, wallet]);

    return (
      <>
        <div className="myprofile_left_side" dir={currentLanguage === "ar" ? "rtl" : "ltr"}>
          {!isMobile && (
            <div className="profile_card">
              <div className="card_body mt-1">
                <div
                  className={`card_item`}
                  style={{ background: "#fff", cursor: "pointer" }}
                >
                  <div className="person_Account">
                    <IoPerson size={35} color={"#fff"} />
                  </div>
                  <div>
                    <h5
                      style={{
                        color: "rgba(67, 73, 75, 1)",
                        fontWeight: 400,
                        fontSize: 14,
                      }}
                      className={`mb-2 ${currentLanguage === "ar" ? "!mr-3" : ""}`}
                    >
                      {welcome}
                    </h5>
                    <h5
                      style={{
                        color: "#000",
                        fontWeight: 600,
                        fontSize: 20,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-all",
                        overflowWrap: "break-word",
                      }}
                      className={currentLanguage === "ar" ? "!mr-3" : ""}
                    >
                      {logindata?.first_name?.trim().length > 25
                        ? logindata.first_name.trim().substring(0, 25) + "..."
                        : logindata?.first_name?.trim()}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          )}

          {my_profile_data.map((item) => {
            return (
              <div className="profile_card" key={item.id}>
                <div className="card_heading">{item.card_title}</div>
                <div className="card_body mt-3">
                  {item.card_items.map((card_item) => {
                    return (
                      <div key={card_item.id}>
                        {isMobile ? (
                          <Link
                            href={`/${card_item.url}`}
                            className={`card_item justify-content-between text-decoration-none`}
                            style={{ background: "#fff" }}
                          >
                            <div className={`d-flex`}>
                              {card_item.icon}
                              <h5
                                style={{
                                  color:
                                    card_item.url ==
                                    pathname?.split("/")[1]
                                      ? "var(--primary_color)"
                                      : "rgba(67, 73, 75, 1)",
                                  fontWeight:
                                    card_item.url ==
                                    pathname?.split("/")[1]
                                      ? 600
                                      : 500,
                                }}
                                className={currentLanguage === "ar" ? "!mr-3" : ""}
                              >
                                {card_item.name}
                              </h5>
                            </div>
                            <img src={getAssetsUrl("vector_icons/arrow_right.png")} 
                              style={{
                                transform: currentLanguage === "ar" ? "scaleX(-1)" : "none"
                              }}
                              alt="arrow"
                            loading="lazy" />
                          </Link>
                        ) : (
                          <Link
                            href={`/${card_item.url}`}
                            className={`card_item text-decoration-none`}
                            style={{
                              background:
                                card_item.url !=
                                  pathname?.split("/")[1] &&
                                "#fff",
                            }}
                          >
                            {card_item.icon}
                            <h5
                              style={{
                                color:
                                  card_item.url ==
                                  pathname?.split("/")[1]
                                    ? "var(--primary_color)"
                                    : "rgba(67, 73, 75, 1)",
                                fontWeight:
                                  card_item.url ==
                                  pathname?.split("/")[1]
                                    ? 600
                                    : 500,
                              }}
                              className={currentLanguage === "ar" ? "!mr-2" : ""}
                            >
                              {card_item.name}
                            </h5>
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {authstatus && (
            <div className="profile_card">
              <div className="card_body mt-1">
                <div
                  className={`card_item`}
                  style={{ background: "#fff", cursor: "pointer" }}
                >
                  <PiSignOut size={20} color={"rgba(67, 73, 75, 1)"} />
                  <h5
                    style={{ color: "rgba(67, 73, 75, 1)", fontWeight: 500 }}
                    onClick={logoutclick}
                    className={currentLanguage === "ar" ? "!mr-2" : ""}
                  >
                    {signOut}
                  </h5>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
};

export default MyAccountDashboard;
