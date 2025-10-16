import React from "react";
import Link from "next/link";

const BreadComp = ({title,title0,link}) => {
    return (
        <div className="myaccountBreadcomp">
            <Link href="/" className="Myaccounthome-title text-decoration-none">Home</Link>
            {
                title0 &&
                <div className="myaccount-breadcomp-slash">/</div>
            }
            {
                title0 &&
                <Link href={link} className="Myaccounthome-title text-decoration-none">{title0}</Link>
            }
         
           
            <div className="myaccount-breadcomp-slash">/</div>
            <div className="myaccountbreadcomp-activetitle">{title}</div>

        </div>
    )
}
export default BreadComp;