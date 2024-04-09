import React, { useState } from "react";

import DownloadIcon from "./../../assets/reportBuilderIcons/DownloadIcon.svg";
import CopyIcon from "./../../assets/reportBuilderIcons/CopyIcon.svg";
import PrevArrow from "../../assets/datagridIcons/PrevArrow";
import NextArrow from "../../assets/datagridIcons/NextArrow";
import ReactTooltip from "react-tooltip";
import { toast } from 'react-toastify'
import axios from "axios";

const ReportHistoryTable = ({
  TableData,
  TableHeaders,
  TableCurrentPage,
  setTableCurrentPage,
}) => {


  const [copyDialog, setCopyDialog] = useState("Copy Report Url")
   
    async function copyTextToClipboard(text) {
      if ('clipboard' in navigator) {
        return await navigator.clipboard.writeText(text);
      } else {
        return document.execCommand('copy', true, text);
      }
    }

    const downloadTheFile = (fileUrl, fileExtension, fileName) => {
      var axios = require("axios");
  
      let fileExt =  fileExtension == "excel" ? "xlsx" : fileExtension; 
  
      var config = {
        method: "get",
        headers: {},
      };
  
      let fetchRes = fetch(
        fileUrl,
        config
      );
  
      fetchRes
        .then((response) => {
          // console.log(JSON.stringify(response.data));
          
          response.blob().then((blob) => {
            console.log(blob);
            const fileURL = window.URL.createObjectURL(blob);
            let alink = document.createElement("a");
            alink.href = fileURL;
            alink.download = `${fileName}.${fileExt}`;
            alink.click();
          })
  
        })
        .catch(function (error) {
          console.log(error);
        });
    };
  

    // const downloadTheFile = (fileUrl, fileExtension, fileName) => {
    //   const fileExt = fileExtension === "excel" ? "xlsx" : fileExtension;
    //   const config = {
    //     method: "get",
    //     headers: {},
    //     responseType: "stream",
    //   };
    
    //   axios(fileUrl, config)
    //     .then((response) => {
    //       const blob = new Blob([], { type: response.headers["content-type"] });
    //       const fileURL = window.URL.createObjectURL(blob);
    //       const a = document.createElement("a");
    //       a.style.display = "none";
    //       a.href = fileURL;
    //       a.download = `${fileName}.${fileExt}`;
    //       document.body.appendChild(a);
    
    //       const chunks = [];
    
    //       response.data.on("data", (chunk) => {
    //         chunks.push(chunk);
    //       });
    
    //       response.data.on("end", () => {
    //         const blob = new Blob(chunks, { type: response.headers["content-type"] });
    //         const fileURL = window.URL.createObjectURL(blob);
    //         a.href = fileURL;
    //         a.style.display = "";
    //       });
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // };
    

    // onClick handler function for the copy button
    const handleCopyClick = (reportUrl) => {
      // Asynchronously call copyTextToClipboard
      copyTextToClipboard(reportUrl)
        .then(() => {
          toast.success(`Report URL copied !`, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }

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
              <th>{TableHeaders[0].headerName}</th>
              {/* <th>{TableHeaders[1].headerName}</th> */}
              {/* <th>{TableHeaders[2].headerName}</th> */}
              <th>{TableHeaders[3].headerName}</th>
              <th>{TableHeaders[4].headerName}</th>
              <th>{TableHeaders[5].headerName}</th>
              <th>{TableHeaders[6].headerName}</th>
              <th>{TableHeaders[7].headerName}</th>
              <th>{TableHeaders[8].headerName}</th>

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
              .map((data) => {
                return (
                  <tr
                    style={
                      data.status == "delete"
                        ? { backgroundColor: "#E5E5E5" }
                        : {}
                    }
                  >
                    <td>{data.reportName}</td>
                    {/* <td>{data.reportId}</td> */}
                    {/* <td>{data.reportType}</td> */}
                    <td>{data.fileType}</td>
                    <td>{data.generationStartTime}</td>
                    <td>{data.generationEndTime}</td>
                    <td>{data.queuedTime}</td>
                    <td>{data.status}</td>
                    <td>{data.remarks}</td>

                    <td className="" style={{ padding: "0px" }}>
                      {data.status == "Completed" && (
                        <div
                        className=""
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          border: "1px solid #C4C4C4",
                          borderRadius: "4px",
                          height: "30px",
                        }}
                      >
                        <div
                          className="ms-3"
                          data-tip
                          data-for="reportdownload"
                          onClick={() => downloadTheFile(data.reportUrl, data.fileType, data.reportName)}
                        >
                          <img src={DownloadIcon} />
                        </div>
                        <ReactTooltip
                          id="reportdownload"
                          place="bottom"
                          // className="tooltipCustom"
                          arrowColor="rgba(0, 0, 0, 0)"
                          effect="solid"
                        >
                          Download
                        </ReactTooltip>
                        <div className="me-3" data-tip data-for="copyurl" onClick={() => handleCopyClick(data.reportUrl)}>
                          <img src={CopyIcon} />
                        </div>
                        <ReactTooltip
                          id="copyurl"
                          place="bottom"
                          // className="tooltipCustom"
                          arrowColor="rgba(0, 0, 0, 0)"
                          effect="solid"
                        >
                          Copy Report Url
                        </ReactTooltip>
                      </div>
                      )}
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
              if(TableData.length < 10){

              }
              else{
                setTableCurrentPage(TableCurrentPage + 1)}
              }
            }
          >
            {" "}
            <NextArrow fillColor={false ? "#0D3C84" : "#C4CDD5"} />
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default ReportHistoryTable;
