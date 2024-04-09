import { Link, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import axios from "axios";
import {
  Home,
  RBdropdownIcon,
  YourLogo,
  ReportBuilderCopyIcon,
  ReportBuilderLoadIcon,
  RegenerateIcon,
} from "../../assets";


import { Col, Dropdown, Row } from "react-bootstrap";
import { useState, useEffect } from "react";

import { async } from "q";

const ReportBuilderViewTable = ({}) => {
  const [downloadReport, setDownloadReport] = useState([]);
  // useEffect(() => {
  //   DownloadRB();
  // }, []);

  const DownloadRB = async () => {
    // console.log("download", downloadReport);
    var axios = require("axios");
    var data = "";

    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_REPORTBUILDER_ENDPOINT}reportBuilder/getReport?page=1&size=10`,
      headers: {
        workSpaceName: "Intelliflow",
        reportName: "Testreport(13)",
        exportDataTo: "data",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        setDownloadReport();
        // console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <>
      <div className="simpleside">
        <div></div>
      </div>
      <div className="ReportBuilderView-mains">
        <div>
          <div className="reportsinline">
            <div>
              <span id="report-table-app-report " className="AppReports secondaryColor">App Report 1</span>
            </div>
            <div>
              {" "}
              <Dropdown>
                <Dropdown.Toggle
                  tag="a"
                  color="light"
                  className="generatedreport"
                  id="report-table-download"
                >
                  Download
                  <img id="report-table-download-img" src={RBdropdownIcon} />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    id="report-table-data"
                    onClick={() => {
                      DownloadRB();
                    }}
                  >
                    Data
                  </Dropdown.Item>
                  <Dropdown.Item id="report-table-pdf" href="">Pdf</Dropdown.Item>
                  <Dropdown.Item  id="report-table-excel" href="">Excel</Dropdown.Item>
                  <Dropdown.Item  id="report-table-csv" href="">csv</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          <div className="RBLink">
            <div className="">
              <input
                id="report-table-name-input"
                className="ReportInput"
                type="Text"
                value=""
                name="name"
                onChange={() => ""}
              />
            </div>

            <div>
              <span className="InputCopy secondaryColor">
                <img id="report-table-copy-img" src={ReportBuilderCopyIcon} />
              </span>
            </div>
            <div>
              <span className="Regenerate secondaryColor">
                {" "}
                <div>
                  <img  id="report-table-regenerate-icon" className="RGIco" src={RegenerateIcon} />
                </div>
                <div>
                  <h5 className="REgenerateh5" primaryColor> Regenerate</h5>
                </div>
              </span>
            </div>
            <div></div>
          </div>

          <div className="ReportBuilderViewOpacity">
            {/* <div>
              <img className="RBLoad" src={ReportBuilderLoadIcon} />
            </div> */}

            <div className="ReportHead">
              <Row>
                <div class="col-md-2 col-6">
                  <h2 className="Reportname primaryColor">Report Name</h2>
                </div>
                <div class="col-md-2 col-6">
                  <h2 className="Accessesby primaryColor">Accessed by</h2>
                </div>
                <div class="col-md-2 col-6">
                  <h2 className="createdby primaryColor">Created by</h2>
                </div>
                <div class="col-md-2 col-6">
                  <h2 className="createdon primaryColor">Created on</h2>
                </div>
                <div class="col-md-2 col-6">
                  <h2 className="Reportnameactins primaryColor">Actions</h2>
                </div>
              </Row>
            </div>
            <div className="ReportsListViewRecentActionRow customScrollBar">
              <div className="ReportData">
                {downloadReport.map((download) => {
                  return (
                    <Row>
                      <div class="col-md-2 col-6">
                        <h2 className="AppsReport primaryColor">{download.Stage}</h2>
                      </div>
                      <div class="col-md-2 col-6">
                        <h2 className="GroupName primaryColor"> Group Name</h2>
                      </div>
                      <div class="col-md-2 col-6">
                        <h2 className="johnsnow primaryColor">John Snow</h2>
                      </div>
                      <div class="col-md-2 col-6">
                        <h2 className="ReportDate primaryColor">02-02-2022,05:00 AM </h2>
                      </div>
                      <div class="col-md-2 col-6">
                        <h2 className="ReportDot primaryColor"> ...</h2>
                      </div>
                    </Row>
                  );
                })}
              </div>
              <div className="ReportData">
                <Row>
                  <div class="col-md-2 col-6">
                    <h2 className="AppsReport primaryColor">Apps Report</h2>
                  </div>
                  <div class="col-md-2 col-6">
                    <h2 className="GroupNam primaryColore"> Group Name</h2>
                  </div>
                  <div class="col-md-2 col-6">
                    <h2 className="johnsnow primaryColor">John Snow</h2>
                  </div>
                  <div class="col-md-2 col-6">
                    <h2 className="ReportDate primaryColor">02-02-2022,05:00 AM </h2>
                  </div>
                  <div class="col-md-2 col-6">
                    <h2 className="ReportDot primaryColor"> ...</h2>
                  </div>
                </Row>
              </div>
              <div className="ReportData">
                <Row>
                  <div class="col-md-2 col-6">
                    <h2 className="AppsReport primaryColor">Apps Report</h2>
                  </div>
                  <div class="col-md-2 col-6">
                    <h2 className="GroupName primaryColor"> Group Name</h2>
                  </div>
                  <div class="col-md-2 col-6">
                    <h2 className="johnsnow primaryColor">John Snow</h2>
                  </div>
                  <div class="col-md-2 col-6">
                    <h2 className="ReportDate primaryColor">02-02-2022,05:00 AM </h2>
                  </div>
                  <div class="col-md-2 col-6">
                    <h2 className="ReportDot primaryColor"> ...</h2>
                  </div>
                </Row>
              </div>
              <div className="ReportData">
                <Row>
                  <div class="col-md-2 col-6">
                    <h2 className="AppsReport primaryColor">Apps Report</h2>
                  </div>
                  <div class="col-md-2 col-6">
                    <h2 className="GroupName primaryColor"> Group Name</h2>
                  </div>
                  <div class="col-md-2 col-6">
                    <h2 className="johnsnow primaryColor">John Snow</h2>
                  </div>
                  <div class="col-md-2 col-6">
                    <h2 className="ReportDate primaryColor">02-02-2022,05:00 AM </h2>
                  </div>
                  <div class="col-md-2 col-6">
                    <h2 className="ReportDot primaryColor"> ...</h2>
                  </div>
                </Row>
              </div>
              <div className="ReportData">
                <Row>
                  <div class="col-md-2 col-6">
                    <h2 className="AppsReport primaryColor">Apps Report</h2>
                  </div>
                  <div class="col-md-2 col-6">
                    <h2 className="GroupName primaryColor"> Group Name</h2>
                  </div>
                  <div class="col-md-2 col-6">
                    <h2 className="johnsnow primaryColor">John Snow</h2>
                  </div>
                  <div class="col-md-2 col-6">
                    <h2 className="ReportDate primaryColor">02-02-2022,05:00 AM </h2>
                  </div>
                  <div class="col-md-2 col-6">
                    <h2 className="ReportDot primaryColor"> ...</h2>
                  </div>
                </Row>
              </div>
              <div className="ReportData">
                <Row>
                  <div class="col-md-2 col-6">
                    <h2 className="AppsReport primaryColor">Apps Report</h2>
                  </div>
                  <div class="col-md-2 col-6">
                    <h2 className="GroupName primaryColor"> Group Name</h2>
                  </div>
                  <div class="col-md-2 col-6">
                    <h2 className="johnsnow primaryColor">John Snow</h2>
                  </div>
                  <div class="col-md-2 col-6">
                    <h2 className="ReportDate primaryColor">02-02-2022,05:00 AM </h2>
                  </div>
                  <div class="col-md-2 col-6">
                    <h2 className="ReportDot primaryColor"> ...</h2>
                  </div>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportBuilderViewTable;
