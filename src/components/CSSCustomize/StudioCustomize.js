import React, { useState, useEffect } from "react";
import CreateThemeContent from "./CreateThemeContent";
import ThemeSelector from "./ThemeSelector";

const StudioCustomize = ({ setheaderTitle }) => {
  setheaderTitle("Platform Customize");
  const createTheme = (newTheme) => {
    console.log(newTheme);
  };

  return (
    <>
      <div className="main-content ">
        <div className="application-mains-customize ">
          {/* <h4>Customize your theme</h4> */}
          <ThemeSelector />
          {/* <CreateThemeContent create={ createTheme }/> */}
        </div>
      </div>
    </>
  );
};
export default StudioCustomize;
