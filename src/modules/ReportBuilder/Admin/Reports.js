import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Home } from "../../../assets";
import Accordion from "react-bootstrap/Accordion";
import ReportBuilderTable from "../../../components/ReportBuilder/ReportBuilderTable/ReportBuilderTable";
import CommonModelContainer from "../../../components/CommonModel/CommonModelContainer";
import "./Reports.css";
import Modal from "react-bootstrap/Modal";
import { Dropdown } from "react-bootstrap";
import { Icon } from "@iconify/react";
import ReactTooltip from "react-tooltip";
// import { TableSearchIcon } from "../../../assets";
import SearchIcon from "./../../../assets/reportBuilderIcons/SearchIcon.svg";
import { useTranslation } from "react-i18next";
import { getAppAndDatamodels, createReport } from "./../apis/ReportBuilderAPIs";
import { useRecoilState } from "recoil";
import { loggedInUserState } from "../../../state/atom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ReactPaginate from "react-paginate";
import CommonPagination from "../../../components/Pagination/CommonPagination";
import formatDateTimeInTimezone from "../../../components/DateAndTime/TimezoneFormatter";

const Reports = ({ setheaderTitle }) => {
  setheaderTitle("Report Builder");

  const history = useHistory();

  const [searchTerm, setSearchTerm] = useState("");

  const [allEntities, setAllEntities] = useState([]);
  const [reportName, setReportName] = useState("");
  const [reportDescription, setReportDescription] = useState("");

  const [tableCurrentPage, setTableCurrentPage] = useState(1);

  const [allAppsAndModelsList, setAllAppsAndModelsList] = useState([]);

  const [appForReport, setAppForReport] = useState("");
  const [dataModelForReport, setDataModelForReport] = useState("");
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const [t, i18n] = useTranslation("common");
  //variables for pagination
  const [offset, setOffset] = useState(1);
  const [data, setData] = useState([]);
  const [perPage] = useState(10);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    populateAppsAndDataModels();
  }, []);

  useEffect(() => {
    getAllReports();
  }, [offset]);

  useEffect(() => {
    getAllReports();
  }, [searchTerm]);

  const getAllReports = () => {
    var axios = require("axios");
    var data = "";

    let token = localStorage.getItem("token");
    let workspace = localStorage.getItem("workspace");

    var config = {
      method: "post",
      url: `${process.env.REACT_APP_REPORTBUILDER_ENDPOINT}reportBuilder/listAllReports?page=${offset}&size=10`,
      headers: {
        workSpaceName: workspace,
        Authorization: `Bearer ${token}`,
        user: localStorage.getItem("username"),
        role: "admin",
      },
      data: data,
    };

    if (searchTerm.length > 0) {
      config.headers.reportname = searchTerm;
    }

    axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));

        let allReports = response.data.data;

        console.log(allReports.length);
        // if (!Array.isArray(allReports)) {
        //   setTableCurrentPage(tableCurrentPage - 1);
        // }

        let reportDataTemp = allReports.map((report) => {
          let dateTime = report.lastAccessesOn.split("T");
          dateTime = dateTime.join();
          let currentReport = {
            reportName: report.reportName,
            accessibleBy: report.userName.concat(report.group),
            createdBy: report.createdBy,
            // createdOn: report.createdOn,
            createdOn: formatDateTimeInTimezone(report.createdOn),
            status: report.status,
            appName: report.appName,
          };
          return currentReport;
        });
        setReportData(reportDataTemp);

        if (response.data?.metaData) {
          setPageCount(response.data.metaData.totalPages);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setOffset(selectedPage + 1);
  };

  // const getCollectionsSchema = () => {
  //   var axios = require("axios");
  //   let token = localStorage.getItem("token");
  //   var data = "";

  //   var config = {
  //     method: "get",
  //     url: `${process.env.REACT_APP_REPORTBUILDER_ENDPOINT}reportBuilder/getCollectionSchema`,
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //     data: data,
  //   };

  //   axios(config)
  //     .then(function (response) {
  //       // console.log(JSON.stringify(response.data));
  //       let tempAllEntities = response.data.processes;
  //       tempAllEntities = Object.entries(tempAllEntities).map((value) => {
  //         // console.log("looping object", value);
  //         let entitiyDisplayName = value[0].split(".");
  //         entitiyDisplayName = entitiyDisplayName.join("");
  //         let entitiy = {
  //           entityName: value[0],
  //           entitiyDisplayName: entitiyDisplayName,
  //           isChecked: false,
  //         };
  //         return entitiy;
  //       });
  //       // console.log("allent", tempAllEntities);
  //       setAllEntities(tempAllEntities);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // };

  // const getWantedEntities = () => {
  //   let selectedEntities = allEntities.filter(
  //     (entitiy) => entitiy.isChecked == true
  //   );

  //   // console.log("se", selectedEntities);

  //   let wantedEntities = selectedEntities.map((entity) => {
  //     // console.log("ent", entity.entityName);

  //     let keyTemp = entity.entityName.split(".");
  //     keyTemp = keyTemp.join("");
  //     let keyValue = "$" + entity.entityName;

  //     let tempArr = [];
  //     tempArr.push(keyTemp);
  //     tempArr.push(keyValue);

  //     return tempArr;
  //   });

  //   const formattedEntities = Object.fromEntries(wantedEntities);

  //   // console.log("wanted", formattedEntities);

  //   return formattedEntities;
  // };

  //create report old
  // const createReport = () => {
  //   var axios = require("axios");

  //   let token = localStorage.getItem("token");
  //   let workspace = localStorage.getItem("workspace");

  //   var data = JSON.stringify({
  //     filter: {
  //       workspace: workspace,
  //       app: selectedAppName,
  //     },
  //     projection: getWantedEntities(),
  //     status: "draft",
  //   });

  //   var config = {
  //     method: "post",
  //     url: `${process.env.REACT_APP_REPORTBUILDER_ENDPOINT}reportBuilder/createReport`,
  //     headers: {
  //       workSpaceName: workspace,
  //       reportName: reportName,
  //       exportDataTo: "data",
  //       Authorization: `Bearer ${token}`,
  //       "Content-Type": "application/json",
  //     },
  //     data: data,
  //   };

  //   axios(config)
  //     .then(function (response) {
  //       // console.log(JSON.stringify(response.data));
  //       localStorage.setItem("currentreport", reportName);
  //       history.push("/report/create");
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // };

  const ReportDataHeaders = [
    {
      headerName: "Report Name",
    },
    {
      headerName: "Accessible By",
    },
    {
      headerName: "Created By",
    },
    {
      headerName: "Created on",
    },
    {
      headerName: "Status",
    },
  ];

  const [reportData, setReportData] = useState([]);

  //saurav popup
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [options, setOptions] = useState([
    { id: 1, value: "Entity 1", isChecked: false },
    { id: 2, value: "Entity 2", isChecked: false },
  ]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // const handleChange = (entityName) => {
  //   setAllEntities(
  //     allEntities.map((entitiy) => {
  //       let currentEntityName = entitiy.entityName;
  //       console.log(
  //         "comparision",
  //         entityName,
  //         currentEntityName,
  //         entityName === entitiy.entityName
  //       );
  //       if (entityName === entitiy.entityName) {
  //         // console.log("into if");
  //         entitiy.isChecked = !entitiy.isChecked;
  //       }
  //       return entitiy;
  //     })
  //   );
  //   console.log("selectedata", allEntities);
  // };

  const softDeleteReport = (reportName) => {
    var axios = require("axios");
    var data = "";

    let workSpaceName = localStorage.getItem("workspace");
    let token = localStorage.getItem("token");

    var config = {
      method: "delete",
      url: `${process.env.REACT_APP_REPORTBUILDER_ENDPOINT}reportBuilder/softDeleteReport`,
      headers: {
        workSpaceName: workSpaceName,
        reportName: reportName,
        user: localStorage.getItem("username"),
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        getAllReports();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const sortEntities = (sortDirection) => {
    let allEntitiesTemp = [...allEntities];

    if (sortDirection == "asc") {
      allEntitiesTemp.sort((a, b) => {
        const A = b.entitiyDisplayName.toLowerCase();
        const B = a.entitiyDisplayName.toLowerCase();
        if (A > B) {
          return -1;
        }
        if (A < B) {
          return 1;
        }

        return 0;
      });
    } else if (sortDirection == "desc") {
      allEntitiesTemp.sort((a, b) => {
        const A = a.entitiyDisplayName.toLowerCase();
        const B = b.entitiyDisplayName.toLowerCase();
        if (A > B) {
          return -1;
        }
        if (A < B) {
          return 1;
        }

        return 0;
      });
    }

    // console.log(allEntitiesTemp)

    setAllEntities(allEntitiesTemp);
  };

  //new implementation starts here

  const populateAppsAndDataModels = () => {
    getAppAndDatamodels().then((data) => {
      if (data.status == "success") {
        let alldata = data.data.collectionsWithSchema;

        // console.log(alldata);

        let allAppsAndModels = [];

        for (const key in alldata) {
          let currentData = {};

          // console.log(`${key}: ${alldata[key].length}`);

          currentData.appName = key;

          let appsPresent = [];

          for (let i = 0; i < alldata[key].length; i++) {
            // console.log(alldata[key][i]);
            appsPresent.push(alldata[key][i]);
          }
          currentData.dataModelsList = appsPresent;

          allAppsAndModels.push(currentData);
        }
        // console.log(allAppsAndModels);
        setAllAppsAndModelsList(allAppsAndModels);
      } else {
        toast.error(`Unable to fetch Apps and Data Models list`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    });
  };

  const handleDataModelSelection = (selectedValue) => {
    let selectedData = selectedValue.split(".");
    let selectedApp = selectedData[0];
    let selectedDataModel = selectedData[1];

    setAppForReport(selectedApp);
    setDataModelForReport(selectedDataModel);
  };

  const createNewReport = () => {
    if (reportName == "" || dataModelForReport == "" || appForReport == "") {
      let errorDialog =
        reportName == ""
          ? "Report Name can't be empty"
          : dataModelForReport == ""
          ? "Please select a data model"
          : "Something went wrong";

      toast.error(`${errorDialog}`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    localStorage.setItem("currentreportappname", appForReport);
    localStorage.setItem("reportModelName", dataModelForReport);
    localStorage.setItem("currentreport", reportName);

    let username = localStorage.getItem("username");

    createReport(
      reportName,
      reportDescription,
      appForReport,
      dataModelForReport,
      username
    ).then(function (data) {
      if (data.status == "success") {
        // console.log(JSON.stringify(data.data));
        localStorage.setItem("currentreport", reportName);
        toast.success(`Report Created Successfully`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        history.push("/report/create");
      } else if (data.status == "fail") {
        // console.log(data.error.response.data.message);
        toast.error(`${data.error.response.data.message}`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error(`Report could't be created`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    });
  };

  return (
    <>
      <div style={{ marginTop: "2vh", height: "100vh" }}>
        <div className="container-fluid">
          {/* this is for breadcrums */}
          <div className="row">
            <div
              className="col-md-6"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <div className="ms-2">
                <div className="breadCrum BodyColor" >
                  <Link to="/">
                    <img src={Home} alt="" />
                  </Link>
                  <h6 className="primaryColor">{">>"}</h6>
                  <Link to="/reports" disable>
                    <h6 className="primaryColor" style={{ color: " #0c83bf", letterSpacing: "1px" }}>
                      Report Builder
                    </h6>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 mb-3 px-5 py-4 create-report-section BodyColor">
          <div className="create-report-message primaryColor">
            Discover Data to create new amazing reports
          </div>

          <div className="row mt-3">
            <div className="col-4 pe-5">
              <div>
                <div className="create-report-input-label secondaryColor">Report name</div>
                <div>
                  <input
                    className="px-1 py-1 mt-1 report-name"
                    type="text"
                    placeholder="Enter New Report Name"
                    onChange={(e) => setReportName(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="col-4 pe-5">
              <div>
                <div className="create-report-input-label secondaryColor">Data Model</div>
                <div>
                  <select
                    className="data-model-btn px-1 py-1 mt-1"
                    onChange={(e) =>
                      // console.log(JSON.stringify(e.target.value))
                      handleDataModelSelection(e.target.value)
                    }
                  >
                    <option hidden disabled selected>
                      Select base Data set
                    </option>

                    {allAppsAndModelsList.map((app) => {
                      return (
                        <optgroup label={app.appName}>
                          {app.dataModelsList.map((dataModel) => {
                            return (
                              <option value={`${app.appName}.${dataModel}`}>
                                {dataModel}
                              </option>
                            );
                          })}
                        </optgroup>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>
            {loggedInUser.enabled_menus?.menus_enabled?.includes(
              "REPORTS_CREATE"
            ) && (
              <div className="col-4 d-flex align-items-end">
                <div className="">
                  <button
                    className="secondaryButton secondaryButtonColor create-report-btn "
                    onClick={() => createNewReport()}
                  >
                    Create New Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className="container-fluid px-5 mt-5 "
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <span className="reports-table-heading secondaryColor">
              Recently created reports
            </span>
          </div>
        </div>

        <div className="mx-5 px-2 mt-3">
          <div className="col-md-4 col-lg-4 col-sm-8">
            <div className="report-search">
              <img
                src={SearchIcon}
                // height={10}
                // width={10}
                className="report-searchicon"
              />
              <input
                type="text"
                className="report-searchinput"
                placeholder={t("search")}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  // setSearchColumn(column.id);
                }}
              />
            </div>
          </div>
        </div>

        <div className="px-5">
          <ReportBuilderTable
            TableData={reportData}
            TableHeaders={ReportDataHeaders}
            TableCurrentPage={tableCurrentPage}
            setTableCurrentPage={setTableCurrentPage}
            softDeleteReport={softDeleteReport}
            searchKeyword={searchTerm}
          />

          <div className="d-flex justify-content-end">
            <div>
              {/* <ReactPaginate
        previousLabel={"<"}
        nextLabel={">"}
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        subContainerClassName={"pages pagination"}
        activeClassName={"active"}
      /> */}

              <CommonPagination pageCount={pageCount} setOffset={setOffset} />
            </div>
          </div>
        </div>
      </div>

      {/* <CommonModelContainer
        modalTitle="Create Report"
        show={showCreateReportPopupOne}
        handleClose={() => setShowCreateReportPopupOne(false)}
        className=""
      >
        <div className="container-fluid">
          <div className="row mt-2">
            <div style={{ fontWeight: "600", fontSize: "14px" }}>
              Select Application
            </div>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {allApps.map((app) => {
                return (
                  <div
                    onClick={() => toggleTeamSelection(app.name)}
                    style={
                      app.isSelected
                        ? {
                            width: "85px",
                            height: "40px",
                            backgroundColor: "#FF5711",
                            color: "#fff",
                            border: "0.5px solid rgba(0, 0, 0, 0.2)",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: "15px",
                            marginRight: "15px",
                            fontWeight: "500",
                            fontSize: "12px",
                          }
                        : {
                            width: "85px",
                            height: "40px",

                            backgroundColor: "#FAFAFA",

                            border: "0.5px solid rgba(0, 0, 0, 0.2)",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: "15px",
                            marginRight: "15px",
                            fontWeight: "500",
                            fontSize: "12px",
                          }
                    }
                  >
                    <span data-tip data-for={app.name}>
                      {" "}
                      {app.name.length > 10
                        ? app.name.substring(0, 10) + "..."
                        : app.name}
                    </span>
                    {app.name.length > 10 && (
                      <ReactTooltip
                        id={app.name}
                        place="bottom"
                        className="tooltipCustom"
                        arrowColor="rgba(0, 0, 0, 0)"
                        effect="float"
                      >
                        <span style={{ fontSize: "12px" }}>{app.name}</span>
                      </ReactTooltip>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div
            className="row mt-4"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <button
              className="primaryButton"
              onClick={() => {
                setShowCreateReportPopupTwo(true);
                setShowCreateReportPopupOne(false);
              }}
            >
              Next
            </button>
          </div>
        </div>
      </CommonModelContainer> */}

      {/* <CommonModelContainer
        modalTitle="Create Report"
        show={showCreateReportPopupThree}
        handleClose={() => setShowCreateReportPopupThree(false)}
        style={{ width: "100% !important" }}
        className="report-popup"
      >
        <Modal.Body>
          <div className="report-popup-main">
            <div className="report-popup-header">
              <div className="report-searchbar">
                <Icon icon="ic:baseline-search" className="search-icon" />
                <input
                  type="search"
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="report-sort">
                <ul>
                  <li>
                    <Dropdown className="dropdown report-header-right">
                      <Dropdown.Toggle
                        variant=""
                        className="p-0 report-header-right-sort report-header-right-content"
                        id="dropdown-basic"
                      >
                        <Icon icon="gg:sort-za" className="report-sort-icon" />
                        Sort
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => sortEntities("asc")}>
                          <span className="table-alphasort">A-Z</span>
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => sortEntities("desc")}>
                          <span className="table-alphasort">Z-A</span>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                      <Dropdown.Toggle
                        variant=""
                        className="p-0 report-header-right-content"
                        id="dropdown-basic"
                      >
                        <Icon
                          icon="bx:filter-alt"
                          className="report-filter-icon"
                        />
                        Filter
                      </Dropdown.Toggle>
                    </Dropdown>
                  </li>
                </ul>
              </div>
            </div>
            <div className="report-popup-body customScrollBar">
              <div className="report-popup-content customScrollBar">
                <div className="create-report-heading">{selectedAppName}</div>

                <div className="dropdown report-popup-data">
                  <button className="dropdown-btn" onClick={toggleDropdown}>
                    <span>
                      <input
                        type="radio"
                        name="data-model"
                        className="specifyColor"
                      />
                      Entities
                    </span>
                  </button>
                  {dropdownOpen && (
                    <ul className="dropdown-content">
                      {allEntities
                        .filter((entity) => {
                          if (searchTerm == "") {
                            return entity;
                          } else if (
                            entity.entitiyDisplayName.includes(searchTerm)
                          ) {
                            return entity;
                          }
                        })
                        .map((entity) => (
                          <li key={entity.entityName}>
                            <label>
                              <input
                                type="checkbox"
                                checked={entity.isChecked}
                                onChange={() => handleChange(entity.entityName)}
                              />
                              {entity.entitiyDisplayName}
                            </label>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            <div className="create-report-button">
              <button className="primaryButton" onClick={() => createReport()}>
                Create Report
              </button>
            </div>
          </div>
        </Modal.Body>
      </CommonModelContainer> */}

      {/* <CommonModelContainer
        modalTitle="Create Report"
        show={showCreateReportPopupTwo}
        handleClose={() => setShowCreateReportPopupTwo(false)}
        className="publish-report"
      >
        <div className="container-fluid">
          <div className="row">
            <div style={{ fontWeight: "600", fontSize: "12px" }}>
              Report Name
            </div>
            <div
              className=""
              style={{ marginTop: "10px", marginBottom: "10px" }}
            >
              <input
                type="text"
                placeholder="Enter Report Name"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                style={{
                  width: "100%",
                  border: "1px solid #E5E5E5",
                  height: "30px",
                  borderRadius: "4px",
                  paddingLeft: "10px",
                  fontSize: "12px",
                  fontWeight: "500",
                  outline: "none",
                }}
              />
            </div>
            <div>
              <div>
                <input
                  type="checkbox"
                  className="form-check-input widget-chekbox"
                  name=""
                  id=""
                  style={{ outline: "none" }}
                />
                <label
                  style={{
                    marginLeft: "10px",
                    fontWeight: "600",
                    fontSize: "12px",
                  }}
                >
                  Add as a widget
                </label>
              </div>
            </div>
          </div>
          <div className="row mt-4">
            
            <div style={{ fontWeight: "600", fontSize: "14px" }}>
              Who can access this report?
            </div>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {teams.map((team) => {
                return (
                  <div
                    onClick={() => toggleTeamSelection(team.name)}
                    style={
                      team.isSelected
                        ? {
                            width: "80px",
                            height: "40px",
                            backgroundColor: "#FF5711",
                            color: "#fff",
                            border: "0.5px solid rgba(0, 0, 0, 0.2)",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: "15px",
                            marginRight: "15px",
                            fontWeight: "500",
                            fontSize: "12px",
                          }
                        : {
                            width: "80px",
                            height: "40px",

                            backgroundColor: "#FAFAFA",

                            border: "0.5px solid rgba(0, 0, 0, 0.2)",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: "15px",
                            marginRight: "15px",
                            fontWeight: "500",
                            fontSize: "12px",
                          }
                    }
                  >
                    {team.name}
                  </div>
                );
              })}
            </div>
          </div>
          <div
            className="row mt-4"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <button
              className="primaryButton"
              onClick={() => {
                setShowCreateReportPopupThree(true);
                setShowCreateReportPopupTwo(false);
              }}
            >
              Next
            </button>
          </div>
        </div>
      </CommonModelContainer> */}
      {/* <ToastContainer /> */}
    </>
  );
};

export default Reports;
