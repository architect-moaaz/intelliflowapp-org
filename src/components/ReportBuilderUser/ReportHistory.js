import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
// import "./AdminDashboard.css";
import ReportBuilderViewTable from "./ReportBuilderViewTable";
import { Col, Dropdown, Row } from "react-bootstrap";
// import ReactPaginate from "react-paginate";
import { getReportDownloadHistory } from "../../modules/ReportBuilder/apis/ReportBuilderAPIs";
import ReactPaginate from "react-paginate";
import CommonPagination from "../Pagination/CommonPagination";
import ReactTooltip from "react-tooltip";

import {
  Home,
  RHdownloadIcon,
  RBdropdownIcon,
  YourLogo,
  RHFilterIcon,
  ReportBuilderCopyIcon,
  ReportBuilderLoadIcon,
  RegenerateIcon,
} from "../../assets";

import ReportHistoryTable from "./ReportHistoryTable";

const ReportHistory = ({ reportName }) => {
  const [tableCurrentPage, setTableCurrentPage] = useState(1);
  const [reportHistoryData, setReportHistoryData] = useState([]);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  //variables for pagination
  const [offset, setOffset] = useState(1);
  const [data, setData] = useState([]);
  const [perPage] = useState(10);
  const [pageCount, setPageCount] = useState(0);

  const ColumnHeaders = [
    {
      headerName: "Report Name",
    },
    {
      headerName: "Report Id",
    },
    {
      headerName: "Report Type",
    },
    {
      headerName: "File Type",
    },
    {
      headerName: "Start Time",
    },
    {
      headerName: "End Time",
    },
    {
      headerName: "Initiation Time",
    },
    {
      headerName: "Status",
    },
    {
      headerName: "Remarks",
    },
  ];

  useEffect(() => {
    fetchReportsGenrationData();
  }, [offset]);

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setOffset(selectedPage + 1);
  };

  const fetchReportsGenrationData = () => {
    const username = localStorage.getItem("username");

    getReportDownloadHistory(username, offset, recordsPerPage, reportName).then(
      (response) => {
        if (response.status == "success") {
          console.log("data", response.data);

          let allData =  []
          
          if(response.data.data[0]){
             allData = response.data.data.map((reportData) => {
              let thisReport = {
                reportName: reportData.reportName,
                reportId: reportData.reportId,
                reportType: reportData.reportType,
                fileType: reportData.fileType,
                generationStartTime: reportData.reportGenerationStartTime,
                generationEndTime: reportData.reportGenerationEndTime,
                queuedTime: reportData.queuedTime,
                status: reportData.status,
                remarks: reportData.remarks,
                reportUrl: reportData.fileURL,
              };
              return thisReport;
            });
          }
         

          setReportHistoryData(allData);
          if (response.data?.metaData) {
            setPageCount(response.data.metaData.totalPages);
          }
        }
      }
    );
  };

  return (
    <>
      <div className="Reportmainbody">
        {/* <div className="breadCrum">
          <Link id="report-history-home" to="/Admindashboard">
            <img id="report-history-home-img" src={Home} alt="" />
          </Link>
          <h6 className="primaryColor">{">>"}</h6>
          <Link
            id="report-history-report-builder"
            className="Linkdeco"
            to="/Reports"
          >
            <h6>
              {localStorage.getItem("appName")}
              Reports History
            </h6>
          </Link>
          <h6>{">>"}</h6>
          <h6 className="Linkdeco">
            {localStorage.getItem("appName")}
            App Report 1
          </h6>
        </div> */}
        <div className="d-flex flex-row align-items-center justify-content-end">
          <div className="">
            <div
              className="Linkdeco me-4"
              onClick={() => fetchReportsGenrationData()}
            >
              <span className="Regenerate" data-tip data-for="regenerate">
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
        </div>

        <div className="">
          {/* <div className="container-fluid mt-5">
            <h5> Reports History</h5>
          </div> */}

          <div>
            <ReportHistoryTable
              TableData={reportHistoryData}
              TableHeaders={ColumnHeaders}
              TableCurrentPage={tableCurrentPage}
              setTableCurrentPage={setTableCurrentPage}
            />

            <div className="d-flex justify-content-end me-2">
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
      </div>
    </>
  );
};
export default ReportHistory;
