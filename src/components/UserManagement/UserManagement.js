import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Tab, Nav, Breadcrumb, Accordion } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { loggedInUserState } from "../../state/atom";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import CustomSelectNoIcon from "../CustomSelectNoIcon/CustomSelectNoIcon";
import { atom, useRecoilState } from "recoil";
import "./UserManagement.css";
import { Home } from "../../assets";
import { downarrow } from "..//../assets";

const UserManagement = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedMenuIDs, setSelectedMenuIDs] = useState([]);
  const [dashboardMenu, setDashboardMenu] = useState([]);
  const [options, setOptions] = useState([]);
  const [isAppStoreShown, setIsAppStoreShown] = useState(true);
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const [appStoreApps, setAppStoreApps] = useState([]);
  const [selectedAppsProcesses, setSelectedAppsProcesses] = useState([]);
  const [appProcesses, setAppProcesses] = useState([]);
  const [openAccordian, setOpenAccordian] = useState("");
  useEffect(() => {
    getMenu();
    getRoles();
    getApps();
  }, []);

  const changeActiveKey = (e) => {
    setOpenAccordian(e);
  };

  // const handleCancelButton = () => {
  //   handleRoleEnabled(null);
  // };

  function getMenu() {
    var config = {
      method: "get",
      url: process.env.REACT_APP_IDENTITY_ENDPOINT + "IDENTITY/access/allMenus",
    };

    axios(config)
      .then(function (response) {
        const tempData = response?.data?.menus?.map((item) => {
          return {
            ...item,
            visible: false,
          };
        });
        setDashboardMenu([...tempData]);
      })
      .catch(function (error) {
        toast.error("Couldn't get the Menu", {
          position: "bottom-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          isLoading: false,
        });
      });
  }

  const resetChanges = () => {
    getMenu();
    getRoles();
    getApps();
  };

  function getIDs(role) {
    var config = {
      method: "get",
      url: process.env.REACT_APP_IDENTITY_ENDPOINT + "IDENTITY/access/" + role,
    };

    axios(config)
      .then(function (response) {
        console.log("getmenus", response);
        setSelectedMenuIDs(response?.data?.menus[0]?.menus_enabled);
        setSelectedAppsProcesses(response?.data?.menus[0]?.process);
      })
      .catch(function (error) {
        toast.error("Couldn't get the assigned menu", {
          position: "bottom-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          isLoading: false,
        });
      });
  }

  async function getRoles() {
    var config = {
      method: "get",
      url:
        process.env.REACT_APP_IDENTITY_ENDPOINT + "IDENTITY/roles/fetchroles",
    };

    await axios(config)
      .then((res) => {
        const tempValues = res?.data?.map((role) => {
          return {
            title: role.name
              .replace(/-/g, " ")
              .replace(/_/g, " ")
              .toUpperCase(),
            value: role.name,
          };
        });
        setRoles([...tempValues]);
      })
      .catch((e) => {
        toast.error("Couldn't get the Roles", {
          position: "bottom-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          isLoading: false,
        });
      });
  }

  async function getApps() {
    await axios
      .get(
        process.env.REACT_APP_IFAPP_API_ENDPOINT +
          "app-center/" +
          localStorage.getItem("workspace") +
          "/apps",
        { headers: { devicesupport: "D" } }
      )
      .then(async (r) => {
        if (r.data.data.apps) {
          await getappProcesses(r.data.data.apps);
        }
      })
      .catch((e) => {
        console.log("error", e);
      });
  }

  const getappProcesses = async (data) => {
    const tempData = [...data];

    data.map((app, index) => {
      axios
        .get(
          process.env.REACT_APP_IFAPP_API_ENDPOINT +
            "app-center/" +
            localStorage.getItem("workspace") +
            "/" +
            app.app +
            "/context"
        )
        .then(async (r) => {
          tempData[index] = {
            ...tempData[index],
            visible: false,
            processes: [...r.data.data._paths],
            _id: Math.floor(Math.random() * 10000000),
          };
        })
        .catch((e) => {
          console.log("error", e);
        });
    });

    setTimeout(() => {
      setAppStoreApps([...tempData]);
    }, 5000);
  };

  const DashboardAccordian = ({ e, menus }) => {
    const renderSelectMenu = (e, menuId, subMenuId) => {
      e.preventDefault();
      if (selectedMenuIDs?.includes(subMenuId)) {
        const temp = selectedMenuIDs.filter((item) => item !== subMenuId);
        setSelectedMenuIDs([...temp]);
      } else {
        let temp = selectedMenuIDs ?? [];
        temp.push(subMenuId);
        setSelectedMenuIDs([...temp]);
      }
    };

    const RenderCategories = ({ menu }) => {
      const clicked = (e) => {
        e.preventDefault();
        const temp = dashboardMenu.map((item) => {
          if (item._id === menu._id) {
            return {
              ...item,
              visible: !item.visible,
            };
          } else return item;
        });
        setDashboardMenu([...temp]);
      };

      const subMenusArray = menu?.submenus?.map((subMenu) => subMenu.menu_id);
      const selected = selectedMenuIDs?.some((id) =>
        subMenusArray.includes(id)
      );

      return (
        <div className="userManagContainer ">
          <div className="selectroles">
            <button
              id="user-mgt-data-title-btn"
              className={selected ? "paragraph " : "paragraph"}
              onClick={clicked}
            >
              <big className="usermanagement-menu">{menu?.menu_name}</big>
              <img src={downarrow}></img>
            </button>
          </div>
          <div className="sub-menu-container row">
            {menu?.visible &&
              menu?.submenus.map((subMenu, index) => {
                return (
                  <p className="accordionbodyoptions ">
                    {subMenu?.menu_name}

                    <div
                      class="form-switch col-md-6"
                      data-tip
                      data-for="Claim"
                      style={{ display: "initial", paddingLeft: "4.5em" }}
                    >
                      <input
                        type="checkbox"
                        class="form-check-input"
                        id="flexSwitchCheckDefault"
                        role="switch"
                        style={{
                          borderColor: "#0D3C84",
                          borderWidth: "2px",
                          alignSelf: "center",
                          color: "#0D3C84",
                          height: "18px",
                          width: "30px",
                          cursor: "pointer",
                          // backgroundColor: "#FF5711",
                        }}
                        checked={selectedMenuIDs?.includes(subMenu.menu_id)}
                        onChange={(e) =>
                          renderSelectMenu(e, menu?.menu_id, subMenu?.menu_id)
                        }
                      />
                    </div>
                  </p>
                );
              })}
          </div>
        </div>
      );
    };

    // const updateEnabledMenu = async () => {
    //   let config = {
    //     method: "get",
    //     maxBodyLength: Infinity,
    //     url: `${process.env.REACT_APP_IDENTITY_ENDPOINT}IDENTITY/access/${loggedInUser.enabled_menus.role}`,
    //     // data: data,
    //   };

    //   await axios
    //     .request(config)
    //     .then((response) => {
    //       console.log("updateEnabledMenu", response);
    //       setLoggedInUser({
    //         ...loggedInUser,
    //         enabled_menus: [...response.data.menus[0].menus_enabled],
    //       });
    //       // window.location.reload();
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // };

    const handleRoleEnabled = (role) => {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_IDENTITY_ENDPOINT}IDENTITY/access/${role}`,
        headers: {
          access_token: localStorage.getItem("token"),
          workspace: localStorage.getItem("workspace"),
          "Content-Type": "application/json",
        },
      };

      axios
        .request(config)
        .then((response) => {
          localStorage.setItem("currentRole", JSON.stringify(role));
          localStorage.setItem(
            "enabled_menus",
            JSON.stringify(response.data.menus[0])
          );
          setLoggedInUser({
            ...loggedInUser,
            enabled_menus: response.data.menus[0],
            currentRole: role,
          });
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const Save = async () => {
      await axios
        .post(
          `${process.env.REACT_APP_IDENTITY_ENDPOINT}IDENTITY/access/${selectedRole?.value}`,
          { menus: [...selectedMenuIDs] }
        )
        .then(function (res) {
          toast.success("Access updated successfully", {
            position: "bottom-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            isLoading: false,
          });
          // updateEnabledMenu();
          handleRoleEnabled(selectedRole?.value);
        })
        .catch(function (error) {
          toast.error("Couldn't update the Access", {
            position: "bottom-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            isLoading: false,
          });
        });
    };

    return (
      <>
        {menus?.map((menu) => (
          <RenderCategories menu={menu} />
        ))}
        <div className="btn-container">
          <button
            id="user-mgt-category-save-btn"
            className="update-btn primaryButtonColor"
            onClick={Save}
          >
            Update
          </button>
          <button
            id="user-mgt-category-cancel-btn"
            className="cancel-btn secondaryButtonColor"
            onClick={() => handleRoleEnabled(selectedRole?.value)}
          >
            Cancel
          </button>
        </div>
      </>
    );
  };

  const RenderRolesOptions = () => {
    return roles?.map((role) => ({
      value: role.value,
      label: role.title,
      className: "secondaryColor",
    }));
  };
  const Rolesoptions = roles?.map((role) => ({
    value: role.value,
    label: role.title,
    className: "primaryColor",
  }));

  const renderRoleChange = (e) => {
    // e.preventDefault();
    setSelectedRole(e);
    getIDs(e.value);
  };

  const AppCenter = ({ apps }) => {
    const RenderAppMenu = ({ app }) => {
      const clicked = (e) => {
        e.preventDefault();
        const temp = appStoreApps.map((item) => {
          if (item._id === app._id) {
            return {
              ...item,
              visible: !item.visible,
            };
          } else return item;
        });
        setAppStoreApps([...temp]);
      };

      const renderSelectProcess = (e, processID, appId) => {
        e.preventDefault();
        if (selectedAppsProcesses?.includes(`${app.app}.${processID}`)) {
          const temp = selectedAppsProcesses.filter(
            (item) => item !== `${app.app}.${processID}`
          );
          setSelectedAppsProcesses([...temp]);
        } else {
          let temp = selectedAppsProcesses ?? [];
          temp.push(`${appId}.${processID}`);
          setSelectedAppsProcesses([...temp]);
        }
      };

      const subMenusArray = app?.processes?.map(
        (process) => process.endpoint_label
      );

      const selected = selectedAppsProcesses?.some((id) =>
        subMenusArray?.includes(id)
      );

      return (
        <div className="userManagContainer ">
          <div className="selectroles">
            <button
              id="user-mgt-data-title-btn"
              className={selected ? "paragraph selectedid" : "paragraph"}
              onClick={clicked}
            >
              <big className="usermanagement-menu">{app?.appdisplayname}</big>
            </button>
          </div>
          <div className="sub-menu-container ">
            {app?.visible &&
              app?.processes?.map((process) => (
                <p className="accordionbodyoptions1 ">
                  {process?.endpoint_label}
                  <div
                    class="form-switch"
                    data-tip
                    data-for="Claim"
                    style={{ display: "initial", paddingLeft: "4.5em" }}
                  >
                    <input
                      type="checkbox"
                      class="form-check-input"
                      id="flexSwitchCheckDefault"
                      role="switch"
                      style={{
                        borderColor: "#0D3C84",
                        borderWidth: "2px",
                        alignSelf: "center",
                        color: "#0D3C84",
                        height: "18px",
                        width: "30px",
                        cursor: "pointer",
                        // backgroundColor: "#FF5711",
                      }}
                      checked={selectedAppsProcesses?.includes(
                        `${app.app}.${process.endpoint_label}`
                      )}
                      onChange={(e) =>
                        renderSelectProcess(e, process?.endpoint_label, app.app)
                      }
                    />
                  </div>
                </p>
              ))}
          </div>
        </div>
      );
    };
    const handleRoleEnabled = (role) => {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_IDENTITY_ENDPOINT}IDENTITY/access/${role}`,
        headers: {
          access_token: localStorage.getItem("token"),
          workspace: localStorage.getItem("workspace"),
          "Content-Type": "application/json",
        },
      };

      axios
        .request(config)
        .then((response) => {
          localStorage.setItem("currentRole", JSON.stringify(role));
          localStorage.setItem(
            "enabled_menus",
            JSON.stringify(response.data.menus[0])
          );
          setLoggedInUser({
            ...loggedInUser,
            enabled_menus: response.data.menus[0],
            currentRole: role,
          });
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const Save = async () => {
      await axios
        .post(
          `${process.env.REACT_APP_IDENTITY_ENDPOINT}IDENTITY/access/${selectedRole?.value}`,
          { process: [...selectedAppsProcesses] }
        )
        .then(function () {
          toast.success("Access updated successfully", {
            position: "bottom-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            isLoading: false,
          });
          handleRoleEnabled(selectedRole?.value);
        })
        .catch(function (error) {
          toast.error("Couldn't update the Access", {
            position: "bottom-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            isLoading: false,
          });
        });
    };

    return (
      <>
        {apps?.map((app) => (
          <RenderAppMenu app={app} />
        ))}
        <div className="btn-container">
          <button
            id="user-mgt-category-save-btn"
            className="update-btn primaryButtonColor"
            onClick={Save}
          >
            Update
          </button>
          <button
            id="user-mgt-category-cancel-btn"
            className="cancel-btn"
            // onClick={}
          >
            Cancel
          </button>
        </div>
      </>
    );
  };

  const handleStoreChange = (e) => {
    if (e.value === "store") setIsAppStoreShown(true);
    else setIsAppStoreShown(false);
  };
  const initialOptions = [
    { value: "designer", label: "App Designer" },
    { value: "store", label: "App Store" },
  ];
  return (
    <div className="userManagement_body BodyColor">
      <div>
        <div className="container-fluid">
          {/* this is for breadcrums */}
          <div className="row">
            <div
              className="col-md-6"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                marginLeft: "-50px",
                marginTop: "22px",
              }}
            >
              <div className="ms-2">
                <div className="breadCrum BodyColor">
                  <Link
                    to="/"
                    id="ifApplication-dashboard-link"
                    style={{ zIndex: 999 }}
                  >
                    <img src={Home} alt="" />
                  </Link>
                  <h6 className="primaryColor">{">>"}</h6>
                  <Link
                    to="/AdminDashboard"
                    className="IFApplication-breadCrum BodyColor"
                    id="ifApplication-adminDashboard-link"
                    style={{
                      color: " #0c83bf",
                      letterSpacing: "1px",
                      zIndex: 999,
                    }}
                  >
                    <h6 className="primaryColor">Admin Dashboard</h6>
                  </Link>
                  <h6 className="primaryColor">{">>"}</h6>
                  <h6
                    className="primaryColor"
                    style={{ color: " #0c83bf", letterSpacing: "1px" }}
                  >
                    Access Controller
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            flex: "1",
            marginTop: "-80px",
          }}
        >
          <div
            className="selectAppStore"
            style={{ flex: "0.3", marginRight: "2rem" }}
          >
            <div>
              <div className="usermanagement-selectapp primaryColor">
                Select App Store/App Designer
              </div>
              <div>
                <CustomSelectNoIcon
                  className="usermanagement-appdesigner"
                  transferFrom={initialOptions}
                  bringingvalue={handleStoreChange}
                />
              </div>
            </div>
          </div>
          <div
            className="selectRole"
            style={{ flex: "0.3", marginLeft: "2rem" }}
          >
            <div>
              <div className="usermanagement-selectrole primaryColor">
                Select Role
              </div>
              <div>
                <CustomSelectNoIcon
                  className="selectrole"
                  transferFrom={Rolesoptions}
                  bringingvalue={renderRoleChange}
                >
                  <RenderRolesOptions />
                </CustomSelectNoIcon>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedRole != "" &&
        (isAppStoreShown ? (
          <div>
            <AppCenter apps={appStoreApps} />
          </div>
        ) : (
          <div>
            <DashboardAccordian menus={dashboardMenu} />
          </div>
        ))}
    </div>
  );
};
export default UserManagement;
