import { Icon } from "@iconify/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Tab, Nav, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import CX from "classnames";
import { FileUploader } from "react-drag-drop-files";
import CommonModelContainer from "../CommonModel/CommonModelContainer";
import DataTable from "../DataTable/DataTable";
import AddRole from "./AddRole/AddRole";
import { dangerIco } from "../../assets";
import AddUser from "./AddUser/AddUser";
import CrerateGroup from "./CrerateGroup/CrerateGroup";
import EditGroup from "./EditGroupComponent/EditGroup/EditGroup";
import EditRole from "./EditRoleComponent/EditRole/EditRole";
import EditUser from "./EditUserComponent/EditUser/EditUser";
import "./KeyCloak.css";
import NextArrow from "../../assets/datagridIcons/NextArrow";
import PrevArrow from "../../assets/datagridIcons/PrevArrow";
import Keycloakusertable from "./Keycloakusertable";
import { useRecoilState } from "recoil";
import { loggedInUserState } from "../../state/atom";
import { DeleteIco } from "../../assets";
import { useTranslation } from "react-i18next";
// import * as fs from "fs/promises";

// import * as fs from "fs";
import CommonPagination from "../Pagination/CommonPagination";

const KeyCloak = () => {
  const token = localStorage.getItem("token");

  const [tableCurrentPage, setTableCurrentPage] = useState(1);
  const [selectedExcel, setSelectedExcel] = useState(null);
  const [openModelTwo, setOpenModelTwo] = useState(false);
  const [paginatedList, setPaginatedList] = useState([]);
  const [paginatedRoleList, setPaginatedRoleList] = useState([]);
  const [paginatedGroupList, setPaginatedGroupList] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [paginatedData, setPaginatedData] = useState([]);
  const [showUserPreviewModel, setShowUserPreviewModel] = useState(false);
  const [showRolePreviewModel, setShowRolePreviewModel] = useState(false);
  const [showGroupPreviewModel, setShowGroupPreviewModel] = useState(false);
  const [showBulkPreviewModel, setShowBulkPreviewModel] = useState(false);
  const [showPreviewModel, setShowPreviewModel] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddRoles, setShowAddRoles] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [editUser, setEditUser] = useState(false);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [showEditGroup, setShowEditGroup] = useState(false);
  const [openEditGroup, setOpenEditGroup] = useState(false);
  const [groupList, setGroupList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [editUserData, setEditUserData] = useState({});
  const [showEditRole, setShowEditRole] = useState(false);
  const [editRoleData, setEditRoleData] = useState({});
  const [editGroupData, setEditGroupData] = useState(null);
  const [rolesList, setRolesList] = useState([]);
  // const [searchTerm, setSearchTerm] = useState("");
  const [searchTermUser, setSearchTermUser] = useState("");
  const [searchTermRole, setSearchTermRole] = useState("");
  const [editableRoleData, setEditableRoleData] = useState(null);
  const [editableUserData, setEditableUserData] = useState(null);
  const [showEditRoles, setShowEditRoles] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [deleteUserName, setDeleteUserName] = useState("");
  const [deletedRoleName, setDeletedRoleName] = useState("");
  const [deleteGroup, setDeleteGroup] = useState("");
  const [deleteGroupName, setDeleteGroupName] = useState("");
  const [fileUpload, setFileUpload] = useState(null);
  const [byteArrayResult, setByteArrayResult] = useState([]);
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);

  //variables for pagination
  const [offsetUsers, setOffsetUsers] = useState(1);
  const [offsetRoles, setOffsetRoles] = useState(1);
  const [offsetGroups, setOffsetGroups] = useState(1);
  const [data, setData] = useState([]);
  const [perPage] = useState(10);
  const [pageCountUsers, setPageCountUsers] = useState(0);
  const [pageCountRoles, setPageCountRoles] = useState(0);
  const [pageCountGroups, setPageCountGroups] = useState(0);
  const [t, i18n] = useTranslation("common");

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Newly created or registered users will automatically be added to these
      groups.
    </Tooltip>
  );
  const fileTypes = ["java", "bpmn", "bpmn2", "frm", "dmn"];

  const handleFileUpload = (files) => {
    console.log("currentuploadedfile", files);
    setFileUpload(files);
    convertToByte(files);
  };
  const onDeleteUser = (id, username) => {
    setShowUserPreviewModel(!showUserPreviewModel);
    setDeleteId(id);

    setDeleteUserName(username);
  };

  const onDeleteRole = (name) => {
    setShowRolePreviewModel(!showRolePreviewModel);
    setDeletedRoleName(name);
  };

  const onDeleteRolePopupClose = (name) => {
    setShowRolePreviewModel(false);
  };

  const onDeleteGroup = (data) => {
    setShowGroupPreviewModel(!showGroupPreviewModel);
    setDeleteGroup(data.id);
    setDeleteGroupName(data.name);
  };

  //pagination for users list
  const usersInitialPagination = (allUsersList) => {
    let pageSize = 5;

    let tempPageCount = allUsersList.length / pageSize;

    setPageCountUsers(Math.ceil(tempPageCount));

    let allValuestemp = allUsersList;
    var startIndex = (offsetUsers - 1) * pageSize;

    let values = allValuestemp.slice(startIndex, startIndex + pageSize);

    setPaginatedList(values);
  };

  useEffect(() => {
    usersPageChange();
  }, [offsetUsers]);

  const usersPageChange = () => {
    let pageSize = 5;
    let allValuestemp = [...userList];
    var startIndex = (offsetUsers - 1) * pageSize;

    let values = allValuestemp.slice(startIndex, startIndex + pageSize);

    setPaginatedList(values);
  };

  //pagination for roles list
  const rolesInitialPagination = (allRolesList) => {
    let pageSize = 5;

    let tempPageCount = allRolesList.length / pageSize;

    setPageCountRoles(Math.ceil(tempPageCount));

    let allValuestemp = allRolesList;
    var startIndex = (offsetRoles - 1) * pageSize;

    let values = allValuestemp.slice(startIndex, startIndex + pageSize);

    setPaginatedRoleList(values);
  };

  useEffect(() => {
    rolesPageChange();
  }, [offsetRoles]);

  const rolesPageChange = () => {
    let pageSize = 5;
    let allValuestemp = [...rolesList];
    var startIndex = (offsetRoles - 1) * pageSize;

    let values = allValuestemp.slice(startIndex, startIndex + pageSize);

    setPaginatedRoleList(values);
  };

  //pagination for groups list
  const groupsInitialPagination = (allGroupsList) => {
    let pageSize = 5;

    let tempPageCount = allGroupsList.length / pageSize;

    setPageCountGroups(Math.ceil(tempPageCount));

    let allValuestemp = allGroupsList;
    var startIndex = (offsetGroups - 1) * pageSize;

    let values = allValuestemp.slice(startIndex, startIndex + pageSize);

    setPaginatedGroupList(values);
  };

  useEffect(() => {
    groupsPageChange();
  }, [offsetGroups]);

  const groupsPageChange = () => {
    let pageSize = 5;
    let allValuestemp = [...groupList];
    var startIndex = (offsetGroups - 1) * pageSize;

    let values = allValuestemp.slice(startIndex, startIndex + pageSize);

    setPaginatedGroupList(values);
  };

  const convertToByte = (data) => {
    var fileByteArray = [];
    const reader = new FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = (evt) => {
      if (evt.target.readyState === FileReader.DONE) {
        const arrayBuffer = evt.target.result,
          array = new Uint8Array(arrayBuffer);
        for (const a of array) {
          fileByteArray.push(a);
        }
        setByteArrayResult([
          ...byteArrayResult,
          { [data.name]: fileByteArray },
        ]);
      }
    };
  };
  const removeFile = (filess) => () => {
    const newFiles = [...byteArrayResult];
    newFiles.splice(newFiles.indexOf(filess), 1);
    setByteArrayResult(newFiles);
  };
  const getSortedData = (data) => {
    let list = [...data];
    let sortedList = list.sort(function (x, y) {
      return y.createdTimestamp - x.createdTimestamp;
    });
    return sortedList;
  };

  const fetchAllUsers = () => {
    var userConfig = {
      method: "get",
      url:
        process.env.REACT_APP_IDENTITY_ENDPOINT + "IDENTITY/user/fetchallusers",
      headers: {
        "Content-Type": "application/json",
        access_token: token,
      },
    };

    axios(userConfig).then((resp) => {
      console.log({ resp });

      let data = getSortedData(resp.data);
      setUserList([...data]);
      usersInitialPagination(data);
    });
  };

  const fetchAllGroups = () => {
    var groupConfig = {
      method: "get",
      url:
        process.env.REACT_APP_IDENTITY_ENDPOINT +
        "IDENTITY/group/fetchallgroups",
      headers: {
        "Content-Type": "application/json",
        access_token: token,
        workspace: "Intelliflow",
      },
    };
    axios(groupConfig).then((resp) => {
      console.log({ resp });
      setGroupList(resp.data);
      groupsInitialPagination(resp.data);
    });
  };

  const selectGroupToEdit = (group) => {
    setEditGroupData(group);
  };
  useEffect(() => {
    fetchAllUsers();
    fetchAllGroups();
    fetchAllRoles();
    // onEditGroup();
  }, [0]);

  const onAddUser = () => {
    setShowAddUser(!showAddUser);
  };
  const onAddRoles = () => {
    setShowAddRoles(!showAddRoles);
  };

  const onEditUser = () => {
    console.log("editUserData", editUserData);
    const userData = editUserData;
    const groupconfig = {
      method: "post",
      url:
        process.env.REACT_APP_IDENTITY_ENDPOINT +
        `IDENTITY/user/updateUser/${userData.id}`,
      headers: {
        "Content-Type": "application/json",
        access_token: token,
        workspace: "Intelliflow",
      },
      data: userData,
    };
    axios(groupconfig)
      .then((resp) => {
        if (resp.data.status == "Success") {
          toast.success("User Edited  successfully.");
          fetchAllUsers();
          setEditUserData({});
          setShowEditUser(false);
        }
        console.log({ resp });
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const onEditGroup = () => {
    const groupconfig = {
      method: "post",
      url:
        process.env.REACT_APP_IDENTITY_ENDPOINT +
        `IDENTITY/group/updateGroup/${editGroupData.id}`,
      headers: {
        "Content-Type": "application/json",
        access_token: token,
        workspace: "Intelliflow",
      },
      data: editGroupData,
    };
    axios(groupconfig).then((resp) => {
      if (resp.data.status) {
        toast.success("Group edited successfully.");
        fetchAllGroups();
        setEditGroupData({});
        setShowEditGroup(false);
      }
      console.log({ resp });
    });
  };
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
          rolesInitialPagination(response.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const deleteUser = (id) => {
    var axios = require("axios");

    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url:
        process.env.REACT_APP_IDENTITY_ENDPOINT +
        `IDENTITY/user/deleteUser/${id}`,
      headers: {
        workspace: "Intelliflow",
        access_token: token,
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };

    axios(config)
      .then(function (response) {
        toast.success("User Deleted successfully.");

        onDeleteUser(false);
        fetchAllUsers();

        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const deleteroles = (name) => {
    var axios = require("axios");

    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url:
        process.env.REACT_APP_IDENTITY_ENDPOINT +
        `IDENTITY/roles/delete/${name}`,
      headers: {
        "Content-Type": "application/json",
        workspace: "intelliflow",
        access_token: token,
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };

    axios(config)
      .then(function (response) {
        toast.success("Role Deleted successfully.");
        fetchAllRoles();
        onDeleteRole(false);
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

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
        onDeleteGroup(false);
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        toast.error("Group Deleting Failed.");
        console.log(error);
      });
  };

  const onOpenEditUser = (user) => {
    const data = {
      access: user.access,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      id: user.id,
      createdTimestamp: user.createdTimestamp,
      enabled: user.enabled,
      emailVerified: user.emailVerified,
      email: user.email,
    };
    setEditUserData(data);
    changeEditUser();
  };

  const onEditRole = () => {
    setShowEditRole(!showEditRole);
  };
  const changeEditUser = () => {
    setShowEditUser(!showEditUser);
  };
  const onAddGroup = () => {
    setShowAddGroup(!showAddGroup);
  };

  const onOpenEditGroup = () => {
    setShowEditGroup(!showEditGroup);
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  return (
    <>
      <div className="keycloak_body">
        {/* <Breadcrumb className="usermanagement-breadcrumb">
          <Breadcrumb.Item href="#">
            <Icon icon="ant-design:home-filled" />
          </Breadcrumb.Item>
          <Breadcrumb.Item active>User Management</Breadcrumb.Item>
        </Breadcrumb> */}

        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Nav variant="pills" className="usermanagement_pills">
            <Nav.Item>
              <Nav.Link eventKey="first">User(s)</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="second">Role(s)</Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link eventKey="third">Group(s)</Nav.Link>
            </Nav.Item>
            {/* <Link to="#" className="download_btn">
              <Icon icon="akar-icons:download" />
            </Link> */}
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="second">
              {showEditRole ? (
                <div className="edit_user">
                  <EditRole
                    editRoleData={editRoleData}
                    setEditRoleData={setEditRoleData}
                    onEditRole={onEditRole}
                    setShowEditRole={setShowEditRole}
                    editableRoleData={editableRoleData}
                    setEditableRoleData={setEditableRoleData}
                    callFetchAllRoles={fetchAllRoles}
                  />
                </div>
              ) : (
                <div className="role_main_wrap">
                  <div className="view_role">
                    {/* <h2>Roles</h2> */}
                    <Tab.Container
                      id="left-tabs-example2"
                      defaultActiveKey="fourth"
                    >
                      <Nav variant="pills" className="roles_pills">
                        <Nav.Item>
                          <Nav.Link eventKey="fourth">Workspace Roles</Nav.Link>
                        </Nav.Item>
                        {/* <Nav.Item>
                          <Nav.Link eventKey="fifth">Default Roles</Nav.Link>
                        </Nav.Item> */}
                      </Nav>
                      <Tab.Content>
                        <Tab.Pane eventKey="fourth">
                          <div className="role_main_table_wrap">
                            <div className="role_main_table_head BodyColor">
                              <div className="role_table_search">
                                <Link to="#">
                                  <Icon icon="akar-icons:search" />
                                </Link>
                                <input
                                  type="text"
                                  placeholder={t("search")}
                                  onChange={(e) => {
                                    setSearchTermRole(e.target.value);
                                  }}
                                />
                              </div>
                              {/* <Link className="btn btn-white">
                                View all roles
                              </Link> */}
                              {loggedInUser.enabled_menus?.menus_enabled?.includes(
                                "USERMANAGEMENT_CREATEROLE"
                              ) && (
                                <Link
                                  to="#"
                                  className="btn btn-orange-white secondaryButtonColor ms-auto"
                                  onClick={onAddRoles}
                                >
                                  Add Role
                                </Link>
                              )}
                            </div>
                            <div className="role_main_table_body">
                              <table>
                                <thead>
                                  <tr style={{ border: "0.5px solid white" }}>
                                    <th>Role Name</th>
                                    <th>Composite</th>
                                    <th>{t("description")}</th>
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {paginatedRoleList
                                    .filter((row, index) => {
                                      if (searchTermRole != "") {
                                        // console.log("searchterm", searchTermRole);
                                        for (const key in row) {
                                          console.log(
                                            "filtercheck",
                                            typeof row[key]
                                          );
                                          let value = String(row[key]);
                                          if (
                                            value &&
                                            value.includes(searchTermRole)
                                          ) {
                                            return row;
                                          }
                                        }
                                      } else {
                                        return row;
                                      }
                                    })
                                    .map((Roles) => {
                                      return (
                                        <tr
                                          className="BodyColor"
                                          style={{
                                            border: "0.5px solid white",
                                          }}
                                        >
                                          <td className="secondaryColor">
                                            {Roles.name}
                                          </td>
                                          <td className="secondaryColor">
                                            {String(Roles.composite)}
                                          </td>
                                          <td className="secondaryColor">
                                            {Roles.description}{" "}
                                          </td>

                                          <td>
                                            <div className="role_btn_wrap">
                                              {loggedInUser.enabled_menus?.menus_enabled?.includes(
                                                "USERMANAGEMENT_EDITROLE"
                                              ) && (
                                                <Link
                                                  to="#"
                                                  onClick={() => {
                                                    setEditableRoleData(Roles);
                                                    onEditRole();
                                                  }}
                                                >
                                                  Edit
                                                </Link>
                                              )}
                                              {loggedInUser.enabled_menus?.menus_enabled?.includes(
                                                "USERMANAGEMENT_DELETEROLE"
                                              ) && (
                                                <Link
                                                  to="#"
                                                  onClick={() => {
                                                    onDeleteRole(Roles.name);
                                                  }}
                                                >
                                                  Delete
                                                </Link>
                                              )}
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                </tbody>
                              </table>

                              <div className="d-flex justify-content-end">
                                <CommonPagination
                                  pageCount={pageCountRoles}
                                  setOffset={setOffsetRoles}
                                />
                              </div>
                            </div>
                          </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="fifth">
                          <table className="custom_table">
                            <thead>
                              <tr>
                                <th>Workspace Roles</th>
                                {/* <th>
                                  Available Roles
                                  <OverlayTrigger
                                    placement="right"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={renderTooltip}
                                  >
                                    <Icon icon="eva:question-mark-circle-fill" />
                                  </OverlayTrigger>
                                </th> */}
                                {/* <th>Default Roles</th> */}
                              </tr>
                            </thead>
                            {/* <tbody>
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
                              </tr>
                            </tbody> */}
                          </table>
                          {/* <div className="edit_mapping_btn mt-3">
                            <a className="btn btn-orange text-white">
                              Add Selected
                            </a>
                            <a className="btn btn-orange-white">
                              Remove Selected
                            </a>
                          </div>
                          <div className="role_form my-5 h-auto">
                            <label>Client Roles</label>
                            <select>
                              <option value="">Select a Client</option>
                              <option value="">Select a Client 2</option>
                              <option value="">Select a Client 3</option>
                            </select>
                          </div> */}
                        </Tab.Pane>
                      </Tab.Content>
                    </Tab.Container>
                  </div>
                  {/* <div className="add_role">
                  <AddRole />
                </div> */}
                  {/* <div className="edit_role">
                  <EditRole />
                </div> */}
                </div>
              )}
            </Tab.Pane>
            <Tab.Pane eventKey="first">
              {showEditUser ? (
                <div className="edit_user">
                  <EditUser
                    userData={editUserData}
                    setEditUserData={setEditUserData}
                    onEditUser={onEditUser}
                    setShowEditUser={setShowEditUser}
                    setEditableUserData={setEditableUserData}
                  />
                </div>
              ) : (
                <div className="role_main_wrap">
                  {/* <h2>Users</h2> */}
                  <Tab.Container
                    id="left-tabs-example2"
                    defaultActiveKey="sixth"
                  >
                    <Tab.Content>
                      <Tab.Pane eventKey="sixth">
                        <div className="view_lookup">
                          <div className="role_main_table_wrap">
                            <div className="role_main_table_head BodyColor">
                              <div className="role_table_search">
                                <Link to="#">
                                  <Icon icon="akar-icons:search" />
                                </Link>
                                <input
                                  type="text"
                                  placeholder={t("search")}
                                  onChange={(e) => {
                                    setSearchTermUser(e.target.value);
                                  }}
                                />
                              </div>
                              {loggedInUser.enabled_menus?.menus_enabled?.includes(
                                "USERMANAGEMENT_CREATEUSER"
                              ) && (
                                <Link
                                  id="key-cloak-add-user"
                                  to="#"
                                  className="btn btn-orange-white ms-auto secondaryButtonColor"
                                  onClick={onAddUser}
                                >
                                  Add User
                                </Link>
                              )}
                            </div>
                            <div className="role_main_table_body BodyColor">
                              {/* <DataTable
                                data={userList}
                                columns={userColumns}
                              /> */}
                              <table>
                                <thead>
                                  <tr
                                    style={{
                                      width: "100%",
                                      border: "0.5px solid white",
                                    }}
                                  >
                                    <th>ID</th>
                                    <th>User Name</th>
                                    <th>Email</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody className="BodyColor">
                                  {paginatedList
                                    .filter((row, index) => {
                                      // console.log("row", row);
                                      if (searchTermUser != "") {
                                        for (const key in row) {
                                          let value = String(row[key]);
                                          if (
                                            value &&
                                            value.includes(searchTermUser)
                                          ) {
                                            return row;
                                          }
                                        }
                                      } else {
                                        return row;
                                      }
                                    })
                                    .map((user) => {
                                      return (
                                        <tr className="BodyColor">
                                          <td className="secondaryColor">
                                            {user.id}
                                          </td>
                                          <td className="secondaryColor">
                                            {user.username}
                                          </td>
                                          <td className="secondaryColor">
                                            {user?.email}{" "}
                                          </td>
                                          <td className="secondaryColor">
                                            {user.firstName}{" "}
                                          </td>
                                          <td className="secondaryColor">
                                            {user.lastName}{" "}
                                          </td>
                                          <td>
                                            <div className="role_btn_wrap">
                                              {loggedInUser.enabled_menus?.menus_enabled?.includes(
                                                "USERMANAGEMENT_EDITUSER"
                                              ) && (
                                                <Link
                                                  to="#"
                                                  onClick={() => {
                                                    onOpenEditUser(user);
                                                  }}
                                                >
                                                  Edit
                                                </Link>
                                              )}
                                              {loggedInUser.enabled_menus?.menus_enabled?.includes(
                                                "USERMANAGEMENT_DELETEUSER"
                                              ) && (
                                                <Link
                                                  to="#"
                                                  onClick={() => {
                                                    onDeleteUser(
                                                      user.id,
                                                      user.username
                                                    );
                                                  }}
                                                >
                                                  Delete
                                                </Link>
                                              )}
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                </tbody>
                              </table>
                              <div className="d-flex flex-row justify-content-end">
                                <CommonPagination
                                  pageCount={pageCountUsers}
                                  setOffset={setOffsetUsers}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              )}
            </Tab.Pane>
            <Tab.Pane eventKey="third">
              <div className="role_main_wrap">
                {showEditGroup ? (
                  <div className="edit_group">
                    <EditGroup
                      editGroupData={editGroupData}
                      setEditGroupData={setEditGroupData}
                      onEditGroup={onEditGroup}
                      setShowEditGroup={setShowEditGroup}
                      fetchAllGroups={fetchAllGroups}
                    />
                  </div>
                ) : (
                  <div className="view_group">
                    {/* <h2>User Groups</h2> */}
                    <Tab.Container
                      id="left-tabs-example2"
                      defaultActiveKey="seven"
                    >
                      <Nav variant="pills" className="roles_pills">
                        <Nav.Item>
                          <Nav.Link eventKey="seven">Groups</Nav.Link>
                        </Nav.Item>
                        {/* <Nav.Item>
                          <Nav.Link eventKey="eight">Default Groups</Nav.Link>
                        </Nav.Item> */}
                      </Nav>
                      <Tab.Content>
                        <Tab.Pane eventKey="seven">
                          <div className="role_main_table_wrap">
                            <div className="role_main_table_head BodyColor">
                              <ul className="role_ui_link">
                                <li>
                                  {loggedInUser.enabled_menus?.menus_enabled?.includes(
                                    "USERMANAGEMENT_CREATEGROUP"
                                  ) && (
                                    <Link
                                      to="#"
                                      className="btn btn-orange-white secondaryButtonColor"
                                      onClick={onAddGroup}
                                    >
                                      New
                                    </Link>
                                  )}
                                </li>
                                <li>
                                  {loggedInUser.enabled_menus?.menus_enabled?.includes(
                                    "USERMANAGEMENT_EDITGROUP"
                                  ) && (
                                    <Link
                                      to="#"
                                      className={`btn btn-orange-white secondaryButtonColor ${
                                        editGroupData ? "" : "disabled"
                                      }`}
                                      // onClick={onOpenEditGroup}
                                      onClick={(e) => {
                                        if (!editGroupData) {
                                          e.preventDefault();
                                        } else {
                                          onOpenEditGroup();
                                        }
                                      }}
                                    >
                                      Edit
                                    </Link>
                                  )}
                                </li>

                                {/* <li>
                                  <Link
                                    className="btn btn-orange-white"
                                    onClick={() => {
                                      onDeleteGroup(editGroupData);
                                    }}
                                  >
                                    Delete
                                  </Link>
                                </li> */}
                              </ul>
                            </div>
                            <div className="role_main_table_body">
                              <h5 className="primaryColor">
                                <Icon icon="ooui:user-group-rtl"></Icon> Groups
                              </h5>
                              <ul className="gruop_main_list">
                                {paginatedGroupList.map((resp) => (
                                  <li
                                    key={resp.id}
                                    className={CX(
                                      "group-list",
                                      resp.id === editGroupData?.id
                                        ? "active"
                                        : ""
                                    )}
                                    onClick={() => selectGroupToEdit(resp)}
                                  >
                                    <Link to="#">
                                      <i>
                                        <Icon icon="nimbus:file-alt"></Icon>
                                      </i>
                                      {resp.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                              <div className="d-flex flex-row justify-content-end">
                                <CommonPagination
                                  pageCount={pageCountGroups}
                                  setOffset={setOffsetGroups}
                                />
                              </div>
                            </div>
                          </div>
                        </Tab.Pane>
                        {/* <Tab.Pane eventKey="eight">
                          <div className="default_grup_wrap">
                            <div className="grup_card">
                              <div className="grup_card_header">
                                <h6>
                                  Default Groups
                                  <OverlayTrigger
                                    placement="right"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={renderTooltip}
                                  >
                                    <Icon icon="eva:question-mark-circle-fill" />
                                  </OverlayTrigger>
                                </h6>
                                <Link className="btn btn-orange-white">
                                  Remove
                                </Link>
                              </div>
                              <div className="grup_card_body">
                                <textarea rows="4"></textarea>
                              </div>
                            </div>
                            <div className="grup_card available_grup">
                              <div className="grup_card_header">
                                <h6 className="w-100">
                                  Available Groups
                                  <OverlayTrigger
                                    placement="right"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={renderTooltip}
                                  >
                                    <Icon icon="eva:question-mark-circle-fill" />
                                  </OverlayTrigger>
                                </h6>
                                <div className="grup_header_wrap">
                                  <div className="role_table_search">
                                    <Link to="#">
                                      <Icon icon="akar-icons:search" />
                                    </Link>
                                    <input type="text" placeholder="Search" />
                                  </div>
                                  <Link className="btn btn-orange-white">
                                    View all groups
                                  </Link>
                                  <Link className="btn btn-orange-white ms-2">
                                    Add
                                  </Link>
                                </div>
                              </div>
                              <div className="grup_card_body">
                                <ul className="gruop_main_list">
                                  <li>
                                    <Link>
                                      <i>
                                        <Icon icon="nimbus:file-alt"></Icon>
                                      </i>
                                      Sr Managers
                                    </Link>
                                  </li>
                                  <li>
                                    <Link>
                                      <i>
                                        <Icon icon="nimbus:file-alt"></Icon>
                                      </i>
                                      testgrp
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </Tab.Pane> */}
                      </Tab.Content>
                    </Tab.Container>
                  </div>
                )}
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
      <CommonModelContainer
        modalTitle="Add User"
        show={showAddUser}
        handleClose={onAddUser}
        id="key-cloak-add-user-container"
        className="adduser-modal"
      >
        {" "}
        <AddUser
          setShowAddUser={setShowAddUser}
          setShowEditUser={setShowEditUser}
          fetchAllUsers={fetchAllUsers}
        />
      </CommonModelContainer>

      <CommonModelContainer
        modalTitle="Add Role"
        show={showAddRoles}
        handleClose={onAddRoles}
      >
        <AddRole setShowAddRoles={onAddRoles} fetchAllRoles={fetchAllRoles} />
      </CommonModelContainer>

      <CommonModelContainer
        modalTitle="Create Group"
        show={showAddGroup}
        handleClose={onAddGroup}
      >
        <CrerateGroup
          setShowAddGroup={onAddGroup}
          fetchAllGroups={fetchAllGroups}
        />
      </CommonModelContainer>

      <CommonModelContainer
        modalTitle="Edit Group"
        show={openEditGroup}
        handleClose={onOpenEditGroup}
      >
        <EditGroup />
      </CommonModelContainer>

      {/* <CommonModelContainer
        className="Editrole-modal"
        modalTitle="Edit Roles"
        show={showEditRoles}
        handleClose={onEditRole}
      >
        <EditRole />
      </CommonModelContainer> */}

      <CommonModelContainer
        modalTitle="Edit User"
        show={editUser}
        handleClose={changeEditUser}
      >
        <EditUser />
      </CommonModelContainer>

      <CommonModelContainer
        modalTitle="Alert"
        show={showUserPreviewModel}
        handleClose={onDeleteUser}
        id="key-cloak-delete-user-container"
        className="deleteuser-modal"
      >
        <div>
          <img className="dangerico" src={dangerIco}></img>
          <span className="deleteuser"> Delete User?</span>
          <p className="username secondaryColor">
            Are you sure you want to delete the {deleteUserName}?
          </p>
          <div className="d-flex justify-content-center deletebutton-keyclock">
            <button
              className="cancel secondaryButtonColor"
              onClick={onDeleteUser}
            >
              {" "}
              cancel
            </button>
            <button
              id="key-cloak-delete-user-btn"
              className="deleteuserbutton primaryButtonColor"
              onClick={() => deleteUser(deleteId)}
            >
              Confirm
            </button>
          </div>
        </div>
      </CommonModelContainer>
      <CommonModelContainer
        modalTitle="Alert"
        show={showRolePreviewModel}
        id="key-cloak-delete-role-container"
        handleClose={onDeleteRolePopupClose}
        className="deleteuser-modal"
      >
        <div>
          <img className="dangerico" src={dangerIco}></img>
          <span className="deleteuser secondaryColor"> Delete Role?</span>
          <p className="username secondaryColor">
            Are you sure you want to delete the {deletedRoleName}?
          </p>
          <div className="d-flex justify-content-center">
            <button
              className="cancel secondaryButtonColor"
              onClick={onDeleteRolePopupClose}
            >
              cancel
            </button>
            <button
              className="deleteuserbutton primaryButtonColor"
              onClick={() => deleteroles(deletedRoleName)}
            >
              Confirm
            </button>
          </div>
        </div>
      </CommonModelContainer>
    </>
  );
};
export default KeyCloak;
