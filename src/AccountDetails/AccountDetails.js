import React, { useState, useEffect } from "react";
import "./AccountDetails.css";
import axios from "axios";
import { Icon } from "@iconify/react";
import { Cropper } from "react-cropper";
import { Row, Col, Container, Modal } from "react-bootstrap";
import urlExist from "url-exist";
import CommonModelContainer from "../components/CommonModel/CommonModelContainer";
import imageCompression from "browser-image-compression";
import { ToastContainer, toast } from "react-toastify";
import { IFlogoWhiteBorder } from "../assets";

import TimezoneSelector from "../components/DateAndTime/TimezoneSelector";
import { saveWorkspaceTimezone } from "./../components/DateAndTime/TimezoneHelper";

const AccountDetails = ({ setheaderTitle }) => {
  setheaderTitle("Subscription Details");

  const [profImage, setProfImgae] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [changeCompanyModal, setChangeCompanyModal] = useState(false);
  const [changeCompanyLogoModal, setChangeCompanyLogoModal] = useState(false);
  const [localImageCompany, setLocalImageCompany] = useState(null);
  const [localImageCompanyLogo, setLocalImageCompanyLogo] = useState(null);
  const [imagesCompany, setImagesCompany] = useState(null);
  const [imagesCompanyLogo, setImagesCompanyLogo] = useState(null);
  const [cropperCompany, setCropperCompany] = useState();
  const [cropperCompanyLogo, setCropperCompanyLogo] = useState();
  const [noofApps, setNoOfApps] = useState();
  const [noofFormsPerApp, setNoOfFormsPerApp] = useState();
  const [noofTabsinSpreadSheet, setNoOfTabsinSpreadSheet] = useState();
  const [noofTotalApps, setNoOfTotalApps] = useState();

  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [selectedLocale, setSelectedLocale] = useState("");

  useEffect(() => {
    let timezonetemp = localStorage.getItem("workspacetimezone");
    // console.log("tmztemp",timezonetemp)
    setSelectedTimezone(timezonetemp);
  }, []);

  useEffect(async () => {
    var fileurl = `${
      process.env.REACT_APP_CDS_ENDPOINT
    }IFprofilePicture/image/${localStorage.getItem(
      "id"
    )}?Authorization=${localStorage.getItem(
      "token"
    )}&workspace=${localStorage.getItem("workspace")}`;
    const exists = await urlExist(fileurl);

    setProfileImage("");
    if (exists) setProfileImage(fileurl);
  }, [profImage]);

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
        setNoOfApps(response.data.config.noOfApps);
        setNoOfFormsPerApp(response.data.config.noOfFormsPerApp);
        setNoOfTabsinSpreadSheet(response.data.config.noOfTabsinSpreadSheet);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const totalNumberOfApps = () => {
    const axios = require("axios");

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url:
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
        "modellerService/" +
        localStorage.getItem("workspace") +
        "/data",
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        setNoOfTotalApps(response.data.data.data.count.totalApps);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    subscribe();
    totalNumberOfApps();
  }, []);
  var userRole = localStorage.getItem("currentRole").replace(/"/g, "");

  const handleChangeCompanyModal = () => {
    setChangeCompanyModal(!changeCompanyModal);
  };
  const handleChangeCompanyLogoModal = () => {
    setChangeCompanyLogoModal(!changeCompanyLogoModal);
  };
  const onSaveCompany = () => {
    if (localImageCompany) {
      // getCroppedData();
      imageUploaderCompany();
      handleChangeCompanyModal();
    }
  };
  const onSaveCompanyLogo = () => {
    if (localImageCompanyLogo) {
      // getCroppedData();
      imageUploaderCompanyLogo();
      handleChangeCompanyLogoModal();
    }
  };
  const handleImageChangeCompany = (e) => {
    setLocalImageCompany(e.target.files[0]);
    setImagesCompany(URL.createObjectURL(e.target.files[0]));
  };
  const handleImageChangeCompanyLogo = (e) => {
    setLocalImageCompanyLogo(e.target.files[0]);
    setImagesCompanyLogo(URL.createObjectURL(e.target.files[0]));
  };

  const imageUploaderCompany = async () => {
    var imageFileCompany = getCroppedDataCompany();

    const options = {
      maxSizeMB: 0.01,
      maxWidthOrHeight: 150,
      useWebWorker: true,
    };
    let uploadProfilePicCompany;
    await imageCompression(imageFileCompany, options).then((x) => {
      uploadProfilePicCompany = x;
    });

    const appName = "appLogo";
    var bodyFormData = new FormData();
    bodyFormData.append("file", uploadProfilePicCompany);

    const response = await axios.post(
      `${
        process.env.REACT_APP_CDS_ENDPOINT + appName
      }/upload?Authorization=${localStorage.getItem(
        "token"
      )}&workspace=${localStorage.getItem("workspace")}`,
      bodyFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          logoName: localStorage.getItem("username"),
        },
      }
    );
    setImagesCompany(new Date().toISOString());
    return response;
  };

  const imageUploaderCompanyLogo = async () => {
    var imageFileCompanyLogo = getCroppedDataCompanyLogo();

    const options = {
      maxSizeMB: 0.01,
      maxWidthOrHeight: 150,
      useWebWorker: true,
    };
    let uploadProfilePicCompanyLogo;
    await imageCompression(imageFileCompanyLogo, options).then((x) => {
      uploadProfilePicCompanyLogo = x;
    });

    const appName = "appLogo";
    var bodyFormDataLogo = new FormData();
    bodyFormDataLogo.append("file", uploadProfilePicCompanyLogo);

    const response = await axios.post(
      `${
        process.env.REACT_APP_CDS_ENDPOINT + appName
      }/upload?Authorization=${localStorage.getItem(
        "token"
      )}&workspace=${localStorage.getItem("workspace")}`,
      bodyFormDataLogo,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          logoName: localStorage.getItem("workspace") + "_companylogo",
        },
      }
    );
    setImagesCompanyLogo(new Date().toISOString());
    return response;
  };

  let urlToFileCompany = (url) => {
    let arr = url.split(",");

    let mime = arr[0].match(/:(.*?);/)[1];
    let data = arr[1];
    let dataString = atob(data);

    let n = dataString.length;
    let dataArr = new Uint8Array(n);

    while (n--) {
      dataArr[n] = dataString.charCodeAt(n);
    }

    let file = new File([dataArr], "File.jpeg", { type: mime });

    return file;
  };
  let urlToFileCompanyLogo = (url) => {
    let arr = url.split(",");

    let mime = arr[0].match(/:(.*?);/)[1];
    let data = arr[1];
    let dataString = atob(data);

    let n = dataString.length;
    let dataArr = new Uint8Array(n);

    while (n--) {
      dataArr[n] = dataString.charCodeAt(n);
    }

    let file = new File([dataArr], "File.jpeg", { type: mime });

    return file;
  };
  const getCroppedDataCompany = (e) => {
    if (typeof cropperCompany !== "undefined") {
      setLocalImageCompany(cropperCompany.getCroppedCanvas().toDataURL());
      var imageFileCompany = cropperCompany.getCroppedCanvas().toDataURL();
      var finalImageCompany = urlToFileCompany(imageFileCompany);
    }

    return finalImageCompany;
  };
  const getCroppedDataCompanyLogo = (e) => {
    if (typeof cropperCompanyLogo !== "undefined") {
      setLocalImageCompanyLogo(
        cropperCompanyLogo.getCroppedCanvas().toDataURL()
      );
      var imageFileCompanyLogo = cropperCompanyLogo
        .getCroppedCanvas()
        .toDataURL();
      var finalImageCompanyLogo = urlToFileCompanyLogo(imageFileCompanyLogo);
    }

    return finalImageCompanyLogo;
  };

  const callSaveWorkspaceTimezone = () => {
    let workspace = localStorage.getItem("workspace");

    saveWorkspaceTimezone(workspace, selectedTimezone, selectedLocale).then(
      (data) => {
        if (data.status == "success") {
          toast.success("Selected timezone saved ", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          window.location.reload();
        } else if (data.status == "failed") {
          toast.error("Couldn't save the timezone", {
            position: "bottom-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      }
    );
  };

  return (
    <div className="acc-details">
      <Container fluid className="my-profile-container-acc-details">
        <Row className="profile-info-section-acc-details">
          <div className="subscription-details">
            <div className="profile-info-wrapper-acc-details">
              <div className="profile-user-info-acc-details">
                {profileImage ? (
                  <img
                    className="profile-user-uploaded-img-acc-details"
                    src={profileImage}
                    alt=""
                    crossOrigin="Anonymous"
                  />
                ) : null}
              </div>
              <div className="profile-user-cred-acc-details">
                <span className="secondaryColor">
                  {localStorage.getItem("firstName")}{" "}
                </span>
                <p className="secondaryColor">{userRole}</p>
                <p className="secondaryColor">
                  {localStorage.getItem("email")}
                </p>
                <div className="company-picture">
                  <span
                    className="secondaryColor"
                    onClick={handleChangeCompanyModal}
                    style={{
                      fontSize: "15px",
                      cursor: "pointer",
                      color: "rgba(60, 60, 60, 0.8)",
                    }}
                  >
                    Change Company Picture
                  </span>
                </div>
                <div className="company-logo">
                  <span
                    className="secondaryColor"
                    onClick={handleChangeCompanyLogoModal}
                    style={{
                      fontSize: "15px",
                      cursor: "pointer",
                      color: "rgba(60, 60, 60, 0.8)",
                    }}
                  >
                    Change Company Logo
                  </span>
                </div>
              </div>
            </div>

            <div className="days-left-box">
              <h5>333</h5>
              <p>Days Left</p>
            </div>
          </div>
        </Row>
      </Container>
      <div className="about-usage-line"></div>
      <div className="container-fluid mt-3">
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <div className="my-2">Set Workspace Timezone</div>
            <div>
              <TimezoneSelector
                setSelectedTimezone={setSelectedTimezone}
                setSelectedLocale={setSelectedLocale}
                selectedTimezone={selectedTimezone}
              />{" "}
              <button
                className="primaryButton"
                onClick={() => callSaveWorkspaceTimezone()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="about-usage-line"></div>
      <div className="usage-section customScrollBar">
        <h5 className="usage-text primaryColor">SUBSCRIPTION USAGE</h5>
        <div className="app-created-usage-wrapper">
          <div className="total-number-apps">
            <div className="subscription-details-box-icon">
              <img src={IFlogoWhiteBorder} />
            </div>
            <div className="subscription-usage-app-count">
              <h5 className="number-of-app-count primaryColor">
                {noofTotalApps}/{noofApps}
              </h5>
              <p className="number-of-count-info secondaryColor">
                Total Number of Apps
              </p>
            </div>
          </div>
          <div className="total-number-apps">
            <div className="subscription-details-box-icon">
              <img src={IFlogoWhiteBorder} />
            </div>
            <div className="subscription-usage-app-count">
              <h5 className="number-of-app-count primaryColor">
                {noofFormsPerApp}
              </h5>
              <p className="number-of-count-info secondaryColor">
                Number of Forms per App
              </p>
            </div>
          </div>
          <div className="total-number-apps">
            <div className="subscription-details-box-icon">
              <img src={IFlogoWhiteBorder} />
            </div>
            <div className="subscription-usage-app-count">
              <h5 className="number-of-app-count primaryColor">
                {noofTabsinSpreadSheet}
              </h5>
              <p className="number-of-count-info secondaryColor">
                Number of Tabs in Spreadsheet
              </p>
            </div>
          </div>
        </div>
        {/* <div className="two-box-wrapper">
          <div className="number-of-forms">
            <h5 className="number-of-forms-text">Number of Forms/App</h5>
            <div className="number-of-forms-per-app-box">
              <div className="name-of-app-and-number">
                <h5 className="name-of-app">hii</h5>
                <p className="number-of-forms">12</p>
              </div>
            </div>
          </div>
          <div className="number-of-sheets">
            <h5 className="number-of-sheets-text">Number of Sheets/Excel</h5>
            <div className="number-of-sheets-per-excel-box"></div>
          </div>
        </div> */}
      </div>
      <CommonModelContainer
        modalTitle="Change Company Picture"
        show={changeCompanyModal}
        handleClose={handleChangeCompanyModal}
        centered
        id="my-profile-change-company-modal"
        size="md"
      >
        <Modal.Body className="profile-modal">
          <div>
            <div class="choosColorHeader">
              <label
                className="secondaryColor"
                htmlhtmlFor="upload-img"
                class="colorfileHeader"
              >
                <input
                  type="file"
                  class="file"
                  id="upload-img"
                  onChange={handleImageChangeCompany}
                  accept="image/*"
                />
                <Icon icon="ic:outline-photo-size-select-actual" />
                <p className="secondaryColor">Upload your Company picture</p>
              </label>
              <div style={{ width: "100%" }}>
                <Cropper
                  className="profile-cropper"
                  initialAspectRatio={82 / 25}
                  aspectRatio={82 / 25}
                  preview=".img-preview"
                  src={imagesCompany}
                  viewMode={0}
                  guides={true}
                  minCropBoxHeight={10}
                  minCropBoxWidth={10}
                  background={false}
                  responsive={true}
                  checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                  onInitialized={(instance) => {
                    setCropperCompany(instance);
                  }}
                />
              </div>
            </div>
          </div>
        </Modal.Body>

        <div className="profile-modal-footer">
          <button
            className="secondaryButton secondaryButtonColor"
            style={{ border: "none" }}
            onClick={() => handleChangeCompanyModal()}
          >
            Cancel
          </button>
          <button
            className="primaryButton primaryButtonColor"
            onClick={onSaveCompany}
          >
            Save
          </button>
        </div>
      </CommonModelContainer>
      <CommonModelContainer
        modalTitle="Change Company Logo"
        show={changeCompanyLogoModal}
        handleClose={handleChangeCompanyLogoModal}
        centered
        id="my-profile-change-company-modal"
        size="md"
      >
        <Modal.Body className="profile-modal">
          <div>
            <div class="choosColorHeader">
              <label
                className="secondaryColor"
                htmlhtmlFor="upload-img"
                class="colorfileHeader"
              >
                <input
                  type="file"
                  class="file"
                  id="upload-img"
                  onChange={handleImageChangeCompanyLogo}
                  accept="image/*"
                />
                <Icon icon="ic:outline-photo-size-select-actual" />
                <p className="secondaryColor">Upload your Company Logo</p>
              </label>
              <div style={{ width: "100%" }}>
                <Cropper
                  className="profile-cropper"
                  initialAspectRatio={1 / 1}
                  aspectRatio={1 / 1}
                  preview=".img-preview"
                  src={imagesCompanyLogo}
                  viewMode={0}
                  guides={true}
                  minCropBoxHeight={10}
                  minCropBoxWidth={10}
                  background={false}
                  responsive={true}
                  checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                  onInitialized={(instance) => {
                    setCropperCompanyLogo(instance);
                  }}
                />
              </div>
            </div>
          </div>
        </Modal.Body>

        <div className="profile-modal-footer">
          <button
            className="secondaryButton secondaryButtonColor"
            style={{ border: "none" }}
            onClick={() => handleChangeCompanyLogoModal()}
          >
            Cancel
          </button>
          <button
            className="primaryButton primaryButtonColor"
            onClick={onSaveCompanyLogo}
          >
            Save
          </button>
        </div>
      </CommonModelContainer>
    </div>
  );
};
export default AccountDetails;
