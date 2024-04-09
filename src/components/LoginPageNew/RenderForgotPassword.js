import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import parse from "html-react-parser";
import { loggedInUserState } from "../../state/atom";
import { useForm } from "react-hook-form";
import "./RenderLoginPage.css";
import { useHistory, Link } from "react-router-dom";

const RenderForgotPassword = () => {
  // const[workSpaceData, setWorkSpaceData]= useState(workspacename)
  const customWorkspace = localStorage.getItem("customWorkspace");
  const [formData, setformData] = useState({});
  const [formLayout, setFormLayout] = useState([]);
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const [emailError, setEmailError] = useState(null);
  const [invalidPassword, setInvalidPassword] = useState(null);
  const [validLink, setValidLink] = useState(null);
  const [apiResponse, setApiResponse] = useState("");
  const [email, setEmail] = useState(null);
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
        `${process.env.REACT_APP_IDENTITY_ENDPOINT}IDENTITY/Login/customLogin/${customWorkspace}/password`
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
  const checkEmail = () => {
    if (!email) {
      setEmailError("Please enter an email");
    }
  };

  const resetPassword = async (e) => {
    checkEmail();
    setEmailError(null);
    if (email) {
      const postData = { username: email };
      await axios
        .post(
          process.env.REACT_APP_IDENTITY_ENDPOINT +
            "IDENTITY/user/forgot-password",
          postData,
          {
            headers: {
              workspace: process.env.REACT_APP_WORKSPACE,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          setValidLink(response);
          setApiResponse(response.data.message);
        });
    }
  };

  const handleResetEmailInput = (ev) => {
    setEmail(ev.target.value);
    setValidLink(null);
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
        console.log("element.imageUrl", element.imageUrl);
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

        if (element.fieldType == "Email") {
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
                onChange={handleResetEmailInput}
              />
              <p>{emailError && <div className="error">{emailError}</div>}</p>
            </div>
          );
        }
      }
      case formElementType.button: {
        const processDataVariable = element.processVariableName?.replace(
          ".",
          ""
        );
        console.log("fieldName", element);
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
              onClick={resetPassword}
            >
              {element.fieldName &&
                typeof element.fieldName === "string" &&
                parse(
                  element?.fieldName?.charAt(0).toUpperCase() +
                    element?.fieldName?.slice(1)
                )}
            </button>
            <p
              style={
                validLink != null
                  ? { color: "red", visibility: "visible" }
                  : { color: "transparent", visibility: "hidden" }
              }
            >
              {apiResponse}
            </p>
            <p
              style={
                emailError
                  ? {
                      color: "red",
                      visibility: "visible",
                      "margin-top": "15px",
                    }
                  : { color: "transparent", visibility: "hidden" }
              }
            >
              Please enter all the mandatory fields
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
              marginTop: "0px",
              left: `${(element.x / 24) * 100}%`,
              top: `${(element.y / 10) * 100}%`,
              height: `${(element.h / 10) * 100}%`,
              width: `${(element.w / 24) * 100}%`,
              textAlign: "center",
            }}
          >
            {element.fieldName && (
              <Link to={`/?workspace=${customWorkspace}`}>
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
      <div>
        {formLayout?.map((item) => renderAllElements(item, false))}
        <p
          style={
            invalidPassword != null
              ? { color: "red", visibility: "visible", "margin-top": "15px" }
              : { color: "transparent", visibility: "hidden" }
          }
        ></p>
      </div>
    </div>
  );
};

export default RenderForgotPassword;
