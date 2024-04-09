import React from "react";
import AppSidebar from "../../../Sidebar/AppSidebar";
import RenderForm from "../../Form/RenderForm";
import Sidebar from "../Sidebar";
import { Link, useLocation, useHistory } from "react-router-dom";
import axios from "axios";

import { Home } from "../../../../assets";
import "./RenderFormContainer.css";

const RenderFormContainer = () => {
  const Location = useLocation();
  const history = useHistory();

  const onLinkClick = async (e) => {
    e.preventDefault();
    const appName = localStorage.getItem("appName");
    const useHomepage = await checkHopePageAvailable(appName);
    if (useHomepage) {
      history.push({
        pathname: `/homepage`,
        state: { appName },
      });
    } else {
      history.push({
        pathname: `/applications`,
        state: { appName },
      });
    }
  };

  const checkHopePageAvailable = async (appName) => {
    const json5 = require("json5");
    let useHomepage = false;
    const postData = {
      workspaceName: localStorage.getItem("workspace"),
      miniAppName: appName,
      fileName: `${localStorage.getItem("workspace")}-${appName}.page`,
      fileType: "page",
    };

    await axios
      .post(
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
          "modellerService/fetchFile/content",
        postData
      )
      .then((res) => {
        if (res.data.data) {
          const parseData = res.data.data;
          var dataInput = json5.parse(parseData);
          if (dataInput.useHomepage) {
            useHomepage = true;
          } else {
            useHomepage = false;
          }
        }
      })
      .catch((e) => {
        console.log("Error ", e);
        useHomepage = false;
      });

    return useHomepage;
  };
  return (
    <div className="RenderFormContainer BodyColor">
      <div className="breadCrum BodyColor">
        <Link to="/dashboard" id="renderFormContainer-link">
          <img src={Home} alt="" />
        </Link>
        <h6 className="primaryColor">{">>"}</h6>
        <Link
        to="#"
          onClick={onLinkClick}
          className="RenderForm-breadCrum BodyColor"
          id="renderFormContainer-apps-link"
        >
          <h6 className="primaryColor">
            {localStorage.getItem("appdisplayname")?.charAt(0).toUpperCase() +
              localStorage.getItem("appdisplayname")?.slice(1)}
          </h6>
        </Link>
        <h6 className="primaryColor">{">>"}</h6>
        <Link to={null} id="renderFormContainer-appsCase">
          <h6 className="primaryColor">
            {Location.state?.path?.charAt(0).toUpperCase() +
              Location.state?.path?.slice(1)}
          </h6>
        </Link>
      </div>

      <div className="RenderForm-Body BodyColor">
        <span className="RenderForm-Sidebar secondaryColor BodyColor">
          <Sidebar />
        </span>
        <span
          //   style={{
          //     width: "calc(100vw - 300px - 120px)",
          //   }}

          className="customScrollBar renderFormContainerform secondaryColor BodyColor"
        >
          <RenderForm />
        </span>

        <span className="RenderFormContainerAppSidebar secondaryColor BodyColor">
          <AppSidebar />
        </span>
      </div>
    </div>
  );
};

export default RenderFormContainer;
