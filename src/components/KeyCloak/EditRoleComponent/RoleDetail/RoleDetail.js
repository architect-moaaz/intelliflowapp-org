import { Icon } from "@iconify/react";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./RoleDetail.css";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const RoleDetail = ({
  editableRoleData,
  setShowEditRole,
  callFetchAllRoles,
}) => {
  const token = localStorage.getItem("token");
  const [editUserData, setEditUserData] = useState({});
  const [tableCurrentPage, setTableCurrentPage] = useState(1);
  const [rolesList, setRolesList] = useState([]);
  const [paginatedRoleList, setPaginatedRoleList] = useState([]);
  const [roleName, setRoleName] = useState(editableRoleData.name);
  const [descriptionName, setDescriptionName] = useState(
    editableRoleData.description
  );
  const [composite, setComposite] = useState(editableRoleData.composite);
  const [clientRole, setClientRole] = useState(editableRoleData.clientRole);
  const [t, i18n] = useTranslation("common");
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Has the User’s Email been verified
    </Tooltip>
  );

  const paginationKeycloakRoles = () => {
    let pageSize = 5;
    let allValuestemp = [...rolesList];
    var startIndex = (tableCurrentPage - 1) * pageSize;

    let values = allValuestemp.splice(startIndex, pageSize);
    setPaginatedRoleList(values);
  };

  const editrole = () => {
    var axios = require("axios");
    var data = JSON.stringify({
      id: editableRoleData.id,
      name: roleName,
      description: descriptionName,
      composite: composite,
      clientRole: clientRole,
      containerId: "master",
    });

    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url:
        process.env.REACT_APP_IDENTITY_ENDPOINT +
        `IDENTITY/roles/update/${editableRoleData.name}`,
      headers: {
        "Content-Type": "application/json",
        workspace: "intelliflow",
        access_token: token,
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log("rolecheck", response);
        if (response.status == 200) {
          toast.success(" Role edited successfully.");

          setEditUserData({});
          setShowEditRole();

          callFetchAllRoles();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onHandleChange = (event) => {
    const { value } = event.target;
    setRoleName(value);
  };

  const onHandleDescriptionChange = (event) => {
    const { value } = event.target;
    setDescriptionName(value);
    const truncatedValue = value.slice(0, 40);
    setDescriptionName(truncatedValue);
  };
  const remainingCharacters = 40 - descriptionName.length;
  const onHandleCompositeChange = (event) => {
    const { value } = event.target;
    setComposite(value);
  };

  const onHandleClientRoleChange = (event) => {
    const { value } = event.target;
    setClientRole(value);
  };

  return (
    <>
      <div className="edit_role_details">
        <div className="role_form">
          <label className="secondaryColor">
            Role Name <span>*</span>
          </label>
          <input
            type="text"
            value={roleName}
            onChange={(e) => onHandleChange(e)}
            id="roleDetail-roleName-input"
          />
        </div>
        <div className="role_form">
          <label className="secondaryColor">{t("description")}</label>
          <textarea
            value={descriptionName}
            onChange={onHandleDescriptionChange}
            id="roleDetail-description-textarea"
          ></textarea>
          <p> {remainingCharacters}/40</p>
        </div>
        <div className="toggle_switch_wrap">
          <h6 className="primaryColor">
            Composite Roles
            <OverlayTrigger
              placement="right"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltip}
              id="roleDetail-compositeRoles-OverlayTrigger"
            >
              <Icon icon="eva:question-mark-circle-fill" />
            </OverlayTrigger>
          </h6>
          <BootstrapSwitchButton
            checked={composite}
            onChange={(e) => onHandleCompositeChange(e)}
            size="sm"
            id="roleDetail-composite-BootstrapSwitchButton"
          />
        </div>
      </div>

      <div className="composite_info">
        {/* <div className="composite_title">
          <h4>Composite Roles</h4>
        </div>
        <table className="custom_table">
          <thead>
            <tr>
              <th>WorkSpace Roles</th>
              <th>
                Available Roles
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderTooltip}
                  id="roleDetail-availableRoles-OverlayTrigger"
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
                  id="roleDetail-assignedRoles-OverlayTrigger"
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
                  id="roleDetail-effectiveRoles-OverlayTrigger"
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
                    <label for="AvailableRoles04">
                      <input
                        type="checkbox"
                        name="AvailableRoles"
                        id="AvailableRoles04"
                      />
                      <p>Admin</p>
                    </label>
                  </li>
                  <li>
                    <label for="AvailableRoles05">
                      <input
                        type="checkbox"
                        name="AvailableRoles"
                        id="AvailableRoles05"
                      />
                      <p>Citizen Developers</p>
                    </label>
                  </li>
                  <li>
                    <label for="AvailableRoles06">
                      <input
                        type="checkbox"
                        name="AvailableRoles"
                        id="AvailableRoles06"
                      />
                      <p>Create WorkSpace</p>
                    </label>
                  </li>
                </ul>
              </td>
              <td>
                <ul className="rolemappingcheckbox">
                  <li>
                    <label for="AssignedRoles04">
                      <input
                        type="checkbox"
                        name="AssignedRoles"
                        id="AssignedRoles04"
                      />
                      <p>Citizen Developer</p>
                    </label>
                  </li>
                  <li>
                    <label for="AssignedRoles05">
                      <input
                        type="checkbox"
                        name="AssignedRoles"
                        id="AssignedRoles05"
                      />
                      <p>Citizen Developer</p>
                    </label>
                  </li>
                  <li>
                    <label for="AssignedRoles06">
                      <input
                        type="checkbox"
                        name="AssignedRoles"
                        id="AssignedRoles06"
                      />
                      <p>Citizen Developer</p>
                    </label>
                  </li>
                </ul>
              </td>
              <td>
                <ul className="rolemappingcheckbox">
                  <li>
                    <label for="EffectiveRoles04">
                      <input
                        type="checkbox"
                        name="EffectiveRoles"
                        id="EffectiveRoles04"
                      />
                      <p>Citizen Developer</p>
                    </label>
                  </li>
                  <li>
                    <label for="EffectiveRoles05">
                      <input
                        type="checkbox"
                        name="EffectiveRoles"
                        id="EffectiveRoles05"
                      />
                      <p>Citizen Developer</p>
                    </label>
                  </li>
                  <li>
                    <label for="EffectiveRoles06">
                      <input
                        type="checkbox"
                        name="EffectiveRoles"
                        id="EffectiveRoles06"
                      />
                      <p>Citizen Developer</p>
                    </label>
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table> */}
        {/* <div className="edit_mapping_btn mt-3">
          <a
            id="roleDetail-add-a"
            className="btn btn-orange text-white"
            href="/"
          >
            Add Selected
          </a>
          <a id="roleDetail-remove-a" className="btn btn-orange-white" href="/">
            Remove Selected
          </a>
        </div> */}
        <div className="role_form mt-5">
          <label className="secondaryColor">Client Roles</label>
          {/* <select>
            <option value="">Select a Client</option>
            <option value="">Select a Client 2</option>
            <option value="">Select a Client 3</option>
          </select> */}
          <BootstrapSwitchButton
            checked={clientRole}
            onChange={(e) => onHandleCompositeChange(e)}
            size="sm"
            id="roleDetail-clientRoles-BootstrapSwitchButton"
          />{" "}
          <BootstrapSwitchButton
            checked={clientRole}
            onChange={(e) => onHandleCompositeChange(e)}
            size="sm"
            id="roleDetail-clientRoles-BootstrapSwitchButton"
          />
          {/* <input type="text" value={editableRoleData.clientRole} /> */}
        </div>
        <div className="role_form_btn">
          <Link
            to="#"
            id="roleDetail-save-link"
            className="btn btn-orange"
            onClick={() => editrole()}
          >
            Save
          </Link>
          <Link
            to="#"
            id="roleDetail-cancel-link"
            className="btn btn-orange-white"
            onClick={() => setShowEditRole(false)}
          >
            Cancel
          </Link>
        </div>
      </div>
    </>
  );
};
export default RoleDetail;
