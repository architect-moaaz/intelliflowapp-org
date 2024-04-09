import React, { useEffect, useState } from "react";
import { Row, Button, Col, Container, Glyphicon } from "react-bootstrap";
import IcomoonReact from "icomoon-react";
import "./Login.css";
import LoginForm from "./LoginForm";
import { Dots, IntelliflowLogoMain } from "../../assets/index";
import { useTranslation } from "react-i18next";

const LoginPage = () => {
  const [t, i18n] = useTranslation("common");
  const changeAppLanguage = (e) => {
    localStorage.setItem("language", e.target.value);
    i18n.changeLanguage(localStorage.getItem("language"));
    // setValue(e.target.value);
  };
  const currentYear = new Date().getFullYear();

  return (
    <div className="loginpage height100 row" id="LoginPageContainer">
      <div className="loginpage-background" id="loginPage-background ">
        {/* <IcomoonReact
            className="elipse hidden-xs dots"
            color="#F8F8FB"
            size={180}
            icon="Elipse"
          /> */}
        <img
          alt="#"
          src={Dots}
          className="dots-margin"
          height={200}
          width={200}
        />

        <div className="loginpage-txt ">
          <h1 className="primaryColor">{t("welcome.login")}</h1>
          {/* <h6>Its quick and easy</h6> */}
        </div>
      </div>
      <div className="loginpage-rightside">
        <div className="loginpage-logo">
          <img
            src={IntelliflowLogoMain}
            alt="logo"
            className="responsiveLogo"
            width="90"
            height="100"
          />
        </div>
        <div className="col-md-12  loginform" id="loginForm">
          <LoginForm />
        </div>

        <div
          className="loginpage-language"
          style={{ display: "flex", alignItems: "flex-end" }}
        >
          <span className="rightAlign secondaryColor">
            Select Language
            <select onChange={changeAppLanguage} id="SelectAppLanguage">
              <option value="en">English</option>
              <option value="ar">Arabic</option>
              <option value="jp">Japanese</option>
            </select>
          </span>
        </div>
      </div>

      <span
        className="leftAlign secondaryColor"
        style={{
          position: "fixed",
          color: "white",
          bottom: "0px",
          width: "500px",
        }}
      >
        © {currentYear} IntelliFlow Pte Ltd
        <br></br>
        Version 1.1.6
      </span>
    </div>
  );
};

export default LoginPage;
