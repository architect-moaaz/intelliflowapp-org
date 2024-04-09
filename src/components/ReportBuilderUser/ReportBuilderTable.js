import React from "react";
import { Dropdown } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import "../../components/ReportBuilder/ReportBuilderTable/ReportBuilderTable.css";
import PrevArrow from "../../assets/datagridIcons/PrevArrow";
import NextArrow from "../../assets/datagridIcons/NextArrow";

const ReportBuilderTable = ({
  TableData,
  TableHeaders,
  TableCurrentPage,
  setTableCurrentPage,
}) => {
  const history = useHistory();

  const editReport = (reportName) => {
    localStorage.setItem("currentreport", reportName);
    history.push("/report/create");
  };

  return (
    <div style={{ paddingLeft:"5px", paddingRight:"5px", display:'flex', height:'auto', flexDirection:'column', justifyContent:'space-between' }}>
      <div>
        <table className="simple-table">
          <tbody>
            <tr className="simple-table-header">
              {TableHeaders.map((header) => {
                return <th>{header.headerName}</th>;
              })}
              <th>Actions</th>
            </tr>
            {TableData.map((data) => {
              return (
                <tr className="BodyColor">
                  {Object.entries(data).map((value) => {
                    // console.log("val", value)
                    return <td className="secondaryColor">{value[1]}</td>;
                  })}
                  <td className="secondaryColor">
                    <Dropdown>
                      <Dropdown.Toggle
                        variant=""
                        className="p-0 table-dropdown-toggle-btn secondaryColor"
                        id="dropdown-basic"
                      >
                        <b>...</b>
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="BodyColor">
                        <Dropdown.Item className="secondaryColor"
                          id="report-builder-table-view"
                          href="#/ReportBuilderView"
                          onClick={() =>
                            localStorage.setItem(
                              "reportToBeViewed",
                              data.reportName
                            )
                          }
                        >
                          View
                        </Dropdown.Item>
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
        <div style={{ display: "flex", flexDirection: "row", backgroundColor:'rgba(229, 229, 229, 0.5)', borderRadius:'5px' }} className="p-2">
          <div 
            id="report-builder-table-prev-arrow"
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
          <div className="page-item" id="report-builder-table-curren-page">
            {TableCurrentPage}
          </div>
          <div
            id="report-builder-table-next-arrow"
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
