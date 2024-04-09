import React, { useEffect, useState } from "react";
import { Row, Button, Col, Container, Glyphicon } from "react-bootstrap";
import IcomoonReact from "icomoon-react";
import "../LoginPage/Login.css";
import ReSetPasswordForm from "./ReSetPasswordForm";
import { Dots, IntelliflowLogoMain } from "../../assets/index";
import "./ForgotPassword.css";
import { useLocation } from "react-router";
import queryString from "query-string";
const CryptoJS = require("crypto-js");
const ReSet = () => {
  const location = useLocation();
  var id = queryString.parse(location.search).id;
  var token = queryString.parse(location.search).token;
  const key = "6fa979f20126cb08aa645a8f495f6d85";
  const iv = "I8zyA4lVhMCaJ5Kg";

  const decrypted = CryptoJS.AES.decrypt(id, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(iv), // parse the IV
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  }).toString(CryptoJS.enc.Utf8);

  // console.log("Decrypt user id", decrypted);
  return (
    <>
      <Row className="height100">
        <Col md={5} className="background">
          <img alt="#" src={Dots} className="dots-margin" />
          <div className=" fp signUp ">
            <h1 className="primaryColor">Reset Password</h1>
          </div>
        </Col>
        <Col md={7} className="forgotpassword-screen">
          <div className="col-md-12 h-25 logo">
            <img
              src={IntelliflowLogoMain}
              alt="logo"
              className="img-responsive"
            />
          </div>
          <div className="loginform  mt-5">
            <ReSetPasswordForm userid={decrypted} token={token} />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ReSet;
