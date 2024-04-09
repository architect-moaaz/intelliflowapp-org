import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProcessHistoryTable.css";
import { Col, Row } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import CommonModelContainer from "../CommonModel/CommonModelContainer";
import SortIconDown from "../../assets/datagridIcons/SortIconDown";
import SortIconUp from "../../assets/datagridIcons/SortIconUp";
import NextArrow from "../../assets/datagridIcons/NextArrow";
import PrevArrow from "../../assets/datagridIcons/PrevArrow";
import { Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import CommonPagination from "../Pagination/CommonPagination";
const ProcessHistoryTable = () => {
  const [t, i18n] = useTranslation("common");
  const [handleProcessPopup, setHandleProcessPopup] = useState(false);
  const [processIdAppTable, setProcessIdAppTable] = useState("");
  const [processHistorySearch, setProcessHistorySearch] = useState("");
  const [processHistoryData, setProcessHistoryData] = useState([]);
  const [processHistoryDatas, setProcessHistoryDatas] = useState(null);
  const [currentColumn, setCurrentColumn] = useState("");
  const [currentSortDirection, setCurrentSortDirection] = useState("");
  const [TableCurrentPage, setTableCurrentPage] = useState(1);
  const [offset, setOffset] = useState(1);
  const [pageCount, setPageCount] = useState(0);

  const HandleTableRowClick = (e, data) => {
    setProcessIdAppTable(data);
    setHandleProcessPopup(true);
    e.preventDefault();
  };

  const ProcessHistoryTableHeader = [
    {
      headerDisplayName: "Process Id",
      headerName: "ProcessId",
    },
    {
      headerDisplayName: "Process Name",
      headerName: "ProcessName",
    },
    {
      headerDisplayName: "Status",
      headerName: "status",
    },
    {
      headerDisplayName: "Start Date",
      headerName: "StartDate",
    },
    {
      headerDisplayName: "Last Action",
      headerName: "LastAction",
    },
    {
      headerDisplayName: "Started By",
      headerName: "StartedBy",
    },
    {
      headerDisplayName: "Action By",
      headerName: "ActionBy",
    },
  ];

  const processHistory = (offset) => {
    const config = {
      headers: {
        workspace: localStorage.getItem("firstName"),
        app: localStorage.getItem("appName"),
      },
    };

    axios
      .get(
        process.env.REACT_APP_PROCESSHISTORY_ENDPOINT +
          `processInformation/fetch/${localStorage.getItem(
            "username"
          )}?page=${offset}&size=9`,
        config
      )
      .then((response) => {
        setProcessHistoryDatas(response?.data?.data);
        console.log("Process History", response.data.metaData.totalCount);
        console.log("Process History", response.data.metaData.totalPages);
        if (response.data?.metaData) {
          setPageCount(response.data.metaData.totalPages);
        }
      })
      .catch((e) => {
        console.log("error", e);
      });
  };

  useEffect(() => {
    processHistory(offset);
  }, [offset]);

  useEffect(() => {
    var HistoryProcessData = processHistoryDatas?.map((e) => {
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
    setProcessHistoryData(HistoryProcessData);
  }, [processHistoryDatas]);

  const doSort = (sortField, sortDirection) => {
    // console.log("srf", sortField);
    var dataTemp = [...processHistoryData];

    if (sortDirection == "ascending") {
      setCurrentColumn(sortField);
      setCurrentSortDirection("ascending");
      dataTemp.sort((a, b) => {
        if (b[sortField].toLowerCase() > a[sortField].toLowerCase()) {
          return -1;
        } else if (a[sortField].toLowerCase() > b[sortField].toLowerCase()) {
          return 1;
        } else {
          return 0;
        }
      });
    } else if (sortDirection == "descending") {
      setCurrentColumn(sortField);
      setCurrentSortDirection("descending");
      dataTemp.sort((a, b) => {
        if (b[sortField].toLowerCase() < a[sortField].toLowerCase()) {
          return -1;
        } else if (a[sortField].toLowerCase() < b[sortField].toLowerCase()) {
          return 1;
        } else {
          return 0;
        }
      });
    }

    setProcessHistoryData(dataTemp);
  };

  return (
    <>
      <div className="SearchProcessHistory BodyColor">
        <input
          type="text"
          id="ifApplication-processHistory-search"
          className="SearchProcessHistorySearch"
          placeholder={t("search")}
          onChange={(e) => setProcessHistorySearch(e.target.value)}
        />
      </div>
      <div className="processHistorytable-body-wrapper">
        <table className="processHistory-common-table customScrollBar BodyColor">
          <tbody>
            <tr className="table-head">
              {ProcessHistoryTableHeader?.map((header) => {
                return (
                  <th style={{ border: "0.5px solid white" }}>
                    <div className="header-container">
                      <div>{t(header.headerDisplayName)}</div>

                      <div className="d-flex justify-content-center">
                        <div className="mb-1">
                          <Dropdown className="">
                            <Dropdown.Toggle
                              variant=""
                              className="p-0 table-dropdown-toggle-btn"
                              id="dropdown-basic"
                            >
                              <div className="d-flex">
                                <div style={{ marginLeft: "2px" }}>
                                  <SortIconDown
                                    fillColor={
                                      currentColumn == header.headerName &&
                                      currentSortDirection == "ascending"
                                        ? "#ffffff"
                                        : "#C4C4C4"
                                    }
                                  />
                                </div>
                                <div style={{ marginLeft: "2px" }}>
                                  <SortIconUp
                                    fillColor={
                                      currentColumn == header.headerName &&
                                      currentSortDirection == "descending"
                                        ? "#ffffff"
                                        : "#C4C4C4"
                                    }
                                  />
                                </div>
                              </div>
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="table-sort-dropdown">
                              <span className="ms-2 table-sort primaryColor">
                                {t("sort")}
                              </span>
                              <Dropdown.Item
                                id="processHistoryTable-sorting-icon"
                                className="table-sort-dropdown-icon"
                                onClick={(e) => {
                                  // console.log(
                                  //   header.headerName,
                                  //   ProcessHistoryTableData
                                  // );
                                  doSort(header.headerName, "ascending");
                                }}
                              >
                                <span className="table-alphasort secondaryColor">
                                  A-Z; 0-9
                                </span>
                              </Dropdown.Item>
                              <Dropdown.Item
                                className="table-sort-dropdown-icon"
                                onClick={(e) => {
                                  doSort(header.headerName, "descending");
                                }}
                                id="processHistoryTable-sorting-descending"
                              >
                                <span className="table-alphasort secondaryColor">
                                  Z-A; 9-0
                                </span>
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>

            {processHistoryData
              ?.filter(
                (e) =>
                  e.ProcessId?.toLowerCase()?.includes(
                    processHistorySearch.toLowerCase()
                  ) ||
                  e.status?.toLowerCase()?.includes(processHistorySearch) ||
                  e.ProcessName?.toLowerCase()?.includes(processHistorySearch)
              )
              ?.map((data) => {
                return (
                  <tr
                    onClick={(e) => HandleTableRowClick(e, data.ProcessId)}
                    id="processHistoryTable-data"
                    className="BodyColor"
                  >
                    {Object.entries(data).map((value) => {
                      // console.log("value-60", value[1]);
                      return <td className="secondaryColor">{value[1]}</td>;
                    })}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* <div className="processHistoryPaginationWrapper BodyColor">
        <div className="processHistoryTablePagination">
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div
              id="processHistoryTable-Pagination-Btn"
              className="processHistoryPaginationBtn"
              onClick={() => {
                if (TableCurrentPage > 1) {
                  setTableCurrentPage(TableCurrentPage - 1);
                }
              }}
            >
              {" "}
              <PrevArrow fillColor={false ? "#0D3C84" : "#C4CDD5"} />
            </div>
            <div className="processHistoryPaginationBtn">
              {TableCurrentPage}
            </div>
            <div
              id="processHistoryTable-Pagination-Btn2"
              className="processHistoryPaginationBtn"
              onClick={() => setTableCurrentPage(TableCurrentPage + 1)}
            >
              {" "}
              <NextArrow fillColor={false ? "#0D3C84" : "#C4CDD5"} />
            </div>
          </div>
        </div>
      </div> */}
      <CommonPagination pageCount={pageCount} setOffset={setOffset} />

      <CommonModelContainer
        modalTitle="Process History"
        show={handleProcessPopup}
        handleClose={() => setHandleProcessPopup(false)}
        centered
        size="md"
        className="processHistoryPopup"
        id="processHistoryTable-Popup"
      >
        <Modal.Body className="processHistory-popup-body ">
          <div class="" id="ProcessHistoryData">
            <Row>
              <Col className="processHistory-row-2-col-1-1">
                <Row>
                  <p className="process-history-sub-heading ">Details</p>
                </Row>
                {processHistoryData
                  ?.filter((e) => e.ProcessId === processIdAppTable)
                  ?.map((e) => {
                    return (
                      <>
                        <Row className="process-history-current-row">
                          <Col>Process Id</Col>
                          <Col className="ellipsis">{e?.ProcessId}</Col>
                        </Row>
                        <Row className="process-history-current-row">
                          <Col>Process Name</Col>
                          <Col className="ellipsis">{e?.ProcessName}</Col>
                        </Row>
                        <Row className="process-history-current-row">
                          <Col>Status</Col>
                          <Col className="ellipsis">
                            {e?.status == "inprogress"
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
                    {processHistoryDatas
                      ?.filter((e) => e.processId === processIdAppTable)
                      ?.map((e, key) => {
                        const StartDate = new Date(e?.stages[0]?.startDate);
                        console.log("StartDate", StartDate);
                        return (
                          <li
                            className="processHistory-progressbar-item"
                            key={key}
                          >
                            {/* <i class="fa-solid fa-check"></i> */}
                            <div className="progressbar-item-div">
                              <label className="secondaryColor">Start</label>
                              <p className="secondaryColor">
                                {StartDate.toLocaleDateString()}
                              </p>
                            </div>
                          </li>
                        );
                      })}
                    {processHistoryDatas
                      ?.filter((e) => e.processId === processIdAppTable)
                      ?.map((e) =>
                        e?.stages?.map((item, key) => {
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
                              <label> {item.taskName} </label>

                              {item.state == "Ready" ? (
                                <p className="secondaryColor">
                                  Process initiated on{" "}
                                  {startDate.toLocaleDateString()} at{" "}
                                  {startDate.toLocaleTimeString()} & pending to
                                  complete
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
              id="processHistoryTable-okButton"
              className="primaryButton primaryButtonColor ProcessHistory-button"
              onClick={() => setHandleProcessPopup(false)}
            >
              Ok
            </button>
          </Row>
        </Modal.Body>
      </CommonModelContainer>
    </>
  );
};

export default ProcessHistoryTable;
