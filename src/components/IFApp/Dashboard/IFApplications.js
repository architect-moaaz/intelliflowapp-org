import { Link, useLocation } from "react-router-dom";
import { Home } from "../../../assets";
import { useState, useEffect } from "react";
import { ReactComponent as GridIcon } from "../../../assets/Icons/GridIcon.svg";
import { ReactComponent as ListIcon } from "../../../assets/Icons/ListIcon.svg";
import "../../ApplicationDashboard/ApplicationDashboard.css";
import "./IFApp.css";
import Sidebar from "./Sidebar";
import Listview from "./Listview";
import GridView from "./GridView";
import "./Card.css";
import "./Sidebar.css";
import ListviewSidebar from "../../Sidebar/ListviewSidebar";
import ProcessHistoryTable from "../../ProcessHistory/ProcessHistoryTable";
import "./IFApplication.css";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

const IFApplications = ({ setheaderTitle }) => {
  const [t, i18n] = useTranslation("common");
  setheaderTitle(t("appStore"));
  localStorage.setItem("Dashboard", t("appStore"));
  const Location = useLocation();
  if (Location.state) localStorage.setItem("appName", Location.state.appName);

  const [gridListIcon, setGridListIcon] = useState("grid");

  const handleGridListIcon = (e, value) => {
    setGridListIcon(value);
    e.preventDefault();
  };

  const history = useHistory();
  useEffect(() => {
    if (
      localStorage.getItem("appdisplayname") == NaN ||
      localStorage.getItem("appdisplayname") == ""
    ) {
      history.push("/Dashboard");
    }
  }, [localStorage.getItem("appdisplayname")]);

  return (
    <>
      <div className="mainbody BodyColor">
        <div className="breadCrum BodyColor">
          <Link to="/dashboard" id="ifApplication-dashboard-link">
            <img src={Home} alt="" />
          </Link>
          <h6 className="primaryColor">{">>"}</h6>
          <Link
            to="/dashboard"
            className="IFApplication-breadCrum BodyColor"
            id="ifApplication-appDashboard-link"
          >
            <h6 className="primaryColor">
              {localStorage.getItem("appdisplayname")}
            </h6>
          </Link>
        </div>

        <div className="main">
          <div className="IFApplication-main-body BodyColor">
            <Sidebar className="BodyColor" id="appliifApplicationst-sidebar" />
          </div>

          <ul
            class="nav nav-pills label-pills IFApplication-subHeader"
            id="pills-tab"
            role="tablist"
          >
            <li class="nav-item" role="RecentActions">
              <button
                class="nav-link active propertiesPopup"
                id="RecentActions-tab"
                data-bs-toggle="pill"
                data-bs-target="#RecentActions"
                type="button"
                role="tab"
                aria-controls="RecentActions"
                aria-selected="true"
              >
                {t("Recent Actions")}
              </button>
            </li>
            <li class="nav-item IFApplication-nav-link" role="ProcessHistory">
              <button
                class="nav-link propertiesPopup"
                id="ProcessHistory-tab"
                data-bs-toggle="pill"
                data-bs-target="#ProcessHistory"
                type="button"
                role="tab"
                aria-controls="ProcessHistory"
                aria-selected="false"
              >
                {t("Process History")}
              </button>
            </li>
          </ul>
          <div
            class="tab-content"
            id="pills-tabContent"
            style={{ height: "100vh" }}
          >
            <div
              class="tab-pane fade show active BodyColor"
              id="RecentActions"
              role="tabpanel"
              aria-labelledby="RecentActions-tab"
            >
              <div className="list-grid-content">
                <div className="ListGridContainer">
                  <div className="GridListIconContainer BodyColor">
                    <GridIcon
                      className={
                        gridListIcon === "grid"
                          ? "GridListIconActive iconSvgFillColor"
                          : "GridListIconNotActive iconSvgFillColor"
                      }
                      onClick={(e) => handleGridListIcon(e, "grid")}
                      id="ifApplication-gridIcon"
                    />
                    <ListIcon
                      className={
                        gridListIcon === "list"
                          ? "GridListIconActive iconSvgStrokeColor"
                          : "GridListIconNotActive iconSvgStrokeColor"
                      }
                      onClick={(e) => handleGridListIcon(e, "list")}
                      id="ifApplication-listIcon"
                    />
                  </div>
                </div>
                {gridListIcon === "list" && <Listview />}
                {gridListIcon === "grid" && <GridView />}
              </div>
            </div>
            <div
              class="tab-pane fade"
              id="ProcessHistory"
              role="tabpanel"
              aria-labelledby="ProcessHistory-tab"
            >
              <div className="ProcessHistory-table">
                <div className="IFApplication-your-application">
                  <div className="IFApplication-application-title-wrap">
                    <h4 className="primaryColor">{t("Process History")}</h4>
                  </div>
                  <div className="ProcessHistoryTableContainer">
                    <ProcessHistoryTable />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="ListView-Sidebar" id="ifApplication-listView-sidebar">
            <ListviewSidebar />
          </div>
        </div>
      </div>
    </>
  );
};

export default IFApplications;
