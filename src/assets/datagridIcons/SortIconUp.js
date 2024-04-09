import React from "react";

const SortIconUp = ({ fillColor }) => {
  return (
    <svg
      width="3"
      height="10"
      viewBox="0 0 3 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 1.5V10H1V3H3L0 0V1.5Z" fill={fillColor} />
    </svg>
  );
};

export default SortIconUp;