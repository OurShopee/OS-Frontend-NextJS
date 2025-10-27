import React, { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import { MediaQueries } from "./utils";

export function AllSellerList({
    changeVendor,
    toggleVendorList,
    showVendorList,
    selectedVendor,
    allVendors,
}) {
    const { isMobile, isLaptop, isTablet } = MediaQueries();
    useEffect(() => {
        if (showVendorList) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showVendorList]);

    const currentcountry = useSelector((state) => state.globalslice.currentcountry);
    if (!showVendorList) return null;

    return (
        <>
            {showVendorList && <div className="modal-backdrop-custom" onClick={toggleVendorList}></div>}
            {
                isMobile ?
                    <div className={`modal-custom-wrapper tw-h-[70vh] ${showVendorList ? "modal-slide-up" : "modal-slide-out"}`}>
                        <div className="tw-w-full tw-max-w-xl tw-h-full tw-px-4 tw-overflow-y-scroll tw-rounded-t-2xl tw-bg-white tw-shadow-xl">
                            {/* Header */}
                            <div className="tw-sticky tw-py-4 tw-top-0 tw-z-20 tw-bg-white tw-flex tw-justify-between tw-items-center tw-select-none">
                                <h5 className="tw-flex tw-items-center tw-gap-1 tw-text-[#43494B] tw-mb-0">
                                    <span className="tw-font-[700] tw-text-[24px]">All Sellers List</span>{" "}
                                    <span className="tw-text-[19px] tw-font-[600]">({allVendors?.length})</span>
                                </h5>
                                <IoClose onClick={toggleVendorList} className="tw-text-3xl tw-cursor-pointer tw-text-[#43494B]" />
                            </div>

                            {/* List */}
                            <div className="tw-space-y-4 tw-pb-8 tw-overflow-y-auto">
                                {allVendors?.length > 0 && allVendors?.map((s) => {
                                    const selected = s?.vendor_details?.vendor_id === selectedVendor?.vendor_details?.vendor_id;
                                    return (
                                        <article
                                            key={s?.vendor_details?.vendor_id}
                                            style={{
                                                boxShadow: "0px 7px 8px 0px #78917F17"
                                            }}
                                            className={[
                                                "tw-rounded-2xl tw-bg-white tw-shadow-sm tw-transition-all tw-ease-in-out",
                                                selected
                                                    ? "tw-bg-[linear-gradient(180deg,_#E9FFE7_0%,_rgba(255,255,255,0)_84.62%)]"
                                                    : "no-border-bottom seller-border hover:tw-shadow",
                                            ].join(" ")}
                                        >
                                            <div className="tw-grid tw-grid-cols-[auto_1fr] tw-gap-4 tw-p-4 sm:tw-p-6">
                                                {/* Store icon */}
                                                <div
                                                    style={{
                                                        border: "1px solid #F4F4F4",
                                                        boxShadow: "0px 4px 12px 0px #0000000F"

                                                    }}
                                                    className="tw-flex no-border-bottom tw-h-12 tw-w-12 tw-items-center tw-justify-center tw-rounded-xl tw-bg-[#FCFCFC] tw-text-gray-600">
                                                    <img src="/assets/Store.svg" alt="Store" />
                                                </div>


                                                {/* Content */}
                                                <div className="tw-space-y-3">
                                                    <p className="tw-text-lg tw-text-gray-600">
                                                        Sold by{" "}
                                                        <span className="tw-font-semibold tw-text-gray-900">
                                                            {s?.vendor_details?.business_name}
                                                        </span>
                                                    </p>

                                                    <div className="tw-flex tw-items-center tw-gap-x-1 tw-gap-y-1">
                                                        <div className="tw-text-xl tw-font-semibold tw-tracking-tight tw-text-gray-900">
                                                            {currentcountry?.currency} {" "}
                                                            {formatNumber(s.display_price)}
                                                        </div>

                                                        {s.old_price ? (
                                                            <div className="tw-text-gray-400 tw-line-through">
                                                                {/* {currentcountry?.currency} */}
                                                                {formatNumber(s.old_price)}
                                                            </div>
                                                        ) : null}

                                                        {s.percentage ? (
                                                            <div className="tw-text-xs tw-font-semibold tw-text-emerald-600">
                                                                {s.percentage}%OFF
                                                            </div>
                                                        ) : null}

                                                        <div className="tw-text-xs tw-text-gray-500">
                                                            (Inc. of VAT)
                                                        </div>
                                                    </div>

                                                    <p className="tw-text-sm tw-text-gray-600">
                                                        Delivery Expected{" "}
                                                        <span className="tw-font-semibold tw-text-gray-900">
                                                            by {s?.delivery}
                                                        </span>
                                                    </p>

                                                    {/* Actions */}
                                                    {selected ? (
                                                        <button
                                                            type="button"
                                                            disabled
                                                            className="tw-mt-1 tw-border-none tw-inline-flex tw-w-full tw-items-center tw-justify-center tw-rounded-lg tw-bg-primary tw-px-4 tw-py-3 tw-text-sm tw-font-semibold tw-text-white tw-shadow-sm hover:tw-bg-violet-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-violet-500 disabled:tw-opacity-100"
                                                        >
                                                            CURRENTLY SELECTED
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            style={{
                                                                border: "1px solid #CED2D4"
                                                            }}
                                                            onClick={() => changeVendor(s?.vendor_details?.vendor_id)}
                                                            className="tw-mt-1 tw-transition-all tw-ease-in-out tw-inline-flex tw-w-full tw-items-center tw-justify-center tw-rounded-lg tw-bg-white tw-px-4 tw-py-3 tw-text-sm tw-font-semibold tw-text-[#43494B] hover:tw-border-gray-300 hover:tw-bg-gray-50 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-violet-500"
                                                        >
                                                            SWITCH TO THIS SELLER
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        </div>
                    </div >
                    :
                    <div className={`modal-custom-wrapper-desktop tw-fixed tw-top-0 tw-right-0 tw-h-screen tw-w-[25vw] tw-z-[1050] ${showVendorList ? "modal-slide-in" : "modal-slide-out"}`}>
                        <div className="tw-w-full tw-max-w-xl tw-h-full tw-px-4 tw-overflow-y-scroll tw-rounded-l-xl tw-bg-white tw-shadow-xl tw-ring-1 tw-ring-black/5">
                            {/* Header */}
                            <div className="tw-sticky tw-py-4 tw-top-0 tw-z-20 tw-bg-white border-bottom tw-mb-4 tw-flex tw-justify-between tw-items-center tw-select-none">
                                <h5 className="tw-flex tw-items-center tw-gap-1 tw-text-[#43494B] tw-mb-0">
                                    <span className="tw-font-[700] tw-text-[24px]">All Sellers List</span>{" "}
                                    <span className="tw-text-[19px] tw-font-[600]">({allVendors?.length})</span>
                                </h5>
                                <IoClose onClick={toggleVendorList} className="tw-text-3xl tw-cursor-pointer tw-text-[#43494B]" />
                            </div>

                            {/* List */}
                            <div className="tw-space-y-4 tw-pb-8 tw-overflow-y-auto">
                                {allVendors?.length > 0 && allVendors?.map((s) => {
                                    const selected = s?.vendor_details?.vendor_id === selectedVendor?.vendor_details?.vendor_id;
                                    return (
                                        <article
                                            key={s?.vendor_details?.vendor_id}
                                            style={{
                                                boxShadow: "0px 7px 8px 0px #78917F17"
                                            }}
                                            className={[
                                                "tw-rounded-2xl tw-bg-white tw-shadow-sm tw-transition-all tw-ease-in-out",
                                                selected
                                                    ? "seller-border-gradient tw-bg-[linear-gradient(180deg,_#E9FFE7_0%,_rgba(255,255,255,0)_84.62%)]"
                                                    : "no-border-bottom seller-border hover:tw-shadow",
                                            ].join(" ")}
                                        >
                                            <div className="tw-grid tw-grid-cols-[auto_1fr] tw-gap-4 tw-p-4 sm:tw-p-6">
                                                {/* Store icon */}
                                                <div
                                                    style={{
                                                        border: "1px solid #F4F4F4",
                                                        boxShadow: "0px 4px 12px 0px #0000000F"

                                                    }}
                                                    className="tw-flex no-border-bottom tw-h-12 tw-w-12 tw-items-center tw-justify-center tw-rounded-xl tw-bg-[#FCFCFC] tw-text-gray-600">
                                                    <img src="/assets/Store.svg" alt="Store" />
                                                </div>


                                                {/* Content */}
                                                <div className="tw-space-y-3">
                                                    <p className="tw-text-lg tw-text-gray-600">
                                                        Sold by{" "}
                                                        <span className="tw-font-semibold tw-text-gray-900">
                                                            {s?.vendor_details?.business_name}
                                                        </span>
                                                    </p>

                                                    <div className="tw-flex tw-items-center tw-gap-x-1 tw-gap-y-1">
                                                        <div className="tw-text-xl tw-font-semibold tw-tracking-tight tw-text-gray-900">
                                                            {currentcountry?.currency} {" "}
                                                            {formatNumber(s.display_price)}
                                                        </div>

                                                        {s.old_price ? (
                                                            <div className="tw-text-gray-400 tw-line-through">
                                                                {/* {currentcountry?.currency} */}
                                                                {formatNumber(s.old_price)}
                                                            </div>
                                                        ) : null}

                                                        {s.percentage ? (
                                                            <div className="tw-text-xs tw-font-semibold tw-text-emerald-600">
                                                                {s.percentage}%OFF
                                                            </div>
                                                        ) : null}

                                                        <div className="tw-text-xs tw-text-gray-500">
                                                            (Inc. of VAT)
                                                        </div>
                                                    </div>

                                                    <p className="tw-text-sm tw-text-gray-600">
                                                        Delivery Expected{" "}
                                                        <span className="tw-font-semibold tw-text-gray-900">
                                                            by {s?.deliveryLabel}
                                                        </span>
                                                    </p>

                                                    {/* Actions */}
                                                    {selected ? (
                                                        <button
                                                            type="button"
                                                            disabled
                                                            className="tw-mt-1 tw-border-none tw-inline-flex tw-w-full tw-items-center tw-justify-center tw-rounded-lg tw-bg-primary tw-px-4 tw-py-3 tw-text-sm tw-font-semibold tw-text-white tw-shadow-sm hover:tw-bg-violet-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-violet-500 disabled:tw-opacity-100"
                                                        >
                                                            CURRENTLY SELECTED
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            style={{
                                                                border: "1px solid #CED2D4"
                                                            }}
                                                            onClick={() => changeVendor(s?.vendor_details?.vendor_id)}
                                                            className="tw-mt-1 tw-transition-all tw-ease-in-out tw-inline-flex tw-w-full tw-items-center tw-justify-center tw-rounded-lg tw-bg-white tw-px-4 tw-py-3 tw-text-sm tw-font-semibold tw-text-[#43494B] hover:tw-border-gray-300 hover:tw-bg-gray-50 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-violet-500"
                                                        >
                                                            SWITCH TO THIS SELLER
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        </div>
                    </div >
            }
        </>
    );
}

function formatNumber(n) {
    try {
        return n.toLocaleString();
    } catch {
        return String(n);
    }
}
