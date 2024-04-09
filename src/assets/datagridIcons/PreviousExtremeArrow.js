import React from "react";

const PreviousExtremeArrow = ({ fillColor }) => {
  return (
    <svg
      width="13"
      height="12"
      viewBox="0 0 13 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.137313 6.55109L5.48383 0.435889L6.59568 1.40798L2.22126 6.41133L7.22461 10.7858L6.25252 11.8976L0.137313 6.55109ZM5.34719 6.20169L10.6937 0.0864843L11.8056 1.05858L7.43113 6.06193L12.4345 10.4363L11.4624 11.5482L5.34719 6.20169Z"
        fill={fillColor}
      />
    </svg>
  );
};

export default PreviousExtremeArrow;
