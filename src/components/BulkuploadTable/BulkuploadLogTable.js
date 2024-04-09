import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import "./BulkuploadTable.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import PrevArrow from "../../assets/datagridIcons/PrevArrow";
import NextArrow from "../../assets/datagridIcons/NextArrow";
import ReactTooltip from "react-tooltip";
import { useRecoilState } from "recoil";
import { loggedInUserState } from "../../state/atom";

const BulkuploadLogTable = ({
  TableData,
  TableHeaders,
  uploadLogs,
  TableCurrentPage,
  setTableCurrentPage,
  softDeleteReport,
  searchKeyword,
}) => {
  console.log("TableData", TableData);
  //   console.log("TableHeaders", TableHeaders);

  const [tableDataLocal, setTableDataLocal] = useState(TableData);
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);

  useEffect(() => {
    // searchReport()
  }, [searchKeyword]);

  //   const searchReport = () => {
  //     let tableDataTemp = TableData;

  //     let searchedResults = [];

  //     for (var i = 0; i < tableDataTemp.length; i++) {
  //       for (let key in tableDataTemp[i]) {
  //         if (tableDataTemp[i][key].includes(searchKeyword)) {
  //           searchedResults.push(tableDataTemp[i]);
  //         }
  //       }
  //     }

  //     setTableDataLocal(searchedResults);
  //   };

  const history = useHistory();

  const editReport = (reportName) => {
    localStorage.setItem("currentreport", reportName);
    history.push("/report/create");
  };

  const DownloadIndividualTemplate = (downloaddata) => {
    console.log("downloaddata", downloaddata);
    let data = {
      miniAppName: downloaddata.Apps,
      dataModelName: downloaddata.fileName,
    };

    console.log("data-download", data);
    let config = {
      method: "post",
      url: `${process.env.REACT_APP_BULKUPLOAD}upload-file/getExcelTemplate`,
      data: data,
      responseType: "blob",
    };
    console.log("config", config);

    axios
      .request(config)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${downloaddata.fileName}.xlsx`);
        document.body.appendChild(link);
        link.click();

        toast.success(`Template downloaded successfully`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error(`Template download failed`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
  };
  const ErrorIndividualUpload = (downloaddata) => {
    console.log("downloaddata", downloaddata);
    let data = {
      uploadId: downloaddata.uploadId,
      miniAppName: downloaddata.Apps,
      dataModelName: downloaddata.fileName,
    };

    let config = {
      method: "post",
      url: `${process.env.REACT_APP_BULKUPLOAD}upload-file/errorLogFile`,
      data: data,
      responseType: "blob",
    };

    axios
      .request(config)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${downloaddata.fileName}.xlsx`);
        document.body.appendChild(link);
        link.click();

        toast.success(`Error file downloaded successfully`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error(`Error file download failed`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
  };

  return (
    <div
      style={{
        paddingLeft: "5px",
        paddingRight: "5px",
        height: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <table className="simple-table">
          <tbody>
            <tr className="simple-table-header">
              {TableHeaders.map((header) => {
                return <th>{header.headerName}</th>;
              })}
              <th>Actions</th>
            </tr>
            {TableData.filter((e) =>
              e.fileName?.toLowerCase()?.includes(searchKeyword.toLowerCase())
            ).map((data, index) => {
              return (
                <tr className="BodyColor" key={index}>
                  <td className="secondaryColor">{data.fileName}</td>

                  <td className="secondaryColor">{data.Apps}</td>

                  <td className="secondaryColor">{data.AddedBy}</td>

                  <td className="secondaryColor">
                    {new Date(data?.createdOn.split("[")[0]).toLocaleString()}
                  </td>

                  {/* <td className="secondaryColor">{data.status}</td> */}
                  <td
                    className={
                      data.status === "SUCCESS"
                        ? "successColor"
                        : data.status === "FAILED"
                        ? "failedColor"
                        : ""
                    }
                  >
                    {data.status}
                  </td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant=""
                        className="p-0 table-dropdown-toggle-btn actions-cell"
                        id="dropdown-basic"
                      >
                        <b className="secondaryColor">...</b>
                      </Dropdown.Toggle>

                      <Dropdown.Menu className="BodyColor">
                        <Dropdown.Item
                          onClick={() => {
                            DownloadIndividualTemplate(data);
                          }}
                          className="BodyColor"
                        >
                          <span
                            className="secondaryColor"
                            style={{
                              fontSize: "12px",
                              fontWeight: "400",
                            }}
                          >
                            Download
                          </span>
                        </Dropdown.Item>
                        <hr
                          style={{
                            borderBottom: "1px solid #888",
                            height: "1px",
                          }}
                        ></hr>
                        {data.status == "FAILED" && (
                          <Dropdown.Item
                            onClick={() => {
                              ErrorIndividualUpload(data);
                            }}
                            className="BodyColor"
                          >
                            <span
                              className="secondaryColor"
                              style={{
                                fontSize: "12px",
                                fontWeight: "400",
                              }}
                            >
                              Check Error
                            </span>
                          </Dropdown.Item>
                        )}

                        {/* <hr className="my-1" />
                        <Dropdown.Item onClick={() => Deletebulkupload()}>
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: "400",
                              color: "#FC5353",
                            }}
                          >
                            Delete
                          </span>
                        </Dropdown.Item> */}
                        {/* <Dropdown.Item href="">Copy Link</Dropdown.Item> */}
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* <div className=" mt-3  d-flex flex-row justify-content-end">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            backgroundColor: "rgba(229, 229, 229, 0.5)",
            borderRadius: "5px",
          }}
          className="p-2"
        >
          <div
            id="reportBuilderTable-item"
            className="page-item"
            onClick={() => {
              if (TableCurrentPage > 1) {
                setTableCurrentPage(TableCurrentPage - 1);
              }
            }}
          >
            {" "}
            <PrevArrow fillColor={false ? "#0D3C84" : "#C4CDD5"} />
          </div>
          <div className="page-item">{TableCurrentPage}</div>
          <div
            id="reportBuilderTable-current-page-item"
            className="page-item"
            onClick={() => {
              if (TableData.length < 10) {
              } else {
                setTableCurrentPage(TableCurrentPage + 1);
              }
            }}
          >
            {" "}
            <NextArrow fillColor={false ? "#0D3C84" : "#C4CDD5"} />
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default BulkuploadLogTable;
