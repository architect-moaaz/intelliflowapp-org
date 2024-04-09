import React, { useEffect, useState } from "react";
// import {
//   UniversalConnectorAlert,
//   UniversalConnectorDelete,
//   UniversalConnectorEdit,
// } from "../../assets";
import { ReactComponent as UniversalConnectorAlert } from "../../assets/images/universal-connector-alert-icon.svg";
import { ReactComponent as UniversalConnectorDelete } from "../../assets/images/universal-connector-delete-icon.svg";
import { ReactComponent as UniversalConnectorEdit } from "../../assets/images/universal-connector-edit-icon.svg";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import CommonModelContainer from "../CommonModel/CommonModelContainer";

export default function ListConnectors() {
  const [connectors, setConnectors] = useState([]);
  const [showDeleteModel, setShowDeleteModel] = useState(false);
  const [connectorName, setConnectorName] = useState("");

  useEffect(() => {
    allConnectors();
  }, []);

  async function allConnectors() {
    await axios
      .get(
        `${
          process.env.REACT_APP_UNIVERSAL_CONNECTOR_ENDPOINT
        }/connector/oneclick/all-connectors/${localStorage.getItem(
          "workspace"
        )}`
      )
      .then((res) => {
        setConnectors([...res.data.data]);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  const resumeConnector = (connectionName) => {
    const id = toast.loading("Resuming connector....");
    axios
      .put(
        `${process.env.REACT_APP_UNIVERSAL_CONNECTOR_ENDPOINT}/connector/resume/${connectionName}`
      )
      .then((response) => {
        if (response.data.statusCode === 200) {
          toast.update(id, {
            render: "Resume Connector Successfully",
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            type: "success",
            isLoading: false,
          });
          allConnectors();
        }
      })
      .catch((error) => {
        toast.update(id, {
          render: "Resume Connector Failed",
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

  const deleteConnector = (connectionName) => {
    const id = toast.loading("Deleting connector....");
    axios
      .delete(
        `${process.env.REACT_APP_UNIVERSAL_CONNECTOR_ENDPOINT}/connector/oneclick/${connectionName}`
      )
      .then((res) => {
        setConnectors([]);
        const data = res.data;
        if (data.statusCode === 200) {
          toast.update(id, {
            render: "Deleted Connector Successfully",
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            type: "success",
            isLoading: false,
          });
          allConnectors();
          onOpenDeleteModal();
        } else if (data.statusCode === 400) {
          toast.update(id, {
            render: "Re balance is in progress, please try again.",
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            type: "error",
            isLoading: false,
          });
        } else if (data.statusCode === 404) {
          toast.update(id, {
            render: "No such connection found",
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
      .catch((error) =>
        toast.update(id, {
          render: "Deleted Connector Failed",
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          type: "error",
          isLoading: false,
        })
      );
    setShowDeleteModel(false);
  };

  const pauseConnector = (connectionName) => {
    const id = toast.loading("Pausing connector....");
    axios
      .put(
        `${process.env.REACT_APP_UNIVERSAL_CONNECTOR_ENDPOINT}/connector/pause/${connectionName}`
      )
      .then((response) => {
        if (response.data.statusCode === 200) {
          toast.update(id, {
            render: "Pause Connector Successfully",
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            type: "success",
            isLoading: false,
          });
          allConnectors();
        }
      })
      .catch((error) => {
        toast.update(id, {
          render: "Pause Connector Failed",
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

  const onOpenDeleteModal = () => {
    setShowDeleteModel(!showDeleteModel);
  };

  const deleteConnectorPopup = (e) => {
    setConnectorName(e);
    onOpenDeleteModal();
  };

  return (
    <div>
      <table>
        <thead>
          <tr style={{ border: "0.5px solid white" }}>
            <th className="table-head-name">Connector Name</th>
            <th className="table-head-name">Source Connector Type </th>
            <th className="table-head-name">Table Name</th>
            <th className="table-head-name">Sink Connector State</th>
            <th className="table-head-name">Sink Connector Task Status</th>
            <th className="table-head-name">Source Connector State</th>
            <th className="table-head-name">Source Connector Task Status</th>
            <th className="table-head-name">Status</th>
            <th className="table-head-name">Actions</th>
          </tr>
        </thead>
        {connectors && connectors?.length > 0 ? (
          <tbody>
            {connectors.map((connector) => (
              <tr key={connector.id} className="data-row">
                <td className="secondaryColor">
                  {connector?.sourceConfig?.name}
                </td>
                <td className="secondaryColor">
                  {connector?.sourceConfig?.connector}
                </td>
                <td className="secondaryColor">
                  {connector?.sinkConfig?.tables[0]}
                </td>
                <td className="secondaryColor">
                  {connector?.connectorStatus?.sinkConnectorState}
                </td>
                <td className="secondaryColor">
                  {connector?.connectorStatus?.sinkConnectorTaskStatus}
                </td>
                <td className="secondaryColor">
                  {connector?.connectorStatus?.sourceConnectorState}
                </td>
                <td className="secondaryColor">
                  {connector?.connectorStatus?.sourceConnectorTaskStatus}
                </td>
                <td>
                  <button
                    className="status"
                    onClick={() => {
                      if (
                        connector?.connectorStatus?.sourceConnectorState ===
                        "RUNNING"
                      ) {
                        pauseConnector(connector?.sourceConfig?.name);
                      } else {
                        resumeConnector(connector?.sourceConfig?.name);
                      }
                    }}
                  >
                    {connector?.connectorStatus?.sourceConnectorState}
                  </button>
                </td>
                <td className="secondaryColor">{connector.tasksStatus}</td>
                <td>
                  <div className="connection-buttons-container">
                    <button className="bg-transparent" disabled>
                      {/* <img src={UniversalConnectorEdit} alt="edit" /> */}
                      <UniversalConnectorEdit className="svg-fill iconSvgFillColor" />
                    </button>
                    <button
                      className="bg-transparent"
                      onClick={() => deleteConnectorPopup(connector?.name)}
                    >
                      {/* <img src={UniversalConnectorDelete} alt="delete" /> */}
                      <UniversalConnectorDelete className="svg-fill iconSvgFillColor" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
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
                  <label>&nbsp;&nbsp;&nbsp;</label>
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
      <CommonModelContainer
        modalTitle="Alert"
        show={showDeleteModel}
        handleClose={deleteConnectorPopup}
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
              onClick={() => setShowDeleteModel(false)}
            >
              Cancel
            </button>
            <button
              className="add-connection-button margin primaryButtonColor"
              onClick={() => deleteConnector(connectorName)}
            >
              Confirm
            </button>
          </div>
        </Modal.Body>
      </CommonModelContainer>
    </div>
  );
}
