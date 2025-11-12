import Link from "next/link";
import { useContent } from "@/hooks";
import { useCurrentLanguage } from "@/hooks";
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
  const viewAllText = useContent("buttons.viewAll");
  const currentLanguage = useCurrentLanguage();
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
          <div className={`link ${currentLanguage === "ar" ? "ml-0 pl-0" : ""} whitespace-nowrap mr-0 font-semibold text-base sm:text-xl text-[#191B1C]`}>
            {viewAllText}
          </div>
          <div className="link_icon mb-0 sm:mt-0.5 items-center flex">
            <IoChevronForward color="#43494B" className={`${currentLanguage === "ar" ? "rotate-180" : ""}`} size={16} />
          </div>
        </Link>
      )}
    </div>
  );
};

export default ComponentHeader;
