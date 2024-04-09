import React from "react";
import "./ReportBuilderTable.css";

const ReportBuilderTable = ({ TableData, TableHeaders }) => {
  return (
    <table className="simple-table" id="simple-table">
      <thead>
        <tr>
          {TableHeaders.map((header) => {
            return <th>{header.headerName}</th>;
          })}
          {/* <th>Actions</th> */}
        </tr>
      </thead>

      <tbody>
        {TableData.map((data) => {
          return (
            <tr>
              {Object.entries(data).map((value) => {
                return <td>{value[1]}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ReportBuilderTable;
