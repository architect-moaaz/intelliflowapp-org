import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import "./ReportBuilderTable.css";
import PrevArrow from "../../../assets/datagridIcons/PrevArrow";
import NextArrow from "../../../assets/datagridIcons/NextArrow";
import ReactTooltip from "react-tooltip";
import { useRecoilState } from "recoil";
import { loggedInUserState } from "../../../state/atom";

const ReportBuilderTable = ({
  TableData,
  TableHeaders,
  TableCurrentPage,
  setTableCurrentPage,
  softDeleteReport,
  searchKeyword,
}) => {
  //   console.log("TableData", TableData);
  //   console.log("TableHeaders", TableHeaders);
  console.log("searchkeyword", searchKeyword);

  const [tableDataLocal, setTableDataLocal] = useState(TableData);
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);

  useEffect(() => {
    // searchReport()
  }, [searchKeyword]);

  const searchReport = () => {
    let tableDataTemp = TableData;

    let searchedResults = [];

    for (var i = 0; i < tableDataTemp.length; i++) {
      for (let key in tableDataTemp[i]) {
        if (tableDataTemp[i][key].includes(searchKeyword)) {
          searchedResults.push(tableDataTemp[i]);
        }
      }
    }

    setTableDataLocal(searchedResults);
  };

  const history = useHistory();

  const editReport = (reportName) => {
    localStorage.setItem("currentreport", reportName);
    history.push("/report/create");
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
            {TableData
              // .filter((row, index) => {
              //   console.log("intofilter");
              //   if (searchKeyword == "") {
              //     return row;
              //   } else {
              //     for (const key in row) {
              //       if (row[key].indexOf(searchKeyword) != -1) {
              //         // results.push(objects[i]);
              //         return row;
              //       }
              //     }
              //   }
              // })
              .map((data,index) => {
                console.log("dataaa", data);
                if (data.status != "DELETED") {
                  return (
                    <tr className="BodyColor"
                    // style={
                    //   data.status == "delete"
                    //     ? { backgroundColor: "#E5E5E5" }
                    //     : {}
                    // }
                    >
                      {/* {Object.entries(data).slice(0,Object.entries(data).length-1).map((value) => {
                    // console.log("val", value)
                    return <td>{value[1]}</td>;
                  })} */}

                      <td className="secondaryColor">{data.reportName}</td>

                      <td className="secondaryColor">
                        {
                          data.accessibleBy.length > 1 ? (
                            <span className="secondaryColor">
                          
                            {data.accessibleBy[0]}  + <span data-tip data-for={String(index)}>{data.accessibleBy.length-1}</span>
                            </span>
                          ) : (
                            <span className="secondaryColor">
                              {data.accessibleBy[0]}
                            </span>
                          )
                        }
                        {/* {data.accessibleBy[0]}  + {data.accessibleBy.length} */}
                        {/* <ReactTooltip
                        id={String(index)}
                        place="bottom"
                        className="tooltipCustom"
                        arrowColor="rgba(0, 0, 0, 0)"
                        effect="float"
                      >
                        <div style={{ fontSize: "12px" }}>
                          
                          {data.accessibleBy.map(user => {
                            return(
                              <span>{user}<br/></span>
                            )
                          })}
                        </div>
                      </ReactTooltip> */}
                      </td>
                      
                      <td className="secondaryColor">{data.createdBy}</td>

                      <td className="secondaryColor">{data.createdOn}</td>

                      <td className="secondaryColor">{data.status}</td>

                      <td className="secondaryColor">
                        <Dropdown>
                          <Dropdown.Toggle
                            variant=""
                            className="p-0 table-dropdown-toggle-btn actions-cell secondaryColor"
                            id="dropdown-basic"
                          >
                            <b>...</b>
                          </Dropdown.Toggle>
                          {data.status == "DELETED" ? (
                            <Dropdown.Menu className="BodyColor">
                              <Dropdown.Item className="BodyColor"
                                onClick={() => {
                                  // editReport(data.reportName);
                                  // localStorage.setItem("currentReportStatus",data.status)
                                }}
                              >
                                <span className="secondaryColor"
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "400",
                                  }}
                                >
                                  Restore
                                </span>
                              </Dropdown.Item>

                              {/* <Dropdown.Item href="">Copy Link</Dropdown.Item> */}
                            </Dropdown.Menu>
                          ) : (
                            <Dropdown.Menu className="BodyColor">
                              <Dropdown.Item
                                onClick={() => {
                                  editReport(data.reportName);
                                  localStorage.setItem(
                                    "currentReportStatus",
                                    data.status
                                  );
                                  localStorage.setItem(
                                    "currentreportappname",
                                    data.appName
                                  );
                                }}
                              >
                                <span className="secondaryColor"
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "400",
                                  }}
                                >
                                  Edit
                                </span>
                              </Dropdown.Item>

                              <hr className="my-1" />
                              <Dropdown.Item
                                onClick={() =>
                                  softDeleteReport(data.reportName)
                                }
                              >
                                <span className="secondaryColor"
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "400",
                                    color: "#FC5353",
                                  }}
                                >
                                  Delete
                                </span>
                              </Dropdown.Item>
                              {/* <Dropdown.Item href="">Copy Link</Dropdown.Item> */}
                            </Dropdown.Menu>
                          )}
                        </Dropdown>
                      </td>
                    </tr>
                  );
                }
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

export default ReportBuilderTable;
