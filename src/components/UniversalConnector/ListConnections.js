import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import {
  // Delete,
  Sink,
  Sort,
  Source,
  // UniversalConnectorAlert,
  // Update,
} from "../../assets";
import { ReactComponent as Delete } from "../../assets/images/universal-connector-delete.svg";
import { ReactComponent as UniversalConnectorAlert } from "../../assets/images/universal-connector-alert-icon.svg";
import { ReactComponent as Update } from "../../assets/images/universal-connector-update.svg";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import { loggedInUserState } from "../../state/atom";
import CommonModelContainer from "../CommonModel/CommonModelContainer";

export default function ListConnections() {
  const [connections, setConnections] = useState([]);
  const [formData, setFormData] = useState({});
  const [showDeleteConnectionModel, setShowDeleteConnectionModel] =
    useState(false);
  const [connectionName, setConnectionName] = useState("");
  const [showUpdateModel, setShowUpdateConnectionModel] = useState(false);
  const [updateDataFromServer, setUpdateDataFromServer] = useState([]);
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const [connectionValue, setConnectionValue] = useState();
  const [showAddModel, setShowAddModel] = useState(false);
  const [addConnector, setAddConnector] = useState({});

  const [showSinkModal, setShowSinkModal] = useState(false);
  const [sinkConnector, setSinkConnector] = useState({});

  const getAllConnection = () => {
    axios
      .get(
        `${
          process.env.REACT_APP_UNIVERSAL_CONNECTOR_ENDPOINT
        }/db-connection/${localStorage.getItem("workspace")}`
      )
      .then((response) => {
        setConnections(response.data);
      });
  };

  useEffect(() => {
    getAllConnection();
  }, []);

  const deleteConnection = (connectionName) => {
    const id = toast.loading("Deleting connection....");
    axios
      .delete(
        `${process.env.REACT_APP_UNIVERSAL_CONNECTOR_ENDPOINT}/db-connection/${connectionName}`
      )
      .then((res) => {
        toast.update(id, {
          render: "Deleted Connection Successfully",
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          type: "success",
          isLoading: false,
        });
        getAllConnection();
        setShowDeleteConnectionModel(false);
      })
      .catch((error) => {
        toast.update(id, {
          render: "Delete Connection Failed",
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          type: "error",
          isLoading: false,
        });
      });
  };

  const updateConnection = (connection) => {
    const id = toast.loading("Updating Connection....");

    const PostData = {
      ...formData,
      id: `${updateDataFromServer.id}`,
      workSpaceName: localStorage.getItem("workspace"),
    };

    axios
      .put(
        `${process.env.REACT_APP_UNIVERSAL_CONNECTOR_ENDPOINT}/db-connection`,
        PostData,
        {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          // Origin: "http://localhost:3000",
        }
      )
      .then((res) => {
        const data = res.data;
        if (data.statusCode === 200) {
          toast.update(id, {
            render: "Connection Updated Successfully",
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            type: "success",
            isLoading: false,
          });
        } else if (data.statusCode === 401) {
          toast.update(id, {
            render: "Wrong credentials, Update Failed",
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            type: "error",
            isLoading: false,
          });
        } else if (data.statusCode === 204) {
          toast.update(id, {
            render: "Please try again, Update Failed",
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            type: "error",
            isLoading: false,
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const onOpenDeleteConnectionModal = () => {
    setShowDeleteConnectionModel(!showDeleteConnectionModel);
  };

  const deleteConnectionPopup = (e) => {
    setConnectionName(e);
    onOpenDeleteConnectionModal();
  };

  const onOpenUpdateModal = () => {
    setShowUpdateConnectionModel(!showUpdateModel);
  };

  const updateConnectorPopup = (e) => {
    setConnectionName(e);
    onOpenUpdateModal();
    axios
      .get(
        `${process.env.REACT_APP_UNIVERSAL_CONNECTOR_ENDPOINT}/db-connection/by-connection-name/${e}`
      )
      .then((res) => {
        setUpdateDataFromServer(res.data.data);
      });
  };

  const handleChangeConnection = (e) => {
    setConnectionValue(e.target.value);
    setFormData({
      ...formData,
      connector: `${e.target.value}`,
    });
  };

  const closeAddModal = () => {
    setShowAddModel(false);
    setFormData({});
    setAddConnector({});
  };

  const handleChoiceClick = (e, header, colName) => {
    e.preventDefault();

    if (formData?.columns && [header] in formData?.columns) {
      if (
        formData?.columns &&
        formData?.columns[header] &&
        formData?.columns[header]?.length &&
        formData?.columns[header]?.includes(colName)
      ) {
        if (formData.columns[header].length === 1) {
          let tempTables = formData?.tables?.filter((item) => item !== header);
          let tempColumns = {
            ...formData.columns,
          };

          delete tempColumns[header];

          setFormData((prev) => {
            return {
              ...prev,
              columns: {
                ...tempColumns,
              },
              tables: [...tempTables],
            };
          });
        } else {
          let temp = formData.columns[header].filter(
            (item) => item !== colName
          );
          setFormData((prev) => {
            return {
              ...prev,
              columns: {
                ...prev.columns,
                [header]: [...temp],
              },
            };
          });
        }
      } else {
        if (formData?.columns[header]?.length) {
          setFormData((prev) => {
            return {
              ...prev,
              columns: {
                ...prev.columns,
                [header]: [...prev.columns[header], colName],
              },
            };
          });
        } else {
          setFormData((prev) => {
            return {
              ...prev,
              columns: {
                ...prev.columns,
                [header]: [colName],
              },
              tables: [...prev.tables, header],
            };
          });
        }
      }
    } else {
      const tempColumns = formData?.columns
        ? {
            ...formData?.columns,
            [header]: [colName],
          }
        : {
            [header]: [colName],
          };

      const tempTables = formData?.tables
        ? [...formData?.tables, header]
        : [header];

      setFormData((prev) => {
        return {
          ...prev,
          columns: {
            ...tempColumns,
          },
          tables: [...tempTables],
        };
      });
    }
  };

  const RenderCDCHeader = ({ header, index }) => {
    const getTableColumns = async (e) => {
      e.preventDefault();
      setAddConnector((prev) => {
        return {
          ...prev,
          selectedHeader: prev.selectedHeader === header ? "" : header,
        };
      });

      await axios
        .post(
          `${process.env.REACT_APP_UNIVERSAL_CONNECTOR_ENDPOINT}/connector/table-structure`,
          {
            tables: [header],
            connectionName: formData?.connectionName,
          }
        )
        .then((response) => {
          setAddConnector((prev) => {
            return {
              ...prev,
              table: {
                ...prev.table,
                [header]: [...response.data.data[0].dataModelProperties],
              },
            };
          });
        });
    };

    return (
      <div id={index}>
        <button onClick={(e) => getTableColumns(e)}>{header}</button>
        {addConnector?.selectedHeader === header &&
          addConnector?.table[header]?.map((table) => {
            const checked =
              formData?.columns && formData?.columns[header]?.length
                ? formData?.columns[header].includes(table?.name)
                : false;
            return (
              <div>
                <label className="secondaryColor">{table?.name}</label>
                <input
                  type="checkbox"
                  checked={checked}
                  onClick={(e) => handleChoiceClick(e, header, table?.name)}
                />
              </div>
            );
          })}
      </div>
    );
  };

  const handleHeaderClick = (header) => {
    if (formData?.tables?.includes(header)) {
      const tempTables = formData.tables.filter((item) => item !== header);
      setFormData((prev) => {
        return {
          ...prev,
          tables: [...tempTables],
        };
      });
    } else {
      const tempTables = formData?.tables?.length
        ? [...formData.tables, header]
        : [header];
      setFormData((prev) => {
        return {
          ...prev,
          tables: [...tempTables],
        };
      });
    }
  };

  const RenderJDBCHeader = ({ header }) => {
    const checked = formData?.tables?.includes(header);

    return (
      <div>
        <label className="secondaryColor">{header}</label>
        <input
          type="checkbox"
          checked={checked}
          onClick={(e) => handleHeaderClick(header)}
        />
      </div>
    );
  };

  const RenderConnectorOptions = () => {
    switch (formData?.connectorFamily) {
      case "CDC":
        return (
          <div style={{ display: "grid", gap: "5px", marginTop: "10px" }}>
            {addConnector?.headers?.map((header, index) => (
              <RenderCDCHeader header={header} index={index} />
            ))}
          </div>
        );
      case "JDBC":
        return (
          <div style={{ display: "grid", gap: "5px", marginTop: "10px" }}>
            {addConnector?.headers?.length
              ? addConnector?.headers?.map((header) => (
                  <RenderJDBCHeader header={header} />
                ))
              : null}
          </div>
        );

      default:
        break;
    }
  };

  const handleUseConnection = async (e) => {
    e.preventDefault();

    await axios
      .post(
        `${process.env.REACT_APP_UNIVERSAL_CONNECTOR_ENDPOINT}/connector`,
        formData
      )
      .then((res) => {
        if (res.status === 200) {
          toast.success("Source Connector Added", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          window.location.reload();
        } else {
          toast.error("Please try again", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Internal server error", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
    setShowAddModel(false);
  };

  const handleUseCancel = (e) => {
    e.preventDefault();
    setFormData({});
    setAddConnector({});
  };

  const handleConnectionFamilySwitch = (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      connectorFamily: e.target.value,
    });

    axios
      .get(
        `${process.env.REACT_APP_UNIVERSAL_CONNECTOR_ENDPOINT}/connector/tables/${formData.connectionName}`
      )
      .then((res) => {
        const data = res.data;
        let temp = {};
        data.map((item) => {
          temp = {
            ...temp,
            [item]: [],
          };
        });

        setAddConnector({
          ...addConnector,
          headers: [...data],
          table: { ...temp },
        });
      });
  };

  const closeSinkModal = () => {
    setShowSinkModal(false);
    setSinkConnector({});
    setFormData({});
  };

  const handleAddSinkClick = (name) => {
    setShowSinkModal(true);
    axios
      .get(
        `${
          process.env.REACT_APP_UNIVERSAL_CONNECTOR_ENDPOINT
        }/connector/all-connectors/${localStorage.getItem("workspace")}`
      )
      .then((res) => {
        let data = [];

        res.data.data.forEach((element) => {
          if (element.connectorType === "SOURCE") {
            data = [
              ...data,
              {
                value: element.name,
                text: element.name,
                connectorFamily: element.connectorFamily,
              },
            ];
          }
        });

        data = Array.from(new Set(data));

        setSinkConnector((prev) => {
          return {
            ...prev,
            sources: [...data],
          };
        });
        setFormData({
          connectionName: name,
          connectorType: "SINK",
          userId: "wdfc",
        });
      })
      .catch((e) => console.log(e));
  };

  const getTopics = (source) => {
    axios
      .get(
        `${process.env.REACT_APP_UNIVERSAL_CONNECTOR_ENDPOINT}/connector/topics/${source}`
      )
      .then((res) => {
        const data = [...res.data.data[source]["topics"]];
        setSinkConnector((prev) => {
          return {
            ...prev,
            topics: [...data],
          };
        });
      });
  };

  const handleSinkCancel = () => {
    setShowSinkModal(false);
    setFormData({});
    setSinkConnector({});
  };

  const handleUseSink = () => {
    axios
      .post(
        `${process.env.REACT_APP_UNIVERSAL_CONNECTOR_ENDPOINT}/connector`,
        formData
      )
      .then((res) => {
        if (res.data.data === 200) {
          toast.success("Sink Connector Added", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else if (res.data.data === 409) {
          toast.error("Sink connector with the same name is already present", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        window.location.reload();
      })
      .catch((error) => {
        toast.error("Please try again", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.error(error);
      });
  };

  return (
    <>
      <div>
        <table>
          <thead>
            <tr style={{ border: "0.5px solid white" }}>
              <th className="table-head-name">Connection Name</th>
              <th className="table-head-name">DataBase Name</th>
              <th className="table-head-name">DB User</th>
              <th className="table-head-name">DataBase Type</th>
              <th className="table-head-name">Workspace Name</th>
              <th className="table-head-name">Connection Action</th>
            </tr>
          </thead>
          {connections && connections.length > 0 ? (
            <tbody>
              {connections.map((connection, index) => (
                <tr className="data-row" key={connection.id}>
                  <td className="secondaryColor">
                    {connection.connectionName}
                  </td>
                  <td className="secondaryColor">{connection.dbName}</td>
                  <td className="secondaryColor">{connection.dbUser}</td>
                  <td className="secondaryColor">{connection.connector}</td>
                  <td className="secondaryColor">{connection.workSpaceName}</td>
                  <td className="secondaryColor">
                    <div className="grid-buttons">
                      {/* <button
                        className="connection-button secondaryColor"
                        onClick={() => {
                          // addSource(connection.connectionName);
                          setFormData({
                            ...formData,
                            connectionName: connection.connectionName,
                            connector: connection.connector,
                            connectorType: "SOURCE",
                          });
                          setShowAddModel(true);
                        }}
                      >
                        <img
                          className="button-icon"
                          src={Source}
                          alt="source"
                        />
                        <div>Source</div>
                      </button> */}
                      {loggedInUser.enabled_menus.menus_enabled.includes(
                        "CONNECTOR_EDIT"
                      ) && (
                        <button
                          className="connection-button secondaryColor"
                          onClick={() =>
                            updateConnectorPopup(connection.connectionName)
                          }
                        >
                          {/* <img
                            className="button-icon"
                            src={Update}
                            alt="source"
                          /> */}
                          <Update className="svg-fill iconSvgFillColor" />
                          <div>Update</div>
                        </button>
                      )}
                      {/* <button
                        className="connection-button secondaryColor"
                        onClick={() => {
                          // addSink(connection.connectionName);
                          handleAddSinkClick(connection.connectionName);
                        }}
                      >
                        <img className="button-icon" src={Sink} alt="source" />
                        <div>Sink</div>
                      </button> */}
                      {loggedInUser.enabled_menus?.menus_enabled?.includes(
                        "CONNECTOR_DELETE"
                      ) && (
                        <button
                          className="connection-button secondaryColor"
                          onClick={() =>
                            deleteConnectionPopup(connection.connectionName)
                          }
                        >
                          {/* <img
                            className="button-icon"
                            src={Delete}
                            alt="source"
                          /> */}
                          <Delete className="svg-fill iconSvgFillColor" />
                          <div>Delete</div>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  <div
                    style={{
                      color: "#3c3c3c",
                      fontSize: "14px",
                    }}
                    className="pull-right"
                  >
                    {` 1 to 4 of 20`}{" "}
                    <button
                      style={{
                        color: "#3c3c3c",
                        fontSize: "20px",
                      }}
                      className="bg-transparent"
                    >{`<`}</button>
                    <label className="secondaryColor">&nbsp;&nbsp;&nbsp;</label>
                    <button
                      style={{
                        color: "#3c3c3c",
                        fontSize: "20px",
                      }}
                      className="bg-transparent"
                    >{`>`}</button>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            <div className="no-data-text primaryColor">No Data Available</div>
          )}
        </table>
      </div>
      <CommonModelContainer
        modalTitle="Use Connection as a source"
        show={showAddModel}
        handleClose={closeAddModal}
        centered
        size="md"
        id="create-app-delete-app-model"
      >
        <Modal.Body className="py-4 px-4 create-new-app-modal">
          <form>
            <select
              value={formData.connectorFamily}
              onChange={(e) => {
                handleConnectionFamilySwitch(e);
              }}
            >
              <option value="">Please select a connector family</option>
              <option value="CDC">CDC</option>
              <option value="JDBC">JDBC</option>
            </select>
            {formData?.connectorFamily && <RenderConnectorOptions />}
            {formData.connectorFamily === "JDBC" && (
              <input
                placeholder="Enter Prefix Name"
                value={formData?.topicsPrefix}
                onChange={(e) => {
                  e.preventDefault();
                  setFormData((prev) => {
                    return {
                      ...prev,
                      topicsPrefix: e.target.value,
                    };
                  });
                }}
              />
            )}
            {formData?.connectionName && formData?.tables?.length ? (
              <>
                <button
                  className="primaryButtonColor"
                  onClick={(e) => handleUseConnection(e)}
                >
                  Submit
                </button>
                <button
                  className="secondaryButtonColor"
                  onClick={(e) => handleUseCancel(e)}
                >
                  Cancel
                </button>
              </>
            ) : null}
          </form>
        </Modal.Body>
      </CommonModelContainer>
      <CommonModelContainer
        className="universal-connector-modal"
        modalTitle="Update Connection"
        show={showUpdateModel}
        handleClose={onOpenUpdateModal}
        centered
        size="md"
        id="create-app-delete-app-model"
      >
        <Modal.Body>
          <div className="custom-grid">
            <label className="secondaryColor">
              Connection Name
              <input
                type="text"
                defaultValue={updateDataFromServer.connectionName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    connectionName: e.target.value,
                  })
                }
              />
            </label>
            <label className="secondaryColor">
              DB
              <select
                value={connectionValue}
                defaultValue={updateDataFromServer.connector}
                onChange={handleChangeConnection}
              >
                <option value="MYSQL">MYSQL</option>
                <option value="MONGODB">MONGODB</option>
                <option value="POSTGRES">POSTGRES</option>
              </select>
            </label>
            <label className="secondaryColor">
              Port
              <input
                type="number"
                defaultValue={updateDataFromServer.port}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    port: `${e.target.value}`,
                  })
                }
              />
            </label>
            <label className="secondaryColor">
              Host
              <input
                type="text"
                defaultValue={updateDataFromServer.host}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    host: `${e.target.value}`,
                  })
                }
              />
            </label>
            <label className="secondaryColor">
              DB User
              <input
                type="text"
                defaultValue={updateDataFromServer.dbUser}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dbUser: `${e.target.value}`,
                  })
                }
              />
            </label>
            <label className="secondaryColor">
              DB Password
              <input
                type="password"
                defaultValue={updateDataFromServer.dbPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dbPassword: `${e.target.value}`,
                  })
                }
              />
            </label>
            <label className="secondaryColor">
              DataBase Type
              <input
                type="text"
                defaultValue={updateDataFromServer.dbName}
                onChange={(e) =>
                  setFormData({
                    ...formData,

                    dbName: `${e.target.value}`,
                  })
                }
              />
            </label>
            <label className="secondaryColor">
              Workspace Name
              <input value={localStorage.getItem("workspace")} disabled />
            </label>
            <div className="add-connection-button-wrap">
              <button
                className="add-connection-button primaryButtonColor"
                onClick={() => updateConnection(connectionName)}
              >
                Update Connection
              </button>
              <button
                className="add-connection-cancel secondaryButtonColor"
                onClick={() => setShowUpdateConnectionModel(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal.Body>
      </CommonModelContainer>
      <CommonModelContainer
        modalTitle="Use Connection as a sink"
        show={showSinkModal}
        handleClose={closeSinkModal}
        centered
        size="md"
        id="create-app-delete-app-model"
      >
        <Modal.Body className="py-4 px-4 create-new-app-modal">
          <form>
            <select
              value={sinkConnector?.selectedValue}
              onChange={(e) => {
                sinkConnector?.sources?.forEach((ele) => {
                  if (ele.value === e.target.value) {
                    setFormData((prev) => {
                      return { ...prev, connectorFamily: ele.connectorFamily };
                    });
                  }
                });
                setSinkConnector((prev) => {
                  return {
                    ...prev,
                    selectedValue: e.target.value,
                  };
                });
                getTopics(e.target.value);
              }}
            >
              <option value="">Please select source connector</option>
              {sinkConnector?.sources?.map((source) => {
                return <option value={source.value}>{source.text}</option>;
              })}
            </select>
            {sinkConnector?.selectedValue && (
              <>
                <select
                  value={formData?.topics}
                  onChange={(e) => {
                    setFormData((prev) => {
                      return {
                        ...prev,
                        topics: e.target.value,
                      };
                    });
                  }}
                >
                  <option value="">Please select topics</option>
                  {sinkConnector?.topics?.map((topic) => {
                    return <option value={topic}>{topic}</option>;
                  })}
                </select>
                <input
                  placeholder="Enter Table Name You want to add in DB"
                  value={formData?.tables?.length ? formData?.tables[0] : ""}
                  onChange={(e) =>
                    setFormData((prev) => {
                      return {
                        ...prev,
                        tables: [e.target.value],
                      };
                    })
                  }
                />
                {formData?.tables?.length && (
                  <>
                    <button
                      className="primaryButtonColor"
                      onClick={handleUseSink}
                    >
                      Submit
                    </button>
                    <button
                      className="secondaryButtonColor"
                      onClick={handleSinkCancel}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </>
            )}
          </form>
        </Modal.Body>
      </CommonModelContainer>
      <CommonModelContainer
        modalTitle="Alert"
        show={showDeleteConnectionModel}
        handleClose={onOpenDeleteConnectionModal}
        centered
        size="md"
        id="create-app-delete-app-model"
      >
        <Modal.Body>
          <div className="delete-alert">
            {/* <img src={UniversalConnectorAlert} alt="alert" /> */}
            <UniversalConnectorAlert className="svg-fill iconSvgFillColor" />
            <span className="universal-connector-delete-text-header secondaryColor">
              Delete User?
            </span>
          </div>
          <p className="universal-connector-delete-text secondaryColor">
            Are you sure you want to delete the connection
          </p>
          <div className="add-connection-button-wrap">
            <button
              className="add-connection-cancel no-margin secondaryButtonColor"
              onClick={() => setShowDeleteConnectionModel(false)}
            >
              Cancel
            </button>
            <button
              className="add-connection-button margin primaryButtonColor"
              onClick={() => deleteConnection(connectionName)}
            >
              Confirm
            </button>
          </div>
        </Modal.Body>
      </CommonModelContainer>
    </>
  );
}
