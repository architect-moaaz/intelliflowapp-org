import React, { useState, useEffect } from "react";
import axios from "axios";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import "./AssetUiStyles.css";
import arrowRightSquareFill from "../../../assets/Icons/arrowRightSquareFill.svg";
import SearchInput, { createFilter } from "react-search-input";
import MultiMenus from "./MultiMenus";
import { FileUploader } from "react-drag-drop-files";
import "./MultiMenus.css";
import { Link } from "react-router-dom";
import { AddAsset } from "../../../assets";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import deleteIcon from "../../../assets/Icons/delete-orange.svg";
import checked from "../../../assets/Icons/checked-green.svg";
import { ReactComponent as AddAssets } from "../../../assets/NewIcon/AddAssets.svg";
import Draggable from "react-draggable";
import { useTranslation } from "react-i18next";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center",
};


const AssetUi = ({ doGetAllResources }) => {
  const [t, i18n] = useTranslation("common");
  const [openModelOne, setOpenModelOne] = useState(false);
  const [openModelTwo, setOpenModelTwo] = useState(false);
  const [openModelThree, setOpenModelThree] = useState(false);
  const [fileName, setFileName] = useState("");
  const [selectOption, setSelectOption] = useState("");
  const [orangeButtonId, setOrangeButtonId] = useState(null);
  const [fileUpload, setFileUpload] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showApplication, setShowApplication] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [byteArrayResult, setByteArrayResult] = useState([]);
  const [assetDropdownData, setAssetDropdownData] = useState([]);
  const [fileCreatedDataUploaded, setFileCreatedDataUploaded] = useState("");
  const [totalNumberOfFormsCreated, setTotalNumberOfFormsCreated] = useState();
  const [totalNumberOfFormsAllowed, setTotalNumberOfFormsAllowed] = useState();

