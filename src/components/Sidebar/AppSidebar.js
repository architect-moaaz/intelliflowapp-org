import { Link } from "react-router-dom";
import TodolistContainer from "../Notification/TodolistContainer";
import ProjectOverviewContainer from "../ProjectOverview/ProjectOverviewContainer";
import "./Sidebar.css";
import { YourLogo } from "../../assets";

const AppSidebar = () => {
  return (
    <>
      <div className="sidebar-main-app  app-todo-main">
        <div className="sidebar-bg todo-bg" id="appSidebar-todo-bg">
          <TodolistContainer />
          <div className="mt-3 appStoreYourLogoHere">
            <img
              src={YourLogo}
              className="YourLogoHere"
              alt="Your Logo"
              crossOrigin="anonymous"
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default AppSidebar;
