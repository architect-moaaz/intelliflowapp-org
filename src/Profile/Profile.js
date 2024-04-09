import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import "./Profile.css";
import { AccountIcon } from "../assets/index";
import ChangePasswordPopup from "../components/ChangePasswordPopup/ChangePasswordPopup";
import { ToastContainer } from "react-toastify";
import { Row, Col, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import { ProfileEditIcon } from "../assets/NewIcon/ProfileEditIcon.svg";
import PasswordInputField from "../components/ChangePasswordPopup/PasswordInputField";
import ConfirmPasswordInputField from "../components/ChangePasswordPopup/ConfirmPasswordInputField";
import passErrIcon from "../assets/NewIcon/passErrIcon.svg";
import CommonModelContainer from "../components/CommonModel/CommonModelContainer";
import Modal from "react-bootstrap/Modal";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import axios from "axios";
import urlExist from "url-exist";
import imageCompression from "browser-image-compression";
import NewPassInput from "./NewPassInput";
import ConfirmPassInput from "./ConfirmPassInput";
import { useTranslation } from "react-i18next";
import TimezoneSelector from "../components/DateAndTime/TimezoneSelector";
import { saveUserPreference } from "./../components/DateAndTime/TimezoneHelper";

const Profile = ({ setheaderTitle }) => {
  const [t, i18n] = useTranslation("common");
  setheaderTitle(t("myProfile"));
  const [open, setOpen] = useState(false);
  const [editPass, setEditPass] = useState(false);
  const [passwordError, setPasswordErr] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [conditionsTrue, setConditionsTrue] = useState(false);
  const [passwordInput, setPasswordInput] = useState({
    password: "",
    confirmPassword: "",
    currentpassword: "",
  });

  const [upperCase, setUpperCase] = useState(false);
  const [lowerCase, setLowerCase] = useState(false);
  const [digit, setDigit] = useState(false);
  const [specialChar, setSpecialChar] = useState(false);
  const [minChar, setMinChar] = useState(false);
  const [changeProfile, setChangeProfile] = useState(false);
  const [localImage, setLocalImage] = useState(null);
  const [profImage, setProfImgae] = useState(null);
  const [cropper, setCropper] = useState();
  const [profileImage, setProfileImage] = useState(null);

  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [selectedLocale, setSelectedLocale] = useState("");

  useEffect(() => {
    let timezonetemp = localStorage.getItem("usertimezone")
    // console.log("tmztemp",timezonetemp)
    setSelectedTimezone(timezonetemp)
  },[])

  useEffect(() => {
    const passwordInputValue = passwordInput.password.trim();
    const uppercaseRegExp = /(?=.*?[A-Z])/;
    const lowercaseRegExp = /(?=.*?[a-z])/;
    const digitsRegExp = /(?=.*?[0-9])/;
    const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
    const minLengthRegExp = /.{8,}/;

    const passwordLength = passwordInputValue.length;
    const uppercasePassword = uppercaseRegExp.test(passwordInputValue);
    const lowercasePassword = lowercaseRegExp.test(passwordInputValue);
    const digitsPassword = digitsRegExp.test(passwordInputValue);
    const specialCharPassword = specialCharRegExp.test(passwordInputValue);
    const minLengthPassword = minLengthRegExp.test(passwordInputValue);

    if (uppercasePassword) {
      setUpperCase(true);
    } else {
      setUpperCase(false);
    }
    if (!lowercasePassword) {
      setLowerCase(true);
    } else {
      setLowerCase(false);
    }
    if (digitsPassword) {
      setDigit(true);
    } else {
      setDigit(false);
    }
    if (specialCharPassword) {
      setSpecialChar(true);
    } else {
      setSpecialChar(false);
    }
    if (minLengthPassword) {
      setMinChar(true);
    } else {
      setMinChar(false);
    }
  }, [passwordInput.password]);

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

  const handleProfileImageChange = (e) => {
    console.log("e.target.files[0]", e.target.files[0]);
    setLocalImage(e.target.files[0]);
    setProfImgae(URL.createObjectURL(e.target.files[0]));
  };
  let urlToFile = (url) => {
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
  const getCroppedData = (e) => {
    if (typeof cropper !== "undefined") {
      setLocalImage(cropper.getCroppedCanvas().toDataURL());
      var imageFile = cropper.getCroppedCanvas().toDataURL();
      var finalImage = urlToFile(imageFile);
    }

    return finalImage;
  };

  const imageUploader = async () => {
    var imageFile = getCroppedData();

    const options = {
      maxSizeMB: 0.01,
      maxWidthOrHeight: 150,
      useWebWorker: true,
    };
    let uploadProfilePic;
    await imageCompression(imageFile, options).then((x) => {
      uploadProfilePic = x;
    });

    const appName = "IFprofilePicture";
    var bodyFormData = new FormData();
    bodyFormData.append("file", uploadProfilePic);

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
          userid: localStorage.getItem("id"),
        },
      }
    );
    setProfImgae(new Date().toISOString());
    return response;
  };
  const onSave = () => {
    if (localImage) {
      // getCroppedData();
      imageUploader();
      handleChangeProfileModal();
    }
  };
  const handleChangeProfileModal = () => {
    setChangeProfile(!changeProfile);
  };
  const onOpenModal = () => {
    setOpen(true);
  };
  const oncloseModel = (e) => {
    setOpen(e);
  };

  const displayAccessibility = () => {
    if (open == true) {
      return <ChangePasswordPopup openModel={open} closeModel={oncloseModel} />;
    }
  };

  const handleEditPass = (e) => {
    setEditPass(true);
  };

  const handleCanclePass = () => {
    setEditPass(false);
    setPasswordInput({
      password: "",
      confirmPassword: "",
      currentpassword: "",
    });
    // setPasswordInput({ currentpassword: "", confirmPassword: "" });
  };
  const handlePasswordChange = (evnt) => {
    const passwordInputValue = evnt.target.value.trim();
    const passwordInputFieldName = evnt.target.name;
    const NewPasswordInput = {
      ...passwordInput,
      [passwordInputFieldName]: passwordInputValue,
    };
    setPasswordInput(NewPasswordInput);
  };

  // console.log("upperCase", upperCase);

  const handleValidation = (evnt) => {
    // console.log("upperCase", upperCase);
    const passwordInputValue = evnt.target.value.trim();
    const passwordInputFieldName = evnt.target.name;

    //for password
    if (passwordInputFieldName === "password") {
      const uppercaseRegExp = /(?=.*?[A-Z])/;
      const lowercaseRegExp = /(?=.*?[a-z])/;
      const digitsRegExp = /(?=.*?[0-9])/;
      const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
      const minLengthRegExp = /.{8,}/;

      const passwordLength = passwordInputValue.length;
      const uppercasePassword = uppercaseRegExp.test(passwordInputValue);
      const lowercasePassword = lowercaseRegExp.test(passwordInputValue);
      const digitsPassword = digitsRegExp.test(passwordInputValue);
      const specialCharPassword = specialCharRegExp.test(passwordInputValue);
      const minLengthPassword = minLengthRegExp.test(passwordInputValue);

      let errMsg = "";
      if (passwordLength === 0) {
        errMsg = "Password is empty";
      } else if (!uppercasePassword) {
        errMsg = "At least one uppercase";
        setConditionsTrue(false);
      } else if (!lowercasePassword) {
        errMsg = "At least one lowercase";
      } else if (!digitsPassword) {
        errMsg = "At least one digit";
        setConditionsTrue(false);
      } else if (!specialCharPassword) {
        errMsg = "At least one special Character";
        setConditionsTrue(false);
      } else if (!minLengthPassword) {
        errMsg = "At least minumum 8 characters";
        setConditionsTrue(false);
      } else {
        errMsg = "";
        // console.log("conditions matched in handle validation");
        setConditionsTrue(true);
      }
      setPasswordErr(errMsg);
    }

    // for confirm password
    if (
      passwordInputFieldName === "confirmPassword" ||
      (passwordInputFieldName === "password" &&
        passwordInput.confirmPassword.length > 0)
    ) {
      if (passwordInput.confirmPassword !== passwordInput.password) {
        setConfirmPasswordError("Password does not match");
        // console.log("Password does not match");
      } else {
        setConfirmPasswordError("");
      }
    }
  };
  var userRole = localStorage.getItem("currentRole").replace(/"/g, "");
  const resetPassword = async (token) => {
    token = localStorage.getItem("token");
    var data = {
      userid: localStorage.getItem("id"),
      password: passwordInput.password,
    };
    // console.log(data);
    var resetpasswordapi = {
      method: "put",
      url:
        process.env.REACT_APP_IDENTITY_ENDPOINT +
        "IDENTITY/resetpassword/fetchresetpassword",

      headers: {
        access_token: `${token}`,
        "Content-Type": "application/json",
      },

      data: JSON.stringify(data),
    };
    axios(resetpasswordapi)
      .then(function (response) {
        toast.success("Password Updated Successfully ", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })

      .catch(function (error) {
        console.log(error);
        toast.success("Could not change password ", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  var workspace = localStorage.getItem("workspace");
  const savePassword = async (token) => {
    token = localStorage.getItem("token");
    // console.log("inputPass is", passwordInput.password);
    // console.log("Confirmpass is", passwordInput.confirmPassword);
    // console.log("passCount", passCount);
    var data = {
      userid: localStorage.getItem("id"),
      password: passwordInput.password,
    };
    var resetpasswordapi = {
      method: "put",
      url:
        process.env.REACT_APP_IDENTITY_ENDPOINT +
        "IDENTITY/resetpassword/fetchresetpassword",

      headers: {
        workspace: localStorage.getItem("workspace"),
        Authorization: "Bearer " + `${token}`,
        "Content-Type": "application/json",
      },

      data: JSON.stringify(data),
    };
    // console.log(resetpasswordapi);
    if (
      passwordInput.password === passwordInput.confirmPassword &&
      conditionsTrue
    ) {
      axios(resetpasswordapi)
        .then(function (response) {
          console.log("response", response);
          toast.success("Password Updated Successfully ", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        })
        .catch(function (error) {
          console.log(error);
          toast.error("Password Update Failed ", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    } else if (!conditionsTrue) {
      toast.error("conditions does not fulfill ", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      toast.error("Confirm Password does not match ", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const callSaveUserTimezone = () => {
    let workspace = localStorage.getItem("workspace");
    let userid = localStorage.getItem("username");

    saveUserPreference(
      workspace,
      userid,
      selectedTimezone,
      selectedLocale
    ).then((data) => {
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
    });
  };

  return (
    <>
      <div className="my-profile-container">
        <Row className="profile-info-section">
          <div className="profile-info-wrapper">
            <div className="profile-user-info">
              {profileImage ? (
                <img
                  className="profile-user-uploaded-img"
                  src={profileImage}
                  alt=""
                  crossOrigin="Anonymous"
                />
              ) : null}
            </div>
            {/* <img src={MyProfileImageUpload} alt="" /> */}
            <label
              className="secondaryColor"
              onClick={handleChangeProfileModal}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="11" cy="11" r="11" fill="#0D3C84" />
                <path
                  d="M13.7108 7.47056L14.9474 6.32332C15.417 5.89191 16.1782 5.89241 16.6478 6.32381C17.1173 6.75521 17.1173 7.45416 16.6478 7.88556L8.93831 14.8626C8.5993 15.1741 8.18116 15.403 7.72168 15.5288L6 16L6.51286 14.4182C6.64973 13.996 6.89893 13.6118 7.23794 13.3004L13.7108 7.47056ZM13.7108 7.47056L15.363 9.01043"
                  stroke="white"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </label>

            <div className="profile-user-cred">
              <span className="">
                {localStorage.getItem("firstName")}{" "}
              </span>
              <p className="">{userRole}</p>
              <p className="">{localStorage.getItem("email")}</p>
            </div>
          </div>
        </Row>
        {/* <Row className="profile-user-details">
          <Col className="profile-user-details-col col-sm-4">
            <span>Country</span>
            <input type="text" />
          </Col>
          <Col className="profile-user-details-col">
            <span>Mobile Number</span>
            <input
              id="my-profile-phone"
              name="phone"
              className="mobile-no-arrow"
              value=""
              type="number"
            />
          </Col>
        </Row> */}
        <div className="container mt-3">
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
                  onClick={() => callSaveUserTimezone()}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <Row className="profile-user-line" fluid></Row>
        <Row className="profile-user-change-pass">
          <div className="profile-user-change-pass-container col-lg-4 col-md-6 col-sm-12">
            <div className="profile-change-pass-wrapper">
              <span className="">Change Password</span>
              {editPass ? null : (
                <button onClick={handleEditPass} className="primaryButton">
                  Edit
                </button>
              )}
            </div>
            {/* <div className="form-input profile-change-pass-form"> */}
            <div
              className={`form-input profile-change-pass-form 
             ${editPass ? "" : "profile-change-pass-form-active"}`}
            >
              {/* <label htmlFor="">Old Password</label>
              <input type="password" name="" id="" /> */}
              <NewPassInput
                className={`currentpassword ${
                  editPass ? "" : "currentpassword-disabled"
                }`}
                handlePasswordChange={handlePasswordChange}
                handleValidation={handleValidation}
                passwordValue={passwordInput.password}
                passwordError={passwordError}
                id="changePasswordPopup-currentPassword-PasswordInputField"
              />
              <ConfirmPassInput
                className={`currentpassword ${
                  editPass ? "" : "currentpassword-disabled"
                }`}
                handlePasswordChange={handlePasswordChange}
                handleValidation={handleValidation}
                confirmPasswordValue={passwordInput.confirmPassword}
                confirmPasswordError={confirmPasswordError}
                id="changePasswordPopup-currentpassword-ConfirmPasswordInputField"
              />
            </div>
            {editPass ? (
              <div className="change-pass-wrapper">
                <button
                  className="primaryButton primaryButtonColor change-pass-save-btn"
                  onClick={savePassword}
                  disabled={passwordInput.password == "" || passwordInput.confirmPassword =="" ? true : false}
                >
                  Save
                </button>
                <button
                  className="secondaryButton secondaryButtonColor change-pass-save-btn"
                  onClick={handleCanclePass}
                >
                  Cancel
                </button>
              </div>
            ) : null}
          </div>
          <div className="col-lg-5 col-md-6 col-sm-12">
            <div className="form-input profile-pass-validation ">
              <label
                className={`pass-err-msg primaryColor ${
                  upperCase ? "pass-err-msg-active secondaryColor" : ""
                }`}
                htmlFor=""
              >
                <img src={passErrIcon} alt="" />
                Include at least 1 Uppercase
              </label>
              <label
                className={`pass-err-msg primaryColor ${
                  digit ? "pass-err-msg-active secondaryColor" : ""
                }`}
                htmlFor=""
              >
                <img src={passErrIcon} alt="" />
                Include at least 1 Numeric
              </label>
              <label
                className={`pass-err-msg primaryColor ${
                  specialChar ? "pass-err-msg-active secondaryColor" : ""
                }`}
                htmlFor=""
              >
                <img src={passErrIcon} alt="" />
                Include special characters(!#$%)
              </label>
              <label
                className={`pass-err-msg  primaryColor ${
                  minChar ? "pass-err-msg-active secondaryColor" : ""
                }`}
                htmlFor=""
              >
                <img src={passErrIcon} alt="" />8 Character minimum
              </label>
            </div>
          </div>
        </Row>
      </div>
      <CommonModelContainer
        modalTitle="Change Profile Picture"
        show={changeProfile}
        handleClose={handleChangeProfileModal}
        centred
        id="my-profile-change-profile-modal"
      >
        <Modal.Body className="profile-modal">
          <div>
            <div class="choosColorHeader">
              <label
                id="profile-mod-upload-img-label"
                htmlhtmlFor="upload-img"
                class=" colorfileHeader secondaryColor"
              >
                <input
                  // id="profile-mod-upload-img-input"
                  type="file"
                  class="file"
                  id="upload-img"
                  onChange={handleProfileImageChange}
                  accept="image/*"
                />
                <Icon icon="ic:outline-photo-size-select-actual" />
                <p className="secondaryColor">Upload your profile picture</p>
              </label>

              <div style={{ width: "100%" }}>
                <Cropper
                  className="profile-cropper"
                  initialAspectRatio={1}
                  aspectRatio={1}
                  preview=".img-preview"
                  src={profImage}
                  viewMode={0}
                  guides={true}
                  minCropBoxHeight={10}
                  minCropBoxWidth={10}
                  background={false}
                  responsive={true}
                  checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                  onInitialized={(instance) => {
                    setCropper(instance);
                  }}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <div className="profile-modal-footer">
          <button
            id="change-profile-cancel-btn"
            className="secondaryButton secondaryButtonColor"
            onClick={() => handleChangeProfileModal()}
          >
            Cancel
          </button>
          <button
            id="change-profile-save-btn"
            className="primaryButton primaryButtonColor"
            onClick={onSave}
          >
            Save
          </button>
        </div>
      </CommonModelContainer>
    </>
  );
};
export default Profile;

