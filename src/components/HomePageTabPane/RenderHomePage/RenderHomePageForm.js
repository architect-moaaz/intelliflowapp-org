import React, { useState, useEffect } from "react";
import parse from "html-react-parser";
import { Link, useLocation, useHistory } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import QRCode from "react-qr-code";
import axios from "axios";
import ReactTooltip from "react-tooltip";
import Accordion from "react-bootstrap/Accordion";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { Dropdown } from "react-bootstrap";
import { ReactComponent as Dashboard } from "../../../assets/images/Dashboard.svg";

import {
  recentPendingIco,
  sideArrowIco,
  recentCompleteIco,
  noRecordIco,
  GridIcon,
  ListIcon,
  Process,
  Home,
  rightArrow,
  ProcessCircle,
  // Dashboard,
} from "../../../assets";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import "./RenderHomePageForm.css";
import Table from "../../DataTable/Table";
import { useRecoilValue } from "recoil";
import { loggedInUserState } from "../../../state/atom";
import { useTranslation } from "react-i18next";

export default function RenderHomePageForm() {
  const [t, i18n] = useTranslation("common");
  const history = useHistory();
  const Location = useLocation();
  let appName;
  localStorage.setItem("Dashboard", t("appStore"));
  if (Location.state) {
    localStorage.setItem("appName", Location.state.appName);
    appName = Location.state.appName;
  }
  const { height, width } = useWindowDimensions();
  const [formLayoutData, setFormLayoutData] = useState([]);
  const [myEmail, setMyEmail] = useState(localStorage.getItem("username"));
  const [myGroups, setMyGroups] = useState(
    JSON.parse(localStorage.getItem("groups"))
  );
  const loggedInUser = useRecoilValue(loggedInUserState);
  const [formLayout, setFormLayout] = useState({});

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const accessibilityCode = {
    write: "writePermission",
    read: "readOnlyPermission",
    hide: "hidePermission",
    notApplicable: "notApplicable",
  };

  const formElementType = {
    label: "label",
    timer: "timer",
    media: "media",
    qrcode: "qrcode",
    location: "location",
    dataGrid: "dataGrid",
    link: "link",
    action: "action",
  };

  useEffect(() => {
    loadForm();
  }, []);

  useEffect(() => {
    if (!appName) {
      history.push("/Dashboard");
    }
  }, [appName]);

  async function loadForm() {
    await axios
      .get(
        `${process.env.REACT_APP_IFAPP_API_ENDPOINT}q/${localStorage.getItem(
          "workspace"
        )}/${appName}/service/page/content/${loggedInUser.currentRole}`
      )
      .then((res) => {
        setFormLayoutData([...res.data.formData]);
        setFormLayout({ ...res?.data?.homepagePrperties });
      })
      .catch((e) => console.log("Error ", e));
  }

  const filterMaker = (field, operator, value) => {
    let operation;
    let queryFilter;
    switch (operator) {
      case "=":
        operation = "eq";
        queryFilter = isNaN(value)
          ? `${field} ${operation} '${value}'`
          : `${field} ${operation} ${value}`;
        break;
      case ">":
        operation = "gt";
        queryFilter = isNaN(value)
          ? `${field} ${operation} '${value}'`
          : `${field} ${operation} ${value}`;
        break;
      case "<":
        operation = "lt";
        queryFilter = isNaN(value)
          ? `${field} ${operation} '${value}'`
          : `${field} ${operation} ${value}`;
        break;
      case ">=":
        operation = "ge";
        queryFilter = isNaN(value)
          ? `${field} ${operation} '${value}'`
          : `${field} ${operation} ${value}`;
        break;
      case "<=":
        operation = "le";
        queryFilter = isNaN(value)
          ? `${field} ${operation} '${value}'`
          : `${field} ${operation} ${value}`;
        break;
      case "!=":
        operation = "ne";
        queryFilter = isNaN(value)
          ? `${field} ${operation} '${value}'`
          : `${field} ${operation} ${value}`;
        break;
      case "like":
        queryFilter = `substringof('${value}',${field})`;
        break;
      default:
        break;
    }

    return queryFilter;
  };

  async function getODataFilteredValues(allFilters, receivedCollectionName) {
    const appName = localStorage.getItem("appName");
    const collectionName = receivedCollectionName?.replace(/\.[^/.]+$/, "");

    if (allFilters?.length === 0) {
      const allData = await axios.get(
        `${process.env.REACT_APP_DATA_ENDPOINT}/query/${localStorage.getItem(
          "workspace"
        )}/${appName}/${collectionName}`
      );
      return allData.data.value;
    }

    let filteredData = [];
    let filterArrayString = "";
    let first = true;

    for (let i = 0; i < allFilters?.length; i++) {
      if (first) {
        let tempFilter = filterMaker(
          allFilters[i].field,
          allFilters[i].operator,
          allFilters[i].value
        );

        filterArrayString = filterArrayString + tempFilter;
        first = false;
      } else {
        let tempFilter = filterMaker(
          allFilters[i].field,
          allFilters[i].operator,
          allFilters[i].value
        );

        filterArrayString = filterArrayString + ` and ${tempFilter}`;
      }
    }

    const queryUrl = `${
      process.env.REACT_APP_DATA_ENDPOINT
    }/query/${localStorage.getItem(
      "workspace"
    )}/${appName}/${collectionName}?$filter=${filterArrayString}`;

    await axios
      .get(queryUrl)
      .then((response) => {
        if (response?.data?.value?.length) {
          filteredData = [...response.data.value];
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return filteredData;
  }

  const userAccessibility = (accessibilityData) => {
    let hasWriteAccess = false;
    let hasReadAccess = false;
    let hasHideAccess = false;

    for (let i = 0; i < accessibilityData.hideUsers.length; i++) {
      let tempUsername = accessibilityData.hideUsers[i].username;
      if (tempUsername === myEmail) {
        hasHideAccess = true;
      }
    }

    for (let i = 0; i < accessibilityData.readUsers.length; i++) {
      let tempUsername = accessibilityData.readUsers[i].username;
      if (tempUsername === myEmail) {
        hasReadAccess = true;
      }
    }

    for (let i = 0; i < accessibilityData.writeUsers.length; i++) {
      let tempUsername = accessibilityData.writeUsers[i].username;
      if (tempUsername === myEmail) {
        hasWriteAccess = true;
      }
    }

    if (hasWriteAccess == true) {
      return accessibilityCode.write;
    } else if (hasWriteAccess == false && hasReadAccess == true) {
      return accessibilityCode.read;
    } else if (
      hasReadAccess == false &&
      hasReadAccess == false &&
      hasHideAccess == true
    ) {
      return accessibilityCode.hide;
    }

    return accessibilityCode.write;
  };

  const groupAccessibility = (accessibilityData) => {
    let tempMyGroups = myGroups.map((group) => {
      return group.name;
    });

    if (tempMyGroups.length == 0) {
      return accessibilityCode.notApplicable;
    }

    let hasWriteAccess = false;
    let hasReadAccess = false;
    let hasHideAccess = false;

    for (let i = 0; i < tempMyGroups.length; i++) {
      for (let j = 0; j < accessibilityData.hideGroups.length; j++) {
        let tempGroupname = accessibilityData.hideGroups[j].name;
        if (tempGroupname === tempMyGroups[i]) {
          hasHideAccess = true;
        }
      }

      for (let j = 0; j < accessibilityData.readGroups.length; j++) {
        let tempGroupname = accessibilityData.readGroups[j].name;
        if (tempGroupname === tempMyGroups[i]) {
          hasReadAccess = true;
        }
      }

      for (let j = 0; j < accessibilityData.writeGroups.length; j++) {
        let tempGroupname = accessibilityData.writeGroups[j].name;
        if (tempGroupname === tempMyGroups[i]) {
          hasWriteAccess = true;
        }
      }
    }

    if (hasWriteAccess == true) {
      return accessibilityCode.write;
    } else if (hasWriteAccess == false && hasReadAccess == true) {
      return accessibilityCode.read;
    } else if (
      hasReadAccess == false &&
      hasReadAccess == false &&
      hasHideAccess == true
    ) {
      return accessibilityCode.hide;
    }

    return accessibilityCode.notApplicable;
  };

  const ItemPlacer = ({ i, x, y, h, w, children }) => {
    return (
      <div
        className="form-group"
        key={i}
        style={{
          position: "absolute",
          paddingBottom: "30px",
          left: `${(x / 24) * 100}%`,
          top: `${(y / 10) * 100}%`,
          height: `${(h / 10) * 100}%`,
          width: `${(w / 24) * 100}%`,
          textAlign: "center",
          padding: "10px",
        }}
      >
        {children}
      </div>
    );
  };

  const RenderFormElement = () => {
    return formLayoutData.map((e, index) => {
      const userPreviledges = userAccessibility(e.accessibility);
      const adminPreviledges = groupAccessibility(e.accessibility);

      let disabledStatus = true;

      if (adminPreviledges == accessibilityCode.notApplicable) {
        if (userPreviledges === accessibilityCode.write) {
          disabledStatus = false;
        } else if (userPreviledges == accessibilityCode.read) {
          disabledStatus = true;
        }
        if (userPreviledges === accessibilityCode.hide) {
        } else {
          return (
            <>
              <RenderAllElements item={e} disabledStatus={disabledStatus} />
            </>
          );
        }
      } else {
        if (
          userPreviledges === accessibilityCode.write ||
          adminPreviledges === accessibilityCode.write
        ) {
          disabledStatus = false;
        } else if (
          userPreviledges === accessibilityCode.read &&
          adminPreviledges === accessibilityCode.read
        ) {
          disabledStatus = true;
        }
        if (
          userPreviledges === accessibilityCode.hide &&
          adminPreviledges === accessibilityCode.hide
        ) {
        } else {
          return (
            <>
              <RenderAllElements item={e} disabledStatus={disabledStatus} />
            </>
          );
        }
      }
    });
  };

  const RenderLabel = ({ item }) => (
    <ItemPlacer i={item.i} x={item.x} y={item.y} h={item.h} w={item.w}>
      {item.fieldName && <p> {parse(item.fieldName)}</p>}
    </ItemPlacer>
  );

  const RenderTimer = ({ item }) => {
    const countDownDate = new Date(item.date).getTime();

    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [end, setEnd] = useState(null);

    useEffect(() => {
      const myfunc = setInterval(function () {
        var now = new Date().getTime();
        var timeleft = countDownDate - now;

        if (timeleft) {
          setDays(Math.floor(timeleft / (1000 * 60 * 60 * 24)));
          setHours(
            Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          );
          setMinutes(Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60)));
          setSeconds(Math.floor((timeleft % (1000 * 60)) / 1000));

          if (timeleft < 0) {
            setDays(0);
            setHours(0);
            setMinutes(0);
            setSeconds(0);
            setEnd("Time UP!!");
            clearInterval(myfunc);
          }
        }
      }, 1000);

      return () => clearInterval(myfunc);
    }, []);

    return (
      <ItemPlacer i={item.i} x={item.x} y={item.y} h={item.h} w={item.w}>
        {item.fieldName && <p> {parse(item.fieldName)}</p>}
        {end ?? `${days}d ${hours}h ${minutes}m ${seconds}s`}
      </ItemPlacer>
    );
  };

  const RenderMedia = ({ item }) => {
    const renderMedia = () => {
      const mediaType = getMediaType();

      switch (mediaType) {
        case "image":
          return (
            <img
              id="media-type-img"
              className="image-fit"
              src={
                process.env.REACT_APP_CDS_ENDPOINT +
                item.mediaUrl +
                `?Authorization=${localStorage.getItem(
                  "token"
                )}&workspace=${localStorage.getItem("workspace")}`
              }
              crossOrigin="anonymous"
              style={{
                height: "90%",
                width: "90%",
              }}
              alt="Uploaded"
            />
          );

        case "audio":
          return (
            <div>
              <audio
                id="media-type-audio"
                src={
                  process.env.REACT_APP_CDS_ENDPOINT +
                  item.mediaUrl +
                  `?Authorization=${localStorage.getItem(
                    "token"
                  )}&workspace=${localStorage.getItem("workspace")}`
                }
                controls
                autoPlay={item.autoPlay}
              />
            </div>
          );

        case "video":
          return (
            <div
              style={{
                height: "90%",
                width: "90%",
              }}
            >
              <video
                id="media-type-video"
                width="100%"
                height="100%"
                controls
                autoPlay={item.autoPlay}
              >
                <source
                  src={
                    process.env.REACT_APP_CDS_ENDPOINT +
                    item.mediaUrl +
                    `?Authorization=${localStorage.getItem(
                      "token"
                    )}&workspace=${localStorage.getItem("workspace")}`
                  }
                  type={item.mediaType}
                />
              </video>
            </div>
          );

        default:
          return <h1>No Media Url Available</h1>;
      }
    };

    const getMediaType = () => {
      if (item.mediaType === "audio/mpeg") return "audio";

      if (item.mediaType === "image/png" || item.mediaType === "image/jpeg")
        return "image";

      if (item.mediaType === "video/mp4") return "video";

      return item.mediaType;
    };

    return (
      <ItemPlacer i={item.i} x={item.x} y={item.y} h={item.h} w={item.w}>
        <div style={{ height: "90%", width: "100%" }}>{renderMedia()}</div>
      </ItemPlacer>
    );
  };

  const RenderQRCode = ({ item }) => {
    return (
      <ItemPlacer i={item.i} x={item.x} y={item.y} h={item.h} w={item.w}>
        <div>
          <QRCode
            id="render-qr-code"
            size={156}
            style={{ height: "auto", maxWidth: "75%", width: "75%" }}
            value={item.fieldName}
          />
        </div>
      </ItemPlacer>
    );
  };

  const RenderLocation = ({ item }) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lng);
    const zoom = parseFloat(item.zoomLevel);

    return (
      <ItemPlacer i={item.i} x={item.x} y={item.y} h={item.h} w={item.w}>
        {item.fieldName && <p> {parse(item.fieldName)}</p>}
        <iframe
          title={item.fieldName}
          src={`http://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`}
          height="80%"
          width="80%"
        ></iframe>
      </ItemPlacer>
    );
  };

  const RenderDataGrid = ({ item, disabledStatus }) => {
    const [datagridChanges, setdatagridChanges] = useState([]);

    return (
      <ItemPlacer i={item.i} x={item.x} y={item.y} h={item.h} w={item.w}>
        <div style={{ height: "90%", width: "100%", overflow: "auto" }}>
          <Table
            dataGridProperties={item.dataGridProperties}
            datagridChanges={datagridChanges}
            setdatagridChanges={setdatagridChanges}
            fieldName={item.fieldName?.replace(/(<([^>]+)>)/gi, "")}
            accessibilityprop={item.accessibility}
            // gridColumns={item.dataGridProperties.cols}
            disabledStatus={disabledStatus}
            formData={{}}
            currentElement={""}
            getODataFilteredValuesRenderForm={getODataFilteredValues}
            processVariableName={item.processVariableName}
            captureValue={() => {}}
          />
        </div>
      </ItemPlacer>
    );
  };

  const RenderLink = ({ item }) => {
    return (
      <ItemPlacer i={item.i} x={item.x} y={item.y} h={item.h} w={item.w}>
        {item.fieldName && (
          <a href={item.linkUrl}>
            <p
              style={{
                backgroundColor: "#0D3C84",
                color: "white",
                padding: "10px",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              {parse(item.fieldName)}
            </p>
          </a>
        )}
      </ItemPlacer>
    );
  };

  const RenderAction = ({ item }) => {
    const [data, setData] = useState(null);
    useEffect(() => {
      mapping();
    }, []);

    async function mapping() {
      var config = {
        method: "get",
        url:
          process.env.REACT_APP_MODELLER_API_ENDPOINT +
          "modellerService/workflow/mapping/" +
          localStorage.getItem("workspace") +
          "/" +
          localStorage.getItem("appName"),
        headers: {},
      };

      await axios(config)
        .then(function (res) {
          const temp = [...res.data.data];
          const data = temp.filter(
            (task) =>
              task.bpmnname === item.workflowName && task.tasktype === "PT"
          );

          if (data[0]) {
            setData({
              endpoint_label: data[0].taskname,
              path: data[0].taskid,
            });
          } else {
            setData({
              endpoint_label: item.workflowName.replace(/\.[^/.]+$/),
              path: item.workflowName.replace(/\.[^/.]+$/, ""),
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    return (
      <ItemPlacer i={item.i} x={item.x} y={item.y} h={item.h} w={item.w}>
        <Link
          id="render-action-link"
          to={{
            pathname: `/form`,
            state: {
              ...data,
            },
          }}
        >
          {item.fieldName && (
            <p
              style={{
                backgroundColor: item?.bgColor ?? "#0D3C84",
                color: "white",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              {parse(
                item?.fieldName?.charAt(0).toUpperCase() +
                  item?.fieldName?.slice(1)
              )}
            </p>
          )}
        </Link>
      </ItemPlacer>
    );
  };

  const RenderToDo = ({ item }) => {
    const [todo, settodo] = useState([]);
    const [notibar, setNotibar] = useState(false);
    const [all, setall] = useState(false);
    const [notification, setNotification] = useState([]);

    useEffect(() => {
      fetchtodo();
    }, []);

    const fetchtodo = async () => {
      let notifications = [];

      try {
        var todoAPi = await axios.get(
          `${
            process.env.REACT_APP_IFAPP_API_ENDPOINT
          }app-center/app/user/worklist/?user=${localStorage.getItem(
            "username"
          )}`
        );

        if (todoAPi.data.data.count > 0) {
          todoAPi.data.data.tasks.forEach((element) => {
            notifications.push(element);
          });
        }
      } catch (error) {
        console.log("Error", error);
      }
      try {
        settodo(notifications);
        notifications = [];

        var notificationAPi = await axios.get(
          process.env.REACT_APP_IFAPP_API_ENDPOINT +
            "app-center/app/user/notifications?user=" +
            localStorage.getItem("username")
        );

        if (notificationAPi.data.data.count > 0) {
          notificationAPi.data.data.notifications.forEach((element) => {
            if (element.notifications) notifications.push(element);
          });
        }

        setNotification(notifications);
      } catch (error) {
        console.log("Error", error);
      }

      if (localStorage.getItem("Dashboard") == t("appStore")) {
        setall(!all);
        setNotibar(!all);
      }
    };

    return (
      <ItemPlacer i={item.i} x={item.x} y={item.y} h={item.h} w={item.w}>
        <div
          // className="todo-wrapper-render"
          // className=""
          className=" customScrollBar todo-wrapper-render"
            
        >
          <div className="customScrollBar">
            <h1 style={{ alignSelf: "center" }}>To Do List</h1>
            <ul>
              {todo.map((notification, index) => (
                <li className="tod" key={index}>
                  <i class="todo-line"></i>
                  {notification.app} - Action required for{" "}
                  {notification.userTasks[0].referenceName}
                  <Link
                    id="open-todo-link"
                    to={{
                      pathname: `/form`,
                      state: {
                        endpoint_label:
                          notification.userTasks[0].processId.replace(
                            /\.[^/.]+$/,
                            ""
                          ),
                        path: notification.userTasks[0].processId.replace(
                          /\.[^/.]+$/,
                          ""
                        ),
                        id: { id: notification.processId },
                        appName: notification.app,
                      },
                    }}
                    className="open-todo"
                  >
                    <img src={rightArrow} />
                  </Link>
                  <Link
                    id="open-todo-link-img"
                    className="close-todo-homepage"
                    to="#"
                  >
                    <img
                      style={{ height: "100%", width: "100%" }}
                      src="https://d29fhpw069ctt2.cloudfront.net/icon/image/39219/preview.png"
                      alt="close"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ItemPlacer>
    );
  };

  const RenderAccordion = ({ item }) => {
    const RenderAccordions = ({ acc, index }) => {
      return (
        <Accordion.Item eventKey={index}>
          <Accordion.Header>
            <div style={{ color: "#ff5711" }}>{acc.accordionName}</div>
          </Accordion.Header>
          <Accordion.Body>
            {acc?.items?.map((des) => (
              <p>{des.description}</p>
            ))}
          </Accordion.Body>
        </Accordion.Item>
      );
    };

    return (
      <ItemPlacer i={item.i} x={item.x} y={item.y} h={item.h} w={item.w}>
        <div className="accordion-wrapper-render">
          {item.fieldName && <p>{parse(item.fieldName)}</p>}
          <div class="accordion" id="accordionExample">
            <Accordion defaultActiveKey={0} flush>
              {item.accordionProperties.map((item, index) => (
                <RenderAccordions acc={item} index={index} />
              ))}
            </Accordion>
          </div>
        </div>
      </ItemPlacer>
    );
  };

  const RenderTab = ({ item }) => {
    const [key, setKey] = useState(0);

    return (
      <ItemPlacer i={item.i} x={item.x} y={item.y} h={item.h} w={item.w}>
        <div className="tab-wrapper">
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(parseInt(k))}
            className="mb-3"
          >
            {item.tabProperties.map((tab, index) => (
              <Tab
                eventKey={index}
                title={
                  <div
                    style={{
                      padding: "5px",
                      color: index === key ? "#ff5711" : "#0D3C84",
                    }}
                  >
                    {tab.tabName}
                  </div>
                }
              >
                {tab.items.map((des) => (
                  <p id={des.id}>{des.description}</p>
                ))}
              </Tab>
            ))}
          </Tabs>
        </div>
      </ItemPlacer>
    );
  };

  const RenderMenu = ({ item }) => {
    const [appList, setAppList] = useState([]);
    useEffect(() => {
      getMenuItems();
    }, []);

    const getMenuItems = () => {
      if (appList.length === 0) {
        try {
          axios
            .get(
              process.env.REACT_APP_IFAPP_API_ENDPOINT +
                "app-center/" +
                localStorage.getItem("workspace") +
                "/" +
                localStorage.getItem("appName") +
                "/context"
            )
            .then(async (r) => {
              setAppList(r.data.data._paths);
            });
        } catch (e) {
          console.log(e);
        }
      }
    };

    const getMenuItemName = (name) => {
      let menuName = name.split(/(?=[A-Z])/);
      menuName = menuName.toString();
      menuName = menuName.replace(/,/g, " ");
      return menuName;
    };

    return (
      <ItemPlacer i={item.i} x={item.x} y={item.y} h={item.h} w={item.w}>
        <div
          style={{
            border: "2px solid #c4c4c4",
            padding: "1.5rem",
            borderRadius: "10px",
          }}
        >
          <ul
            style={{
              display: "flex",
              flexDirection: item.isVertical ? "column" : "row",
              alignItems: "center",
              // overflow: "auto",
              height: "100%",
            }}
          >
            <li>
              <div
                className="process"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ display: "flex", flexDirection: "row" }}>
                  {/* <img alt="#" className="dashboardSvg mt-1" src={Dashboard} /> */}
                  <Dashboard className="svg-stroke iconSvgStrokeColor iconStrokehover" />

                  <h6 className="dashboardText">Dashboard</h6>
                </div>
                <div
                  className="sidebarborder"
                  style={{ marginTop: "5px" }}
                ></div>
              </div>
            </li>

            <li>
              {appList.map((cards) => {
                const menuItemName = getMenuItemName(cards.endpoint_label);
                return (
                  <div
                    className="process"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* <img alt="#" className="processImg" src={ProcessCircle} /> */}
                    <Link
                      id="menu-item-link"
                      to={{
                        pathname: `/form`,
                        state: {
                          endpoint_label: cards.endpoint_label,
                          path: cards.path,
                        },
                      }}
                      style={{
                        color: "inherit",
                        textDecoration: "inherit",
                      }}
                    >
                      <h6 className="processText">{menuItemName}</h6>
                    </Link>
                    <div className="sidebarborder render-menu"></div>
                  </div>
                );
              })}
            </li>
          </ul>
        </div>
      </ItemPlacer>
    );
  };

  const RenderRecentActivitiesTab = ({ item }) => {
    const [appList, setappList] = useState([]);
    const [createdApps, setcreatedApps] = useState([]);
    const [applicaionHistory, setApplicationHistory] = useState([]);
    useEffect(() => {
      loadApps();
    }, []);

    const loadApps = async () => {
      try {
        axios
          .get(
            process.env.REACT_APP_IFAPP_API_ENDPOINT +
              "app-center/" +
              localStorage.getItem("workspace") +
              "/" +
              Location.state.appName +
              "/context"
          )
          .then(async (r) => {
            setappList(r.data.data._paths);
            await axios
              .get(
                process.env.REACT_APP_IFAPP_API_ENDPOINT +
                  "q/" +
                  localStorage.getItem("workspace") +
                  "/" +
                  Location.state.appName +
                  "/" +
                  r.data.data._paths[0].path
              )
              .then((r) => {
                var tempShowRecentApps = false;
                r.data.length > 0
                  ? (tempShowRecentApps = true)
                  : (tempShowRecentApps = false);

                setcreatedApps(r.data);
              })
              .catch((e) => {
                console.log("error", e);
              });

            var applicationHistoryAPI = await axios.get(
              process.env.REACT_APP_IFAPP_API_ENDPOINT +
                "app-center/app/user/activities/" +
                Location.state.appName +
                "?user=" +
                localStorage.getItem("username")
            );
            setApplicationHistory([]);
            if (applicationHistoryAPI.data.data?.count > 0) {
              setApplicationHistory(applicationHistoryAPI.data.data.tasks);
            }
          })
          .catch((e) => {
            console.log("error", e);
          });
      } catch (error) {
        console.log();
      }
    };

    return (
      <ItemPlacer i={item.i} x={item.x} y={item.y} h={item.h} w={item.w}>
        <div
          className="customScrollBar recent-activity-wrapper-render"
          style={{
            overflow: "auto",
            height: "100%",
          }}
        >
          <h1>Recent Activities</h1>
          {applicaionHistory?.map((card, index) => {
            let timestamp = card._id.toString().substring(0, 8);
            let date = new Date(parseInt(timestamp, 16) * 1000);
            const cardDate = new Date(
              card.information?.startDate
            ).toLocaleString([], { dateStyle: "short", timeStyle: "short" });
            let status =
              card.status == "INPROGRESS" ? "Pending status" : "Completed";

            return (
              <Link
                id="recent-activity-link"
                to={{
                  pathname: `/form`,
                  state: {
                    endpoint_label: appList[0].endpoint_label,
                    path: appList[0].path,
                    id: card.id,
                  },
                }}
                className="btn btn-edit"
              >
                {/* <div key={card.id} className="card-wrap ">
                  <div className="card-item ">
                    <div className="card-info">
                      <h6>{date.toLocaleDateString()}</h6>
                    </div>
                    <div className="card-name" data-tip data-for={card.app}>
                      <p
                        style={{
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          margin: "0px",
                        }}
                      >
                        {card.app}
                      </p>
                      <p>Application</p>
                    </div>
                    <ReactTooltip id={card.app} place="top" effect="solid">
                      {card.app} <br></br>Application
                    </ReactTooltip>
                    <div className="card-status">
                      <h6>{status}</h6>
                    </div>
                  </div>
                </div> */}
                <div className="grid-card-wrap-container">
                  <Dropdown className="grid-card-kebabMenu">
                    <Dropdown.Toggle
                      variant=""
                      className="p-0 "
                      id="dropdown-basic"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-three-dots-vertical"
                        viewBox="0 0 16 16"
                      >
                        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                      </svg>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="grid-card-kebabMenu-dropdown">
                      <Dropdown.Item
                        id="grid-card-process-history"
                        // onClick={(e) => handleProcessPopupGrid(e, card.id)}
                        className="grid-card-kebabMenu-dropdown-Item"
                      >
                        {t("Process History")}
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <Link
                    id="grid-view-card-link"
                    to={{
                      pathname: `/form`,
                      state: {
                        endpoint_label: card?.information?.processName,
                        path: card?.information?.processName,
                        id: card?.id,
                      },
                    }}
                    className="btn btn-edit Grid-View-Card-link"
                    style={{ alignSelf: "center" }}
                  >
                    <div className="Grid-View-card-wrap ">
                      <div className="card-item recent-activity-item-render">
                        {/* <div> */}
                        <img
                          src={
                            card.status === "INPROGRESS"
                              ? recentPendingIco
                              : recentCompleteIco
                          }
                          alt={
                            card.status === "INPROGRESS"
                              ? recentPendingIco
                              : recentCompleteIco
                          }
                          className="pendingimage"
                        />
                        <p className="dateandtimeforrecentaction">{cardDate}</p>
                        <p
                          className="recentActionProcessName"
                          data-tip
                          data-for={card.id}
                        >
                          {card?.information?.processName}
                        </p>

                        <ReactTooltip id={card.id} place="top" effect="solid">
                          {card?.information?.processName}
                        </ReactTooltip>
                        <h6
                          className={
                            card.status == "INPROGRESS"
                              ? "Grid-view-cardstatus"
                              : "Grid-view-cardstatusCompleted"
                          }
                        >
                          {status}
                        </h6>
                      </div>
                    </div>
                  </Link>
                </div>
              </Link>
            );
          })}
        </div>
      </ItemPlacer>
    );
  };

  const RenderEmbed = ({ item }) => {
    const type = item?.mediaType;
    const src = item?.mediaUrl;
    return (
      <ItemPlacer i={item.i} x={item.x} y={item.y} h={item.h} w={item.w}>
        <div
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <embed type={type} src={src} width="90%" height="90%" />
        </div>
      </ItemPlacer>
    );
  };

  const RenderAllElements = ({ item, disabledStatus }) => {
    if (item.elementType === "label") return <RenderLabel item={item} />;
    if (item.elementType === "timer") return <RenderTimer item={item} />;
    if (item.elementType === "media") return <RenderMedia item={item} />;
    if (item.elementType === "qrcode") return <RenderQRCode item={item} />;
    if (item.elementType === "location") return <RenderLocation item={item} />;
    if (item.elementType === "dataGrid")
      return <RenderDataGrid item={item} disabledStatus={disabledStatus} />;
    if (item.elementType === "link") return <RenderLink item={item} />;
    if (item.elementType === "action") return <RenderAction item={item} />;
    if (item.elementType === "todo") return <RenderToDo item={item} />;
    if (item.elementType === "accordion")
      return <RenderAccordion item={item} />;
    if (item.elementType === "tab") return <RenderTab item={item} />;
    if (item.elementType === "menu") return <RenderMenu item={item} />;
    if (item.elementType === "recentActivities")
      return <RenderRecentActivitiesTab item={item} />;
    if (item.elementType === "embed") return <RenderEmbed item={item} />;
  };
  const [generateBackgroundImage, setGenerateBackgroundImage] = useState();

  const fetchImage = async () => {
    const url = `${process.env.REACT_APP_CDS_ENDPOINT}appLogo/image/${
      formLayout?.backgroundImage
    }?Authorization=${localStorage.getItem(
      "token"
    )}&workspace=${localStorage.getItem("workspace")}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch the image");
      }

      const imageBlob = await response.blob();

      const imageFile = new File([imageBlob], "image.jpg", {
        type: "image/jpg",
      });

      setGenerateBackgroundImage(imageFile);
    } catch (error) {
      console.error(error);
      setGenerateBackgroundImage(null);
    }
  };
  useEffect(() => {
    if (formLayout?.backgroundImage?.length > 0) {
      fetchImage();
    }
  }, [formLayout.backgroundImage]);

  const renderHomepageStyle = {
    display: "flex",
    marginLeft: "20px",
    marginRight: "20px",
    marginTop: "20px",
    paddingVertical: "80px",
    position: "relative",
    height: "calc(100vh - 17vh)",
    overflow: "auto",
    fontFamily: `${formLayout?.fontFamily}`,
    // backgroundColor: formLayout?.backgroundColor || "",
  }
  if (formLayout?.backgroundColor?.length > 0) {
    renderHomepageStyle.backgroundColor = formLayout?.backgroundColor;
  }
  else if (
    formLayout?.backgroundImage?.length > 0 &&
    generateBackgroundImage
  ) 
  { renderHomepageStyle.backgroundImage = `url(${URL.createObjectURL(
    generateBackgroundImage
  )})`;
  renderHomepageStyle.backgroundRepeat = "no-repeat";
  renderHomepageStyle.backgroundSize = "cover ";
}


  return (
    <>
      <div className="breadCrum BodyColor" style={{ width: "100vw" }}>
        <Link id="render-home-home" to="/dashboard">
          <img src={Home} alt="" />
        </Link>
        <h6>{">>"}</h6>

        <Link id="render-home-dashboard" to="/dashboard">
          <h6 className="primaryColor">Dashboard</h6>
        </Link>
        <h6>{">>"}</h6>
        <Link id="render-home-homePage" to="#">
          <h6 className="primaryColor">Homepage</h6>
        </Link>
      </div>
      <div
        className={
          formLayout?.backgroundColor || formLayout?.backgroundImage
            ? ""
            : "BodyColor"
        }
        style={renderHomepageStyle}
      >
        <RenderFormElement />
      </div>
    </>
  );
}
