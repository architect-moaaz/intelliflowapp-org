import { useState } from "react";
import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import CommonModelContainer from "../CommonModel/CommonModelContainer";
import Modal from "react-bootstrap/Modal";
import { Col, Dropdown, Row } from "react-bootstrap";
import { useRecoilState } from "recoil";
import { loggedInUserState } from "../../state/atom";
import "./UniversalConnector.css";

export default function ConnectionForm() {
  const [formData, setFormData] = useState({
    userId: "",
    connector: "",
    port: "",
    host: "",
    dbUser: "",
    dbPassword: "",
    dbName: "NOT-REQUIRED",
    connectionName: ``,
    miniAppName: "",
    workSpaceName: localStorage.getItem("workspace"),
  });
  const [message, setMessage] = useState("");
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const [showConnectionForm, setShowConnectionFormModel] = useState(false);
  const [connectorName, setConnectorName] = useState("");

  const onConnectionFormModal = () => {
    setShowConnectionFormModel(!showConnectionForm);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post(
        `${process.env.REACT_APP_UNIVERSAL_CONNECTOR_ENDPOINT}/db-connection/testConnection`,
        formData
      )
      .then((response) => {
        const data = response.data;
        if (data.statusCode === 200) {
          toast.success("Successfully Connected to DB", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          setMessage("");
          axios
            .post(
              `${process.env.REACT_APP_UNIVERSAL_CONNECTOR_ENDPOINT}/db-connection/addConnection`,
              formData
            )
            .then((response) => {
              const data = response.data;
              if (data.statusCode === 409) {
                toast.error(
                  "Connection is already present..Please add another credentials",
                  {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  }
                );
              }
              if (data.statusCode === 200) {
                toast.success("Successfully saved into the db", {
                  position: "bottom-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });

                // window.location.reload();
              }
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
              console.error("Error:", error);
            });
          // };
          // popup.document.body.appendChild(button);
        } else if (data.statusCode === 400) {
          setMessage("bad credentials");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Please try again", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  const handleInputChange = (event) => {
    event.preventDefault();
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const ConnectionFormPopup = (e) => {
    setConnectorName(e);
    onConnectionFormModal();
  };

  console.log(formData);

  return (
    <>
      {loggedInUser.enabled_menus?.menus_enabled?.includes(
        "CONNECTOR_CREATE"
      ) && (
        <button
          className="new-connection-button primaryButtonColor"
          onClick={() => ConnectionFormPopup()}
        >
          Add New Connection
        </button>
      )}
      <CommonModelContainer
        modalTitle="Connection Form"
        show={showConnectionForm}
        handleClose={ConnectionFormPopup}
        centered
        size="md"
        id="create-app-delete-app-model"
        className="universal-connector-modal"
      >
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="custom-grid">
              <label className="secondaryColor">
                Connection Name
                <input
                  type="text"
                  name="connectionName"
                  value={formData.connectionName}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label className="secondaryColor">
                Connection Type
                <select
                  name="connector"
                  value={formData.connector}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">select a value</option>
                  <option value="MYSQL">MYSQL</option>
                  <option value="MONGODB">MONGODB</option>
                  <option value="POSTGRES">POSTGRES</option>
                  <option value="SFTP">SFTP</option>
                </select>
              </label>
              <label className="secondaryColor">
                Port
                <input
                  type="text"
                  name="port"
                  value={formData.port}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label className="secondaryColor">
                Host
                <input
                  type="text"
                  name="host"
                  value={formData.host}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label className="secondaryColor">
                DbUser Name
                <input
                  type="text"
                  name="dbUser"
                  value={formData.dbUser}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label className="secondaryColor">
                Password
                <input
                  type="password"
                  name="dbPassword"
                  value={formData.dbPassword}
                  onChange={handleInputChange}
                  required
                />
              </label>
              {
                  formData?.connector != "SFTP" && 
                  <label className="secondaryColor">
                  DB Name
                  <input
                    type="text"
                    name="dbName"
                    value={formData.dbName}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                }
              <label className="secondaryColor">
                Workspace Name
                <input
                  type="text"
                  name="dbName"
                  value={formData.workSpaceName}
                  disabled
                />
              </label>
              <div className="add-connection-button-wrap">
                <button className="add-connection-button primaryButtonColor">
                  Add Connection
                </button>
                <button
                  className="add-connection-cancel secondaryButtonColor"
                  onClick={() => setShowConnectionFormModel(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
          {message && (
            <tr>
              <td colSpan={2}>
                <p className="secondaryColor" style={{ color: "red" }}>{message}</p>
              </td>
            </tr>
          )}
        </Modal.Body>
        {/* <Modal.Body className="py-4 px-4 create-new-app-modal">
          <div>
            <form onSubmit={handleSubmit}>
              <br />
              <tr>
                <td colSpan={2}>
                  <label>User ID:</label>
                </td>
                <td>
                  <input
                    type="text"
                    name="userId"
                    value={formData.userId}
                    onChange={handleInputChange}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <label>DB:</label>
                </td>
                <td>
                  <select
                    name="connector"
                    className="custom-form-select"
                    value={formData.connector}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a value</option>
                    <option value="MYSQL">MYSQL</option>
                    <option value="MONGODB">MONGODB</option>
                    <option value="POSTGRES">POSTGRES</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <label>Port :</label>
                </td>
                <td>
                  <input
                    type="text"
                    name="port"
                    value={formData.port}
                    onChange={handleInputChange}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <label>Host :</label>
                </td>
                <td>
                  <input
                    type="text"
                    name="host"
                    value={formData.host}
                    onChange={handleInputChange}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <label>DB User :</label>
                </td>
                <td>
                  <input
                    type="text"
                    name="dbUser"
                    value={formData.dbUser}
                    onChange={handleInputChange}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <label>DB Password :</label>
                </td>
                <td>
                  <input
                    type="password"
                    name="dbPassword"
                    value={formData.dbPassword}
                    onChange={handleInputChange}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <label>DB Name :</label>
                </td>
                <td>
                  <input
                    type="text"
                    name="dbName"
                    value={formData.dbName}
                    onChange={handleInputChange}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <label>Workspace Name :</label>
                </td>
                <td>
                  <input
                    type="text"
                    name="dbName"
                    value={formData.workSpaceName}
                    disabled
                  />
                </td>
              </tr>
              {message && (
                <tr>
                  <td colSpan={2}>
                    <p style={{ color: "red" }}>{message}</p>
                  </td>
                </tr>
              )}
              <Row>
                <div className="col-12 mt-4 mb-2 appdesigner-deleteapp-cancel">
                  <button
                    id="delete-app-cancel-btn"
                    className="secondaryButton"
                    onClick={() => setShowConnectionFormModel(false)}
                  >
                    Cancel
                  </button>
                  <button
                    id="delete-app-delete-btn"
                    className="primaryButton"
                    type="submit"
                  >
                    Add Connection
                  </button>
                </div>
              </Row>
            </form>
          </div>
        </Modal.Body> */}
      </CommonModelContainer>
    </>
  );
}
