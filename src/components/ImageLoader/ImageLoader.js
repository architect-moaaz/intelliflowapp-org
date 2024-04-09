import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ContentLoader from "react-content-loader";
import { v4 as uuidv4 } from "uuid"; // Import the uuid library

const ImageLoader = ({ src, alt, className, style, uniqueId }) => {
  const [isLoading, setLoading] = useState(true);
  const [isLoaded, setLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const uniqueIndex = uuidv4(); // Generate a unique identifier

  const maxRetryCount = 5;

  useEffect(() => {
    const loadImage = async () => {
      try {
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.src = src;

        image.onload = () => {
          setLoading(false);
          setLoaded(true);
        };

        image.onerror = () => {
          if (retryCount < maxRetryCount) {
            setRetryCount((prevRetryCount) => prevRetryCount + 1);
          } else {
            setLoading(false);
            setLoaded(false); // Set loaded to false on error
          }
        };
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    };

    loadImage();
  }, [src, retryCount, uniqueId]);

  console.log("style-43", style);

  return (
    <>
      {isLoading && !isLoaded && (
        <ContentLoader
          speed={2}
          width="100%"
          height="100%"
          viewBox="0 0 100% 100%"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
          className={className}
          style={style ?? {}}
        >
          <rect x="0" y="0" width="100%" height="100%" />
        </ContentLoader>
      )}
      {!isLoading && isLoaded && (
        <img
          src={src}
          alt={alt || ""}
          className={`high-resolution-image ${className}`}
          crossOrigin="anonymous"
          key={uniqueIndex}
          style={style ?? {}}
        />
      )}
      {!isLoading && !isLoaded && alt?.length > 0 && (
        <img
          src={alt}
          className={`high-resolution-image ${className}`}
          crossOrigin="anonymous"
          key={uniqueIndex}
          alt={alt}
          style={style ?? {}}
        />
      )}
    </>
  );
};

ImageLoader.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  className: PropTypes.string,
};

export default ImageLoader;
