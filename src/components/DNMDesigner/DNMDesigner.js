/* eslint-disable no-undef */
import React, { useEffect, useState, useRef } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation,
} from "react-router-dom";
// import * as BpmnEditor from "@kogito-tooling/kie-editors-standalone/dist/dmn";
import BpmnJS from "bpmn-js/dist/bpmn-navigated-viewer.production.min.js";
// import parser from 'bpmnlint/bin/bpmnlint'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Icon } from "@iconify/react";
import { ReactComponent as EditProperties } from "../../assets/NewIcon/EditProperties.svg";
import { ReactComponent as Undo } from "../../assets/NewIcon/Undo.svg";
import { ReactComponent as Redo } from "../../assets/NewIcon/Redo.svg";
import { ReactComponent as Delete } from "../../assets/NewIcon/Delete.svg";
import { ReactComponent as Duplicate } from "../../assets/NewIcon/Duplicate.svg";
import { ReactComponent as Save } from "../../assets/NewIcon/Save.svg";
import { ReactComponent as SaveAsADraft } from "../../assets/NewIcon/SaveAsADraft.svg";
import { ReactComponent as Preview } from "../../assets/NewIcon/Preview.svg";
import { ReactComponent as Download1 } from "../../assets/NewIcon/Download-1.svg";
import { ReactComponent as Mapping } from "../../assets/NewIcon/Mapping.svg";
import { ReactComponent as Overview } from "../../assets/NewIcon/Overview.svg";
import { ReactComponent as GroupIcon } from "../../assets/NewIcon/GroupIcon.svg";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import {
  LogoIcon,
  PlayIcon,
  MapIcon,
  downloadCs,
  generateIco,
} from "../../assets";
import CommonModelContainer from "../CommonModel/CommonModelContainer";
import { useRecoilState } from "recoil";
import { openFilesState, isSavingEnabledState } from "../../state/atom";
import { Col, Row } from "react-bootstrap";
import DNMmapping from "../DNMDesigner/DNMmapping";

import DmnModdle from "dmn-moddle";
import axios from "axios";
import { autoSave } from "../../state/atom";
import { useTranslation } from "react-i18next";
const moddleBuilder = new DmnModdle();

