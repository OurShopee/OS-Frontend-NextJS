"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getDynamicContent, useCurrentLanguage } from "@/hooks";
import { getAssetsUrl } from "../../utils/helpers";

const Blogcategory = ({ data }) => {
  const { slug } = useParams();
  const currentLanguage = useCurrentLanguage();

  return (
    <div className="rounded-[16px] p-[30px] shadow-[0px_4px_12px_0px_#0000000F] sm:p-[15px]">
      <div className="text-[#191B1C] font-semibold text-[16px] mb-[15px]">
        Categories
      </div>
      {data?.map((ele) => {
        const isActive = slug === ele.url;

        return (
          <Link
            key={ele.id}
            href={`/blogs/${ele.url}/${ele.id}`}
            className={`flex items-center font-normal text-[14px] text-[#43494B] px-2 py-1 no-underline ${
              isActive
                ? "bg-[#EEEBFA] text-primary rounded-[6px] font-semibold"
                : ""
            }`}
          >
            <img className="w-4 h-4 mr-1"
              src={isActive ? getAssetsUrl("Arrow - Right  active.png") : getAssetsUrl("Arrow - Right 2.png")}
              alt="arrow"
            loading="lazy" />
            {getDynamicContent(ele, "name", currentLanguage)}
          </Link>
        );
      })}
    </div>
  );
};

export default Blogcategory;
