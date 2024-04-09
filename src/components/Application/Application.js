import { Link } from "react-router-dom";
import PulseFillIcon from 'remixicon-react/AddLineIcon';
import { ApplicationIcon } from "../../assets";
import "./Application.css"
import { useTranslation } from "react-i18next";

const Application = () => {
    const [t, i18n] = useTranslation("common");
    return <div className="application">
        <h5 className="primaryColor">{t("yourApplications")}</h5>
        <div className="application-wrap">
            <div className="application-item">
                <div className="application-img">
                    <img alt="#" src={ApplicationIcon} />
                </div>
                <Link to="#" id="application-createApplication-box1"><span><PulseFillIcon /></span> {t("createApplication")}</Link>
            </div>
        </div>
        <div className="application-wrap">
            <div className="application-item">
                <div className="application-img">
                    <img alt="#" src={ApplicationIcon} />
                </div>
                <Link to="#" id="application-createApplication-box2"><span><PulseFillIcon /></span> {t("createApplication")}</Link>
            </div>
        </div>
    </div>;
  };
  export default Application;
  