import React from "react";
import { Link } from "react-router-dom";
import { Tab, Nav, OverlayTrigger, Tooltip } from "react-bootstrap";
import "./EditRole.css";
import { Icon } from "@iconify/react";
import EditAttributes from "../EditAttributes/EditAttributes";
import UserRole from "../UserRole/UserRole";
import RoleDetail from "../RoleDetail/RoleDetail";
import { userleftarrowIco } from "../../../../assets";

const EditRole = ({
  editRoleData,

  onEditRole,
  setEditableRoleData,
  setEditRoleData,
  setShowEditRole,
  editableRoleData,
  callFetchAllRoles,
}) => {
  return (
    <div className="edit_user_main_wrap">
      {/* <h2>{editableRoleData.name}</h2> */}

      <div className="rolebackbutton">
        <img onClick={() => setShowEditRole(false)} src={userleftarrowIco} />
        <span className="userback secondaryColor">Back to Role List</span>
      </div>
      <Tab.Container id="left-tabs-example" defaultActiveKey="twenty">
        <Nav variant="pills" className="roles_pills">
          <Nav.Item>
            <Nav.Link eventKey="twenty">Details</Nav.Link>
          </Nav.Item>
          {/* <Nav.Item>
            <Nav.Link eventKey="twentyOne">Attributes</Nav.Link>
          </Nav.Item> */}
          <Nav.Item>
            <Nav.Link eventKey="twentyTwo">Users in Role</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="twenty">
            <RoleDetail
              editableRoleData={editableRoleData}
              setShowEditRole={setShowEditRole}
              callFetchAllRoles={callFetchAllRoles}
            />
          </Tab.Pane>
          <Tab.Pane eventKey="twentyOne">
            <EditAttributes />
          </Tab.Pane>
          <Tab.Pane eventKey="twentyTwo">
            <UserRole editableRoleData={editableRoleData} />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};
export default EditRole;
