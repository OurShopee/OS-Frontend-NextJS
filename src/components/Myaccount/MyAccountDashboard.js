import React, { useEffect } from "react";
import { IoPerson } from "react-icons/io5";
import { CiLocationOn, CiEdit, CiCircleQuestion } from "react-icons/ci";
import { CiHeart } from "react-icons/ci";
import { PiSignOut } from "react-icons/pi";
import { FiBox } from "react-icons/fi";
import { LiaShippingFastSolid } from "react-icons/lia";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { MediaQueries } from "../../components/utils";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setauthstatus } from "../../redux/formslice";
const MyAccountDashboard = () => {
    const dispatch =useDispatch()
    const logindata = useSelector(state => state.formslice.logindata)
    const authstatus = useSelector(state => state.formslice.authstatus)
    const { isMobile } = MediaQueries()
    const logoutclick = () => {
        Cookies.remove("jwt_token");
        Cookies.remove("cart_ip_address")
        dispatch(setauthstatus(false))
    }

    const my_profile_data = [
        {
            id: 1,
            card_title: 'Account Setting',
            card_items: [
                {
                    id: 1,
                    name: 'Profile',
                    url: isMobile ? 'myaccount/profile' : 'myaccount',
                    icon: <IoPerson size={20} color={window.location.pathname.split('/')[1] == 'myaccount' ? "var(--primary_color)" : 'rgba(67, 73, 75, 1)'} />
                },
                {
                    id: 2,
                    name: 'Address',
                    url: 'address',
                    icon: <CiLocationOn size={20} color={window.location.pathname.split('/')[1] == 'address' ? "var(--primary_color)" : 'rgba(67, 73, 75, 1)'} />
                },
                {
                    id: 3,
                    name: 'Change Password',
                    url: 'change-password',
                    icon: <CiEdit size={20} color={window.location.pathname.split('/')[1] == 'change-password' ? "var(--primary_color)" : 'rgba(67, 73, 75, 1)'} />
                },
                {
                    id: 4,
                    name: 'Wishlist',
                    url: 'my-wishlist',
                    icon: <CiHeart size={20} color={window.location.pathname.split('/')[1] == 'my-wishlist' ? "var(--primary_color)" : 'rgba(67, 73, 75, 1)'} />
                },
            ]
        },
        {
            id: 2,
            card_title: 'Order Details',
            card_items: [
                {
                    id: 1,
                    name: 'My orders',
                    url: 'my-orders',
                    icon: <FiBox size={20} color={window.location.pathname.split('/')[1] == 'my-orders' ? "var(--primary_color)" : 'rgba(67, 73, 75, 1)'} />
                },
                {
                    id: 2,
                    name: 'Track Your Order',
                    url: 'track-your-order',
                    icon: <LiaShippingFastSolid size={20} color={window.location.pathname.split('/')[1] == 'track-your-order' ? "var(--primary_color)" : 'rgba(67, 73, 75, 1)'} />
                }
            ]
        },
        {
            id: 3,
            card_title: 'Help Center',
            card_items: [
                {
                    id: 1,
                    name: 'Complaints',
                    url: 'complaints',
                    icon: <CiCircleQuestion size={20} color={window.location.pathname.split('/')[1] == 'complaints' ? "var(--primary_color)" : 'rgba(67, 73, 75, 1)'} />
                }
            ]
        }
    ];

    return (
      <>
        <div className="myprofile_left_side">
          {!isMobile && (
            <div className="profile_card">
              <div className="card_body mt-1">
                <div
                  className="card_item"
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
                      className="mb-2"
                    >
                      Welcome
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
                      <>
                        {isMobile ? (
                          <NavLink
                            to={`/${card_item.url}`}
                            className="card_item justify-content-between text-decoration-none"
                            style={{ background: "#fff" }}
                          >
                            <div className="d-flex">
                              {card_item.icon}
                              <h5
                                style={{
                                  color:
                                    card_item.url ==
                                    window.location.pathname.split("/")[1]
                                      ? "var(--primary_color)"
                                      : "rgba(67, 73, 75, 1)",
                                  fontWeight:
                                    card_item.url ==
                                    window.location.pathname.split("/")[1]
                                      ? 600
                                      : 500,
                                }}
                              >
                                {card_item.name}
                              </h5>
                            </div>
                            <img src="/assets/vector_icons/arrow_right.png" />
                          </NavLink>
                        ) : (
                          <NavLink
                            to={`/${card_item.url}`}
                            className="card_item text-decoration-none"
                            style={{
                              background:
                                card_item.url !=
                                  window.location.pathname.split("/")[1] &&
                                "#fff",
                            }}
                          >
                            {card_item.icon}
                            <h5
                              style={{
                                color:
                                  card_item.url ==
                                  window.location.pathname.split("/")[1]
                                    ? "var(--primary_color)"
                                    : "rgba(67, 73, 75, 1)",
                                fontWeight:
                                  card_item.url ==
                                  window.location.pathname.split("/")[1]
                                    ? 600
                                    : 500,
                              }}
                            >
                              {card_item.name}
                            </h5>
                          </NavLink>
                        )}
                      </>
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
                  className="card_item"
                  style={{ background: "#fff", cursor: "pointer" }}
                >
                  <PiSignOut size={20} color={"rgba(67, 73, 75, 1)"} />
                  <h5
                    style={{ color: "rgba(67, 73, 75, 1)", fontWeight: 500 }}
                    onClick={logoutclick}
                  >
                    Sign Out
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
