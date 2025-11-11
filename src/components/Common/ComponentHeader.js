import React from "react";
import { BsArrowRight } from "react-icons/bs";
import Link from "next/link";
import { useContent } from "@/hooks";
import { useCurrentLanguage } from "@/hooks";

const ComponentHeader = ({
  url,
  first_string_color,
  second_string_color,
  view_all,
  second_title,
  title,
  first_title,
}) => {
  const viewAllText = useContent("buttons.viewAll");
  const currentLanguage = useCurrentLanguage();
  return (
    <div className="component_header">
      <div>
        <h4>{title}</h4>
      </div>
      {url != undefined && (
        <Link href={url} className="no-underline view_all">
          <div className="link whitespace-nowrap">{viewAllText}</div>
          <div className={`link_icon ${currentLanguage === "ar" ? "rotate-180" : ""}`}>
            <BsArrowRight color="#43494B" size={20} />
          </div>
        </Link>
      )}
    </div>
  );
};

export default ComponentHeader;
