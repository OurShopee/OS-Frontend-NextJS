import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";


export const ProductCategoryFilters = () => {
    return (
        <>
            {
                [1, 2, 3, 4, 5].map(() => {
                    return (
                        <div className="mb-4 mt-4">
                            <div className="d-flex" style={{ justifyContent: "space-between" }}>
                                <div className="placeholder_color" style={{ height: 10, width: '60%', borderRadius: 2 }}></div>
                                <div className="placeholder_color" style={{ height: 10, width: 12, borderRadius: 2 }}></div>
                            </div>
                            {
                                [1, 2, 3, 4, 5].map(() => {
                                    return (
                                        <div className="mx-3 mt-3 d-flex" style={{ alignItems: "center" }}>
                                            <div className="placeholder_color" style={{ height: 20, width: 20, borderRadius: 4, marginRight: 15 }}></div>
                                            <div className="placeholder_color" style={{ height: 10, width: '35%', borderRadius: 2 }}></div>
                                        </div>
                                    )
                                })
                            }

                        </div>
                    )

                })
            }
        </>
    )
}

export const ProductCardPlaceHolder = () => {
    return (
        <>
            <div className="mb-4 mt-4">
                <div className="d-flex" style={{ justifyContent: "space-between" }}>
                    <div className="placeholder_color" style={{ height: 306, width: '100%', borderRadius: 10 }}></div>
                </div>
            </div>
        </>
    )
}
export const SubcategoryPlaceHolder = () => {
    return (
        <>
            <div className="mb-4 mt-4">
                <div className="d-flex" style={{ justifyContent: "space-between" }}>
                    <div className="placeholder_color" style={{ height: 150, width: 150, borderRadius: '50%' }}></div>
                </div>
            </div>
        </>
    )
}
