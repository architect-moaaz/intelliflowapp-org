/* eslint-disable no-undef */
import React, { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import BpmnJS from "bpmn-js/dist/bpmn-navigated-viewer.production.min.js";
// import parser from 'bpmnlint/bin/bpmnlint'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import "./BpmnDesigner.css";
import { LogoIcon } from "../../assets";
import { ReactComponent as GroupIcon } from "../../assets/images/group.svg";
import { ReactComponent as VerifyIcon } from "../../assets/images/verify.svg";
import { ReactComponent as Undo } from "../../assets/NewIcon/Undo.svg";
import { ReactComponent as Redo } from "../../assets/NewIcon/Redo.svg";
import { ReactComponent as Delete } from "../../assets/NewIcon/Delete.svg";
import { ReactComponent as Duplicate } from "../../assets/NewIcon/Duplicate.svg";
import { ReactComponent as Save } from "../../assets/NewIcon/Save.svg";
import { ReactComponent as EditProperties } from "../../assets/NewIcon/EditProperties.svg";
import { ReactComponent as SaveAsADraft } from "../../assets/NewIcon/SaveAsADraft.svg";
import { ReactComponent as Download1 } from "../../assets/NewIcon/Download-1.svg";
import { ReactComponent as Mapping } from "../../assets/NewIcon/Mapping.svg";
import { ReactComponent as Overview } from "../../assets/NewIcon/Overview.svg";
import { ReactComponent as NewDownloadCs } from "../../assets/NewIcon/newDownloadCs.svg";
import axios from "axios";
import BpmnMapping from "../BpmnMapping/BpmnMapping";
import ReactTooltip from "react-tooltip";
import CommonModelContainer from "../CommonModel/CommonModelContainer";
import GroupIconPopUpBpmn from "../Popups/GroupIconPopUpForBpmn/GroupIconPopUpBpmn";
import { useRecoilState } from "recoil";
import {
  openFilesState,
  formbuilderErrorsState,
  isSavingEnabledState,
} from "../../state/atom";
import Errors from "../FormBuilderErrors/Errors";
import useErrorValue from "../hooks/useErrorValues";
import { downloadCs } from "../../assets";
import { autoSave } from "../../state/atom";
import { useTranslation } from "react-i18next";

const BpmnDesigner = ({ data, doGetAllResources, closeFileInTab }) => {
  const [t, i18n] = useTranslation("common");
  const [openFiles, setOpenFiles] = useRecoilState(openFilesState);
  const [editor, setEditor] = useState("");
  const token = localStorage.getItem("token");
  const [open, setOpen] = useState(false);
  const [bpmnSaveDraft, setBpmnSaveDraft] = useState(false);
  const [bpmnComment, setBpmnComment] = useState("");
  const [loadContent, setLoadContent] = useState(true);
  const [showBpmntoFormModel, setShowBpmntoFormModel] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isGroupPopupOpen, setIsGroupPopupOpen] = useState(false);
  const [formbuilderErrors, setFormbuilderErrors] = useRecoilState(
    formbuilderErrorsState
  );
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(
    data.resourceName.replace(/\.[^/.]+$/, "")
  );
  const [saveCount, setSaveCount] = useState(0);
  const { totalErrorsNumber, totalWarningsNumber } = useErrorValue();
  const [isSaving, setIsSaving] = useRecoilState(autoSave);

  const AutosaveFrequency = localStorage.getItem("AutoSaveFrequency");
  const AutoSavefeature =
    localStorage.getItem("AutoSavefeature") == "true" ? true : false;

  const [isSavingEnabled, setSavingEnabled] =
    useRecoilState(isSavingEnabledState);

  const handleButtonClick = () => {
    setOpen(true);
  };

  const openDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const handleSavedraft = () => {
    // setSave(true)
    setBpmnSaveDraft(true);
  };

  const deleteFile = async () => {
    const id = toast.loading("Deleting Work Flow....");
    try {
      const inputJson = {
        workspaceName: localStorage.getItem("workspace"),
        miniAppName: localStorage.getItem("appName"),
        fileName: data.resourceName,
        fileType: "bpmn",
      };
      axios
        .delete(
          process.env.REACT_APP_MODELLER_API_ENDPOINT +
            "modellerService/deleteFile",
          { data: inputJson }
        )
        .then((response) => {
          openDeleteModal();
          doGetAllResources();
          toast.update(id, {
            render: "Deleted Work Flow Successfully!",
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            type: "success",
            isLoading: false,
          });
          const tempFiles = openFiles.filter(
            (item) => item.resourceName !== data.resourceName
          );
          setOpenFiles([...tempFiles]);
        });
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleCall = (BpmnMapping) => {
    setOpen(BpmnMapping);
  };
  const onOpenBpmntoFormModel = () => {
    setShowBpmntoFormModel(!showBpmntoFormModel);
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
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  const params = useQuery();

  // var [diagram, diagramSet] = useState("");

  useEffect(() => {
    const container = document.getElementById(data.resourceName);
    try {
      const postData = {
        workspaceName: localStorage.getItem("workspace"),
        miniAppName: localStorage.getItem("appName"),
        fileName: data.resourceName,
        fileType: "bpmn",
      };
      axios
        .post(
          process.env.REACT_APP_MODELLER_API_ENDPOINT +
            "modellerService/fetchFile/content",
          postData,
          { headers: { "Content-Type": "application/json" } }
        )
        .then(async (r) => {
          var edt = BpmnEditor.open({
            container: container,
            initialContent: Promise.resolve(r.data.data),
            readOnly: false,
          });
          await setEditor(edt);
        })
        .catch((e) => {
          console.log("error BPMN", e);
        });
    } catch (error) {
      console.log();
    }
  }, []);

  const onValidate = async (autoSaveData = false) => {
    let isValid = false;
    var xmlData = await editor.getContent();

    var byteData = convertStringToByteArray(xmlData);
    const inputJson = {
      fileContent: byteData,
    };
    try {
      await axios
        .post(
          process.env.REACT_APP_MODELLER_API_ENDPOINT +
            "modellerService/bpmn/validate",
          inputJson
        )
        .then(async (response) => {
          var ids = await editor.canvas.getNodeIds();

          ids.forEach((e) => {
            editor.canvas.setBorderColor(e, "black");
            editor.canvas.setBackgroundColor(e, "white");
          });

          if (response.data.message == "BPMN Validation Failed") {
            var responseData = response.data.data.data;

            setFormbuilderErrors({
              ...formbuilderErrors,
              workflow: {
                ...formbuilderErrors.workflow,
                [data.resourceName]: { ...responseData },
              },
            });

            if (autoSaveData == false) {
              const id = toast.loading(t("Validating Work Flow...."));
              toast.update(id, {
                render: t("Workflow Validation Failed"),
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
          } else {
            setFormbuilderErrors({
              ...formbuilderErrors,
              workflow: {
                ...formbuilderErrors.workflow,
                [data.resourceName]: {},
              },
            });
            if (autoSaveData == false) {
              const id = toast.loading(t("Validating Work Flow...."));
              toast.update(id, {
                render: t("Workflow Validated"),
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                type: "success",
                isLoading: false,
              });
            }
            isValid = true;
          }
        });
    } catch (error) {
      console.log("error", error);
    }
    return isValid;
  };

  const onSave = async (autoSaveData = false) => {
    const isValid = await onValidate(autoSaveData);
    if (isValid) {
      try {
        const xmlData = await editor.getContent();
        const byteData = convertStringToByteArray(xmlData);
        const inputJson = {
          workspaceName: localStorage.getItem("workspace"),
          miniAppName: localStorage.getItem("appName"),
          fileName: data.resourceName.replace(/\.[^/.]+$/, ""),
          fileType: "bpmn",
          fileContent: byteData,
        };

        const response = await axios.post(
          process.env.REACT_APP_MODELLER_API_ENDPOINT +
            "modellerService/bpmnmodeller/createFile",
          inputJson
        );
        if (response.status === 200) {
          const ids = await editor.canvas.getNodeIds();
          ids.forEach((e) => {
            editor.canvas.setBorderColor(e, "black");
            editor.canvas.setBackgroundColor(e, "white");
          });

          if (autoSaveData == false) {
            const id = toast.loading(t("Saving Workflow...."));
            toast.update(id, {
              render: t("Saved Workflow Successfully!"),
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              type: "success",
              isLoading: false,
            });
          }

          const postData = {
            workspaceName: localStorage.getItem("workspace"),
            miniApp: localStorage.getItem("appName"),
            fileName: data.resourceName,
            fileType: data.resourceType,
            userId: localStorage.getItem("username"),
          };

          await axios.post(
            process.env.REACT_APP_MODELLER_API_ENDPOINT +
              "modellerService/releaseAsset",
            postData
          );

          setSaveCount((prev) => prev + 1);
        }
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  useEffect(() => {
    let autoSaveInterval = null;
    if (isSavingEnabled) {
      console.log("1");
      try {
        if (editor.getContent()) {
          autoSaveInterval = setInterval(() => {
            console.log(" data in editor", editor.getContent());

            renderOnSave();
          }, (AutosaveFrequency ? AutosaveFrequency : 10) * 1000);
        }
      } catch (error) {
        console.log("no data in editor", error);
      }
      return () => clearInterval(autoSaveInterval);
    } else {
      if (autoSaveInterval) clearInterval(autoSaveInterval);
    }
  }, [editor, isSavingEnabled]);

  const renderOnSave = async () => {
    await onSave(true);
  };

  // function useInterval(callback, delay) {
  //   const savedCallback = useRef();

  //   useEffect(() => {
  //     savedCallback.current = callback;
  //   }, [callback]);

  //   useEffect(() => {
  //     function tick() {
  //       savedCallback.current();
  //     }

  //     let id = setInterval(tick, delay);
  //     return () => clearInterval(id);
  //   }, [delay]);
  // }

  // useInterval(function () {
  //   onSave(true);
  //   // onValidate(true)
  // }, 10000);

  const onSaveasDraft = async () => {
    var xmlData = await editor.getContent();

    const id = toast.loading("Saving Work Flow Draft....");
    try {
      var byteData = convertStringToByteArray(xmlData);
      const inputJson = {
        workspaceName: localStorage.getItem("workspace"),
        miniAppName: localStorage.getItem("appName"),
        fileName: data.resourceName.replace(/\.[^/.]+$/, ""),
        comment: bpmnComment,
        fileType: "bpmn",
        fileContent: byteData,
      };
      axios
        .post(
          process.env.REACT_APP_MODELLER_API_ENDPOINT +
            "modellerService/saveAsDraft",
          inputJson
        )
        .then(async (response) => {
          if (response.status === 200) {
            var ids = await editor.canvas.getNodeIds();
            ids.forEach((e) => {
              editor.canvas.setBorderColor(e, "black");
              editor.canvas.setBackgroundColor(e, "white");
            });

            toast.update(id, {
              render: "Saved  Work Flow as draft Successfully!",
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              type: "success",
              isLoading: false,
            });
            const postData = {
              workspaceName: localStorage.getItem("workspace"),
              miniApp: localStorage.getItem("appName"),
              fileName: data.resourceName,
              fileType: data.resourceType,
              userId: localStorage.getItem("username"),
            };
            axios
              .post(
                process.env.REACT_APP_MODELLER_API_ENDPOINT +
                  "modellerService/releaseAsset",
                postData
              )
              .then((res) => {
                setBpmnSaveDraft(false);
              });
          }
        });
    } catch (error) {
      console.log("error", error);
    }
  };

  async function handleSubmitDraft(e) {
    e.preventDefault();
    var data = await editor.getContent();
    var viewer = new BpmnJS({});
    var formElements = [];
    await viewer.importXML(data, async function (err) {
      if (err) {
      } else {
        // <<====== ***** HERE *****
        var elementRegistry = viewer.get("elementRegistry");
        elementRegistry.forEach(async function (elem, gfx) {
          if (elem.businessObject.$instanceOf("bpmn:UserTask")) {
            formElements.push(elem.businessObject.name);
            // do something with the task
          }
        });
        const postData = {
          appName: params.get("id"),
          forElements: formElements,
        };
        axios.post(
          "http://localhost:8080/rest/BPMNprocess/formElements",
          postData
        );
      }
    });
    const postData = { xml: data, fileName: params.get("id") };
    axios
      .post("http://localhost:8080/rest/BPMNprocess/createDraft", postData)
      .then((response) => {
        toast.success("Saved Successfuly", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  }

  const openEditModal = () => {
    setShowEditModal(!showEditModal);
  };

  const EditApi = async () => {
    const id = toast.loading(t("Editing Form Name...."));
    try {
      const inputJson = {
        workspaceName: localStorage.getItem("workspace"),
        miniAppName: localStorage.getItem("appName"),
        fileName: data.resourceName,
        fileType: "bpmn",
        updatedName: editName,
      };
      axios
        .post(
          process.env.REACT_APP_MODELLER_API_ENDPOINT +
            "modellerService/file/rename",
          inputJson
        )
        .then((response) => {
          openEditModal();
          doGetAllResources();
          toast.update(id, {
            render: "Edited Name Successfully!",
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            type: "success",
            isLoading: false,
          });
          closeFileInTab(data);
        });
    } catch (error) {
      console.log("error", error);
    }
  };

  async function handleSubmit(e) {}

  const undo = async () => {
    var temp = await editor.undo();
  };

  const redo = async () => {
    var temp = await editor.redo();
  };

  const downloadBPMN = async (e) => {
    editor.getContent().then((content) => {
      const elem = window.document.createElement("a");
      elem.href =
        "data:text/plain;charset=utf-8," + encodeURIComponent(content);
      elem.download = data.resourceName;
      document.body.appendChild(elem);
      elem.click();
      document.body.removeChild(elem);
      editor.markAsSaved();
    });
    e.preventDefault();
  };

  const handleGroupIconButtonClick = () => {
    setIsGroupPopupOpen(true);
  };

  const handleCallGroupPopup = (MainbodySection) => {
    toast.success(t("generated successfully completed"), {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    setIsGroupPopupOpen(MainbodySection);
  };

  const onErrorModalClose = () => {
    setShowErrorModal(false);
  };

  const onErrorsClick = (e) => {
    e.preventDefault();
    setShowErrorModal(true);
  };

  return (
    <>
      <CommonModelContainer
        modalTitle={`Errors Total : ${totalErrorsNumber}`}
        show={showErrorModal}
        handleClose={onErrorModalClose}
        className="error-modal"
        id="bpmnDesigner-errorsTotal-commonModelContainer"
      >
        <Errors />
      </CommonModelContainer>
      <div className="App">
        {/* <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        /> */}
        {/* <div
          id={data.resourceName}
          style={{
            width: "97%",
            height: "78vh",
            margin: "0",
          }}
        ></div> */}
        <div
          id={data.resourceName}
          style={{
            width: "97%",
            height: "78vh",
            margin: "0",
          }}
        ></div>

        <Col md={10}>
          <Row className="BodyColor">
            <div
              id="bpmnDesigner-footer-error"
              className="bpmndesigner-footer-error"
              style={{ borderBottom: "1px solid #F5F5F5" }}
              onClick={onErrorsClick}
            >
              <span className="secondaryColor">
                {totalErrorsNumber} {t("Errors")}
              </span>
              <span className="secondaryColor"> | </span>
              <span className="secondaryColor">
                {totalWarningsNumber} {t("Warnings")}
              </span>
            </div>
          </Row>
        </Col>
      </div>
      <div className="appdesigner-rightside-menu BodyColor">
        <ul className="appdesigner-rightside-menu-link">
          <li>
            <Link
              to="#"
              id="right-side-edit-properties"
              data-tip
              data-for="EditProperties"
              onClick={openEditModal}
            >
              <EditProperties className="svg-fill iconFillhover iconSvgFillColor" />
            </Link>
            <ReactTooltip
              id="EditProperties"
              place="top"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              {t("Edit Name")}
            </ReactTooltip>
          </li>
          {/* <li>
            <Link  data-tip data-for="EditProperties">
              <Icon icon="akar-icons:edit" />
            </Link>
            <ReactTooltip id="EditProperties" place="top" effect="solid">
              Edit Properties
            </ReactTooltip>
          </li> */}
          <li>
            <Link
              to="#"
              data-tip
              data-for="undo"
              id="bpmnDesigner-undo-link"
              onClick={undo}
            >
              <Undo className="svg-fill iconFillhover iconSvgFillColor" />
            </Link>
            <ReactTooltip
              id="undo"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              {t("undo")}
            </ReactTooltip>
          </li>
          <li>
            <Link
              to="#"
              data-tip
              data-for="redo"
              id="bpmnDesigner-redo-link"
              onClick={redo}
              className="rightsideIcons"
            >
              <Redo className="svg-fill iconFillhover iconSvgFillColor" />
            </Link>
            <ReactTooltip
              id="redo"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              {t("Redo")}
            </ReactTooltip>
          </li>
          <li>
            <Link
              to="#"
              data-tip
              data-for="delete"
              id="bpmnDesigner-delete-link"
              onClick={openDeleteModal}
              className="rightsideIcons"
            >
              <Delete className="svg-fill iconFillhover iconSvgFillColor" />
            </Link>
            <ReactTooltip
              id="delete"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              {t("Delete")}
            </ReactTooltip>
          </li>
          <li>
            <Link
              to="#"
              data-tip
              data-for="copy"
              className="rightsideIcons"
              id="bpmnDesigner-duplicate-link"
            >
              <Duplicate className="svg-stroke-comingSoonIcon" />
            </Link>
            <ReactTooltip
              id="copy"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              {t("comingSoon")}
            </ReactTooltip>
          </li>
          {/* <BpmnMapping ref={childRef} /> */}

          <li>
            {/* <BpmnMapping childFunc={childFunc} /> */}
            <Link
              to="#"
              onClick={() => {
                // childFunc.current()
                data.lockStatus
                  ? data.lockOwner === localStorage.getItem("username")
                    ? onSave()
                    : console.log("Not the owner")
                  : onSave();
              }}
              data-tip
              data-for="save"
              id="bpmnDesigner-save-link"
              className="rightsideIcons"
            >
              <Save className="svg-stroke iconStrokehover iconSvgStrokeColor" />
            </Link>
            <ReactTooltip
              id="save"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              {data.lockStatus
                ? data.lockOwner === localStorage.getItem("username")
                  ? t("Save")
                  : `Locked by ${data.lockOwner}`
                : t("Save")}
            </ReactTooltip>
          </li>
          <li>
            <Link
              to="#"
              onClick={() => onSaveasDraft()}
              // onClick={handleSavedraft}
              data-tip
              data-for="saveDraft"
              id="bpmnDesigner-saveAsDraft-link"
              // style={{ marginBottom: "12px" }}
              className="rightsideIcons"
            >
              <SaveAsADraft className="svg-fill iconFillhover iconSvgFillColor" />
            </Link>
            <ReactTooltip
              id="saveDraft"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              {t("Save As Draft")}
            </ReactTooltip>
          </li>
          <li>
            <Link
              to="#"
              onClick={() => onValidate()}
              data-tip
              data-for="Validate"
              id="bpmnDesigner-validate-link"
              // style={{ marginBottom: "22px" }}
            >
              {/* <img
                src={VerifyIcon}
                alt="play Icon"
                className="rightsideIcons"
              /> */}
              <VerifyIcon className="svg-fill iconFillhover iconSvgFillColor" />
            </Link>
            <ReactTooltip
              id="Validate"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              {t("Validate")}
            </ReactTooltip>
          </li>

          <li>
            <Link
              to="#"
              data-tip
              data-for="Download"
              onClick={(e) => downloadBPMN(e)}
              id="download"
            >
              {/* <img src={downloadCs} className="rightsideIcons" /> */}
              <NewDownloadCs className="svg-stroke iconStrokehover iconSvgStrokeColor rightsideIcons" />
            </Link>
            <ReactTooltip
              id="Download"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              {t("Download")}
            </ReactTooltip>
          </li>

          <li>
            <Link
              to="#"
              onClick={handleButtonClick}
              data-tip
              data-for="Mapping"
              id="bpmnDesigner-mapping-link"
            >
              <Mapping className="svg-fill iconFillhover iconSvgFillColor rightsideIcons" />
            </Link>
            <ReactTooltip
              id="Mapping"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              {t("Mapping")}
            </ReactTooltip>
            <BpmnMapping
              buttonClick={open}
              BpmntoBpmnMapping={handleCall}
              data={data}
              saveCount={saveCount}
              id="bpmnDesigner-BpmnMapping"
            />
          </li>
          {/* <li>
            <Link  data-tip data-for="Generate">
              <img src={GroupIcon} alt="group Icon" />
            </Link>
            <ReactTooltip id="Generate" place="left" className="tooltipCustom" arrowColor="rgba(0, 0, 0, 0)"  effect="solid">
              Generate
            </ReactTooltip>
          </li> */}
          <li>
            <Link
              to="#"
              onClick={handleGroupIconButtonClick}
              data-tip
              data-for="Generate"
              id="bpmnDesigner-group-link"
              className="rightsideIcons"
            >
              {/* <img
                src={GroupIcon}
                alt="group Icon"
                // style={{ height: "40px" }}
              /> */}
              <GroupIcon className="svg-fill iconFillhover iconSvgFillColor" />
            </Link>
            <ReactTooltip id="Generate" place="left" effect="solid">
              {t("Generate")}
            </ReactTooltip>
            <GroupIconPopUpBpmn
              data={data.data}
              buttonClick={isGroupPopupOpen}
              RightSidebarToMainbodySection={handleCallGroupPopup}
              id="bpmnDesigner-GroupIconPopUpBpmn"
            />
          </li>
        </ul>
        <Link
          to="#"
          className="credit-card-link"
          data-tip
          data-for="Overview"
          id="bpmnDesigner-overview-link"
        >
          <Overview className="svg-stroke-comingSoonIcon" />
        </Link>
        <ReactTooltip
          id="Overview"
          place="left"
          className="tooltipCustom"
          arrowColor="rgba(0, 0, 0, 0)"
          effect="solid"
        >
          {t("comingSoon")}
        </ReactTooltip>
        {/* <Link  className="right-logo">
          <span>
            <img src={LogoIcon} alt="Logo" />
          </span>
          <i>V1.1.2</i>
        </Link> */}
      </div>
      <CommonModelContainer
        modalTitle={t("Delete Work Flow")}
        // modalTitle={`Delete  ${data.resourceName.substring(
        //   0,
        //   data.resourceName.length - 5
        // )}`}
        show={showDeleteModal}
        handleClose={openDeleteModal}
        className="deletebpmn-modal"
        id="bpmnDesigner-deleteWorkFlow-CommonModelContainer"
      >
        <h6 className="deletebpmn">
          {t("Do you want to delete")}
          {data.resourceName.substring(0, data.resourceName.length - 5)}{" "}
        </h6>

        <div className=" deletebtn">
          <button
            id="bpmnDesigner-cancel-button"
            className="cancelbpmnsecondaryButton secondaryButtonColor"
            onClick={openDeleteModal}
          >
            {t("Cancel")}
          </button>
          <button
            id="bpmnDesigner-confirm-button"
            onClick={() => deleteFile()}
            className="deletebpmnprimaryButton primaryButtonColor"
          >
            {t("Confirm")}
          </button>
        </div>
      </CommonModelContainer>
      <CommonModelContainer
        modalTitle="Edit Name"
        show={showEditModal}
        handleClose={openEditModal}
        className="edit-modal"
      >
        <div class="application py-2">
          <span className="form-subheading secondaryColor" id="edit-app-title">
            {t("Rename File")} <span className="appdesignerappname">*</span>
          </span>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="appdesignerinput"
            // style={"padding:16px"}
          />
        </div>
        <div className="Delete-popup-bottom-formbuilder">
          <button
            id="delete-file-cancel-btn"
            className="cancelsecondaryButton secondaryButtonColor"
            onClick={openEditModal}
          >
            {t("Cancel")}
          </button>
          <button
            id="delete-file-confirm-btn"
            onClick={() => EditApi()}
            className="deleteprimaryButton primaryButtonColor"
          >
            {t("Confirm")}
          </button>
        </div>
        <p className="warning-text">{t("This action will close the file")}</p>
      </CommonModelContainer>
    </>
  );
};
export default BpmnDesigner;
