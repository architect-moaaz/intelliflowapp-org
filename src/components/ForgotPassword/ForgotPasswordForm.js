import axios from "axios";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";
import { useTranslation } from "react-i18next";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState(null);
  const [workspace, setWorkspace] = useState(null);
  const [responseFromApi, setresponseFromApi] = useState("");
  const [validLink, setValidLink] = useState(null);
  const [apiResponse, setApiResponse] = useState("");

  const onEmailChange = (ev) => {
    setEmail(ev.target.value);
  };
  const [t, i18n] = useTranslation("common");

  const [emailError, setEmailError] = useState(null);
  const [workspaceError, setworkspaceError] = useState(null);
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

  const handleResetEmailInput = (ev) => {
    setEmail(ev.target.value);
    setValidLink(null);
  };
  const handleResetWorkspaceInput = (ev) => {
    setWorkspace(ev.target.value);
    setValidLink(null);
  };
  // const handleReq = async (e) => {
  //   e.preventDefault();
  //   setworkspaceError(null);
  //   setEmailError(null);
  // checkWorkspace();
  // checkEmail();
  // checkPassword();

  const resetPassword = async (e) => {
    // console.log("call API with" + email);
    e.preventDefault();
    setworkspaceError(null);
    setEmailError(null);
    checkWorkspace();
    checkEmail();
    if (email) {
      const postData = { username: email };
      // console.log(postData);
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
          // console.log("response",response);
          setValidLink(response);
          setApiResponse(response.data.message);
          // 
          // age("token", response.data.access_token);
          // response = response.data;
          // setresponseFromApi(response);
        });
    }
  };
  return (
    <div className="" style={{}}>
      {/* <form style={{}}> */}
      <div>
        <h1 className="d-flex textStyle justify-content-center align-items-end primaryColor">
          {/* <center className="textStyle"> */}
          {t("welcome.enteremailid")}
          {/* </center> */}
        </h1>
      </div>
      <div className="col-md-12 d-flex justify-content-center text-center">
        <form>
          <div className="mt-5 mb-3 forgotpassword-input">
            <div className="">
              <input
                value={workspace}
                onChange={handleResetWorkspaceInput}
                placeholder={t("welcome.workspace")}
                className="customInput"
                id="forgotPasswordForm-workspace-input"
                required
              />
            </div>
            <div className="">
              <input
                value={email}
                onChange={handleResetEmailInput}
                placeholder={t("welcome.email")}
                className="customInput"
                id="forgotPasswordForm-email-input"
                required
              />
            </div>
            <div className="mt-1 forgotpassword-haveanaccount">
              {t("welcome.haveAccount")}{" "}
              <Link
                to="/"
                className="forgotpassword-login"
                id="forgotPasswordForm-logIn-link"
              >
                {t("welcome.login")}
              </Link>
            </div>
          </div>

          <div>
            <button
              onClick={resetPassword}
              type="button"
              className="loginbutton"
              id="forgotPasswordForm-requestResetLink-button"
            >
              {t("welcome.requestresetLink")}
            </button>

            <p
              className="secondaryColor"
              style={
                validLink != null
                  ? { color: "green", visibility: "visible" }
                  : { color: "transparent", visibility: "hidden" }
              }
            >
              {" "}
              {apiResponse} {""}
            </p>
            <p
              className="secondaryColor"
              style={
                workspaceError || emailError
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
          {/* <div className="mt-2 forgotpassword-account">
            <span>
              Don't have an account?{" "}
              <Link to="/signup" color="#0000EE">
                Sign up
              </Link>
            </span>
          </div> */}
        </form>
      </div>

      <center>
        <br></br>
        <div className="forgotpassword-response">{responseFromApi}</div>
      </center>
      {/* </form> */}
    </div>
  );
};

export default ForgotPasswordForm;
