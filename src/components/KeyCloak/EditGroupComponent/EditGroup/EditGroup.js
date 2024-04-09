import { Icon } from "@iconify/react";
import React from "react";
import { Link } from "react-router-dom";
import { Tab, Nav, Breadcrumb } from "react-bootstrap";
import { Home } from "../../../../assets";
import "./EditGroup.css";
import { toast } from "react-toastify";
import EditSetting from "../EditSetting/EditSetting";
import EditAttributes from "../EditAttributes/EditAttributes";
import EditRoleMappings from "../EditRoleMappings/EditRoleMappings";
import EditMembers from "../EditMembers/EditMembers";
import { userleftarrowIco } from "../../../../assets";
import { useState } from "react";
import axios from "axios";
import CommonModelContainer from "../../../CommonModel/CommonModelContainer";
import { dangerIco, DeleteIco } from "../../../../assets";
import { useRecoilState } from "recoil";
import { loggedInUserState } from "../../../../state/atom";

const EditGroup = ({
  editGroupData,
  onEditGroup,
  setEditGroupData,
  setShowEditGroup,
  fetchAllGroups,
}) => {
  const token = localStorage.getItem("token");
  const [groupList, setGroupList] = useState([]);
  const [showGroupPreviewModel, setShowGroupPreviewModel] = useState(false);
  const [deleteGroup, setDeleteGroup] = useState("");
  const [deleteGroupName, setDeleteGroupName] = useState("");
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);

  const onDeleteGroup = (data) => {
    setShowGroupPreviewModel(!showGroupPreviewModel);
    setDeleteGroup(data.id);
    setDeleteGroupName(data.name);
  };
  // const fetchAllGroups = () => {
  //   var groupConfig = {
  //     method: "get",
  //     url:
  //       process.env.REACT_APP_IDENTITY_ENDPOINT +
  //       "IDENTITY/group/fetchallgroups",
  //     headers: {
  //       "Content-Type": "application/json",
  //       access_token: token,
  //       workspace: "Intelliflow",
  //     },
  //   };
  //   axios(groupConfig).then((resp) => {
  //     console.log({ resp });
  //     setGroupList(resp.data);
  //   });
  // };

  const deletegroup = (id) => {
    var axios = require("axios");

    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url:
        process.env.REACT_APP_IDENTITY_ENDPOINT +
        `IDENTITY/group/deleteGroup/${id}`,
      headers: {
        "Content-Type": "application/json",
        workspace: "intelliflow",
        access_token: token,
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };

    axios(config)
      .then(function (response) {
        toast.success("Group Deleted successfully.");
        fetchAllGroups();
        setShowEditGroup(false);
        onDeleteGroup(false);
      })
      .catch(function (error) {
        toast.error("Group Deleting Failed.");
        console.log(error);
      });
  };
  return (
    <>
      <div className="edit_user_main_wrap">
        {/* <div className="breadCrum">
        <Link to="/admin/dashboard">
          <img src={Home} alt="" />
        </Link>
        <h6>{">>"}</h6>
        <Link to="/keyclock" disable>
          <h6 style={{ color: " #0c83bf", letterSpacing: "1px" }}>Group(s)</h6>
        </Link>
      </div> */}
        <h2>
          {editGroupData.name}
          {/* <Link to="/">
          <Icon icon="uiw:delete" />
        </Link> */}
          {loggedInUser.enabled_menus?.menus_enabled?.includes(
            "USERMANAGEMENT_DELETEGROUP"
          ) && (
            <img
              className="deletegroup"
              src={DeleteIco}
              onClick={() => {
                onDeleteGroup(editGroupData);
              }}
            />
          )}
        </h2>

        <div className="groupbackbutton">
          <img onClick={() => setShowEditGroup(false)} src={userleftarrowIco} />
          <span className="userback secondaryColor">Back to Group List</span>
        </div>

        {/* <Link className="btn btn-orange-white">Delete</Link> */}

        <Tab.Container id="left-tabs-example" defaultActiveKey="sixteen">
          <Nav variant="pills" className="roles_pills">
            <Nav.Item>
              <Nav.Link eventKey="sixteen">Settings</Nav.Link>
            </Nav.Item>
            {/* <Nav.Item>
              <Nav.Link eventKey="seventeen">Attributes</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="eighteen">Role Mappings</Nav.Link>
            </Nav.Item> */}
            <Nav.Item>
              <Nav.Link eventKey="nineteen">Members</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="sixteen">
              <EditSetting
                editGroupData={editGroupData}
                setEditGroupData={setEditGroupData}
                onEditGroup={onEditGroup}
                setShowEditGroup={setShowEditGroup}
              />
            </Tab.Pane>
            <Tab.Pane eventKey="seventeen">
              <EditAttributes />
            </Tab.Pane>
            <Tab.Pane eventKey="eighteen">
              <EditRoleMappings />
            </Tab.Pane>
            <Tab.Pane eventKey="nineteen">
              <EditMembers editGroupData={editGroupData} />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
      <CommonModelContainer
        modalTitle="Alert"
        show={showGroupPreviewModel}
        handleClose={onDeleteGroup}
        className="deleteuser-modal"
      >
        <div>
          <img className="dangerico" src={dangerIco}></img>
          <span className="deleteuser secondaryColor"> Delete Group?</span>

          <p className="username secondaryColor">
            Are you sure you want to delete the {deleteGroupName}?
          </p>
          <div className="d-flex justify-content-center">
            <button className="cancel secondaryButtonColor">cancel</button>
            <button
              className="deleteuserbutton primaryButtonColor"
              onClick={() => deletegroup(deleteGroup)}
            >
              Confirm
            </button>
          </div>
        </div>
      </CommonModelContainer>
    </>
  );
};
export default EditGroup;
