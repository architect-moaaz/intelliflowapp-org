import { Link, useHistory } from "react-router-dom";
import { Icon } from "@iconify/react";
import PulseFillIcon from "remixicon-react/AddLineIcon";
import axios from "axios";
import ReactTooltip from "react-tooltip";
import {
  mobcomIco,
  ApplicationIcon,
  AppImage,
  LaptopIco,
  PhoneIco,
  ProfileImg,
  SharpRestore,
  Tick2,
  UploadFile,
  EditIco,
  DeleteIco,
  DuplicateIco,
  PropertiesIco,
  EditIcon,
} from "../../../assets";

import { selector, useRecoilValue } from "recoil";
import { ReactComponent as User } from "../../../assets/NewIcon/User.svg";
import { ReactComponent as AssignRoleI } from "../../../assets/NewIcon/AssignRoleI.svg";

import { searchTerm } from "../../Header/Header";
import { Col, Dropdown, Row, Nav, NavLink } from "react-bootstrap";
import { useState, useEffect } from "react";
// import "../../ApplicationDashboard/ApplicationDashboard.css";
import ProgressiveImage from "../../ProgressiveImage/ProgressiveImage";
import "./IFDashboard.css";
import { loggedInUserState } from "../../../state/atom";
import { useTranslation } from "react-i18next";
const searchValueState = selector({
  key: "searchValueState",
  get: ({ get }) => {
    return get(searchTerm);
  },
});

