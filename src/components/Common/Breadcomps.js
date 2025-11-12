"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContent } from "@/hooks";

// Custom NavLink component for Next.js App Router
const NavLink = ({ to, children, className, ...props }) => {
  const pathname = usePathname();
  const isActive = pathname === to;

  return (
    <Link href={to} {...props}>
      <span className={`${className} ${isActive ? "active" : ""}`}>
        {children}
      </span>
    </Link>
  );
};

const BreadComps = ({
  title0,
  link0,
  title1,
  link1,
  title2,
  link2,
  activetitle,
}) => {
  const homeText = useContent("breadcrumbs.home");
  return (
    <div className="myaccountBreadcomp">
      <NavLink to="/" className="Myaccounthome-title no-underline">
        {homeText}
      </NavLink>

      {title0 && (
        <>
          <div className="myaccount-breadcomp-slash">/</div>
          <NavLink
            to={`/categories/${link0}`}
            className="Myaccounthome-title no-underline"
          >
            {title0}
          </NavLink>
        </>
      )}

      {title1 && (
        <>
          <div className="myaccount-breadcomp-slash">/</div>
          <NavLink
            to={`/products-category/${link1}`}
            className="Myaccounthome-title no-underline"
          >
            {title1}
          </NavLink>
        </>
      )}

      {title2 && (
        <>
          <div className="myaccount-breadcomp-slash">/</div>
          <NavLink
            to={`/products-subcategory/${link1}/${link2}`}
            className="Myaccounthome-title no-underline"
          >
            {title2}
          </NavLink>
        </>
      )}

      <div className="myaccount-breadcomp-slash">/</div>
      <div className="myaccountbreadcomp-activetitle">{activetitle}</div>
    </div>
  );
};

export default BreadComps;
