import AppSidebar from "../../components/Sidebar/AppSidebar";
import "../ApplicationItem/ApplicationItem.css";
import IFDashboard from "../../components/IFApp/Dashboard/IFDashboard";
import { useTranslation } from "react-i18next";

const IFAppContainer = ({setheaderTitle}) => {
  const [t, i18n] = useTranslation("common");
  setheaderTitle(t("appStore"));
  return (
    <>
    
      <div className="main-content">
        <IFDashboard />
        <AppSidebar />
      </div>
    </>
  );
};

export default IFAppContainer;
