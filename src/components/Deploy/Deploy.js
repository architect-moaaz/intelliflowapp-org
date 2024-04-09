import { Modal as ReactResponsiveModal } from "react-responsive-modal";
import {
  Dropdown,
  Row,
  Col,
  Container,
  Form,
  Card,
  DropdownButton,
} from "react-bootstrap";
import { Modal, ModalBody, CloseButton } from "react-bootstrap";
import "./Deploy.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import CommonModelContainer from "../CommonModel/CommonModelContainer";
// import * as BpmnEditor from "@kogito-tooling/kie-editors-standalone/dist/bpmn";
import { formbuilderErrorsState } from "../../state/atom";
import { useRecoilState } from "recoil";
import { getAllResources } from "../../services/fileExploreCom.action";
import { useTranslation } from "react-i18next";
import StepNavigation from "../ApplicationDashboard/stepNavigation";

const Deploy = (props) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [isDeployed, setIsDeployed] = useState(false);
  const [deploymentFailed, setDeploymentFailed] = useState(false);
  const [deploymentState, setDeploymentState] = useState(null);
  const [deploymentStatus, setDeploymentStatus] = useState(null);
  const [deploymentData, setDeloymentData] = useState(null);

  const labelArray = ["Queued", "Initiated", "Building","Deploying"];
  const [currentStep, updateCurrentStep] = useState(1);
  function updateStep(step) {
    updateCurrentStep(step);
  }
  const [stepTextColor, setStepTextColor] = useState("stepTextClass");

  const [appId, setAppId] = useState(null);

  const [formbuilderErrors, setFormbuilderErrors] = useRecoilState(
    formbuilderErrorsState
  );
  const [t, i18n] = useTranslation("common");
  {
    t("mobile");
  }
  const onCloseModal = () => {
    props.closeDeploymentPopup(false);
  };

  const initiateDeployment = async () => {
    const isFilesValid = await validateFiles();
    if (isFilesValid) {
      toast.success(t("Build Initiated Successfully"), {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      const postData = {
        user: localStorage.getItem("username"),
        comment: "Triggered From Studio",
        buildParameters: {
          parameters: [
            { name: "workspace", value: localStorage.getItem("workspace") },
            { name: "appName", value: localStorage.getItem("appName") },
            {name: "user", value: localStorage.getItem("username")}
          ],
        },
      };

      const ansiblePostData = {
        workspaceName: localStorage.getItem("workspace"),
        miniappName: localStorage.getItem("appName")
      };
      axios
        .post(
          process.env.REACT_APP_DEPLOYMENT_API_ENDPOINT +
          "ansible/build/initiate",
          ansiblePostData
        )
        .then((response) => {
          onCloseModal();
          setIsDeploying(true);
          setAppId(response.data.userId);
          checkDeploymentStatus(response.data.userId);
        })
        .catch((error) => {
          toast.error(t("Build couldn't be initiated"), {
            position: "bottom-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    } else {
      toast.error(t("Build couldn't be initiated "), {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      onCloseModal();
    }
  };

  const validateFiles = async () => {
    let result = false;
    toast.success(t("Validating all the files"), {
      position: "bottom-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    const response = await getAllResources();

    // console.log(response.data)

    if (response.data.bpmn[0]) {
      const isBpmnFilesValid = await validateBpmnFiles(response.data.bpmn);
      result = isBpmnFilesValid;
    } else {
      toast.error("Workflow not found", {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      result = false;
    }
    return result;
  };

  const validateBpmnFiles = async (bpmnFiles) => {
    let isBpmnFilesValid = true;
    await Promise.all(
      bpmnFiles.map(async (bpmnFile) => {
        if (isBpmnFilesValid) {
          try {
            let file = bpmnFile.resourceName;
            const postData = {
              workspaceName: localStorage.getItem("workspace"),
              miniAppName: localStorage.getItem("appName"),
              fileName: file,
              fileType: "bpmn",
            };
            await axios
              .post(
                process.env.REACT_APP_MODELLER_API_ENDPOINT +
                  "modellerService/fetchFile/content",
                postData,
                { headers: { "Content-Type": "application/json" } }
              )
              .then(async (res) => {
                let byteData = convertStringToByteArray(res.data.data);
                const inputJson = {
                  fileContent: byteData,
                };

                await axios
                  .post(
                    process.env.REACT_APP_MODELLER_API_ENDPOINT +
                      "modellerService/bpmn/validate",
                    inputJson
                  )
                  .then(async (response) => {
                    if (response.data.message == "BPMN Validation Failed") {
                      var responseData = response.data.data.data;
                      setFormbuilderErrors({
                        ...formbuilderErrors,
                        workflow: {
                          ...formbuilderErrors.workflow,
                          [file]: {
                            ...formbuilderErrors.workflow[file],
                            ...responseData,
                          },
                        },
                      });
                      toast.error(
                        `Workflow Validation Failed for file ${file}`,
                        {
                          position: "bottom-right",
                          autoClose: 4000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          type: "error",
                          isLoading: false,
                        }
                      );
                      isBpmnFilesValid = false;
                    } else {
                      var taskConfig = {
                        method: "post",
                        url: `${process.env.REACT_APP_MODELLER_API_ENDPOINT}modellerService/bpmnmodeller/getData`,
                        headers: {
                          "Content-Type": "application/json",
                        },
                        data: {
                          workspaceName: localStorage.getItem("workspace"),
                          miniAppName: localStorage.getItem("appName"),
                          fileName: file,
                          fileType: "bpmn",
                        },
                      };

                      await axios(taskConfig).then(async (response) => {
                        let bpmnFileTasks = [
                          {
                            id: 518413841,
                            name: "Process Task",
                            type: "PT",
                          },
                          ...response.data.data.userTask,
                        ];

                        var tasksMappedConfig = {
                          method: "get",
                          url:
                            process.env.REACT_APP_MODELLER_API_ENDPOINT +
                            "modellerService/workflow/mapping/" +
                            localStorage.getItem("workspace") +
                            "/" +
                            localStorage.getItem("appName"),
                          headers: {},
                        };

                        await axios(tasksMappedConfig).then((response) => {
                          let mappedTasks = [...response.data.data];

                          let temp = bpmnFileTasks.map((task) => {
                            if (task.type === "PT") {
                              let mappedSuccess = mappedTasks.some(
                                (mappedTask) =>
                                  mappedTask.tasktype === task.type
                              );

                              if (!mappedSuccess) {
                                return task;
                              }
                            } else {
                              let mappedSuccess = mappedTasks.some(
                                (mappedTask) =>
                                  mappedTask.taskname === task.name
                              );

                              if (!mappedSuccess) {
                                return task;
                              }
                            }
                          });

                          let unMappedTasks = temp.filter(
                            (item) => item !== undefined
                          );

                          if (unMappedTasks[0]) {
                            const errors = unMappedTasks.map((item) => {
                              return {
                                ...item,
                                message: {
                                  string: `The task name: ${item.name} in Workflow: ${file} is not mapped to any form`,
                                },
                              };
                            });
                            setFormbuilderErrors({
                              ...formbuilderErrors,
                              workflow: {
                                ...formbuilderErrors.workflow,
                                [file]: {
                                  ...formbuilderErrors.workflow[file],
                                  unMappedTasksErrors: [...errors],
                                },
                              },
                            });

                            toast.error(
                              `Workflow Validation Failed for file ${file}`,
                              {
                                position: "bottom-right",
                                autoClose: 4000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                type: "error",
                                isLoading: false,
                              }
                            );
                            isBpmnFilesValid = false;
                          } else {
                            setFormbuilderErrors({
                              ...formbuilderErrors,
                              workflow: {
                                ...formbuilderErrors.workflow,
                                [file]: {},
                              },
                            });
                            toast.success(
                              `Workflow Validation success for file ${file}`,
                              {
                                position: "bottom-right",
                                autoClose: 4000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                isLoading: false,
                              }
                            );
                          }
                        });
                      });
                    }
                  });
              });
          } catch (error) {
            console.log("error", error);
            isBpmnFilesValid = false;
          }
        }
      })
    );
    return isBpmnFilesValid;
  };

  const convertStringToByteArray = (str) => {
    String.prototype.encodeHex = function () {
      var bytes = [];
      for (var i = 0; i < this.length; ++i) {
        bytes.push(this.charCodeAt(i));
      }
      return bytes;
    };

    var byteArray = str.encodeHex();
    return byteArray;
  };

  const checkDeploymentStatus = (id) => {
    let intervalId = setInterval(() => {
      var axios = require("axios");

      var config = {
        method: "get",
        url: `${process.env.REACT_APP_DEPLOYMENT_API_ENDPOINT}ansible/build/status/${id}`,
        headers: {},
      };

      axios(config)
        .then(function (response) {
          setDeploymentState(response.data.status);
          setDeploymentStatus(response.data.status);
          if (response.data.status == "COMPLETED" || response.data.status == "FAILED") {
            clearInterval(intervalId);
            changeDeploymentModal(response.data.status);
            setDeloymentData(response.data.errorLog);
            updateStep(5);
          }
          else 
          if (response.data.status == "QUEUED") {
            updateStep(1);
          }
          if (response.data.status == "INITIATED") {
            updateStep(2);
          }
          if (response.data.status == "BUILDING") {
            updateStep(3);
          }
          if (response.data.status == "DEPLOYING") {
            updateStep(4);
          }

        })
        .catch(function (error) {
          console.log(error);
        });
    }, 3000);
  };

  const changeDeploymentModal = (deploymentStatus) => {
    setIsDeploying(false);
    if (deploymentStatus === "FAILED") {
      setIsDeployed(false);
      setDeploymentFailed(true);
      
    } else if (deploymentStatus === "COMPLETED") {
      setIsDeployed(true);
    }
  };

  const deploymentInProgressModal = () => {
    return (
      <Modal
        show={isDeploying}
        animation={false}
        centered
        onHide={() => setIsDeploying(false)}
        backdrop="static"
        id="deploy-isDeploying-Modal"
        className="deployment-progress-modal"
      >
        <ModalBody>
          <>
            <Row className="my-2">
              <Col className="deploy-loading">
                <img
                  height={200}
                  width={200}
                  src={require("../../assets/animations/deploymentScanner.gif")}
                  alt="loading..."
                />
              </Col>
            </Row>
            <Row className="my-2">
              <Col className="deploy-loading">
                {/* <h3>For progess bar</h3> */}
              </Col>
            </Row>
            <Row className="mt-5 mb-3">
              <Col className="deploy-loading">
                {/* <h3>{applicationName}</h3> */}
                <h3 className="primaryColor">
                  {localStorage.getItem("displayName")}
                </h3>
              </Col>
            </Row>
            <Row>
              <Col>
              <StepNavigation
                    labelArray={labelArray}
                    currentStep={currentStep}
                    updateStep={updateStep}
                    fontcolortype={stepTextColor}
                  ></StepNavigation>
              </Col>
            </Row>
            {/* <Row className="my-2">
              <Col className="deploy-loading">
                <button
                  id="deploy-cancel-button"
                  className="primaryButton"
                  onClick={() => setIsDeploying(false)}
                >
                  Cancel
                </button>
              </Col>
            </Row> */}
          </>
        </ModalBody>
      </Modal>
    );
  };

  const deploymentSuccessfullModal = () => {
    return (
      <Modal
        show={isDeployed}
        animation={false}
        size="md"
        centered
        onHide={() => setIsDeployed(false)}
        id="deploy-isDeployed-Modal"
      >
        <ModalBody>
          <>
            <Row className="my-2">
              <Col className="deploy-loading">
                <img
                  height={200}
                  width={200}
                  src={require("../../assets/animations/deploymentSuccess.gif")}
                  alt="loading..."
                />
              </Col>
            </Row>
            <Row className="mt-5 mb-3">
              <Col className="deploy-loading">
                <h4 className="primaryColor">{t("Heads Up!")}</h4>
              </Col>
            </Row>
            <Row className="my-2">
              <Col className="deploy-loading">
                <h3 className="primaryColor">
                  {localStorage.getItem("displayName")} is live now...
                </h3>
              </Col>
            </Row>
          </>
        </ModalBody>
      </Modal>
    );
  };

  const deploymentFailedModal = () => {
    return (
      <CommonModelContainer
        modalTitle={localStorage.getItem("displayName")}
        show={deploymentFailed}
        handleClose={() => setDeploymentFailed(false)}
        className="accessibility-modal"
        id="deploy-accessibility-Modal"
        animation={false}
        style={{ backgroundColor: "#f8f8f8", borderRadius: "10px" }}
      >
        {/* <Modal
        show={deploymentFailed}
        animation={false}
        size="xl"
        centered
        dialogClassName="modal-10w"
        // handleClose={() => setDeploymentFailed(false)}
        // onHide={() => setDeploymentFailed(false)}
        backdrop="static"
      >
         */}
        {/* <Modal.Body> */}

        {/* <div className="deployfail">
          <CloseButton onClick={() => setDeploymentFailed(false)} variant="white" />
        </div> */}

        <Container className="my-2">
          <Row className="my-2">
            <Col className="deploy-failerrormodal">
              {/* <h3>{localStorage.getItem("appName")}</h3> */}
            </Col>
          </Row>
          <Row className="my-2">
            <Col className="deploy-failerrormodal">
              <p className="deploy-errormessage secondaryColor">
                The app could not be published due to following validation
                errors.
              </p>
            </Col>
          </Row>
          <Row className="my-3">
            <Container>
              {/* <Row
                style={{
                  backgroundColor: "#0D3C84",
                  borderRadius: "4px",
                  color: "#fff",
                }}
                className="py-2 px-2 my-1"
              >
                <Col md={2}>
                  <h6>Asset Name</h6>
                </Col>
                <Col md={2}>
                  <h6>Date & Time</h6>
                </Col>
                <Col md={2}>
                  <h6>Edited By</h6>
                </Col>
                <Col md={3}>
                  <h6>Error</h6>
                </Col>
                <Col md={3}>
                  <h6>Suggestions</h6>
                </Col>
              </Row>

               {errorData.length !== 0 &&
                errorData.map((error) => {
                  console.log("error", error);
                  return (
                    <Row className="py-2 px-2 my-1 errorItem">
                      <Col md={2}>
                        <h6>{error.assetName}</h6>
                      </Col>
                      <Col md={2}>
                        <h6>{error.dateTime}</h6>
                      </Col>
                      <Col md={2}>
                        <h6>{error.editedBy}</h6>
                      </Col>
                      <Col md={3}>
                        <h6>{error.error.substring(0, 25)}...</h6>
                      </Col>
                      <Col md={3}>
                        <h6>{error.suggestions.substring(0, 25)}...</h6>
                      </Col>
                    </Row>
                  );
                })}  */}

              {deploymentData !== null && (
                <div className="customScrollBar deploydata">
                  <pre className="deploy-pre">{deploymentData}</pre>
                </div>
              )}
            </Container>
          </Row>
          <Row className="mt-4 mb-2 deploy-loading">
            <Col md={6} className="deploy-datalogs">
              {/* <button
                  className="secondaryButton"
                  onClick={() => setDeploymentFailed(false)}
                >
                  Cancel
                </button>
                <button className="primaryButton">Errors & Warnings</button> */}
            </Col>
          </Row>
        </Container>
        {/* </Modal.Body> */}
        {/* </Modal> */}
      </CommonModelContainer>
    );
  };

  return (
    <>
      <ReactResponsiveModal
        open={props.showDeployment}
        onClose={onCloseModal}
        center
        id="deploy-closeModal-ReactResponsiveModal"
      >
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <h5 className="textalign">
              Deploy {localStorage.getItem("displayName")}
            </h5>
          </Col>
          <div className="d-flex justify-content-evenly">
            <button
              onClick={onCloseModal}
              className="secondaryButton secondaryButtonColor"
              id="deploy-modalCancel-button"
            >
              {t("Cancel")}
            </button>

            <button
              onClick={initiateDeployment}
              className="primaryButton primaryButtonColor"
              id="deploy-deploy-button"
            >
              {t("Deploy")}
            </button>
          </div>
        </Row>
      </ReactResponsiveModal>

      {deploymentInProgressModal()}
      {deploymentSuccessfullModal()}
      {deploymentFailedModal()}
    </>
  );
};
export default Deploy;
