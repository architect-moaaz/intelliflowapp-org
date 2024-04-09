// import DraggableChatButton from "./components/Chating/DraggableChatButton";
// import myAudio from "./ting.mp3";
// import { getMessagesInstanceState } from "./state/atom";
// import { io } from "socket.io-client";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./assets/fonts/stylesheet.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/js/dist/dropdown";
import * as themes from "./theme/schema.json";
import AccountDetails from "./AccountDetails/AccountDetails";
import AdminCenter from "./modules/AdminCenter/AdminCenter";
import AdminDashboard from "./components/ReportBuilderUser/AdminDashboard";
import ApplicationItemContainer from "./modules/ApplicationItem/ApplicationItemContainer";
import axios from "axios";
import BotConfig from "./components/Bot/BotConfig";
import BotDashboard from "./components/Bot/BotDashboard";
import BotSettings from "./components/Bot/BotSettings";
import BulkUpload from "./components/BulkUpload/BulkUpload";
import CreateReport from "./modules/ReportBuilder/Admin/CreateReport";
import DashboardContainer from "./modules/Dashboard/DashboardContainer";
import Grafana from "./components/Grafana/Grafana";
import GrafanaHeader from "./modules/Grafana/GrafanaHeader";
import Header from "./components/Header/Header";
import IFAppContainer from "./modules/IFAppItem/IFAppContainer";
import IFApplications from "./components/IFApp/Dashboard/IFApplications";
import Intellisheetv2 from "./components/Intellisheet/Intellisheetv2";
import KeyCloak from "./components/KeyCloak/KeyCloakContainer";
import KeyVaultContainer from "./modules/KeyVault/KeyVaultContainer";
import LeaveApplicationContainer from "./modules/LeaveApplication/LeaveApplicationContainer";
import LoginPage from "./components/LoginPage/LoginPage";
import LoginPageTabs from "./components/LoginPageNew/LoginPageTabs";
import Password from "./components/ForgotPassword/Password";
import PasswordAndConfirmPasswordValidation from "./components/ChangePasswordPopup/ChangePasswordPopup";
import Profile from "./Profile/Profile";
import RenderForgotPassword from "./components/LoginPageNew/RenderForgotPassword";
import RenderFormContainer from "./components/IFApp/Dashboard/RenderFormContainer/RenderFormContainer";
import RenderHomePageForm from "./components/HomePageTabPane/RenderHomePage/RenderHomePageForm";
import RenderLoginPage from "./components/LoginPageNew/RenderLoginPage";
import ReportBuilderHeader from "./modules/ReportBuilderUser/ReportBuilderHeader";
import ReportBuilderView from "./components/ReportBuilderUser/ReportBuilderView";
import ReportBuilderViewHeader from "./modules/ReportBuilderUser/ReportBuilderViewHeader";
import ReportHistory from "./components/ReportBuilderUser/ReportHistory";
import ReportHistoryHeader from "./modules/ReportBuilderUser/ReportHistoryHeader";
import Reports from "./modules/ReportBuilder/Admin/Reports";
import ReportsHeader from "./modules/ReportBuilderUser/ReportsHeader";
import ReSet from "./components/ForgotPassword/ReSet";
import SessionManagement from "./SessionManagement/SessionManagement";
import StudioCustomize from "./components/CSSCustomize/StudioCustomize";
import CustomTheme from "./components/CSSCustomize/CustomTheme";
import TemplateContainer from "./components/Templates/TemplateContainer";
import UniversalConnector from "./components/UniversalConnector/UniversalConnector";
import UniversalConnectorHeader from "./modules/UniversalConnector/UniversalConnectorHeader";
import UserManagementContainer from "./components/UserManagement/UserManagementContainer";
import UserManagementHeader from "./modules/UserManagement/UserManagementHeader";
import UserReports from "./components/ReportBuilderUser/Reports";
import { getUserPreferences } from "./components/DateAndTime/TimezoneHelper";
import { GlobalStyles } from "./theme/GlobalStyles";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { loggedInUserState, dynamicCssState } from "./state/atom";
import { ThemeProvider } from "styled-components";
import { ToastContainer } from "react-toastify";
import { useRecoilState } from "recoil";
import { useState, useEffect } from "react";
import { useTheme } from "./theme/useTheme";
import { useTranslation } from "react-i18next";

