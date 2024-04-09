import React from "react";
import {  Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./EditSessions.css";

const EditSessions = () => {
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Has the User’s Email been verified
    </Tooltip>
  );
  return (
    <>
      <table className="custom_table">
        <thead>
          <tr>
            <th>IP Address</th>
            <th>Started</th>
            <th>Last Access</th>
            <th>Clients</th>
            <th>Action</th>
            <th><Link id="editSessions-logout-link" to="/" className="btn btn-orange-white">Log out all sessions</Link></th>
          </tr>
        </thead>

      </table>
    </>
  );
};
export default EditSessions;
