"use client";
import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { MediaQueries } from "@/components/utils";
import Paymentdetails from "@/components/Common/Paymentdetails";
import Breadcomp from "@/components/Common/Breadcomp";
import Cookies from "js-cookie";
import Addresslist from "@/components/Common/Addresslist"
import { pushToDataLayer } from "@/components/utils/dataUserpush"
import { useSearchParams } from "next/navigation";
import { GetPlaceOrderapi } from "@/redux/paymentslice";
import withAuth from "@/components/Common/withAuth";
const Address = () => {
    const dispatch = useDispatch();
    const { isMobile } = MediaQueries();
    const currentcountry = useSelector((state) => state.globalslice.currentcountry);
    const logindata = useSelector((state) => state.formslice.logindata);
    const searchParams = useSearchParams();
    const prodId = searchParams.get('prodId');
    const qty = searchParams.get('qty');
    const sku = searchParams.get('sku');
    useEffect(() => {
        if (Cookies.get("jwt_token") !== undefined) {
            dispatch(GetPlaceOrderapi(logindata.user_id));
        }
        pushToDataLayer("viewed_address_page", currentcountry.name);
    }, []);
    return (
        <div className="mobile-marginbottom" >
            <Container fluid className="homepagecontainer">
                <div className={`${isMobile ? 'pt-1 pb-1' : 'pt-3 pb-3'}`}>
                    <Breadcomp prodId={prodId} qty={qty} sku={sku} />
                </div>

                <div className="Cart-titile">Select Delivery address</div>
                <Row>
                    <Col lg={8}>
                        <Addresslist />
                    </Col>
                    <Col lg={4}>
                        <div className="pricedetails">
                            <Paymentdetails prodId={prodId} qty={qty} sku={sku} />
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};


export default withAuth(Address);