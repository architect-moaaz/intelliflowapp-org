import React, { useState, useEffect } from "react";

const ProgressiveImage = ({
  placeholderSrc,
  errorImage,
  height,
  width,
  src,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);

  const handleImageLoaded = () => {
    setLoaded(true);
  };

  return (
    <>
      {loaded ? (
        <img
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = errorImage;
          }}
          src={src}
          crossOrigin="anonymous"
          className={`image appdesignerimage`}
        />
      ) : (
        <img
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = errorImage;
          }}
          src={placeholderSrc}
          onLoad={handleImageLoaded}
          crossOrigin="anonymous"
          className={`image appdesignerimage`}
        />
      )}
    </>
  );
};

export default ProgressiveImage;
