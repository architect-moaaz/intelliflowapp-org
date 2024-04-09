// import { Dashboard } from "../../../assets";

import ReactTooltip from "react-tooltip";

import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useLayoutEffect } from "react";
import { atom, useRecoilState } from "recoil";
import { ReactComponent as Dashboard } from "../../../assets/images/Dashboard.svg";
import { useTranslation } from "react-i18next";
import { loggedInUserState } from "../../../state/atom";
const Sidebar = () => {
  const [appList, setappList] = useState([]);
  const [t, i18n] = useTranslation("common");
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const [assignedProcesses, setAssignedProcesses] = useState([]);

  const loadApps = async () => {
    try {
      axios
        .get(
          process.env.REACT_APP_IFAPP_API_ENDPOINT +
            "app-center/" +
            localStorage.getItem("workspace") +
            "/" +
            localStorage.getItem("appName") +
            "/context"
        )
        .then(async (r) => {
          // console.log("🚀 ~ file: IFApplications.js:77 ~ .then ~   r", r);
          setappList(r.data.data._paths);
        })
        .catch((e) => {
          console.log("error", e);
        });
    } catch (error) {
      console.log(error);
    }
  };
  const appdisplayname = localStorage.getItem("appdisplayname");
  useLayoutEffect(() => {
    loadApps();
    getProcessesAsigned();
  }, [appdisplayname]);

  async function getProcessesAsigned() {
    var config = {
      method: "get",
      url:
        process.env.REACT_APP_IDENTITY_ENDPOINT +
        "IDENTITY/access/" +
        loggedInUser?.currentRole,
    };

    axios(config)
      .then(function (response) {
        setAssignedProcesses(response?.data?.menus[0]?.process);
      })
      .catch(function (error) {
        // toast.error("Couldn't get the assigned menu", {
        //   position: "bottom-right",
        //   autoClose: 4000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   isLoading: false,
        // });
        console.log(error);
      });
  }

  return (
    <div className="sidebarMain BodyColor">
      <ul className="customScrollBar">
        <li className="ifAppProcess">
          {/* <div className="dashboardSvgContainer"> */}
          {/* <img alt="" className="dashboardSvg" src={Dashboard} /> */}
          <Dashboard className="svg-stroke iconSvgStrokeColor iconStrokehover" />
          {/* </div> */}
          <p className="dashboardText secondaryColor">{t("Dashboard")}</p>
        </li>
        <div className="sidebarborder"></div>

        {appList?.map((cards, index) => {
          if (assignedProcesses?.includes(cards.endpoint_label)) {
            return (
              <div>
                <li className="ifAppProcess">
                  <p
                    className="processText ellipsis secondaryColor"
                    data-tip
                    data-for={`${cards.endpoint_label}processText`}
                    style={{ margin: "0px", width: "100%" }}
                  >
                    <Link
                      id="sidebar-ifAppProcess-link"
                      to={{
                        pathname: `/form`,
                        state: {
                          endpoint_label: cards.endpoint_label,
                          path: cards.path,
                        },
                      }}
                      style={{
                        color: "inherit",
                        textDecoration: "inherit",
                      }}
                    >
                      {t(cards.endpoint_label)}
                    </Link>
                  </p>
                  <ReactTooltip
                    id={`${cards.endpoint_label}processText`}
                    place="right"
                    effect="solid"
                  >
                    {cards.endpoint_label}
                  </ReactTooltip>
                </li>
                <div className="sidebarborder"></div>
              </div>
            );
          }
        })}

        {/* </li> */}
      </ul>
    </div>
  );
};

export default Sidebar;
