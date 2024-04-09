import LeaveApplication from "./LeaveApplication";
import { useLocation } from "react-router-dom";

const LeaveApplicationContainer = () => {
  // console.log("insideleaveapp");
  const Location = useLocation();
  // console.log(Location);
  if (Location.state) localStorage.setItem("appName", Location.state.appName);

  return <LeaveApplication />;
};
export default LeaveApplicationContainer;
