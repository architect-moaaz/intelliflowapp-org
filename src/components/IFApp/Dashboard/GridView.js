import { useState, useLayoutEffect, useEffect } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { Icon } from "@iconify/react";
import axios from "axios";
import {
  recentPendingIco,
  sideArrowIco,
  recentCompleteIco,
  noRecordIco,
  ReloadIcon,
} from "../../../assets";
import { Dropdown } from "react-bootstrap";
import "../../ApplicationDashboard/ApplicationDashboard.css";
import "./IFApp.css";
import "./Card.css";
import { atom, useRecoilState } from "recoil";
import "./Sidebar.css";
import ReactTooltip from "react-tooltip";
import { Col, Row } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import "./GridView.css";
import CommonModelContainer from "../../CommonModel/CommonModelContainer";
import { loggedInUserState } from "../../../state/atom";
import { useTranslation } from "react-i18next";

export const appListIfApp = atom({
  key: "appListIfApp",
  default: [],
});

const GridView = () => {
  const [t, i18n] = useTranslation("common");
  localStorage.setItem("Dashboard", t("appStore"));
  const Location = useLocation();
  const history = useHistory();
  if (Location.state) localStorage.setItem("appName", Location.state.appName);

  const [appList, setappList] = useState([]);
  const [createdApps, setcreatedApps] = useState([]);
  const [applicaionHistory, setApplicationHistory] = useState([]);
  const [, appListIfAppData] = useRecoilState(appListIfApp);
  const [showRecentApps, setshowRecentApps] = useState(false);
  const [processPopupGrid, setProcessPopupGrid] = useState(false);
  const [processIdAppGrid, setProcessIdAppGrid] = useState("");
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const [processHistoryData, setProcessHistoryData] = useState(null);
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

  const processHistory = (id) => {
    const config = {
      headers: {
        workspace: localStorage.getItem("firstName"),
        app: localStorage.getItem("appName"),
        processId: id,
      },
    };

    axios
      .get(
        process.env.REACT_APP_PROCESSHISTORY_ENDPOINT +
          `processInformation/fetch/${localStorage.getItem("username")}`,
        config
      )
      .then((response) => {
        setProcessHistoryData(response.data.data);
      })
      .catch((e) => {
        console.log("error", e);
      });
  };

  var HistoryProcessData = processHistoryData?.map((e) => {
    console.log(e, "e");
    let StartDate;
    let LastAction;
    if (e?.stages?.length > 0) {
      StartDate = new Date(e?.stages[0]?.startDate);
      LastAction = new Date(e?.stages[e?.stages?.length - 1]?.startDate);
    } else {
      StartDate = new Date(e?.stages?.startDate);
      LastAction = new Date(e?.stages?.startDate);
    }
    return {
      ProcessId: e.processId,
      ProcessName: e.processName,
      status: e.status,
      StartDate: StartDate?.toLocaleDateString(),
      LastAction: LastAction?.toLocaleDateString(),
      StartedBy: e.initiatedBy,
      ActionBy: e.lastActioned,
    };
  });

  async function getProcessesAsigned() {
    console.log("loggedInUser", loggedInUser);
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
            appListIfAppData(r.data.data._paths);
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
            await getTransactions();
          })
          .catch((e) => {
            console.log("error", e);
          });
      } catch (error) {
        console.log(error);
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

  const handleProcessPopupGrid = (e, id) => {
    e.preventDefault();
    setProcessPopupGrid(true);
    processHistory(id);
  };

  return (
    <div className="gridView-application-mains gridView-application-content">
      <div className="gridView-your-application">
        <div className="gridView-application-title-wrap">
          <h4 className="primaryColor">{t("Recent Actions")}</h4>

          {/* <ul>
            <li>
              <Dropdown>
                <Dropdown.Toggle variant="" className="p-0" id="dropdown-basic">
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
                <Dropdown.Toggle variant="" className="p-0" id="dropdown-basic">
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
            </li>
          </ul> */}
        </div>

        <div
          className="gridView-application-wrap customScrollBar BodyColor"
          id="griView-application"
        >
          {applicaionHistory.length !== 0 ? (
            applicaionHistory?.map((card) => {
              const cardDate = new Date(
                card.information?.startDate
              ).toLocaleString([], { dateStyle: "short", timeStyle: "short" });
              let status =
                card.status === "INPROGRESS" ? "Pending" : "Completed";
              return (
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
                        onClick={(e) => handleProcessPopupGrid(e, card.id)}
                        className="grid-card-kebabMenu-dropdown-Item"
                        id="gridView-kebabMenu-ProcessHistory"
                      >
                        {t("Process History")}
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <Link
                    to="#"
                    onClick={() => {
                      if (status !== "Completed") {
                        history.push({
                          pathname: `/form`,
                          state: {
                            endpoint_label: card.information.processId,
                            path: card.information.processId,
                            id: card.id,
                          },
                        });
                      }
                    }}
                    className="btn btn-edit Grid-View-Card-link"
                    style={{ alignSelf: "center" }}
                    id="gridView-card-link"
                  >
                    <div className="Grid-View-card-wrap ">
                      <div className="card-item ">
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
                          id="gridView-img"
                        />
                        {/* </div> */}
                        {/* <div className="card-date"> */}
                        <p className="dateandtimeforrecentaction secondaryColor">
                          {cardDate}
                        </p>
                        {/* </div> */}
                        {/* <div className="card-name"> */}
                        <p
                          className="recentActionProcessName secondaryColor"
                          data-tip
                          data-for={card.id}
                        >
                          {t(card?.information?.processName)}
                        </p>
                        {/* </div> */}
                        <ReactTooltip id={card.id} place="top" effect="solid">
                          {card?.information?.processName}
                        </ReactTooltip>
                        <h6
                          className={
                            card.status == "INPROGRESS"
                              ? "Grid-view-cardstatus"
                              : "Grid-view-cardstatusCompleted"
                          }
                          id="gridView-status"
                        >
                          {t(status)}
                        </h6>
                      </div>
                    </div>
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
        <div className="gridView-application-title-wrap">
          <h4 className="primaryColor">{t("Application process")}</h4>
          {/* <ul>
            <li>
              <Dropdown>
                <Dropdown.Toggle variant="" className="p-0" id="dropdown-basic">
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
              <Dropdown className="filteric">
                <Dropdown.Toggle
                  variant=""
                  className="p-0 "
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
            </li>
          </ul> */}
        </div>

        <div className="IFapplication-card-wrap customScrollBar">
          {appList.map((cards) => {
            const processName =
              localStorage.getItem("appName") + "." + cards.endpoint_label;
            if (assignedProcesses?.includes(processName)) {
              return (
                <div className="card-wrap-process BodyColor" id="card-process">
                  <Link
                    id="card-wrap-process-link"
                    to={{
                      pathname: `/form`,
                      state: {
                        endpoint_label: cards.endpoint_label,
                        path: cards.path,
                      },
                    }}
                  >
                    <img className="sidearrowIco" src={sideArrowIco} />
                  </Link>
                  <div className="card-border">
                    <div className="application-box-info gridView-application-box-info">
                      <Link
                        id="application-box-info-link"
                        data-tip
                        data-for={cards.endpoint_label}
                        to={{
                          pathname: `/form`,
                          state: {
                            endpoint_label: cards.endpoint_label,
                            path: cards.path,
                          },
                        }}
                        className="btn btn-edit ellipsis"
                      >
                        {t(cards.endpoint_label)}
                      </Link>
                      <ReactTooltip
                        id={cards.endpoint_label}
                        place="top"
                        effect="solid"
                      >
                        {cards.endpoint_label}
                      </ReactTooltip>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
        <CommonModelContainer
          modalTitle="Process History"
          show={processPopupGrid}
          handleClose={() => setProcessPopupGrid(false)}
          centered
          size="md"
          className="processHistoryPopup"
          id="processHistory-modal"
        >
          <Modal.Body className="processHistory-popup-body">
            <div class="" id="ProcessHistoryData">
              <Row>
                <Col className="processHistory-row-2-col-1-1">
                  <Row>
                    <p className="process-history-sub-heading ">Details</p>
                  </Row>

                  {HistoryProcessData
                    // ?.filter((e) => e.ProcessId === processIdAppGrid)
                    ?.map((e) => {
                      return (
                        <>
                          <Row className="process-history-current-row">
                            <Col>{t("Process Id")}</Col>
                            <Col className="ellipsis">{e?.ProcessId}</Col>
                          </Row>
                          <Row className="process-history-current-row">
                            <Col>Process Name</Col>
                            <Col className="ellipsis">{e?.ProcessName}</Col>
                          </Row>
                          <Row className="process-history-current-row">
                            <Col>Status</Col>
                            <Col className="ellipsis">
                              {e.status == "inprogress"
                                ? "In Progress"
                                : "Completed"}
                            </Col>
                          </Row>
                          <Row className="process-history-current-row">
                            <Col>Start Date</Col>
                            <Col className="ellipsis">{e?.StartDate}</Col>
                          </Row>
                          <Row className="process-history-current-row">
                            <Col>Last Action Date</Col>
                            <Col className="ellipsis">{e?.LastAction}</Col>
                          </Row>
                          <Row className="process-history-current-row">
                            <Col>Action By</Col>
                            <Col className="ellipsis">{e?.StartedBy}</Col>
                          </Row>
                          <Row className="process-history-current-row">
                            <Col>Last Action By</Col>
                            <Col className="ellipsis">{e?.ActionBy}</Col>
                          </Row>
                        </>
                      );
                    })}
                </Col>
                <Col className="processHistory-row-2-col-2">
                  <Row>
                    <p className="process-history-sub-heading ">Process</p>
                  </Row>
                  <div className="processHistory-progressbar-container customScrollBar">
                    <ul className="processHistory-progressbar">
                      {processHistoryData
                        // ?.filter((e) => e.processId === processIdAppGrid)
                        ?.map((e, key) => {
                          let StartDate;
                          if (e?.stages?.length > 0) {
                            StartDate = new Date(e?.stages[0]?.startDate);
                          } else {
                            StartDate = new Date(e?.stages?.startDate);
                          }
                          // const StartDate = new Date(e?.stages[0]?.startDate);
                          return (
                            <li
                              className="processHistory-progressbar-item"
                              key={key}
                            >
                              {/* <i class="fa-solid fa-check"></i> */}
                              <div className="progressbar-item-div">
                                <label>Start</label>
                                <p className="secondaryColor">
                                  {StartDate.toLocaleDateString()}
                                </p>
                              </div>
                            </li>
                          );
                        })}
                      {processHistoryData
                        // ?.filter((e) => e.processId === processIdAppGrid)
                        ?.map((e) =>
                          e.stages?.map((item, key) => {
                            const startDate = new Date(item?.startDate);
                            const completeDate = new Date(item?.completeDate);

                            return (
                              <li
                                className={
                                  e.status === "inprogress"
                                    ? "processHistory-progressbar-item-nth-inprocess processHistory-progressbar-item"
                                    : "processHistory-progressbar-item-nth-complete processHistory-progressbar-item"
                                }
                                key={key}
                              >
                                <label className="secondaryColor">
                                  {" "}
                                  {item.taskName}{" "}
                                </label>

                                {item.state == "Ready" ? (
                                  <p className="secondaryColor">
                                    Process initiated on{" "}
                                    {startDate.toLocaleDateString()} at{" "}
                                    {startDate.toLocaleTimeString()} & pending
                                    to complete
                                  </p>
                                ) : (
                                  <p className="secondaryColor">
                                    Process completed by {item?.actualOwner} on{" "}
                                    {completeDate.toLocaleDateString()} at{" "}
                                    {completeDate.toLocaleTimeString()}
                                  </p>
                                )}
                                {/* {e.status == "completed" ? (
                                <p>Process completed successfully</p>
                              ) : null} */}
                              </li>
                            );
                          })
                        )}
                    </ul>
                  </div>
                </Col>
              </Row>
            </div>
            <Row className="button-prop">
              <button
                className="primaryButton primaryButtonColor ProcessHistory-button"
                onClick={() => setProcessPopupGrid(false)}
                id="gridView-processPopup-close"
              >
                Ok
              </button>
            </Row>
          </Modal.Body>
        </CommonModelContainer>
      </div>
    </div>
  );
};

export default GridView;
