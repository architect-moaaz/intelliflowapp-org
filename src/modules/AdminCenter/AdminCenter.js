import React from "react";
import { Link } from "react-router-dom";
import "./AdminCenter.css"
import { useTranslation } from "react-i18next";
const AdminCenter = ({setheaderTitle}) => {
  const [t, i18n] = useTranslation("common");

    setheaderTitle(t("adminDashboard"))

    return(
        <>
        {/* <div style={{marginTop:'100px'}}>
        <Link to="/reports" >
            reportBuilder
            </Link>
        </div> */}

<div className="main-content">
        <div className="pannel">
          <span className="admindashboardboxnamePA secondaryColor">Published Apps</span>
        </div>
        <div className="pannel">
          <span className="admindashboardboxnamePA secondaryColor">Universal Connector</span>
        </div>
        <div className="pannel">
          <span className="admindashboardboxnamePA secondaryColor">Chatbot builder</span>
        </div>
        <div className="pannel">
          <span className="admindashboardboxnamePA secondaryColor">User management</span>
        </div>
        <div className="pannel">
          <span className="admindashboardboxnameSM secondaryColor">
            {" "}
            Subscription management
          </span>
        </div>
        <div className="pannel">
          <Link to="/reports" className="admindashboardboxnameRB">
            {" "}
            Report Builder
          </Link>
        </div>
    
      </div>

        </>
    )

}

export default AdminCenter;