"use client";

import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import Image from "next/image";
import BreadComp from "@/components/Myaccount/BreadComp";
import { MediaQueries } from "@/components/utils";
import user from "@/images/user.png";
import { blogByCatIdapi } from "@/redux/globalslice";
import { getDynamicContent, useCurrentLanguage } from "@/hooks";

const BlogDetail = () => {
  const dispatch = useDispatch();
  const { isMobile } = MediaQueries();
  const params = useParams();
  const slug1 = params?.slug1;
  const slug = params?.slug;

  const blogdata = useSelector((state) => state.globalslice.blogdata);
  const blogcatdata = useSelector((state) => state.globalslice.blogcatdata);
  const currentLanguage = useCurrentLanguage();

  useEffect(() => {
    if (slug1) {
      const input_data = {
        key: "blogId",
        value: slug1,
      };
      dispatch(blogByCatIdapi(input_data));
    }
  }, [slug1, dispatch]);

  return (
    <Container fluid className="homepagecontainer">
      <BreadComp title={slug} title0={"Blog"} />
      <div className="mytractrightside mt-3 mb-2">
        <div className="blogdetail-title">
          {getDynamicContent(blogcatdata?.categoryList?.[0], "title", currentLanguage)}
        </div>
        <div className="blogdeatil-details">
          <div>
            <Image className="blogdetailuserimg" src={user} alt="User" />
          </div>
          <div className="d-flex">
            <div className="blogdeatilsadmin-name">
              posted by admin Ourshopee.com
            </div>
            <div className="blogdetailsdate">
              {(() => {
                const date = new Date(
                  blogcatdata?.categoryList?.[0].display_date
                );
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = date.getFullYear();
                return `${day}-${month}-${year}`;
              })()}
            </div>
          </div>
        </div>

        <img
          className="blogmain-img"
          src={blogcatdata?.categoryList?.[0].image}
          alt={getDynamicContent(blogcatdata?.categoryList?.[0], "title", currentLanguage) || "Blog image"}
        />
        <div className="blog-subtitle pt-2 pb-2">
          <div
            dangerouslySetInnerHTML={{
              __html: getDynamicContent(blogcatdata?.categoryList?.[0], "description", currentLanguage),
            }}
          />
        </div>
      </div>
    </Container>
  );
};

export default BlogDetail;