function App({ data, isDisplayError, showErrors, doGetAllResources }) {
  const [t, i18n] = useTranslation("common");
  localStorage.setItem("all-themes", JSON.stringify(themes.default));
  const [headerTitle, setheaderTitle] = useState(t("appDesigner"));
  const { theme, themeLoaded, setMode } = useTheme();
  const params = useQuery();
  const [customLogin, setCustomLogin] = useState(false);
  let space = "";
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const [cssSelected, setcssSelected] = useRecoilState(dynamicCssState);
  const [customWorkspaceName, setCustomWorkSpaceName] = useState({});

  function useQuery() {
    const search = window.location.search;
    return new URLSearchParams(search);
  }

  useEffect(() => {
    if (theme == "") {
      setMode("light");
    }
    setSelectedTheme(theme);
  }, [themeLoaded]);

  useEffect(() => {
    i18n.changeLanguage(
      localStorage.getItem("language") ? localStorage.getItem("language") : "en"
    );

    let query = window.location.href.split("?")[1];

    if (query) {
      var vars = query.split("&");

      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == "workspace") {
          space = pair[1];
          localStorage.setItem("customWorkspace", space);
          setCustomWorkSpaceName(space);
          setCustomLogin(true);
        }
      }
    }

    saveLoginData();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      const script = document.createElement("script");
      script.src = "http://editor.tentoro.in/bpmn/index.js";
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }, 5000);

    setTimeout(() => {
      const script = document.createElement("script");
      script.src = "http://editor.tentoro.in/dmn/index.js";
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }, 10000);
  }, []);

  useEffect(() => {
    fetchAutoSaveData();
    callGetUserPreferences();
  }, []);

  const fetchAutoSaveData = () => {
    const axios = require("axios");

    let config = {
      method: "get",
      url: "http://id-dev.tentoro.in/IDENTITY/misc/getWorkspaceConfig",
      headers: {
        workspace: "intelliflow",
      },
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.status == "Success") {
          localStorage.setItem(
            "AutoSaveFrequency",
            response.data.config.AutoSaveFrequency
          );
          localStorage.setItem(
            "AutoSave",
            response.data.config.AutoSaveFrequency
          );
          localStorage.setItem(
            "workspacetimezone",
            response.data.config.timezone
          );
          localStorage.setItem(
            "workspacetimezonelocale",
            response.data.config.locale_identifier
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const callGetUserPreferences = () => {
    let workspace = localStorage.getItem("workspace");
    let userid = localStorage.getItem("username");
    getUserPreferences(workspace, userid).then((response) => {
      if (response.status == "success") {
        console.log("res", response.data);
        if (response.data?.user_pref[0]?.timezone) {
          localStorage.setItem(
            "usertimezone",
            response.data?.user_pref[0]?.timezone
          );
        }
        if (response.data?.user_pref[0]?.locale_identifier) {
          localStorage.setItem(
            "usertimezonelocale",
            response.data?.user_pref[0]?.locale_identifier
          );
        }
      }
    });
  };

  const saveLoginData = () => {
    setLoggedInUser({
      token: localStorage.getItem("token"),
      username: localStorage.getItem("username"),
      email: localStorage.getItem("email"),
      firstName: localStorage.getItem("firstName"),
      lastName: localStorage.getItem("lastName"),
      id: localStorage.getItem("id"),
      refresh_token: localStorage.getItem("refresh_token"),
      groups: localStorage.getItem("groups"),
      roles: JSON.parse(localStorage.getItem("roles")),
      currentRole: JSON.parse(localStorage.getItem("currentRole")),
      workspace: localStorage.getItem("workspace"),
      enabled_menus: JSON.parse(localStorage.getItem("enabled_menus")),
    });
    // console.log("roles", loggedInUser);
  };

  const showToken = () => {
    return localStorage.getItem("token");
  };

  const renderLoginPage = () => {
    if (customLogin)
      return <RenderLoginPage workspacename={customWorkspaceName} />;

    return <LoginPage />;
  };

  if (showToken()) {
    return (
      <>
        {themeLoaded && (
          <ThemeProvider theme={selectedTheme}>
            <GlobalStyles />
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
            <Router>
              <div className="HeaderApp">
                <Header headerTitle={headerTitle} />
                <SessionManagement />
              </div>
              <div
                className="BodyAppContainer"
                style={{ height: "100%", overflowX: "hidden" }}
              >
                <div
                  className="BodyApp"
                  // style={{ height: "100%" }}
                >
                  <Switch>
                    <Route exact path="/">
                      <ApplicationItemContainer
                        setheaderTitle={setheaderTitle}
                      />
                    </Route>
                    <Route exact path="/Studio">
                      <LeaveApplicationContainer />
                    </Route>
                    <Route exact path="/Dashboard">
                      <IFAppContainer setheaderTitle={setheaderTitle} />
                    </Route>
                    <Route exact path="/applications">
                      <IFApplications setheaderTitle={setheaderTitle} />
                    </Route>
                    {loggedInUser.enabled_menus?.menus_enabled?.includes(
                      "ACCESS_CONTROLLER"
                    ) && (
                      <Route exact path="/user-management">
                        <UserManagementHeader setheaderTitle={setheaderTitle} />
                        <UserManagementContainer />
                      </Route>
                    )}
                    {loggedInUser.enabled_menus?.menus_enabled?.includes(
                      "USER_MANAGEMENT"
                    ) && (
                      <Route exact path="/keyclock">
                        <KeyCloak setheaderTitle={setheaderTitle} />
                      </Route>
                    )}
                    {loggedInUser.enabled_menus?.menus_enabled?.includes(
                      "CHATBOT_ENABLE"
                    ) && (
                      <Route exact path="/chatbot">
                        <BotDashboard setheaderTitle={setheaderTitle} />
                      </Route>
                    )}
                    <Route exact path="/botDashboard/botConfig">
                      <BotConfig />
                    </Route>
                    <Route exact path="/botDashboard/botSetting">
                      <BotSettings />
                    </Route>
                    <Route exact path="/CustomTheme">
                      <CustomTheme />
                    </Route>


                    <Route exact path="/form">
                      <RenderFormContainer />
                    </Route>
                    <Route exact path="/Profile">
                      <Profile setheaderTitle={setheaderTitle} />
                    </Route>
                    {loggedInUser.enabled_menus?.menus_enabled?.includes(
                      "SUBSCRIPTION_DETAILS"
                    ) && (
                      <Route exact path="/account-details">
                        <AccountDetails setheaderTitle={setheaderTitle} />
                      </Route>
                    )}
                    <Route exact path="/homepage">
                      <RenderHomePageForm />
                    </Route>
                    {[
                      "UNIVERSAL_CONNECTOR",
                      "CHATBOT_BUILDER",
                      "REPORT_BUILDER",
                      "USER_MANAGEMENT",
                      "BULK_UPLOAD",
                      "PLATFORM_CUSTOMIZE",
                      "LOGINPAGE_CUSTOMIZATION",
                      "ACCESS_CONTROLLER",
                      "SUBSCRIPTION_DETAILS",
                      "GRAFANA",
                    ].some((e) =>
                      loggedInUser?.enabled_menus?.menus_enabled?.includes(e)
                    ) && (
                      <Route exact path="/AdminDashboard">
                        <ReportBuilderHeader setheaderTitle={setheaderTitle} />
                        <AdminDashboard />
                      </Route>
                    )}
                    <Route exact path="/UserReports">
                      <ReportsHeader setheaderTitle={setheaderTitle} />
                      <UserReports />
                    </Route>
                    <Route exact path="/ReportBuilderView">
                      <ReportBuilderViewHeader
                        setheaderTitle={setheaderTitle}
                      />
                      <ReportBuilderView />
                    </Route>
                    <Route exact path="/ReportHistory">
                      <ReportHistoryHeader setheaderTitle={setheaderTitle} />
                      <ReportHistory />
                    </Route>
                    {loggedInUser.enabled_menus?.menus_enabled?.includes(
                      "BULK_UPLOAD"
                    ) && (
                      <Route exact path="/bulk-upload">
                        <BulkUpload setheaderTitle={setheaderTitle} />
                      </Route>
                    )}
                    <Route exact path="/admin/dashboard">
                      <AdminCenter setheaderTitle={setheaderTitle} />
                    </Route>

                    <Route exact path="/reports">
                      <Reports setheaderTitle={setheaderTitle} />
                    </Route>
                    {loggedInUser.enabled_menus?.menus_enabled?.includes(
                      "REPORT_BUILDER"
                    ) && (
                      <Route exact path="/reports">
                        <Reports setheaderTitle={setheaderTitle} />
                      </Route>
                    )}
                    <Route exact path="/report/create">
                      <CreateReport setheaderTitle={setheaderTitle} />
                    </Route>
                    <Route exact path="/Intellisheet">
                      <Intellisheetv2 />
                    </Route>
                    {loggedInUser.enabled_menus?.menus_enabled?.includes(
                      "UNIVERSAL_CONNECTOR"
                    ) && (
                      <Route exact path="/universal-connector">
                        <UniversalConnectorHeader
                          setheaderTitle={setheaderTitle}
                        />
                        <UniversalConnector />
                      </Route>
                    )}
                    {loggedInUser.enabled_menus?.menus_enabled?.includes(
                      "PLATFORM_CUSTOMIZE"
                    ) && (
                      <Route exact path="/customize">
                        <StudioCustomize setheaderTitle={setheaderTitle} />
                      </Route>
                    )}
                    <Route exact path="/template">
                      <TemplateContainer />
                    </Route>
                    <Route exact path="/keyvault">
                      <KeyVaultContainer setheaderTitle={setheaderTitle} />
                    </Route>
                    <Route exact path="/loginCustomize">
                      <LoginPageTabs setheaderTitle={setheaderTitle} />
                    </Route>

                    <Route exact path="/grafana">
                      <GrafanaHeader setheaderTitle={setheaderTitle} />
                      <Grafana />
                    </Route>
                    <PasswordAndConfirmPasswordValidation />
                  </Switch>
                </div>
              </div>
            </Router>
          </ThemeProvider>
        )}
      </>
    );
  } else {
    return (
      <Router>
        <Switch>
          <Route exact path="/forgotPassword">
            <Password />
          </Route>
          <Route exact path="/resetPassword">
            <ReSet />
          </Route>
          <Route exact path="/forgotPasswordCustom">
            <RenderForgotPassword />
          </Route>

          <Route path="/">{renderLoginPage()}</Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
