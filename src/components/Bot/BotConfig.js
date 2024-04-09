import React from "react";
import { Accordion, Dropdown } from "react-bootstrap";
import "./BotConfig.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CommonModelContainer from "../CommonModel/CommonModelContainer";
import { Link, useLocation } from "react-router-dom";
import { Home } from "../../assets";
import Sidebar from "./Sidebar";
import { loggedInUserState } from "../../state/atom";
import { useRecoilState } from "recoil";

const BotConfig = (props) => {
  const [showDeleteModel, setShowDeleteModel] = useState(false);
  const [deleteAccordion, setDeleteAccordion] = useState("");
  const [trainError, setTrainError] = useState();
  const [value, setValue] = useState("");
  const [allBot, setAllBot] = useState("");
  const [show, setShow] = useState(false);
  const location = useLocation();
  const botID = localStorage.getItem("botID");
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);

  // -----------------------------SAVE API--------------------------------------------------------------------
  const getData = (index) => {
    const toastid = toast.loading("Saving....");
    var axios = require("axios");
    var data = JSON.stringify({
      action: "text",
      contexts: ["global"],
      enabled: true,
      answers: {
        en: accordion[index].answers,
      },
      questions: {
        en: accordion[index].questions,
      },
      redirectFlow: "",
      redirectNode: "",
    });

    var config = {
      method: "post",
      url: `http://ns3172713.ip-151-106-32.eu:43000/api/v1/studio/${botID}/qna/questions`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("botToken")}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log("testing", JSON.stringify(response.data));
        toast.update(toastid, {
          render: "Saved Successfully!",
          position: "bottom-right",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          type: "success",
          isLoading: false,
        });
        fetchDataBot();
      })
      .catch(function (error) {
        console.log("error test", error);
        toast.update(toastid, {
          render: error.message,
          position: "bottom-right",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          type: "error",
          isLoading: false,
        });
      });
  };

  // -----------------------------UPDATE API----------------------------------------------------------------

  const update = (index) => {
    const arrayAnswers = accordion[index].answers;
    const updateAnswers = arrayAnswers.filter((e) => e);

    const arrayQuestions = accordion[index].questions;
    const updateQuestions = arrayQuestions.filter((e) => e);
    const toastid = toast.loading("Updating....");
    var axios = require("axios");
    var data = JSON.stringify({
      action: "text",
      contexts: ["global"],
      enabled: true,
      answers: {
        en: updateAnswers,
      },
      questions: {
        en: updateQuestions,
      },
      redirectFlow: "",
      redirectNode: "",
    });

    var id = accordion[index].id;

    var config = {
      method: "post",
      url: `http://ns3172713.ip-151-106-32.eu:43000/api/v1/studio/${botID}/qna/questions/${id}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("botToken")}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log("testing", JSON.stringify(response.data));
        toast.update(toastid, {
          render: "Updated Successfully!",
          position: "bottom-right",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          type: "success",
          isLoading: false,
        });
      })
      .catch(function (error) {
        console.log("error test", error);
        toast.update(toastid, {
          render: error.message,
          position: "bottom-right",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          type: "error",
          isLoading: false,
        });
      });
    // window.location.reload();
  };

  console.log(location, "props");

  // -----------------------------DELETE API----------------------------------------------------------------------

  const deleteQuestion = (index) => {
    console.log("login");
    const toastid = toast.loading("Deleting Q&A....");
    var axios = require("axios");
    var data = JSON.stringify({
      action: "text",
      contexts: ["global"],
      enabled: true,
      answers: {
        en: accordion[index].answers,
      },
      questions: {
        en: accordion[index].questions,
      },
      redirectFlow: "",
      redirectNode: "",
    });
    var id = accordion[index].id;
    var config = {
      method: "POST",
      url: `http://ns3172713.ip-151-106-32.eu:43000/api/v1/studio/${botID}/qna/questions/${id}/delete`,

      headers: {
        Authorization: `Bearer ${localStorage.getItem("botToken")}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        setShowDeleteModel(false);
        console.log("testing", JSON.stringify(response.data));
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
        fetchDataBot();
      })
      .catch(function (error) {
        console.log("error test", error);
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
    // window.location.reload();
    fetchDataBot();
  };

  // -------------------------------TRAIN BOT-----------------------------------------------------------------

  const train = () => {
    var axios = require("axios");
    const toastid = toast.loading("Training Initiated");

    var config = {
      method: "post",
      url: `http://ns3172713.ip-151-106-32.eu:43000/api/v1/bots/${botID}/mod/nlu/train/en`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("botToken")}`,
      },
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        if (response.data === "OK") {
          setTimeout(() => {
            setShow(false);
            toast.update(toastid, {
              render: "Trained Successfully",
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              type: "success",
              isLoading: false,
            });
          }, 5000);
          // } else {
          //   setShow(false);
        }
      })
      .catch(function (error) {
        console.log(error);
        setTrainError(error.message);
        toast.update(toastid, {
          render: "Training Failed",
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

  // -------------------------------------Cancel Training----------------------------------------------------------------------

  const cancelTraining = () => {
    var axios = require("axios");

    var config = {
      method: "post",
      url: `http://ns3172713.ip-151-106-32.eu:43000/api/v1/bots/${botID}/mod/nlu/train/en/delete`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("botToken")}`,
      },
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // -----------------------------------------------------fetching data---------------------------------------

  const [accordion, setAccordion] = useState([
    {
      questions: [""],
      answers: [""],
    },
  ]);
  var defaultAccordion = {
    questions: [""],
    answers: [""],
  };

  var fetchDataBot = () => {
    fetch(
      `http://ns3172713.ip-151-106-32.eu:43000/api/v1/studio/${botID}/qna/questions?limit=50&offset=0&question=`,
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${localStorage.getItem("botToken")}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data, e) => {
        console.log("data Bot", data);
        let temparr = [];
        data.items.map((item) => {
          let arr = {
            id: item.id,
            questions: item.data.questions.en,
            answers: item.data.answers.en,
          };
          temparr.push(arr);
        });
        setAccordion(temparr);
        setAllBot(data.items);
        console.log(data.items);
      })

      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    fetchDataBot();
  }, []);

  const handleAddQuestion = (accordionIndex) => {
    let tempAccordion = [...accordion];
    let updatedQuestions = tempAccordion[accordionIndex].questions;
    updatedQuestions.push("");
    tempAccordion[accordionIndex] = {
      ...tempAccordion[accordionIndex],
      questions: updatedQuestions,
    };
    setAccordion(tempAccordion);
  };
  const handleAddAnswer = (accordionIndex) => {
    let tempAccordion = [...accordion];
    let updatedAnswers = tempAccordion[accordionIndex].answers;
    updatedAnswers.push("");
    tempAccordion[accordionIndex] = {
      ...tempAccordion[accordionIndex],
      answers: updatedAnswers,
    };
    setAccordion(tempAccordion);
  };
  const handleEditQuestion = (accordionIndex, questionIndex, e) => {
    let tempAccordion = [...accordion];
    let updatedQuestions = tempAccordion[accordionIndex].questions;
    updatedQuestions[questionIndex] = e.target.value;
    tempAccordion[accordionIndex] = {
      ...tempAccordion[accordionIndex],
      questions: updatedQuestions,
    };
    setAccordion(tempAccordion);
  };
  const handleEditAnswer = (accordionIndex, answerIndex, e) => {
    let tempAccordion = [...accordion];
    let updatedAnswers = tempAccordion[accordionIndex].answers;
    updatedAnswers[answerIndex] = e.target.value;
    tempAccordion[accordionIndex] = {
      ...tempAccordion[accordionIndex],
      answers: updatedAnswers,
    };
    setAccordion(tempAccordion);
  };
  const handleAddAccordion = () => {
    setAccordion((accordion) => [...accordion, defaultAccordion]);
  };

  const handleSearchQuestion = (q) => {
    setValue(q.target.value);
  };

  // ----------------------------Train popup---------------------------------------------------------------
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const handleBot = () => {
    cancelTraining();
    handleClose();
  };

  // -----------------------------------Delete Popup-----------------------------------------------
  const onOpenDeleteModal = () => {
    setShowDeleteModel(!showDeleteModel);
  };
  const handleDeleteAccordion = (e) => {
    setDeleteAccordion(e);
    onOpenDeleteModal();
  };

  // --------------------------------------import--------------------------
  const [file, setFile] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const onOpenImportModal = () => {
    setShowImportModal(!showImportModal);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImportModal = () => {
    onOpenImportModal();
    // setShowImportModal(true);
  };

  const handleSubmitJson = (e) => {
    // e.preventDefault();
    const toastid = toast.loading("Importing....");
    const formData = new FormData();
    formData.append("file", file);

    fetch(
      `http://ns3172713.ip-151-106-32.eu:43000/api/v1/studio/intelliflow-bot/qna/import`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("botToken")}`,
        },
      }
    )
      .then((response) => {
        setShowImportModal(false);
        setUploaded(true);
        console.log(response);
        toast.update(toastid, {
          render: "Imported Sucessfully",
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          type: "success",
          isLoading: false,
        });
      })
      .catch(function (error) {
        console.log(error);
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
    fetchDataBot();
  };

  const fileCheck = () => {
    if (file && file.type === "application/json") {
      handleSubmitJson();
    } else {
      console.log("not json");
    }
  };

  return (
    <>
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
      <div className="bot_body">
        {/* <div className="breadCrum bot-breadCrum">
        <Link to="/botDashboard">
          <img src={Home} alt="" />
        </Link>
        <h6>{">>"}</h6>
        <Link to="/botDashboard">
          <h6>{botNames}</h6>
        </Link>
       
      </div> */}
        <div className="bot-main">
          <Sidebar />
          <div className="bot-main-container">
            <div className="bot-header">
              <div className="header-menu-left primaryColor">Q&A</div>
              <div className="header-menu-right">
                <span className="secondaryColor">
                  <input
                    type="text"
                    placeholder="Search Question"
                    onChange={handleSearchQuestion}
                  />
                </span>
                <span className="secondaryColor">
                  <Icon
                    className="import-QA"
                    icon="iconoir:import"
                    onClick={() => handleImportModal()}
                  />
                </span>
                {/* <span>
            <Icon className="icons-bot" icon="fe:export" />

          </span> */}
                <span className="secondaryColor">
                  <Icon
                    className="add-bot"
                    icon="bi-plus-circle"
                    onClick={() => handleAddAccordion()}
                  />
                </span>
              </div>
            </div>
            <div className="accordion_body">
              {accordion
                .flat(Infinity)
                .filter((e) =>
                  JSON.stringify(e.questions)
                    .toLowerCase()
                    .includes(value.toLowerCase())
                )
                ?.map((element, accordionIndex) => {
                  // console.log("accordin", element, accordionIndex);
                  return (
                    <Accordion>
                      <Accordion.Item
                        eventKey={accordionIndex}
                        className="accordion_item bot-content"
                      >
                        <div className="header-content">
                          <Accordion.Header className="bot-accordion-header">
                            <div className="bot-Question">
                              {" "}
                              <Icon
                                icon="ic:sharp-keyboard-double-arrow-down"
                                className="accordion-item-dropDown"
                              />
                              {element.questions[0]}
                            </div>
                          </Accordion.Header>
                          <div className="delete-Question">
                            <Dropdown className="dropdown kebabMen">
                              <Dropdown.Toggle
                                variant=""
                                className="p-0 "
                                id="dropdown-basic"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  class="bi bi-three-dots"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                                </svg>
                              </Dropdown.Toggle>
                              <Dropdown.Menu className="qa-dropdown BodyColor">
                                <Dropdown.Item
                                className="secondaryColor"
                                  onClick={() =>
                                    handleDeleteAccordion(accordionIndex)
                                  }
                                >
                                  Delete
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </div>
                        <Accordion.Body className="accordion-content">
                          <Container>
                            <Row>
                              <Col>
                                <div>
                                  <span className="sub-heading secondaryColor">Question</span>
                                  <Row className="questionContent">
                                    {element.questions?.map(
                                      (q, questionIndex) => {
                                        return (
                                          <textarea
                                            value={q}
                                            onChange={(e) =>
                                              handleEditQuestion(
                                                accordionIndex,
                                                questionIndex,
                                                e
                                              )
                                            }
                                            type="text"
                                            className="questionInput inputfield"
                                          />
                                        );
                                      }
                                    )}
                                  </Row>
                                  <div className="add-element">
                                    <span
                                      className="addproperty secondaryColor"
                                      onClick={() =>
                                        handleAddQuestion(accordionIndex)
                                      }
                                    >
                                      + Add Altranate Questions
                                    </span>
                                  </div>
                                </div>
                              </Col>
                              <Col>
                                <div>
                                  <span className="sub-heading secondaryColor">Answers</span>
                                  <Row className="answerContent">
                                    {element.answers &&
                                      element.answers.map((a, answerIndex) => {
                                        return (
                                          <textarea
                                            onChange={(e) =>
                                              handleEditAnswer(
                                                accordionIndex,
                                                answerIndex,
                                                e
                                              )
                                            }
                                            value={a}
                                            type="text"
                                            className="inputfield"
                                            // rows={4} cols={500}
                                          />
                                        );
                                      })}
                                  </Row>
                                  <div className="add-element">
                                    <span
                                      className="addproperty secondaryColor"
                                      onClick={() =>
                                        handleAddAnswer(accordionIndex)
                                      }
                                    >
                                      + Add Altranate Answers
                                    </span>
                                  </div>
                                </div>
                                {accordion[accordionIndex].id ? (
                                  <button
                                    className="primaryButton primaryButtonColor buttonFunctionUpdate"
                                    onClick={() => update(accordionIndex)}
                                  >
                                    Update
                                  </button>
                                ) : (
                                  <button
                                    className="primaryButton primaryButtonColor buttonFunctionUpdate"
                                    onClick={() => getData(accordionIndex)}
                                  >
                                    Save
                                  </button>
                                )}
                              </Col>
                            </Row>
                          </Container>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  );
                })}
            </div>

            <div className="train-button">
              {loggedInUser.enabled_menus?.menus_enabled?.includes(
                "CHATBOT_PUBLISH"
              ) && (
                <div onClick={train}>
                  <button onClick={handleShow} className="primaryButton primaryButtonColor">
                    Train
                  </button>
                </div>
              )}
              <Modal show={show} onHide={handleBot} className="bot-modal">
                <Modal.Header closeButton className="header-main-nav">
                  <Modal.Title>Training</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="training-scanner">
                    <img
                      height={300}
                      width={300}
                      src={require("../../assets/animations/deploymentScanner.gif")}
                      alt="loading..."
                    />
                  </div>
                </Modal.Body>
                <div className="training-footer">
                  <Button
                    className="primaryButton primaryButtonColor training-Cancel"
                    onClick={handleBot}
                  >
                    Cancel
                  </Button>
                </div>
              </Modal>
            </div>
          </div>
        </div>
        <CommonModelContainer
          modalTitle="Delete Q&A"
          show={showDeleteModel}
          handleClose={onOpenDeleteModal}
          centered
          size="md"
        >
          <Modal.Body className="py-4 px-4 create-new-app-modal">
            <div>
              <Row>
                <p className="secondaryColor">
                  Are you sure you want to delete this question? Question and
                  answer alternatives will be deleted as well.
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
                    onClick={() => deleteQuestion(deleteAccordion)}
                  >
                    Delete
                  </button>
                </div>
              </Row>
            </div>
          </Modal.Body>
        </CommonModelContainer>

        <CommonModelContainer
          modalTitle="Import Q&A"
          show={showImportModal}
          handleClose={onOpenImportModal}
          centered
          size="md"
        >
          <Modal.Body className="py-4 px-4 create-new-app-modal">
            <div>
              <form onSubmit={fileCheck}>
                <Row>
                  <input type="file" onChange={handleFileChange} />
                </Row>
                <Row>
                  <div
                    className="col-12 mt-4 mb-2"
                    style={{ display: "flex", justifyContent: "space-evenly" }}
                  >
                    <button
                      className="secondaryButton secondaryButtonColor"
                      onClick={() => setShowImportModal(false)}
                    >
                      Cancel
                    </button>
                    <button className="primaryButton primaryButtonColor" type="submit">
                      Upload
                    </button>
                  </div>
                </Row>
              </form>
            </div>
          </Modal.Body>
        </CommonModelContainer>
      </div>
    </>
  );
};

export default BotConfig;
