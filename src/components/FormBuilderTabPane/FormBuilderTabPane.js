import "./FormBuilderTabPane.css";

import React, { useEffect, useState } from "react";
import { Accordion, Col, Modal, Row } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { selector, useRecoilValue } from "recoil";
import { CancelIcon, YourLogo } from "../../assets";
import { formbuilderErrorsState } from "../../state/atom";

import { Icon } from "@iconify/react";
import axios from "axios";
import { Tab } from "bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ReactComponent as MobileWeb } from "../../assets/NewIcon/Mobile&web.svg";
import { ReactComponent as Mobile } from "../../assets/NewIcon/Mobile.svg";
import { ReactComponent as Web } from "../../assets/NewIcon/web.svg";
import formBackgroundPath from "../../assets/images/formBG.jpg";
import CommonModelContainer from "../CommonModel/CommonModelContainer";
import ErrorScreenContainer from "../ErrorScreen/ErrorScreenContainer";
import FormDropSection from "../FormBuilder/FormDropSection";
import FormElementsPropertiesSection from "../FormBuilder/FormElementsPropertiesSection";
import Errors from "../FormBuilderErrors/Errors";
import useErrorValue from "../hooks/useErrorValues";
import FormBug from "../../assets/images/formBG.jpg";

const FormBuilderTabPane = ({
  data,
  element,
  setElement,
  elements,
  layout,
  setLayout,
  isDisplayError,
  showErrors,
  templateElements,
  renderElements,
  open,
  undoArray,
  setUndoArray,
  formProp,
  backGrounduniqueIndex,
}) => {
  const [showSection, setShowSection] = useState(false);
  const [mappedBpmnName, setMappedBpmnName] = useState("");
  const [mappedTaskName, setMappedTaskName] = useState("");
  const [mappedTaskType, setMappedTaskType] = useState("");
  const formbuilderErrors = useRecoilValue(formbuilderErrorsState);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { totalErrorsNumber, totalWarningsNumber } = useErrorValue();
  const [zoomValue, setZoomValue] = useState(100);
  const [mapChanges, setMapChanges] = useState(1);
  const [showMappingDeleteModal, setShowMappingDeleteModal] = useState(false);
  const [t, i18n] = useTranslation("common");
  const [generateBackgroundImage, setGenerateBackgroundImage] = useState();
  const formPropertiesVal = formProp;
  // console.log("formPropertiesValformPropertiesVal", formPropertiesVal);

  useEffect(() => {
    setTimeout(() => {
      mapping();
    }, 1000);
  }, [open, mapChanges]);

  useEffect(() => {
    let retries = 0;

    const fetchImageWithRetry = async () => {
      const url = `${process.env.REACT_APP_CDS_ENDPOINT}appLogo/image/${
        formPropertiesVal?.backgroundImage
      }?Authorization=${localStorage.getItem(
        "token"
      )}&workspace=${localStorage.getItem("workspace")}`;

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch the image. Status: ${response.status}`
          );
        }

        const AppImageBlob = await response.blob();
        const AppImageBlobImage = new File([AppImageBlob], "image.jpg", {
          type: "image/jpg",
        });

        setGenerateBackgroundImage(AppImageBlobImage);
      } catch (error) {
        console.error(error);
        setGenerateBackgroundImage(null);

        // Retry logic
        if (retries < 3) {
          retries++;
          console.log(`Retry attempt ${retries} in 2 seconds...`);
          setTimeout(fetchImageWithRetry, 500); // Retry after 2 seconds
        }
      }
    };

    if (
      formPropertiesVal?.backgroundImage &&
      formPropertiesVal?.backgroundImage.length > 0
    ) {
      fetchImageWithRetry();
    }

    // Cleanup function to clear any pending retries if the component unmounts
    return () => {
      retries = 0;
    };
  }, [backGrounduniqueIndex, formPropertiesVal?.backgroundImage]);

  console.log("formPropertiesVal", formPropertiesVal?.backgroundImage);

  function mapping() {
    var config = {
      method: "get",
      url:
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
        "modellerService/workflow/mapping/" +
        localStorage.getItem("workspace") +
        "/" +
        localStorage.getItem("appName"),
      headers: {},
    };

    axios(config)
      .then(function (response) {
        notificationmatch(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const notificationmatch = (mappinglist, file) => {
    var formnamelocal = localStorage.getItem("selectedForm");

    var mappedvalue = "";
    var taskname = "";
    var tasktype = "";

    for (let i = 0; i < mappinglist.length; i++) {
      if (mappinglist[i].formname == formnamelocal) {
        mappedvalue = mappinglist[i].bpmnname;
        taskname = mappinglist[i].taskname;
        tasktype = mappinglist[i].tasktype;
      }
    }
    setMappedBpmnName(mappedvalue);
    setMappedTaskName(taskname);
    setMappedTaskType(tasktype);
  };

  // const openFileInNewTab = (e, file, id) => {
  //   console.log("e, file, id", e, file, id);
  //   localStorage.setItem("selectedForm", file.resourceName);
  //   e.preventDefault();
  //   openFileInTab(file);
  //   toggleorange(id);
  // };

  // const formPropertiesVal = useRecoilValue(formPropertiesState);

  const removeMapping = () => {
    var config = {
      method: "POST",
      url:
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
        "modellerService/form/mapping/delete",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        workspace: localStorage.getItem("workspace"),
        miniapp: localStorage.getItem("appName"),
        taskname: mappedTaskName,
        bpmnname: mappedBpmnName,
      },
    };
    axios(config)
      .then(function (response) {
        setMapChanges((prev) => prev + 1);
        toast.success("Mapping Removed Successfully", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((e) => {
        console.log({ e });
        toast.error("Error while removing the mapping", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
    setShowMappingDeleteModal(false);
  };

  const displaymappinginfo = () => {
    if (mappedBpmnName != "") {
      if (mappedTaskType == "UT") {
        return (
          <>
            <span
              className="secondaryColor"
              id="form-mapping-info-span"
              style={{
                display: "flex",
                minWidth: "max-content",
                width: "max-content",
              }}
            >
              Mapped To {mappedTaskName} {mappedBpmnName}
            </span>
            <button
              id="form-mapping-cancel-btn"
              className="cancel-icon-btn"
              onClick={onMappingDeleteIconClick}
            >
              <img
                id="form-mapping-cancel-img"
                src={CancelIcon}
                alt=""
                className="cancel-icon"
              />
            </button>
          </>
        );
      } else if (mappedTaskType == "PT") {
        return (
          <>
            <span
              className="secondaryColor"
              id="form-mapping-info-span-2"
              style={{
                display: "flex",
                minWidth: "max-content",
                width: "max-content",
              }}
            >
              Mapped To {mappedTaskName}({mappedBpmnName})
            </span>
            <button
              id="form-mapping-cancel-btn-2"
              className="cancel-icon-btn"
              onClick={onMappingDeleteIconClick}
            >
              <img
                id="form-mapping-cancel-img-2"
                src={CancelIcon}
                alt=""
                className="cancel-icon"
              />
            </button>
          </>
        );
      }
    } else {
      return (
        <span className="secondaryColor" id="form-mapping-not-mapped">
          {t("Not Mapped")}
        </span>
      );
    }
  };

  const onErrorModalClose = () => {
    setShowErrorModal(false);
  };

  const onErrorsClick = (e) => {
    e.preventDefault();
    setShowErrorModal(true);
  };

  const onMappingDeleteModalClose = () => {
    setShowMappingDeleteModal(false);
  };

  const onMappingDeleteIconClick = (e) => {
    e.preventDefault();
    setShowMappingDeleteModal(true);
  };

  const zoomInPage = () => {
    setZoomValue((zoomValue) => zoomValue + 5);
  };
  const zoomOutPage = () => {
    setZoomValue((zoomValue) => zoomValue - 5);
  };

  const style = {
    width: `calc(100% - 180px + ${zoomValue}px)`,
    zoom: `${zoomValue}%`,
    height: "100%",
    position: "relative",
    fontFamily: `${formPropertiesVal?.fontFamily}`,
  };
  if (formPropertiesVal?.backgroundColor?.length > 0) {
    style.backgroundColor = formPropertiesVal.backgroundColor;
    style.backgroundImage = "";
  } else if (
    formPropertiesVal?.backgroundImage?.length > 0 &&
    generateBackgroundImage
  ) {
    style.backgroundImage = `url(${URL.createObjectURL(
      generateBackgroundImage
    )})`;
    style.backgroundRepeat = "no-repeat";
    style.backgroundSize = "cover";
  } else {
    style.backgroundColor = "";
    style.backgroundImage = `url(${FormBug})`;
    style.backgroundRepeat = "repeat";
    style.backgroundSize = "25%";
  }
  // console.log("style",style);

  return (
    <>
      <CommonModelContainer
        modalTitle={`Errors Total : ${totalErrorsNumber}`}
        show={showErrorModal}
        handleClose={onErrorModalClose}
        className="error-modal"
        id="error-modal"
      >
        <Errors />
      </CommonModelContainer>
      <CommonModelContainer
        id="remove-mapping-model"
        modalTitle={"Are you sure you want to remove the mapping?"}
        show={showMappingDeleteModal}
        handleClose={onMappingDeleteModalClose}
        className="remove-mapping-modal"
      >
        <div className="mapping-delete-modal-buttons-container">
          <button
            id="delete-mapping-yes-btn"
            className="primaryButton primaryButtonColor"
            onClick={removeMapping}
          >
            Yes
          </button>
          <button
            id="delete-mapping-cancel-btn"
            className="primaryButton primaryButtonColor"
            onClick={onMappingDeleteModalClose}
          >
            Cancel
          </button>
        </div>
      </CommonModelContainer>

      <div className="formbuilder-container BodyColor">
        <div className="formbuilder-rightsidebar-container BodyColor">
          {/* <div className="fileExplorer-main" style={{ width: "13%" }}> */}
          <div className="formbuilder-sidebar BodyColor">
            <div className="formbuilder-search BodyColor">
              <Link id="form-builder-search-bar" to="#">
                <Icon icon="akar-icons:search" />
              </Link>
              <input
                id="form-builder-search-input"
                type="text"
                placeholder={t("search")}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <Accordion
              className="formbuilder-sidebar-accordion customScrollBar"
              defaultActiveKey={["0"]}
              alwaysOpen
            >
              <Accordion.Item className="BodyColor" eventKey="0">
                <Accordion.Header className="secondaryColor">
                  {t("Core UI")}{" "}
                  <Icon
                    icon="ic:sharp-keyboard-double-arrow-down"
                    className="formbuilder-coreUIDropdown primaryColor"
                    // style={{ marginLeft: "80px" }}
                  />
                </Accordion.Header>
                <Accordion.Body>
                  <ul className="formbuiler-sidebar-wrap primaryColor">
                    {elements?.coreElements
                      ?.filter((e) =>
                        e.elementType
                          .toLowerCase()
                          .replace(/\.[^/.]+$/, "")
                          .includes(searchValue.toLowerCase())
                      )

                      ?.map((item, index) => renderElements(item, index))}
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item className="BodyColor" eventKey="1">
                <Accordion.Header>
                  {t("Layout")}{" "}
                  <Icon
                    icon="ic:sharp-keyboard-double-arrow-down"
                    className="formbuilder-coreUIDropdown"
                    // style={{ marginLeft: "80px" }}
                  />
                </Accordion.Header>
                <Accordion.Body>
                  <ul className="formbuiler-sidebar-wrap">
                    {elements?.layoutElements
                      ?.filter((e) =>
                        e.elementType
                          .toLowerCase()
                          .replace(/\.[^/.]+$/, "")
                          .includes(searchValue.toLowerCase())
                      )
                      ?.map((item, index) => renderElements(item, index))}
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item className="BodyColor" eventKey="2">
                <Accordion.Header className="BodyColor">
                  {t("Advanced")}{" "}
                  <Icon
                    icon="ic:sharp-keyboard-double-arrow-down"
                    className="formbuilder-coreUIDropdown"
                    // style={{ marginLeft: "55px" }}
                  />
                </Accordion.Header>
                <Accordion.Body>
                  <ul className="formbuiler-sidebar-wrap">
                    {elements?.advancedElements
                      ?.filter((e) =>
                        e.elementType
                          .toLowerCase()
                          .replace(/\.[^/.]+$/, "")
                          .includes(searchValue.toLowerCase())
                      )
                      ?.map((item, index) => renderElements(item, index))}
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item className="BodyColor" eventKey="3">
                <Accordion.Header>
                  {t("Templates")}{" "}
                  <Icon
                    icon="ic:sharp-keyboard-double-arrow-down"
                    className="formbuilder-coreUIDropdown"
                    // style={{ marginLeft: "53px" }}
                  />
                </Accordion.Header>
                <Accordion.Body>
                  <ul className="formbuiler-sidebar-wrap">
                    {elements?.templateElements
                      ?.filter((e) =>
                        e.elementType
                          .toLowerCase()
                          .replace(/\.[^/.]+$/, "")
                          .includes(searchValue.toLowerCase())
                      )
                      ?.map((item, index) => renderElements(item, index))}
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
        <div
          className="formbuilder-main-body-wrap  customScrollBar"
          style={style}
        >
          <FormDropSection
            setElement={setElement}
            layout={layout}
            setLayout={setLayout}
            showSection={showSection}
            setShowSection={setShowSection}
            element={element}
            // customStyle={{
            //   background: `${formPropertiesVal.backgroundColor}`,
            // }}
            undoArray={undoArray}
            setUndoArray={setUndoArray}
            formProp={formProp}
          />
        </div>
        <FormElementsPropertiesSection
          element={element}
          layout={layout}
          setLayout={setLayout}
          showSection={showSection}
          setShowSection={setShowSection}
          undoArray={undoArray}
          setUndoArray={setUndoArray}
        />
      </div>
      {/* <div className="error-footer-wrap hidden">
        <ErrorScreenContainer isDisplayError={isDisplayError} />
        <ul className="error-footer-links ">
          <li>
            <Link to="" onClick={showErrors}>
              16 Errors
            </Link>
          </li>
          <li>
            <Link to="" onClick={showErrors}>
              8 Warnings
            </Link>
          </li>
        </ul>
      </div> */}
      <div
        className=" appdesigner-asset-footer  "
        style={{ backgroundColor: "#fff" }}
      >
        <div className="appdesigner-footer-left col-md-10 BodyColor">
          <div className="row BodyColor">
            <div
              id="form-builder-footer-error"
              className="formbuilder-footer-error BodyColor"
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
          </div>
          <div className="row">
            <div className="appdesigner-footer-start">
              <div className="formbuilder-footer-status ">
                <div className="mapped">
                  {mappedTaskType == "PT" ? (
                    <Icon icon="bi:link" />
                  ) : (
                    <Icon icon="flat-color-icons:broken-link" />
                  )}
                  {displaymappinginfo()}
                </div>
              </div>
              <div
                className="formbuilder-footer-status"
                id="form-buider-footer-status"
              >
                {t("My App uploaded at 18:00")}
              </div>
              <div className="FormBuilder-zoom-view-device zoom-view-device">
                {/* <div className="d-flex justify-content-center mx-2">
                  <div>
                    <Link to="#" className="text-orange">
                    
                      <MobileWeb className="svg-fill" />
                    </Link>
                  </div>
                  <div>
                    <Link to="#" className="text-orange px-2 ">
                     
                      <Mobile className="svg-stroke" />
                    </Link>
                  </div>

                  <div>
                    <Link to="#">
                      
                      <Web className="svg-fill" />
                    </Link>
                  </div>
                </div> */}
                <div className="formbuilder-footer-zoom-view-prop">
                  <div>
                    <Link to="#">
                      <Icon
                        id="form-builder-zoom-minus"
                        height={15}
                        width={15}
                        icon="akar-icons:minus"
                        style={{ color: "#0D3C84" }}
                        onClick={zoomOutPage}
                      />
                    </Link>
                  </div>
                  <div
                    className="formbuilder-footer-zoom-view-status"
                    style={{ fontSize: "12px", textDecoration: "none" }}
                  >
                    <Link
                      id="form-builder-zoom-value"
                      style={{ textDecoration: "none", color: "#0D3C84" }}
                    >
                      {zoomValue}%
                    </Link>
                  </div>
                  <div>
                    <Link id="form-builder-zoom-plus" to="#">
                      <Icon
                        id="form-builder-zoom-plus-icon"
                        height={15}
                        width={15}
                        icon="akar-icons:plus"
                        style={{ color: "#0D3C84" }}
                        onClick={zoomInPage}
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="appdesigner-footer-right-logo BodyColor">
          {/* <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          > */}
          <img
            id="your-logo-img"
            src={YourLogo}
            className="YourLogoHere"
            crossOrigin="anonymous"
          />
          {/* </div> */}
        </div>
      </div>
    </>
  );
};
export default FormBuilderTabPane;
