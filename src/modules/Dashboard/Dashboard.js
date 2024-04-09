import MainDashboard from "../../components/MainDashboard/MainDashboard";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <>
    
      <div className="main-content">
        <MainDashboard />
        <Sidebar />
      </div>
    </>
  );
};

export default Dashboard;
