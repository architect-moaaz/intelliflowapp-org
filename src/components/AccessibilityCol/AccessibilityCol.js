import React, { useState, useEffect } from "react";
import {
  Dropdown,
  Row,
  Col,
  Container,
  Form,
  Card,
  DropdownButton,
  CloseButton,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import CommonModelContainer from "../CommonModel/CommonModelContainer";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/js/dist/dropdown";
import "../AccessibilityPopup/AccessibilityPopup.css";
import ReactTooltip from "react-tooltip";

const AccessibilityPopup = ({
  layout,
  setLayout,
  handleHidePopup,
  colIndex,
}) => {
  const [showAccessibilityModal, setShowAccessibilityModal] = useState(true);

  const [usersList, setUsersList] = useState([]);
  const [workgroupsList, setWorkgroupsList] = useState([]);

  const [showSaveActionInput, setShowSaveActionInput] = useState(false);
  const [actionName, setActionName] = useState("");

  const [accessibilitySavedActions, setAccessibilitySavedActions] = useState(
    []
  );
  // console.log(colIndex);

  const [accessToken, setAccessToken] = useState(localStorage.getItem("token"));

  const [savedDataFromApi, setSavedDatafromApi] = useState([]);

  // useEffect(() => {
  //   displaySavedTable();
  // }, [savedDataFromApi]);

  const colaccessibility = {
    writeUsers: [],
    readUsers: [],
    hideUsers: [],
    writeGroups: [],
    readGroups: [],
    hideGroups: [],
  };
  const findIndex = () => {
    let index;
    for (let i = 0; i < layout.layout.length; i++) {
      if (layout.layout[i].edit == true) {
        index = i;
        break;
      }
    }
    return index;
  };

  const index = findIndex();

  const [colAccessibilitydata, setcolAccessibilitydata] = useState(
    layout.layout[index].dataGridProperties.cols[colIndex].accessibility
      ? layout.layout[index].dataGridProperties.cols[colIndex].accessibility
      : colaccessibility
  );
  // console.log(layout.layout[index].dataGridProperties.cols);
  //   if(layout.layout[index].cols[colIndex].accessibility==undefined){

  //     console.log("colacc",colAccessibilitydata);

  //   }
  //   else{
  //     setcolAccessibilitydata(layout.layout[index].cols[colIndex].accessibility);
  //     console.log("test1");
  //   }
  useEffect(() => {
    fetchUsersList(accessToken);
    fetchWorkgroupsList(accessToken);
  }, []);

  const fetchUsersList = async (token) => {
    var config = {
      method: "get",
      url: `${process.env.REACT_APP_IDENTITY_ENDPOINT}IDENTITY/user/fetchallusers`,
      headers: {
        access_token: `${token}`,
      },
    };
    await axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        var data = response.data;
        var temparr = [];
        var usersListTemp = [];

        data.map((user) => {
          user.selectedForWrite = false;
          user.selectedForRead = false;
          user.selectedForHide = false;

          temparr.push(user);
        });

        temparr.map((user) => {
          colAccessibilitydata.writeUsers.map((currentUser) => {
            if (user.id == currentUser.id) {
              user.selectedForWrite = true;
            }
          });
          colAccessibilitydata.readUsers.map((currentUser) => {
            if (user.id == currentUser.id) {
              user.selectedForRead = true;
            }
          });
          colAccessibilitydata.hideUsers.map((currentUser) => {
            if (user.id == currentUser.id) {
              user.selectedForHide = true;
            }
          });
          usersListTemp.push(user);
        });

        setUsersList(usersListTemp);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const fetchWorkgroupsList = async (token) => {
    var config = {
      method: "get",
      url: `${process.env.REACT_APP_IDENTITY_ENDPOINT}IDENTITY/group/fetchallgroups`,
      headers: {
        access_token: `${token}`,
      },
    };

    await axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        var data = response.data;
        var temparr = [];
        var workgroupsListTemp = [];

        data.map((group) => {
          group.selectedForWrite = false;
          group.selectedForRead = false;
          group.selectedForHide = false;

          temparr.push(group);
        });

        temparr.map((group) => {
          colAccessibilitydata.writeGroups.map((currentGroup) => {
            if (group.id == currentGroup.id) {
              group.selectedForWrite = true;
            }
          });
          colAccessibilitydata.readGroups.map((currentGroup, index) => {
            if (group.id == currentGroup.id) {
              group.selectedForRead = true;
            }
          });
          colAccessibilitydata.hideGroups.map((currentGroup) => {
            if (group.id == currentGroup.id) {
              group.selectedForHide = true;
            }
          });
          workgroupsListTemp.push(group);
        });
        setWorkgroupsList(workgroupsListTemp);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleUsersListChange = (e) => {
    const { name, checked, id } = e.target;
    if (name === "allSelect") {
      let usersListTemp = usersList.map((user) => {
        return { ...user, isChecked: checked, [id]: checked };
      });
      setUsersList(usersListTemp);
    } else {
      let usersListTemp = usersList.map((user) =>
        user.username === name
          ? { ...user, isChecked: checked, [id]: checked }
          : user
      );
      setUsersList(usersListTemp);
    }
  };

  const handleWorkGroupsListChange = (e) => {
    const { name, checked, id } = e.target;
    if (name === "allSelect") {
      let workgroupsListTemp = workgroupsList.map((workgroup) => {
        return { ...workgroup, isChecked: checked, [id]: checked };
      });
      setWorkgroupsList(workgroupsListTemp);
    } else {
      let workgroupsListTemp = workgroupsList.map((workgroup) =>
        workgroup.name === name
          ? { ...workgroup, isChecked: checked, [id]: checked }
          : workgroup
      );
      setWorkgroupsList(workgroupsListTemp);
    }
  };

  const handleRemoveUser = (user, field) => {
    var usersListTemp = [...usersList];
    usersListTemp.map((actor) => {
      if (actor.username == user.username) actor[field] = false;
    });
    setUsersList(usersListTemp);
  };

  const handleRemoveWorkgroup = (workgroup, field) => {
    var workgroupsListTemp = [...workgroupsList];
    workgroupsListTemp.map((group) => {
      if (group.name == workgroup.name) group[field] = false;
    });
    setWorkgroupsList(workgroupsListTemp);
  };

  const populateSavedData = (index) => {
    var usersdata = usersList;
    var workgroupsData = workgroupsList;
    var tempUsersArrSaved = [];
    var tempWorkgroupsArrSaved = [];
    var usersListSavedTemp = [];
    var workgroupsListSavedTemp = [];

    usersdata.map((user) => {
      user.selectedForWrite = false;
      user.selectedForRead = false;
      user.selectedForHide = false;

      tempUsersArrSaved.push(user);
    });

    workgroupsData.map((workgroup) => {
      workgroup.selectedForWrite = false;
      workgroup.selectedForRead = false;
      workgroup.selectedForHide = false;

      tempWorkgroupsArrSaved.push(workgroup);
    });

    tempUsersArrSaved.map((user) => {
      // var tempUser = user;
      savedDataFromApi[index].savedActionData.writeUsers.map((currentUser) => {
        if (user.id == currentUser.id) {
          user.selectedForWrite = true;
        }
      });

      savedDataFromApi[index].savedActionData.readUsers.map((currentUser) => {
        if (user.id == currentUser.id) {
          user.selectedForRead = true;
        }
      });

      savedDataFromApi[index].savedActionData.hideUsers.map((currentUser) => {
        if (user.id == currentUser.id) {
          user.selectedForHide = true;
        }
      });

      usersListSavedTemp.push(user);
      // savedFilteredUsersList.push(tempUser);
    });

    tempWorkgroupsArrSaved.map((workgroup) => {
      savedDataFromApi[index].savedActionData.writeGroups.map(
        (currentWorkgroup) => {
          if (workgroup.id == currentWorkgroup.id) {
            workgroup.selectedForWrite = true;
          }
        }
      );

      savedDataFromApi[index].savedActionData.readGroups.map(
        (currentWorkgroup) => {
          if (workgroup.id == currentWorkgroup.id) {
            workgroup.selectedForRead = true;
          }
        }
      );

      savedDataFromApi[index].savedActionData.hideGroups.map(
        (currentWorkgroup) => {
          if (workgroup.id == currentWorkgroup.id) {
            workgroup.selectedForHide = true;
          }
        }
      );

      workgroupsListSavedTemp.push(workgroup);
    });

    setUsersList(usersListSavedTemp);
    setWorkgroupsList(workgroupsListSavedTemp);
  };

  const handleSaveClick = () => {
    var writeActorsList = [];
    var writeWorkgroupsList = [];
    var readActorsList = [];
    var readWorkgroupsList = [];
    var hideActorsList = [];
    var hideWorkgroupsList = [];

    usersList.map((actor) => {
      if (actor.selectedForWrite == true) {
        var tempobj = {
          username: actor.username,
          id: actor.id,
        };
        writeActorsList.push(tempobj);
      }
      if (actor.selectedForRead == true) {
        var tempobj = {
          username: actor.username,
          id: actor.id,
        };
        readActorsList.push(tempobj);
      }
      if (actor.selectedForHide == true) {
        var tempobj = {
          username: actor.username,
          id: actor.id,
        };
        hideActorsList.push(tempobj);
      }
    });

    workgroupsList.map((workgroup) => {
      if (workgroup.selectedForWrite == true) {
        var tempobj = {
          name: workgroup.name,
          id: workgroup.id,
        };
        writeWorkgroupsList.push(tempobj);
      }
      if (workgroup.selectedForRead == true) {
        var tempobj = {
          name: workgroup.name,
          id: workgroup.id,
        };
        readWorkgroupsList.push(tempobj);
      }
      if (workgroup.selectedForHide == true) {
        var tempobj = {
          name: workgroup.name,
          id: workgroup.id,
        };
        hideWorkgroupsList.push(tempobj);
      }
    });

    var accessibilityTemp = {};
    accessibilityTemp.writeUsers = writeActorsList;
    accessibilityTemp.readUsers = readActorsList;
    accessibilityTemp.hideUsers = hideActorsList;

    accessibilityTemp.writeGroups = writeWorkgroupsList;
    accessibilityTemp.readGroups = readWorkgroupsList;
    accessibilityTemp.hideGroups = hideWorkgroupsList;

    var layoutTemp = layout;

    layoutTemp.layout.forEach((e) => {
      if (e.edit == true) {
        e.dataGridProperties.cols[colIndex].accessibility = accessibilityTemp;
      }
    });

    setLayout(layoutTemp);

    if (actionName !== "") {
      var savedDataTemp = {
        savedActionName: actionName,
        savedActionData: accessibilityTemp,
      };

      var accessibilitySavedActionsTemp = accessibilitySavedActions;

      accessibilitySavedActionsTemp.push(savedDataTemp);

      setAccessibilitySavedActions(accessibilitySavedActionsTemp);

      // console.log("saveddata", accessibilitySavedActionsTemp);

      let savedDataFromApiTemp = savedDataFromApi;

      savedDataFromApiTemp.push(savedDataTemp);
      // console.log("temp", savedDataFromApiTemp);
      setSavedDatafromApi(savedDataFromApiTemp);
    }

    handleHidePopup();
  };

  const clearAllSelections = () => {
    var usersListTemp = usersList;
    var workgroupsListTemp = workgroupsList;

    var tempArrUsers = [];
    var tempArrGroups = [];

    usersListTemp.map((user) => {
      user.selectedForWrite = false;
      user.selectedForRead = false;
      user.selectedForHide = false;

      tempArrUsers.push(user);
    });

    workgroupsListTemp.map((group) => {
      group.selectedForWrite = false;
      group.selectedForRead = false;
      group.selectedForHide = false;

      tempArrGroups.push(group);
    });

    setUsersList(tempArrUsers);
    setWorkgroupsList(tempArrGroups);
  };

  const dropdownIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        fill="#8A8A8A"
        class="bi bi-caret-down-fill"
        viewBox="0 0 16 16"
      >
        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
      </svg>
    );
  };

  const crossIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        fill="white"
        class="bi bi-x-circle-fill"
        viewBox="0 0 16 16"
      >
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
      </svg>
    );
  };

  const displaySavedTable = () => {
    return (
      <Col xs={3} sm={3} md={3} lg={3}>
        <Card className="customCard" style={{ height: "100%", width: "100%" }}>
          <Card.Header>
            <h6 className="primaryColor" style={{ marginTop: 2 }}>Saved Action</h6>
          </Card.Header>
          <Card.Body>
            <Form>
              {savedDataFromApi.length !== 0 ? (
                savedDataFromApi.map((data, index) => (
                  <>
                    <div className="mt-2">
                      <input
                        type="radio"
                        value={data.savedActionName}
                        name="radiovalues"
                        onChange={() => populateSavedData(index)}
                        id = "accessibilityCol-SavedactionName"
                      />
                      <span className="secondaryColor"> {data.savedActionName} </span>
                    </div>
                  </>
                ))
              ) : (
                <p className="secondaryColor">No saved actions in this workspace</p>
              )}
            </Form>
          </Card.Body>
        </Card>
      </Col>
    );
  };

  return (
    <CommonModelContainer
      modalTitle="Accessibility"
      show={showAccessibilityModal}
      handleClose={handleHidePopup}
      className="accessibility-modal"
      id = "accessibilityCol-accessibility-commonModelContainer"
    >
      <Modal.Body className="modal-scroll">
        <Container className="px-2">
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Row className="mt-1 mb-3">
                <Col lg={3} md={3} sm={3} xs={3}>
                  <h6 className="primaryColor">Actions</h6>
                </Col>
                <Col lg={4} md={4} sm={4} xs={4}>
                  <h6 className="primaryColor">Actor</h6>
                </Col>
                <Col lg={4} md={4} sm={4} xs={4}>
                  <h6 className="primaryColor">Work Group</h6>
                </Col>
              </Row>

              <Row className="my-2">
                <Col lg={3} md={3} sm={3} xs={3}>
                  <h6 className="primaryColor">Write</h6>
                </Col>
                <Col lg={4} md={4} sm={4} xs={4}>
                  <div>
                    <button
                      className="dropdown-toggle customDropdownBtn secondaryButtonColor"
                      id="dropdownWriteActors"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Select Actor
                      {dropdownIcon()}
                    </button>
                    <div
                      class="dropdown-menu customScrollBarAccessibilityDropdown dropdown-menu-scroll dropdown-area dropdown-menu-container"
                      aria-labelledby="dropdownWriteActors"
                    >
                      <form className="form">
                        <div className="form-check dropdown-option-container">
                          <label className="secondaryColor" style={{ fontSize: "small" }}>
                            All Select
                          </label>
                          <input
                            type="checkbox"
                            className="form-check-input me-3"
                            name="allSelect"
                            checked={
                              !usersList.some(
                                (user) => user?.selectedForWrite !== true
                              )
                            }
                            id="selectedForWrite"
                            onChange={handleUsersListChange}
                          ></input>
                        </div>
                        {usersList.length !== 0 &&
                          usersList.map((user, index) => {
                            return (
                              <div className="form-check dropdown-option-container">
                                <label className="secondaryColor" style={{ fontSize: "small" }}>
                                  <span className="secondaryColor" data-tip data-for={user.username}>
                                    {user.username.substring(0, 20)}
                                    {user.username.length > 20 && (
                                      <span>...</span>
                                    )}
                                  </span>
                                  {user.username.length > 20 && (
                                    <ReactTooltip
                                      id={user.username}
                                      place="bottom"
                                      className="tooltipCustom"
                                      arrowColor="rgba(0, 0, 0, 0)"
                                      effect="float"
                                    >
                                      <span className="secondaryColor" style={{ fontSize: "12px" }}>
                                        {user.username}
                                      </span>
                                    </ReactTooltip>
                                  )}
                                </label>
                                <input
                                  type="checkbox"
                                  className="form-check-input me-3"
                                  name={user.username}
                                  checked={user?.selectedForWrite || false}
                                  id="selectedForWrite"
                                  onChange={handleUsersListChange}
                                ></input>
                              </div>
                            );
                          })}
                      </form>
                    </div>
                  </div>
                  <div
                    className="my-2"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: 2,
                      overflowX: "auto",
                    }}
                  >
                    {usersList.map((user, index) => {
                      if (
                        user.selectedForWrite != undefined &&
                        user.selectedForWrite == true
                      ) {
                        // console.log("userlist.map" + user + " " + index);
                        return (
                          <div key={index} className="minibtn mx-2 my-1">
                            <span className="secondaryColor" data-tip data-for={user.username}>
                              {user.username.substring(0, 20)}
                              {user.username.length > 20 && <span>...</span>}
                            </span>
                            {user.username.length > 20 && (
                              <ReactTooltip
                                id={user.username}
                                place="bottom"
                                className="tooltipCustom"
                                arrowColor="rgba(0, 0, 0, 0)"
                                effect="float"
                              >
                                <span className="secondaryColor" style={{ fontSize: "12px" }}>
                                  {user.username}
                                </span>
                              </ReactTooltip>
                            )}
                            <span
                              className="mx-1 secondaryColor"
                              onClick={() =>
                                handleRemoveUser(user, "selectedForWrite")
                              }
                              id = "accessibilityCol-user-span"
                            >
                              {crossIcon()}
                            </span>
                          </div>
                        );
                      }
                    })}
                  </div>
                </Col>

                <Col lg={4} md={4} sm={4} xs={4}>
                  <div>
                    <button
                      className="dropdown-toggle customDropdownBtn secondaryButtonColor"
                      id="dropdownWriteWorkgroups"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Select Work Group
                      {dropdownIcon()}
                    </button>
                    <div
                      class="dropdown-menu customScrollBarAccessibilityDropdown dropdown-menu-scroll dropdown-area dropdown-menu-container"
                      aria-labelledby="dropdownWriteWorkgroups"
                    >
                      <form className="form">
                        <div className="form-check dropdown-option-container">
                          <label className="secondaryColor" style={{ fontSize: "small" }}>
                            All Select
                          </label>
                          <input
                            type="checkbox"
                            className="form-check-input me-2"
                            name="allSelect"
                            checked={
                              !workgroupsList.some(
                                (workgroup) =>
                                  workgroup?.selectedForWrite !== true
                              )
                            }
                            id="selectedForWrite"
                            onChange={handleWorkGroupsListChange}
                          ></input>
                        </div>
                        {workgroupsList.length !== 0 &&
                          workgroupsList.map((workgroup, index) => {
                            return (
                              <div className="form-check dropdown-option-container">
                                <label className="secondaryColor" style={{ fontSize: "small" }}>
                                  <span className="secondaryColor" data-tip data-for={workgroup.name}>
                                    {workgroup.name.substring(0, 20)}
                                    {workgroup.name.length > 20 && (
                                      <span>...</span>
                                    )}
                                  </span>
                                  {workgroup.name.length > 20 && (
                                    <ReactTooltip
                                      id={workgroup.name}
                                      place="bottom"
                                      className="tooltipCustom"
                                      arrowColor="rgba(0, 0, 0, 0)"
                                      effect="float"
                                    >
                                      <span className="secondaryColor" style={{ fontSize: "12px" }}>
                                        {workgroup.name}
                                      </span>
                                    </ReactTooltip>
                                  )}
                                </label>
                                <input
                                  type="checkbox"
                                  className="form-check-input me-2"
                                  name={workgroup.name}
                                  checked={workgroup?.selectedForWrite || false}
                                  id="selectedForWrite"
                                  onChange={handleWorkGroupsListChange}
                                ></input>
                              </div>
                            );
                          })}
                      </form>
                    </div>
                  </div>
                  <div
                    className="my-2"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      padding: 2,
                    }}
                  >
                    {workgroupsList.map((workgroup, index) => {
                      if (
                        workgroup.selectedForWrite != undefined &&
                        workgroup.selectedForWrite == true
                      ) {
                        return (
                          <div key={index} className="minibtn mx-2 my-1">
                            <span className="secondaryColor">
                              {workgroup.name.substring(0, 20)}
                              {workgroup.name.length > 20 && <span>...</span>}
                            </span>
                            {workgroup.name.length > 20 && (
                              <ReactTooltip
                                id={workgroup.name}
                                place="bottom"
                                className="tooltipCustom"
                                arrowColor="rgba(0, 0, 0, 0)"
                                effect="float"
                              >
                                <span className="secondaryColor" style={{ fontSize: "12px" }}>
                                  {workgroup.name}
                                </span>
                              </ReactTooltip>
                            )}
                            <span
                              className="mx-1 secondaryColor"
                              id="accessibilityCol-crossIcon-removeWorkgroup-span"
                              onClick={() =>
                                handleRemoveWorkgroup(
                                  workgroup,
                                  "selectedForWrite"
                                )
                              }
                            >
                              {crossIcon()}
                            </span>
                          </div>
                        );
                      }
                    })}
                  </div>
                </Col>
              </Row>

              <Row className="my-1">
                <Col lg={3} md={3} sm={3} xs={3}>
                  <h6 className="primaryColor">Read Permissions</h6>
                </Col>
                <Col lg={4} md={4} sm={4} xs={4}>
                  <div>
                    <button
                      className="dropdown-toggle customDropdownBtn secondaryButtonColor"
                      id="dropdownReadActors"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Select Actor
                      {dropdownIcon()}
                    </button>
                    <div
                      className="dropdown-menu customScrollBarAccessibilityDropdown dropdown-menu-scroll dropdown-area dropdown-menu-container"
                      aria-labelledby="dropdownReadActors"
                    >
                      <form className="form">
                        <div className="form-check dropdown-option-container">
                          <label className="secondaryColor" style={{ fontSize: "small" }}>
                            All Select
                          </label>
                          <input
                            style={{ accentColor: "red" }}
                            type="checkbox"
                            className="form-check-input me-2"
                            name="allSelect"
                            checked={
                              !usersList.some(
                                (user) => user?.selectedForRead !== true
                              )
                            }
                            id="selectedForRead"
                            onChange={handleUsersListChange}
                          ></input>
                        </div>
                        {usersList.length !== 0 &&
                          usersList.map((user, index) => {
                            return (
                              <div className="form-check dropdown-option-container">
                                <label className="secondaryColor" style={{ fontSize: "small" }}>
                                  <span className="secondaryColor" data-tip data-for={user.username}>
                                    {user.username.substring(0, 20)}
                                    {user.username.length > 20 && (
                                      <span>...</span>
                                    )}
                                  </span>
                                  {user.username.length > 20 && (
                                    <ReactTooltip
                                      id={user.username}
                                      place="bottom"
                                      className="tooltipCustom"
                                      arrowColor="rgba(0, 0, 0, 0)"
                                      effect="float"
                                    >
                                      <span className="secondaryColor" style={{ fontSize: "12px" }}>
                                        {user.username}
                                      </span>
                                    </ReactTooltip>
                                  )}
                                </label>
                                <input
                                  type="checkbox"
                                  className="form-check-input me-2"
                                  name={user.username}
                                  checked={user?.selectedForRead || false}
                                  id="selectedForRead"
                                  onChange={handleUsersListChange}
                                ></input>
                              </div>
                            );
                          })}
                      </form>
                    </div>
                  </div>
                  <div
                    className="my-2"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      padding: 2,
                    }}
                  >
                    {usersList.map((user, index) => {
                      if (
                        user.selectedForRead != undefined &&
                        user.selectedForRead == true
                      ) {
                        return (
                          <div key={index} className="minibtn mx-2 my-1">
                            <span className="secondaryColor" data-tip data-for={user.username}>
                              {user.username.substring(0, 20)}
                              {user.username.length > 20 && <span>...</span>}
                            </span>
                            {user.username.length > 20 && (
                              <ReactTooltip
                                id={user.username}
                                place="bottom"
                                className="tooltipCustom"
                                arrowColor="rgba(0, 0, 0, 0)"
                                effect="float"
                              >
                                <span style={{ fontSize: "12px" }}>
                                  {user.username}
                                </span>
                              </ReactTooltip>
                            )}
                            <span
                              id="accessibilityCol-crossIcon-removeUser"
                              className="mx-1 secondaryColor"
                              onClick={() =>
                                handleRemoveUser(user, "selectedForRead")
                              }
                            >
                              {crossIcon()}
                            </span>
                          </div>
                        );
                      }
                    })}
                  </div>
                </Col>
                <Col lg={4} md={4} sm={4} xs={4}>
                  <div>
                    <button
                      className="dropdown-toggle customDropdownBtn secondaryButtonColor"
                      id="dropdownReadWorkgroups"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Select Work Group
                      {dropdownIcon()}
                    </button>
                    <div
                      class="dropdown-menu customScrollBarAccessibilityDropdown dropdown-menu-scroll dropdown-area dropdown-menu-container"
                      aria-labelledby="dropdownReadWorkgroups"
                    >
                      <form className="form">
                        <div className="form-check dropdown-option-container">
                          <label className="secondaryColor" style={{ fontSize: "small" }}>
                            All Select
                          </label>
                          <input
                            type="checkbox"
                            className="form-check-input me-2"
                            name="allSelect"
                            checked={
                              !workgroupsList.some(
                                (workgroup) =>
                                  workgroup?.selectedForRead !== true
                              )
                            }
                            id="selectedForRead"
                            onChange={handleWorkGroupsListChange}
                          ></input>
                        </div>
                        {workgroupsList.length !== 0 &&
                          workgroupsList.map((workgroup, index) => {
                            return (
                              <div className="form-check dropdown-option-container">
                                <label className="secondaryColor" style={{ fontSize: "small" }}>
                                  <span className="secondaryColor" data-tip data-for={workgroup.name}>
                                    {workgroup.name.substring(0, 20)}
                                    {workgroup.name.length > 20 && (
                                      <span>...</span>
                                    )}
                                  </span>
                                  {workgroup.name.length > 20 && (
                                    <ReactTooltip
                                      id={workgroup.name}
                                      place="bottom"
                                      className="tooltipCustom"
                                      arrowColor="rgba(0, 0, 0, 0)"
                                      effect="float"
                                    >
                                      <span className="secondaryColor" style={{ fontSize: "12px" }}>
                                        {workgroup.name}
                                      </span>
                                    </ReactTooltip>
                                  )}
                                </label>
                                <input
                                  type="checkbox"
                                  className="form-check-input me-2"
                                  name={workgroup.name}
                                  checked={workgroup?.selectedForRead || false}
                                  id="selectedForRead"
                                  onChange={handleWorkGroupsListChange}
                                ></input>
                              </div>
                            );
                          })}
                      </form>
                    </div>
                  </div>
                  <div
                    className="my-2"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      padding: 2,
                    }}
                  >
                    {workgroupsList.map((workgroup, index) => {
                      if (
                        workgroup.selectedForRead != undefined &&
                        workgroup.selectedForRead == true
                      ) {
                        return (
                          <div key={index} className="minibtn mx-2 my-1">
                            <span className="secondaryColor">
                              {workgroup.name.substring(0, 20)}
                              {workgroup.name.length > 20 && <span>...</span>}
                            </span>
                            {workgroup.name.length > 20 && (
                              <ReactTooltip
                                id={workgroup.name}
                                place="bottom"
                                className="tooltipCustom"
                                arrowColor="rgba(0, 0, 0, 0)"
                                effect="float"
                              >
                                <span className="secondaryColor" style={{ fontSize: "12px" }}>
                                  {workgroup.name}
                                </span>
                              </ReactTooltip>
                            )}
                            <span
                              className="mx-1 secondaryColor"
                              id="accessibilityCol-crossIcon-removeWorkgroup"
                              onClick={() =>
                                handleRemoveWorkgroup(
                                  workgroup,
                                  "selectedForRead"
                                )
                              }
                            >
                              {crossIcon()}
                            </span>
                          </div>
                        );
                      }
                    })}
                  </div>
                </Col>
              </Row>

              <Row className="my-1">
                <Col lg={3} md={3} sm={3} xs={3}>
                  <h6 className="primaryColor">Hide</h6>
                </Col>
                <Col lg={4} md={4} sm={4} xs={4}>
                  <div>
                    <button
                      className="dropdown-toggle customDropdownBtn secondaryButtonColor"
                      id="dropdownHideActors"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Select Actor
                      {dropdownIcon()}
                    </button>
                    <div
                      class="dropdown-menu customScrollBarAccessibilityDropdown dropdown-menu-scroll dropdown-area dropdown-menu-container"
                      aria-labelledby="dropdownHideActors"
                    >
                      <form className="form">
                        <div className="form-check dropdown-option-container">
                          <label className="secondaryColor" style={{ fontSize: "small" }}>
                            All Select
                          </label>
                          <input
                            style={{ accentColor: "red" }}
                            type="checkbox"
                            className="form-check-input me-2"
                            name="allSelect"
                            checked={
                              !usersList.some(
                                (user) => user?.selectedForHide !== true
                              )
                            }
                            id="selectedForHide"
                            onChange={handleUsersListChange}
                          ></input>
                        </div>
                        {usersList.length !== 0 &&
                          usersList.map((user, index) => {
                            return (
                              <div className="form-check dropdown-option-container">
                                <label className="secondaryColor" style={{ fontSize: "small" }}>
                                  <span className="secondaryColor" data-tip data-for={user.username}>
                                    {user.username.substring(0, 20)}
                                    {user.username.length > 20 && (
                                      <span>...</span>
                                    )}
                                  </span>
                                  {user.username.length > 20 && (
                                    <ReactTooltip
                                      id={user.username}
                                      place="bottom"
                                      className="tooltipCustom"
                                      arrowColor="rgba(0, 0, 0, 0)"
                                      effect="float"
                                    >
                                      <span className="secondaryColor" style={{ fontSize: "12px" }}>
                                        {user.username}
                                      </span>
                                    </ReactTooltip>
                                  )}
                                </label>
                                <input
                                  type="checkbox"
                                  className="form-check-input me-2"
                                  name={user.username}
                                  checked={user?.selectedForHide || false}
                                  id="selectedForHide"
                                  onChange={handleUsersListChange}
                                ></input>
                              </div>
                            );
                          })}
                      </form>
                    </div>
                  </div>
                  <div
                    className="my-2"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      padding: 2,
                    }}
                  >
                    {usersList.map((user, index) => {
                      if (
                        user.selectedForHide != undefined &&
                        user.selectedForHide == true
                      ) {
                        return (
                          <div key={index} className="minibtn mx-2 my-1">
                            <span className="secondaryColor" data-tip data-for={user.username}>
                              {user.username.substring(0, 20)}
                              {user.username.length > 20 && <span>...</span>}
                            </span>
                            {user.username.length > 20 && (
                              <ReactTooltip
                                id={user.username}
                                place="bottom"
                                className="tooltipCustom"
                                arrowColor="rgba(0, 0, 0, 0)"
                                effect="float"
                              >
                                <span className="secondaryColor" style={{ fontSize: "12px" }}>
                                  {user.username}
                                </span>
                              </ReactTooltip>
                            )}
                            <span
                              id="accessibilityCol-crossIcon-removeUser"
                              className="mx-1 secondaryColor"
                              onClick={() =>
                                handleRemoveUser(user, "selectedForHide")
                              }
                            >
                              {crossIcon()}
                            </span>
                          </div>
                        );
                      }
                    })}
                  </div>
                </Col>
                <Col lg={4} md={4} sm={4} xs={4}>
                  <div>
                    <button
                      className="dropdown-toggle customDropdownBtn secondaryButtonColor"
                      id="dropdownHideWorkgroups"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Select Work Group
                      {dropdownIcon()}
                    </button>
                    <div
                      class="dropdown-menu customScrollBarAccessibilityDropdown dropdown-menu-scroll dropdown-area dropdown-menu-container"
                      aria-labelledby="dropdownHideWorkgroups"
                    >
                      <form className="form">
                        <div className="form-check dropdown-option-container">
                          <label className="secondaryColor" style={{ fontSize: "small" }}>
                            All Select
                          </label>
                          <input
                            type="checkbox"
                            className="form-check-input me-2 colouredcheck"
                            name="allSelect"
                            checked={
                              !workgroupsList.some(
                                (workgroup) =>
                                  workgroup?.selectedForHide !== true
                              )
                            }
                            id="selectedForHide"
                            onChange={handleWorkGroupsListChange}
                          ></input>
                        </div>
                        {workgroupsList.length !== 0 &&
                          workgroupsList.map((workgroup, index) => {
                            return (
                              <div className="form-check dropdown-option-container">
                                <label className="secondaryColor" style={{ fontSize: "small" }}>
                                  <span className="secondaryColor" data-tip data-for={workgroup.name}>
                                    {workgroup.name.substring(0, 20)}
                                    {workgroup.name.length > 20 && (
                                      <span>...</span>
                                    )}
                                  </span>
                                  {workgroup.name.length > 20 && (
                                    <ReactTooltip
                                      id={workgroup.name}
                                      place="bottom"
                                      className="tooltipCustom"
                                      arrowColor="rgba(0, 0, 0, 0)"
                                      effect="float"
                                    >
                                      <span className="secondaryColor" style={{ fontSize: "12px" }}>
                                        {workgroup.name}
                                      </span>
                                    </ReactTooltip>
                                  )}
                                </label>
                                <input
                                  type="checkbox"
                                  className="form-check-input me-2"
                                  name={workgroup.name}
                                  checked={workgroup?.selectedForHide || false}
                                  id="selectedForHide"
                                  onChange={handleWorkGroupsListChange}
                                ></input>
                              </div>
                            );
                          })}
                      </form>
                    </div>
                  </div>
                  <div
                    className="my-2"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      padding: 2,
                    }}
                  >
                    {workgroupsList.map((workgroup, index) => {
                      if (
                        workgroup.selectedForHide != undefined &&
                        workgroup.selectedForHide == true
                      ) {
                        return (
                          <div key={index} className="minibtn mx-2 my-1">
                            <span className="secondaryColor">
                              {workgroup.name.substring(0, 20)}
                              {workgroup.name.length > 20 && <span>...</span>}
                            </span>
                            {workgroup.length > 20 && (
                              <ReactTooltip
                                id={workgroup.name}
                                place="bottom"
                                className="tooltipCustom"
                                arrowColor="rgba(0, 0, 0, 0)"
                                effect="float"
                              >
                                <span className="secondaryColor" style={{ fontSize: "12px" }}>
                                  {workgroup.name}
                                </span>
                              </ReactTooltip>
                            )}
                            <span
                            id="accessibilityCol-crossIcon-removeWorkgroup"
                              className="mx-1 secondaryColor"
                              onClick={() =>
                                handleRemoveWorkgroup(
                                  workgroup,
                                  "selectedForHide"
                                )
                              }
                            >
                              {crossIcon()}
                            </span>
                          </div>
                        );
                      }
                    })}
                  </div>
                </Col>
              </Row>

              {/* <Row>
                <Col lg={3} md={3} sm={3} xs={3}>
                  <div className="form-check">
                    <span style={{ fontSize: "15px" }}>Save this action</span>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name=""
                      checked={showSaveActionInput}
                      id=""
                      // onChange={}
                      onChange={() =>
                        showSaveActionInput
                          ? setShowSaveActionInput(false)
                          : setShowSaveActionInput(true)
                      }
                      style={{marginTop:"6px"}}
                    ></input>
                  </div>
                </Col>
                <Col lg={8} md={8} sm={8} xs={8}>
                  <form>
                    <div class="">
                      {showSaveActionInput == true && (
                        <input
                          type="text"
                          class="actioninput"
                          id=""
                          value={actionName}
                          onChange={(e) => setActionName(e.target.value)}
                          placeholder="Enter action name here"
                        />
                      )}
                    </div>
                  </form>
                </Col>
              </Row> */}
            </Col>

            {/* {displaySavedTable()} */}
          </Row>
          <Row
            className="mt-4"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Col md={6}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
                className="mx-4"
              >
                <button
                id="accessibilityCol-button-clearAll"
                  type="button"
                  className="secondaryButton secondaryButtonColor"
                  onClick={clearAllSelections}
                >
                  Clear All
                </button>
                <button
                id="accessibilityCol-button-saveAndApply"
                  type="button"
                  className="primaryButton primaryButtonColor"
                  onClick={handleSaveClick}
                >
                  Save & Apply
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </CommonModelContainer>
  );
};

export default AccessibilityPopup;
