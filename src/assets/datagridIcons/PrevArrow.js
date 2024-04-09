import React from "react";

const PrevArrow = ({fillColor}) => {
  return (
    <svg
      width="8"
      height="12"
      viewBox="0 0 8 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.47656 10.524L2.96146 5.99908L7.47656 1.47412L6.08654 0.0841036L0.171563 5.99908L6.08654 11.9141L7.47656 10.524Z"
        fill={fillColor}
      />
    </svg>
  );
};

export default PrevArrow;