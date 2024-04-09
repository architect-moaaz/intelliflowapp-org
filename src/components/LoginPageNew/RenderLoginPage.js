import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import parse from "html-react-parser";
import { loggedInUserState } from "../../state/atom";
import { useForm, Controller } from "react-hook-form";
import "./RenderLoginPage.css";
import LoginTabPaneContainer from "./LoginTabPaneContainer";
import { useHistory, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const RenderLoginPage = ({ workspacename }) => {
  // const[workSpaceData, setWorkSpaceData]= useState(workspacename)

  // console.log("workspacename-renderlogin", workspacename);
  const [formData, setformData] = useState({});
  const [formLayout, setFormLayout] = useState([]);
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [t, i18n] = useTranslation("common");
  const [invalidPassword, setInvalidPassword] = useState(null);
  var CryptoJS = require("crypto-js");

  const history = useHistory();

  const formElementType = {
    label: "label",
    text: "text",
    number: "number",
    date: "date",
    dropdown: "dropdown",
    radio: "radio",
    rating: "rating",
    file: "file",
    image: "image",
    checkbox: "checkbox",
    qrcode: "qrcode",
    dataGrid: "dataGrid",
    esign: "esign",
    mathExp: "mathexp",
    button: "button",
    link: "link",
    location: "location",
    intellisheet: "intellisheet",
    section: "section",
    list: "list",
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const loadForm = () => {
    axios
      .get(
        `${process.env.REACT_APP_IDENTITY_ENDPOINT}IDENTITY/Login/customLogin/${workspacename}/login`
      )
      .then((res) => {
        console.log(res.data.loginpage[0].formData);

        if (res.data.loginpage[0].formData.length)
          setFormLayout([...res.data.loginpage[0].formData]);
      })
      .catch((e) => {
        // console.log("Error ", e);
        setFormLayout([]);
      });
  };

  useEffect(() => {
    loadForm();
  }, []);

  // =========================================================================================================
  const [loginCredentials, setLoginCredentials] = useState({
    username: "",
    password: "",
  });

  const handleLogin = async (e) => {
    const key = "6fa979f20126cb08aa645a8f495f6d85";
    const iv = "I8zyA4lVhMCaJ5Kg";

    const encrypted = CryptoJS.AES.encrypt(
      loginCredentials.password,
      CryptoJS.enc.Utf8.parse(key),
      {
        iv: CryptoJS.enc.Utf8.parse(iv), // parse the IV
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
      }
    ).toString();

    const postData = {
      username: loginCredentials.username,
      password: encrypted,
    };
    await axios
      .post(
        process.env.REACT_APP_IDENTITY_ENDPOINT + "IDENTITY/Login",
        postData,
        {
          headers: { workspace: workspacename },
        }
      )
      .then((response) => {
        // console.log(JSON.stringify(response));
        response = response.data;

        if (response === "Authentication failed") {
          console.log("failed");
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

          saveToLocalStorage("email", response.UserInfo[0].email);
          saveToLocalStorage(
            "refresh_expires_in",
            response.access_info.refresh_expires_in
          );
          saveToLocalStorage("workspace", workspacename);
          window.location.reload();
        }
      })
      .catch(function (error) {
        setInvalidPassword(error);
        console.log("1", error);
      });
  };

  const saveToLocalStorage = (key, userToken) => {
    localStorage.setItem(key, userToken);
  };
  const handleEmailChange = (e) => {
    console.log("hello", e);
    setLoginCredentials({
      ...loginCredentials,
      username: e.target.value,
    });
    const email = e.target.value;
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (email === "") {
      setEmailError("Email is required");
    } else if (!emailRegex.test(email)) {
      setEmailError("Invalid Email Format");
    } else {
      setEmailError("");
    }
    setInvalidPassword(null);
  };

  const handlePasswordChange = (e) => {
    setLoginCredentials({
      ...loginCredentials,
      password: e.target.value,
    });

    const password = e.target.value;
    if (password === "") {
      setPasswordError("Password is required");
    } else {
      setPasswordError("");
    }
    setInvalidPassword(null);
  };

  // ==============================================================================================================

  const renderAllElements = (element, disabledStatus) => {
    switch (element.elementType) {
      case formElementType.label: {
        let labelbgColor = parse(element.fieldName)?.props?.style
          ?.backgroundColor;
        return (
          <div
            className="form-group"
            key={element.id}
            style={{
              position: "absolute",
              paddingBottom: "30px",
              left: `${(element.x / 24) * 100}%`,
              top: `${(element.y / 10) * 100}%`,
              height: `${(element.h / 10) * 100}%`,
              width: `${(element.w / 24) * 100}%`,
              textAlign: "center",
              background: labelbgColor,
            }}
          >
            {element.fieldName && <label> {parse(element.fieldName)}</label>}
          </div>
        );
      }
      case formElementType.image: {
        // console.log("element.imageUrl", element.imageUrl);
        return (
          <div
            className="form-group"
            key={element.id}
            style={{
              position: "absolute",
              marginTop: "0px",
              left: `${(element.x / 24) * 100}%`,
              top: `${(element.y / 10) * 100}%`,
              height: `${(element.h / 10) * 100}%`,
              width: `${(element.w / 24) * 100}%`,
            }}
          >
            {/* <img
              src={
                `https://cds.intelliflow.in` +
                element.imageUrl +
                `?Authorization=${localStorage.getItem(
                  "token"
                )}&workspace=${localStorage.getItem("workspace")}`
              }
              style={{ height: "100%", width: "100%" }}
              alt=""
              crossorigin="anonymous"
            /> */}
            <img
              src={
                process.env.REACT_APP_CDS_ENDPOINT +
                element.imageUrl +
                `?Authorization=${localStorage.getItem(
                  "token"
                )}&workspace=${localStorage.getItem("workspace")}`
              }
              style={{ height: "100%", width: "100%" }}
              alt=""
              crossOrigin="anonymous"
            />
          </div>
        );
      }
      case formElementType.text: {
        let hideItem = element?.hidden ?? false;
        const elementDisabledStatus =
          element?.disabled || disabledStatus ? true : false;
        // console.log("element.fieldType", element.fieldType);
        if (element.fieldType == "Email") {
          return (
            <div
              className="form-group"
              key={element.id}
              style={{
                position: "absolute",
                paddingBottom: "30px",
                marginTop: "0px",
                left: `${(element.x / 24) * 100}%`,
                top: `${(element.y / 10) * 100}%`,
                height: `${(element.h / 10) * 100}%`,
                width: `${(element.w / 24) * 100}%`,
                display: hideItem ? "none" : null,
              }}
            >
              <label className="fieldLable">
                {parse(
                  element?.fieldName ? element.fieldName : element.fieldType
                )}
                {element?.required === true ? (
                  <span style={{ color: "red" }}>*</span>
                ) : (
                  ""
                )}
                {/* {parse(element.fieldName)}
                {String(element.required) == "true" ? (
                  <span style={{ color: "red" }}>*</span>
                ) : (
                  ""
                )} */}
              </label>
              <input
                id="renderForm-formElementType-text"
                type={element.fieldType}
                className="inputStyle"
                placeholder={element?.placeholder}
                disabled={elementDisabledStatus}
                style={{
                  height: "100%",
                  width: "100%",
                }}
                data-tip
                value={formData[element.processVariableName]}
                onChange={(e) => handleEmailChange(e)}
              />
              <p>{emailError && <div className="error">{emailError}</div>}</p>
            </div>
          );
        } else {
          return (
            <div
              className="form-group"
              key={element.id}
              style={{
                position: "absolute",
                paddingBottom: "30px",
                left: `${(element.x / 24) * 100}%`,
                top: `${(element.y / 10) * 100}%`,
                height: `${(element.h / 10) * 100}%`,
                width: `${(element.w / 24) * 100}%`,
                display: hideItem ? "none" : null,
              }}
            >
              <label className="fieldLable">
                {/* {parse(
                  element?.fieldName ? element.fieldName : element.fieldType
                )}
                {element?.required === true ? (
                  <span style={{ color: "red" }}>*</span>
                ) : (
                  ""
                )} */}
                {parse(element.fieldName ? element.fieldName : "")}
                {String(element.required) == "true" ? (
                  <span style={{ color: "red" }}>*</span>
                ) : (
                  ""
                )}
              </label>
              <input
                id="renderForm-formElementType-text"
                type={element.fieldType}
                className="inputStyle"
                placeholder={element?.placeholder}
                disabled={elementDisabledStatus}
                style={{
                  height: "100%",
                  width: "100%",
                }}
                data-tip
                value={formData[element.processVariableName]}
                onChange={(e) => handlePasswordChange(e)}
              />
              {passwordError && <div className="error">{passwordError}</div>}
            </div>
          );
        }
      }
      case formElementType.button: {
        const processDataVariable = element.processVariableName?.replace(
          ".",
          ""
        );
        return (
          <div
            className="form-group"
            key={element.id}
            style={{
              position: "absolute",
              paddingBottom: "30px",
              left: `${(element.x / 24) * 100}%`,
              top: `${(element.y / 10) * 100}%`,
              height: `${(element.h / 10) * 100}%`,
              width: `${(element.w / 24) * 100}%`,
              textAlign: "center",
            }}
          >
            <button
              id="renderForm-formElementType-button"
              style={{
                height: "100%",
                width: "100%",
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "6px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
                backgroundColor: element?.bgColor ?? "#ff5711",
              }}
              onClick={handleLogin}
            >
              {parse(
                element.fieldName
                  ? element.fieldName.charAt(0).toUpperCase() +
                      element.fieldName.slice(1)
                  : ""
              )}
            </button>
            <p
              style={
                invalidPassword != null
                  ? {
                      color: "red",
                      visibility: "visible",
                      "margin-top": "15px",
                    }
                  : { color: "transparent", visibility: "hidden" }
              }
            >
              {"Entered Email or Password is wrong"}
            </p>
          </div>
        );
      }

      case formElementType.link: {
        return (
          <div
            className="form-group"
            key={element.id}
            style={{
              position: "absolute",
              paddingBottom: "30px",
              left: `${(element.x / 24) * 100}%`,
              top: `${(element.y / 10) * 100}%`,
              height: `${(element.h / 10) * 100}%`,
              width: `${(element.w / 24) * 100}%`,
              textAlign: "center",
            }}
          >
            {element.fieldName && (
              <Link to="/forgotPasswordCustom">
                <p
                  style={{
                    color: "#0D3C84",
                  }}
                >
                  {parse(element.fieldName)}
                </p>
              </Link>
            )}
          </div>
        );
      }
    }
  };

  // console.log({ formLayout });

  return (
    <div className="RenderForm-Container customScrollBar renderLoginPage">
      <div>{formLayout?.map((item) => renderAllElements(item, false))}</div>
    </div>
  );
};

export default RenderLoginPage;