{t("mobile")}

  const KEYS_TO_FILTERS = ["label", "submenu.label"];
  const fileTypes = ["java", "bpmn", "bpmn2", "frm", "dmn", "page"];
  const options = [
    { key: "", value: t("Select File Type") },
    { key: "datamodel", value: t("Data Model") },
    { key: "bpmn", value: t("Work Flow") },
    { key: "form", value: t("Form Builder") },
    { key: "dmn", value: t("Business Rules") },
    { key: "page", value: t("Home Pages") },
  ];
  const [homepage, setHomepage] = useState(false);

  useEffect(() => {
    checkHopePageAvailable(localStorage.getItem("appName"));
  }, [openModelOne]);

  const checkHopePageAvailable = async (appName, workspace) => {
    const json5 = require("json5");
    let fileName = `${workspace}-${appName}.page`;
    const postData = {
      workspaceName: localStorage.getItem("workspace"),
      miniAppName: appName,
      fileName: fileName,
      fileType: "form",
    };

    await axios
      .post(
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
          "modellerService/fetchFile/content",
        postData
      )
      .then((res) => {
        if (
          res.data.message === `File ${fileName}.page found and data loaded`
        ) {
          setHomepage(true);
        } else {
          setHomepage(false);
        }
      })
      .catch((e) => {
        console.log("Error ", e);
        setHomepage(false);
      });
  };

  const convertToByte = (data) => {
    var fileByteArray = [];
    const reader = new FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = (evt) => {
      if (evt.target.readyState === FileReader.DONE) {
        const arrayBuffer = evt.target.result,
          array = new Uint8Array(arrayBuffer);
        for (const a of array) {
          fileByteArray.push(a);
        }
        setByteArrayResult([
          ...byteArrayResult,
          { [data.name]: fileByteArray },
        ]);
      }
    };
  };

  const removeFile = (filess) => () => {
    const newFiles = [...byteArrayResult];
    newFiles.splice(newFiles.indexOf(filess), 1);
    setByteArrayResult(newFiles);
  };

  const handleFileUpload = (files) => {
    setFileUpload(files);
    convertToByte(files);
  };

  useEffect(() => {
    if (byteArrayResult.length == 0) {
      setFileUpload(null);
    }
  }, [byteArrayResult]);

  const searchUpdated = (term) => {
    setSearchTerm(term);
  };

  const onOpenModalOne = () => {
    setOpenModelOne(true);
    setByteArrayResult([]);
  };

  const onCloseModalOne = () => {
    setOpenModelOne(false);
    setSelectOption("");
    setFileName("");
  };

  const onOpenModalTwo = () => {
    setOpenModelTwo(true);
    setOpenModelOne(false);
    setSelectOption("");
    setFileName("");
    setOrangeButton("");
  };

  const onCloseModalTwo = () => {
    setOpenModelTwo(false);
    setByteArrayResult([]);
  };

  const onOpenModalThree = () => {
    setOpenModelThree(true);
  };

  const onCloseModalThree = () => {
    setTimeout(() => {
      setOpenModelThree(false);
    }, 3000);
  };

  const handleSelectOption = (e) => {
    setSelectOption(e.target.value);
    // if (e.target.value === "homePage") {
    //   setFileName(`${localStorage.getItem("appName")}_HOMEPAGE`);
    // } else {
    setFileName("");
    // }
  };

  const handleGoBack = () => {
    setOpenModelTwo(false);
    setOpenModelOne(true);
    setByteArrayResult([]);
    setOrangeButton("");
  };

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
        setTotalNumberOfFormsAllowed(response.data.config.noOfFormsPerApp);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    subscribe();
  }, []);
  const handleAddAsset = () => {
    if (byteArrayResult.length != 0) {
      
      byteArrayResult.forEach((files) => {
        var file = Object.values(files).flat();
        var extension = Object.keys(files).toString().split(".").pop();

        let fileType;
        switch (extension) {
          case "frm":
            fileType = "form";
            break;
          case "dmn":
            fileType = "dmn";
            break;
          case "java":
            fileType = "datamodel";
            break;
          case "bpmn" || "bpmn2":
            fileType = "bpmn";
            break;
          case "page":
            fileType = "page";
            break;
          default:
            fileType = "";
        }

        const postData1 = {
          workspaceName: localStorage.getItem("workspace"),
          miniAppName: localStorage.getItem("appName"),
          fileName: Object.keys(files)
            .toString()
            .split(".")
            .slice(0, -1)
            .join("."),
          fileType: fileType,
          fileContent: file,
        };

        const headers = {
          "Content-Type": "application/json",
        };
        axios
          .post(
            process.env.REACT_APP_MODELLER_API_ENDPOINT +
              "modellerService/formmodeller/createFile",
            postData1,
            { headers }
          )
          .then((response) => {
            var message = response.data.message;
            if (message == "Maximum limit reached for Forms"){
              toast.error("Maximum limit reached for Forms", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            }
            else {
              console.log("postdata1", response);
            setFileCreatedDataUploaded(response);
            // onCloseModalOne();
            // console.log("response-228", response);
            setOpenModelOne(false);
            setOpenModelTwo(false);
            onOpenModalThree();
            doGetAllResources();
            onCloseModalThree();
            toast.success("Asset Added Successfully", {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
          });
      });
    } else if (fileName != "" && selectOption != "") {
      let fileType = "";
      fileType = selectOption;
      var postData2 = {
        workspaceName: localStorage.getItem("workspace"),
        miniAppName: localStorage.getItem("appName"),
        fileName: fileName,
        fileType: fileType,
      };

      const headers = {
        "Content-Type": "application/json",
      };

      let modelerType;
      switch (fileType) {
        case "form":  
        case "page":
          modelerType = "formmodeller";
          break;
        case "dmn":
          modelerType = "dmnmodeller";
          break;
        case "datamodel":
          modelerType = "datamodeller";
          break;
        case "bpmn":
          modelerType = "bpmnmodeller";
          break;
        default:
          modelerType = "";
      }

      axios
        .post(
          process.env.REACT_APP_MODELLER_API_ENDPOINT +
            `modellerService/${modelerType}/createFile`,
          postData2,
          { headers }
        )
        .then((response) => {
          var message = response.data.message;
            if (message == "Maximum limit reached for Forms"){
              toast.error("Maximum limit reached for Forms", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            }
            else {
          setFileCreatedDataUploaded(response);
          onCloseModalOne();
          onOpenModalThree();
          doGetAllResources();
          onCloseModalThree();
          toast.success("Asset Added Successfully", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        });
    }
  };

  var newArray = [];

  useEffect(() => {
    const postData = {
      workspaceName: localStorage.getItem("workspace"),
      miniAppName: localStorage.getItem("appName"),
    };

    const headers = {
      "Content-Type": "application/json",
    };

    axios
      .post(
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
          "modellerService/getResources",
        postData,
        {
          headers,
        }
      )
      .then((response) => {
        setAssetDropdownData(response.data.data);
        setTotalNumberOfFormsCreated(response.data.data.form.length)
      });
  }, [fileCreatedDataUploaded]);

  for (let k in assetDropdownData) {
    const inn = assetDropdownData[k].map((e) => ({
      label: e.resourceName,
    }));
    newArray.push({ label: k, submenu: inn });
  }

  var filteredEmails = newArray.filter(
    createFilter(searchTerm, KEYS_TO_FILTERS)
  );

  var setOrangeButton = (id) => {
    setOrangeButtonId(id);
    if (id === 1) {
      setShowTemplate(true);
      setShowApplication(false);
    } else if (id === 2) {
      setShowApplication(true);
      setShowTemplate(false);
    } else {
      setShowApplication(false);
      setShowTemplate(false);
    }
  };

  const closeIcon = (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.83265 7.00019L13.5244 2.71019C13.7299 2.52188 13.8453 2.26649 13.8453 2.00019C13.8453 1.73388 13.7299 1.47849 13.5244 1.29019C13.319 1.10188 13.0403 0.996094 12.7497 0.996094C12.4592 0.996094 12.1805 1.10188 11.975 1.29019L7.29419 5.59019L2.61333 1.29019C2.40787 1.10188 2.12921 0.996094 1.83865 0.996094C1.54808 0.996094 1.26942 1.10188 1.06396 1.29019C0.858499 1.47849 0.743073 1.73388 0.743073 2.00019C0.743073 2.26649 0.858499 2.52188 1.06396 2.71019L5.75573 7.00019L1.06396 11.2902C0.961691 11.3831 0.880519 11.4937 0.825125 11.6156C0.769731 11.7375 0.741211 11.8682 0.741211 12.0002C0.741211 12.1322 0.769731 12.2629 0.825125 12.3848C0.880519 12.5066 0.961691 12.6172 1.06396 12.7102C1.16539 12.8039 1.28607 12.8783 1.41903 12.9291C1.55199 12.9798 1.69461 13.006 1.83865 13.006C1.98269 13.006 2.1253 12.9798 2.25826 12.9291C2.39122 12.8783 2.5119 12.8039 2.61333 12.7102L7.29419 8.41019L11.975 12.7102C12.0765 12.8039 12.1972 12.8783 12.3301 12.9291C12.4631 12.9798 12.6057 13.006 12.7497 13.006C12.8938 13.006 13.0364 12.9798 13.1693 12.9291C13.3023 12.8783 13.423 12.8039 13.5244 12.7102C13.6267 12.6172 13.7079 12.5066 13.7633 12.3848C13.8186 12.2629 13.8472 12.1322 13.8472 12.0002C13.8472 11.8682 13.8186 11.7375 13.7633 11.6156C13.7079 11.4937 13.6267 11.3831 13.5244 11.2902L8.83265 7.00019Z"
        fill="white"
      />
    </svg>
  );

  return (
    <div style={styles}>
      <Link onClick={onOpenModalOne} id="assetUi-modal" to="#">
        <AddAssets className="svg-fill iconFillhover iconSvgFillColor" />
      </Link>
      <Modal
        open={openModelOne}
        onClose={onCloseModalOne}
        classNames={{
          overlay: "customOverlayAssetUi",
          modal: "customModalAssetUi",
        }}
        closeIcon={closeIcon}
        id="assetUi-modal-open"
      >
        <div className="innerContainer">
          <div className="popupTop header-main-nav">
            <p className="secondaryColor">{t("Add Asset")}</p>
          </div>
          <div className="popupBottom ">
            <div className=" popupBottomContainer ">
              <div className="popupBottomLeft">
                <p className="secondaryColor">
                  {t("File Type")} <spam className="file-required">*</spam>
                </p>
                <div className="select">
                  <select
                    value={selectOption}
                    onChange={handleSelectOption}
                    id="assetUi-select-file-type"
                  >
                    {options.map((option) => {
                      return (
                        <option value={option.key} key={option.key}>
                          {option.value}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <p className="secondaryColor">{t("File Name")}</p>
                <input
                  type="text"
                  placeholder="Enter File Name"
                  name="EnterFileName"
                  value={fileName}
                  disabled={selectOption === "homePage" ? true : false}
                  onChange={(e) => setFileName(e.target.value)}
                  id="assetUi-fileName"
                />

                <div className="AssetBtn">
                  <button
                    className="secondaryButton secondaryButtonColor"
                    // onClick={toggle}
                    onClick={onOpenModalTwo}
                    id="assetUi-importAsset"
                  >
                    {t("Import Asset")}
                  </button>

                  <button
                    className="primaryButton primaryButtonColor"
                    onClick={handleAddAsset}
                    id="assetUi-add-asset-btn"
                  >
                    {t("Add Asset(s)")}
                  </button>
                </div>
                {/* <div
                  className={
                    orangeButtonId === 2
                      ? "selectTemp orangeBorder"
                      : "selectTemp"
                  }
                >
                  <p>
                    Select from your Applications{" "}
                    <button
                     id="assetUi-select-temp-btn"
                      className="selectTempBtn"
                      onClick={() => setOrangeButton(2)}
                    >
                      <img src={arrowRightSquareFill} />
                    </button>
                  </p>
                </div> */}
              </div>
            </div>
            {showApplication && (
              <div className="popupBottomContainer">
                <div className="popupBottomRight">
                  <div className="yourApplication">
                    <p className="secondaryColor">{t("Your Application")}</p>
                  </div>
                  <div>
                    <SearchInput
                      className="search-input"
                      onChange={searchUpdated}
                      id="assetUi-search-applications"
                    />
                    <div className="mail" key={newArray.submenu}>
                      <div className="dropDownMenu">
                        <MultiMenus newMenus={filteredEmails} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {showTemplate && (
              <div className="popupBottomContainer">
                <div className="popupBottomRight">
                  <div className="yourApplication">
                    <p className="secondaryColor">{t("Templates")}</p>
                  </div>
                  <div>
                    <SearchInput
                      id="assetUi-search-templates"
                      className="search-input"
                      onChange={searchUpdated}
                    />
                    <div className="mail" key={newArray.submenu}>
                      <div className="dropDownMenu">
                        <MultiMenus
                          newMenus={filteredEmails}
                          id="assetUi-multiMenu"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
      <Modal
        open={openModelTwo}
        onClose={onCloseModalTwo}
        classNames={{
          overlay: "customOverlayAssetUi",
          modal: "customModalAssetUi",
        }}
        closeIcon={closeIcon}
        id="assetUi-import-asset-modal"
      >
        <div className="innerContainer">
          <div className="popupTop header-main-nav">
            <p className="secondaryColor">{t("Import Asset")}</p>
          </div>
          <div className="popupBottom row">
            <div className="popupBottomContainer ">
              <div className="popupBottomLeft">
                {/* {isOpened && ( */}
                <p className="secondaryColor">{t("Import File")}</p>
                <div className="fileUploader">
                  <FileUploader
                    // multiple={true}
                    handleChange={handleFileUpload}
                    name="fileUpload"
                    types={fileTypes}
                    fileOrFiles={fileUpload}
                    id="assetUi-fileUpload"
                    // multiple={true}
                  >
                    {/* {fileUpload ? (
                      <div className="fileUploaderText">
                        <p>File Uploaded Successfully</p>
                      </div>
                    ) : ( */}
                    <div className="fileUploaderText">
                      <p className="secondaryColor">
                       {t("Drag & Drop your file here")}
                      </p>
                      <p className="secondaryColor">{t("or")}</p>
                      <p className="secondaryColor">{t("Browse")}</p>
                    </div>
                    {/* )} */}
                  </FileUploader>
                  {byteArrayResult.length !== 0 && (
                    <div className="UploadedDataDiv">
                      <p className="secondaryColor">{t("Uploaded")}</p>
                      <ul
                        className={
                          byteArrayResult.length > 3 ? "imageUploadScroll" : ""
                        }
                      >
                        {byteArrayResult.map((filess) => (
                          <li key={Object.keys(filess)}>
                            <span className="uploadFileName secondaryColor">
                              {Object.keys(filess)}
                            </span>
                            <img
                              onClick={removeFile(filess)}
                              src={deleteIcon}
                              alt="React Logo"
                              id="assetUi-remove-fileLogo"
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                {/* )} */}
                <div className="AssetBtn">
                  <button
                    className="secondaryButton secondaryButtonColor"
                    // onClick={toggle}
                    onClick={handleGoBack}
                    id="assetUi-back-btn"
                  >
                    {t("Go Back")}
                  </button>

                  <button
                    className="primaryButton primaryButtonColor"
                    onClick={handleAddAsset}
                    id="assetUi-addAssets"
                  >
                    {t("Add Asset(s)")}
                  </button>
                </div>

                {/* <div
                  className={
                    orangeButtonId === 1
                      ? "selectTemp orangeBorder"
                      : "selectTemp"
                  }
                >
                  <p>
                    Select from Pre-built Templates
                    <button
                      className="selectTempBtn"
                      onClick={() => setOrangeButton(1)}
                    >
                      <img src={arrowRightSquareFill} />
                    </button>
                  </p>
                </div> */}
                <div
                  className={
                    orangeButtonId === 2
                      ? "selectTemp orangeBorder"
                      : "selectTemp"
                  }
                >
                  <p className="secondaryColor">
                   {t("Select from your Applications")}
                    <button
                      className="selectTempBtn"
                      onClick={() => setOrangeButton(2)}
                      id="assetUi-select-btn"
                    >
                      <img src={arrowRightSquareFill} />
                    </button>
                  </p>
                </div>
              </div>
            </div>
            {showApplication && (
              <div className="popupBottomContainer">
                <div className="popupBottomRight">
                  <div className="yourApplication">
                    <p className="secondaryColor">{t("Your Application")}</p>
                  </div>
                  <div>
                    <SearchInput
                      className="search-input"
                      onChange={searchUpdated}
                      id="assetUi-search-update-apps"
                    />
                    <div className="mail" key={newArray.submenu}>
                      <div className="dropDownMenu">
                        <MultiMenus newMenus={filteredEmails} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {showTemplate && (
              <div className="popupBottomContainer">
                <div className="popupBottomRight">
                  <div className="yourApplication">
                    <p className="secondaryColor">{t("Templates")}</p>
                  </div>
                  <div>
                    <SearchInput
                      className="search-input"
                      onChange={searchUpdated}
                      id="assetUi-search-update-template"
                    />
                    <div className="mail" key={newArray.submenu}>
                      <div className="dropDownMenu">
                        <MultiMenus newMenus={filteredEmails} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
      <Modal
        open={openModelThree}
        onClose={onCloseModalThree}
        classNames={{
          overlay: "customOverlayAssetUi",
          modal: "customModalAssetUi",
        }}
        closeIcon={closeIcon}
        id="assetUi-open-modal-three"
      >
        <div className="innerContainer">
          <div className="popupTop header-main-nav">
            <p className="secondaryColor">{t("Confirmation")}</p>
          </div>
          <div className="checkedIcon">
            <img src={checked} />
          </div>
          <div className="popupBottom row">
            <p className="secondaryColor">
              {t("Asset has been created successfully!!!")}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AssetUi;
