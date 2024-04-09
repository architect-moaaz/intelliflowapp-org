import { Col, Row } from "react-bootstrap";
import "./ProjectOverview.css";
import { dataCount } from "../../state/atom";
import { selector, useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";

const Header = () => {
  const [t, i18n] = useTranslation("common");
  const dataValue = useRecoilValue(dataCount);
  return (
    <>
      <div className="project-box">
        <h5 className="project-box-title primaryColor">{t("appOverview")}</h5>
        <div className="row">
          <div className="col-6">
            <div className="project-card-box published-card">
              <h6 className="primaryColor">{dataValue.development}</h6>
              <p className="secondaryColor">{t("draft")}</p>
            </div>
          </div>
          <div className="col-6">
            <div className="project-card-box progress-card">
              <h6 className="primaryColor">{dataValue.published}</h6>
              <p className="secondaryColor">{t("published")}</p>
            </div>
          </div>
          {/* <div lg={6}>
                    <div className="project-card-box approval-card">
                        <h6>0</h6>
                        <p>Approval</p>
                    </div>
                </div>
                <div lg={6}>
                    <div className="project-card-box completed-card">
                        <h6>0</h6>
                        <p>Completed</p>
                    </div>
                </div> */}
        </div>
      </div>
    </>
  );
};
export default Header;
