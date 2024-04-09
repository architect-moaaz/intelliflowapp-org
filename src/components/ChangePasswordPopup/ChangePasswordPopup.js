import React, { useState, useEffect } from "react";
import { Row, Container, CloseButton } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import PasswordInputField from "./PasswordInputField";
import ConfirmPasswordInputField from "./ConfirmPasswordInputField";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/js/dist/dropdown";
import "./ChangePasswordPopup.css";
import axios from "axios";
import CurrentPasswordField from "./CurrentPasswordField";
import { toast } from "react-toastify";
import CommonModelContainer from "../CommonModel/CommonModelContainer";


const ChangePasswordPopup = ({ closeModel, openModel, props }) => {
  const [showNewAppModel, setShowNewAppModel] = useState(false);
  const [showPassWordModal, setShowPassWordModal] = useState(true);
  const [passwordError, setPasswordErr] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passwordInput, setPasswordInput] = useState({
    password: "",
    confirmPassword: "",
    currentpassword: "",
  });
  const [accessToken, setAccessToken] = useState(localStorage.getItem("token"));

  const onOpenNewAppModal = () => {
    setShowNewAppModel(!showNewAppModel);
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
  const handleValidation = (evnt) => {
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
      } else if (!lowercasePassword) {
        errMsg = "At least one lowercase";
      } else if (!digitsPassword) {
        errMsg = "At least one digit";
      } else if (!specialCharPassword) {
        errMsg = "At least one special Character";
      } else if (!minLengthPassword) {
        errMsg = "At least minumum 8 characters";
      } else {
        errMsg = "";
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
      } else {
        setConfirmPasswordError("");
      }
    }
  };

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
    // console.log(resetpasswordapi);
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
        // console.log("ToastTest", JSON.stringify(response.data));
        onCloseModal();
      })

      .catch(function (error) {
        console.log(error);
      });
  };

  const handleSelectUpdate = () => {
    resetPassword();
  };

  // const handlecurrentpassword = (evnt) => {
  //   const passwordInputValue = evnt.target.value.trim();
  //   const passwordInputFieldName = evnt.target.name;
  //   const NewPasswordInput = {
  //     ...passwordInput,
  //     [passwordInputFieldName]: passwordInputValue,
  //   };
  //   setPasswordInput(NewPasswordInput);
  // };
  // const handleValidationcurrentpassword = () => {};

  const onCloseModal = () => {
    closeModel(false);
  };

  return (
    <>
      {/* <CommonModelContainer
        modalTitle="  Change password"
        show={openModel}
        handleClose={onCloseModal}
        className="Changepassword"
      >
        <Modal.Body>
         
          <label className="Text" for="psw">
            {" "}
            New Password
          </label>
          <PasswordInputField
            className="currentpassword"
            handlePasswordChange={handlePasswordChange}
            handleValidation={handleValidation}
            passwordValue={passwordInput.password}
            passwordError={passwordError}
          />
          <label className="Text" for="psw">
            Confirm Password
          </label>
          <ConfirmPasswordInputField
            className="currentpassword "
            handlePasswordChange={handlePasswordChange}
            handleValidation={handleValidation}
            confirmPasswordValue={passwordInput.confirmPassword}
            confirmPasswordError={confirmPasswordError}
          />
          <Row className="change-pass-botom">
            <button className="secondaryButton cancel-change-pass " onClick={onCloseModal} >
              Cancel
            </button>
            <button className="primaryButton " onClick={handleSelectUpdate}>
              Update
            </button>
          </Row>
        </Modal.Body>
      </CommonModelContainer> */}
      <CommonModelContainer
      modalTitle="Change password"
      show={openModel}
      handleClose={onCloseModal}
      className="change-pass-modal"
      id="changePasswordPopup-changePassword-CommonModelContainer"
      >
        <Modal.Body>
          <label htmlFor="" className="change-pass-label secondaryColor">New Password</label>
          <PasswordInputField
            className="currentpassword"
            handlePasswordChange={handlePasswordChange}
            handleValidation={handleValidation}
            passwordValue={passwordInput.password}
            passwordError={passwordError}
            id="changePasswordPopup-currentPassword-PasswordInputField"
          />
          <label htmlFor="" className="change-pass-label secondaryColor"> Confirm Password</label>
          <ConfirmPasswordInputField
            className="currentpassword"
            handlePasswordChange={handlePasswordChange}
            handleValidation={handleValidation}
            confirmPasswordValue={passwordInput.confirmPassword}
            confirmPasswordError={confirmPasswordError}
            id="changePasswordPopup-currentpassword-ConfirmPasswordInputField"
          />
          <Row className="change-pass-botom">
            <button className="secondaryButton secondaryButtonColor cancel-change-pass " id="changePasswordPopup-cancel-button" onClick={onCloseModal} >
              Cancel
            </button>
            <button className="primaryButton primaryButtonColor" id="changePasswordPopup-update-button" onClick={handleSelectUpdate}>
              Update
            </button>
          </Row>
        </Modal.Body>
      </CommonModelContainer>
    </>
  );
};
export default ChangePasswordPopup;