const IFDashboard = () => {
  const [t, i18n] = useTranslation("common");
  localStorage.setItem("Dashboard", t("appStore"));
  const searchValue = useRecoilValue(searchValueState);
  const history = useHistory();
  const [appList, setappList] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const loggedInUser = useRecoilValue(loggedInUserState);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortName, setSortName] = useState("name");

  // const sortingByDate = () => {
  //   var appListTemp = [...appList];
  //   appListTemp.sort(function (a, b) {
  //     return new Date(b.registration_date) - new Date(a.registration_date);
  //   });
  //   setappList(appListTemp);
  // };

  // const sortingByDateReverse = () => {
  //   var appListTemp = [...appList];
  //   appListTemp.sort(function (a, b) {
  //     return new Date(a.registration_date) - new Date(b.registration_date);
  //   });
  //   setappList(appListTemp);
  // };

  // const sortingByName = () => {
  //   var appListTemp = [...appList];
  //   appListTemp.sort((a, b) => {
  //     if (b.app > a.app) {
  //       return -1;
  //     } else if (a.app > b.app) {
  //       return 1;
  //     } else {
  //       return 0;
  //     }
  //   });
  //   setappList(appListTemp);
  // };

  // const sortingByNameReverse = () => {
  //   var appListTemp = [...appList];
  //   appListTemp.sort((a, b) => {
  //     if (a.app > b.app) {
  //       return -1;
  //     } else if (b.app > a.app) {
  //       return 1;
  //     } else {
  //       return 0;
  //     }
  //   });
  //   setappList(appListTemp);
  // };

  const loadApps = () => {
    if (appList.length == 0) {
      try {
        axios
          .get(
            process.env.REACT_APP_IFAPP_API_ENDPOINT +
              "app-center/" +
              localStorage.getItem("workspace") +
              "/apps",
            { headers: { devicesupport: "D" } }
          )
          .then((r) => {
            setappList(r.data.data.apps);
          })
          .catch((e) => {
            console.log("error", e);
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onLinkClick = async (e, appName, appdisplayname) => {
    localStorage.setItem(
      "appdisplayname",
      appdisplayname ? appdisplayname : appName
    );
    e.preventDefault();
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

  const sortingAppStore = async () => {
    try {
      const response = await axios.get(
        `${
          process.env.REACT_APP_IFAPP_API_ENDPOINT
        }app-center/${localStorage.getItem(
          "workspace"
        )}/apps?page=1&perPage=10&sortParam=${sortName}&sortOrder=${sortOrder}`,
        {}
      );

      setappList(response.data.data.apps);
    } catch (error) {
      console.log(error);
    }
  };

  const sortingByName = () => {
    setSortOrder("asc"); // Sort in ascending order
    sortingAppStore();
  };

  const sortingByNameReverse = () => {
    setSortOrder("desc"); // Sort in descending order
    sortingAppStore();
  };
  const sortingByDate = () => {
    setSortName("name");
    sortingAppStore();
  };

  const sortingByDateReverse = () => {
    setSortName("date");
    sortingAppStore();
  };
  const checkHopePageAvailable = async (appName) => {
    let useHomepage = false;

    await axios
      .get(
        `${process.env.REACT_APP_IFAPP_API_ENDPOINT}q/${localStorage.getItem(
          "workspace"
        )}/${appName}/service/page/content/${loggedInUser.currentRole}`
      )
      .then((res) => {
        console.log({ res, loggedInUser });
        if (res.status === 200) {
          if (res.data.useHomepage) {
            useHomepage = true;
          } else {
            useHomepage = false;
          }
        } else {
          useHomepage = false;
        }
      })
      .catch((e) => {
        console.log("Error ", e);
        useHomepage = false;
      });

    return useHomepage;
  };

  loadApps();

  return (
    <>
      <div className="appStore-application-mains">
        <div className="appStore-your-application">
          <div className="appStore-application-title-wrap">
            <h4 className="primaryColor">{t("yourApplications")}</h4>

            <ul>
              {/* <li>
                <p className="assignRole-user">Employee</p>
              </li>
              <li>
                <Nav variant="pills" className="rolebased_pills">
                  <Dropdown>
                    <Dropdown.Toggle
                      className="switchRole"
                      active="true"
                      eventKey="second"
                    >
                      Switch Role
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <h5 className="switchRole-dropdown-title">
                        Choose other assigned roles
                      </h5>
                      <Dropdown.Item
                        // onClick={sortingByDate}
                        href="#"
                        id="ifDashboard-sorting-assignRole"
                      >
                        <User className="svg-stroke" />
                        Manager
                      </Dropdown.Item>
                      <Dropdown.Item
                        // onClick={sortingByDateReverse}
                        href="#"
                        id="ifDashboard-sorting-assignRole"
                      >
                        <User className="svg-stroke" />
                        Admin
                      </Dropdown.Item>
                      <div className="assignRole-des">
                        <div className="assignRole-i">
                          <AssignRoleI className="svg-stroke" />
                        </div>
                        <div className="assignRole-info">
                          <p>The Role You Select Determines And Changes Screens Of The Features That User Has Access To</p>
                        </div>
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>
                </Nav>
              </li> */}

              <li>
                <Dropdown>
                  <Dropdown.Toggle
                    variant=""
                    className="p-0 primaryColor"
                    id="dropdown-basic"
                  >
                    <Icon icon="gg:sort-za" />
                    {t("sort")}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="BodyColor">
                    <h5 className="dropdown-title primaryColor">{t("sort")}</h5>
                    <Dropdown.Item
                      onClick={sortingByDate}
                      href="#"
                      id="ifDashboard-sorting-newOld"
                      className="BodyColor primaryColor"
                    >
                      {t("newOld")}
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={sortingByDateReverse}
                      href="#"
                      id="ifDashboard-sorting-oldNew"
                      className="BodyColor primaryColor"
                    >
                      {t("oldNew")}
                    </Dropdown.Item>
                    {/* <Dropdown.Item href="#">A-Z</Dropdown.Item> */}
                    <Dropdown.Item
                      onClick={sortingByName}
                      href="#"
                      id="ifDashboard-sorting-AtoZ"
                      className="BodyColor primaryColor"
                    >
                      {t("az")}
                    </Dropdown.Item>
                    {/* <Dropdown.Item href="#">Z-A</Dropdown.Item> */}
                    <Dropdown.Item
                      onClick={sortingByNameReverse}
                      href="#"
                      id="ifDashboard-sorting-ZtoA"
                      className="BodyColor primaryColor"
                    >
                      {t("za")}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>
              {/* <li>
                <Dropdown>
                  <Dropdown.Toggle
                    variant=""
                    className="p-0"
                    id="dropdown-basic"
                  >
                    <Icon icon="bx:filter-alt" vFlip={true} hFlip={true} />
                    Filter
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">
                      Another action
                    </Dropdown.Item>
                    <Dropdown.Item href="#/action-3">
                      Something else
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li> */}
            </ul>
          </div>

          <div
            className="appStore-application-wrap customScrollBar"
            id="ifDashboard-appstore-apps"
          >
            {appList
              .filter((e) =>
                e.appdisplayname?.toLowerCase().includes(searchValue)
              )
              .map((cards) => {
                return (
                  <div className="appStore-application-item">
                    <div className="appstoreapp">
                      <ProgressiveImage
                        key={cards.app}
                        id="ifDashboard-progressiveImage"
                        className="appStore-card-icon"
                        src={`${
                          process.env.REACT_APP_CDS_ENDPOINT
                        }appLogo/image/${localStorage.getItem("workspace")}${
                          cards.app
                        }?Authorization=${localStorage.getItem(
                          "token"
                        )}&workspace=${localStorage.getItem("workspace")}`}
                        placeholderSrc={`${
                          process.env.REACT_APP_CDS_ENDPOINT
                        }appLogo/image/${localStorage.getItem("workspace")}${
                          cards.app
                        }_thumbnail?Authorization=${localStorage.getItem(
                          "token"
                        )}&workspace=${localStorage.getItem("workspace")}`}
                        errorImage={AppImage}
                      />{" "}
                    </div>
                    <div className="appStore-application-box-wrap">
                      <Link
                        to="#"
                        id="ifDashboard-appStore-appsLinks"
                        onClick={(e) =>
                          onLinkClick(e, cards.app, cards.appdisplayname)
                        }
                        className="btn btn-edit btn-app"
                        data-tip
                        data-for={
                          cards.appdisplayname
                            ? t(cards.appdisplayname)
                            : t(cards.app)
                        }
                      >
                        <img className="mobcom" src={mobcomIco} />
                        {cards.appdisplayname
                          ? t(cards.appdisplayname)
                          : t(cards.app)}
                      </Link>
                      <ReactTooltip
                        id={
                          cards.appdisplayname
                            ? t(cards.appdisplayname)
                            : t(cards.app)
                        }
                        place="top"
                        effect="solid"
                      >
                        {cards.appdisplayname
                          ? t(cards.appdisplayname)
                          : t(cards.app)}
                      </ReactTooltip>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};

export default IFDashboard;
