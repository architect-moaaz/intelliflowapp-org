import React, { useState } from "react";
import "./KeyVault.css";
import CommonModelContainer from "../../components/CommonModel/CommonModelContainer";
import { Row } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import Select from "react-select";
import KeyVaultTable from "./KeyVaultTable";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import hidePasswordImg from "../../assets/NewIcon/hidePassword.png";
import showPasswordImg from "../../assets/NewIcon/showPassword.png";
import CustomSelect from "../../components/CustomSelect/CustomSelect";

const KeyVault = () => {
  const [t, i18n] = useTranslation("common");
  const [keyVaultGenerateKeyPopup, setKeyVaultGenerateKeyPopup] =
    useState(false);
  var [keyName, setKeyName] = useState("");
  var [workspaceName, setWorkspaceName] = useState("");
  var [applicationName, setApplicationName] = useState("");
  var [headers, setHeaders] = useState("");
  var [methods, setMethods] = useState("");
  var [dbpassword, setDbPassword] = useState("");
  var [body, setBody] = useState("");
  var [dbname, setDbname] = useState("");
  var [dbusername, setDbusername] = useState("");
  var [dbtype, setDbtype] = useState("");
  var [url, setUrl] = useState("");
  var [host, setHost] = useState("");
  var [port, setPort] = useState("");
  var [dataOperationType, setDataOperationType] = useState({
    value: "sql",
    label: "Sql",
  });
  let [button, setButton] = useState("SelectDataOperation");
  let [tableData, setTableData] = useState([]);
  let [modaltitle, setModaltitle] = useState("Generate Key");
  const [showDeleteModel, setShowDeleteModel] = useState(false);
  const [tableCurrentPage, setTableCurrentPage] = useState(1);
  const [disableFields, setDisableFields] = useState({
    keyNameDisable: false,
    dataOperationType: false,
    workspaceName: false,
    applicationName: false,
  });
  const [activeTab, setActiveTab] = useState("SelectDataOperation");
  const [paginationOffset, setPaginationOffset] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [appList, setAppList] = useState([]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setButton(tab);
  };
  // const [searchTerm, setSearchTerm] = useState("");

  const handlekeyVaultGenerateKeyPopup = (e) => {
    e.preventDefault();
    setKeyVaultGenerateKeyPopup(true);
    clearGernateNewKey();
    setModaltitle("Generate Key");
    setDataOperationType({
      value: "sql",
      label: "Sql",
    });
  };

  const handlekeyVaultUpdateKeyPopup = () => {
    setKeyVaultGenerateKeyPopup(true);
  };

  const DataOperationOptions = [
    {
      value: "sql",
      label: "Sql",
    },

    {
      value: "rest",
      label: "Rest",
    },
  ];

  const handleFilterData = (e) => {
    setDataOperationType(e);
    if (e.value === "sql") {
      clearRestDataFields();
    } else {
      clearSqlDataFields();
    }
  };

  const ReportDataHeaders = [
    {
      headerName: "Key Name",
    },
    {
      headerName: "DB User",
    },
    {
      headerName: "Created On",
    },
    {
      headerName: "Workspace Name",
    },
    {
      headerName: "App Name",
    },
    {
      headerName: "Connection Actions",
    },
  ];

  const getTableData = () => {
    try {
      axios
        .get(
          process.env.REACT_APP_KEY_VAULT_ENDPOINT +
            "getAllSecretes" +
            `?page=${paginationOffset}&size=4`
        )
        .then((response) => {
          if (response?.data?.metaData?.totalPages) {
            setTableData(response.data.data);
          } else {
            setTableData(response.data);
          }
          if (response?.data?.metaData?.totalPages) {
            setTotalPages(response.data.metaData.totalPages);
          }
        });
    } catch (e) {
      console.log(e);
    }
  };

  const gernateNewKey = () => {
    let data;
    const id = toast.loading("Creating Key");

    if (dataOperationType.value == "sql") {
      data = {
        data: {
          dbName: dbname,
          dbUserName: dbusername,
          dbPassword: dbpassword,
          dbType: dbtype,
          host: host,
          port: port,
        },
      };
    } else {
      data = {
        data: {
          headers: headers,
          methods: methods,
          url: url,
          body: body,
        },
      };
    }

    let config = {
      method: "post",
      url: process.env.REACT_APP_KEY_VAULT_ENDPOINT + "createSecrete",
      headers: {
        workspace: workspaceName,
        appname: applicationName,
        datakey: keyName,
        type: dataOperationType.value,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        getTableData();
        toast.update(id, {
          render: "Key Generated Successfully  ",
          position: "top-center",
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          type: "success",
          isLoading: false,
        });
        setKeyVaultGenerateKeyPopup(false);
      })
      .catch((error) => {
        toast.update(id, {
          render: "Creating Key Failed ",
          position: "top-center",
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          type: "error",
          isLoading: false,
        });
        console.log(error);
      });
  };

  const deleteKeyVaultKey = (keyName) => {
    const id = toast.loading("Deleting Key");
    let config = {
      method: "delete",
      url: process.env.REACT_APP_KEY_VAULT_ENDPOINT + "deleteSecrete",
      headers: {
        datakey: keyName,
      },
    };

    axios
      .request(config)
      .then((response) => {
        toast.update(id, {
          render: "Key Deleted Successfully",
          position: "top-center",
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          type: "success",
          isLoading: false,
        });
        getTableData();
        setShowDeleteModel(false);
      })
      .catch((error) => {
        toast.update(id, {
          render: "Deleting Key Failed ",
          position: "top-center",
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          type: "error",
          isLoading: false,
        });
        console.log(error);
      });
  };

  const clearSqlDataFields = () => {
    setDbname("");
    setDbusername("");
    setDbPassword("");
    setDbtype("");
    setHost("");
    setPort("");
  };

  const clearRestDataFields = () => {
    setHeaders("");
    setMethods("");
    setUrl("");
    setBody("");
  };

  const clearGernateNewKey = () => {
    setDbname("");
    setDbusername("");
    setDbPassword("");
    setDbtype("");
    setHost("");
    setPort("");
    setHeaders("");
    setMethods("");
    setUrl("");
    setBody("");
    setKeyName("");
    setWorkspaceName("");
    setApplicationName("");
    setDataOperationType({
      value: "Sql",
      label: "Sql",
    });
    setButton("SelectDataOperation");
  };

  const getTheSecretKey = (callbackData) => {
    let config = {
      method: "get",
      url: process.env.REACT_APP_KEY_VAULT_ENDPOINT + "getSecrete",
      headers: {
        datakey: callbackData.dataKey,
        appname: callbackData.appName,
      },
    };

    axios
      .request(config)
      .then((response) => {
        const data = JSON.parse(response.data.data);
        setDbname(data.dbName);
        setDbusername(data.dbUserName);
        setDbPassword(data.dbPassword);
        setDbtype(data.dbType);
        setHost(data.host);
        setPort(data.port);

        setHeaders(data.headers);
        setMethods(data.methods);
        setUrl(data.url);
        setBody(data.body);

        setKeyName(callbackData.dataKey);
        setWorkspaceName(callbackData.workspace);
        setApplicationName(callbackData.appName);
        setDataOperationType({
          value: callbackData.type,
          label: callbackData.type,
        });

        setModaltitle("Update Key");
        handlekeyVaultUpdateKeyPopup();

        setDisableFields({
          keyNameDisable: true,
          dataOperationType: true,
          workspaceName: true,
          applicationName: true,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateKeyVault = () => {
    const id = toast.loading("Updating Key");
    let data;
    dataOperationType.value === "sql"
      ? (data = {
          data: {
            dbName: dbname,
            dbUserName: dbusername,
            dbPassword: dbpassword,
            dbType: dbtype,
            host: host,
            port: port,
          },
        })
      : (data = {
          data: {
            headers: headers,
            methods: methods,
            url: url,
            body: body,
          },
        });

    let config = {
      method: "put",
      url: process.env.REACT_APP_KEY_VAULT_ENDPOINT + "updateSecrete",
      headers: {
        datakey: keyName,
        // workspace: workspaceName,
        // appname: applicationName,
        // type: dataOperationType.value,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        toast.update(id, {
          render: "Key Updated Successfully  ",
          position: "top-center",
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          type: "success",
          isLoading: false,
        });
        console.log(JSON.stringify("updateKeyVault", response.data));
      })
      .catch((error) => {
        toast.update(id, {
          render: "Updating Key Failed ",
          position: "top-center",
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          type: "error",
          isLoading: false,
        });
        console.log(error);
      });
  };

  useEffect(() => {
    getTableData();
  }, [paginationOffset]);

  const callbackOffset = (offset) => {
    setPaginationOffset(offset);
  };

  const callbackDataKey = (data) => {
    getTheSecretKey(data);
  };

  const onOpenDeleteModal = (keyname) => {
    setShowDeleteModel(!showDeleteModel);
    setKeyName(keyname);
  };

  console.log("activeTab", activeTab);

  const sqlHandleTest = () => {
    const id = toast.loading("Testing Connection");
    const data = {
      data: {
        dbName: dbname,
        dbUserName: dbusername,
        dbPassword: dbpassword,
        dbType: dbtype,
        host: host,
        port: port,
      },
    };

    let config = {
      method: "post",
      url: `${process.env.REACT_APP_MODELLER_API_ENDPOINT}modellerService/testJDBCConnection`,
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.connectionEstablished == true) {
          toast.update(id, {
            render: "Test connection successful",
            position: "top-center",
            autoClose: 6000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            type: "success",
            isLoading: false,
          });
        } else {
          toast.update(id, {
            render: "Test connection failed",
            position: "top-center",
            autoClose: 6000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            type: "error",
            isLoading: false,
          });
        }
      })
      .catch((error) => {
        toast.update(id, {
          render: "Test connection failed",
          position: "top-center",
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          type: "error",
          isLoading: false,
        });
        console.log(error);
      });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const APPINFO = async () => {
    var config = {
      method: "get",
      url:
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
        "modellerService/" +
        localStorage.getItem("workspace") +
        "/data",
      headers: {},
    };
    axios(config)
      .then(async (response) => {
        const temp = response?.data?.data?.data?.apps?.map((element) => {
          return {
            value: element.appName,
          };
        });
        setAppList(temp);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    APPINFO();
  }, []);

  const handleAppName = (tempselectedbpmn) => {
    setApplicationName(tempselectedbpmn?.value);
  };

  return (
    <div className="KeyVault">
      <div className="KeyVaultHeader">
        <p>Key Vault</p>
        <button
          className="primaryButton create-new-key"
          onClick={(e) => handlekeyVaultGenerateKeyPopup(e)}
        >
          Create New Keys
        </button>
        <CommonModelContainer
          modalTitle={modaltitle}
          show={keyVaultGenerateKeyPopup}
          handleClose={() => setKeyVaultGenerateKeyPopup(false)}
          centered
          size="md"
          className="KeyVaultPopup"
          id="KeyVault-modal"
        >
          <Modal.Body className="KeyVault-popup-body">
            <ul
              class="nav nav-pills label-pills KeyVault-content"
              id="pills-tab"
              role="tablist"
            >
              <li class="nav-item" role="KeyVaultSelectDataOperation">
                <button
                  class={`nav-link KeyVaultPopupnav-link ${
                    activeTab === "SelectDataOperation" ? "active " : ""
                  }`}
                  id="SelectDataOperation-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#KeyVaultSelectDataOperation"
                  type="button"
                  role="tab"
                  // aria-controls="KeyVaultSelectDataOperation"
                  aria-selected={activeTab == "SelectDataOperation"}
                  onClick={() => handleTabChange("SelectDataOperation")}
                >
                  Select Data Operation
                </button>
              </li>
              <li
                class="nav-item"
                role="KeyVaultDataFields"
                className="KeyVault-DataFields"
              >
                <button
                  className={`nav-link KeyVaultPopupnav-link ${
                    activeTab == "DataFields" ? "active" : ""
                  }`}
                  id="DataFields-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#KeyVaultDataFields"
                  type="button"
                  role="tab"
                  // aria-controls="KeyVaultDataFields"
                  aria-selected={activeTab == "DataFields"}
                  onClick={() => handleTabChange("DataFields")}
                >
                  Data Fields
                </button>
              </li>
            </ul>

            <div class="tab-content" id="pills-tabContent">
              <div
                className={`tab-pane fade ${
                  activeTab === "SelectDataOperation" ? "show active" : ""
                }`}
                id="KeyVaultSelectDataOperation"
                role="tabpanel"
                aria-labelledby="SelectDataOperation-tab"
              >
                <form autoComplete="off">
                  <div className="SelectDataOperation ">
                    <div className="form-input keyVautFormInput">
                      <label>Key Name </label>
                      <input
                        type="text"
                        //   placeholder={element.placeholder}
                        value={keyName}
                        onChange={(e) => {
                          setKeyName(e.target.value);
                        }}
                        id="KeyVault-KeyName-input"
                        className="KeyVaultInputText"
                        disabled={disableFields.keyNameDisable}
                      />
                    </div>
                    <div className="form-input keyVautFormInput">
                      <label>Workspace Name </label>
                      <input
                        type="text"
                        //   placeholder={element.placeholder}
                        value={
                          workspaceName || localStorage.getItem("workspace")
                        }
                        onChange={(e) => {
                          setWorkspaceName(e.target.value);
                        }}
                        id="KeyVault-WorkspaceName-input"
                        className="KeyVaultInputText"
                        disabled={true}
                        style={{ cursor: "no-drop" }}
                      />
                    </div>
                    <div className="form-input keyVautFormInput">
                      <label>{t("applicationName")}</label>
                      {/* <input
                        type="text"
                        //   placeholder={element.placeholder}
                        value={applicationName}
                        onChange={(e) => {
                          setApplicationName(e.target.value);
                        }}
                        id="KeyVault-ApplicationName-input"
                        className="KeyVaultInputText"
                        disabled={disableFields.applicationName}
                      /> */}
                      {/* <Select
                        className="DataOperationTypeSelect"
                        // options={}
                        onChange={(e) => {
                          setApplicationName(e.target.value);
                        }}
                        menuPortalTarget={document.body}
                        id="KeyVault-ApplicationName-input"
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        defaultValue={applicationName}
                        disabled={disableFields.applicationName}
                      /> */}
                      <CustomSelect
                        transferFrom={appList}
                        bringingvalue={handleAppName}
                        id="dataModellerMapping-bpmn-CustomSelect"
                        isDisabled={disableFields.applicationName}
                        defaultValue={applicationName}
                      />
                    </div>
                    <div className="form-input keyVautFormInput">
                      <label>Data Operation Type </label>
                      <Select
                        className="DataOperationTypeSelect"
                        options={DataOperationOptions}
                        onChange={handleFilterData}
                        classNamePrefix="DataOperationTypeSelect"
                        id="KeyVault-DataOperationType-input"
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        defaultValue={dataOperationType}
                        disabled={disableFields.dataOperationType}
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div
                className={`tab-pane fade ${
                  activeTab === "DataFields" ? "show active" : ""
                }`}
                id="KeyVaultDataFields"
                role="tabpanel"
                aria-labelledby="DataFields-tab"
              >
                <form autoComplete="off">
                  {dataOperationType.value === "rest" ? (
                    <div className="col DataFieldsRest">
                      <div className="form-input keyVautFormInput">
                        <label>Headers </label>
                        <input
                          type="text"
                          //   placeholder={element.placeholder}
                          value={headers}
                          onChange={(e) => {
                            setHeaders(e.target.value);
                          }}
                          id="KeyVault-Headers-input"
                          className="KeyVaultInputText"
                        />
                      </div>
                      <div className="form-input keyVautFormInput">
                        <label>Methods </label>
                        <input
                          type="text"
                          //   placeholder={element.placeholder}
                          value={methods}
                          onChange={(e) => {
                            setMethods(e.target.value);
                          }}
                          id="KeyVault-Methods-input"
                          className="KeyVaultInputText"
                        />
                      </div>
                      <div className="form-input keyVautFormInput">
                        <label>Url </label>
                        <input
                          type="text"
                          //   placeholder={element.placeholder}
                          value={url}
                          onChange={(e) => {
                            setUrl(e.target.value);
                          }}
                          id="KeyVault-Url-input"
                          className="KeyVaultInputText"
                        />
                      </div>
                      <div className="form-input keyVautFormInput">
                        <label>Body</label>
                        <input
                          type="text"
                          //   placeholder={element.placeholder}
                          value={body}
                          onChange={(e) => {
                            setBody(e.target.value);
                          }}
                          id="KeyVault-Body-input"
                          className="KeyVaultInputText"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="row DataFieldsSql">
                      <div className="col DataFields-LeftSide">
                        <div className="form-input keyVautFormInput">
                          <label>DB Name </label>
                          <input
                            type="text"
                            //   placeholder={element.placeholder}
                            value={dbname}
                            onChange={(e) => {
                              setDbname(e.target.value);
                            }}
                            id="KeyVault-DBName-input"
                            className="KeyVaultInputText"
                          />
                        </div>
                        <div className="form-input keyVautFormInput">
                          <label>DB UserName </label>
                          <input
                            type="text"
                            //   placeholder={element.placeholder}
                            value={dbusername}
                            onChange={(e) => {
                              setDbusername(e.target.value);
                            }}
                            id="KeyVault-SqlStatement-input"
                            className="KeyVaultInputText"
                            autoComplete="off"
                          />
                        </div>
                        <div className="form-input keyVautFormInput">
                          <label>
                            DB Password
                            <input
                              type={showPassword ? "text" : "password"}
                              //   placeholder={element.placeholder}
                              value={dbpassword}
                              onChange={(e) => {
                                setDbPassword(e.target.value);
                              }}
                              id="KeyVault-DBPassword-input"
                              className="KeyVaultInputText"
                              autoComplete="new-password"
                            />
                            {showPassword ? (
                              <img
                                src={showPasswordImg}
                                onClick={handleTogglePassword}
                                alt=""
                                style={{
                                  height: "24px",
                                  width: "24px",
                                  position: "absolute",
                                  top: "31px",
                                  right: "12px",
                                }}
                              />
                            ) : (
                              <img
                                src={hidePasswordImg}
                                onClick={handleTogglePassword}
                                alt=""
                                style={{
                                  height: "24px",
                                  width: "24px",
                                  position: "absolute",
                                  top: "31px",
                                  right: "12px",
                                }}
                              />
                            )}
                          </label>
                        </div>
                        <div className="form-input keyVautFormInput">
                          <label>DB Type </label>
                          <input
                            type="text"
                            //   placeholder={element.placeholder}
                            value={dbtype}
                            onChange={(e) => {
                              setDbtype(e.target.value);
                            }}
                            id="KeyVault-DBType-input"
                            className="KeyVaultInputText"
                          />
                        </div>
                      </div>
                      <div className="col DataFields-RightSide">
                        <div className="form-input keyVautFormInput">
                          <label>Host </label>
                          <input
                            type="text"
                            //   placeholder={element.placeholder}
                            value={host}
                            onChange={(e) => {
                              setHost(e.target.value);
                            }}
                            id="KeyVault-Host-input"
                            className="KeyVaultInputText"
                          />
                        </div>
                        <div className="form-input keyVautFormInput">
                          <label>Port </label>
                          <input
                            type="text"
                            //   placeholder={element.placeholder}
                            value={port}
                            onChange={(e) => {
                              setPort(e.target.value);
                            }}
                            id="KeyVault-Port-input"
                            className="KeyVaultInputText"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
            <Row className="GenerateKeyPopupButtonContainer">
              {dataOperationType.value === "sql" && button == "DataFields" && (
                <button
                  className=" GenerateKeyPopupButton"
                  onClick={() => sqlHandleTest()}
                  id="KeyVault-Popup-Test"
                  disabled={
                    dbname == "" ||
                    dbusername == "" ||
                    dbpassword == "" ||
                    dbtype == "" ||
                    host == "" ||
                    port == ""
                      ? true
                      : false
                  }
                >
                  Test
                </button>
              )}
              <button
                className=" GenerateKeyPopupButtonCancel"
                onClick={() => setKeyVaultGenerateKeyPopup(false)}
                id="KeyVault-Popup-Cancel"
              >
                Cancel
              </button>
              {button == "SelectDataOperation" ? (
                <button
                  className=" GenerateKeyPopupButton"
                  onClick={() => handleTabChange("DataFields")}
                  id="KeyVault-Popup-Next"
                  data-bs-target="#KeyVaultDataFields"
                  role="tab"
                  aria-controls="KeyVaultDataFields"
                  aria-selected={activeTab === "DataFields"}
                >
                  Next
                </button>
              ) : (
                <button
                  className=" GenerateKeyPopupButton"
                  onClick={() => handleTabChange("SelectDataOperation")}
                  data-bs-target="#KeyVaultSelectDataOperation"
                  id="KeyVault-Popup-Back"
                  role="tab"
                  aria-controls="KeyVaultSelectDataOperation"
                  aria-selected={activeTab === "SelectDataOperation"}
                >
                  Back
                </button>
              )}

              {button == "DataFields" && modaltitle == "Generate Key" && (
                <button
                  className=" GenerateKeyPopupButton"
                  onClick={() => gernateNewKey()}
                  id="KeyVault-Popup-GenerateKey"
                  disabled={
                    keyName == "" ||
                    applicationName == "" ||
                    dbname == "" ||
                    dbusername == "" ||
                    dbpassword == "" ||
                    dbtype == "" ||
                    host == "" ||
                    port == ""
                      ? true
                      : false
                  }
                >
                  Generate Key
                </button>
              )}
              {modaltitle == "Update Key" && (
                <button
                  className=" UpdateKeyPopupButton"
                  onClick={() => updateKeyVault()}
                  id="KeyVault-Popup-UpdateKey"
                >
                  Update Key
                </button>
              )}
            </Row>
          </Modal.Body>
        </CommonModelContainer>
        <CommonModelContainer
          modalTitle="Delete Key"
          show={showDeleteModel}
          handleClose={onOpenDeleteModal}
          centered
          size="md"
          id="key-vault-delete-model"
        >
          <Modal.Body className="py-4 px-4 create-new-app-modal">
            <div>
              <Row>
                <p>Are you sure you want to delete {keyName} Key</p>
              </Row>
              <Row>
                <div className="col-12 mt-4 mb-2 appdesigner-deleteapp-cancel">
                  <button
                    id="delete-app-cancel-btn"
                    className="secondaryButton"
                    onClick={() => setShowDeleteModel(false)}
                  >
                    Cancel
                  </button>
                  <button
                    id="delete-app-delete-btn"
                    className="primaryButton"
                    onClick={() => deleteKeyVaultKey(keyName)}
                  >
                    Delete Key
                  </button>
                </div>
              </Row>
            </div>
          </Modal.Body>
        </CommonModelContainer>
        <div className="KeyVault-table">
          <p>Manage Keys</p>
          <KeyVaultTable
            TableData={tableData}
            TableHeaders={ReportDataHeaders}
            TableCurrentPage={tableCurrentPage}
            setTableCurrentPage={setTableCurrentPage}
            callbackDataKey={callbackDataKey}
            onOpenDeleteModal={onOpenDeleteModal}
            callbackOffset={callbackOffset}
            totalPages={totalPages}
            // searchKeyword={searchTerm}
          />
        </div>
      </div>
    </div>
  );
};

export default KeyVault;
