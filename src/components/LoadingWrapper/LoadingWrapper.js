import React from "react";
import ContentLoader from "react-content-loader";

const LoadingWrapper = ({ isLoading, children }) => {
  if (isLoading) {
    return (
      <ContentLoader
        speed={2}
        width="100%"
        height="100%"
        viewBox="0 0 100% 100%"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        style={{
          height: "100%",
          width: "100%",
          objectFit: "cover",
          pointerEvents: "none",
        }}
      >
        <rect x="0" y="0" width="100%" height="100%" />
      </ContentLoader>
    );
  }

  return <>{children}</>;
};

export default LoadingWrapper;
