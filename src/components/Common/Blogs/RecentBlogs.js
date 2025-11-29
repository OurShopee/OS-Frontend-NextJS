"use client";
import Link from "next/link";
import { getDynamicContent, useCurrentLanguage } from "@/hooks";

const RecentBlogs = ({ data }) => {
  const currentLanguage = useCurrentLanguage();
  return (
    <div>
      {data?.map((ele) => (
        <Link
          key={ele.id}
          href={`/blog/${ele.url}/${ele.id}`}
          className="no-underline"
        >
          <div className="flex flex-wrap my-[10px]">
            {/* Image Column (50%) */}
            <div className="w-1/2 pr-2">
              <img src={ele.image}
                alt={getDynamicContent(ele, "title", currentLanguage)}
                className="w-full rounded-md object-cover"
              loading="lazy" />
            </div>

            {/* Text Column (50%) */}
            <div className="w-1/2 flex flex-col justify-between">
              <div className="font-normal text-[10px] text-[#43494B]">
                {(() => {
                  const date = new Date(ele.display_date);
                  const day = String(date.getDate()).padStart(2, "0");
                  const month = String(date.getMonth() + 1).padStart(2, "0");
                  const year = date.getFullYear();
                  return `${day}-${month}-${year}`;
                })()}
              </div>
              <div className="font-semibold text-xs text-[#191B1C] line-clamp-3">
                {getDynamicContent(ele, "title", currentLanguage)}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RecentBlogs;
