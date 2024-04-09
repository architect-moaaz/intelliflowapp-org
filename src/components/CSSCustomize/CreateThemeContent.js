import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { generate } from "shortid";
import _ from "lodash";
import { useTheme } from "../../theme/useTheme";
import { useRecoilState } from "recoil";
import { dynamicCssState, selectedCssState } from "../../state/atom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Link, useHistory } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ReactComponent as Duplicate } from "../../assets/NewIcon/Duplicate.svg";
import { ReactComponent as Undo } from "../../assets/NewIcon/Undo.svg";
import ColorPicker, { useColorPicker } from "react-best-gradient-color-picker";
import hexRgb from "hex-rgb";
import rgbHex from "rgb-hex";

import ReactTooltip from "react-tooltip";
import { Col, Dropdown } from "react-bootstrap";
import { ReactComponent as CreateAppScratch } from "../../assets/NewIcon/CreateAppScratch.svg";
import { ReactComponent as CreateAppExcel } from "../../assets/NewIcon/CreateAppExcel.svg";
import { ReactComponent as CreateAppTemplate } from "../../assets/NewIcon/CreateAppTemplate.svg";
import templateBoxIcon from "../../assets/NewIcon/templateBoxIcon.svg";
import ProgressiveImage from "../ProgressiveImage/ProgressiveImage";
import PublishedIcon from "../../assets/NewIcon/PublishedIcon.svg";
import { Icon } from "@iconify/react";
import {
  globalcsslightmode,
  globalcssdarkmode,
  profilepiccss,
  globalcsscustommode,
  globalcssstylemode,
  IFlogoWhiteBorder,
  searchglobalcss,
  DeleteIco,
  PropertiesIco,
  EditIcon,
  Logo100,
  ApplicationIcon,
} from "../../assets";

const Container = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, 1fr);
  margin-top: 3rem;
`;

const Section = styled.div`
  vertical-align: top;
  margin-right: 10px;
  padding: 10px;
`;

const Row = styled.div`
  padding: 5px;
`;

const Preview = styled.div`
  border: 1px solid #000000;
  border-radius: 4px;
  width: 100%;
  height: 200px;
