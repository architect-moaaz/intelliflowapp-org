import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import "./AdminDashboard.css";
import CommonTable from "../Tables/CommonTable/CommonTable";
// import ReportBuilderViewTable from "./ReportBuilderViewTable";
import ReportviewerTable from "../ReportBuilder/ReportBuilderTable/ReportviewerTable";
import { Col, Dropdown, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";
import CommonPagination from "../Pagination/CommonPagination";
import ReportHistory from "./ReportHistory";

import {
  Home,
  RBdropdownIcon,
  YourLogo,
  ReportBuilderCopyIcon,
  ReportBuilderLoadIcon,
  RegenerateIcon,
} from "../../assets";
import CommonModelContainer from "../CommonModel/CommonModelContainer";
import ReactTooltip from "react-tooltip";

import {
  initiateReportGeneration,
  getReportDownloadHistory,
} from "../../modules/ReportBuilder/apis/ReportBuilderAPIs";

const ReportBuilderView = () => {
  const [tableReportData, setTableReportData] = useState([]);
  const [tableCurrentPage, setTableCurrentPage] = useState(1);
  const [tableReportHeaders, setTableReportHeaders] = useState([]);
  const [showDownloadFile, setShowDownloadFile] = useState(false);

  const [isReportViewActive, setIsReportViewActive] = useState(true);
  const [isReportHistoryActive, setIsReportHistoryActive] = useState(false);

  //variables for pagination
  const [offset, setOffset] = useState(1);
  const [data, setData] = useState([]);
  const [perPage] = useState(10);
  const [pageCount, setPageCount] = useState(0);

  const openDownloadPopUp = () => {
    setShowDownloadFile(!showDownloadFile);
  };

  const [reportUrl, setReportUrl] = useState("");

  useEffect(() => {
    getReportData();
  }, [offset]);

  const viewReportapi = () => {
    var axios = require("axios");
    var data = "";

    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_REPORTBUILDER_ENDPOINT}reportBuilder/getReport?page=${tableCurrentPage}&size=7`,
      headers: {
        reportName: localStorage.getItem("reportToBeViewed"),
        exportDataTo: "data",
        workspaceName: localStorage.getItem("workspace"),
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        let reportData = response.data;
        const ReportDataHeaders = Object.entries(reportData[0]).map((value) => {
          let currentHeader = {
            headerName: value[0],
          };
          return currentHeader;
        });
        setTableReportHeaders(ReportDataHeaders);
        let datatobesend = reportData;
        setTableReportData(datatobesend);

        // console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getReportData = () => {
    var axios = require("axios");
    var data = JSON.stringify({});

    var config = {
      method: "post",
      url: `${process.env.REACT_APP_REPORTBUILDER_ENDPOINT}reportBuilder/getReport/v2?page=${offset}&size=10`,
      headers: {
        reportName: localStorage.getItem("reportToBeViewed"),
        exportDataTo: "data",
        user: localStorage.getItem("username"),
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        let reportData = response.data.data;
        const ReportDataHeaders = Object.entries(reportData[0]).map((value) => {
          let currentHeader = {
            headerName: value[0],
          };
          return currentHeader;
        });
        setTableReportHeaders(ReportDataHeaders);
        let datatobesend = reportData;
        setTableReportData(datatobesend);

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

  const DownloadRB = async (downoloadFileType) => {
    openDownloadPopUp();
    const downloadableFileExtension =
      downoloadFileType == "excel" ? "xlsx" : downoloadFileType;
    // const id = toast.loading("Downloading....");
    let options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        workSpaceName: localStorage.getItem("workspace"),
        reportName: localStorage.getItem("reportToBeViewed"),
        exportDataTo: downoloadFileType,
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };

    let fetchRes = fetch(
      `${process.env.REACT_APP_REPORTBUILDER_ENDPOINT}reportBuilder/getReport?page=1&size=5`,
      options
    );
    fetchRes.then((response) => {
      response.blob().then((blob) => {
        // toast.update(id, {
        //   render: "App Report Downloaded Successfully!!",
        //   position: "top-right",
        //   autoClose: 5000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   type: "success",
        //   isLoading: false,
        // });
        console.log(blob);
        const fileURL = window.URL.createObjectURL(blob);
        let alink = document.createElement("a");
        alink.href = fileURL;
        alink.download = `${localStorage.getItem(
          "reportToBeViewed"
        )}.${downloadableFileExtension}`;
        alink.click();

        // console.log("downloadsucess", toast.success);
      });
    });
  };

  //new

  const requestReportDownload = (fileType) => {
    let reportName = localStorage.getItem("reportToBeViewed");
    let username = localStorage.getItem("username");

    initiateReportGeneration(reportName, fileType, username).then((data) => {
      if (data.status == "success") {
        // getReportsGeneratedData()
        toast.success(
          `Your report generation has initiated. Please check in the Report download logs section.`,
          {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      } else {
        toast.error(
          `Something went wrong, report generation could't be initiated`,
          {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }
    });
  };

  const getReportsGeneratedData = () => {
    let username = localStorage.getItem("username");
    let reportName = localStorage.getItem("reportToBeViewed");

    let timesApiCalled = 0;

    let intervalId = setInterval(() => {
      getReportDownloadHistory(username).then((data) => {
        timesApiCalled = timesApiCalled + 1;
        if ((data.status = "success")) {
          let allReports = data.data;
          console.log("allreports", allReports);

          let thisReport = data.data.filter(
            (report) => report.reportName == reportName
          );

          console.log("allreports", thisReport);

          if (thisReport[0].status == "Completed") {
            clearInterval(intervalId);
            downloadTheFile(thisReport[0].fileURL, thisReport[0].fileType);
            setReportUrl(thisReport[0].fileURL);
          } else if (timesApiCalled > 6) {
            clearInterval(intervalId);
            toast.error(`file could not be downloaded, please try again`, {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          }
        }
      });
    }, 5000);
  };

  const downloadTheFile = (fileUrl, fileExtension) => {
    var axios = require("axios");

    let fileExt = fileExtension == "excel" ? "xlsx" : fileExtension;

    var config = {
      method: "get",
      headers: {},
    };

    let fetchRes = fetch(fileUrl, config);

    fetchRes
      .then((response) => {
        // console.log(JSON.stringify(response.data));

        response.blob().then((blob) => {
          console.log(blob);
          const fileURL = window.URL.createObjectURL(blob);
          let alink = document.createElement("a");
          alink.href = fileURL;
          alink.download = `${localStorage.getItem(
            "currentreport"
          )}.${fileExt}`;
          alink.click();
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const [isCopied, setIsCopied] = useState(false);

  // This is the function we wrote earlier
  async function copyTextToClipboard(text) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }

  // onClick handler function for the copy button
  const handleCopyClick = () => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(reportUrl)
      .then(() => {
        // If successful, update the isCopied state value
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="RBbreadcrum">
        <Link id="report-builder-home" to="/UserReport">
          <img src={Home} alt="" />
        </Link>
        <h6 className="primaryColor">{">>"}</h6>
        <Link
          id="report-builder-report-viewer"
          className="Linkdeco"
          to="/UserReports"
        >
          <h6 className="primaryColor">
            {/* {localStorage.getItem("appName")} */}
            Report Viewer
          </h6>
        </Link>
        <h6 className="primaryColor">{">>"}</h6>
        <h6 className="primaryColor">{localStorage.getItem("reportToBeViewed")}</h6>
      </div>

      <div className="Reportmainbody">
        <div className="MainReportbuilderview">
          <div className="containReport">
            <div className="reportsviewinline">
              <div>
                <span className="AppReports secondaryColor">
                  {" "}
                  {localStorage.getItem("reportToBeViewed")}
                </span>
              </div>
            </div>
            <div>
              <div
                className="mt-4"
                style={{ display: "flex", flexDirection: "row" }}
              >
                <div
                  className="mx-3 py-1 px-3 "
                  style={
                    isReportViewActive
                      ? { borderBottom: "2.5px solid #FF5711", fontSize:'20px', fontWeight:'700' }
                      : { fontSize:'20px', fontWeight:'700'}
                  }
                  onClick={() => {
                    setIsReportViewActive(true);
                    setIsReportHistoryActive(false);
                  }}
                >
                  Report
                </div>
                <div
                  className="mx-3 py-1 px-3"
                  style={
                    isReportHistoryActive
                      ? { borderBottom: "2.5px solid #FF5711", fontSize:'20px', fontWeight:'700' }
                      : { fontSize:'20px', fontWeight:'700'}
                  }
                  onClick={() => {
                    setIsReportViewActive(false);
                    setIsReportHistoryActive(true);
                  }}
                >
                  Report download logs
                </div>
              </div>
              <hr style={{ marginTop: "-1px" }}></hr>
            </div>
            {isReportViewActive && (
              <div>
                <div className=" d-flex flex-row-reverse">
                  {/* <div className="">
               <div className="Linkdeco">
                 <span className="InputCopy"  data-tip data-for="Inputcopy" onClick={() => handleCopyClick()}>
                   <img src={ReportBuilderCopyIcon} />
                 </span>
               </div>
               <ReactTooltip
                 id="Inputcopy"
                 place="bottom"
                 className="tooltipCustom"
                 arrowColor="rgba(0, 0, 0, 0)"
                 effect="solid"
               >
                { isCopied ? "copied" : "click to copy report url" }
               </ReactTooltip>
             </div> */}
                  <div className="d-flex flex-row align-items-center justify-content-end">
                    <div className="">
                      <div className="Linkdeco" onClick={() => getReportData()}>
                        <span
                          className="Regenerate"
                          data-tip
                          data-for="regenerate"
                        >
                          {" "}
                          <img className="RGIco ps-1 " src={RegenerateIcon} />
                        </span>
                      </div>
                      <ReactTooltip
                        id="regenerate"
                        place="bottom"
                        className="tooltipCustom"
                        arrowColor="rgba(0, 0, 0, 0)"
                        effect="solid"
                      >
                        Regenerate
                      </ReactTooltip>
                    </div>
                    <div className="ms-5">
                      {" "}
                      <Dropdown>
                        <Dropdown.Toggle
                          tag="a"
                          className="secondaryButtonReportGenerate"
                          id="report-builder-download"
                        >
                          <span className="me-1">Generate Report</span>
                          <img
                            id="report-builder-download-img"
                            src={RBdropdownIcon}
                          />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item
                            id="report-builder-pdf"
                            className="RBdownloddropdown"
                            onClick={() => {
                              requestReportDownload("pdf");
                            }}
                          >
                            PDF
                          </Dropdown.Item>
                          <Dropdown.Item
                            id="report-builder-csv"
                            className="RBdownloddropdown"
                            onClick={() => {
                              requestReportDownload("csv");
                            }}
                          >
                            CSV
                          </Dropdown.Item>
                          <Dropdown.Item
                            id="report-builder-excel"
                            className="RBdownloddropdown"
                            onClick={() => {
                              requestReportDownload("excel");
                            }}
                          >
                            Excel
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                </div>
                <div className="ReportBuilderViewOpacity">
                  <CommonTable
                    TableData={tableReportData}
                    TableHeaders={tableReportHeaders}
                    TableCurrentPage={tableCurrentPage}
                    setTableCurrentPage={setTableCurrentPage}
                  />

                  <div className="d-flex justify-content-end">
                    <div>
                      <CommonPagination
                        pageCount={pageCount}
                        setOffset={setOffset}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isReportHistoryActive && (
              <div>
                <ReportHistory
                  reportName={localStorage.getItem("reportToBeViewed")}
                />
              </div>
            )}
            <CommonModelContainer
              modalTitle={"Download Report"}
              show={showDownloadFile}
              handleClose={openDownloadPopUp}
              className="RBdownload-modal"
              id="report-builder-download-report-modal"
            >
              <h6 className="deletebpmn primaryColor">Your Download is initiated</h6>
            </CommonModelContainer>
          </div>
        </div>
      </div>
      {/* <div className="mt-3 ReportBuilderYourLogoHere">
        <img id="report-builder-your-logo" src={YourLogo} className="RPYourLogoHere" alt="Your Logo" />
      </div> */}
    </>
  );
};
export default ReportBuilderView;
