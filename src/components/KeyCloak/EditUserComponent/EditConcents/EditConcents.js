import { Icon } from "@iconify/react";
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./EditConcents.css";

const EditConcents = () => {
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
            <th>Client</th>
            <th>Granted Client Scopes</th>
            <th>Additional Grants</th>
            <th>Created</th>
            <th>Last Updated</th>
            <th>Action</th>
          </tr>
        </thead>

      </table>
    </>
  );
};
export default EditConcents;