const DNMDesigner = ({ data, doGetAllResources, closeFileInTab }) => {
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  const [t, i18n] = useTranslation("common");
  const params = useQuery();
  const [open, setOpen] = useState(false);
  const [dnmSaveDraft, setDnmSaveDraft] = useState(false);
  const [dnmComment, setDnmComment] = useState("");
  const [editor, setEditor] = useState("");
  var [diagram, diagramSet] = useState("");
  const [openFiles, setOpenFiles] = useRecoilState(openFilesState);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(
    data.resourceName.replace(/\.[^/.]+$/, "")
  );

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
    setDnmSaveDraft(true);
  };

  const deleteFile = async () => {
    const id = toast.loading("Deleting Bussiness Rules....");
    try {
      const inputJson = {
        workspaceName: localStorage.getItem("workspace"),
        miniAppName: localStorage.getItem("appName"),
        fileName: data.resourceName,
        fileType: "dmn",
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
            render: "Deleted Bussiness Rules Successfully!",
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
    } catch (err) {
      console.log("error", err);
    }
  };

  const handleCall = (DNMmapping) => {
    setOpen(DNMmapping);
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

  useEffect(() => {
    const container = document.getElementById(data.resourceName);

    if (diagram.length === 0) {
      try {
        const postData = {
          workspaceName: localStorage.getItem("workspace"),
          miniAppName: localStorage.getItem("appName"),
          fileName: data.resourceName,
          fileType: "dmn",
        };
        axios
          .post(
            process.env.REACT_APP_MODELLER_API_ENDPOINT +
              "modellerService/fetchFile/content",
            postData,
            { headers: { "Content-Type": "application/json" } }
          )
          .then(async (r) => {
            diagramSet(r.data.data);
            // diagramSet(r.data.data);
            // if (r.data.data.length > 0 || r.data.data == "") {
            if (diagram == "NoData") diagram = "";

            // setLoadContent(false)
            var dmnData = r.data.data;
            if (!dmnData) {
              var appName =
                localStorage.getItem("appName") +
                "_" +
                data.resourceName.replace(/\.[^/.]+$/, "");
              var root = "dmn:Definitions";
              const definitions = moddleBuilder.create("dmn:Definitions", {
                name: appName,
                namespace: "https://intelliflow.io/dmn/" + appName,
              });
              const { xml } = await moddleBuilder.toXML(definitions, root);

              dmnData = xml;
            }
            var edt = DmnEditor.open({
              container: container,
              initialContent: Promise.resolve(dmnData),
              readOnly: false,
            });
            setEditor(edt);
            // editor.subscribeToContentChanges(changeincontent);
          })
          .catch((e) => {
            console.log("error-file-content", e);
          });
      } catch (error) {
        console.log();
      }
    }
  }, [diagram]);

  async function changeincontent(e) {
    var viewer = new BpmnJS({});
    var xml = await editor.getContent();

    viewer.importXML(xml, async function (err) {
      // const {
      //   error: importError,
      //   warnings: importWarnings,
      //   moddleElement
      // } = await parser.parseDiagram(xml);

      if (err) {
      } else {
        // <<====== ***** HERE *****
        var elementRegistry = viewer.get("elementRegistry");
        elementRegistry.forEach(function (elem, gfx) {
          if (elem.businessObject.$instanceOf("bpmn:UserTask")) {
            // do something with the task
          }
        });
      }
    });
  }

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
        toast.success("Saved Successfully", {
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

  const onSave = async (isautoSave = false) => {
    setIsSaving(true);
    var xmlData = await editor.getContent();
    try {
      var byteData = convertStringToByteArray(xmlData);

      const inputJson = {
        workspaceName: localStorage.getItem("workspace"),
        miniAppName: localStorage.getItem("appName"),
        fileName: data.resourceName.replace(/\.[^/.]+$/, ""),
        fileType: "dmn",
        fileContent: byteData,
      };

      axios
        .post(
          process.env.REACT_APP_MODELLER_API_ENDPOINT +
            "modellerService/dmnmodeller/createFile",
          inputJson
        )
        .then((response) => {
          setIsSaving(false);
          if (isautoSave == false) {
            const id = toast.loading(t("Saving Bussiness Rules...."));
            toast.update(id, {
              render: t("Saved Successfully!"),
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
          axios
            .post(
              process.env.REACT_APP_MODELLER_API_ENDPOINT +
                "modellerService/releaseAsset",
              postData
            )
            .then((res) => console.log(res));
        });
    } catch (error) {
      console.log("error", error);
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

  const renderOnSave = async() => {
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
  // }, 10000);

  const onSaveasDraft = async () => {
    var xmlData = await editor.getContent();

    const id = toast.loading("Saving Bussiness Rules as Draft....");
    try {
      var byteData = convertStringToByteArray(xmlData);

      const inputJson = {
        workspaceName: localStorage.getItem("workspace"),
        miniAppName: localStorage.getItem("appName"),
        fileName: data.resourceName.replace(/\.[^/.]+$/, ""),
        fileType: "dmn",
        fileContent: byteData,
        comment: dnmComment,
      };

      axios
        .post(
          process.env.REACT_APP_MODELLER_API_ENDPOINT +
            "modellerService/saveAsDraft",
          inputJson
        )
        .then((response) => {
          toast.update(id, {
            render: "Saved Bussiness Rules as draft Successfully!",
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
              setDnmSaveDraft(false);
            });
        });
    } catch (error) {
      console.log("error", error);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    var data = await editor.getContent();
    var viewer = new BpmnJS({});
    var formElements = [];
    const id = toast.loading("Saving....");

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

    try {
      const res = await axios.post("http://localhost:3100/validate", postData);
      var response = await res;
      if (response.status != 201) {
        toast.update(id, {
          render: response.data,
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          type: "error",
          isLoading: false,
        });
      } else {
        axios
          .post("http://localhost:8080/rest/BPMNprocess/create", postData)
          .then((response) => {
            toast.update(id, {
              render: "Saved Successfully!",
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
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  const openEditModal = () => {
    setShowEditModal(!showEditModal);
  };
  const EditApi = async () => {
    const id = toast.loading(t("Editing Form...."));
    try {
      const inputJson = {
        workspaceName: localStorage.getItem("workspace"),
        miniAppName: localStorage.getItem("appName"),
        fileName: data.resourceName,
        fileType: "dnm",
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
            render: t("Edited Name Successfully!"),
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

  const undo = async () => {
    var temp = await editor.undo();
  };

  const redo = async () => {
    var temp = await editor.redo();
  };

  return (
    <>
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
        />{" "} */}
        <div
          id={data.resourceName}
          style={{
            width: "97%",
            height: "78vh",
            margin: "0",
          }}
        ></div>
      </div>
      <div className="appdesigner-rightside-menu BodyColor">
        <ul className="appdesigner-rightside-menu-link">
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
          <li>
            <Link
              to="#"
              data-tip
              data-for="undo"
              onClick={undo}
              id="dnmDesigner-undo-link"
            >
              <Undo className="svg-fill-comingSoonIcon" />
            </Link>
            <ReactTooltip
              id="undo"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              {t("comingSoon")}
            </ReactTooltip>
          </li>
          <li>
            <Link
              to="#"
              data-tip
              data-for="redo"
              onClick={redo}
              className="rightsideIcons"
              id="dnmDesigner-redo-link"
            >
              <Redo className="svg-fill-comingSoonIcon" />
            </Link>
            <ReactTooltip
              id="redo"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              {t("comingSoon")}
            </ReactTooltip>
          </li>
          <li>
            <Link
              to="#"
              data-tip
              data-for="delete"
              onClick={openDeleteModal}
              className="rightsideIcons"
              id="dnmDesigner-delete-link"
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
              id="dnmDesigner-duplicate-link"
            >
              <Duplicate className="svg-stroke-comingSoonIcon" />
            </Link>
            <ReactTooltip
              id="copy"
              place="left"
              effect="solid"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
            >
              {t("comingSoon")}
            </ReactTooltip>
          </li>
          <li>
            <Link
              to="#"
              onClick={() => {
                data.lockStatus
                  ? data.lockOwner === localStorage.getItem("username")
                    ? onSave()
                    : console.log("Not the owner")
                  : onSave();
              }}
              data-tip
              data-for="save"
              className="rightsideIcons"
              id="dnmDesigner-save-link"
            >
              <Save className="svg-stroke iconStrokehover iconSvgStrokeColor" />
            </Link>
            <ReactTooltip
              id="save"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              place="left"
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
              onClick={onSaveasDraft}
              data-tip
              data-for="saveDraft"
              className="rightsideIcons"
              id="dnmDesigner-saveAsDraft-link"
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
              data-tip
              data-for="Preview"
              className="rightsideIcons"
              id="dnmDesigner-preview-link"
            >
              <Preview className="svg-stroke iconStrokehover iconSvgStrokeColor" />
            </Link>
            <ReactTooltip
              id="Preview"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              {t("Preview")}
            </ReactTooltip>
          </li>

          <li>
            <Link
              data-tip
              data-for="Download"
              id="dnmDesigner-download-link"
              to="#"
            >
              <img src={downloadCs} className="rightsideIcons" />
              {/* <Download1 className="svg-stroke-comingSoonIcon" /> */}
            </Link>
            <ReactTooltip
              id="Download"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              {t("comingSoon")}
            </ReactTooltip>
          </li>
          <li>
            <Link
              to="#"
              onClick={handleButtonClick}
              data-tip
              data-for="Mapping"
              className="rightsideIcons"
              id="dnmDesigner-mapping-link"
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
            <DNMmapping
              buttonClick={open}
              DNMtoDNMmapping={handleCall}
              data={data}
              id="dnmDesigner-dnmMapping"
            />
          </li>
          <li>
            <Link
              data-tip
              data-for="Generate"
              id="dnmDesigner-group-link"
              to="#"
            >
              <img
                src={generateIco}
                alt="group Icon"
                // style={{ height: "40px" }}
                className="rightsideIcons"
              />
              {/* <GroupIcon className="svg-stroke-comingSoonIcon"/> */}
            </Link>
            <ReactTooltip
              id="Generate"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              {t("comingSoon")}
            </ReactTooltip>
          </li>
        </ul>
        <Link
          to="#"
          className="credit-card-link"
          data-tip
          data-for="Overview"
          id="dnmDesigner-overview-link"
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
        modalTitle={t("Delete Business Rule")}
        show={showDeleteModal}
        handleClose={openDeleteModal}
        className="delete-modal"
        id="dnmDesigner-deleteBusinessRule-CommonModelContainer"
      >
        <h6 className="deletednm">
          {t("Do you want to delete")}
          {data.resourceName.substring(0, data.resourceName.length - 4)}{" "}
        </h6>
        <div className=" deletebtn">
          <button
            className="canceldnmsecondaryButton secondaryButtonColor"
            id="dnmDesigner-cancelDeleteModal-button"
            onClick={openDeleteModal}
          >
            {t("Cancel")}
          </button>
          <button
            onClick={() => deleteFile()}
            className="deletednmprimaryButton primaryButtonColor"
            id="dnmDesigner-confirm-button"
          >
            {t("Confirm")}
          </button>
        </div>
      </CommonModelContainer>
      <CommonModelContainer
        modalTitle={t("Edit Name")}
        show={showEditModal}
        handleClose={openEditModal}
        className="edit-modal"
        // id="delete-modal"
      >
        {/* <h6 className="deleteform">
          Rename {" "} 
          {data.resourceName.substring(0, data.resourceName.length - 4)}{" "}
        </h6> */}
        <div class="application py-2">
          <span className="form-subheading secondaryColor" id="edit-app-title">
            {t("Rename File ")}
            <span className="appdesignerappname">*</span>
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
export default DNMDesigner;
