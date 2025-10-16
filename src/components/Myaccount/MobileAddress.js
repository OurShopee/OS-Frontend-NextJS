import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import deleteimg from "@/images/Delete.png";
import editimg from "@/images/Edit.png";
import { deleteUserAddressapi, saveDefaultAddressapi, getalladdressesapi } from "@/redux/addresslice";
import { FaPlus } from "react-icons/fa6";
import { MediaQueries } from "@/utils";
import { toggleMobileAddressModal, setaddress_header } from "@/redux/addresslice";
import { setaddressnumber, setformmodal, setformstatus } from '../../redux/formslice';
import {selectaddressclick} from "@/utils/dataUserpush"
import MobileAddressModal from "../Common/Modals/MobileAddressModal";

const MobileAddress = () => {
    const dispatch = useDispatch();
    const { isMobile } = MediaQueries();
    const addresslistdata = useSelector(state => state.addresslice.addresslistdata);
    const loading = useSelector(state => state.addresslice.loading);
 const currentcountry = useSelector((state) => state.globalslice.currentcountry);
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    useEffect(() => {
        if (selectedAddressId === null && addresslistdata?.data?.length > 0) {
            const defaultAddress = addresslistdata.data.find(ele => ele.default_address === 1);
            if (defaultAddress) {
                setSelectedAddressId(defaultAddress.idaddress);
            }
        }
    }, [addresslistdata, selectedAddressId]);

    const handleSelectAddress = async (idaddress) => {
        setSelectedAddressId(idaddress);
        await dispatch(saveDefaultAddressapi({ idaddress }));
        dispatch(getalladdressesapi(0));
        selectaddressclick("selected_address", currentcountry.name,idaddress)
    };

    const deleteAddress = (idaddress) => {
        dispatch(deleteUserAddressapi({ idaddress })).then(() => {
            dispatch(getalladdressesapi(0)); // Refresh after deletion
        });
    };

    const handleAddNewAddress = () => {
        if (isMobile) {
            dispatch(toggleMobileAddressModal(true))
            dispatch(setaddress_header(0))
            dispatch(setaddressnumber(false))
        } else {
            dispatch(setaddress_header('0'))
            dispatch(setformstatus(3))
            dispatch(setformmodal(true))
            dispatch(setaddressnumber(false))
        }
        // handle add logic
    };

    // Sort addresses: default first
    const sortedAddressList = [...(addresslistdata?.data || [])].sort(
        (a, b) => b.default_address - a.default_address
    );


    const handleEditAddress = (id) => {
        dispatch(setaddress_header(id))

        if(isMobile){
            dispatch(toggleMobileAddressModal(true))
        }else{
            dispatch(setformstatus(3))
            dispatch(setformmodal(true))
        }
       
    }


    return (
        <div>
            {!loading ? (sortedAddressList.length > 0 ? (
                sortedAddressList.map(ele => (
                    <div className="Cartitem-maindiv" key={ele.idaddress}>
                        <Row className="addresslist-main">
                            <Col lg={7} md={9} sm={9}>
                                <label className="d-flex">
                                    <div className={`${!isMobile ? "ms-4 me-4 mt-1" : "ms-1 me-2 mt-1"}`}>
                                        <input
                                            type="radio"
                                            name="defaultAddress"
                                            aria-label={`Select address of ${ele.first_name}`}
                                            checked={ele.default_address === 1}
                                            onChange={() => handleSelectAddress(ele.idaddress)}
                                        />
                                    </div>
                                    <div>
                                        <div className="address-top">
                                            <div className="addres-name">{ele.first_name}</div>
                                            {ele.default_address === 1 && (
                                                <div className="address-default-button">Default</div>
                                            )}
                                        </div>
                                        <div className="address-fulladdress">
                                            {ele.building_name} {ele.address}, {ele.address2}
                                        </div>
                                        <div className="address-phone">{ele.mobile}</div>
                                    </div>
                                </label>
                            </Col>
                            <Col lg={5} md={12} sm={12}>
                                <>
                                    <div className={`${!isMobile ? "ms-4 me-4 mt-1" : "ms-1 me-2 mt-1"}`}>
                                    </div>
                                    <div className="edit-remove-main">
                                        <div className="address-page-edit-remove-btn hoverbox-shadow" onClick={() => handleEditAddress(ele.idaddress)}>
                                            <img src={editimg} alt="Edit" />
                                            <span className="btn-title">Edit</span>
                                        </div>
                                        <div
                                            className="address-page-edit-remove-btn hoverbox-shadow"
                                            onClick={() => deleteAddress(ele.idaddress)}
                                        >
                                            <img src={deleteimg} alt="Delete" />
                                            <span className="btn-title">Remove</span>
                                        </div>
                                    </div>
                                </>
                            </Col>
                        </Row>
                    </div>
                ))
            ) : (
               <></>
            ))
                :
                <Container fluid className="homepagecontainer">
                    <Row className="mt-4">
                        <Col lg={12}>
                            {[1, 2, 3].map((ele) => (
                                <div className="Cartitem-maindiv">
                                    <div className="d-flex">
                                        <div className="d-flex">
                                            <div className="placeholder_color" style={{ width: 5, height: 5, borderRadius: 8 }} />
                                            <div className="placeholder_color ms-3" style={{ width: 80, height: 10, borderRadius: 8 }} />
                                        </div>
                                        <div className="cartproduct-details">
                                            <div>
                                                <div className="cartproduct-title">
                                                    <div className="placeholder_color" style={{ width: '40%', height: 10, borderRadius: 8 }} />
                                                </div>
                                                <div className="cartproduct-price mt-3">
                                                    <span className="currencycode">
                                                        <div className="placeholder_color" style={{ width: '40%', height: 10, borderRadius: 8 }} />
                                                    </span>  <div className="placeholder_color mt-3" style={{ width: '40%', height: 10, borderRadius: 8 }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Col>
                    </Row>
                </Container>
            }

            {/* Add New Address Button */}
            <div className="Cartitem-maindiv" style={{ cursor: 'pointer' }}>
                <div className="add-addressbtn d-flex align-items-center" onClick={handleAddNewAddress}>
                    <FaPlus /> 
                    <div className="ms-1">Add a new address</div>
                </div>
            </div>
            {
                isMobile &&
                <MobileAddressModal />
            }
        </div>
    );
};

export default MobileAddress;
