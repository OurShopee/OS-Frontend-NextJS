"use client";

import { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import Blogcategory from "@/components/Common/Blogs/BlogCategory";
import Blogslist from "@/components/Common/Blogs/Blogslist";
import RecentBlogs from "@/components/Common/Blogs/RecentBlogs";
import BreadComp from "@/components/Myaccount/BreadComp";
import { MediaQueries } from "@/components/utils";
import { blogByCatIdapi, getblogsapi } from "@/redux/globalslice";

const BlogpageCategory = () => {
  const dispatch = useDispatch();
  const { isMobile } = MediaQueries();
  const params = useParams();
  const slug1 = params?.slug1;
  const slug = params?.slug;

  const blogdata = useSelector((state) => state.globalslice.blogdata);
  const blogcatdata = useSelector((state) => state.globalslice.blogcatdata);

  useEffect(() => {
    if (slug1) {
      const input_data = {
        key: "id",
        value: slug1,
      };
      dispatch(blogByCatIdapi(input_data));
    }
  }, [slug1, dispatch]);

  useEffect(() => {
    dispatch(getblogsapi());
  }, [dispatch]);

  return (
    <Container fluid className="homepagecontainer">
      <Row>
        <BreadComp title={slug} title0={"Blog"} />
        <Col lg={3} md={3} sm={12}>
          <Blogcategory data={blogdata.Categories} />
          {!isMobile && (
            <div className="mobileblogcard">
              <div className="recentblogtitle">Recent Blogs</div>
              <RecentBlogs data={blogcatdata.Recents} />
            </div>
          )}
        </Col>
        <Col lg={9} md={3} sm={12}>
          {isMobile ? (
            <RecentBlogs data={blogcatdata.categoryList} />
          ) : (
            <Blogslist data={blogcatdata.categoryList} />
          )}
          {isMobile && (
            <div className="mobileblogcard">
              <div className="recentblogtitle">Recent Blogs</div>
              <RecentBlogs data={blogcatdata.Recents} />
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default BlogpageCategory;
