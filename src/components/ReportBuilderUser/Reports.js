import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import "./AdminDashboard.css";
import ReactTooltip from "react-tooltip";
import ReportBuilderTable from "../../components/ReportBuilderUser/ReportBuilderTable";

import { Home, YourLogo } from "../../assets";
import { async } from "q";
import axios from "axios";
import ReactPaginate from "react-paginate";
import CommonPagination from "../Pagination/CommonPagination";

const Reports = () => {
  const [allReports, setAllReports] = useState([]);
  const [tableCurrentPage, setTableCurrentPage] = useState(1);

  //variables for pagination
  const [offset, setOffset] = useState(1);
  const [data, setData] = useState([]);
  const [perPage] = useState(10);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    Reporttoken();
  }, []);

  useEffect(() => {
    getallReports();
  }, [offset]);
  const ColumnHeaders = [
    {
      headerName: "ReportName",
    },
    {
      headerName: "Created by",
    },
    {
      headerName: "Created on",
    },
  ];

  const Reporttoken = () => {
    var axios = require("axios");
    var data = JSON.stringify({
      refresh_token: localStorage.getItem("refresh_token"),
    });
    var config = {
      method: "post",
      url: process.env.REACT_APP_IDENTITY_ENDPOINT + "IDENTITY/Login/refresh",
      headers: {
        acess_token: localStorage.getItem("token"),
        workspace: process.env.REACT_APP_WORKSPACE,
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      data: data,
    };
    axios(config)
      .then(function (response) {
        // console.log("sucess",response.data.status);
        if (response.data.status == "Success") {
          // console.log("refreshtoken1", response.data.access_info.refresh_token);
          localStorage.setItem(
            "refresh_token",
            response.data.access_info.refresh_token
          );
          localStorage.setItem("token", response.data.access_info.access_token);
          // console.log("accesstoken", response.data.access_info.access_token);
        } else if (response.data.status == "Failure") {
          // console.log("failure");
        }
      })
      .catch(function (error) {
        // console.log("ReportTokenerror", error);
      });
  };

  const getallReports = async () => {
    var axios = require("axios");
    var data = "";

    var config = {
      method: "post",
      url: `${process.env.REACT_APP_REPORTBUILDER_ENDPOINT}reportBuilder/listAllReports?page=${offset}&size=10`,
      headers: {
        workspaceName: localStorage.getItem("workspace"),
        Authorization: "Bearer " + localStorage.getItem("token"),
        user: localStorage.getItem("username"),
        role: "user",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        let reportData = response.data.data;
        let datatobesend = reportData.map((data) => {
          let currentData = {
            reportName: data.reportName,
            // lastAccessesOn: data.lastAccessesOn,
            createdBy: data.createdBy,
            createdOn: data.createdOn,
          };
          return currentData;
        });
        setAllReports(datatobesend);
        // console.log(JSON.stringify(response.data));
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

  return (
    <>
      <div className="RBbreadcrum">
        <Link id="report-home" to="/UserReports">
          <img id="report-home-img" src={Home} alt="" />
        </Link>
        <h6 className="primaryColor">{">>"}</h6>
        <Link id="report-home-report-viewer" className="Linkdeco" to="#">
          <h6 className="primaryColor">
            {/* {localStorage.getItem("appName")} */}
            Report Viewer
          </h6>
        </Link>
      </div>
      <div className="Reportmainbody">
        <div className="MainReportBuilder">
          <div className="container-fluid">
            <div className="reportsinline">
              <div>
                <span className="Reports secondaryColor">Reports</span>
              </div>
              <div>
                {" "}
              
                {/* <div className="Linkdeco">
                  <Link className="Linkdeco" to="/ReportHistory">
                    {" "}
                    <button className="downloadreport svg-stroke-comingSoonIcon secondaryButtonColor">
                      Reports History
                    </button>
                  </Link>
             
                </div> */}
              </div>
            </div>

            <div>
              <ReportBuilderTable
                TableData={allReports}
                TableHeaders={ColumnHeaders}
                TableCurrentPage={tableCurrentPage}
                setTableCurrentPage={setTableCurrentPage}
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
        </div>
      </div>
      {/* <div className="mt-3 ReportBuilderYourLogoHere">
        <img src={YourLogo} className="RPYourLogoHere" alt="Your Logo" />
      </div> */}
    </>
  );
};
export default Reports;
