import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { File, FilterLine, IInfo, Tick } from "../../assets";
import "./Notification.css";

const Notification = () => {
  const [t, i18n] = useTranslation("common");
  return (
    <>
      <div className="notification-box">
        <div className="notification-header-wrap">
          <h5 className="primaryColor">{t("notifications")}</h5>
          <Link to="#" id="notification-filter-link">
            <img alt="#" src={FilterLine} />
          </Link>
        </div>
        <ul className="notification-list">
          <li>
            <Link to="#" id="notificatiob-iinfo-link" >
              <span className="secondaryColor">
                <img alt="#" src={IInfo} />
              </span>
              <p className="secondaryColor">
                {t("welcomeNotification")}
              </p>
            </Link>
          </li>
          
        </ul>
      </div>
    </>
  );
};
export default Notification;
