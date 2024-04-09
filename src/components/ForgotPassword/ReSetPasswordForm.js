import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ForgotPassword.css";
import { ForgotEyeOpen, PasswordEyeSlash } from "../../assets/index";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import checked from "../../assets/Icons/checked-green.svg";
import ResetInputPw from "./ResetInputPw";
import ResetConfirmPw from "./ResetConfirmPw";
import { useTranslation } from "react-i18next";

const ReSetPasswordForm = (props) => {
  const useQuery = () => {
    const search = window.location.search;
    return new URLSearchParams(search);
  };
  var query = window.location.href.split("?")[1];
  var space = "";
  if (query) {
    var vars = query.split("&");

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == "workspace") {
        space = pair[1];
      }
    }
  }
  const [input, setInput] = useState({});
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [workspace, setWorkspace] = useState(space);
  const [t, i18n] = useTranslation("common");

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [openModelThree, setOpenModelThree] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passwordInput, setPasswordInput] = useState({
    password: "",
    confirmPassword: "",
    currentpassword: "",
  });
  const [passwordError, setPasswordErr] = useState("");
  useEffect(() => {
    var search = getQueryVariable("token");
    // console.log("Check this token", search);
    validateToken(search);
  }, []);

  const onOpenModalThree = () => {
    setOpenModelThree(true);
  };

  const onCloseModalThree = () => {
    setOpenModelThree(false);
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

  const validateToken = async (token) => {
    const postData = { token: token };

    await axios
      .post(
        process.env.REACT_APP_API_ENDPOINT + "employee/checkPasswordToken",
        postData
      )
      .then((response) => {
        // console.log(response.data);
        response = response.data;
        let errors = {};
        errors["invalidToken"] = "Invalid Token.";
        if (response == "Invalid") {
          setErrors(errors);
        }
      });
  };

  const getQueryVariable = (variable) => {
    var query = window.location.search.substring(1);
    // console.log(query); //"app=article&act=news_content&aid=160990"
    var vars = query.split("&");
    // console.log(vars); //[ 'app=article', 'act=news_content', 'aid=160990' ]
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      // console.log(pair); //[ 'app', 'article' ][ 'act', 'news_content' ][ 'aid', '160990' ]
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return false;
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

  const handleChange = (event) => {
    setInput({ ...input, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validate()) {
      var axios = require("axios");
      var data = JSON.stringify({
        userid: props.userid,
        password: passwordInput.password,
      });

      var config = {
        method: "put",
        url:
          process.env.REACT_APP_IDENTITY_ENDPOINT +
          "/IDENTITY/resetpassword/fetchresetpassword",
        headers: {
          access_token: props.token,
          "Content-Type": "application/json",
          workspace: workspace,
        },
        data,
      };

      axios(config)
        .then(function (response) {
          // console.log("message", response);
          onOpenModalThree();

          // console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const validate = () => {
    // console.log("validate", input);
    // console.log("userid", props.userid);
    // console.log("token", props.token);
    // let input = this?.state.input;
    let errors = {};
    let isValid = false;
    const uppercaseRegExp = /(?=.*?[A-Z])/;
    const lowercaseRegExp = /(?=.*?[a-z])/;
    const digitsRegExp = /(?=.*?[0-9])/;
    const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
    const minLengthRegExp = /.{8,}/;
    const uppercasePassword = uppercaseRegExp.test(input["new_password"]);
    const lowercasePassword = lowercaseRegExp.test(input["new_password"]);
    const digitsPassword = digitsRegExp.test(input["new_password"]);
    const specialCharPassword = specialCharRegExp.test(input["new_password"]);
    const minLengthPassword = minLengthRegExp.test(input["new_password"]);
    if (passwordInput.confirmPassword === passwordInput.password) {
      isValid = true;
    } else if (passwordInput.confirmPassword !== passwordInput.password) {
      isValid = false;
      setErrors(errors);
    }

    // console.log("isvalid", isValid);
    return isValid;
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
        errMsg = "At least one uppercase required";
      } else if (!lowercasePassword) {
        errMsg = "At least one lowercase required";
      } else if (!digitsPassword) {
        errMsg = "At least one digit required";
      } else if (!specialCharPassword) {
        errMsg = "At least one special character required";
      } else if (!minLengthPassword) {
        errMsg = "At least minimum 8 characters required";
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
        setConfirmPasswordError(
          " New Password and Confirm Password does not match"
        );
      } else {
        setConfirmPasswordError("");
      }
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleworkspaceInput = (e) => {
    setWorkspace(e.target.value);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const passwordConfirmation = () => {
    var axios = require("axios");
    var data = JSON.stringify({
      userid: this.props.userid,
      password: this.props.input["confirm_password"],
    });

    var config = {
      method: "put",
      url:
        process.env.REACT_APP_IDENTITY_ENDPOINT +
        "/IDENTITY/resetpassword/fetchresetpassword",
      headers: {
        access_token: this.props.token,
        "Content-Type": "application/json",
        workspace: workspace,
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div className="col-md-12 d-flex justify-content-center text-center mt-5 py-5">
      <form onSubmit={handleSubmit} id="resetPasswordForm-form">
        <div className="my-3 resetpassword-newpasss">
          <div className=" app-form-group ">
            <input
              value={workspace}
              className="customInput"
              id="resetPasswordForm-workspace-input"
              type="text"
              placeholder={t("welcome.workspace")}
              onChange={(e) => handleworkspaceInput(e)}
              name="Workspace"
              required
            />
          </div>
          <div>
            <label
              className="pull-left resetpassword-newpasssword secondaryColor"
              for="password"
            >
              New Password
            </label>
          </div>

          <div className="form-group d-flex justify-content">
            <ResetInputPw
              className="newPasswordInput"
              handlePasswordChange={handlePasswordChange}
              handleValidation={handleValidation}
              passwordValue={passwordInput.password}
              passwordError={passwordError}
              showPassword={showPassword}
              id="resetPasswordForm-newPasswordInput-ResetInputPw"
            />
            <img
              src={showPassword ? ForgotEyeOpen : PasswordEyeSlash}
              alt="Forgot"
              className="eyebutton"
              id="resetPasswordForm-eyeButton-img"
              onClick={handleClickShowPassword}
              width={35}
              height={35}
            />
          </div>

          <div className="text-danger">{errors.new_password}</div>
        </div>

        <div className="my-3 resetpassword-confirmpass">
          <div>
            <label
              className="pull-left resetpassword-newpasssword secondaryColor"
              for="password"
            >
              Confirm Password
            </label>
          </div>

          <div className="form-group d-flex justify-content">
            <ResetConfirmPw
              className="newPasswordInput"
              handlePasswordChange={handlePasswordChange}
              handleValidation={handleValidation}
              confirmPasswordValue={passwordInput.confirmPassword}
              confirmPasswordError={confirmPasswordError}
              showConfirmPassword={showConfirmPassword}
              id="resetPasswordForm-newPasswordConfirmInput-ResetConfirmPw"
            />
            <img
              src={showConfirmPassword ? ForgotEyeOpen : PasswordEyeSlash}
              alt="Forgot"
              className="eyebutton"
              id="resetPasswordForm-confirmPasswordEyeButton-img"
              onClick={handleClickShowConfirmPassword}
              width={35}
              height={35}
            />
          </div>

          <div className="text-danger">{errors.confirm_password}</div>
        </div>

        <button
          type="submit"
          value="Submit"
          className="loginbutton"
          id="resetPasswordForm-submit-button"
          // onClick={passwordConfirmation()}
        >
          Submit
        </button>

        <div>
          <center>{errors.password}</center>
        </div>
        <div>
          <center>{errors.invalidToken}</center>
        </div>
      </form>
      <Modal
        open={openModelThree}
        onClose={onCloseModalThree}
        id="resetPassword-closeModal-Modal"
        classNames={{
          overlay: "customOverlayAssetUi",
          modal: "customModalAssetUi",
        }}
        closeIcon={closeIcon}
      >
        <div className="innerContainer">
          <div className="popupTop header-main-nav">
            <p className="secondaryColor">Confirmation</p>
          </div>
          <div className="checkedIcon">
            <img src={checked} />
          </div>
          <div className="popupBottom row">
            <p className="secondaryColor">Password has been changed successfully</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ReSetPasswordForm;
