import React from "react";

const NextArrow = ({ fillColor }) => {
  return (
    <svg
      width="8"
      height="12"
      viewBox="0 0 8 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.523438 10.524L5.03854 5.99908L0.523438 1.47412L1.91346 0.0841036L7.82844 5.99908L1.91346 11.9141L0.523438 10.524Z"
        fill={fillColor}
      />
    </svg>
  );
};

export default NextArrow;
