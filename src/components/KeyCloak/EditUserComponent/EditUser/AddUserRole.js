import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import AddRole from "../../AddRole/AddRole";
import CommonModelContainer from "../../../CommonModel/CommonModelContainer";
import { Modal } from "react-bootstrap";

// import "./EditRoleMappings.css";

const AddUserRole = () => {
  const token = localStorage.getItem("token");
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [rolesList, setRolesList] = useState([]);
  const [showGroupMembersModal, setShowGroupMembersModal] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Has the User’s Email been verified
    </Tooltip>
  );

  const fetchAllRoles = () => {
    var axios = require("axios");
    var data = "";

    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url:
        process.env.REACT_APP_IDENTITY_ENDPOINT + `IDENTITY/roles/fetchroles`,
      headers: {
        access_token: token,
        "Content-Type": "application/json",
        workspace: "Intelliflow",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));

        if (response.data.status !== 401) {
          setRolesList(response.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const AddRole = async (e) => {
    e.preventDefault();
    fetchAllRoles();
    setShowRoleModal(true);
  };

  const closeGroupMembersModal = () => {
    setShowGroupMembersModal(false);
    setSelectedMembers([]);
  };
  return (
    <>
      <CommonModelContainer
        show={showRoleModal}
        handleClose={closeGroupMembersModal}
        modalTitle="Select Group Members"
      >
        <Modal.Body>
          {users?.map((item) => {
            return (
              <div id={item.id}>
                <input
                  type="checkbox"
                  checked={selectedMembers?.includes(item.id)}
                  //   onChange={(e) => updateMembersList(e, item.id)}
                />
                <label className="secondaryColor">{item.username}</label>
              </div>
            );
          })}
          {/* <button
            disabled={selectedMembers[0] ? false : true}
            onClick={addMembers}
            className="btn btn-orange-white ms-auto"
          >
            Add Members
          </button> */}
          <Link
          to="#"
            disabled={selectedMembers[0] ? false : true}
            // onClick={addMembers}
            className="btn btn-orange-white ms-auto"
          >
            Add
          </Link>
        </Modal.Body>
      </CommonModelContainer>
      <table className="custom_table">
        <thead>
          <tr>
            <th></th>
            <th>
              Available Roles
              <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip}
                id="editRoleMappings-availableRoles-OverlayTrigger"
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
                d="editRoleMappings-assignedRoles-OverlayTrigger"
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
                d="editRoleMappings-effectiveRoles-OverlayTrigger"
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
                    <p className="secondaryColor">Citizen Developers</p>
                  </label>
                </li>
                <li>
                  <label for="AvailableRoles06 secondaryColor">
                    <input
                      type="checkbox"
                      name="AvailableRoles"
                      id="AvailableRoles06"
                    />
                    <p className="secondaryColor">Create Realm</p>
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
      {/* <div className="edit_mapping_btn mt-3">
        <a
          id="editRoleMappings-add-a"
          className="btn btn-orange text-white"
          onClick={AddRole}
        >
          Assign Role
        </a>
        <a id="editRoleMappings-remove-a" className="btn btn-orange-white">
          Remove Selected
        </a>
      </div> */}
    </>
  );
};
export default AddUserRole;
