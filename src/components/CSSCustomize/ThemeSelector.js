import React, { useState, useEffect } from "react";
import styled from "styled-components";
import _ from "lodash";
import { generate } from "shortid";
import { useTheme } from "../../theme/useTheme";
import { getFromLS } from "../..//utils/storage";
import { Link, useHistory } from "react-router-dom";
import "./globalcss.css";
import { useRecoilState } from "recoil";
import { dynamicCssState, selectedCssState } from "../../state/atom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Col, Dropdown, Row } from "react-bootstrap";
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
  lightThemeMiniPreview,
  darkThemeMiniPreview,
  customThemeMiniPreview,
} from "../../assets";
import { ReactComponent as CreateAppScratch } from "../../assets/NewIcon/CreateAppScratch.svg";
import { ReactComponent as CreateAppExcel } from "../../assets/NewIcon/CreateAppExcel.svg";
import { ReactComponent as CreateAppTemplate } from "../../assets/NewIcon/CreateAppTemplate.svg";
import templateBoxIcon from "../../assets/NewIcon/templateBoxIcon.svg";
import ProgressiveImage from "../ProgressiveImage/ProgressiveImage";
import PublishedIcon from "../../assets/NewIcon/PublishedIcon.svg";

const ThemedButton = styled.button`
  border: 0;
  display: inline-block;
  padding: 12px 24px;
  font-size: 14px;
  border-radius: 4px;
  margin-top: 5px;
  width: 100%;
  cursor: pointer;
`;

const Wrapper = styled.li`
  padding: 48px;
  text-align: center;
  border-radius: 4px;
  border: 1px solid #000;
  list-style: none;
`;

const Container = styled.ul`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(0, 1fr);
  margin-top: 3rem;
  padding: 10px;
`;

const Header = styled.h2`
  display: flex;
  justify-content: space-around;
`;

