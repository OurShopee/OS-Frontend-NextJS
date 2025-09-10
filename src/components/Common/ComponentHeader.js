import React from "react";
import { BsArrowRight } from "react-icons/bs";
import Link from "next/link";

const ComponentHeader = ({
  url,
  first_string_color,
  second_string_color,
  view_all,
  second_title,
  title,
  first_title,
}) => {
  return (
    <div className="component_header">
      <div>
        <h4>{title}</h4>
      </div>
      {url != undefined && (
        <Link href={url} className="no-underline view_all">
          <div className="link whitespace-nowrap">View all</div>
          <div className="link_icon">
            <BsArrowRight color="#43494B" size={20} />
          </div>
        </Link>
      )}
    </div>
  );
};

export default ComponentHeader;
