import ApplicationDashboard from "../../components/ApplicationDashboard/ApplicationDashboard";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./ApplicationItem.css";

const ApplicationItem = () => {
  return (
    <>
      <div className="main-content">
        <ApplicationDashboard />
        {/* <span style={{ marginTop: "30px" }}> */}
        <Sidebar />
        {/* </span> */}
      </div>
    </>
  );
};

export default ApplicationItem;
