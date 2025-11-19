import React from "react";

const Section = ({
  title,
  titleClass,
  sectionClass,
  children,
  styleclass = {},
}) => {
  return (
    <div className={`my-4 px-3 overflow-hidden ${sectionClass}`}>
      {title && (
        <div
          className={`text-3xl pl-4 text-[#43494B] font-outfit font-semibold ${titleClass}`}
          style={styleclass}
        >
          {title}
        </div>
      )}
      {children}
    </div>
  );
};

export default Section;
