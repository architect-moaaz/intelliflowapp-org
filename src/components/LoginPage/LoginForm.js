import React, { useEffect, useState } from "react";
import IcomoonReact from "icomoon-react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import axios from "axios";
import { ForgotEyeOpen, PasswordEyeSlash } from "../../assets/index";
import { useTranslation } from "react-i18next";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import cancel from "../../assets/Icons/cancel.svg";
import "./Login.css";

var CryptoJS = require("crypto-js");

const LoginForm = () => {
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
        // setCustomLogin(true);
      }
    }
  }
  const [customLogin, setCustomLogin] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const params = useQuery();
  const [t, i18n] = useTranslation("common");
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [workspace, setWorkspace] = useState(space);
  const [showPassword, showPasswordSet] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(null);
  const [openModelThree, setOpenModelThree] = useState(false);

  const handleClickShowPassword = () => {
    showPasswordSet(!showPassword);
  };

  const onCloseModalThree = () => {
    localStorage.setItem("expire", false);
    setOpenModelThree(false);
  };

  const [type, setType] = React.useState("password");
  const [validate, setValidate] = useState({
    email: true,
    pwd: true,
  });
  const [errorMessage, setErrorMessage] = useState({
    emailError: "",
    passwordError: "",
  });

  const [emailError, setEmailError] = useState(null);
  const [workspaceError, setworkspaceError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const saveToLocalStorage = (key, userToken) => {
    localStorage.setItem(key, userToken);
    // alert("Done");
  };

  useEffect(() => {
    setWorkspace(space);
    setOpenModelThree(localStorage.getItem("expire") === "true" ? true : false);
    localStorage.setItem("expire", false);
  }, []);

  useEffect(() => {
    if (localStorage.isChecked) {
      setIsChecked(true);
      setemail(localStorage.username);
      setPassword(localStorage.password);
      setWorkspace(localStorage.workspace);
    }
  }, []);

  const showToken = () => {
    const response = localStorage.getItem("token");
    alert(JSON.stringify(response));
  };

  const checkEmail = () => {
    if (!email) {
      setEmailError("Please enter an email");
    }
  };
  const checkWorkspace = () => {
    if (!workspace) {
      setworkspaceError("Please enter Workspace");
    }
  };
  const checkPassword = () => {
    if (!password) {
      setPasswordError("Please enter a password");
    }
  };

  const handleworkspaceInput = (e) => {
    setWorkspace(e.target.value);
    setInvalidPassword(null);
  };
  const handleEmailInput = (e) => {
    setemail(e.target.value);
    setInvalidPassword(null);
  };

  const handlePasswordInput = (e) => {
    setPassword(e.target.value);
    setInvalidPassword(null);
  };
  // let history = useHistory()

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
  const handleLogin = async (e) => {
    e.preventDefault();
    setworkspaceError(null);
    setEmailError(null);
    setPasswordError(null);
    checkWorkspace();
    checkEmail();
    checkPassword();

    if (email && password && workspace) {
      const key = "6fa979f20126cb08aa645a8f495f6d85";
      const iv = "I8zyA4lVhMCaJ5Kg";

      if (isChecked) {
        localStorage.username = email;
        localStorage.password = password;
        localStorage.workspace = workspace;
        localStorage.isChecked = isChecked;
      } else if (!isChecked) {
        localStorage.removeItem("username");
        localStorage.removeItem("password");
        localStorage.removeItem("workspace");
        localStorage.removeItem("isChecked");
      }

      const encrypted = CryptoJS.AES.encrypt(
        password,
        CryptoJS.enc.Utf8.parse(key),
        {
          iv: CryptoJS.enc.Utf8.parse(iv), // parse the IV
          padding: CryptoJS.pad.Pkcs7,
          mode: CryptoJS.mode.CBC,
        }
      ).toString();

      const postData = { username: email, password: encrypted };
      await axios
        .post(
          process.env.REACT_APP_IDENTITY_ENDPOINT + "IDENTITY/Login",
          postData,
          {
            headers: { workspace: workspace },
          }
        )
        .then((response) => {
          // console.log(JSON.stringify(response));

          response = response.data;

          if (response === "Authentication failed") {
            alert("login failed");
          } else {
            saveToLocalStorage("token", response.access_info.access_token);
            saveToLocalStorage("username", response.UserInfo[0].username);
            saveToLocalStorage("firstName", response.UserInfo[0].firstName);
            saveToLocalStorage("lastName", response.UserInfo[0].lastName);
            saveToLocalStorage("id", response.UserInfo[0].id);
            saveToLocalStorage(
              "refresh_token",
              response.access_info.refresh_token
            );
            saveToLocalStorage(
              "groups",
              JSON.stringify(response.UserInfo[0].groups)
            );
            saveToLocalStorage(
              "roles",
              JSON.stringify(response.UserInfo[0].roles.realmMappings)
            );
            saveToLocalStorage(
              "currentRole",
              JSON.stringify(response.UserInfo[0].roles.realmMappings[0].name)
            );
            saveToLocalStorage(
              "enabled_menus",
              JSON.stringify(
                response.UserInfo[0].enabled_menu[0] == undefined ||
                  response.UserInfo[0].enabled_menu[0] == null
                  ? []
                  : response.UserInfo[0].enabled_menu[0]
              )
            );
            saveToLocalStorage("workspace", response.workspace);
            saveToLocalStorage("email", response.UserInfo[0].email);
            saveToLocalStorage(
              "refresh_expires_in",
              response.access_info.refresh_expires_in
            );
            saveToLocalStorage("AutoSavefeature", false);
            // history.push("/")

            window.location.reload();
          }
        })
        .catch(function (error) {
          setInvalidPassword(error);
        });
    }
  };

  const onChangeCheckbox = (event) => {
    setIsChecked(event.target.checked);
  };

  return (
    <div className="loginform-inputfields" id="LoginFormContainer">
      <form id="LoginForm">
        <div className="app-form-group">
          <input
            value={workspace}
            className={
              workspaceError ? "customInput error-border" : "customInput"
            }
            type="text"
            placeholder={t("welcome.workspace")}
            onChange={(e) => handleworkspaceInput(e)}
            name="Workspace"
            required
            id="LoginWorkspaceNameInput"
          />
        </div>
        <div className=" app-form-group ">
          <input
            value={email}
            className={emailError ? "customInput error-border" : "customInput"}
            type="text"
            placeholder={t("welcome.email")}
            onChange={(e) => handleEmailInput(e)}
            name="email"
            required
            id="LoginEmailInput"
          />
        </div>
        <div className="form-group displayFlex">
          <input
            value={password}
            className={
              passwordError
                ? "password customInput error-border"
                : "password customInput"
            }
            type={showPassword ? "text" : "password"}
            onChange={(e) => handlePasswordInput(e)}
            placeholder={t("welcome.password")}
            name="psw"
            required
            id="LoginPasswordInput"
          />
          <img
            src={showPassword ? ForgotEyeOpen : PasswordEyeSlash}
            alt="Forgot"
            className="eyebuttonpassword"
            onClick={handleClickShowPassword}
            width={35}
            height={35}
            id="loginForm-showPassword"
          />
        </div>
        <div
          className="mt-2"
          style={{
            width: "100%",
            marginLeft: "inherit",
            display: "flex",
            flexDirection: "row",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <div className="remember">
            <input
              type="checkbox"
              name="remember"
              id="LoginRememberPassword"
              checked={isChecked}
              onChange={onChangeCheckbox}
            />{" "}
            {t("welcome.rememberMe")}
          </div>
          <div className="forgotPassword" id="LoginForgotPassword">
            <Link
              id="loginForm-forgotPassword-link"
              to="/forgotPassword"
              style={{ color: "#0000EE", textDecorationLine: "none" }}
            >
              {t("welcome.forgotPassword")}?
            </Link>
          </div>
        </div>
        <div
          className="login mt-2"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button
            className="loginbutton"
            onClick={handleLogin}
            type="submit"
            id="LoginSubmitButton"
          >
            {t("welcome.login")}
          </button>
        </div>
        <p
          className="secondaryColor"
          style={
            invalidPassword != null
              ? { color: "red", visibility: "visible", "margin-top": "15px" }
              : { color: "transparent", visibility: "hidden" }
          }
        >
          {t("welcome.enteredEmailorPasswordiswrong")}{" "}
        </p>
        <p
          className="secondaryColor"
          style={
            workspaceError || emailError || passwordError
              ? { color: "red", visibility: "visible", "margin-top": "15px" }
              : { color: "transparent", visibility: "hidden" }
          }
        >
          {t("welcome.pleaseenterallthemandatoryfields")}
        </p>
      </form>
      <Modal
        open={openModelThree}
        onClose={onCloseModalThree}
        classNames={{
          overlay: "customOverlayAssetUi",
          modal: "customModalAssetUi",
        }}
        closeIcon={closeIcon}
        id="loginForm-model-three"
      >
        <div className="innerContainer">
          <div className="popupTop header-main-nav">
            <p className="secondaryColor">Session expired</p>
          </div>
          <div className="popupBottom row">
            <p>Session has expired please login to continue</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LoginForm;
