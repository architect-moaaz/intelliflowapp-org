import React from "react";
import { ReactComponent as Dashboard } from "../../assets/images/Dashboard.svg";
import "./Sidebar.css";
import { Link, useLocation } from "react-router-dom";
import botSetting from "./BotSettings";
import ReactTooltip from "react-tooltip";
import {ReactComponent as Setting} from "../../assets/Icons/Setting.svg"
import {ReactComponent as Chat} from "../../assets/Icons/Chat.svg"

const Sidebar = (props) => {

  const botID = localStorage.getItem("botID");

  return (
    <div className="botsidebarMain BodyColor">
      <ul>
        <li className="bot-menu">
          <Link
            to={{
              pathname: "/chatbot",
            }}
            data-tip="Dahboard"
          >
            <Dashboard className="svg-stroke iconSvgStrokeColor iconStrokehover" />
          </Link>
          <ReactTooltip/>
        </li>
        <li className="bot-menu">
          <Link exact to={{ pathname: "/botDashboard/botConfig", state: { botID } }}   data-tip="Q&A">
            {/* <img alt="" className="chatsvg" src={Chat} /> */}
            <Chat className="svg-fill iconSvgFillColor iconFillhover"/>
          </Link>
          <ReactTooltip/>
        </li>
        <li className="bot-menu">
          <Link
           exact  to={{ pathname: "/botDashboard/botSetting", state: { botID } }}
            data-tip="setting"
          >
            <Setting className="svg-stroke iconSvgStrokeColor iconStrokehover" />
          </Link>
          <ReactTooltip/>
          
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
