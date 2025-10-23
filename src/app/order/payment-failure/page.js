"use client";

import Breadcomp from "@/components/Common/Breadcomp";
import { MediaQueries } from "@/components/utils";
import notcartimg from "@/images/payfail.png";
import Link from "next/link";

const Paymentfail = () => {
  const { isMobile } = MediaQueries();

  return (
    <>
      <div className={`${isMobile ? "pt-1 pb-1" : "pt-3 pb-3"}`}>
        <Breadcomp />
      </div>

      <div className="notlogin">
        <img src={notcartimg.src} alt="Payment Failed" />
        <div className="notlogintitle">Oh no! Your payment failed.</div>
        <div className="notloginsubtitle">
          An error occurred while processing your payment.
        </div>
        <div className="d-flex">
          <Link href="/Payment" className="notloginbtn textdecoration-none">
            Try again
          </Link>
        </div>
      </div>
    </>
  );
};

export default Paymentfail;
