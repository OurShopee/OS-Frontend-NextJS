import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUserAddressapi, saveDefaultAddressapi, getalladdressesapi } from "../../redux/addresslice";
import { getAssetsUrl } from "../utils/helpers";
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

    const truncateText = (text = "", limit = 80) =>
        text.length > limit ? `${text.slice(0, limit)}...` : text;

    return (
        <div
            className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            dir={currentLanguage === "ar" ? "rtl" : "ltr"}
        >
            <button
                type="button"
                onClick={handleAddNewAddress}
                className="min-h-[180px] rounded-2xl border-2 border-dashed border-[#C7C9D9] flex flex-col items-center justify-center text-center gap-3 text-[#5232C2] hover:border-[#5232C2] hover:bg-[#F8F5FF] transition-colors"
            >
                <FaPlus size={28} />
                <span className="font-semibold">{addANewAddress}</span>
            </button>

            {addresslistdata?.data?.map((ele) => (
                <div
                    key={ele.idaddress}
                    className="relative rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm hover:shadow-md transition-all"
                >
                    {ele.default_address === 1 && (
                                    <span className="absolute -top-3 right-2 text-xs font-semibold text-white bg-[#5232C2] rounded-full px-3 py-1">
                                        {defaultText}
                                    </span>
                                )}
                    <label
                        className={`flex ${currentLanguage === "ar" ? "flex-row-reverse" : ""} gap-3`}
                    >
                        <div>
                            <input
                                type="radio"
                                name="defaultAddress"
                                aria-label={`Select address of ${ele.first_name}`}
                                checked={selectedAddressId === ele.idaddress}
                                onChange={() => handleSelectAddress(ele.idaddress)}
                                className="h-4 w-4 accent-[#5232C2]"
                            />
                        </div>
                        <div className="flex-grow cursor-pointer space-y-2">
                            <div
                                className={`flex items-start gap-2 ${currentLanguage === "ar" ? "flex-row-reverse" : ""
                                    }`}
                            >
                                <p
                                    className="font-semibold text-[#1F2937] text-base leading-snug"
                                    title={ele.first_name}
                                >
                                    {truncateText(ele.first_name, 60)}
                                </p>
                                
                            </div>
                            <p className="text-sm text-[#4B5563]">
                                {truncateText(
                                    `${ele.building_name} ${ele.address}, ${ele.address2}`,
                                    120
                                )}
                            </p>
                            <p className="text-sm font-medium text-[#111827]">
                                {ele.mobile}
                            </p>
                        </div>
                    </label>

                    <div
                        className={`flex gap-3 mt-4 ${currentLanguage === "ar" ? "flex-row-reverse" : ""
                            }`}
                    >
                        <button
                            type="button"
                            onClick={() => handleEditAddress(ele.idaddress)}
                            className="flex items-center gap-1 text-sm font-semibold text-[#1F2937] px-3 py-2 border border-[#E5E7EB] rounded-full hover:bg-[#F3F4F6]"
                        >
                            <img src={getAssetsUrl("Edit.png")} alt="Edit" className="w-4 h-4" loading="lazy" />
                            {edit}
                        </button>
                        <button
                            type="button"
                            onClick={() => deleteAddress(ele.idaddress)}
                            className="flex items-center gap-1 text-sm font-semibold px-3 py-2 border rounded-full hover:bg-[#FEF2F2]"
                        >
                            <img src={getAssetsUrl("Delete.png")} alt="Delete" className="w-4 h-4" loading="lazy" />
                            {remove}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Address;
