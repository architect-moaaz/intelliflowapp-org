import React, { useState, useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { LogoIcon, PlayIcon, MapIcon, GroupIcon } from "../../assets";
import "react-toastify/dist/ReactToastify.css";
import ReactTooltip from "react-tooltip";
import HomePageTabPane from "./HomePageTabPane";
import { ReactComponent as Remove } from "../../assets/NewIcon/Remove.svg";

import { useRecoilState } from "recoil";
import { ToastContainer, toast } from "react-toastify";
import json5 from "json5";
import CommonModelContainer from "../CommonModel/CommonModelContainer";
import AssignRolePopup from "./AssignRolePopup";

import {
  openFilesState,
  formbuilderErrorsState,
  formProperties,
  formPropertiesHomePage,
} from "../../state/atom";
import { ReactComponent as EditProperties } from "../../assets/NewIcon/EditProperties.svg";
import { ReactComponent as Undo } from "../../assets/NewIcon/Undo.svg";
import { ReactComponent as Redo } from "../../assets/NewIcon/Redo.svg";
import { ReactComponent as Save } from "../../assets/NewIcon/Save.svg";
import { ReactComponent as SaveAsADraft } from "../../assets/NewIcon/SaveAsADraft.svg";
import { ReactComponent as Preview } from "../../assets/NewIcon/Preview.svg";
import { ReactComponent as AssignRole } from "../../assets/NewIcon/AssignRole.svg";
import { ReactComponent as Download1 } from "../../assets/NewIcon/Download-1.svg";
import { ReactComponent as Overview } from "../../assets/NewIcon/Overview.svg";
import { ReactComponent as Delete } from "../../assets/NewIcon/Delete.svg";
import HomepagePreview from "./HomepagePreview";
import { autoSave } from "../../state/atom";
import { useTranslation } from "react-i18next";
import ColorPicker from "react-best-gradient-color-picker";
import { ReactComponent as UploadFormProp } from "../../assets/NewIcon/UploadFormProp.svg";
import FontPicker from "font-picker-react";
import rgbHex from "rgb-hex";
import imageCompression from "browser-image-compression";

export default function HomePageTabPaneContainer({
  data,
  isDisplayError,
  showErrors,
  doGetAllResources,
}) {
  const [t, i18n] = useTranslation("common");
  const [openFiles, setOpenFiles] = useRecoilState(openFilesState);
  const [formbuilderErrors, setFormbuilderErrors] = useRecoilState(
    formbuilderErrorsState
  );

  const [open, setOpen] = useState(false);
  const [save, setSave] = useState(false);
  const [formSaveDraft, setFormSaveDraft] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [layout, setLayout] = useState({
    layout: [],
  });
  const [element, setElement] = useState(null);
  const [formPreviewData, setFormPreviewData] = useState([]);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateFormName, setDuplicateFormName] = useState("");
  const [err, setErr] = useState(false);
  const [formComment, setFormComment] = useState("");
  const [useHomepage, setUseHomepage] = useState(false);
  const [previewModel, setPreviewModal] = useState(false);
  const [showAssignRolePopup, setShowAssignRolePopup] = useState(false);
  const AutosaveFrequency = localStorage.getItem("AutoSaveFrequency");
  const AutoSavefeature =
    localStorage.getItem("AutoSavefeature") == "true" ? true : false;

  const [pageSaved, setPageSaved] = useState(1);

  const [showFormProperties, setShowFormProperties] = useState(false);
  const [formProp, setFormPropertiesHomepage] = useState({});
  const [showBackColorPicker, setShowBackColorPicker] = useState(false);
  const [backcompactPicker, setBackCompactPicker] = useState("rgba(0,0,0,1)");
  const [selectFontFamily, setSelectFontFamily] = useState("Arial");
  const [uploadedBackImg, setUploadedBackImg] = useState(null);
  const [isBackImgUploaded, setIsBackImgUploaded] = useState(false);

  const handleAssignRolePopupClose = () => setShowAssignRolePopup(false);
  const handleAssignRolePopupShow = () => setShowAssignRolePopup(true);

  const openDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };
  const displayAssignRole = () => {
    if (showAssignRolePopup === true) {
      return (
        <AssignRolePopup
          data={data}
          layout={layout}
          setLayout={setLayout}
          showAssignRolePopup={showAssignRolePopup}
          handleHidePopup={handleAssignRolePopupClose}
          id="homepageTabPaneContainer-handleAssignRolePopupClose-AssignRolePopup"
        />
      );
    }
  };

  useEffect(() => {
    const postData = {
      workspaceName: localStorage.getItem("workspace"),
      miniAppName: localStorage.getItem("appName"),
      fileName: data.resourceName,
      fileType: "page",
    };

    axios
      .post(
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
          "modellerService/fetchFile/content",
        postData
      )
      .then((res) => {
        const parseData = res.data.data;
        var dataInput = json5.parse(parseData);
        setLayout({
          layout: [...dataInput.formData],
        });

        setUseHomepage(dataInput.useHomepage);
        setFormPropertiesHomepage(dataInput.homepagePrperties || {});
      })
      .catch((e) => console.log("Error ", e));
  }, []);


  useEffect(() => {
    const temp = layout?.layout?.map((item) => {
      if (item.edit) {
        setElement(item);
      }
    });
  }, [layout]);

  const mediaUploader = async (item) => {
    const imageUploaderPromise = new Promise((resolve, reject) => {
      const appName = localStorage.getItem("appName");
      var bodyFormData = new FormData();
      bodyFormData.append("file", item.mediaUrl);
      axios
        .post(
          `${
            process.env.REACT_APP_CDS_ENDPOINT + appName
          }/upload?Authorization=${localStorage.getItem(
            "token"
          )}&workspace=${localStorage.getItem("workspace")}`,
          bodyFormData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });

    return imageUploaderPromise;
  };

  const renderMediaUpload = async () => {
    for (let i = 0; i < layout.layout.length; i++) {
      if (
        layout.layout[i].elementType == "media" &&
        layout.layout[i].mediaUrl
      ) {
        if (!layout.layout[i].mediaUploaded) {
          const data = await mediaUploader(layout.layout[i]);
          layout.layout[
            i
          ].mediaUrl = `${data.file.bucketName}/image/${data.file.filename}`;
          layout.layout[i].mediaUploaded = true;
        }
      }
    }
    setLayout(layout);
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

  const onSave = async (autoSaveData = false) => {
    // const elementsWithoutPropFieldName = layout.layout.filter(
    //   (item) => item.fieldName === "" || item.fieldName === null
    // );
    // const elementsWithPropDataVariable = layout.layout.filter(
    //   (item) =>
    //     item.elementType !== "label" &&
    //     item.elementType !== "section" &&
    //     item.elementType !== "image" &&
    //     item.elementType !== "location" &&
    //     item.elementType !== "qrcode" &&
    //     item.elementType !== "mathexp"
    // );
    // const elementsWithoutDataVariable = elementsWithPropDataVariable.filter(
    //   (item) =>
    //     item.processVariableName === null || item.processVariableName === ""
    // );

    // const elementsWithRating = layout.layout.filter(
    //   (item) => item.elementType === "rating"
    // );

    // const ratingElementsWithoutRatingType = elementsWithRating.filter(
    //   (item) => item.ratingType == null
    // );

    // if (
    //   elementsWithoutDataVariable[0] ||
    //   elementsWithoutPropFieldName[0] ||
    //   ratingElementsWithoutRatingType[0]
    // ) {
    //   toast.error(
    //     `There are errors in the form, please click on the errors to view details`,
    //     {
    //       position: "bottom-right",
    //       autoClose: 5000,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //       pauseOnHover: true,
    //       draggable: true,
    //       progress: undefined,
    //     }
    //   );
    //   setFormbuilderErrors({
    //     ...formbuilderErrors,
    //     forms: {
    //       ...formbuilderErrors.forms,
    //       [data.resourceName]: {
    //         fieldNameErrors: [...elementsWithoutPropFieldName],
    //         dataVariableErrors: [...elementsWithoutDataVariable],
    //         ratingFieldErrors: [...ratingElementsWithoutRatingType],
    //       },
    //     },
    //   });
    // } else {
    //   setFormbuilderErrors({
    //     ...formbuilderErrors,
    //     forms: {
    //       ...formbuilderErrors.forms,
    //       [data.resourceName]: {
    //         fieldNameErrors: [],
    //         dataVariableErrors: [],
    //         ratingFieldErrors: [],
    //       },
    //     },
    //   });
    //   toast.success("No Errors found in the form, Uploading the form", {
    //     position: "bottom-right",
    //     autoClose: 5000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //   });

    await renderMediaUpload();

    const tempByteData = JSON.stringify({
      formData: [...layout.layout],
      useHomepage,
      homepagePrperties: {
        ...formProp,
      },
    });

    var byteData = convertStringToByteArray(tempByteData);

    const inputJson = {
      workspaceName: localStorage.getItem("workspace"),
      miniAppName: localStorage.getItem("appName"),
      fileName: data.resourceName.replace(/\.[^/.]+$/, ""),
      fileType: "page",
      fileContent: byteData,
    };

    axios
      .post(
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
          "modellerService/formmodeller/createFile",
        inputJson
      )
      .then((res) => {
        if (autoSaveData == false) {
          toast.success(t("Homepage saved successfully"), {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
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
          .then((res) => {
            const tempLayout = [...layout.layout];
            setLayout({ layout: tempLayout });
          });
      })
      .catch((e) => console.log("Error : ", e));

    // }
  };

  useEffect(() => {
    let autoSaveInterval = null;
    if (AutoSavefeature) {
      autoSaveInterval = setInterval(() => {
        renderOnSave();
      }, (AutosaveFrequency ? AutosaveFrequency : 10) * 1000);

      return () => clearInterval(autoSaveInterval);
    } else {
      if (autoSaveInterval) clearInterval(autoSaveInterval);
    }
  }, [AutoSavefeature, pageSaved]);

  useEffect(() => {
    setPageSaved(pageSaved + 1);
  }, [layout.layout]);

  const renderOnSave = () => {
    setPageSaved((prev) => prev + 1);
    onSave(true);
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

  const handleHomePageChange = (e) => {
    setUseHomepage((prev) => !prev);
  };

  const deleteFile = async (e) => {
    e.preventDefault();
    const id = toast.loading("Deleting Homepage....");
    try {
      const inputJson = {
        workspaceName: localStorage.getItem("workspace"),
        miniAppName: localStorage.getItem("appName"),
        fileName: data.resourceName,
        fileType: "page",
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
            render: t("Deleted Homepage Successfully!"),
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

  const openPreviewModel = () => {
    setPreviewModal(true);
  };

  const closePreviewModel = () => {
    setPreviewModal(false);
  };

  const openFormProperties = () => {
    setShowFormProperties(true);
  };
  const closeFormProperties = () => {
    setShowFormProperties(false);
    // setFormProperties({})
    setEditName(data.resourceName.replace(/\.[^/.]+$/, ""));
  };

  const [editName, setEditName] = useState(
    data.resourceName.replace(/\.[^/.]+$/, "")
  );

  const handleShowBackColorPicker = () => {
    setShowBackColorPicker(!showBackColorPicker);
  };

  const handleBackgroundColorPicker = (backColor) => {
    setBackCompactPicker(backColor);
    setFormPropertiesHomepage((item) => {
      return {
        ...item,
        backgroundColor: backColor,
        backgroundImage: "",
      };
    });
  };
  // console.log("formProphomepage", formProp);

  const handleRemoveBackgroundColor = () => {
    setBackCompactPicker("rgba(0,0,0,1)");
    const tempProp = { ...formProp };
    delete tempProp.backgroundColor;
    setFormPropertiesHomepage(tempProp);
  };

  const handleUploadBackImage = (e) => {
    setUploadedBackImg(e.target.files[0]);
    uploadBackgroundImage(e.target.files[0]);
    setFormPropertiesHomepage((item) => {
      return {
        ...item,
        backgroundImage:  
        localStorage.getItem("workspace") +
        localStorage.getItem("appName") +
        localStorage.getItem("selectedForm").replace(/\.[^/.]+$/, "") +
        "FormProperty",
        backgroundColor: "",
      };
    });
    setIsBackImgUploaded(true);
  };
  // console.log("checking formprop in homepgae uploaded img", formProp);


  const handleRemoveUploadImage = () => {
    setUploadedBackImg(null);
    setIsBackImgUploaded(false);
    const tempProp = { ...formProp };
    delete tempProp.backgroundImage;
    setFormPropertiesHomepage(tempProp);
  };

  const handleSelectFontFamily = (e) => {
    setSelectFontFamily(e.family);
    setFormPropertiesHomepage((item) => {
      return {
        ...item,
        fontFamily: e.family,
      };
    });
    // document.execCommand("fontName", false, e.family);
    // e.preventDefault();
  };

  const uploadBackgroundImage = async (e) => {
    let filePath = "";
    if (e) {
      const options = {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 450,
        useWebWorker: true,
      };

      let uploadedBackground;
      await imageCompression(e, options).then((x) => {
        uploadedBackground = x;
      });
      const formData = new FormData();
      formData.append("file", uploadedBackground);
      await axios.post(
        `${
          process.env.REACT_APP_CDS_ENDPOINT
        }appLogo/upload?Authorization=${localStorage.getItem(
          "token"
        )}&workspace=${localStorage.getItem("workspace")}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            logoName:
              localStorage.getItem("workspace") +
              localStorage.getItem("appName") +
              localStorage.getItem("selectedForm").replace(/\.[^/.]+$/, "") +
              "FormProperty",
          },
        }
      );

      const formlogoname =
        localStorage.getItem("workspace") +
        localStorage.getItem("appName") +
        "FormProperty";
      // filePath = `/${cdsAPI.data.file.bucketName}/image/${cdsAPI.data.file.filename}`;
    }
  };

  return (
    <>
      <HomePageTabPane
        data={data}
        layout={layout}
        setLayout={setLayout}
        element={element}
        setElement={setElement}
        isDisplayError={isDisplayError}
        showErrors={showErrors}
        formProp={formProp}
      />
      <div className="appdesigner-rightside-menu BodyColor">
        <ul className="appdesigner-rightside-menu-link">
          <li>
            <Link
              id="edit-properties-link"
              data-tip
              data-for="EditProperties"
              onClick={openFormProperties}
              to="#"
            >
              {/* <EditProperties className="svg-fill-comingSoonIcon" /> */}
              <EditProperties className="svg-fill iconFillhover iconSvgFillColor" />
            </Link>
            <ReactTooltip
              id="EditProperties"
              place="top"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              {/* {t("comingSoon")} */}
              Form Properties
            </ReactTooltip>
          </li>
          <li>
            <Link id="undo-link" data-tip data-for="undo" to="#">
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
            <Link id="redo-link" data-tip data-for="redo" to="#">
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
            {/* <Link id="delete-link" data-tip data-for="delete" onClick={(e) => deleteFile(e)}> */}
            <Link
              data-tip
              data-for="delete"
              id="bpmnDesigner-delete-link"
              onClick={openDeleteModal}
              className="rightsideIcons"
              to="#"
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
          {/* <li>
            <Link  data-tip data-for="copy">
              <Duplicate className="svg-stroke" />
            </Link>
            <ReactTooltip
              id="copy"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              Duplicate
            </ReactTooltip>
          </li> */}
          <li>
            <Link
              to="#"
              id="save-link"
              data-tip
              data-for="save"
              onClick={(e) => {
                e.preventDefault();
                data.lockStatus
                  ? data.lockOwner === localStorage.getItem("username")
                    ? onSave()
                    : console.log("Not the owner")
                  : onSave();
              }}
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
            <Link id="save-as-draft-link" data-tip data-for="saveDraft" to="#">
              <SaveAsADraft className="svg-fill-comingSoonIcon" />
            </Link>
            <ReactTooltip
              id="saveDraft"
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
              id="preview-link"
              data-tip
              data-for="Preview"
              onClick={openPreviewModel}
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
            <HomepagePreview
              previewModel={previewModel}
              closePreviewModel={closePreviewModel}
              formPreviewData={layout.layout}
              formProp={formProp}
            />
          </li>
          <li>
            <Link
              to="#"
              id="assignRole-link"
              data-tip
              data-for="AssignRole"
              onClick={handleAssignRolePopupShow}
            >
              <AssignRole className="svg-fill iconFillhover iconSvgFillColor" />
            </Link>
            <ReactTooltip
              id="assignRole"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              {t("Assign Role")}
            </ReactTooltip>
            {displayAssignRole()}
          </li>

          {/* <li>
            <Link data-tip data-for="Download">
              <Download1 className="svg-fill-comingSoonIcon" />
            </Link>
            <ReactTooltip
              id="Download"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              Download
            </ReactTooltip>
          </li> */}
          {/* <li>
            <Link  data-tip data-for="Mapping">
              <Mapping className="svg-fill" />
            </Link>
            <ReactTooltip
              id="Mapping"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              Mapping
            </ReactTooltip>
          </li> */}
          {/* <li>
            <Link data-tip data-for="Generate">
              <img
                src={GroupIcon}
                alt="group Icon"
                style={{ height: "40px" }}
                className="svg-fill-comingSoonIcon"
              />
            </Link>
            <ReactTooltip
              id="Generate"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              Generate
            </ReactTooltip>
          </li> */}
          <li>
            <div class="form-switch" data-tip data-for="Claim">
              <input
                data-tip
                data-for="Claim"
                type="checkbox"
                class="form-check-input"
                id="flexSwitchCheckDefault"
                role="switch"
                style={{
                  borderColor: "#0D3C84",
                  borderWidth: "2px",
                  alignSelf: "center",
                  color: "#0D3C84",
                  height: "18px",
                  width: "30px",
                }}
                checked={useHomepage}
                onChange={handleHomePageChange}
              />
            </div>
            <ReactTooltip
              id="Claim"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              {useHomepage ? t("Hide Homepage") : t("Show Homepage")}
            </ReactTooltip>
          </li>
        </ul>
        {/* <Link className="credit-card-link" data-tip data-for="Overview">
          <Overview className="svg-fill" />
        </Link>
        <ReactTooltip
          id="Overview"
          place="left"
          className="tooltipCustom"
          arrowColor="rgba(0, 0, 0, 0)"
          effect="solid"
        >
          Overview
        </ReactTooltip> */}
        <CommonModelContainer
          modalTitle={t("Delete Home Page")}
          show={showDeleteModal}
          handleClose={openDeleteModal}
          className="deletebpmn-modal"
          id="bpmnDesigner-deleteWorkFlow-CommonModelContainer"
        >
          <h6 className="deletebpmn">
            {t("Do you want to delete")}{" "}
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
              onClick={(e) => deleteFile(e)}
              className="deletebpmnprimaryButton primaryButtonColor"
            >
              {t("Confirm")}
            </button>
          </div>
        </CommonModelContainer>
      </div>
      <CommonModelContainer
        modalTitle="Form Customisation"
        show={showFormProperties}
        handleClose={closeFormProperties}
        className="form-properties-modal"
        // dialogAs={DraggableModalDialog}
        // backdropClassName="FormElementsBackdrop"
      >
        <>
          <ul class="nav nav-pills label-pills" id="pills-tab" role="tablist">
            <li class="nav-item" role="presentation">
              <button
                class="nav-link active propertiesPopup"
                id="pills-home-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-home"
                type="button"
                role="tab"
                aria-controls="pills-home"
                aria-selected="true"
              >
                Property
              </button>
            </li>
            {/* <li class="nav-item" role="presentation">
              <button
                class="nav-link propertiesPopup"
                id="pills-profile-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-profile"
                type="button"
                role="tab"
                aria-controls="pills-profile"
                aria-selected="false"
              >
                On Load
              </button>
            </li> */}
          </ul>
          <div class="tab-content" id="pills-tabContent">
            <div
              class="tab-pane fade show active"
              id="pills-home"
              role="tabpanel"
              aria-labelledby="pills-home-tab"
            >
              <form>
                <div className="form-input">
                  <label> Change Background Color</label>
                  <div className="colorBoxStyleContainer color-box-container ">
                    <div
                      className="form-prop-color-box-style form-cust-input"
                      onClick={handleShowBackColorPicker}
                    >
                      <div className="color-box-wrapper">
                        <div
                          className="form-prop-color-box"
                          style={{
                            background: `${
                              formProp?.backgroundColor
                                ? formProp?.backgroundColor
                                : backcompactPicker
                            }`,
                            width: "27%",
                          }}
                        >
                          <ReactTooltip id="11" place="top" effect="solid">
                            Form Background Color
                          </ReactTooltip>
                        </div>
                        <p>
                          {`#${rgbHex(
                            formProp?.backgroundColor
                              ? formProp?.backgroundColor
                              : backcompactPicker
                          )}`
                            ?.substring(
                              0,
                              `#${rgbHex(
                                formProp?.backgroundColor
                                  ? formProp?.backgroundColor
                                  : backcompactPicker
                              )}`?.length - 2
                            )
                            .toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div
                      className="remove-btn-form-prop"
                      onClick={handleRemoveBackgroundColor}
                    >
                      <Remove
                        style={{ height: 26, width: 26 }}
                        className="svg-fill"
                      />
                    </div>

                    {/* <div className="form-prop-color-box-style form-cust-input justify-content-start">100%</div> */}
                  </div>
                  <div
                    className={
                      showBackColorPicker == true
                        ? "display-back-color-picker"
                        : "displayHide"
                    }
                  >
                    <div>
                      <ColorPicker
                        hideAdvancedSliders="false"
                        hideColorGuide="false"
                        hideInputType="false"
                        value={backcompactPicker}
                        onChange={handleBackgroundColorPicker}
                        height={125}
                        width={250}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-input">
                  <label>{t("uploadImage")}</label>
                  <div className="form-prop-upload-wrapper">
                    <div
                      className="ps-2 pt-1 form-cust-input"
                      style={{ border: "1px solid #E5E5E5", width: "80%" }}
                    >
                      <label
                        htmlhtmlFor="upload-img"
                        class=""
                        onChange={handleUploadBackImage}
                        id="imageUploadProperties-uploadImg-label"
                      >
                        <input type="file" class="file" id="upload-img" />
                        {formProp?.backgroundImage == null ? (
                          <>
                            <UploadFormProp
                              style={{ height: 26, width: 26 }}
                              className="svg-fill"
                            />
                          </>
                        ) : (
                          <div className="d-flex flex-row">
                            <img
                              height={26}
                              width={26}
                              style={{ borderRadius: 5 }}
                              crossOrigin="anonymous"
                              src={`${
                                process.env.REACT_APP_CDS_ENDPOINT
                              }appLogo/image/${localStorage.getItem(
                                "workspace"
                              )}${localStorage.getItem(
                                "appName"
                              )}FormProperty?Authorization=${localStorage.getItem(
                                "token"
                              )}&workspace=${localStorage.getItem(
                                "workspace"
                              )}`}
                            />
                            <span>
                              {formProp?.backgroundImage && (
                                <div
                                  style={{
                                    color: "grey",
                                    marginLeft: "12px",
                                    marginTop: "1px",
                                    fontSize: "12px",
                                  }}
                                >
                                  Uploaded successfully!
                                </div>
                              )}
                            </span>
                          </div>
                        )}
                      </label>
                    </div>
                    <Remove
                      style={{ height: 26, width: 26 }}
                      className="svg-fill remove-btn-form-prop"
                      onClick={handleRemoveUploadImage}
                    />
                  </div>
                </div>
                <div className="form-input">
                  <label>Change Text Fonts</label>
                  <div className="select ">
                    <FontPicker
                      apiKey="AIzaSyAaXIFdqZdfK5Rcq2xrB3fRQv6xhyqt_rc"
                      activeFontFamily={
                        formProp?.fontFamily ? 
                        formProp?.fontFamily : selectFontFamily 
                      }
                      onChange={(nextFont) => handleSelectFontFamily(nextFont)}
                      id="styleComponent-Text-FontPicker"
                    />
                  </div>
                </div>
              </form>
            </div>
            {/* <div
              class="tab-pane fade"
              id="pills-profile"
              role="tabpanel"
              aria-labelledby="pills-profile-tab"
            >
              On Load here
            </div> */}
          </div>
          {/* <div className="Delete-popup-bottom-formbuilder">
            <button
              id="delete-file-cancel-btn"
              className="cancelsecondaryButton secondaryButtonColor"
              onClick={closeFormProperties}
            >
              Cancel
            </button>
            <button
              id="delete-file-confirm-btn"
              // onClick={() => handleSaveFormProperties()}
              className="deleteprimaryButton primaryButtonColor"
            >
              Save
            </button>
          </div> */}
        </>
      </CommonModelContainer>
    </>
  );
}
