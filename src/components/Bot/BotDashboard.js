import React from "react";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { Breadcrumb, Tab, Nav, Dropdown, Image } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import "./BotDashboard.css";
import { ReactComponent as EditIcon } from "../../../src/assets/Icons/edit-icon.svg";
import { ReactComponent as DeleteIco } from "../../../src/assets/NewIcon/deleteAppIcon.svg";
import Modal from "react-bootstrap/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CommonModelContainer from "../CommonModel/CommonModelContainer";
import { loggedInUserState } from "../../state/atom";
import { useRecoilState } from "recoil";

const BotDashboard = ({ setheaderTitle }) => {
  setheaderTitle("Chatbot Builder");
  const [showDeleteModel, setShowDeleteModel] = useState(false);
  const [showCreateBotModel, setShowCreateBotModel] = useState(false);
  const [deleteBots, setDeleteBots] = useState("");
  const [allBots, setAllBots] = useState([]);
  const [botID, setBotID] = useState([]);
  const [botNames, setBotNames] = useState("");
  const [botCreateId, setBotCreateId] = useState("");

  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);

  // -----------------fetch bot APi---------------------------------------------------------

  var fetchAllBot = () => {
    fetch(
      "http://ns3172713.ip-151-106-32.eu:43000/api/v2/admin/workspace/bots",
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${localStorage.getItem("botToken")}`,
          "X-BP-Workspace": "default",
        },
      }
    )
      .then((response) => response.json())

      .then((data) => {
        setAllBots(data.payload.bots);
        const botWorkplace = data.payload.bots;

        const botids = botWorkplace.map((e) => e.id);
        setBotID(botids);
        console.log("botIDs", botids);
      })

      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    fetchAllBot();
    console.log("botIDs", botID);
  }, []);

  // console.log(botID, "bot id");

  // --------------------------------delete bot API------------------------------------------------

  const onOpenDeleteModal = () => {
    setShowDeleteModel(!showDeleteModel);
  };

  const handleDeleteBot = (e) => {
    setDeleteBots(e);
    onOpenDeleteModal();
  };
  console.log("ttttt", localStorage.getItem("botToken"));

  const deleteBot = (index) => {
    console.log("idtest", botID);
    const toastid = toast.loading("Deleting Bot....");
    var axios = require("axios");
    var id = allBots[index].id;
    var botToken = localStorage.getItem("botToken");

    var config = {
      method: "POST",
      url: `http://ns3172713.ip-151-106-32.eu:43000/api/v2/admin/workspace/bots/${id}/delete`,

      headers: {
        Authorization: `Bearer ${localStorage.getItem("botToken")}`,
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then(function (response) {
        setShowDeleteModel(false);
        // console.log("testing", JSON.stringify(response.data));
        toast.update(toastid, {
          render: "Deleted Successfully!",
          position: "bottom-right",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          type: "success",
          isLoading: false,
        });
        fetchAllBot();
      })
      .catch(function (error) {
        // console.log("error test", error);
        toast.update(toastid, {
          render: error.message,
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          type: "error",
          isLoading: false,
        });
      });
  };

  // -------------------------------create bot---------------------------------------------------
  const handleCreateBot = () => {
    onOpenCreateBotModal();
  };
  const onOpenCreateBotModal = () => {
    setShowCreateBotModel(!showCreateBotModel);
    setBotCreateId("");
    setBotNames("");
    setError("");
  };

  const [error, setError] = useState(null);

  const createBot = () => {
    var axios = require("axios");
    var data = {
      id: botCreateId,
      name: botNames,
      template: {
        id: "empty-bot",
        moduleId: "builtin",
      },
    };

    var config = {
      method: "post",
      url: "http://ns3172713.ip-151-106-32.eu:43000/api/v2/admin/workspace/bots",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("botToken")}`,
        "Content-Type": "application/json; charset=utf-8",
        "X-BP-Workspace": "default",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        setShowCreateBotModel(false);
        console.log(JSON.stringify(response.data));
        console.log("all bots", response);
        fetchAllBot();
      })
      .catch(function (error) {
        console.log(error.message, "error");
        setError(error.message);
      });
  };

  const history = useHistory();
  const handleClick = (botID) => {
    localStorage.setItem("botID", botID);
    history.push({
      pathname: "/botDashboard/botConfig",
    });
    setBotNames("");
    setBotCreateId("");
    setError("");
  };

  return (
    <>
      {" "}
      {/* <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      /> */}
      <div>
        <div className="userManagement_body">
          <Tab.Container id="left-tabs-example" defaultActiveKey="first">
            <Nav variant="pills" className="usermanagement_pills">
              {/* <Nav.Item>
                <Nav.Link eventKey="first">Manage Account</Nav.Link>
              </Nav.Item> */}
              <Nav.Item>
                <Nav.Link eventKey="first">ChatBot Builder</Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="first">
                <div>
                  <div>
                    {loggedInUser.enabled_menus?.menus_enabled?.includes(
                      "CHATBOT_EDIT"
                    ) && (
                      <div className="createBot-element BodyColor">
                        <div
                          className="createBot-button"
                          onClick={() => handleCreateBot()}
                        >
                          <h5 className="primaryColor">
                            <Icon
                              className="createBot-icon"
                              icon="bi-plus-circle"
                            />
                            <span className="secondaryColor">Create Bot</span>
                          </h5>
                        </div>
                      </div>
                    )}
                    <div className="allBots">
                      <div className="yourBots">
                        <h3 className="primaryColor">Your Bots</h3>
                      </div>
                      <div className=" all-bot-details">
                        {allBots?.map((bot, index) => {
                          return (
                            <div className="bots-details col-3">
                              <div>
                                <span className="secondaryColor">
                                  <div className="bots-details-left">
                                    {" "}
                                    {bot.name}
                                  </div>
                                  <div className="bots-details-right">
                                    <Link
                                      to="#"
                                      onClick={() => handleClick(bot.id)}
                                    >
                                      {/* <img src={EditIcon} /> */}
                                      <EditIcon className="svg-fill iconSvgFillColor" />
                                    </Link>
                                    <Link to="#">
                                      {/* <img
                                        src={DeleteIco}
                                        onClick={() => handleDeleteBot(index)}
                                      /> */}
                                      <DeleteIco
                                        className="svg-fill iconSvgFillColor"
                                        style={{
                                          height: "20px",
                                          width: "20px",
                                          marginLeft: "15px",
                                        }}
                                      />
                                    </Link>
                                  </div>
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
        <CommonModelContainer
          modalTitle="Delete Bot"
          show={showDeleteModel}
          handleClose={onOpenDeleteModal}
          centered
          size="md"
        >
          <Modal.Body className="py-4 px-4 create-new-app-modal">
            <div>
              <Row>
                <p className="secondaryColor" style={{ fontFamily: "lato" }}>
                  Are you sure you want to delete this bot? This can't be
                  undone.
                </p>
              </Row>
              <Row>
                <div
                  className="col-12 mt-4 mb-2"
                  style={{ display: "flex", justifyContent: "space-evenly" }}
                >
                  <button
                    className="secondaryButton secondaryButtonColor"
                    onClick={() => setShowDeleteModel(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="primaryButton primaryButtonColor"
                    onClick={() => deleteBot(deleteBots)}
                  >
                    Delete
                  </button>
                </div>
              </Row>
            </div>
          </Modal.Body>
        </CommonModelContainer>
        <CommonModelContainer
          modalTitle="Create Bot"
          show={showCreateBotModel}
          handleClose={onOpenCreateBotModal}
          centered
          size="md"
        >
          <Modal.Body className="py-4 px-4 ">
            <div className="create-bot-popup">
              <Row>
                <span className="secondaryColor">
                  Bot Name <span style={{ color: "#FF5711" }}>*</span>
                </span>
                <input
                  type="text"
                  required
                  value={botNames}
                  onChange={(e) => setBotNames(e.target.value)}
                  placeholder="The name of your bot"
                />
                {/* <p>
                Are you sure you want to delete this bot? This can't be undone.
                </p> */}
              </Row>
              <Row>
                <span className="secondaryColor">
                  Bot Id <span style={{ color: "#FF5711" }}>*</span>
                </span>
                <input
                  type="text"
                  required
                  value={botCreateId}
                  onChange={(e) => setBotCreateId(e.target.value)}
                  placeholder="The ID of your bot (must be unique)"
                />
                <p className="secondaryColor">
                  This ID cannot be changed, so choose wisely. Special
                  characters are not allowed. <p>Length: between 3 and 50</p>
                </p>
              </Row>
              {/* <Row>
                <span>Bot Template</span>
                <select>
                  <option value="someOption">Some option</option>
                  <option value="otherOption">Other option</option>
                </select>
              </Row> */}
              {error && (
                <p
                  className="secondaryColor"
                  style={{ color: "red", paddingLeft: "12px" }}
                >
                  {" "}
                  Bot ID Already Exist
                </p>
              )}
              <Row>
                <div
                  className="col-12 mt-4 mb-2"
                  style={{ display: "flex", justifyContent: "space-evenly" }}
                >
                  <button
                    className="secondaryButton secondaryButtonColor"
                    onClick={() => setShowCreateBotModel(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="primaryButton primaryButtonColor"
                    onClick={() => createBot()}
                  >
                    Create
                  </button>
                </div>
              </Row>
            </div>
          </Modal.Body>
        </CommonModelContainer>
      </div>
    </>
  );
};

export default BotDashboard;
