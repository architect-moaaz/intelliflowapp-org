import { Icon } from "@iconify/react";
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./EditRoleMappings.css";

const EditRoleMappings = () => {
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
            <th>Workspace Roles</th>
            <th>
              Available Roles
              <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip}
                id="editRoleMapping-availableRoles-OverlayTrigger"
              >
                <Icon icon="eva:question-mark-circle-fill" />
              </OverlayTrigger>
            </th>
            <th>
              Assigned Roles{" "}
              <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip}
                id="editRoleMapping-assignedRoles-OverlayTrigger"
              >
                <Icon icon="eva:question-mark-circle-fill" />
              </OverlayTrigger>
            </th>
            <th>
              Effective Roles{" "}
              <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip}
                id="editRoleMapping-effectiveRoles-OverlayTrigger"
              >
                <Icon icon="eva:question-mark-circle-fill" />
              </OverlayTrigger>{" "}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td>
              <ul className="rolemappingcheckbox">
                <li>
                  <label for="AvailableRoles04 secondaryColor">
                    <input
                      type="checkbox"
                      name="AvailableRoles"
                      id="AvailableRoles04"
                    />
                    <p className="secondaryColor">Admin</p>
                  </label>
                </li>
                <li>
                  <label for="AvailableRoles05 secondaryColor">
                    <input
                      type="checkbox"
                      name="AvailableRoles"
                      id="AvailableRoles05"
                    />
                    <p>Citizen Developers</p>
                  </label>
                </li>
                <li>
                  <label for="AvailableRoles06 secondaryColor">
                    <input
                      type="checkbox"
                      name="AvailableRoles"
                      id="AvailableRoles06"
                    />
                    <p className="secondaryColor">Create WorkSpace</p>
                  </label>
                </li>
              </ul>
            </td>
            <td>
              <ul className="rolemappingcheckbox">
                <li>
                  <label for="AssignedRoles04 secondaryColor">
                    <input
                      type="checkbox"
                      name="AssignedRoles"
                      id="AssignedRoles04"
                    />
                    <p className="secondaryColor">Citizen Developer</p>
                  </label>
                </li>
                <li>
                  <label for="AssignedRoles05 secondaryColor">
                    <input
                      type="checkbox"
                      name="AssignedRoles"
                      id="AssignedRoles05"
                    />
                    <p className="secondaryColor">Citizen Developer</p>
                  </label>
                </li>
                <li>
                  <label for="AssignedRoles06 secondaryColor">
                    <input
                      type="checkbox"
                      name="AssignedRoles"
                      id="AssignedRoles06"
                    />
                    <p className="secondaryColor">Citizen Developer</p>
                  </label>
                </li>
              </ul>
            </td>
            <td>
              <ul className="rolemappingcheckbox">
                <li>
                  <label for="EffectiveRoles04 secondaryColor">
                    <input
                      type="checkbox"
                      name="EffectiveRoles"
                      id="EffectiveRoles04"
                    />
                    <p className="secondaryColor">Citizen Developer</p>
                  </label>
                </li>
                <li>
                  <label for="EffectiveRoles05 secondaryColor">
                    <input
                      type="checkbox"
                      name="EffectiveRoles"
                      id="EffectiveRoles05"
                    />
                    <p className="secondaryColor">Citizen Developer</p>
                  </label>
                </li>
                <li>
                  <label for="EffectiveRoles06 secondaryColor">
                    <input
                      type="checkbox"
                      name="EffectiveRoles"
                      id="EffectiveRoles06"
                    />
                    <p className="secondaryColor">Citizen Developer</p>
                  </label>
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="edit_mapping_btn mt-3">
        <a
          id="editRoleMapping-addSelected-a"
          className="btn btn-orange text-white"
        >
          Add Selected
        </a>
        <a
          id="editRoleMapping-removeSelected-a"
          className="btn btn-orange-white"
        >
          Remove Selected
        </a>
      </div>
      <div className="role_form mt-5">
        <label className="secondaryColor">Client Roles</label>
        <select id="editRoleMapping-clientRoles-select">
          <option value="">Select a Client</option>
          <option value="">Select a Client 2</option>
          <option value="">Select a Client 3</option>
        </select>
      </div>
    </>
  );
};
export default EditRoleMappings;
