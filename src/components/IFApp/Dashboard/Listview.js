import { useState, useEffect } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { Icon } from "@iconify/react";
import axios from "axios";
import {
  Process,
  GridIcon,
  ListIcon,
  noRecordIco,
  sidearrowGrid,
} from "../../../assets";
import { ProcessCircle } from "../../../assets";

import { Col, Dropdown, Row } from "react-bootstrap";
import "../../ApplicationDashboard/ApplicationDashboard.css";
import "./ListView.css";
import moment from "moment";
import Sidebar from "./Sidebar";
import { atom, useRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import { loggedInUserState } from "../../../state/atom";

const Listview = () => {
  localStorage.setItem("Dashboard", "Intelliflow App Center");
  const Location = useLocation();
  const history = useHistory();
  const [t, i18n] = useTranslation("common");
  if (Location.state) localStorage.setItem("appName", Location.state.appName);
  const [showRecentApps, setshowRecentApps] = useState(false);
  const [appList, setappList] = useState([]);
  const [createdApps, setcreatedApps] = useState([]);
  const [applicaionHistory, setApplicationHistory] = useState([]);

  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);

  const [assignedProcesses, setAssignedProcesses] = useState([]);

  useEffect(() => {
    loadApps();
    getProcessesAsigned();

    const interval = setInterval(() => {
      refreshTransactions();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  async function getProcessesAsigned() {
    var config = {
      method: "get",
      url:
        process.env.REACT_APP_IDENTITY_ENDPOINT +
        "IDENTITY/access/" +
        loggedInUser?.currentRole,
    };

    axios(config)
      .then(function (response) {
        setAssignedProcesses(response?.data?.menus[0]?.process);
      })
      .catch(function (error) {
        // toast.error("Couldn't get the assigned menu", {
        //   position: "bottom-right",
        //   autoClose: 4000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   isLoading: false,
        // });
        console.log(error);
      });
  }

  async function loadApps() {
    if (appList.length == 0) {
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
            setappList(r.data.data._paths);
            await axios
              .get(
                process.env.REACT_APP_IFAPP_API_ENDPOINT +
                  "q/" +
                  localStorage.getItem("workspace") +
                  "/" +
                  localStorage.getItem("appName") +
                  "/" +
                  r.data.data._paths[0].path
              )
              .then((r) => {
                var tempShowRecentApps = false;
                r.data.length > 0
                  ? (tempShowRecentApps = true)
                  : (tempShowRecentApps = false);
                setshowRecentApps(tempShowRecentApps);

                setcreatedApps(r.data);
              })
              .catch((e) => {
                console.log("error", e);
              });

            var applicationHistoryAPI = await axios.get(
              process.env.REACT_APP_IFAPP_API_ENDPOINT +
                "app-center/app/user/activities/" +
                localStorage.getItem("appName") +
                "?user=" +
                localStorage.getItem("username")
            );
            setApplicationHistory([]);
            if (applicationHistoryAPI.data.data.count > 0) {
              setApplicationHistory(applicationHistoryAPI.data.data.tasks);
            }
          })
          .catch((e) => {
            console.log("error", e);
          });
      } catch (error) {
        console.log();
      }
    }
  }

  async function getTransactions() {
    var applicationHistoryAPI = await axios.get(
      process.env.REACT_APP_IFAPP_API_ENDPOINT +
        "app-center/app/user/activities/" +
        localStorage.getItem("appName") +
        "?user=" +
        localStorage.getItem("username")
    );

    setApplicationHistory([]);
    if (applicationHistoryAPI.data.data?.count > 0) {
      setApplicationHistory(applicationHistoryAPI.data.data.tasks);
    }
  }

  const refreshTransactions = () => {
    getTransactions();
  };

  return (
    <>
      {/* <div className="breadcrumps">
    <Link to="/"><img src="https://www.seekpng.com/png/detail/339-3392184_home-icons-blue-home-icon-blue-png.png"/></Link>
      <ul>
        <li>{'>>'} </li>
        <Link><li>Dashboard</li></Link>
        <li> {'>>'} </li>
        <li className="onpage">{localStorage.getItem('appName')}</li>

      </ul>
    </div> */}
      {/* <div className="switchview">
      <ul>
        <li><img src={ListIcon}/></li>
        <li><img src={GridIcon}/></li>
      </ul>

    </div> */}

      <div className="main">
        {/* <Sidebar /> */}
        <div className="listView-application-mains">
          <div className="listView-your-application">
            <div className="ListViewApplicationTitle">
              <h4 className="primaryColor">{t("Recent Actions")}</h4>
              <span className="secondaryColor">
                {/* <ul>
                  <li>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant=""
                        className="p-0"
                        id="dropdown-basic"
                      >
                        <Icon icon="gg:sort-za" />
                        Sort
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <h5 className="dropdown-title">Sort</h5>
                        <Dropdown.Item href="#">New-Old</Dropdown.Item>
                        <Dropdown.Item href="#">Old-New</Dropdown.Item>
                        <Dropdown.Item href="#">A-Z</Dropdown.Item>
                        <Dropdown.Item href="#">Z-A</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </li>
                  <li>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant=""
                        className="p-0"
                        id="dropdown-basic"
                      >
                        <Icon icon="bx:filter-alt" hFlip={true} vFlip={true} />
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
                  </li>
                </ul> */}
              </span>
            </div>
            {/* <div className="application-wrap"> */}

            {applicaionHistory.length != 0 && (
              <div className="Head">
                <Row>
                  <Col md="3" xs="3">
                    <h2>Date</h2>
                  </Col>
                  <Col md="3" xs="3">
                    <h2>Actions Done</h2>
                  </Col>
                  <Col md="3" xs="3">
                    <h2>Status</h2>
                  </Col>
                  <Col md="3" xs="3">
                    <h2>Assigned To</h2>
                  </Col>
                </Row>
              </div>
            )}
            <div
              className="ListViewRecentActionRow customScrollBar BodyColor"
              id="listView-recentAction"
            >
              {applicaionHistory.length !== 0 ? (
                applicaionHistory.map((card, index) => {
                  const cardDate = new Date(
                    card.information?.startDate
                  ).toLocaleString();
                  let timestamp = card._id.toString().substring(0, 8);
                  let date = new Date(parseInt(timestamp, 16) * 1000);
                  let status =
                    card.status == "INPROGRESS" ? "Pending" : "Completed";

                  return (
                    <div className="Data BodyColor" >
                      <Link
                      to="#"
                        id="listView-data-link"
                        onClick={() => {
                          if (status !== "Completed") {
                            history.push({
                              pathname: `/form`,
                              state: {
                                endpoint_label: card.information.processName,
                                path: card.information.processName,
                                id: card.id,
                              },
                            });
                          }
                        }}
                        className="btn primaryColor"
                        style={{ width: "100%" }}
                      >
                        <Row>
                          <Col md="3" xs="3">
                            <span className="griddate secondaryColor">{cardDate}</span>
                            {/* <h2 className="griddate">{date.toLocaleDateString()}</h2> */}
                          </Col>
                          <Col md="3" xs="3">
                            <h2 className="griddate secondaryColor">{card.app}</h2>
                          </Col>
                          <Col md="3" xs="3">
                            <h2
                              className={
                                status === "Pending"
                                  ? "gridstatuspending secondaryColor"
                                  : "gridstatusapproved secondaryColor"
                              }
                            >
                              {status}
                            </h2>
                          </Col>
                          <Col md="3" xs="3">
                            <h2 className="griddate secondaryColor">
                              {card?.information?.processName}
                            </h2>
                          </Col>
                        </Row>
                      </Link>
                    </div>
                  );
                })
              ) : (
                <div className="noRecord BodyColor">
                  <p className="noRecordData secondaryColor">
                    {" "}
                    <img src={noRecordIco} />
                    No records available{" "}
                  </p>
                </div>
              )}
            </div>
            {/* {applicaionHistory.length != 0 && (
              <div className="noRecord">
                <p className="noRecordData">
                  {" "}
                  <img src={noRecordIco} />
                  No records available{" "}
                </p>
              </div>
            )} */}
          </div>
          <div className="listView-your-application">
            <div className="ListViewApplicationTitle">
              <h4 className="primaryColor">Select {localStorage.getItem("appName")} process</h4>
              <span className="secondaryColor ">
                {/* <ul>
                  <li>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant=""
                        className="p-0"
                        id="dropdown-basic"
                      >
                        <Icon icon="gg:sort-za" />
                        Sort
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <h5 className="dropdown-title">Sort</h5>
                        <Dropdown.Item href="#">New-Old</Dropdown.Item>
                        <Dropdown.Item href="#">Old-New</Dropdown.Item>
                        <Dropdown.Item href="#">A-Z</Dropdown.Item>
                        <Dropdown.Item href="#">Z-A</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </li>
                  <li>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant=""
                        className="p-0"
                        id="dropdown-basic"
                      >
                        <Icon icon="bx:filter-alt" hFlip={true} vFlip={true} />
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
                  </li>
                </ul> */}
              </span>
            </div>
            <div className="Head">
              <Row>
                <h2>Process Flows</h2>
              </Row>
            </div>
            <div className="Data1  customScrollBar BodyColor">
              <Row className="ListCardProcessFlowRow">
                {appList.map((cards) => {
                  if (assignedProcesses.includes(cards.endpoint_label)) {
                    return (
                      <Col md="4" xs="4" className="ListCardProcessFlowCol">
                        <div className="Processflowbox BodyColor">
                          <Link
                            id="listView-Processflow-link"
                            to={{
                              pathname: `/form`,
                              state: {
                                endpoint_label: cards.endpoint_label,
                                path: cards.path,
                              },
                            }}
                            className="btn btn-edit ellipsis primaryColor"
                            style={{ width: "93%", textAlign: "left" }}
                          >
                            {cards.endpoint_label}
                          </Link>
                          <img className="processimg1" src={sidearrowGrid} />
                        </div>
                      </Col>
                    );
                  }
                })}
              </Row>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

export default Listview;
