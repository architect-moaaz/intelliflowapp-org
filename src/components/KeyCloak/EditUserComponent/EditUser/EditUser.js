import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Tab, Nav } from "react-bootstrap";
import "./EditUser.css";
import AddUserRole from "./AddUserRole";
import EditUserDetail from "../EditUserDetail/EditUserDetail";
import EditAttributes from "../EditAttributes/EditAttributes";
import EditCredentials from "../EditCredentials/EditCredentials";
import EditRoleMappings from "../EditRoleMappings/EditRoleMappings";
import EditGroups from "../EditGroups/EditGroups";
import EditConcents from "../EditConcents/EditConcents";
import EditSessions from "../EditSessions/EditSessions";
import { userleftarrowIco } from "../../../../assets";
const EditUser = ({
  userData,
  onEditUser,
  setEditUserData,
  setShowEditUser,
}) => {
  // const [userData, setUserData] = useState()
  return (
    <div className="edit_user_main_wrap">
      <h2>
        {userData?.firstName ? userData?.firstName : userData?.username}
        {/* <Link to="/">
          <Icon icon="uiw:delete" />
        </Link> */}
      </h2>
      <div className="userbackbutton">
        <img onClick={() => setShowEditUser(false)} src={userleftarrowIco} />
        <span className="userback">Back to Admin List</span>
      </div>

      <Tab.Container id="left-tabs-example" defaultActiveKey="nine">
        <Nav variant="pills" className="roles_pills">
          <Nav.Item>
            <Nav.Link eventKey="nine">Details</Nav.Link>
          </Nav.Item>
          {/* <Nav.Item>
            <Nav.Link eventKey="twelve">Role Mappings</Nav.Link>
          </Nav.Item> */}
          {/* <Nav.Item>
            <Nav.Link eventKey="ten">Attributes</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="eleven">Credentials</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="twelve">Role Mappings</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="thirteen">Groups</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="fourteen">Concents</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="fifteen">Sessions</Nav.Link>
          </Nav.Item> */}
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="nine">
            {/* {console.log("checkuserdata", userData)} */}
            <EditUserDetail
              userData={userData}
              setEditUserData={setEditUserData}
              onEditUser={onEditUser}
              setShowEditUser={setShowEditUser}
            />
          </Tab.Pane>
          {/* <Tab.Pane eventKey="twelve">
            <AddUserRole userData={userData} />
          </Tab.Pane> */}
          {/* <Tab.Pane eventKey="ten">
            <EditAttributes userData={userData}/>
          </Tab.Pane>
          <Tab.Pane eventKey="eleven">
            <EditCredentials userData={userData}/>
          </Tab.Pane>
          <Tab.Pane eventKey="twelve">
            <EditRoleMappings userData={userData}/>
          </Tab.Pane>
          <Tab.Pane eventKey="thirteen">
            <EditGroups userData={userData}/>
          </Tab.Pane>
          <Tab.Pane eventKey="fourteen">
            <EditConcents userData={userData}/>
          </Tab.Pane>
          <Tab.Pane eventKey="fifteen">
            <EditSessions userData={userData}/>
          </Tab.Pane> */}
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};
export default EditUser;
