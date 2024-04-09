
import "../ApplicationItem/ApplicationItem.css";
import { useTranslation } from "react-i18next";

const ReportBuilderHeader = ({setheaderTitle}) => {
  const [t, i18n] = useTranslation("common");
  setheaderTitle(t("adminDashboard"));
  return (
    <>
    
      <div className="main-content">
        {/* <IFDashboard />
        <AppSidebar /> */}
      </div>
    </>
  );
};

export default ReportBuilderHeader;