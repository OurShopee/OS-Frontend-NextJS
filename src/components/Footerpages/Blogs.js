"use client";

import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Blogslist from "@/components/Common/Blogs/Blogslist";
import Blogcategory from "@/components/Common/Blogs/BlogCategory";
import RecentBlogs from "@/components/Common/Blogs/RecentBlogs";
import { useDispatch, useSelector } from "react-redux";
import { getblogsapi } from "@/redux/globalslice";
import BreadComp from "@/components/Myaccount/BreadComp";
import { MediaQueries } from "@/components/utils";

const Blogs = () => {
  const dispatch = useDispatch();
  const blogdata = useSelector((state) => state.globalslice.blogdata);
  const { isMobile } = MediaQueries();

  useEffect(() => {
    dispatch(getblogsapi());
  }, [dispatch]);

  return (
    <Container fluid className="homepagecontainer">
      <BreadComp title={"Blog"} />
      <Row>
        <Col lg={3} md={3} sm={12}>
          <Blogcategory data={blogdata.Categories} />
          {!isMobile && (
            <div className="mobileblogcard">
              <div className="recentblogtitle">Recent Blogs</div>
              <RecentBlogs data={blogdata.Recents} />
            </div>
          )}
        </Col>
        <Col lg={9} md={3} sm={12}>
          {isMobile ? (
            <RecentBlogs data={blogdata.Recents} />
          ) : (
            <Blogslist data={blogdata.Recents} />
          )}
          {isMobile && (
            <div className="mobileblogcard">
              <div className="recentblogtitle">Recent Blogs</div>
              <RecentBlogs data={blogdata.Recents} />
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Blogs;