`;

const CreateThemeContent = (props) => {
  const [cssSelected, setselectedCss] = useRecoilState(dynamicCssState);
  const [workspaceCSS, setworkspaceCSS] = useRecoilState(selectedCssState);
  const [fillHover, setFillHover] = useState(false);
  const [strokeHover, setStrokeHover] = useState(false);
  var defaultTheme = {};
  const [state, setState] = useState(defaultTheme);
  const [backcompactPicker, setBackCompactPicker] = useState("rgba(0,0,0,1)");
  const [backcompactPicker1, setBackCompactPicker1] = useState("rgba(0,0,0,1)");
  const [backcompactPicker2, setBackCompactPicker2] = useState("rgba(0,0,0,1)");
  const [backcompactPicker3, setBackCompactPicker3] = useState("rgba(0,0,0,1)");
  const [backcompactPicker4, setBackCompactPicker4] = useState("rgba(0,0,0,1)");
  const [backcompactPicker5, setBackCompactPicker5] = useState("rgba(0,0,0,1)");
  const [backcompactPicker6, setBackCompactPicker6] = useState("rgba(0,0,0,1)");

  const [showBackColorPicker, setShowBackColorPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBackColorPicker1, setShowBackColorPicker1] = useState(false);
  const [showBackColorPicker2, setShowBackColorPicker2] = useState(false);
  const [showBackColorPicker3, setShowBackColorPicker3] = useState(false);
  const [showBackColorPicker4, setShowBackColorPicker4] = useState(false);
  const [showBackColorPicker5, setShowBackColorPicker5] = useState(false);
  const [showBackColorPicker6, setShowBackColorPicker6] = useState(false);
  const [showIconColorPicker, setShowIconColorPicker] = useState(false);
  const [showColorPicker1, setShowColorPicker1] = useState(false);
  const [showColorPicker2, setShowColorPicker2] = useState(false);
  const [showColorPicker3, setShowColorPicker3] = useState(false);
  const [showColorPicker4, setShowColorPicker4] = useState(false);
  const [showColorPicker5, setShowColorPicker5] = useState(false);
  const [showColorPicker6, setShowColorPicker6] = useState(false);

  const [fontfam, setFontfam] = useState("lato");

  const [isExcelUploaded, setIsExcelUploaded] = useState(false)
  const [uploadedExcelFile, setUploadedExcelFile] = useState(false)

  useEffect(() => {
    defaultTheme = {
      default: cssSelected?.theme?.default,
      themeName: cssSelected?.theme?.name,
      headerColor: cssSelected?.theme?.colors?.header,
      headerFontColor: cssSelected?.theme?.colors?.headerFontColor,
      primaryColor: cssSelected?.theme?.colors?.primaryColor,
      secondaryColor: cssSelected?.theme?.colors?.secondaryColor,
      bgColor: cssSelected?.theme?.colors?.body,
      txtColor: cssSelected?.theme?.colors?.text,
      btnBgColor: "#000000",
      btnTxtColor: "#FFFFFF",
      linkColor: "#10BEEA",
      font: cssSelected?.theme?.font,
      iconSvgFillColor: cssSelected?.theme?.colors?.icon?.iconFillColor,
      iconSvgStrokeColor: cssSelected?.theme?.colors?.icon?.iconStrokeColor,
      iconHoverColor: cssSelected?.theme?.colors?.icon?.iconHoverColor,
      primaryButtonColor: cssSelected?.theme?.colors?.primaryButton.background,
      primaryButtonTextColor: cssSelected?.theme?.colors?.primaryButton.text,
      primaryButtonBorderColor:
        cssSelected?.theme?.colors?.primaryButton.borderColor,
      primaryButtonBorderSize:
        cssSelected?.theme?.colors?.primaryButton.borderSize,
      secondaryButtonBorderColor:
        cssSelected?.theme?.colors?.secondaryButton.borderColor,
      secondaryButtonBorderSize:
        cssSelected?.theme?.colors?.secondaryButton.borderSize,
      secondaryButtonColor:
        cssSelected?.theme?.colors?.secondaryButton.background,
      secondaryButtonTextColor:
        cssSelected?.theme?.colors?.secondaryButton.text,
    };
    setState(defaultTheme);
  }, [cssSelected]);

  const { getFonts, setMode } = useTheme();

  const [newTheme, setNewTheme] = useState({});

  const getThemeObj = () => {
    const themeObj = {};
    themeObj["Custom"] = {
      id: generate(),
      name: "Custom",
      colors: {
        header: "#" + rgbHex(backcompactPicker),
        headerFontColor: "#" + rgbHex(backcompactPicker1),
        primaryColor: "#" + rgbHex(backcompactPicker2),
        secondaryColor: "#" + rgbHex(backcompactPicker3),
        body: "#" + rgbHex(backcompactPicker4),
        text: "#" + rgbHex(backcompactPicker2),
        icon: {
          iconFillColor: "#" + rgbHex(backcompactPicker6),
          iconStrokeColor: "#" + rgbHex(backcompactPicker5),
          iconHover: state.iconHoverColor,
        },
        primaryButton: {
          text: state.primaryButtonTextColor,
          background: state.primaryButtonColor,
          borderColor: state.primaryButtonBorderColor,
          borderSize: state.primaryButtonBorderSize,
        },
        secondaryButton: {
          text: state.secondaryButtonTextColor,
          background: state.secondaryButtonColor,
          borderColor: state.secondaryButtonBorderColor,
          borderSize: state.secondaryButtonBorderSize,
        },
        link: {
          text: state.linkColor,
          opacity: 1,
        },
      },
      font: fontfam,
    };
    return themeObj;
  };

  const getThemesFromDB = () => {
    try {
      axios
        .get(
          `${process.env.REACT_APP_IDENTITY_ENDPOINT}IDENTITY/misc/getThemes`
        )
        .then((response) => {
          console.log("gottheme", response);
          let customthemedata = response.data.themes.Custom;
          setBackCompactPicker(
            hexRgb(customthemedata.colors.header, { format: "css" })
          );
          setBackCompactPicker1(
            hexRgb(customthemedata.colors.headerFontColor, { format: "css" })
          );
          setBackCompactPicker4(
            hexRgb(customthemedata.colors.body, { format: "css" })
          );
          setBackCompactPicker2(
            hexRgb(customthemedata.colors.primaryColor, { format: "css" })
          );
          setBackCompactPicker3(
            hexRgb(customthemedata.colors.secondaryColor, { format: "css" })
          );
          setState({ ...state, font: customthemedata.font });
          setFontfam(customthemedata.font);
          console.log("fomtfam", customthemedata.font);
          setBackCompactPicker5(
            hexRgb(customthemedata.colors.icon.iconStrokeColor, {
              format: "css",
            })
          );
          setBackCompactPicker6(
            hexRgb(customthemedata.colors.icon.iconFillColor, { format: "css" })
          );
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getThemesFromDB();
  }, []);

  // useEffect(() => {
  //   const updated = getThemeObj();
  //   setNewTheme({ ...updated });
  // }, [state]);

  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
    // setShowBackColorPicker(!showBackColorPicker);
    setShowColorPicker(false);
  };
  const handleBackgroundColorPicker = (backcolor) => {
    setBackCompactPicker(backcolor);
  };

  const handleBackgroundColorPicker1 = (backcolor1) => {
    setBackCompactPicker1(backcolor1);
  };

  const handleBackgroundColorPicker2 = (backcolor2) => {
    setBackCompactPicker2(backcolor2);
  };

  const handleIconColorPicker = (color) => {
    setShowIconColorPicker(color);
  }
  const handleExcelUpload = () => {
    // console.log("uploadedExcelFile", uploadedExcelFile);
    // if (uploadedExcelFile) {
    //   const formData = new FormData();
    //   formData.append("file", uploadedExcelFile);
    //   let config = {
    //     method: "post",
    //     // maxBodyLength: Infinity,
    //     url: "http://localhost:31523/IDENTITY/misc/convertThemeExceltoJson",
    //     headers: {
    //       "content-type": "form-data",
    //       "workspace": localStorage.getItem("workspace"),
    //       // "Authorization": `Bearer ${localStorage.getItem("token")}`,
    //       // ...formData.getHeaders(),
    //     },
    //     body: formData,
    //   };
    //   axios
    //     .request(config)
    //     .then((response) => {
    //       console.log("response",response);
    //       console.log(JSON.stringify(response.data));
    //     })
    //     .catch((error) => {
    //       console.log("failde due to", error);
    //     });
    // } else {
    //   console.log("No file selected");
    //   return;
    // }
    var myHeaders = new Headers();
    myHeaders.append("workspace", "Intelliflow");
    myHeaders.append(
      "Authorization",
      "Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJJNFc0WmJtTEgxWDB2alVoeXNLckx1bjEyTENXNmFJQlZBX0tCOFpoTHVBIn0.eyJleHAiOjE2ODg0NjQ3NDksImlhdCI6MTY4ODQ2MTE1NSwianRpIjoiNzdhZjMzZjgtNzdkNy00OTUxLThkOWUtZTNkNmUwNWY5MTllIiwiaXNzIjoiaHR0cHM6Ly9rYy1kZXYuaW50ZWxsaWZsb3cuaW4vcmVhbG1zL21hc3RlciIsInN1YiI6Ijk1MzlkMDZlLTgxZWItNDYwYS1iYTc5LTcwMTFlM2FmM2NkNyIsInR5cCI6IkJlYXJlciIsImF6cCI6ImFkbWluLWNsaSIsInNlc3Npb25fc3RhdGUiOiIwZWIxZmJjOC1iNGRhLTQ2ZWYtYjEyNy1iOTk3MWMzZGJkZWEiLCJhY3IiOiIxIiwic2NvcGUiOiJwcm9maWxlIGVtYWlsIG9wZW5pZCIsInNpZCI6IjBlYjFmYmM4LWI0ZGEtNDZlZi1iMTI3LWI5OTcxYzNkYmRlYSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiSW50ZWxsaWZsb3ciLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJpbmZvQGludGVsbGlmbG93LmlvIiwiZ2l2ZW5fbmFtZSI6IkludGVsbGlmbG93IiwiZmFtaWx5X25hbWUiOiIiLCJlbWFpbCI6ImluZm9AaW50ZWxsaWZsb3cuaW8ifQ.Lw2HSKE_ZM9obTmKgyCqGnokhg8G-qkQTydYVs7xXZk13kcC6J8j5eN_6kdWCp4Tw2Nto_kM6zF_ipR-2zV9LnnVWIgbiEFI9bMEtp2iUFCgw2yJ8bZm9z2DCjC0zGFAU4tpvVHooZ1rE8ieJE-B1fIltfic185svsY_fllWmjbxsLUPkmEBTfIPIRek7qC79xO4SVfmMNJKpxy0PuvEXNkw96umVm0hXCyacTxyOwjypjthtTmgu5y9Jb-BPgwJ_CCHsxl4Gv6oJmnM76QzzNXeMDFhDaCA96_yreHDIcX6yGkZuFNye4C2-7oTnJAo76TXFT0Q-yV9PVatFlwE7A"
    );

    var formdata = new FormData();
    formdata.append("file", uploadedExcelFile);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(
      process.env.REACT_APP_IDENTITY_ENDPOINT +
        "IDENTITY/misc/convertThemeExceltoJson",
      requestOptions
    ).then((response) => {
      response.text();
      setUploadedExcelFile(null);
      setIsExcelUploaded(false);
    });
    toast
      .success(`Template Uploaded successfully`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      .catch((error) => console.log("error", error));
  };

  const handleExcelDownload = () => {
    let config = {
      method: "get",
      url:
        process.env.REACT_APP_IDENTITY_ENDPOINT +
        "/IDENTITY/misc/fetchThemeAsExcel",
      responseType: "blob",
    };
    console.log(config);
    axios
      .request(config)
      .then((response) => {
        // console.log("response", response.data);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `download.xlsx`);
        document.body.appendChild(link);
        link.click();

        toast.success(`Template downloaded successfully`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleBackgroundColorPicker3 = (backcolor3) => {
    setBackCompactPicker3(backcolor3);
  };

  const handleBackgroundColorPicker4 = (backcolor4) => {
    setBackCompactPicker4(backcolor4);
  };

  const handleBackgroundColorPicker5 = (backcolor5) => {
    setBackCompactPicker5(backcolor5);
  };

  const handleBackgroundColorPicker6 = (backcolor6) => {
    setBackCompactPicker6(backcolor6);
  };

  const handleShowBackColorPicker = () => {
    setShowBackColorPicker(!showBackColorPicker);
    setShowColorPicker(false);
  };

  const handleShowBackColorPicker1 = () => {
    setShowBackColorPicker1(!showBackColorPicker1);
    setShowColorPicker1(false);
  };

  const handleShowBackColorPicker2 = () => {
    setShowBackColorPicker2(!showBackColorPicker2);
    setShowColorPicker2(false);
  };

  const handleShowIconColorPicker = () => {
    setShowIconColorPicker(!showIconColorPicker);
    setShowIconColorPicker(false);
  };

  const handleShowBackColorPicker3 = () => {
    setShowBackColorPicker3(!showBackColorPicker3);
    setShowColorPicker3(false);
  };

  const handleShowBackColorPicker4 = () => {
    setShowBackColorPicker4(!showBackColorPicker4);
    setShowColorPicker4(false);
  };

  const handleShowBackColorPicker5 = () => {
    setShowBackColorPicker5(!showBackColorPicker5);
    setShowColorPicker5(false);
  };

  const handleShowBackColorPicker6 = () => {
    setShowBackColorPicker6(!showBackColorPicker6);
    setShowColorPicker6(false);
  };

  const handleShowColorPicker = () => {
    setShowColorPicker(!showColorPicker);
    setShowBackColorPicker(false);
  };

  const createTheme = () => {
    // setState({...defaultTheme});
    let newtheme = getThemeObj();
    // console.log("nt", newtheme);
    try {
      axios
        .post(
          process.env.REACT_APP_IDENTITY_ENDPOINT + "IDENTITY/misc/saveThemes",
          newtheme
        )
        .then(async (r) => {
          toast.success("Theme saved successfully", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        })
        .catch((e) => {
          console.log("error", e);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const themeSwitcher = (selectedTheme) => {
    setMode(cssSelected.theme);
    setselectedCss(cssSelected.theme.name);

    try {
      axios
        .post(
          process.env.REACT_APP_IDENTITY_ENDPOINT + "IDENTITY/misc/saveTheme",
          { theme: cssSelected.theme.name }
        )
        .then(async (r) => {
          toast.success("Theme selected successfully", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          window.location.reload();
        })
        .catch((e) => {
          console.log("error", e);
        });
    } catch (error) {
      console.log(error);
    }
    // props.setter(selectedTheme);
  };
  if (cssSelected) {
    return (
      <>
        <div className="application-mains" style={{ marginTop: "70px" }}>
          <div className="row" style={{ height: "calc(100vh - 70px)" }}>
            <div className="col-5 pt-5">
              {" "}
              <ul class="nav nav-pills " id="pills-tab" role="tablist">
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link active bulkuploadpropertiesPopup BodyColor"
                    id="pills-tab-ifstudio"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-tab-ifstudio"
                    type="button"
                    role="tab"
                    aria-controls="pills-tab-ifstudio"
                    aria-selected="true"
                    data-mdb-toggle="tab"
                    // onClick={() => {
                    //   setShowTemplateSection(true);
                    //   setShowUploadSection(false);
                    // }}
                  >
                    Basic
                  </button>
                </li>
                <Link
                  id="header-menu-app-store"
                  to="/customize"
                  className="header-menu-dropdown-item"
                >
                  <li
                    class="nav-item"
                    role="presentation"
                    style={{ marginLeft: "100px" }}
                  >
                    <button
                      class="nav-link bulkuploadpropertiesPopup"
                      id="pills-tab-ifcenter"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-tab-ifcenter"
                      type="button"
                      role="tab"
                      aria-controls="pills-tab-ifcenter"
                      aria-selected="false"
                      data-mdb-toggle="tab"
                      // onClick={() => {
                      //   setShowUploadSection(true);
                      //   setShowTemplateSection(false);
                      // }}
                    >
                      Magic
                    </button>
                  </li>
                </Link>
              </ul>
              <p className="customTheme primaryColor">Custom Theme Creator</p>
              <p className="guideline secondaryColor">
                Make Your Custom theme to fit your brand guidlines
              </p>
              <div className="row">
                <div className="col-5">
                  {" "}
                  <p className="headercolor secondaryColor"> Header Colour</p>
                  <div className="headerinput">
                    <div
                      className="colorBox"
                      style={{ background: backcompactPicker }}
                      onClick={handleShowBackColorPicker}
                      data-tip
                      data-for="11"
                      id="styleComponent-textBackgroundColor"
                    >
                      <ReactTooltip id="11" place="top" effect="solid">
                        Header Color
                      </ReactTooltip>
                    </div>

                    <p className="globalccshex">
                      {`#${rgbHex(backcompactPicker)}`
                        ?.substring(
                          0,
                          `#${rgbHex(backcompactPicker)}`?.length - 0
                        )
                        .toUpperCase()}
                    </p>
                  </div>
                  <div
                    className={
                      showBackColorPicker == true
                        ? "displayColorShowglobal "
                        : "displayColorHide "
                    }
                  >
                    <ColorPicker
                      hideAdvancedSliders="false"
                      hideColorGuide="false"
                      hideInputType="false"
                      value={backcompactPicker}
                      onChange={handleBackgroundColorPicker}
                      height="125"
                      width="250"
                      id="styleComponent-handleBackgroundColorPicker-colorPicker"
                    />
                  </div>
                </div>
                <div className="col-7">
                  <p className="headertextcolor secondaryColor">
                    {" "}
                    Header Text Colour
                  </p>
                  <div className="headertextinput">
                    <div
                      className="colorBox"
                      style={{ background: backcompactPicker1 }}
                      onClick={handleShowBackColorPicker1}
                      data-tip
                      data-for="12"
                      id="styleComponent-textBackgroundColor"
                    >
                      <ReactTooltip id="12" place="top" effect="solid">
                        Header Text Colour
                      </ReactTooltip>
                    </div>

                    <p className="globalccshex">
                      {`#${rgbHex(backcompactPicker1)}`
                        ?.substring(
                          0,
                          `#${rgbHex(backcompactPicker1)}`?.length - 0
                        )
                        .toUpperCase()}
                    </p>
                  </div>
                  <div
                    className={
                      showBackColorPicker1 == true
                        ? "displayColorShowglobal1 "
                        : "displayColorHide "
                    }
                  >
                    <ColorPicker
                      hideAdvancedSliders="false"
                      hideColorGuide="false"
                      hideInputType="false"
                      value={backcompactPicker1}
                      onChange={handleBackgroundColorPicker1}
                      height="125"
                      width="250"
                      id="styleComponent-handleBackgroundColorPicker-colorPicker"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-5">
                  {" "}
                  <p className="primarycoloriplayout secondaryColor">
                    {" "}
                    Primary Font Colour
                  </p>
                  <div className="primaryinput">
                    <div
                      className="colorBox"
                      style={{ background: backcompactPicker2 }}
                      onClick={handleShowBackColorPicker2}
                      data-tip
                      data-for="13"
                      id="styleComponent-textBackgroundColor"
                    >
                      <ReactTooltip id="13" place="top" effect="solid">
                        Primary Font Colour
                      </ReactTooltip>
                    </div>
                    <p className="globalccshex">
                      {`#${rgbHex(backcompactPicker2)}`
                        ?.substring(
                          0,
                          `#${rgbHex(backcompactPicker2)}`?.length - 0
                        )
                        .toUpperCase()}
                    </p>
                  </div>
                  <div
                    className={
                      showBackColorPicker2 == true
                        ? "displayColorShowglobal1 "
                        : "displayColorHide "
                    }
                  >
                    <ColorPicker
                      hideAdvancedSliders="false"
                      hideColorGuide="false"
                      hideInputType="false"
                      value={backcompactPicker2}
                      onChange={handleBackgroundColorPicker2}
                      height="125"
                      width="250"
                      id="styleComponent-handleBackgroundColorPicker-colorPicker"
                    />
                  </div>
                </div>
                <div className="col-7">
                  <p className="secondarycoloriplayout secondaryColor">
                    Secondary Font Colour
                  </p>
                  <div className="headertextinput">
                    <div
                      className="colorBox"
                      style={{ background: backcompactPicker3 }}
                      onClick={handleShowBackColorPicker3}
                      data-tip
                      data-for="14"
                      id="styleComponent-textBackgroundColor"
                    >
                      <ReactTooltip id="14" place="top" effect="solid">
                        Secondary Font Colour
                      </ReactTooltip>
                    </div>
                    <p className="globalccshex">
                      {`#${rgbHex(backcompactPicker3)}`
                        ?.substring(
                          0,
                          `#${rgbHex(backcompactPicker3)}`?.length - 0
                        )
                        .toUpperCase()}
                    </p>
                  </div>
                  <div
                    className={
                      showBackColorPicker3 == true
                        ? "displayColorShowglobal2 "
                        : "displayColorHide "
                    }
                  >
                    <ColorPicker
                      hideAdvancedSliders="false"
                      hideColorGuide="false"
                      hideInputType="false"
                      value={backcompactPicker3}
                      onChange={handleBackgroundColorPicker3}
                      height="125"
                      width="250"
                      id="styleComponent-handleBackgroundColorPicker-colorPicker"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-5">
                  {" "}
                  <p className="primarycoloriplayout secondaryColor">
                    {" "}
                    Background Colour
                  </p>
                  <div className="primaryinput">
                    <div
                      className="colorBox"
                      style={{ background: backcompactPicker4 }}
                      onClick={handleShowBackColorPicker4}
                      data-tip
                      data-for="11"
                      id="styleComponent-textBackgroundColor"
                    >
                      <ReactTooltip id="11" place="top" effect="solid">
                        Background Colour
                      </ReactTooltip>
                    </div>
                    <p className="globalccshex">
                      {`#${rgbHex(backcompactPicker4)}`
                        ?.substring(
                          0,
                          `#${rgbHex(backcompactPicker4)}`?.length - 0
                        )
                        .toUpperCase()}
                    </p>
                  </div>
                  <div
                    className={
                      showBackColorPicker4 == true
                        ? "displayColorShowglobal1 "
                        : "displayColorHide "
                    }
                  >
                    <ColorPicker
                      hideAdvancedSliders="false"
                      hideColorGuide="false"
                      hideInputType="false"
                      value={backcompactPicker4}
                      onChange={handleBackgroundColorPicker4}
                      height="125"
                      width="250"
                      id="styleComponent-handleBackgroundColorPicker-colorPicker"
                    />
                  </div>
                </div>
                <div className="col-7">
                  {" "}
                  <p className="secondarycoloriplayout secondaryColor">
                    Icon Stroke Colour
                  </p>
                  <div className="headertextinput">
                    <div
                      className="colorBox"
                      style={{ background: backcompactPicker5 }}
                      onClick={handleShowBackColorPicker5}
                      data-tip
                      data-for="15"
                      id="styleComponent-textBackgroundColor"
                    >
                      <ReactTooltip id="15" place="top" effect="solid">
                        Icon stroke color
                      </ReactTooltip>
                    </div>
                    <p className="globalccshex">
                      {`#${rgbHex(backcompactPicker5)}`
                        ?.substring(
                          0,
                          `#${rgbHex(backcompactPicker5)}`?.length - 0
                        )
                        .toUpperCase()}
                    </p>
                  </div>
                  <div
                    className={
                      showBackColorPicker5 == true
                        ? "displayColorShowglobal1 "
                        : "displayColorHide "
                    }
                  >
                    <ColorPicker
                      hideAdvancedSliders="false"
                      hideColorGuide="false"
                      hideInputType="false"
                      value={backcompactPicker5}
                      onChange={handleBackgroundColorPicker5}
                      height="125"
                      width="250"
                      id="styleComponent-handleBackgroundColorPicker-colorPicker"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-5">
                  {" "}
                  <p className="primarycoloriplayout secondaryColor">
                    Icon Fill Colour
                  </p>
                  <div className="primaryinput">
                    <div
                      className="colorBox"
                      style={{ background: backcompactPicker6 }}
                      onClick={handleShowBackColorPicker6}
                      data-tip
                      data-for="16"
                      id="styleComponent-textBackgroundColor"
                    >
                      <ReactTooltip id="16" place="top" effect="solid">
                        Icon fill color
                      </ReactTooltip>
                    </div>
                    <p className="globalccshex">
                      {`#${rgbHex(backcompactPicker6)}`
                        ?.substring(
                          0,
                          `#${rgbHex(backcompactPicker6)}`?.length - 0
                        )
                        .toUpperCase()}
                    </p>
                  </div>
                  <div
                    className={
                      showBackColorPicker6 == true
                        ? "displayColorShowglobal1 "
                        : "displayColorHide "
                    }
                  >
                    <ColorPicker
                      hideAdvancedSliders="false"
                      hideColorGuide="false"
                      hideInputType="false"
                      value={backcompactPicker6}
                      onChange={handleBackgroundColorPicker6}
                      height="125"
                      width="250"
                      id="styleComponent-handleBackgroundColorPicker-colorPicker"
                    />
                  </div>
                </div>
                <div className="col-7">
                  <p className="secondarycoloriplayout secondaryColor">Font</p>

                  <select
                    className="headertextinput"
                    disabled={state.default}
                    name="font"
                    id="font"
                    onChange={(e) => setFontfam(e.target.value)}
                    value={fontfam}
                  >
                    {getFonts().map((font, index) => (
                      <option value={font} key={index}>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* <div className="customstyle"></div> */}
              <button
                className="btn btn-lg btn-orange-white m-4 p-2 saveButtonColor"
                onClick={createTheme}
                disabled={state.default}
              >
                Save Theme
              </button>
              <button
                className="btn btn-lg btn-orange-white m-4 p-2 primaryButtonColor"
                // onClick={themeSwitcher}
              >
                Reset
              </button>
            </div>
            <div className="globalcssright col-7">
              {/* <p className="selectpage">Select Page</p> */}
              <div>
                {/* <select className="cssinput">
            <option value="designer"> App Designer </option>
            <option value="store"> App Store</option>
          </select> */}
                <div
                  className="previewappdesigner"
                  style={{
                    backgroundColor: backcompactPicker,
                    color: backcompactPicker1,
                    fontFamily: fontfam,
                  }}
                >
                  <img
                    className="previewlogoglobalcss"
                    src={IFlogoWhiteBorder}
                  />
                  <span className="previewappdesignerspan ">App Designer</span>
                  <img className="searchglobalcss" src={searchglobalcss} />

                  <span className="profilenameglobalcss ">Jessica Pearson</span>
                  <span className="designationcss">Product Manager</span>
                  <img className="profilepiccss" src={profilepiccss} />
                </div>
                <div className="your-applicationglobalcss customScrollBar">
                  <div
                    className={"previewappdesignerbody "}
                    style={{
                      backgroundColor: backcompactPicker4,
                      color: backcompactPicker2,
                      fontFamily: fontfam,
                    }}
                  >
                    <p
                      className="Createnewcss"
                      // onClick={() => console.log("themeg", theme)}
                    >
                      {" "}
                      Create New
                    </p>

                    <div
                      className="create-app-wrapper-globalcss customScrollBar"
                      style={{ color: backcompactPicker3 }}
                    >
                      <div className="create-app-box-globalcss">
                        <div>
                          <CreateAppScratch
                            className=""
                            style={{
                              width: "50px",
                              marginLeft: "-6px",
                              stroke: backcompactPicker5,
                              fill: backcompactPicker6,
                            }}
                          />
                        </div>
                        <div className="create-app-scratch">
                          <h5
                            className="create-app-title-globalcss"
                            style={{ color: backcompactPicker2 }}
                          >
                            {"Create Application"}
                          </h5>
                          <p
                            className="create-app-subtitle-globalcss"
                            style={{ backcompactPicker3 }}
                          >
                            {"Start From Scratch"}
                          </p>
                        </div>
                      </div>

                      <div className="create-app-box-globalcss">
                        <div className="create-app-icon">
                          <CreateAppExcel
                            className=""
                            style={{
                              width: "50px",
                              marginLeft: "-6px",
                              stroke: backcompactPicker5,
                              // fill: backcompactPicker6,
                            }}
                          />
                        </div>
                        <div className="create-app-scratch">
                          <h5
                            className="create-app-title-globalcss1"
                            style={{ color: backcompactPicker2 }}
                          >
                            {"Create Application From Excel"}{" "}
                          </h5>
                          <p
                            className="create-app-subtitle-globalcss1"
                            style={{ color: backcompactPicker3 }}
                          >
                            {"Generate From Spreadsheet"}
                          </p>
                        </div>
                      </div>

                      <div className="create-app-box-globalcss">
                        <div className="create-app-icon">
                          <CreateAppTemplate
                            className=""
                            style={{
                              width: "50px",
                              marginLeft: "-6px",
                              stroke: backcompactPicker5,
                              // fill: backcompactPicker6,
                            }}
                          />
                        </div>
                        <div className="create-app-scratch">
                          <h5
                            className="create-app-title-globalcss2"
                            style={{ color:backcompactPicker2 }}
                          >
                            {"Create Application From Template"}
                          </h5>
                          <p
                            className="create-app-subtitle-globalcss2"
                            style={{ color:backcompactPicker3 }}
                          >
                            {"Inspired By App Template"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      id="pillApps"
                      className="application-title-wrap-preview py-2  col-10"
                      style={{ backgroundColor: backcompactPicker4 }}
                    >
                      <div>
                      <ul class="nav nav-pills" id="pills-tab" role="tablist">
                        <li class="nav-item " role="presentation">
                          <label
                            class={`nav-link  propertiesPopup yourAppsLabel  `}
                            id="pills-tab-ifapps"
                            data-bs-toggle="pill"
                            data-bs-target="#pills-ifapps"
                            type="button"
                            role="tab"
                            aria-controls="pills-ifapps"
                            data-mdb-toggle="tab"
                          >
                            <h4
                              className="yourAppTabglobalcss "
                              style={{ color: backcompactPicker2 }}
                            >
                              {" "}
                              {"Application"}
                            </h4>
                          </label>
                        </li>
                        <li
                          class="nav-item"
                          role="presentation"
                          style={{ marginLeft: "10px" }}
                        >
                          <label
                            class={`nav-link  propertiesPopup yourAppsLabel `}
                            id="pills-tab-iftemp"
                            data-bs-toggle="pill"
                            data-bs-target="#pills-iftemp"
                            type="button"
                            role="tab"
                            aria-controls="pills-tab-ifcenter"
                            data-mdb-toggle="tab"
                          >
                            <h4
                              className="yourAppTabglobalcss "
                              style={{ color: backcompactPicker2 }}
                            >
                              {"Template"}
                            </h4>
                          </label>
                        </li>
                      </ul>
                      </div>
                      <div className="">
                      <ul className="horizontal-list">
                        <li>
                          <Dropdown className="dropdown">
                            <Dropdown.Toggle
                              variant=""
                              className="p-0 "
                              id="dropdown-basic"
                              style={{ color: backcompactPicker2 }}
                            >
                              <Icon icon="gg:sort-za" className="" vFlip={true}/>
                              {"sort"}
                            </Dropdown.Toggle>

                            <Dropdown.Menu
                              className=""
                              style={{ backgroundColor: backcompactPicker4 }}
                            >
                              <h5
                                className="dropdown-title"
                                style={{ color: backcompactPicker2 }}
                              >
                                {"sort"}
                              </h5>
                              <Dropdown.Item
                                id="yourApp-sort-new"
                                className=""
                                style={{ color: backcompactPicker3 }}
                              >
                                {"newOld"}
                              </Dropdown.Item>
                              <Dropdown.Item
                                id="yourApp-sort-old"
                                className=""
                                style={{ color: backcompactPicker3 }}
                              >
                                {"oldNew"}
                              </Dropdown.Item>

                              <Dropdown.Item
                                id="yourApp-sort-name"
                                href="#"
                                className=""
                                style={{ color: backcompactPicker3 }}
                              >
                                {"az"}
                              </Dropdown.Item>
                              <Dropdown.Item
                                id="yourApp-sort-name-rev"
                                href="#"
                                className=""
                                style={{ color: backcompactPicker3 }}
                              >
                                {"za"}
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </li>
                        <li>
                          <Dropdown>
                            <Dropdown.Toggle
                              variant=""
                              className="p-0 "
                              id="dropdown-basic"
                              style={{ color: backcompactPicker2 }}
                            >
                              <Icon
                                icon="bx:filter-alt"
                                className=""
                                vFlip={false}
                              />
                              {"filter"}
                            </Dropdown.Toggle>
                            <Dropdown.Menu
                              className=""
                              style={{ backgroundColor: backcompactPicker4 }}
                            >
                              <h4
                                className="dropdown-title"
                                style={{ color: backcompactPicker2 }}
                              >
                                {"filter"}
                              </h4>
                              <div className="dropdown-item dropdown-option-container">
                                <label className="" style={{ color: backcompactPicker3 }}>
                                  {"mobile"}
                                </label>
                                <input
                                  type="checkbox"
                                  className="form-check-input me-3"
                                  name="M"
                                ></input>
                              </div>
                              <div className=" dropdown-item dropdown-option-container">
                                <label className=""  style={{ color: backcompactPicker3 }}>
                                  {"web"}
                                </label>
                                <input
                                  type="checkbox"
                                  className="form-check-input me-3"
                                  name="D"
                                ></input>
                              </div>
                              <div className=" dropdown-item dropdown-option-container">
                                <label className=""  style={{ color: backcompactPicker3 }}>Others</label>
                                <input
                                  type="checkbox"
                                  className="form-check-input me-3"
                                  name="U"
                                ></input>
                              </div>
                            </Dropdown.Menu>
                          </Dropdown>
                        </li>
                      </ul>
                      </div>
                    </div>
                    <div className="tab-content">
                      <div className="appdesigner-application-wrap-preview">
                        <div className="appdesigner-application-item-globalcss1">
                          <Dropdown className="dropdown kebabMenu">
                            <Dropdown.Toggle
                              variant=""
                              className="p-0"
                              id="dropdown-basic"
                            >
                              <svg
                                width="4"
                                height="18"
                                viewBox="0 0 4 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M2 10C2.55228 10 3 9.55228 3 9C3 8.44772 2.55228 8 2 8C1.44772 8 1 8.44772 1 9C1 9.55228 1.44772 10 2 10Z"
                                  stroke="#A9BBC9"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M2 3C2.55228 3 3 2.55228 3 2C3 1.44772 2.55228 1 2 1C1.44772 1 1 1.44772 1 2C1 2.55228 1.44772 3 2 3Z"
                                  stroke="#A9BBC9"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M2 17C2.55228 17 3 16.5523 3 16C3 15.4477 2.55228 15 2 15C1.44772 15 1 15.4477 1 16C1 16.5523 1.44772 17 2 17Z"
                                  stroke="#A9BBC9"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            </Dropdown.Toggle>
                            {/* <Dropdown.Menu className=" appdesigner-dropdownn ">
                              <Dropdown.Item
                                tag={Link}
                                to={{
                                  pathname: ``,
                                  state: {},
                                }}
                                id="create-app-delete-dropdown"
                                className="BodyColor primaryColor"
                              >
                                {" "}
                                <img src={DeleteIco} height="30px" /> Delete
                              </Dropdown.Item>

                              <Dropdown.Item
                                tag={Link}
                                to={{
                                  pathname: ``,
                                  state: {},
                                }}
                                href="#"
                                id="create-app-properties-dropdown"
                                className="BodyColor primaryColor"
                              >
                                <img src={PropertiesIco} />
                                Properties
                              </Dropdown.Item>

                              <Dropdown.Item className=" primaryColor">
                                <Link
                                  className="btn btn-edit primaryColor "
                                  id="create-app-edit-app-dropdown"
                                >
                                  <img src={EditIcon} />
                                  Edit Application
                                </Link>
                              </Dropdown.Item>
                            </Dropdown.Menu> */}
                          </Dropdown>
                          <div className="insidecardglobalcss">
                            <div className="application-box-img-globalcss mt-1">
                              <img
                                src={Logo100}
                                className="appdesignerimage-globalcss"
                                alt="App Logo"
                              />
                            </div>
                            <div className="application-box-info-globalcss">
                              <h5 className="primaryColor">
                                <i>
                                  <img
                                    alt=""
                                    id="application-box-image-globalcss"
                                    src={ApplicationIcon}
                                  />
                                </i>
                                <span
                                  className="cardName secondaryColor"
                                  data-tip
                                  id="application-card-name"
                                >
                                  Appname
                                </span>
                              </h5>
                              <span
                                style={{
                                  color: "#8a8a8a",
                                  fontStyle: "normal",
                                  fontWeight: "500",
                                  fontSize: "12px",
                                  display: "block",
                                  margin: "0px 0 10px",
                                  marginTop: "-9px",
                                }}
                                id="application-card-date-globalcss secondaryColor"
                              >
                                14-07-2023
                              </span>
                              <div className="application-status-wrap">
                                <img
                                  className="application-card-status-globalcss"
                                  src={PublishedIcon}
                                />
                              </div>
                            </div>
                            <div className="application-box-wrap-globalcss">
                              <Link
                                id="application-card-edit"
                                className="btn btn-edit"
                              >
                                {"Edit"}
                              </Link>
                              <Link
                                id="application-card-properties"
                                className="application-card-properties-globalcss"
                              >
                                {"Properties"}
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="appdesigner-application-item-globalcss1 ">
                          <Dropdown className="dropdown kebabMenu">
                            <Dropdown.Toggle
                              variant=""
                              className="p-0"
                              id="dropdown-basic"
                            >
                              <svg
                                width="4"
                                height="18"
                                viewBox="0 0 4 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M2 10C2.55228 10 3 9.55228 3 9C3 8.44772 2.55228 8 2 8C1.44772 8 1 8.44772 1 9C1 9.55228 1.44772 10 2 10Z"
                                  stroke="#A9BBC9"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M2 3C2.55228 3 3 2.55228 3 2C3 1.44772 2.55228 1 2 1C1.44772 1 1 1.44772 1 2C1 2.55228 1.44772 3 2 3Z"
                                  stroke="#A9BBC9"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M2 17C2.55228 17 3 16.5523 3 16C3 15.4477 2.55228 15 2 15C1.44772 15 1 15.4477 1 16C1 16.5523 1.44772 17 2 17Z"
                                  stroke="#A9BBC9"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            </Dropdown.Toggle>
                            {/* <Dropdown.Menu className=" appdesigner-dropdownn ">
                              <Dropdown.Item
                                tag={Link}
                                to={{
                                  pathname: ``,
                                  state: {},
                                }}
                                id="create-app-delete-dropdown"
                                className=" primaryColor"
                              >
                                {" "}
                                <img src={DeleteIco} height="30px" /> Delete
                              </Dropdown.Item>

                              <Dropdown.Item
                                tag={Link}
                                to={{
                                  pathname: ``,
                                  state: {},
                                }}
                                href="#"
                                id="create-app-properties-dropdown"
                                className="BodyColor primaryColor"
                              >
                                <img src={PropertiesIco} />
                                Properties
                              </Dropdown.Item>

                              <Dropdown.Item className="BodyColor primaryColor">
                                <Link
                                  className="btn btn-edit primaryColor BodyColor"
                                  id="create-app-edit-app-dropdown"
                                >
                                  <img src={EditIcon} />
                                  Edit Application
                                </Link>
                              </Dropdown.Item>
                            </Dropdown.Menu> */}
                          </Dropdown>
                          <div className="insidecardglobalcss">
                            <div className="application-box-img-globalcss mt-1">
                              <img
                                src={Logo100}
                                className="appdesignerimage-globalcss"
                                alt="App Logo"
                              />
                            </div>
                            <div className="application-box-info-globalcss">
                              <h5 className="primaryColor">
                                <i>
                                  <img
                                    alt=""
                                    id="application-box-image-globalcss"
                                    src={ApplicationIcon}
                                  />
                                </i>
                                <span
                                  className="cardName secondaryColor"
                                  data-tip
                                  id="application-card-name"
                                >
                                  Appname
                                </span>
                              </h5>
                              <span
                                style={{
                                  color: "#8a8a8a",
                                  fontStyle: "normal",
                                  fontWeight: "500",
                                  fontSize: "12px",
                                  display: "block",
                                  margin: "0px 0 10px",
                                  marginTop: "-9px",
                                }}
                                id="application-card-date-globalcss secondaryColor"
                              >
                                14-07-2023
                              </span>
                              <div className="application-status-wrap">
                                <img
                                  className="application-card-status-globalcss"
                                  src={PublishedIcon}
                                />
                              </div>
                            </div>
                            <div className="application-box-wrap-globalcss">
                              <Link
                                id="application-card-edit"
                                className="btn btn-edit"
                              >
                                {"Edit"}
                              </Link>
                              <Link
                                id="application-card-properties"
                                className="application-card-properties-globalcss"
                              >
                                {"Properties"}
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="appdesigner-application-item-globalcss1 ">
                          <Dropdown className="dropdown kebabMenu">
                            <Dropdown.Toggle
                              variant=""
                              className="p-0"
                              id="dropdown-basic"
                            >
                              <svg
                                width="4"
                                height="18"
                                viewBox="0 0 4 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M2 10C2.55228 10 3 9.55228 3 9C3 8.44772 2.55228 8 2 8C1.44772 8 1 8.44772 1 9C1 9.55228 1.44772 10 2 10Z"
                                  stroke="#A9BBC9"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M2 3C2.55228 3 3 2.55228 3 2C3 1.44772 2.55228 1 2 1C1.44772 1 1 1.44772 1 2C1 2.55228 1.44772 3 2 3Z"
                                  stroke="#A9BBC9"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M2 17C2.55228 17 3 16.5523 3 16C3 15.4477 2.55228 15 2 15C1.44772 15 1 15.4477 1 16C1 16.5523 1.44772 17 2 17Z"
                                  stroke="#A9BBC9"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            </Dropdown.Toggle>
                            {/* <Dropdown.Menu className=" appdesigner-dropdownn BodyColor">
                              <Dropdown.Item
                                tag={Link}
                                to={{
                                  pathname: ``,
                                  state: {},
                                }}
                                id="create-app-delete-dropdown"
                                className="BodyColor primaryColor"
                              >
                                {" "}
                                <img src={DeleteIco} height="30px" /> Delete
                              </Dropdown.Item>

                              <Dropdown.Item
                                tag={Link}
                                to={{
                                  pathname: ``,
                                  state: {},
                                }}
                                href="#"
                                id="create-app-properties-dropdown"
                                className="BodyColor primaryColor"
                              >
                                <img src={PropertiesIco} />
                                Properties
                              </Dropdown.Item>

                              <Dropdown.Item className=" primaryColor">
                                <Link
                                  className="btn btn-edit primaryColor "
                                  id="create-app-edit-app-dropdown"
                                >
                                  <img src={EditIcon} />
                                  Edit Application
                                </Link>
                              </Dropdown.Item>
                            </Dropdown.Menu> */}
                          </Dropdown>
                          <div className="insidecardglobalcss">
                            <div className="application-box-img-globalcss mt-1">
                              <img
                                src={Logo100}
                                className="appdesignerimage-globalcss"
                                alt="App Logo"
                              />
                            </div>
                            <div className="application-box-info-globalcss">
                              <h5 className="primaryColor">
                                <i>
                                  <img
                                    alt=""
                                    id="application-box-image-globalcss"
                                    src={ApplicationIcon}
                                  />
                                </i>
                                <span
                                  className="cardName secondaryColor"
                                  data-tip
                                  id="application-card-name"
                                >
                                  Appname
                                </span>
                              </h5>
                              <span
                                style={{
                                  color: "#8a8a8a",
                                  fontStyle: "normal",
                                  fontWeight: "500",
                                  fontSize: "12px",
                                  display: "block",
                                  margin: "0px 0 10px",
                                  marginTop: "-9px",
                                }}
                                id="application-card-date-globalcss secondaryColor"
                              >
                                14-07-2023
                              </span>
                              <div className="application-status-wrap">
                                <img
                                  className="application-card-status-globalcss"
                                  src={PublishedIcon}
                                />
                              </div>
                            </div>
                            <div className="application-box-wrap-globalcss">
                              <Link
                                id="application-card-edit"
                                className="btn btn-edit"
                              >
                                {"Edit"}
                              </Link>
                              <Link
                                id="application-card-properties"
                                className="application-card-properties-globalcss"
                              >
                                {"Properties"}
                              </Link>
                            </div>
                          </div>
                        </div>
                        {/* <div className="appdesigner-application-item-globalcss1 BodyColor">
                    <Dropdown className="dropdown kebabMenu">
                      <Dropdown.Toggle
                        variant=""
                        className="p-0"
                        id="dropdown-basic"
                      >
                        <svg
                          width="4"
                          height="18"
                          viewBox="0 0 4 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2 10C2.55228 10 3 9.55228 3 9C3 8.44772 2.55228 8 2 8C1.44772 8 1 8.44772 1 9C1 9.55228 1.44772 10 2 10Z"
                            stroke="#A9BBC9"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M2 3C2.55228 3 3 2.55228 3 2C3 1.44772 2.55228 1 2 1C1.44772 1 1 1.44772 1 2C1 2.55228 1.44772 3 2 3Z"
                            stroke="#A9BBC9"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M2 17C2.55228 17 3 16.5523 3 16C3 15.4477 2.55228 15 2 15C1.44772 15 1 15.4477 1 16C1 16.5523 1.44772 17 2 17Z"
                            stroke="#A9BBC9"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </Dropdown.Toggle>
                      <Dropdown.Menu className=" appdesigner-dropdownn BodyColor">
                        <Dropdown.Item
                          tag={Link}
                          to={{
                            pathname: ``,
                            state: {},
                          }}
                          id="create-app-delete-dropdown"
                          className="BodyColor primaryColor"
                        >
                          {" "}
                          <img src={DeleteIco} height="30px" /> Delete
                        </Dropdown.Item>

                        <Dropdown.Item
                          tag={Link}
                          to={{
                            pathname: ``,
                            state: {},
                          }}
                          href="#"
                          id="create-app-properties-dropdown"
                          className="BodyColor primaryColor"
                        >
                          <img src={PropertiesIco} />
                          Properties
                        </Dropdown.Item>

                        <Dropdown.Item className="BodyColor primaryColor">
                          <Link
                            className="btn btn-edit primaryColor BodyColor"
                            id="create-app-edit-app-dropdown"
                          >
                            <img src={EditIcon} />
                            Edit Application
                          </Link>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    <div className="insidecardglobalcss">
                      <div className="application-box-img-globalcss mt-1">
                        <img
                          src={Logo100}
                          className="appdesignerimage-globalcss"
                          alt="App Logo"
                        />
                      </div>
                      <div className="application-box-info-globalcss">
                        <h5 className="primaryColor">
                          <i>
                            <img
                              alt=""
                              id="application-box-image-globalcss"
                              src={ApplicationIcon}
                            />
                          </i>
                          <span
                            className="cardName secondaryColor"
                            data-tip
                            id="application-card-name"
                          >
                            Appname
                          </span>
                        </h5>
                        <span
                          style={{
                            color: "#8a8a8a",
                            fontStyle: "normal",
                            fontWeight: "500",
                            fontSize: "12px",
                            display: "block",
                            margin: "0px 0 10px",
                            marginTop: "-9px",
                          }}
                          id="application-card-date-globalcss secondaryColor"
                        >
                          14-07-2023
                        </span>
                        <div className="application-status-wrap">
                          <img
                            className="application-card-status-globalcss"
                            src={PublishedIcon}
                          />
                        </div>
                      </div>
                      <div className="application-box-wrap-globalcss">
                        <Link
                          id="application-card-edit"
                          className="btn btn-edit"
                        >
                          {"Edit"}
                        </Link>
                        <Link
                          id="application-card-properties"
                          className="application-card-properties-globalcss"
                        >
                          {"Properties"}
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="appdesigner-application-item-globalcss1 BodyColor">
                    <Dropdown className="dropdown kebabMenu">
                      <Dropdown.Toggle
                        variant=""
                        className="p-0"
                        id="dropdown-basic"
                      >
                        <svg
                          width="4"
                          height="18"
                          viewBox="0 0 4 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2 10C2.55228 10 3 9.55228 3 9C3 8.44772 2.55228 8 2 8C1.44772 8 1 8.44772 1 9C1 9.55228 1.44772 10 2 10Z"
                            stroke="#A9BBC9"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M2 3C2.55228 3 3 2.55228 3 2C3 1.44772 2.55228 1 2 1C1.44772 1 1 1.44772 1 2C1 2.55228 1.44772 3 2 3Z"
                            stroke="#A9BBC9"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M2 17C2.55228 17 3 16.5523 3 16C3 15.4477 2.55228 15 2 15C1.44772 15 1 15.4477 1 16C1 16.5523 1.44772 17 2 17Z"
                            stroke="#A9BBC9"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </Dropdown.Toggle>
                      <Dropdown.Menu className=" appdesigner-dropdownn BodyColor">
                        <Dropdown.Item
                          tag={Link}
                          to={{
                            pathname: ``,
                            state: {},
                          }}
                          id="create-app-delete-dropdown"
                          className="BodyColor primaryColor"
                        >
                          {" "}
                          <img src={DeleteIco} height="30px" /> Delete
                        </Dropdown.Item>

                        <Dropdown.Item
                          tag={Link}
                          to={{
                            pathname: ``,
                            state: {},
                          }}
                          href="#"
                          id="create-app-properties-dropdown"
                          className="BodyColor primaryColor"
                        >
                          <img src={PropertiesIco} />
                          Properties
                        </Dropdown.Item>

                        <Dropdown.Item className="BodyColor primaryColor">
                          <Link
                            className="btn btn-edit primaryColor BodyColor"
                            id="create-app-edit-app-dropdown"
                          >
                            <img src={EditIcon} />
                            Edit Application
                          </Link>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    <div className="insidecardglobalcss">
                      <div className="application-box-img-globalcss mt-1">
                        <img
                          src={Logo100}
                          className="appdesignerimage-globalcss"
                          alt="App Logo"
                        />
                      </div>
                      <div className="application-box-info-globalcss">
                        <h5 className="primaryColor">
                          <i>
                            <img
                              alt=""
                              id="application-box-image-globalcss"
                              src={ApplicationIcon}
                            />
                          </i>
                          <span
                            className="cardName secondaryColor"
                            data-tip
                            id="application-card-name"
                          >
                            Appname
                          </span>
                        </h5>
                        <span
                          style={{
                            color: "#8a8a8a",
                            fontStyle: "normal",
                            fontWeight: "500",
                            fontSize: "12px",
                            display: "block",
                            margin: "0px 0 10px",
                            marginTop: "-9px",
                          }}
                          id="application-card-date-globalcss secondaryColor"
                        >
                          14-07-2023
                        </span>
                        <div className="application-status-wrap">
                          <img
                            className="application-card-status-globalcss"
                            src={PublishedIcon}
                          />
                        </div>
                      </div>
                      <div className="application-box-wrap-globalcss">
                        <Link
                          id="application-card-edit"
                          className="btn btn-edit"
                        >
                          {"Edit"}
                        </Link>
                        <Link
                          id="application-card-properties"
                          className="application-card-properties-globalcss"
                        >
                          {"Properties"}
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="appdesigner-application-item-globalcss1 BodyColor">
                    <Dropdown className="dropdown kebabMenu">
                      <Dropdown.Toggle
                        variant=""
                        className="p-0"
                        id="dropdown-basic"
                      >
                        <svg
                          width="4"
                          height="18"
                          viewBox="0 0 4 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2 10C2.55228 10 3 9.55228 3 9C3 8.44772 2.55228 8 2 8C1.44772 8 1 8.44772 1 9C1 9.55228 1.44772 10 2 10Z"
                            stroke="#A9BBC9"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M2 3C2.55228 3 3 2.55228 3 2C3 1.44772 2.55228 1 2 1C1.44772 1 1 1.44772 1 2C1 2.55228 1.44772 3 2 3Z"
                            stroke="#A9BBC9"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M2 17C2.55228 17 3 16.5523 3 16C3 15.4477 2.55228 15 2 15C1.44772 15 1 15.4477 1 16C1 16.5523 1.44772 17 2 17Z"
                            stroke="#A9BBC9"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </Dropdown.Toggle>
                      <Dropdown.Menu className=" appdesigner-dropdownn BodyColor">
                        <Dropdown.Item
                          tag={Link}
                          to={{
                            pathname: ``,
                            state: {},
                          }}
                          id="create-app-delete-dropdown"
                          className="BodyColor primaryColor"
                        >
                          {" "}
                          <img src={DeleteIco} height="30px" /> Delete
                        </Dropdown.Item>

                        <Dropdown.Item
                          tag={Link}
                          to={{
                            pathname: ``,
                            state: {},
                          }}
                          href="#"
                          id="create-app-properties-dropdown"
                          className="BodyColor primaryColor"
                        >
                          <img src={PropertiesIco} />
                          Properties
                        </Dropdown.Item>

                        <Dropdown.Item className="BodyColor primaryColor">
                          <Link
                            className="btn btn-edit primaryColor BodyColor"
                            id="create-app-edit-app-dropdown"
                          >
                            <img src={EditIcon} />
                            Edit Application
                          </Link>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    <div className="insidecardglobalcss">
                      <div className="application-box-img-globalcss mt-1">
                        <img
                          src={Logo100}
                          className="appdesignerimage-globalcss"
                          alt="App Logo"
                        />
                      </div>
                      <div className="application-box-info-globalcss">
                        <h5 className="primaryColor">
                          <i>
                            <img
                              alt=""
                              id="application-box-image-globalcss"
                              src={ApplicationIcon}
                            />
                          </i>
                          <span
                            className="cardName secondaryColor"
                            data-tip
                            id="application-card-name"
                          >
                            Appname
                          </span>
                        </h5>
                        <span
                          style={{
                            color: "#8a8a8a",
                            fontStyle: "normal",
                            fontWeight: "500",
                            fontSize: "12px",
                            display: "block",
                            margin: "0px 0 10px",
                            marginTop: "-9px",
                          }}
                          id="application-card-date-globalcss secondaryColor"
                        >
                          14-07-2023
                        </span>
                        <div className="application-status-wrap">
                          <img
                            className="application-card-status-globalcss"
                            src={PublishedIcon}
                          />
                        </div>
                      </div>
                      <div className="application-box-wrap-globalcss">
                        <Link
                          id="application-card-edit"
                          className="btn btn-edit"
                        >
                          {"Edit"}
                        </Link>
                        <Link
                          id="application-card-properties"
                          className="application-card-properties-globalcss"
                        >
                          {"Properties"}
                        </Link>
                      </div>
                    </div>
                  </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <Header className="primaryColor">Select a Theme from below</Header> */}
            {/* <Container>
          {themes.length > 0 && themes.map((theme) => loadTheme(theme))}
        </Container> */}
          </div>
        </div>
      </>
    );
  } else {
    return <></>;
  }
};

export default CreateThemeContent;