export default (props) => {
  const [theme, setTheme] = useRecoilState(dynamicCssState);
  const [cssSelected, setselectedCss] = useRecoilState(dynamicCssState);
  // const [selectedCss, setselectedCss] = useRecoilState(selectedCssState);
  const [newTheme, setNewTheme] = useState({});
  const [state, setState] = useState(defaultTheme);
  var defaultTheme = {};
  const [data, setData] = useState({});
  const [themes, setThemes] = useState([]);
  const { setMode } = useTheme();
  console.log("state", state);
  const themeSwitcher = (selectedTheme) => {
    // console.log("selectedTheme", selectedTheme);
    setMode(selectedTheme);
    setTheme(selectedTheme);
  };
  const setCssselectedFn = (theme) => {
    setTheme(theme);
  };

  const createTheme = () => {
    // setState({...defaultTheme});

    try {
      axios
        .post(
          process.env.REACT_APP_IDENTITY_ENDPOINT + "IDENTITY/misc/saveThemes",
          newTheme
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

  const saveTheme = (selectedTheme) => {
    console.log("testcss", theme);

    try {
      axios
        .post(
          process.env.REACT_APP_IDENTITY_ENDPOINT + "IDENTITY/misc/saveTheme",
          { theme: theme.name }
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

  const lightmode = () => {};
  const darkmode = () => {};
  const custommode = () => {};
  const stylemode = () => {};
  useEffect(() => {
    try {
      axios
        .get(
          process.env.REACT_APP_IDENTITY_ENDPOINT + "IDENTITY/misc/getThemes"
        )
        .then(async (r) => {
          var theme = JSON.parse(JSON.stringify(r.data.themes));
          const updated = { ...data, ...theme };
          console.log("Updated", updated);
          setData(JSON.parse(JSON.stringify(updated)));
        })
        .catch((e) => {
          console.log("error", e);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    setThemes(_.keys(data));
  }, [data]);

  console.log("themes", themes);

  useEffect(() => {
    props.newTheme && updateThemeCard(props.newTheme);
  }, [props.newTheme]);

  const updateThemeCard = (theme) => {
    const key = _.keys(theme)[0];
    const updated = { ...data, [key]: theme[key] };
    setData(updated);
  };

  const ThemeCard = (props) => {
    console.log("theme props", props);
    return (
      // <div></div>
      <Wrapper
        style={{
          backgroundColor: `${props.theme.colors.body}`,
          color: `${props.theme.colors.text}`,
          fontFamily: `${props.theme.font}`,
        }}
      >
        <span className="secondaryColor">
          Click on the button to set this theme
        </span>
        <ThemedButton
          onClick={(theme) => themeSwitcher(props)}
          style={{
            backgroundColor: `${props?.theme?.colors?.primaryButton?.background}`,
            color: `${props?.theme?.colors?.primaryButton?.text}`,
            borderColor: `${props?.theme?.colors?.primaryButton?.borderColor}`,
            borderWidth: `${props?.theme?.colors?.primaryButton?.borderSize}`,
            fontFamily: `${props?.theme?.font}`,
          }}
        >
          {props?.theme?.name}
        </ThemedButton>
      </Wrapper>
    );
  };
  const loadTheme = (theme) => {
    return <ThemeCard theme={data[theme]} />;
  };

  return (
    // <div className="fullcontainer">
    <div className="row" style={{}}>
      <div className="col-lg-5 col-md-5 col-sm-12 col-xs-12">
        <div
          className="cssleft"
          style={{ marginTop: "35px", height: "calc(100vh - 80px)" }}
        >
          <ul class="nav nav-pills " id="pills-tab" role="tablist">
            <Link
              id="header-menu-app-store"
              to="/CustomTheme"
              className="header-menu-dropdown-item"
            >
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link  bulkuploadpropertiesPopup BodyColor"
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
            </Link>
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
                  class="nav-link active bulkuploadpropertiesPopup"
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

          <p className=" mt-5 theme-heading-font primaryColor">
            <h5>Default Themes</h5>
          </p>

          <div className="lightdark d-flex flex-row justify-content-around">
            <div
              className={`theme-preview-box d-flex flex-column align-items-center ${
                theme?.name == "Light" ? "active-theme" : ""
              } `}
              onClick={() => themeSwitcher(data["Light"])}
            >
              <img src={lightThemeMiniPreview} />
              <div className="mt-1 secondaryColor">Light</div>
            </div>

            <div
              className={`theme-preview-box d-flex flex-column align-items-center ${
                theme.name == "Dark" ? "active-theme" : ""
              } `}
              onClick={() => themeSwitcher(data["Dark"])}
            >
              <img className="imgdarkmode" src={darkThemeMiniPreview} />
              <div className="mt-1 secondaryColor">Dark</div>
            </div>
          </div>
          {/* <p className="DefaultTheme mt-5 theme-heading-font">Custom Theme</p> */}
          <p className=" mt-5 theme-heading-font primaryColor">
            <h5>Custom Theme</h5>
          </p>
          <div className="lightdark d-flex flex-row justify-content-around">
            <div>
              <div
                className={`theme-preview-box d-flex flex-column align-items-center ${
                  theme.name == "Custom" ? "active-theme" : ""
                } `}
                onClick={() => themeSwitcher(data["Custom"])}
              >
                <img className="imgdarkmode" src={customThemeMiniPreview} />
                <div className="mt-1 secondaryColor">Custom</div>
              </div>
            </div>
          </div>

          <button className="primaryButton ms-4" onClick={() => saveTheme()}>
            Apply
          </button>
          {/* <button
            className="btn btn-lg btn-orange-white m-4 p-2 secondaryButtonColor"
            // onClick={createTheme}
            // disabled={state.default}
          >
            Save Theme
          </button>
          <button
            className="btn btn-lg btn-orange-white m-4 p-2 primaryButtonColor"
            onClick={themeSwitcher}
          >
            Select
          </button> */}
        </div>
      </div>
      <div className="globalcssright ps-5 col-lg-7 col-md-7 col-sm-12 col-xs-12">
        {/* <p className="selectpage">Select Page</p> */}
        <div>
          {/* <select className="cssinput">
            <option value="designer"> App Designer </option>
            <option value="store"> App Store</option>
          </select> */}
          <div
            className="previewappdesigner"
            style={{
              backgroundColor: theme?.colors?.header,
              color: theme?.colors?.headerFontColor,
            }}
          >
            <img className="previewlogoglobalcss" src={IFlogoWhiteBorder} />
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
                backgroundColor: theme?.colors?.body,
                color: theme?.colors?.text,
                fontFamily: theme?.font,
              }}
            >
              <p className="Createnewcss" style={{color:theme?.colors?.primaryColor}}> Create New </p>

              <div className="create-app-wrapper-globalcss customScrollBar">
                <div className="create-app-box-globalcss">
                  <div>
                    <CreateAppScratch
                      className=""
                      style={{
                        width: "50px",
                        marginLeft: "-6px",
                        stroke: theme?.colors?.icon?.iconStrokeColor,
                        fill: theme?.colors?.icon?.iconFillColor,
                      }}
                    />
                  </div>
                  <div className="create-app-scratch">
                    <h5 className="create-app-title-globalcss"  style={{color:theme?.colors?.primaryColor}}>
                      {"Create Application"}
                    </h5>
                    <p className="create-app-subtitle-globalcss" style={{color:theme?.colors?.secondaryColor}}>
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
                        stroke: theme?.colors?.icon?.iconStrokeColor,
                        // fill: theme?.colors?.icon?.iconFillColor,
                      }}
                    />
                  </div>
                  <div className="create-app-scratch">
                    <h5 className="create-app-title-globalcss1"  style={{color:theme?.colors?.primaryColor}} >
                      {"Create Application From Excel"}{" "}
                    </h5>
                    <p className="create-app-subtitle-globalcss1" style={{color:theme?.colors?.secondaryColor}}>
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
                        stroke: theme?.colors?.icon?.iconStrokeColor,
                        // fill: theme?.colors?.icon?.iconFillColor,
                      }}
                    />
                  </div>
                  <div className="create-app-scratch">
                    <h5 className="create-app-title-globalcss2"  style={{color:theme?.colors?.primaryColor}}>
                      {"Create Application From Template"}
                    </h5>
                    <p className="create-app-subtitle-globalcss2" style={{color:theme?.colors?.secondaryColor}}>
                      {"Inspired By App Template"}
                    </p>
                  </div>
                </div>
              </div>
              <div
                id="pillApps"
                className="application-title-wrap-preview py-2  col-10"
                style={{ backgroundColor: theme?.colors?.body }}
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
                        style={{ color: theme?.colors?.text }}
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
                        style={{ color: theme?.colors?.text }}
                      >
                        {"Template"}
                      </h4>
                    </label>
                  </li>
                </ul>
                </div>
                <div>
                <ul className="horizontal-list">
                  <li>
                    <Dropdown className="dropdown">
                      <Dropdown.Toggle
                        variant=""
                        className="p-0 "
                        id="dropdown-basic"
                        style={{color:theme?.colors?.primaryColor}}
                      >
                        <Icon icon="gg:sort-za" className="" vFlip={true} />
                        {"sort"}
                      </Dropdown.Toggle>

                      <Dropdown.Menu
                        className=""
                        style={{
                          backgroundColor: theme?.colors?.body,
                          color: theme?.colors?.text,
                        }}
                      >
                        <h5
                          className="dropdown-title"
                          style={{color:theme?.colors?.primaryColor}}
                        >
                          {"sort"}
                        </h5>
                        <Dropdown.Item
                          id="yourApp-sort-new"
                          className=""
                          style={{color: theme?.colors?.secondaryColor}}
                        >
                          {"newOld"}
                        </Dropdown.Item>
                        <Dropdown.Item
                          id="yourApp-sort-old"
                          className=""
                          style={{color: theme?.colors?.secondaryColor}}
                        >
                          {"oldNew"}
                        </Dropdown.Item>

                        <Dropdown.Item
                          id="yourApp-sort-name"
                          href="#"
                          className=""
                          style={{color: theme?.colors?.secondaryColor}}
                        >
                          {"az"}
                        </Dropdown.Item>
                        <Dropdown.Item
                          id="yourApp-sort-name-rev"
                          href="#"
                          className=""
                          style={{color: theme?.colors?.secondaryColor}}
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
                        style={{color:theme?.colors?.primaryColor}}
                      >
                        <Icon icon="bx:filter-alt" className="" vFlip={false} />
                        {"filter"}
                      </Dropdown.Toggle>
                      <Dropdown.Menu
                        className=""
                        style={{
                          backgroundColor: theme?.colors?.body,
                          color: theme?.colors?.text,
                        }}
                      >
                        <h4
                          className="dropdown-title"
                          style={{color:theme?.colors?.primaryColor}}
                        >
                          {"filter"}
                        </h4>
                        <div className="dropdown-item dropdown-option-container">
                          <label className="" style={{color:theme?.colors?.secondaryColor}}>{"mobile"}</label>
                          <input
                            type="checkbox"
                            className="form-check-input me-3"
                            name="M"
                          ></input>
                        </div>
                        <div className=" dropdown-item dropdown-option-container">
                          <label className="" style={{color:theme?.colors?.secondaryColor}}>{"web"}</label>
                          <input
                            type="checkbox"
                            className="form-check-input me-3"
                            name="D"
                          ></input>
                        </div>
                        <div className=" dropdown-item dropdown-option-container">
                          <label className="" style={{color:theme?.colors?.secondaryColor}}>Others</label>
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

        {/* <Header className="primaryColor">Select a Theme from below</Header> */}
        {/* <Container>
          {themes.length > 0 && themes.map((theme) => loadTheme(theme))}
        </Container> */}
      </div>
    </div>
  );
};
