"use client";
import Link from "next/link";
import user from "../../../public/images/user.png"; // Make sure this file exists

const Blogslist = ({ data }) => {
  return (
    <div className="rounded-[16px] p-6 bg-white shadow-custom">
      {data?.map((ele) => (
        <Link
          key={ele.id}
          href={`/blog/${ele.url}/${ele.id}`}
          className="no-underline"
        >
          <div className="flex flex-col sm:flex-row gap-4 my-[10px]">
            {/* Image Column */}
            <div className="sm:w-1/3 w-full">
              <img
                src={ele.image}
                alt={ele.title}
                className="rounded-lg w-full h-auto object-cover"
              />
            </div>

            {/* Content Column */}
            <div className="sm:w-2/3 w-full">
              <div className="font-semibold text-[18px] text-[#191B1C] pb-[10px]">
                {ele.title}
              </div>

              <div className="text-[#43494B] font-normal text-xs">
                <div
                  className="line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: ele.description }}
                />
              </div>

              <div className="flex items-center mt-4">
                <img
                  src={user.src}
                  alt="user"
                  className="w-6 h-6 mr-[10px] rounded-full"
                />
                <div>
                  <div className="font-normal text-[10px] text-[#43494B]">
                    posted by admin Ourshopee.com
                  </div>
                  <div className="font-normal text-[10px] text-[#43494B]">
                    {(() => {
                      const date = new Date(ele.display_date);
                      const day = String(date.getDate()).padStart(2, "0");
                      const month = String(date.getMonth() + 1).padStart(
                        2,
                        "0"
                      );
                      const year = date.getFullYear();
                      return `${day}-${month}-${year}`;
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Blogslist;
