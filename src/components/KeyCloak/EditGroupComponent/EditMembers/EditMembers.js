import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import axios from "axios";
import PrevArrow from "../../../../assets/datagridIcons/PrevArrow";
import NextArrow from "../../../../assets/datagridIcons/NextArrow";
import "./EditMembers.css";
import { Modal } from "react-bootstrap";
import CommonModelContainer from "../../../CommonModel/CommonModelContainer";
import { dangerIco } from "../../../../assets";
import { useRecoilState } from "recoil";
import { loggedInUserState } from "../../../../state/atom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import CommonPagination from "../../../Pagination/CommonPagination";

const EditMembers = ({ editGroupData }) => {
  const token = localStorage.getItem("token");
  const [groupMemberList, setGroupMemberList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [showGroupPreviewModel, setShowGroupPreviewModel] = useState(false);
  const [deletedGroupName, setDeletedGroupName] = useState("");
  const [showGroupMembersModal, setShowGroupMembersModal] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const [t, i18n] = useTranslation("common");
  const [pageCountUsersInGroup, setPageCountUsersInGroup] = useState(0);
  const [offsetUsersInGroup, setOffsetUsersInGroup] = useState(1);
  const [paginatedUsersInGroupList, setPaginatedUsersInGroupList] = useState(
    []
  );

  useEffect(() => {
    groupmember();
  }, []);

  //pagination
  const usersInGroupInitialPagination = (allUsersList) => {
    let pageSize = 5;

    let tempPageCount = allUsersList.length / pageSize;

    setPageCountUsersInGroup(Math.ceil(tempPageCount));

    let allValuestemp = allUsersList;
    var startIndex = (offsetUsersInGroup - 1) * pageSize;

    let values = allValuestemp.slice(startIndex, startIndex + pageSize);

    setPaginatedUsersInGroupList(values);
  };

  useEffect(() => {
    usersInGroupPageChange();
  }, [offsetUsersInGroup]);

  const usersInGroupPageChange = () => {
    let pageSize = 5;
    let allValuestemp = [...groupMemberList];
    var startIndex = (offsetUsersInGroup - 1) * pageSize;

    let values = allValuestemp.slice(startIndex, startIndex + pageSize);

    setPaginatedUsersInGroupList(values);
  };

  const onDeleteGroup = (name) => {
    setShowGroupPreviewModel(!showGroupPreviewModel);
    setDeletedGroupName(name);
  };

  const groupmember = async () => {
    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url:
        process.env.REACT_APP_IDENTITY_ENDPOINT +
        `IDENTITY/group/members/${editGroupData.id}`,
      headers: {
        "Content-Type": "application/json",
        workspace: "intelliflow",
        access_token: token,
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };

    await axios(config)
      .then(function (response) {
        setGroupMemberList(response.data.message);
        usersInGroupInitialPagination(response.data.message);
      })
      .catch(function (error) {
        console.log(error);
      });
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
      setUsers(resp.data);
    });
  };

  const addMember = async (e) => {
    e.preventDefault();
    fetchAllUsers();
    setShowGroupMembersModal(true);
  };

  const updateMembersList = (e, id) => {
    if (selectedMembers[0]) {
      if (selectedMembers?.includes(id)) {
        const temp = selectedMembers.filter((item) => item !== id);
        setSelectedMembers([...temp]);
      } else {
        const temp = [...selectedMembers];
        temp.push(id);
        setSelectedMembers([...temp]);
      }
    } else {
      const temp = [];
      temp.push(id);
      setSelectedMembers([...temp]);
    }
  };

  const closeGroupMembersModal = () => {
    groupmember();
    setShowGroupMembersModal(false);
    setSelectedMembers([]);
  };

  const addMembers = () => {
    const temp = selectedMembers.map(async (userId) => {
      let config = {
        method: "post",
        url:
          process.env.REACT_APP_IDENTITY_ENDPOINT +
          `IDENTITY/user/addgroup/${userId}/${editGroupData.id}`,
      };

      await axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });
    });
    closeGroupMembersModal();
  };

  const DeletUeserGroup = (name) => {
    const axios = require("axios");

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url:
        process.env.REACT_APP_IDENTITY_ENDPOINT +
        "IDENTITY/user/deletegroup/43677513-9c7d-41a5-96d3-dcf38cf90583/5e10aab9-7360-449d-b3b0-baf90106cc29",
      headers: {
        "Content-Type": "application/json",
        workspace: "intelliflow",
        access_token: token,
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <CommonModelContainer
        show={showGroupMembersModal}
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
                  onChange={(e) => updateMembersList(e, item.id)}
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
            disabled={selectedMembers[0] ? false : true}
            onClick={addMembers}
            className="btn btn-orange-white ms-auto"
          >
            Add
          </Link>
        </Modal.Body>
      </CommonModelContainer>

      <div className="role_main_table_body p-0">
        <div className="role_main_table_wrap">
          <div className="role_main_table_head">
            <div className="role_table_search">
              <Link to="#">
                <Icon icon="akar-icons:search" />
              </Link>
              <input
                type="text"
                placeholder={t("search")}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
              />
            </div>
            <Link
              // disabled={selectedMembers[0] ? false : true}
              onClick={addMember}
              className="btn btn-orange-white ms-auto"
            >
              Add Member
            </Link>
            {/* <button onClick={addMember}>Add Member</button> */}
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>First Name</th>
              <th>Last Name</th>
              {/* <th>Action</th> */}
            </tr>
          </thead>
          <tbody>
            {paginatedUsersInGroupList
              ?.filter((row, index) => {
                // console.log("row", row);
                if (searchTerm != "") {
                  for (const key in row) {
                    let value = String(row[key]);
                    if (value && value.includes(searchTerm)) {
                      return row;
                    }
                  }
                } else {
                  return row;
                }
              })
              ?.map((group) => {
                return (
                  <tr>
                    <td>{group.username}</td>
                    <td>{group?.email} </td>
                    <td>{group.firstName} </td>
                    <td>{group.lastName} </td>
                    {/* <td>
                      <div className="role_btn_wrap">
                        {loggedInUser.enabled_menus?.menus_enabled?.includes(
                          "USERMANAGEMENT_EDITUSER"
                        ) && (
                          <Link
                            onClick={() => {
                              onDeleteGroup(group.name);
                            }}
                          >
                            Delete
                          </Link>
                        )}
                      </div>
                    </td> */}
                  </tr>
                );
              })}
          </tbody>
        </table>
        <CommonPagination
          pageCount={pageCountUsersInGroup}
          setOffset={setOffsetUsersInGroup}
        />
      </div>
      <CommonModelContainer
        modalTitle="Alert"
        show={showGroupPreviewModel}
        handleClose={onDeleteGroup}
        className="deleteuser-modal"
      >
        <div>
          <img className="dangerico" src={dangerIco}></img>
          <span className="deleteuser secondaryColor"> Delete User?</span>
          <p className="username secondaryColor">
            Are you sure you want to delete the {deletedGroupName}?
          </p>
          <div className="d-flex justify-content-center">
            <button className="cancel secondaryButtonColor">cancel</button>
            <button
              className="deleteuserbutton primaryButtonColor"
              onClick={() => DeletUeserGroup(deletedGroupName)}
            >
              Confirm
            </button>
          </div>
        </div>
      </CommonModelContainer>
    </>
  );
};
export default EditMembers;
