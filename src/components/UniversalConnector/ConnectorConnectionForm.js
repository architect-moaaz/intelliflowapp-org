import axios from "axios";
import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import { loggedInUserState } from "../../state/atom";
import CommonModelContainer from "../CommonModel/CommonModelContainer";
import "./UniversalConnector.css";
import { v4 as uuidv4 } from "uuid";

export default function ConnectorConnectionForm() {
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const [showConnectionForm, setShowConnectionFormModel] = useState(false);
  const [connectorName, setConnectorName] = useState("");

  const [appNames, setAppNames] = useState([]);
  const [connectionNames, setConnectionNames] = useState([]);
  const [dataModelNames, setDataModelNames] = useState([]);
  const [tableNames, setTableNames] = useState([]);

  const fetchDataAppNames = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_MODELLER_API_ENDPOINT}/modellerService/${localStorage.getItem("workspace")}/data`);
      console.log({ response })
      let appNames = []
      response?.data?.data?.data?.apps.map(app => {
        if (app.status === "FINISHED") {
          appNames.push(app.appName);
        }

      })
      setAppNames([...appNames]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  console.log("formData",formData);

  const fetchDataModelNames = async () => {

    try {
      const body = {
        workspaceName: localStorage.getItem("workspace"),
        miniAppName: formData?.sinkConfig?.dbName
      };

      const response = await axios.post(`${process.env.REACT_APP_MODELLER_API_ENDPOINT}/modellerService/getResources`, body);
      console.log({ response });
      let v = response?.data?.data?.datamodel;
      const dataModelNames = v.map(model => model.resourceName.slice(0,-5)) || [];
      setDataModelNames(dataModelNames);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchTableNames = async () => {
    const connectionName = formData?.sourceConfig?.connectionName;
    try {
      const response = await axios.get(`${process.env.REACT_APP_UNIVERSAL_CONNECTOR_ENDPOINT}/connector/tables/${connectionName}`);
      console.log({ response })
      let tables = response?.data;
      setTableNames([...tables]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchConnectionNames = async () => {
    const workSpace = localStorage.getItem("workspace");
    try {
      const response = await axios.get(`${process.env.REACT_APP_UNIVERSAL_CONNECTOR_ENDPOINT}/db-connection/${workSpace}`);
      let connectionNames = []
      response?.data.map(connection => {
        connectionNames.push(connection);
      })
      setConnectionNames([...connectionNames]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchDataAppNames();

  }, []);

  useEffect(() => {
    fetchConnectionNames();

  }, []);

  useEffect(() => {
    fetchTableNames();
  }, [formData?.sourceConfig?.connectionName])

  useEffect(() => {
    fetchDataModelNames();
  }, [formData?.sinkConfig?.dbName])



  const onConnectionFormModal = () => {
    setShowConnectionFormModel(!showConnectionForm);
    setFormData({});
    setMessage("");
  };

  const handleSubmit = async (postData) => {
    const id = toast.loading("Adding connector....");
    await axios
      .post(
        `${process.env.REACT_APP_UNIVERSAL_CONNECTOR_ENDPOINT}/connector/oneclick`,
        formData
      )
      .then((response) => {
        toast.update(id, {
          render: "Connector added successfully",
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          type: "success",
          isLoading: false,
        });
        if (response?.data?.status === 200) {
            setMessage("");
          // window.location.reload();
        } else {
          setMessage(response?.data?.message);
        }
      })
      .catch((error) => {
        setMessage(error?.message);

        toast.update(id, {
          render: "Something went wrong. Please try again",
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          type: "success",
          isLoading: false,
        });
      });
  };

  const handleSourceInputChange = (event) => {
    event.preventDefault();
    console.log(event);
    setFormData((prev) => {
      return {
        ...prev,
        sourceConfig: {
          ...prev.sourceConfig,
          [event.target.name]: event.target.value,
        },
      };
    });
  };

  const handleSinkInputChange = (event) => {
    event.preventDefault();
    setFormData((prev) => {
      return {
        ...prev,
        sinkConfig: {
          ...prev.sinkConfig,
          [event.target.name]: event.target.value,
        },
      };
    });
  };

  const handleSftpTopicsChange = (event) => {
    event.preventDefault();
    setFormData((prev) => {
      return {
        ...prev,
        sourceConfig: {
          ...prev.sourceConfig,
          [event.target.name]: event.target.value,
        },
        sinkConfig: {
          ...prev.sinkConfig,
          [event.target.name]: event.target.value,
        },
      };
    });
  };

  const handleInputChange = (event) => {
    event.preventDefault();
    setFormData((prev) => {
      return { ...prev, [event.target.name]: event.target.value };
    });
  };

  const ConnectionFormPopup = (e) => {
    setConnectorName(e);
    onConnectionFormModal();
  };

  const handleSFTPSubmit = (e) => {
    e.preventDefault();
    // const postData = {
    //   sourceConfig: {
    //     connectionName: formData.connectionName,
    //     connector: "SFTP",
    //     inputPathForSftp: formData.inputPathForSftp,
    //     finishedPathForSftp: formData.finishedPathForSftp,
    //     errorPathForSftp: formData.errorPathForSftp,
    //     connectorType: "SOURCE",
    //     topics: formData.topics,
    //     connectorFamily: "CSV",
    //   },
    //   sinkConfig: {
    //     topics: formData.topics,
    //     connectorType: "SINK",
    //     tables: [...formData.tables],
    //     connectorFamily: "SFTP",
    //   },
    //   transforms: {
    //     renameFieldsNames: {
    //       Name: "userName",
    //       Age: "userAge",
    //     },
    //   },
    //   workSpaceName: localStorage.getItem("workspace"),
    // };
    handleSubmit({ ...formData });
  };

  const handleCDCSubmit = (e) => {
    e.preventDefault();
    // const postData = {
    //   sourceConfig: {
    //     connectionName: formData.connectionName,
    //     connectorType: "SOURCE",
    //     topicsPrefix: formData.topicsPrefix,
    //     tables: [...formData.sourceTables],
    //     columns: {
    //       customers: ["id", "first_name", "email"],
    //     },
    //     connectorFamily: "CDC",
    //   },
    //   sinkConfig: {
    //     topics: formData.topics,
    //     connectorType: "SINK",
    //     tables: [...formData.sinkTables],
    //     connectorFamily: "CDC",
    //   },
    //   workSpaceName: localStorage.getItem("workspace"),
    // };

    setFormData({
      ...formData,
      sourceConfig: {
        ...formData.sourceConfig,
        connectorFamily: "CDC",
        dbServer : uuidv4(),
        topicsPrefix : uuidv4()

      }, sinkConfig: {
        ...formData.sinkConfig,
        connectorFamily: "CDC",
      },
      workSpaceName: localStorage.getItem("workspace"),
    });
    console.log(uuidv4());
    handleSubmit();
  };

  const handleJDBCSubmit = (e) => {
    e.preventDefault();
    // const postData = {
    //   sourceConfig: {
    //     connectionName: formData.connectionName,
    //     connectorType: "SOURCE",
    //     topicsPrefix: formData.topicsPrefix,
    //     tables: [...formData.sourceTables],
    //     connectorFamily: "JDBC",
    //   },
    //   sinkConfig: {
    //     topics: formData.topics,
    //     connectorType: "SINK",
    //     tables: [...formData.sinkTables],
    //     connectorFamily: "JDBC",
    //   },
    //   workSpaceName: localStorage.getItem("workspace"),
    // };
    setFormData({
      ...formData,
      sourceConfig: {
        ...formData.sourceConfig,
        connectorFamily: "JDBC",
      }, sinkConfig: {
        ...formData.sinkConfig,
        connectorFamily: "JDBC",
      },
      workSpaceName: localStorage.getItem("workspace"),
    });
    handleSubmit();
  };

  const renderConnectionForm = () => {
    switch (formData?.sourceConfig?.connector) {
      case "SFTP":
        return (
          <form onSubmit={handleSFTPSubmit}>
            <h5>Source Configuration</h5>
            <div className="custom-grid">
            <label className="secondaryColor">
                Connection Name
                <select
                  name="connectionName"
                  value={formData?.sourceConfig?.connectionName}
                  onChange={handleSourceInputChange}
                  required
                >
                  <option key={""} value={""}>--Please select Connection--</option>
                  {
                    connectionNames?.map((appName, index) => (
                      (appName.connector === "SFTP") && (
                        <option key={index} value={appName.connectionName}>{appName.connectionName}</option>
                      )
                    ))
                  }
                </select>
              </label>
              <label className="secondaryColor">
                Input Path For SFTP
                <input
                  type="text"
                  name="inputPathForSftp"
                  value={formData?.sourceConfig?.inputPathForSftp}
                  onChange={handleSourceInputChange}
                  required
                />
              </label>
              <label className="secondaryColor">
                Finished Path For SFTP
                <input
                  type="text"
                  name="finishedPathForSftp"
                  value={formData?.sourceConfig?.finishedPathForSftp}
                  onChange={handleSourceInputChange}
                  required
                />
              </label>
              <label className="secondaryColor">
                Error Path For SFTP
                <input
                  type="text"
                  name="errorPathForSftp"
                  value={formData?.sourceConfig?.errorPathForSftp}
                  onChange={handleSourceInputChange}
                  required
                />
              </label>
              <label className="secondaryColor">
                Select a Connector Family
                <select
                  name="connectorFamily"
                  value={formData?.sourceConfig?.connectorFamily}
                  onChange={handleSourceInputChange}
                  required
                  disabled
                >
                  <option value="CSV">CSV</option>
                </select>
              </label>
              <div />
            </div>
            <h5>Sink Configuration</h5>
            <div className="custom-grid">
              <label className="secondaryColor">
                Mini App Name
                <select
                  name="dbName"
                  value={formData?.sinkConfig?.dbName}
                  onChange={handleSinkInputChange}
                  required
                >
                  <option key={""} value={""}>--Please select Mini App--</option>
                  {
                    appNames?.map((appName, index) => (
                      <option key={index} value={appName}>{appName}</option>
                    ))
                  }
                </select>
              </label>
              <label className="secondaryColor">
                Data Models
                <select
                  name="tables"
                  value={
                    formData?.sinkConfig?.tables?.length
                      ? formData?.sinkConfig?.tables[0]
                      : ""
                  }
                  onChange={(e) => {
                    setFormData({
                      ...formData, sinkConfig: {
                        ...formData?.sinkConfig, tables: [e.target.value]
                      }
                    })
                  }}
                  required
                >
                  <option key={""} value={""}>--Please select Data Model--</option>
                  {
                    dataModelNames?.map((tableName, index) => (
                      <option key={index} value={tableName}>{tableName}</option>
                    ))
                  }
                </select>
              </label>
            </div>
            <h5>Other</h5>
            <div className="custom-grid">
              <label className="secondaryColor">
                Workspace Name
                <input
                  type="text"
                  placeholder={localStorage.getItem("workspace")}
                  disabled
                />
              </label>
            </div>
            <div className="add-connection-button-wrap">
              <button className="add-connection-button primaryButtonColor">
                Add Connection
              </button>
              <button
                className="add-connection-cancel secondaryButtonColor"
                onClick={() => setFormData({})}
              >
                Previous
              </button>
            </div>
          </form>
        );

      case "CDC":
        return (
          <form onSubmit={handleCDCSubmit}>
            <h5>Source Configuration</h5>
            <div className="custom-grid">
              <label className="secondaryColor">
                Connection Name
                <select
                  name="connectionName"
                  value={formData?.sourceConfig?.connectionName}
                  onChange={handleSourceInputChange}
                  required
                >
                  <option key={""} value={""}>--Please select Connection--</option>
                  {
                    connectionNames?.map((appName, index) => (
                      (appName.connector != "SFTP") && (
                        <option key={index} value={appName.connectionName}>{appName.connectionName}</option>
                      )
                    ))
                  }
                </select>
              </label>
              {/* <label className="secondaryColor">
                DB Server Topic Name
                <input
                  type="text"
                  name="dbServer"
                  value={formData?.sourceConfig?.dbServer}
                  onChange={handleSourceInputChange}
                  required
                />
              </label> */}
              {/* <label className="secondaryColor">
                Topic Prefix
                <input
                  type="text"
                  name="topicsPrefix"
                  value={formData?.sourceConfig?.topicsPrefix}
                  onChange={handleSourceInputChange}
                  required
                />
              </label> */}
              <label className="secondaryColor">
                Select Table
                <select
                  name="tables"
                  value={
                    formData?.sourceConfig?.tables?.length
                      ? formData?.sourceConfig?.tables[0]
                      : ""
                  }
                  onChange={(e) => {
                    setFormData({
                      ...formData, sourceConfig: {
                        ...formData?.sourceConfig, tables: [e.target.value]
                      }
                    })
                  }}
                  required
                >
                  <option key={""} value={""}>--Please select Table--</option>
                  {
                    tableNames?.map((tableName, index) => (
                      <option key={index} value={tableName}>{tableName}</option>
                    ))
                  }
                </select>
              </label>
              <div />
            </div>
            <h5>Sink Configuration</h5>
            <div className="custom-grid">
              <label className="secondaryColor">
                Mini App Name
                <select
                  name="dbName"
                  value={formData?.sinkConfig?.dbName}
                  onChange={handleSinkInputChange}
                  required
                >
                  <option key={""} value={""}>--Please select Mini App--</option>
                  {
                    appNames?.map((appName, index) => (
                      <option key={index} value={appName}>{appName}</option>
                    ))
                  }
                </select>
              </label>
              <label className="secondaryColor">
                Data Models
                <select
                  name="tables"
                  value={
                    formData?.sinkConfig?.tables?.length
                      ? formData?.sinkConfig?.tables[0]
                      : ""
                  }
                  onChange={(e) => {
                    setFormData({
                      ...formData, sinkConfig: {
                        ...formData?.sinkConfig, tables: [e.target.value]
                      }
                    })
                  }}
                  required
                >
                  <option key={""} value={""}>--Please select Data Model--</option>
                  {
                    dataModelNames?.map((tableName, index) => (
                      <option key={index} value={tableName}>{tableName}</option>
                    ))
                  }
                </select>
              </label>
            </div>
            <h5>Other</h5>
            <div className="custom-grid">
              <label className="secondaryColor">
                Workspace Name
                <input
                  type="text"
                  placeholder={localStorage.getItem("workspace")}
                  disabled
                />
              </label>
            </div>
            <div className="add-connection-button-wrap">
              <button className="add-connection-button primaryButtonColor">
                Add Connection
              </button>
              <button
                className="add-connection-cancel secondaryButtonColor"
                onClick={() => setFormData({})}
              >
                Previous
              </button>
            </div>
          </form>
        );

      case "JDBC":
        return (
          <form onSubmit={handleJDBCSubmit}>
            <h5>Source Configuration</h5>
            <div className="custom-grid">
              <label className="secondaryColor">
                Connection Name
                <select
                  name="connectionName"
                  value={formData?.sourceConfig?.connectionName}
                  onChange={handleSourceInputChange}
                  required
                >
                  <option key={""} value={""}>--Please select Connection--</option>
                  {
                    connectionNames?.map((appName, index) => (

                      (appName.connector != "SFTP") && (
                        <option key={index} value={appName.connectionName}>{appName.connectionName}</option>
                      )
                    ))
                  }
                </select>
              </label>
              <label className="secondaryColor">
                Select Table
                <select
                  name="tables"
                  value={
                    formData?.sourceConfig?.tables?.length
                      ? formData?.sourceConfig?.tables[0]
                      : ""
                  }
                  onChange={(e) => {
                    setFormData({
                      ...formData, sourceConfig: {
                        ...formData?.sourceConfig, tables: [e.target.value]
                      }
                    })
                  }}
                  required
                >
                  <option key={""} value={""}>--Please select Table--</option>
                  {
                    tableNames?.map((tableName, index) => (
                      <option key={index} value={tableName}>{tableName}</option>
                    ))
                  }
                </select>
              </label>
              <div />
            </div>
            <h5>Sink Configuration</h5>
            <div className="custom-grid">
              <label className="secondaryColor">
                Mini App Name
                <select
                  name="dbName"
                  value={formData?.sinkConfig?.dbName}
                  onChange={handleSinkInputChange}
                  required
                >
                  <option key={""} value={""}>--Please select Mini App--</option>
                  {
                    appNames?.map((appName, index) => (
                      <option key={index} value={appName}>{appName}</option>
                    ))
                  }
                </select>
              </label>
              <label className="secondaryColor">
                Data Models
                <select
                  name="tables"
                  value={
                    formData?.sinkConfig?.tables?.length
                      ? formData?.sinkConfig?.tables[0]
                      : ""
                  }
                  onChange={(e) => {
                    setFormData({
                      ...formData, sinkConfig: {
                        ...formData?.sinkConfig, tables: [e.target.value]
                      }
                    })
                  }}
                  required
                >
                  <option key={""} value={""}>--Please select Data Model--</option>
                  {
                    dataModelNames?.map((tableName, index) => (
                      <option key={index} value={tableName}>{tableName}</option>
                    ))
                  }
                </select>
              </label>
            </div>
            <h5>Other</h5>
            <div className="custom-grid">
              <label className="secondaryColor">
                Workspace Name
                <input
                  type="text"
                  placeholder={localStorage.getItem("workspace")}
                  disabled
                />
              </label>
            </div>
            <div className="add-connection-button-wrap">
              <button className="add-connection-button primaryButtonColor">
                Add Connection
              </button>
              <button
                className="add-connection-cancel secondaryButtonColor"
                onClick={() => setFormData({})}
              >
                Previous
              </button>
            </div>
          </form>
        );

      default:
        return <h1 className="primaryColor">Invalid Option</h1>;
    }
  };

  return (
    <>
      {loggedInUser.enabled_menus.menus_enabled.includes(
        "CONNECTOR_CREATE"
      ) && (
          <button
            className="new-connection-button primaryButtonColor"
            onClick={() => ConnectionFormPopup()}
          >
            Add New Connector
          </button>
        )}
      <CommonModelContainer
        modalTitle="Connector Form"
        show={showConnectionForm}
        handleClose={ConnectionFormPopup}
        centered
        size="md"
        id="create-app-delete-app-model"
        className="universal-connector-modal"
      >
        <Modal.Body>
          {!formData?.sourceConfig?.connector && (
            <div className="connector-button-wrap">
              <button
                className="connector-button"
                onClick={() => {
                  setFormData({
                    sourceConfig: {
                      connector: "SFTP",
                      connectorType: "SOURCE",
                      connectorFamily: "CSV",
                    },
                    sinkConfig: {
                      connectorType: "SINK",
                      connectorFamily: "SFTP",
                    },
                    transforms: null,
                    workSpaceName: localStorage.getItem("workspace"),
                  });
                  setMessage("");
                }}
              >
                SFTP
              </button>
              <button
                className="connector-button"
                onClick={() => {
                  setFormData({ sourceConfig: { connector: "CDC" } });
                  setMessage("");
                }}
              >
                CDC
              </button>
              <button
                className="connector-button"
                onClick={() => {
                  setFormData({ sourceConfig: { connector: "JDBC" } });
                  setMessage("");
                }}
              >
                JDBC
              </button>
            </div>
          )}

          {formData?.sourceConfig?.connector && (
            <>
              <h1 className="primaryColor">
                {formData?.sourceConfig?.connector}
              </h1>
              {renderConnectionForm()}
              {message && (
                <tr>
                  <td colSpan={2}>
                    <p style={{ color: "red" }}>{message}</p>
                  </td>
                </tr>
              )}
            </>
          )}
        </Modal.Body>
      </CommonModelContainer>
    </>
  );
}
