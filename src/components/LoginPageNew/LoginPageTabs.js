import React from "react";
// import "./FormBuilderTabePane.css"
import { Breadcrumb, Tab, TabPane, Nav } from "react-bootstrap";
import LoginTabPaneContainer from "./LoginTabPaneContainer";
import "./ForgotPasswordCustom.css";
import ForgotPasswordTabPaneContainer from "./ForgotPasswordTabPaneContainer";

const LoginPageTabs = ({ setheaderTitle }) => {
  setheaderTitle("Login Page Customization");

  return (
    <div className="loginPageCustom-container">
    <div className="loginPageCustom-main-work-flow customScrollBar">
      <Tab.Container
        id="left-tabs-example"
        defaultActiveKey="first"
        // className="loginPageCustom-main-work-topbar"
      >
        <Nav variant="pills" className="loginPageCustom-main-pages-tabs ">
          <Nav.Item>
            <Nav.Link eventKey="first">Login Page Customization</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="Second">Forgot Password Customization</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content className="fpCustomise-tabContent">
          <Tab.Pane eventKey="first">
            <LoginTabPaneContainer />
          </Tab.Pane>
          <TabPane eventKey="Second">
            <ForgotPasswordTabPaneContainer />
          </TabPane>
        </Tab.Content>
      </Tab.Container>
    </div>
    </div>
  );
};

export default LoginPageTabs;
