import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import deleteimg from "@/images/Delete.png";
import editimg from "@/images/Edit.png";
import { deleteUserAddressapi, saveDefaultAddressapi, getalladdressesapi } from "../../redux/addresslice";
import { setformmodal, setaddressnumber } from '../../redux/formslice';

import { setformstatus } from "../../redux/formslice";
import { setaddress_header } from "../../redux/addresslice";
import { FaPlus } from "react-icons/fa6";
import { MediaQueries } from "../utils";
import { useContent, useCurrentLanguage } from "@/hooks";

const Address = () => {
    const dispatch = useDispatch();
    const { isMobile } = MediaQueries();
    const currentLanguage = useCurrentLanguage();
    const addresslistdata = useSelector(state => state.addresslice.addresslistdata);

    const [selectedAddressId, setSelectedAddressId] = useState(null);
    
    // Content translations
    const edit = useContent("buttons.edit");
    const remove = useContent("buttons.remove");
    const defaultText = useContent("buttons.default");
    const addANewAddress = useContent("buttons.addANewAddress");

    useEffect(() => {
        if (addresslistdata?.data?.length > 0) {
            const defaultAddress = addresslistdata.data.find(ele => ele.default_address === 1);
            if (defaultAddress) {
                setSelectedAddressId(defaultAddress.idaddress);
            }
        }
    }, [addresslistdata, selectedAddressId]);

    const handleSelectAddress = async (idaddress) => {
        // setSelectedAddressId(idaddress);
        await dispatch(saveDefaultAddressapi({ idaddress }));
        dispatch(getalladdressesapi(0));
    };


    const deleteAddress = (idaddress) => {
        dispatch(deleteUserAddressapi({ idaddress })).then(() => {
            dispatch(getalladdressesapi(0)); // Refresh after deletion
        });
    };

    const handleAddNewAddress = () => {
        dispatch(setaddress_header('0'))
        dispatch(setformstatus(3))
        dispatch(setformmodal(true))
        dispatch(setaddressnumber(false))

    };


    const handleEditAddress = (id) =>{
        dispatch(setaddress_header(id))
        dispatch(setformstatus(3))
        dispatch(setformmodal(true))
    }

    return (
        <Row dir={currentLanguage === "ar" ? "rtl" : "ltr"}>
            <Col xxl={3} lg={4} md={6} sm={12} className="mb-4" >
                <div className="Cartitem-maindiv addaddressbtn"  onClick={handleAddNewAddress}>
                    <FaPlus size={30} className="mb-3" />
                    <div className="add-addressbtn">
                        {addANewAddress}
                    </div>
                </div>
            </Col>
            {addresslistdata?.data?.length > 0 ? (
                addresslistdata.data.map(ele => (

                    <Col xxl={3} lg={4} md={6} sm={12} key={ele.idaddress} className="mb-4">
                        <div className=" addresscard cursor-pointer">
                            <label className={`d-flex ${currentLanguage === "ar" ? "flex-row-reverse" : ""}`}>

                                <div className="cursor-pointer">
                                    <div className="mb-2">
                                        <input
                                            type="radio"
                                            name="defaultAddress"
                                            aria-label={`Select address of ${ele.first_name}`}
                                            checked={selectedAddressId === ele.idaddress}
                                            onChange={() => handleSelectAddress(ele.idaddress)}
                                            className="myaccount-addresslist-radiobtn"
                                        />
                                    </div>
                                    <div className={`address-top ${currentLanguage === "ar" ? "flex-row-reverse" : ""}`}>
                                        <div className="addres-name">{ele.first_name}</div>
                                        {ele.default_address === 1 && (
                                            <div className="address-default-button">{defaultText}</div>
                                        )}
                                    </div>
                                    <div className="address-fulladdress">
                                        {ele.building_name} {ele.address}, {ele.address2}
                                    </div>
                                    <div className="address-phone">{ele.mobile}</div>
                                </div>
                            </label>
                            <div className={`d-flex mt-4 ${currentLanguage === "ar" ? "flex-row-reverse" : ""}`}>
                                <div className="address-page-edit-remove-btn hoverbox-shadow" onClick={() => handleEditAddress(ele.idaddress)}>
                                    <img src={editimg.src} alt="Edit" />
                                    <span className="btn-title">{edit}</span>
                                </div>
                                <div
                                    className="address-page-edit-remove-btn hoverbox-shadow"
                                    onClick={() => deleteAddress(ele.idaddress)}
                                >
                                    <img src={deleteimg.src} alt="Delete" />
                                    <span className="btn-title">{remove}</span>
                                </div>
                            </div>
                        </div>
                    </Col>


                ))
            ) : (
                ""
            )}

        </Row>
    );
};

export default Address;
