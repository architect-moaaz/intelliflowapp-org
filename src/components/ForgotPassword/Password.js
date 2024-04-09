import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import IcomoonReact from "icomoon-react";
import "../LoginPage/Login.css";
import "./ForgotPassword.css";
import { useTranslation } from "react-i18next";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { Dots, IntelliflowLogoMain } from "../../assets/index";

const Password = () => {

  const [t, i18n] = useTranslation("common");
  const currentYear = new Date().getFullYear();
  return (
    <>
      <Row className="height100">
        <Col md={5} className="background">
          <img alt="#" src={Dots} className="dots-margin" />
          <div className=" fp signUp ">
            <h1 className="primaryColor">{t("welcome.forgotPassword")}</h1>
          </div>
          <span className="leftAlignfp secondaryColor" style={{ position: "fixed", color: "white", bottom: "0px", width: "500px" }}>
        © {currentYear} IntelliFlow Pte Ltd 
        <br></br>
        Version 1.0.8
      </span>
        </Col>
        <Col md={7} className="forgotpassword-screen">
          <div className="forgotpassword-logo">
            <img
              src={IntelliflowLogoMain}
              alt="logo"
              className="forgotpassword-responsiveLogo"
            />
          </div>
          <div className="loginform  mt-5">
            <ForgotPasswordForm />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Password;
