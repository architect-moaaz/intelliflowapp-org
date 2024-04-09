import React from "react";
import ContentLoader from "react-content-loader";

const LoadingWrapperCard = ({ isLoading, numberOfLoaders = 1, children }) => {
  return (
    <>
      {isLoading
        ? Array.from({ length: numberOfLoaders }).map((_, index) => (
            <ContentLoader
              key={index}
              speed={2}
              viewBox="0 0 100% 200"
              backgroundColor="#f3f3f3"
              foregroundColor="#ecebeb"
              className="appdesigner-application-item"
            >
              <rect x="0" y="0" width="100%" height="100" />
              <rect x="0" y="120" width="100%" height="20" />
              <rect x="0" y="150" width="50%" height="20" />
              <rect x="55%" y="150" width="45%" height="20" />
            </ContentLoader>
          ))
        : children}
    </>
  );
};

export default LoadingWrapperCard;
