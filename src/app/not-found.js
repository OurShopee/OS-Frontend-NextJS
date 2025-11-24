"use client";
import { MediaQueries } from "@/components/utils";
import { useRouter } from "next/navigation";
import { Container } from "react-bootstrap";
import { BsArrowLeft } from "react-icons/bs";
import { GoHome } from "react-icons/go";
const NotFound = () => {
  const { isMobile } = MediaQueries();
  const router = useRouter();
  return (
    <Container
      fluid
      className="homepagecontainer flex md:items-center justify-center min-h-[70vh]"
    >
      <div className="text-center">
        <div className="flex flex-col items-center gap-2">
          <img src="/NotFound.svg"
            alt="Page not found!"
            className="w-max h-max scale-75 md:scale-[100%]"
          loading="lazy" />
          <h1 className="!text-[40px] font-bold">Oops! Page not found</h1>
          <p className="font-normal text-[#475156] text-lg leading-5 mb-2">
            It might have been moved or updated. Let’s get you back on track.
          </p>
          <div className="flex justify-center gap-5">
            <button
              onClick={() => router.back()}
              className="active:scale-[.97] flex items-center gap-1 bg-[#5232C2] border-none uppercase text-white rounded-md px-4 py-2 text-sm"
            >
              <BsArrowLeft className="text-lg" />
              <span>Go Back</span>
            </button>
            <button
              onClick={() => router.push("/")}
              className="active:scale-[.97] flex items-center gap-1 text-[#5232C2] border-[#5232C2] uppercase bg-transparent rounded-md px-4 py-2 text-sm"
            >
              <GoHome className="text-xl" />
              <span>Go to home</span>
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default NotFound;
