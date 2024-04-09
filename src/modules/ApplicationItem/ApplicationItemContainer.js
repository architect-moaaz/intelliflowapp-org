import ApplicationItem from "./ApplicationItem";
import { useTranslation } from "react-i18next";

const ApplicationItemContainer = ({ setheaderTitle }) => {
  const [t, i18n] = useTranslation("common");
  setheaderTitle(t("appDesigner"));
  return <ApplicationItem />;
};

export default ApplicationItemContainer;
