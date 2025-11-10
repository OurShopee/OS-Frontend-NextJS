import Link from "next/link";
import { IoChevronForward } from "react-icons/io5";

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
        <Link
          href={url}
          className="no-underline view_all border-none shadow-none bg-transparent flex items-center gap-1"
        >
          <div className="link whitespace-nowrap mr-0 font-semibold text-base sm:text-xl text-[#191B1C]">
            View all
          </div>
          <div className="link_icon sm:mt-0.5 items-center flex">
            <IoChevronForward color="#43494B" size={16} />
          </div>
        </Link>
      )}
    </div>
  );
};

export default ComponentHeader;
