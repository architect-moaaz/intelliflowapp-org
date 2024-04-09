import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import { Home } from "../../assets";
import { ToastContainer, toast } from "react-toastify";
import { Breadcrumb, Tab, Nav, OverlayTrigger, Tooltip } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import CommonModelContainer from "../CommonModel/CommonModelContainer";
import { FileUploader } from "react-drag-drop-files";
import { DeleteIco } from "../../assets";
import SearchIcon from "./../../assets/reportBuilderIcons/SearchIcon.svg";
import ReportBuilderTable from "../../components/ReportBuilder/ReportBuilderTable/ReportBuilderTable";
import "./BulkUpload.css";
import { getAllResources } from "../../services/fileExploreCom.action";
import { getAppAndDatamodels } from "../../modules/ReportBuilder/apis/ReportBuilderAPIs";
import BulkuploadTable from "../BulkuploadTable/BulkuploadTable";
import fileDownload from "js-file-download";
import BulkuploadLogTable from "../BulkuploadTable/BulkuploadLogTable";
import PreviewPopUp from "./PreviewPopUp";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import CustomSelect from "../CustomSelect/CustomSelect";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const BulkUpload = ({ setheaderTitle }) => {
  setheaderTitle("Bulk Upload");

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleFileUpload = (event) => {
    console.log("event", event);
    setSelectedExcel(event.target.files[0]);
    setJsonData([]);
    convertToJSON(event.target.files[0]);
  };

  const hiddenFileInput = React.useRef(null);

  const [showAllApp, setShowAllApp] = useState([]);
  const [selectedApp, setSelectedApp] = useState("");
  const [name, setName] = useState("");
  const [uploadedExcelFile, setUploadedExcelFile] = useState(null);
  const [showAllDataModel, setShowAllDataModel] = useState([]);
  const [selectedDataModel, setSelectedDataModel] = useState("");
  const [allAppWithDataModal, setAllAppWithDataModal] = useState({});
  const [showTemplateSection, setShowTemplateSection] = useState(true);
  const [showUploadSection, setShowUploadSection] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [appList, setAppList] = useState([]);
  const [appListDatamodelName, setAppListDatamodelName] = useState([]);

  const [showBulkPreviewModel, setShowBulkPreviewModel] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExcel, setSelectedExcel] = useState(null);
  const [fileUpload, setFileUpload] = useState(null);
  const [byteArrayResult, setByteArrayResult] = useState([]);
  const [allAppsAndModelsList, setAllAppsAndModelsList] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [tableCurrentPage, setTableCurrentPage] = useState(1);
  const [t, i18n] = useTranslation("common");
  const [errorMessage, setErrorMessage] = useState(null);
  // const handleFileUpload = (files) => {
  //   console.log("currentuploadedfile", files);
  //   setFileUpload(files);
  //   convertToByte(files);
  // };
  const ReportDataHeaders = [
    {
      headerName: "File Name",
    },
    {
      headerName: "Apps/Module",
    },
    {
      headerName: "Added by",
    },
    {
      headerName: "Created on",
    },
    {
      headerName: "Status",
    },
  ];

  const [bulkData, setBulkData] = useState([]);
  const [bulkUploadLog, setBulUploadkLog] = useState([]);
  const [bulkUploadPreview, setBulkUploadPreview] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [jsonData, setJsonData] = useState([]);
  const [BulkUploadPreviewHeaders, setBulkUploadPreviewHeaders] = useState([]);
  const BulkUploadDataHeaders = [
    {
      headerName: "File Name",
    },
    {
      headerName: "Apps/Module",
    },
    {
      headerName: "Added By",
    },
    {
      headerName: "Created on",
    },
    {
      headerName: "Status",
    },
  ];
  useEffect(() => {
    DownloadLogs();
    uploadLogs();
  }, []);
  var uploadedExcelSize = selectedExcel?.size;
  const sizes = ["bytes", "Kb", "Mb", "GiB"];
  function getExcelFileSize(size) {
    let l = 0,
      n = parseInt(size, 10) || 0;
    while (n >= 1024 && ++l) {
      n = n / 1024;
    }
    return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + sizes[l];
  }

  const convertToJSON = (file) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const data = event.target.result;
      try {
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        console.log("json", json[0]);
        setJsonData(json);
        setBulkUploadPreview(json[0]);
        setBulkUploadPreviewHeaders(json[0]);
        setErrorMessage(null); // Clear any previous error messages
      } catch (error) {
        setErrorMessage(
          "Invalid or damaged file. Please upload a valid Excel file."
        );
        setJsonData([]);
      }
    };

    fileReader.readAsBinaryString(file);
  };

  const onBulkUpload = () => {
    setShowBulkPreviewModel(!showBulkPreviewModel);
  };

  const OnPreviewModalShow = () => {
    setShowPreviewModal(!showPreviewModal);
    console.log("first");
    // if (showPreviewModal) {
    Previewapi();
    // }
  };
  const excelSize = getExcelFileSize(uploadedExcelSize);

  const Bulkupload = async () => {
    const excelbase64 = await convertBase64(selectedExcel);
    var spliteddata = excelbase64.split(",");

    let data = {
      miniAppName: selectedApp,
      dataModelName: selectedDataModel,
      excelContent: spliteddata[1],
    };

    let postFormData = new FormData();

    postFormData.append("file", selectedExcel);
    postFormData.append("miniAppName", selectedApp);

    let config = {
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      url: process.env.REACT_APP_BULKUPLOAD + "upload-file/uploadData",
      data: postFormData,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response);
        toast.success("File uploaded Successfully", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        OnPreviewModalShow();
        uploadLogs();
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        toast.error("File upload Failed", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.log(error);
      });
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };
  const convertToByte = (data) => {
    var fileByteArray = [];
    const reader = new FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = (evt) => {
      if (evt.target.readyState === FileReader.DONE) {
        const arrayBuffer = evt.target.result,
          array = new Uint8Array(arrayBuffer);
        for (const a of array) {
          fileByteArray.push(a);
        }
        setByteArrayResult([
          ...byteArrayResult,
          { [data.name]: fileByteArray },
        ]);
      }
    };
  };
  const removeFile = (filess) => () => {
    const newFiles = [...byteArrayResult];
    newFiles.splice(newFiles.indexOf(filess), 1);
    setByteArrayResult(newFiles);
  };

  const APPINFO = async () => {
    var config = {
      method: "get",
      url:
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
        "modellerService/" +
        localStorage.getItem("workspace") +
        "/data?size=2000",
      headers: {},
    };
    axios(config)
      .then(async (response) => {
        var appData = [];
        response.data.data.data.apps.map((element) => {
          appData.push({
            name: element.appName,
            workspaceName: element.workspaceName,
          });
        });
        setAppList(appData);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const loadApps = () => {
    // console.log("Callig API");
    // if (appList.length == 0) {
    try {
      axios
        .get(
          process.env.REACT_APP_IFAPP_API_ENDPOINT +
            "app-center/" +
            localStorage.getItem("workspace") +
            "/apps",
          { headers: { devicesupport: "D" } }
        )
        .then((response) => {
          var appData = [];

          console.log("response.data.data.apps", response.data.data.apps);
          response.data.data.apps.map((element) => {
            appData.push({
              name: element.app,
              workspaceName: element.workspace,
            });
          });
          setAppList(appData);
        })
        .catch((e) => {
          console.log("error", e);
        });
    } catch (error) {
      console.log(error);
    }
    // }
  };

  // useEffect(() => {
  // doGetAllResources();
  //   feedDataToDropDown();
  // }, [0]);
  useEffect(() => {
    // APPINFO();
    loadApps();
    console.log("callig loadApps");
  }, []);

  const feedDataToDropDown = () => {
    getAppAndDatamodels()
      .then((result) => {
        if (result.status == "success") {
          setAllAppWithDataModal(result.data.collectionsWithSchema);
          const appName = Object.keys(result.data.collectionsWithSchema);
          // console.log("appName", appName);
          setShowAllApp(appName);
        }
      })
      .catch((err) => {});
  };

  const handleAppSelection = (selectedApp) => {
    const selectedAppOnly = JSON.parse(selectedApp);
    setSelectedApp(selectedAppOnly.name);
    setShowAllDataModel(allAppWithDataModal[`${selectedApp}`]);
    doGetAllResources(selectedAppOnly);
    // loadApps(selectedAppOnly);
  };

  const handleDataModelSelection = (selectedDataModal) => {
    setSelectedDataModel(selectedDataModal);
  };

  const doGetAllResources = (selectedAppOnly) => {
    axios({
      method: "post",
      url:
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
        "modellerService/getResources",
      data: {
        workspaceName: selectedAppOnly?.workspaceName,
        miniAppName: selectedAppOnly?.name,
      },
    })
      .then((response) => {
        console.log("response", response.data.data.datamodel);
        setAppListDatamodelName(response.data.data.datamodel);
      })
      .catch((err) => {
        return err;
      });
  };

  const DownloadTemplate = () => {
    if (selectedApp == "" || selectedDataModel == "") {
      let errorDialog =
        selectedApp == ""
          ? "Select Source can't be empty"
          : selectedDataModel == ""
          ? "Please select a data model"
          : "Something went wrong";

      toast.error(`${errorDialog}`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    let data = {
      miniAppName: selectedApp,
      dataModelName: selectedDataModel,
    };

    let config = {
      method: "post",
      url: `${process.env.REACT_APP_BULKUPLOAD}upload-file/getExcelTemplate`,
      data: data,
      responseType: "blob",
    };
    // console.log("config", config);

    axios
      .request(config)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `download.xlsx`);
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
        DownloadLogs();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const DownloadLogs = () => {
    let config = {
      method: "get",
      url: `${process.env.REACT_APP_BULKUPLOAD}upload-file/getTemplateDownloadStatus`,
    };

    axios
      .request(config)
      .then((response) => {
        let allBulkUploads = response.data;

        let bulkuploadDataTemp = allBulkUploads.map((bulk) => {
          let currentBulk = {
            fileName: bulk.fileName,
            Apps: bulk.appName,
            AddedBy: bulk.uploadedBy,
            createdOn: bulk.createdOn,
            status: bulk.uploadStatus,
            uploadId: bulk.uploadId,
          };
          return currentBulk;
        });
        setBulkData(bulkuploadDataTemp);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const Previewapi = async () => {
    const excelbase64 = await convertBase64(selectedExcel);
    var spliteddata = excelbase64.split(",");
    // let data = JSON.stringify({
    //   miniAppName: selectedApp,
    //   // dataModelName: selectedDataModel,
    //   excelContent: spliteddata[1],
    // });

    let data = {
      miniAppName: selectedApp,
      dataModelName: selectedDataModel,
      excelContent: spliteddata[1],
    };
    let postFormData = new FormData();

    postFormData.append("file", selectedExcel);
    postFormData.append("miniAppName", selectedApp);
    // console.log("excelContent", spliteddata[1]);
    let config = {
      method: "post",
      // maxBodyLength: Infinity,
      url: process.env.REACT_APP_BULKUPLOAD + `upload-file/validateData`,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: postFormData,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log("response", response.data);

        let currentBulkPreview = [
          {
            uploadId: response.data.uploadId,
            sheetName: response.data.sheetName,
            Apps: response.data.miniAppName,
            sucessfullyUpdated: response.data.successRecordsCount,
            errors: response.data.errorRecordsCount,
            errorlist: response.data.remark,
          },
        ];

        // console.log("allBulkUploadPreview", bulkUploadPreviewTemp);

        setBulkUploadPreview(currentBulkPreview);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const uploadLogs = () => {
    let config = {
      method: "get",
      url: `${process.env.REACT_APP_BULKUPLOAD}upload-file/getAllUploadsStatus`,
    };

    axios
      .request(config)
      .then((response) => {
        let allBulkUploadsLog = response.data;
        // console.log("allbulk", allBulkUploadsLog.length);

        let bulkuploadLogDataTemp = allBulkUploadsLog.map((bulkLog) => {
          let currentBulkLog = {
            fileName: bulkLog.sheetName,
            Apps: bulkLog.appName,
            AddedBy: bulkLog.uploadedBy,
            createdOn: bulkLog.processEndTime,
            status: bulkLog.uploadStatus,
            uploadId: bulkLog.uploadId,
          };
          console.log("currentBulkLog", currentBulkLog);
          return currentBulkLog;
        });
        setBulUploadkLog(bulkuploadLogDataTemp);
        // console.log(JSON.stringify(response.data));
        // console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  console.log({ bulkUploadPreview });

  return (
    <>
      <div>
        <div className="container-fluid">
          {/* this is for breadcrums */}
          <div className="row">
            <div
              className="col-md-6"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <div className="ms-2">
                <div className="breadCrum c">
                  <Link to="/">
                    <img src={Home} alt="" />
                  </Link>
                  <h6 className="primaryColor">{">>"}</h6>
                  <Link to="/AdminDashboard" disable>
                    <h6
                      className="primaryColor"
                      style={{ color: " #0c83bf", letterSpacing: "1px" }}
                    >
                      Admin Dashboard
                    </h6>
                  </Link>
                  <h6 className="primaryColor">{">>"}</h6>
                  <h6
                    className="primaryColor"
                    style={{ color: " #0c83bf", letterSpacing: "1px" }}
                  >
                    Bulk Upload
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ul
          class="nav nav-pills "
          id="pills-tab"
          role="tablist"
          style={{ marginTop: "40px", marginLeft: "50px" }}
        >
          <li class="nav-item" role="RecentActions">
            <button
              class="nav-link active propertiesPopup"
              id="RecentActions-tab"
              data-bs-toggle="pill"
              data-bs-target="#RecentActions"
              type="button"
              role="tab"
              aria-controls="RecentActions"
              aria-selected="true"
              onClick={() => {
                setShowTemplateSection(true);
                setShowUploadSection(false);
              }}
            >
              {t(" Templates For Bulk Upload")}
            </button>
          </li>
          <li class="nav-item IFApplication-nav-link" role="ProcessHistory">
            <button
              class="nav-link propertiesPopup"
              id="ProcessHistory-tab"
              data-bs-toggle="pill"
              data-bs-target="#ProcessHistory"
              type="button"
              role="tab"
              aria-controls="ProcessHistory"
              aria-selected="false"
              onClick={() => {
                setShowUploadSection(true);
                setShowTemplateSection(false);
              }}
            >
              {t(" Bulk Actions Upload")}
            </button>
          </li>
        </ul>
      </div>

      {showTemplateSection && (
        <div className="templatesec">
          <div className="mt-3 mb-3 px-5 py-4 create-bulkuploadreport-section ">
            <div className="create-report-message secondaryColor">
              To make sure your datas are correctly applied use a template
            </div>

            <div className="row mt-3">
              <div className="col-4 pe-5">
                <div>
                  <div className="create-report-input-label secondaryColor">
                    select source
                    <span className="appdesignerappname secondaryColor">*</span>
                  </div>
                  <div>
                    <select
                      className="data-model-btn px-1 py-1 mt-1"
                      onChange={(e) => {
                        handleAppSelection(e.target.value);
                      }}
                    >
                      {/* <CustomSelect
                      transferFrom={selectedApp}
                      bringingvalue={handleAppSelection}
                      id="-usertask-CustomSelect"
                    /> */}
                      <option hidden disabled selected>
                        select apps
                      </option>
                      {appList.map((app) => {
                        return (
                          <option value={JSON.stringify(app)}>
                            {app.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-4 pe-5">
                <div>
                  <div className="create-report-input-label secondaryColor">
                    select App/module
                    <span className="appdesignerappname secondaryColor">*</span>
                  </div>
                  <div>
                    <select
                      className="data-model-btn px-1 py-1 mt-1"
                      onChange={(e) =>
                        // console.log(JSON.stringify(e.target.value))
                        handleDataModelSelection(e.target.value)
                      }
                    >
                      <option hidden disabled selected>
                        Select base Data set
                      </option>

                      {appListDatamodelName?.map((app) => {
                        return (
                          <option value={app.resourceName.replace(".java", "")}>
                            {app.resourceName.replace(".java", "")}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>
              {/* {loggedInUser.enabled_menus?.menus_enabled?.includes(
            "REPORTS_CREATE"
          ) && ( */}
              <div className="col-4 d-flex align-items-end">
                <div className="">
                  <button
                    className="primaryButton-bulkupload primaryButtonColor create-report-btn "
                    onClick={() => DownloadTemplate()}
                  >
                    Download Template
                  </button>
                </div>
              </div>
              {/* )} */}
            </div>
          </div>
          <div
            className="container-fluid px-5 mt-5 "
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <span className="reports-table-heading secondaryColor">
                Recently Dowloaded templates
              </span>
            </div>
          </div>

          <div className="mx-5 px-2 mt-3">
            <div className="col-md-4 col-lg-4 col-sm-8">
              <div className="report-search">
                <img
                  src={SearchIcon}
                  // height={10}
                  // width={10}
                  className="report-searchicon"
                />
                <input
                  type="text"
                  className="report-searchinput"
                  placeholder={t("search")}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    // setSearchColumn(column.id);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="px-5">
            <BulkuploadTable
              TableData={bulkData}
              TableHeaders={ReportDataHeaders}
              TableCurrentPage={tableCurrentPage}
              setTableCurrentPage={setTableCurrentPage}
              //   softDeleteReport={softDeleteReport}
              callDownloadLogs={DownloadLogs}
              callUploadLogs={uploadLogs}
              searchKeyword={searchTerm}
            />
          </div>
        </div>
      )}

      {showUploadSection && (
        <div className="templatesec">
          <div className="mt-3 mb-3 px-5 py-4 create-bulkuploadreport-section ">
            <div className="create-report-message secondaryColor">
              Bulk Upload to quickly add relevant data to App/Module at one shot
            </div>

            <div className="row mt-3">
              <div className="col-3 pe-5">
                <div>
                  <div className="create-report-input-label secondaryColor">
                    select source
                  </div>
                  <div>
                    <select
                      className="data-model-btn px-1 py-1 mt-1"
                      onChange={(e) => {
                        handleAppSelection(e.target.value);
                      }}
                    >
                      <option hidden disabled selected>
                        select apps
                      </option>
                      {appList.map((app) => {
                        return (
                          <option value={JSON.stringify(app)}>
                            {app.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-3 pe-5">
                <div>
                  <div className="create-report-input-label secondaryColor">
                    Select what you are uploading
                  </div>
                  <div>
                    <select
                      className="data-model-btn px-1 py-1 mt-1"
                      onChange={(e) =>
                        // console.log(JSON.stringify(e.target.value))
                        handleDataModelSelection(e.target.value)
                      }
                    >
                      <option hidden disabled selected>
                        Select base Data set
                      </option>

                      {appListDatamodelName.map((app) => {
                        return (
                          <option value={app.resourceName.replace(".java", "")}>
                            {app.resourceName.replace(".java", "")}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-3 pe-5">
                {selectedExcel ? (
                  <div className="uploadExceldiv">
                    {/* <div className="w-100"> */}
                    <Link className="bulkuploadedExcelTitle ellipsis secondaryColor">
                      {selectedExcel.name}
                      {" - "} {excelSize}
                    </Link>
                    {/* <Link className="bulkuploadedExcelSize secondaryColor">
                      {excelSize}
                    </Link> */}
                    {/* </div> */}
                    <span
                      className="bulkupload-Delete "
                      onClick={() => setSelectedExcel(null)}
                    >
                      Delete
                    </span>
                    {errorMessage && (
                      <p className="bulkupload">{errorMessage}</p>
                    )}
                  </div>
                ) : (
                  <div className="uploadExceldiv">
                    <p className="uploadExceltext secondaryColor">
                      Have you added data to template relevant Excel.{"  "}
                      <label htmlFor="myfile" className="bulkupload ">
                        {"  "}
                        {t("Upload Excel")}
                      </label>
                      <input
                        type="file"
                        id="myfile"
                        className="bulk-upload-input"
                        name="myfile"
                        accept=".xlsx,.xls"
                        onChange={(event) => {
                          // console.log(
                          //   "set excel upload",
                          //   elem.target.files[0].size / 1024
                          // );
                          handleFileUpload(event);
                        }}
                        style={{ display: "none" }}
                        ref={hiddenFileInput}
                      />
                    </p>
                  </div>
                )}
              </div>
              {/* {loggedInUser.enabled_menus?.menus_enabled?.includes(
        "REPORTS_CREATE"
      ) && ( */}
              <div
                className="col-3 d-flex align-items-end"
                style={{ alignSelf: "center" }}
              >
                <button
                  className="secondaryButton  secondaryButtonColor"
                  onClick={OnPreviewModalShow}
                  disabled={
                    selectedExcel == null || errorMessage != null ? true : false
                  }
                >
                  Preview
                </button>
                {/* <button
                  className="primaryButton-bulkupload primaryButtonColor"
                  disabled={selectedExcel == null ? true : false}
                >
                  Apply
                </button> */}
              </div>
              {/* )} */}
            </div>
          </div>
          <div
            className="container-fluid px-5 mt-5 "
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <span className="reports-table-heading secondaryColor">
                Recently Bulk Upload files
              </span>
            </div>
          </div>

          <div className="mx-5 px-2 mt-3">
            <div className="col-md-4 col-lg-4 col-sm-8">
              <div className="report-search">
                <img
                  src={SearchIcon}
                  // height={10}
                  // width={10}
                  className="report-searchicon"
                />
                <input
                  type="text"
                  className="report-searchinput"
                  placeholder={t("search")}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    // setSearchColumn(column.id);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="px-5">
            <BulkuploadLogTable
              TableData={bulkUploadLog}
              TableHeaders={BulkUploadDataHeaders}
              uploadLogs={uploadLogs}
              TableCurrentPage={tableCurrentPage}
              setTableCurrentPage={setTableCurrentPage}
              //   softDeleteReport={softDeleteReport}
              searchKeyword={searchTerm}
            />
          </div>
        </div>
      )}

      <CommonModelContainer
        modalTitle={selectedExcel?.name}
        show={showPreviewModal}
        handleClose={() => setShowPreviewModal(false)}
        className="adduser-modal"
      >
        <div className="bulkpreview">
          <div className="bulkpreviewHeader">
            <p className="BulkPreviewPopUp secondaryColor">
              {" "}
              Changes Updated
              <div>{bulkUploadPreview[0]?.sucessfullyUpdated} </div>
            </p>
            <p className="BulkPreviewPopUpp1 secondaryColor">
              Succesfully Updated
              <div>{bulkUploadPreview[0]?.sucessfullyUpdated}</div>
            </p>
            <p className="BulkPreviewPopUpp2 secondaryColor">
              Errors
              <div>{bulkUploadPreview[0]?.errors}</div>
            </p>{" "}
            {bulkUploadPreview[0]?.errors && ( // Check if errorlist is present
              <p className="BulkPreviewPopUpp2  secondaryColor">
                ErrorList
                <div style={{ color: "red" }}>
                  {bulkUploadPreview[0]?.errorlist}
                </div>
              </p>
            )}
          </div>

          <PreviewPopUp
            TableData={bulkUploadPreview}
            TableHeaders={BulkUploadPreviewHeaders}
            TableBody={jsonData}
            TableCurrentPage={tableCurrentPage}
            setTableCurrentPage={setTableCurrentPage}
            searchKeyword={searchTerm}
          />
          <div>
            <button
              className="primaryButton-bulkupload primaryButtonColor"
              onClick={Bulkupload}
              style={{ float: "right" }}
            >
              Apply
            </button>
            <button
              className="secondaryButton secondaryButtonColor"
              onClick={() => setShowPreviewModal(false)}
              style={{ float: "right" }}
            >
              Close
            </button>
          </div>
        </div>
      </CommonModelContainer>
    </>
  );
};

export default BulkUpload;
