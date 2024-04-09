import React, { useEffect, useState, useCallback, useRef } from "react";
import { throttle } from "lodash";
import "./SessionManagement.css";
import { useRecoilState } from "recoil";
import { loggedInUserState } from "../state/atom";
import { Icon } from "@iconify/react";
import { Modal } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const EVENTS = [
  "load",
  "mousemove",
  "mousedown",
  "click",
  "scroll",
  "keypress",
];

const SessionManagement = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenLoggedOut, setIsOpenLoggedOut] = useState(false);
  const warnTimeout = useRef(null);
  const logoutTimeout = useRef(null);
  const [, setLoggedInUser] = useRecoilState(loggedInUserState);
  const history = useHistory();

  const UpdateToken = async () => {
    const axios = require("axios");
    const data = JSON.stringify({
      refresh_token: localStorage.getItem("refresh_token"),
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_IDENTITY_ENDPOINT}IDENTITY/Login/refresh`,
      headers: {
        workspace: localStorage.getItem("workspace"),
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      if (response.data.status === "Success") {
        localStorage.setItem(
          "refresh_token",
          response.data.access_info.refresh_token
        );
        localStorage.setItem("token", response.data.access_info.access_token);
      } else if (response.data.status === "Failure") {
        logout();
        console.log("UpdateToken: Failure");
      }
    } catch (error) {
      console.log("UpdateToken: Error", error);
      logout();
    }
  };

  const warn = () => {
    setIsOpen(true);
  };

  const logout = () => {
    destroy();
  };

  const clearTimeouts = () => {
    clearTimeout(warnTimeout.current);
    clearTimeout(logoutTimeout.current);
  };

  const setTimeouts = () => {
    const refreshTime = localStorage.getItem("refresh_expires_in");
    warnTimeout.current = setTimeout(warn, (parseInt(refreshTime) - 60) * 1000);
    logoutTimeout.current = setTimeout(logout, parseInt(refreshTime) * 1000);
  };

  const resetTimeout = useCallback(() => {
    clearTimeouts();
    setTimeouts();
    UpdateToken();
    setIsOpen(false);
  }, []);

  const loggedOutLogin = () => {
    history.push("/");
    window.location.reload();
  };

  const throttledResetTimeout = useRef(throttle(resetTimeout, 60000));

  useEffect(() => {
    const eventHandler = (event) => {
      if (event !== "mousemove" || !isOpen) {
        throttledResetTimeout.current();
      }
    };

    if (localStorage.getItem("token")) {
      EVENTS.forEach((event) => {
        window.addEventListener(event, eventHandler);
      });

      return () => {
        clearTimeouts();
        EVENTS.forEach((event) => {
          window.removeEventListener(event, eventHandler);
        });
      };
    }
  }, [isOpen]);

  const destroy = () => {
    setIsOpen(false);
    setIsOpenLoggedOut(true);
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    const workspace = localStorage.getItem("workspace");
    const isChecked = localStorage.getItem("isChecked");
    localStorage.clear();
    if (isChecked) {
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);
      localStorage.setItem("workspace", workspace);
      localStorage.setItem("isChecked", isChecked);
    }
    setLoggedInUser({});
    window.location.reload();
    window.location.href = "/";
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleCloseLoggedOut = () => {
    setIsOpenLoggedOut(false);
  };

  return (
    <div className="App">
      <Modal
        className="sessionManagement-conatiner"
        id="sessionManagement-modal"
        centered
        show={isOpen}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="header-main-nav" closeButton>
          <Modal.Title>Session Timeout Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6 className="sessionManagement-body secondaryColor">
            <span className="sessionManagement-body-alertIcon secondaryColor">
              <Icon
                style={{ height: 30, width: 30 }}
                icon="material-symbols:timer-outline"
              />
            </span>
            You will be logged out automatically in 1 minute.
          </h6>
          <div className="stay-loggButton">
            <button
              className="deletednmprimaryButton primaryButtonColor"
              id="sessionManagement-loggedIn"
              onClick={resetTimeout}
            >
              Stay Logged In
            </button>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        className="sessionManagement-conatiner"
        id="sessionManagement-modal-LoggedOut"
        centered
        show={isOpenLoggedOut}
        onHide={handleCloseLoggedOut}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="header-main-nav" closeButton>
          <Modal.Title>Session Timeout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6 className="sessionManagement-body secondaryColor">
            <span className="sessionManagement-body-alertIcon secondaryColor">
              <Icon
                style={{ height: 30, width: 30 }}
                icon="material-symbols:timer-outline"
              />
            </span>
            You are logged out.
          </h6>
          <div className="stay-loggButton">
            <button
              className="deletednmprimaryButton primaryButtonColor"
              id="sessionManagement-loggedIn"
              onClick={loggedOutLogin}
            >
              Click here to login again
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SessionManagement;
