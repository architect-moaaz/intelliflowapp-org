import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";

import "./PreviewPopUp.css";
import moment from "moment";
import PrevArrow from "../../assets/datagridIcons/PrevArrow";
import NextArrow from "../../assets/datagridIcons/NextArrow";
import ReactTooltip from "react-tooltip";
import { useRecoilState } from "recoil";
import { loggedInUserState } from "../../state/atom";

const PreviewPopUp = ({
  TableData,
  TableHeaders,
  TableCurrentPage,
  setTableCurrentPage,
  softDeleteReport,
  searchKeyword,
  TableBody,
}) => {
  console.log("previewheaders", TableHeaders);
  console.log("jsonData", TableBody);
  const [tableDataLocal, setTableDataLocal] = useState(TableData);
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);

  useEffect(() => {}, [searchKeyword]);

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
                return <th>{header}</th>;
              })}
            </tr>
            {TableBody?.slice(1)?.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((value, colIndex) => (
                  <td key={colIndex}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PreviewPopUp;
