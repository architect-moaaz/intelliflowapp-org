import NotificationContainer from "../Notification/NotificationContainer";
import ProjectOverviewContainer from "../ProjectOverview/ProjectOverviewContainer";
import "./Sidebar.css";
import { YourLogo } from "../../assets";
import ImageLoader from "../ImageLoader/ImageLoader";

const Sidebar = () => {
  return (
    <>
      <div className="sidebar-main  ">
        <div className="sidebar-bg" id="sidebar">
          <ProjectOverviewContainer />
          <NotificationContainer />
          <div
            className="mt-2"
            style={{
              textAlign: "center",
              pointerEvents: "none",
              height: "50px",
            }}
          >
            <ImageLoader src={YourLogo} />
          </div>
        </div>
      </div>
    </>
  );
};
export default Sidebar;
