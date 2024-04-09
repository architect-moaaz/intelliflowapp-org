import React from "react";
import { useState, useEffect, useLayoutEffect } from "react";
import "./Template.css";
import { Container, Row, Col, Modal } from "react-bootstrap";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import LeftArrow from "../../assets/NewIcon/LeftArrow.svg";
import CommonModelContainer from "../CommonModel/CommonModelContainer";
import ReactTooltip from "react-tooltip";
import { LaptopIcoRed, LaptopIco, PhoneIcoRed, PhoneIco } from "../../assets";
import UploadFileCreateApp from "../../assets/NewIcon/UploadFileCreateApp.svg";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import checked from "../../assets/Icons/checked-green.svg";
import imageCompression from "browser-image-compression";
import CustomImageSlider from "./CustomImageSlider/CustomImageSlider";
import { useTranslation } from "react-i18next";
import ImageLoader from "../../components/ImageLoader/ImageLoader";
const Template = () => {
  const [showTemplateModal, setShowNewAppModel] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isWeb, setIsWeb] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [uploadedFilePreview, setUploadedFilePreview] = useState(null);
  const [targetDevice, setTargetDevice] = useState("");
  const [descriptionCharLeft, setDescriptionCharLeft] = useState(250);
  const [invalidFileType, setInvalidFileType] = useState(false);
  const [appName, setAppName] = useState("");
  const [confirmAppModal, setConfirmAppModal] = useState(false);
  const [fetchTemplateAppData, setFetchTemplateAppData] = useState(null);
  const [output, setOutput] = useState([]);
  const templateData = localStorage.getItem("templateData");
  const templateDetails = templateData ? JSON.parse(templateData) : null;
  const [t, i18n] = useTranslation("common");
  const [totalNoOfAppsCreated, setTotalNoOfAppsCreated] = useState();
  const [noOfAppsAllowed, setNoOfAppsAllowed] = useState();

  const subscribe = () => {
    const axios = require("axios");

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url:
        process.env.REACT_APP_IDENTITY_ENDPOINT +
        "IDENTITY/misc/getWorkspaceConfig",
      headers: {
        workspaceName: localStorage.getItem("workspace"),
        Authorization: localStorage.getItem("token"),
      },
    };

    axios
      .request(config)
      .then((response) => {
        setNoOfAppsAllowed(response.data.config.noOfApps);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  const APPINFO = async () => {
    var config = {
      method: "get",
      url:
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
        "modellerService/" +
        localStorage.getItem("workspace") +
        "/data",
      headers: {},
    };
    axios(config)
      .then(async (response) => {
        setTotalNoOfAppsCreated(response.data.data.data.count.totalApps);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  useEffect(() => {
    subscribe();
    APPINFO();
  }, []);
  const isButtonDisabled = totalNoOfAppsCreated >= noOfAppsAllowed;
  const fetchTemplateAppDataHandle = async () => {
    let config = {
      method: "get",
      url: `${process.env.REACT_APP_MODELLER_API_ENDPOINT}template/${templateDetails?.appName}`,
    };

    axios
      .request(config)
      .then((response) => {
        setFetchTemplateAppData(response?.data?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useLayoutEffect(() => {
    fetchTemplateAppDataHandle();
  }, [templateDetails.appName]);

  const handleShowTemplateModal = () => {
    setShowNewAppModel(true);
    setAppName(templateDetails.appName);
  };
  const closeTemplateModal = () => {
    setShowNewAppModel(false);
    setDescription(null);
    setTargetDevice("");
    setUploadedFile(null);
    setIsMobile(false);
    setIsWeb(false);
    setUploadedFile(null);
    setInvalidFileType(false);
  };
  const openConfirmModal = () => {
    setConfirmAppModal(true);
  };
  const closeConfirmModal = () => {
    setTimeout(() => {
      setConfirmAppModal(false);
      setName(null);
    }, 3000);
  };
  const targetDevices = () => {
    if (isWeb == true && isMobile == true) {
      setTargetDevice("B");
    } else if (isWeb == true && isMobile == false) {
      setTargetDevice("D");
    } else if (isMobile == true && isWeb == false) {
      setTargetDevice("M");
    } else if (isMobile == false && isWeb == false) {
      setTargetDevice("");
    }
  };

  useEffect(() => {
    targetDevices();
  }, [isWeb, isMobile]);

  const handleCreateTemplate = async () => {
    let filePath = "";
    if (uploadedFile) {
      const options = {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 450,
        useWebWorker: true,
      };
      const optionsThumbnail = {
        maxSizeMB: 0.01,
        maxWidthOrHeight: 50,
        useWebWorker: true,
      };
      let uploadedAppLogo;
      await imageCompression(uploadedFile, options).then((x) => {
        uploadedAppLogo = x;
      });
      let uploadedAppLogoThumbnail;
      await imageCompression(uploadedFile, optionsThumbnail).then((x) => {
        uploadedAppLogoThumbnail = x;
      });

      const formData = new FormData();
      formData.append("file", uploadedAppLogo);
      const formDataThumbnail = new FormData();
      formDataThumbnail.append("file", uploadedAppLogoThumbnail);
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
              name.replace(/\s+/g, "-").toLowerCase(),
          },
        }
      );
      axios.post(
        `${
          process.env.REACT_APP_CDS_ENDPOINT
        }appLogo/upload?Authorization=${localStorage.getItem(
          "token"
        )}&workspace=${localStorage.getItem("workspace")}`,
        formDataThumbnail,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            logoName:
              localStorage.getItem("workspace") +
              `${name.replace(/\s+/g, "-").toLowerCase()}_thumbnail`,
          },
        }
      );
      // filePath = `/${cdsAPI.data.file.bucketName}/image/${cdsAPI.data.file.filename}`;
    }
    const data = {
      sourceworkspaceName: "Template",
      sourceminiApp: appName,
      destworkspaceName: localStorage.getItem("workspace"),
      destminiApp: name,
      deviceSupport: targetDevice,
      description: description,
      colorScheme: "red",
    };
    axios
      .post(
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
          "modellerService/cloneApplication",
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((res) => {
        console.log("res.data", res.data);
        closeTemplateModal();
        openConfirmModal();
        closeConfirmModal();
      })
      .catch((e) => console.log(e));
  };

  const screenSelectionToggler = (screenType) => {
    if (screenType == "web") {
      setIsWeb(!isWeb);
    } else if (screenType == "mobile") {
      setIsMobile(!isMobile);
    }
  };
  const acceptedFormats = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/svg+xml",
  ];
  const checkImage = (e) => {
    if (
      e.target.files[0] &&
      !acceptedFormats.includes(e.target.files[0].type)
    ) {
      setInvalidFileType(true);
      setUploadedFile(null);
    } else {
      setUploadedFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (!uploadedFile) {
      setUploadedFilePreview(null);
      return;
    }
    console.log("uploadedFile", uploadedFile);
    const objectUrl = URL.createObjectURL(uploadedFile);
    setUploadedFilePreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [uploadedFile]);

  return (
    <div className="template-main-content">
      <Container fluid className="template-main-cotainer">
        <Row>
          <Row className="go-back-container">
            <Link to="/">
              {" "}
              <img src={LeftArrow} alt="" /> {t("Go back")}
            </Link>
          </Row>
          <Row className="template-details-wrapper">
            <div className="box">
              <ImageLoader
                className="templateAppLogo"
                src={`${
                  fetchTemplateAppData?.logoUrl
                }?Authorization=${localStorage.getItem(
                  "token"
                )}&workspace=${localStorage.getItem("workspace")}`}
              />
            </div>
            <div className="template-title">
              <h3 className="primaryColor">
                {t(templateDetails?.appDisplayName)}
              </h3>
            </div>
            <button
              className="primaryButton primaryButtonColor create-app-template-btn"
              onClick={handleShowTemplateModal}
              disabled={isButtonDisabled}
            >
              {t("Create App From This Template")}
            </button>
          </Row>
        </Row>
        <Row className="template-asset-container">
          <ul className="nav nav-pills mb-5" id="pills-tab" role="tablist">
            <li className="nav-item" role="presentation">
              <label
                className="nav-link active  propertiesPopup template-asset-label"
                id="pills-pages-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-pages"
                type="button"
                role="tab"
                aria-controls="pills-pages"
                aria-selected="true"
              >
                {t("Pages")}
              </label>
            </li>
            <li className="nav-item" role="presentation">
              <label
                className="nav-link propertiesPopup template-asset-label"
                id="pills-workflow-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-workflow"
                type="button"
                role="tab"
                aria-controls="pills-workflow"
                aria-selected="false"
              >
                {t("Workflow")}
              </label>
            </li>
            <li className="nav-item" role="presentation">
              <label
                className="nav-link  propertiesPopup template-asset-label"
                id="pills-user-profile-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-user-profile"
                type="button"
                role="tab"
                aria-controls="pills-user-profile"
                aria-selected="false"
              >
                {t("User profiles")}
              </label>
            </li>
            <li className="nav-item" role="presentation">
              <label
                className="nav-link  propertiesPopup template-asset-label"
                id="pills-data-models-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-data-models"
                type="button"
                role="tab"
                aria-controls="pills-data-models"
                aria-selected="false"
              >
                {t("Data Models")}
              </label>
            </li>
          </ul>
        </Row>
        <div className="template-info-container">
          <div className="tab-content" id="pills-tabContent">
            <div
              className="tab-pane fade show active row "
              id="pills-pages"
              role="tabpanel"
              aria-labelledby="pills-pages-tab"
            >
              <div className="TemplateRowBody">
                <div className="col-6 TemplateRowBodyLeft">
                  {fetchTemplateAppData != null &&
                    t(fetchTemplateAppData?.pages[0]?.description)}
                </div>
                <div className="col-6">
                  {fetchTemplateAppData != null && (
                    <CustomImageSlider>
                      {fetchTemplateAppData?.pages[0]?.screenShotsUrls?.map(
                        (image, index) => {
                          return (
                            <ImageLoader
                              src={`${image}?Authorization=${localStorage.getItem(
                                "token"
                              )}&workspace=${localStorage.getItem(
                                "workspace"
                              )}`}
                              key={index}
                            />
                          );
                        }
                      )}
                    </CustomImageSlider>
                  )}
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade row"
              id="pills-workflow"
              role="tabpanel"
              aria-labelledby="pills-workflow-tab"
            >
              <div className="TemplateRowBody">
                <div className="col-6 TemplateRowBodyLeft">
                  {fetchTemplateAppData != null &&
                    t(fetchTemplateAppData.workFlow[0].description)}
                </div>
                <div className="col-6">
                  {fetchTemplateAppData != null && (
                    <CustomImageSlider>
                      {fetchTemplateAppData?.workFlow[0]?.screenShotsUrls?.map(
                        (image, index) => {
                          return (
                            <img
                              key={index}
                              src={`${image}?Authorization=${localStorage.getItem(
                                "token"
                              )}&workspace=${localStorage.getItem(
                                "workspace"
                              )}`}
                              alt={image}
                              crossOrigin="anonymous"
                            />
                          );
                        }
                      )}
                    </CustomImageSlider>
                  )}
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade row "
              id="pills-user-profile"
              role="tabpanel"
              aria-labelledby="pills-user-profile-tab"
            >
              <div className="TemplateRowBody">
                <div className="col-6 TemplateRowBodyLeft">
                  {fetchTemplateAppData != null &&
                    t(fetchTemplateAppData?.userProfiles[0]?.description)}
                </div>
                <div className="col-6">
                  {fetchTemplateAppData != null && (
                    <CustomImageSlider>
                      {fetchTemplateAppData?.userProfiles[0]?.screenShotsUrls?.map(
                        (image, index) => {
                          return (
                            <img
                              key={index}
                              src={`${image}?Authorization=${localStorage.getItem(
                                "token"
                              )}&workspace=${localStorage.getItem(
                                "workspace"
                              )}`}
                              alt={image}
                              crossOrigin="anonymous"
                            />
                          );
                        }
                      )}
                    </CustomImageSlider>
                  )}
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade row "
              id="pills-data-models"
              role="tabpanel"
              aria-labelledby="pills-data-models-tab"
            >
              <div className="TemplateRowBody">
                <div className="col-6 TemplateRowBodyLeft">
                  {fetchTemplateAppData != null &&
                    t(fetchTemplateAppData?.dataModels[0]?.description)}
                </div>
                <div className="col-6">
                  {fetchTemplateAppData != null && (
                    <CustomImageSlider>
                      {fetchTemplateAppData?.dataModels[0]?.screenShotsUrls?.map(
                        (image, index) => {
                          return (
                            <img
                              key={index}
                              src={`${image}?Authorization=${localStorage.getItem(
                                "token"
                              )}&workspace=${localStorage.getItem(
                                "workspace"
                              )}`}
                              alt={image}
                              crossOrigin="anonymous"
                            />
                          );
                        }
                      )}
                    </CustomImageSlider>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <CommonModelContainer
        modalTitle={t("createNewApp")}
        show={showTemplateModal}
        handleClose={closeTemplateModal}
        centered
        size="md"
        className="createapp"
        id="create-application-model"
      >
        <Modal.Body className="py-2 px-4 create-new-app-modal">
          <Row>
            <Col>
              <Row className="">
                <Col className="me-2">
                  <div className="application py-2">
                    <span className="form-subheading secondaryColor">
                      {t("applicationName")}{" "}
                      <span className="appdesignerappname secondaryColor">
                        *
                      </span>
                    </span>
                    <input
                      id="create-app-name-input"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="appdesignerinput"
                      placeholder={t("enterApplicationName")}
                    />
                  </div>
                </Col>
              </Row>
              <Row className="">
                <Col className="me-2">
                  <div className="py-2 application">
                    <span
                      className="form-subheading secondaryColor"
                      id="create-app-description"
                    >
                      {t("description")}
                      <span className="appdesignerappname">*</span>
                    </span>

                    <textarea
                      id="create-app-desc-text"
                      value={description}
                      onChange={(e) => {
                        let input = e.target.value;
                        // setDescriptionCharLeft(250 - input.length);
                        setDescription(e.target.value);
                      }}
                      maxLength="250"
                      className="customScrollBar descTextArea"
                      placeholder={t("enterDescriptionHere")}
                    />
                    {/* <p className="DescriptionLimit">
                      {descriptionCharLeft}/250
                    </p> */}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col
                  className="
                  "
                >
                  <div className="py-2">
                    <span
                      id="create-app-device-support"
                      className="form-subheading secondaryColor"
                    >
                      {t("selectDeviceSupport")}{" "}
                      {/* <span className="appdesignerappname secondaryColor">
                        *
                      </span> */}
                    </span>
                    <div className="choosdevice pt-2 pb-1">
                      {/* <div className="sb-checkbox"> */}
                      <div
                        id="create-app-device-web-div"
                        onClick={() => screenSelectionToggler("web")}
                        className="ps-3 col-md-6 col-lg-6 col-sm-6 d-flex align-items-start"
                      >
                        <div className="d-flex flex-column align-items-center justify-content-between">
                          <img
                            id="create-app-device-support-web"
                            className="mt-1"
                            src={isWeb ? LaptopIcoRed : LaptopIco}
                            // onMouseOver={this.src = require({LaptopIcoRed})}
                            // onMouseOut={this.src = require({LaptopIco})}
                            onMouseOver={(e) =>
                              (e.currentTarget.src = LaptopIcoRed)
                            }
                            onMouseOut={
                              (e) => {
                                if (isWeb) {
                                  e.currentTarget.src = LaptopIcoRed;
                                } else {
                                  e.currentTarget.src = LaptopIco;
                                }
                              }
                              // (e.currentTarget.src = LaptopIco)
                            }
                          />
                          <span
                            id="create-app-device-support-web-span"
                            className={
                              isWeb
                                ? "choose-screen-text-selected mt-2 secondaryColor"
                                : "choose-screen-text mt-2 secondaryColor"
                            }
                            // onMouseOver={e => (e.currentTarget.className = "choose-screen-text-selected")}
                            // onMouseOut={e => (e.currentTarget.className = "choose-screen-text")}
                          >
                            {t("web")}
                          </span>
                        </div>
                      </div>

                      {/* </div> */}
                      {/* <div className="sb-checkbox"> */}
                      <div
                        id="create-app-device-support-mobile-div"
                        onClick={() => screenSelectionToggler("mobile")}
                        className="col-md-6 col-lg-6 col-sm-6 d-flex  align-items-start"
                      >
                        <div className="d-flex flex-column align-items-center justify-content-between">
                          <img
                            id="create-app-device-support-mob-image"
                            className="mt-1"
                            src={isMobile ? PhoneIcoRed : PhoneIco}
                            onMouseOver={(e) =>
                              (e.currentTarget.src = PhoneIcoRed)
                            }
                            onMouseOut={(e) => {
                              if (isMobile) {
                                e.currentTarget.src = PhoneIcoRed;
                              } else {
                                e.currentTarget.src = PhoneIco;
                              }
                            }}
                          />
                          <span
                            id="create-app-device-support-mob-span"
                            className={
                              isMobile
                                ? "choose-screen-text-selected mt-2 secondaryColor"
                                : "choose-screen-text mt-2 secondaryColor"
                            }
                          >
                            {t("mobile")}
                          </span>
                        </div>
                      </div>

                      {/* </div> */}
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col>
              <Col className="ms-2">
                <div className="py-2">
                  <div className="colorscheme2">
                    <span
                      id="create-app-color-span"
                      className="form-subheading secondaryColor"
                    >
                      {t("uploadImage")}
                      {/* <span className="appdesignerappname secondaryColor">
                        *
                      </span> */}
                    </span>
                    <div className="appdesignercreatecolorscheme">
                      <Row className="">
                        <label
                          id="create-app-upload-img"
                          className="Browse3 secondaryColor"
                          for="upload-img"
                        >
                          <input
                            type="file"
                            className="file"
                            id="upload-img"
                            accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                            onChange={(e) => {
                              checkImage(e);
                            }}
                            onClick={(e) => {
                              const { target = {} } = e || {};
                              target.value = "";
                            }}
                          />
                          {uploadedFile == null ? (
                            <>
                              <img
                                src={UploadFileCreateApp}
                                id="create-app-uploaded-img"
                                className="mx-1"
                              />

                              <h6 className="primaryColor">
                                {" "}
                                <span>{t("clicktoUpload")}</span>
                                {/* <small>or drag and drop</small> */}
                              </h6>
                              <p className="secondaryColor">
                                {t("Accepted file SVG, PNG OR JPG")}
                              </p>
                              {invalidFileType && (
                                <p
                                  className="secondaryColor"
                                  style={{ color: "red" }}
                                >
                                  Please upload a SVG, PNG or JPG file.
                                </p>
                              )}
                            </>
                          ) : (
                            <div className="appdesigneruploadimg">
                              <img
                                id="create-app-upload-preview"
                                height={85}
                                width={85}
                                className="appdesignerimagecurve"
                                src={uploadedFilePreview}
                              />
                              <ReactTooltip
                                id={uploadedFile.name}
                                place="bottom"
                                className="tooltipCustom"
                                arrowColor="rgba(0, 0, 0, 0)"
                                effect="float"
                              >
                                <span
                                  id="create-app-uploaded-file-name"
                                  className="appdesigneruploadedfile secondaryColor"
                                >
                                  {uploadedFile.name}
                                </span>
                              </ReactTooltip>
                            </div>
                          )}
                        </label>
                        {uploadedFile !== null ? (
                          <div className="removeUploadeImage">
                            <span
                              className="secondaryColor"
                              onClick={() => setUploadedFile(null)}
                            >
                              Remove Image
                            </span>
                            <p className="secondaryColor">
                              {t("Accepted file SVG, PNG OR JPG")}
                            </p>
                          </div>
                        ) : null}
                      </Row>
                      {/* {uploadedFile != null ? (
                          
                        )} */}
                    </div>
                  </div>
                </div>
              </Col>
            </Col>

            {/* cancle */}
            <Row>
              <div className="col-12 mt-4 mb-2 mt-4 appdesigner-editapp-cancel">
                <button
                  id="create-app-cancel-btn"
                  className="secondaryButton secondaryButtonColor cancelBtnAppDash"
                  onClick={closeTemplateModal}
                >
                  {t("cancel")}
                </button>
                <button
                  id="create-app-create-btn"
                  className="primaryButton primaryButtonColor template-create-app-btn"
                  onClick={handleCreateTemplate}
                  disabled={
                    // targetDevice == "" ||
                    description == "" || name == ""
                      ? // (appProfilePicColor == null && uploadedFile == null)
                        true
                      : false
                  }
                >
                  {t("createApp")}
                </button>
              </div>
            </Row>
            {/* <Row>
                <div className="excel">
                  Want to create application by Excel?
                  <span
                    id="create-app-excel-span"
                    className="upload"
                    onClick={() => {
                      setCreateNewAppUsingExcelModal(true);
                      setShowNewAppModel(false);
                    }}
                  >
                    Upload Excel
                  </span>
                </div>
              </Row> */}
          </Row>
        </Modal.Body>
      </CommonModelContainer>
      <CommonModelContainer
        modalTitle="Confirmation"
        show={confirmAppModal}
        handleClose={closeConfirmModal}
        centered
        size="sm"
        className="confirmation-modal"
      >
        <div className="confirm-checkedIcon">
          <img src={checked} />
        </div>
        <div className="confirm-bottom">
          <p className="secondaryColor">
            {name} has been created successfully!!!
          </p>
        </div>
      </CommonModelContainer>
    </div>
  );
};

export default Template;
