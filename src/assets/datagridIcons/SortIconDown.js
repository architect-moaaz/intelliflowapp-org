import React from "react";

const SortIconDown = ({ fillColor }) => {
  return (
    <svg
      width="3"
      height="10"
      viewBox="0 0 3 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M2 7H0L3 10V0H2V7Z" fill={fillColor} />
    </svg>
  );
};

export default SortIconDown;
