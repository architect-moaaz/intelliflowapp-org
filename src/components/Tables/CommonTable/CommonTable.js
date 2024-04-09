import React, { useState } from "react";
import "./CommonTable.css";
import SortIconDown from "../../../assets/datagridIcons/SortIconDown";
import SortIconUp from "../../../assets/datagridIcons/SortIconUp";
import NextArrow from "../../../assets/datagridIcons/NextArrow";
import PrevArrow from "../../../assets/datagridIcons/PrevArrow";
import CommonTablePagination from "./CommonTablePagination";
import Pagination from "./CommonTablePagination";

const CommonTable = ({
  TableData,
  TableHeaders,
  TableCurrentPage,
  setTableCurrentPage,
}) => {
  const [state, setstate] = React.useState({
    totalPages: 10,
    currentPage: 1,
  });

  const { totalPages, currentPage } = state;

  const handlePagination = (current) => {
    setstate({ ...state, currentPage: current });
  };

  return (
    <div>
      <div className="table-body-wrapper">
        <table className="common-table customScrollBar">
          <tbody>
            <tr className="table-head">
              {TableHeaders.map((header) => {
                return (
                  <th>
                    <div className="header-container">
                      <div>{header.headerName}</div>

                      {/* <div className="d-flex">
                        <div style={{ marginLeft: "2px" }}>
                          <SortIconDown fillColor={"#C4C4C4"} />
                        </div>
                        <div style={{ marginLeft: "2px" }}>
                          <SortIconUp fillColor={"#C4C4C4"} />
                        </div>
                      </div> */}
                    </div>
                  </th>
                );
              })}
            </tr>

            {TableData.map((data) => {
              return (
                <tr>
                  {Object.entries(data).map((value, index) => {
                    // console.log("val", value)
                    return <td key={index}>{ typeof(value[1]) == "string" || typeof(value[1]) == "number"  ? String(value[1]) : ""}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* <div className="pagination-wrapper">
        <div className="simple-table-pagination">
        
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div
               id="commonTable-page-item-decrease"
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
            id="commonTable-page-item-increase"
              className="page-item"
              onClick={() => {
             
              if(TableData.length < 10){

              }
              else{
                setTableCurrentPage(TableCurrentPage + 1)
              }
              }}
            >
              {" "}
              <NextArrow fillColor={false ? "#0D3C84" : "#C4CDD5"} />
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default CommonTable;
