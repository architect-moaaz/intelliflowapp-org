import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";
import { Row } from "react-bootstrap";
import univarsalConnectorImg from "../../assets/images/universalConnectorImg.png";
import ChatBotImg from "../../assets/images/ChatBotImg.png";
import ReportBuilderImg from "../../assets/images/ReportBuilderImg.png";
import UserMgtImg from "../../assets/images/UserMgtImg.png";
import BulkUploadImg from "../../assets/images/BulkUploadImg.png";
import AccountDetailsImage from "../../assets/images/AccountDetailsImg.png";
import keyvault from "../../assets/images/keyvault.jpg";
import PlatformCustomizeImage from "../../assets/images/PlatformCustomizationImg.png";
import AccessControllerImg from "../../assets/images/AccessControllerAdminDash.png";
import LoginPageCustomizeImg from "../../assets/images/LoginPageCustomizeAdminDash.png";
import { loggedInUserState } from "../../state/atom";
import { useRecoilState } from "recoil";
const AdminDashboard = () => {
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const [t, i18n] = useTranslation("common");
  return (
    <>
      <div className="main-content-admin customScrollBar">
        <Row className="adminDashMainContent customScrollBar">
          {loggedInUser.enabled_menus?.menus_enabled?.includes(
            "UNIVERSAL_CONNECTOR"
          ) && (
            <div className="adminDashContainer">
              <Link id="admin-dash-connector" to="/universal-connector">
                <div className="adminDashImageContainer">
                  <img
                    src={univarsalConnectorImg}
                    alt=""
                    className="image-admin-dash"
                  />
                </div>
                <div className="adminDashContent">
                  <span
                    id="admin-universal-connector"
                    className="admindashboardboxnamePA primaryColor"
                  >
                    {t("Universal Connector")}
                  </span>
                  <p className="secondaryColor">
                    {" "}
                    {t(
                      "Universal connector enables app integration with external databases, facilitating client-server communication."
                    )}
                  </p>
                </div>
              </Link>
            </div>
          )}
          {/* {loggedInUser.enabled_menus?.menus_enabled?.includes(
            "CHATBOT_ENABLE"
          ) && (
            <div className="adminDashContainer">
              <Link id="admin-chatbot-builder" to="/chatbot">
                <div className="adminDashImageContainer">
                  <img src={ChatBotImg} alt="" className="image-admin-dash" />
                </div>
                <div className="adminDashContent">
                  <span id="admin-chatbot-builder" className="primaryColor">
                    {t("Chatbot Builder")}
                  </span>
                  <p className="secondaryColor">
                    {t(
                      "Build and deploy chatbots seamlessly with chatbot builder, automating interactions and engaging users in conversations."
                    )}
                  </p>
                </div>
              </Link>
            </div>
          )} */}
          {loggedInUser.enabled_menus?.menus_enabled?.includes(
            "REPORT_BUILDER"
          ) && (
            <div className="adminDashContainer">
              <Link id="admin-report-builder" to="/Reports">
                <div className="adminDashImageContainer">
                  <img
                    src={ReportBuilderImg}
                    alt=""
                    className="image-admin-dash"
                    style={{ width: "298px" }}
                  />
                </div>
                <div className="adminDashContent">
                  <span className="primaryColor">{t("Report Builder")}</span>
                  <p className="secondaryColor">
                    {t(
                      "Easily generate customised reports and gain insights from your data using a user-friendly report builder."
                    )}
                  </p>
                </div>
              </Link>
            </div>
          )}
          {loggedInUser.enabled_menus?.menus_enabled?.includes(
            "USER_MANAGEMENT"
          ) && (
            <div className="adminDashContainer">
              <Link id="admin-dash-user-mgt" to="/keyclock">
                <div className="adminDashImageContainer">
                  <img src={UserMgtImg} alt="" className="image-admin-dash" />
                </div>
                <div className="adminDashContent">
                  <span id="admin-user-mgt" className="primaryColor">
                    {t("User Management")}
                  </span>
                  <p className="secondaryColor">
                    {t(
                      "Effortlessly manage user accounts, roles, and secure access to system resources with user management tools."
                    )}
                  </p>
                </div>
              </Link>
            </div>
          )}
          {loggedInUser.enabled_menus?.menus_enabled?.includes(
            "BULK_UPLOAD"
          ) && (
            <div className="adminDashContainer">
              <Link id="admin-dash-bulk-upload" to="/bulk-upload">
                <div className="adminDashImageContainer">
                  <img
                    src={BulkUploadImg}
                    alt=""
                    className="image-admin-dash"
                  />
                </div>
                <div className="adminDashContent">
                  <span
                    id="admin-subscription-mgt"
                    className="admindashboardboxnameSM primaryColor"
                  >
                    {" "}
                    {t("Bulk Upload")}
                  </span>
                  <p className="secondaryColor">
                    {t(
                      "This Allows you to take immediate bulk action on issues and opportunities you want to update data in a shot"
                    )}
                  </p>
                </div>
              </Link>
            </div>
          )}
          {loggedInUser.enabled_menus?.menus_enabled?.includes(
            "PLATFORM_CUSTOMIZE"
          ) && (
            <div className="adminDashContainer">
              <Link id="admin-dash-platform-customize" to="/customize">
                <div className="adminDashImageContainer">
                  <img
                    src={PlatformCustomizeImage}
                    alt=""
                    className="image-admin-dash"
                  />
                </div>
                <div className="adminDashContent">
                  <span
                    id="admin-subscription-mgt"
                    className="admindashboardboxnameSM primaryColor"
                  >
                    {" "}
                    {t("Platform Customization")}
                  </span>
                  <p className="secondaryColor">
                    {t(
                      "Tailor the UI, functionality, and settings to specific needs, enhancing user experience and flexibility."
                    )}
                  </p>
                </div>
              </Link>
            </div>
          )}
          {loggedInUser.enabled_menus?.menus_enabled?.includes(
            "LOGINPAGE_CUSTOMIZATION"
          ) && (
            <div className="adminDashContainer">
              <Link id="admin-dash-loginpage-customize" to="/loginCustomize">
                <div className="adminDashImageContainer">
                  <img
                    src={LoginPageCustomizeImg}
                    alt=""
                    className="image-admin-dash"
                  />
                </div>
                <div className="adminDashContent">
                  <span
                    id="admin-subscription-mgt"
                    className="admindashboardboxnameSM primaryColor"
                  >
                    {" "}
                    {t("Login Page Customization")}
                  </span>
                  <p className="secondaryColor">
                    {t(
                      "Tailored design and branding for the login interface, providing a unique and cohesive user experience."
                    )}
                  </p>
                </div>
              </Link>
            </div>
          )}
          {loggedInUser.enabled_menus?.menus_enabled?.includes(
            "ACCESS_CONTROLLER"
          ) && (
            <div className="adminDashContainer">
              <Link id="admin-dash-access-controller" to="/user-management">
                <div className="adminDashImageContainer">
                  <img
                    className="image-admin-dash"
                    src={AccessControllerImg}
                    alt=""
                    style={{ width: "298px" }}
                  />
                </div>
                <div className="adminDashContent">
                  <span
                    id="admin-subscription-mgt"
                    className="admindashboardboxnameSM primaryColor"
                  >
                    {" "}
                    {t("Access Controller")}
                  </span>
                  <p className="secondaryColor">
                    {t(
                      "Manages user permissions, ensuring secure and authorized access to resources and data."
                    )}
                  </p>
                </div>
              </Link>
            </div>
          )}
          {loggedInUser.enabled_menus?.menus_enabled?.includes(
            "SUBSCRIPTION_DETAILS"
          ) && (
            <div className="adminDashContainer">
              <Link id="admin-dash-subscription-details" to="/account-details">
                <div className="adminDashImageContainer">
                  <img
                    className="image-admin-dash"
                    src={AccountDetailsImage}
                    alt=""
                  />
                </div>
                <div className="adminDashContent">
                  <span
                    id="admin-subscription-mgt"
                    className="admindashboardboxnameSM primaryColor"
                  >
                    {" "}
                    {t("Subscription Details")}
                  </span>
                  <p className="secondaryColor">
                    {t(
                      "Store and display user-specific information, such as personal information, preferences, settings, and transaction history securely."
                    )}
                  </p>
                </div>
              </Link>
            </div>
          )}
          <div className="adminDashContainer">
            <Link id="admin-dash-subscription-details" to="/keyvault">
              <div className="adminDashImageContainer">
                <img className="image-admin-dash" src={keyvault} alt="" />
              </div>
              <div className="adminDashContent">
                <span
                  id="admin-subscription-mgt"
                  className="admindashboardboxnameSM primaryColor"
                >
                  {" "}
                  {t("Key Vault")}
                </span>
                <p className="secondaryColor">
                  {t(
                    "Its a service for securely storing and accessing secrets. A secret is anything that you want to tightly control access to, such as API keys, passwords, or cryptographic keys."
                  )}
                </p>
              </div>

              
            </Link>
          </div>
          <div className="adminDashContainer">
            <Link id="admin-dash-Grafana" to="/Grafana">
              <div className="adminDashImageContainer">
                <img
                  className="image-admin-dash"
                  src={BulkUploadImg}
                  alt="Analytics"
                />
              </div>
              <div className="adminDashContent">
                <span
                  id="admin-Grafana"
                  className="admindashboardboxnameSM primaryColor"
                >
                  {t("Monitoring")}
                </span>
                <p className="secondaryColor">
                  {t("Tracking and Visualizing the health of various services and applications in the system.")}
                </p>
              </div>
            </Link>
          </div>



        </Row>
      </div>
    </>
  );
};



export default AdminDashboard;
