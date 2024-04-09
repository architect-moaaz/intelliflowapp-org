import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./index.css";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import common_ar from "./assets/translations/ar/common.json";
import common_en from "./assets/translations/en/common.json";
import common_jp from "./assets/translations/jp/common.json";
import { RecoilRoot } from "recoil";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { dangerIco } from "./assets";
import CommonModelContainer from "./components/CommonModel/CommonModelContainer";
import "./NoInternetPopup.css";

// Initialize i18next outside the component
i18next.init({
  interpolation: { escapeValue: false },
  lng: "en",
  resources: {
    en: {
      common: common_en,
    },
    ar: {
      common: common_ar,
    },
    jp: {
      common: common_jp,
    },
  },
});

// Add an Axios interceptor to set common headers for requests
axios.interceptors.request.use((req) => {
  const urls = [
    "/Login",
    "user/forgot-password",
    "employee/checkPasswordToken",
    "resetpassword/fetchresetpassword",
  ];

  const languageTag = navigator.language;
  const hourCycle = Intl.DateTimeFormat().resolvedOptions().hourCycle || "h23";
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (urls.some((substring) => req.url.includes(substring))) {
    return req;
  } else {
    req.headers = {
      ...req.headers,
      workspace: localStorage.getItem("workspace"),
      devicesupport: "D",
      languageTag,
      hourCycle,
      timeZone,
      Authorization: `Bearer ${
        req.url.includes("/api/v2") || req.url.includes("/api/v1")
          ? localStorage.getItem("botToken")
          : localStorage.getItem("token")
      }`,
    };
    return req;
  }
});

// Create a custom hook for setting the document title
function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

// Render the app component
function RenderApp() {
  useDocumentTitle("Intelliflow App");
  const [isModalOpen, setModalOpen] = useState(false);

  // Function to handle modal close
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Event listener for the "storage" event
  useEffect(() => {
    const handleStorageEvent = () => {
      setModalOpen(true);
    };

    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, []);

  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
      console.log(navigator.onLine);
    };

    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
    };
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV == "development") {
      // This line suppresses the error overlay
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__.suppressReactErrorOverlay = true;
    }
  });

  return (
    <React.StrictMode>
      <RecoilRoot>
        <I18nextProvider i18n={i18next}>
          <App />
        </I18nextProvider>
      </RecoilRoot>
      <Modal
        show={isModalOpen}
        onHide={handleCloseModal}
        centered
        size="md"
        id="multiple-tabs-open-model"
        backdrop="static"
      >
        <Modal.Header className="header-main-nav">
          <Modal.Title>Multiple Tabs</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4 px-4 create-new-app-modal">
          <div>
            <div className="row">
              <h5 className="secondaryColor">
                Please close the additional window or tab that is currently
                open.
              </h5>
            </div>
            <div className="row">
              <div className="col-12 mt-4 mb-2 appdesigner-deleteapp-cancel">
                <button
                  id="delete-app-cancel-btn"
                  className="secondaryButton secondaryButtonColor"
                  onClick={handleCloseModal}
                >
                  Stay Here
                </button>
                <button
                  id="delete-app-delete-btn"
                  className="primaryButton priamryButtonColor"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <CommonModelContainer
        modalTitle="No Internet"
        show={!isOnline}
        id="noInternet-popup"
        className="noInternet-modal"
      >
        <div className="noInternet-content">
          <div className="alert-icon-data">
            <div class="alert-icon">
              <div class="exclamation-shape"></div>
            </div>
          </div>
          <p className="message">No Internet connection Found !</p>
          <p className="messageSecond">Please enable your internet </p>
        </div>
      </CommonModelContainer>
    </React.StrictMode>
  );
}

ReactDOM.render(<RenderApp />, document.getElementById("root"));

reportWebVitals();
