import React from "react";
import underline from "./images/underline.png";
import purpleUnder from "./images/purpleUnder.png";
import brownUnder from "./images/brownUnder.png";
import blueUnder from "./images/blueUnder.png";
import purpleNewBG from "./images/underline-purple.png";

const SectionMweb = ({
  title,
  color,
  titleClass = "",
  sectionClass = "",
  children,
  underlineimg = true,
  isMobile = false,
}) => {
  const underlineSrc =
    color === "3E2745"
      ? purpleUnder
      : color === "403586"
      ? purpleNewBG
      : color === "443527"
      ? brownUnder
      : color === "2C466B"
      ? blueUnder
      : underline;
  return (
    <div className={`my-4 px-3 last:mb-0 overflow-hidden ${sectionClass}`}>
      {title && (
        <div
          className={`
            relative inline-block
            text-[30px] whitespace-nowrap
            tracking-[0.5px] font-bold
            ${titleClass}
          `}
          style={{
            fontFamily: "'Bobby Jones Soft Regular', cursive",
            color: `#${color || "2A6E4D"}`,
          }}
        >
          {title}

          {/* scribble underline image behind the text */}
          {underlineimg && (
            <div className="flex absolute right-0 top-[2.4rem] justify-end h-[30px]">
              <img src={underlineSrc}
                alt=""
                width={120}
                height={18}
                className="object-contain"
              loading="lazy" />
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default SectionMweb;
