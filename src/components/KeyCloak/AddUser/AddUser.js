import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import Select from "react-select";
import "./AddUser.css";
import axios from "axios";
import { toast } from "react-toastify";
import PasswordInputField from "../../ChangePasswordPopup/PasswordInputField";
import ConfirmPasswordInputField from "../../ChangePasswordPopup/ConfirmPasswordInputField";

const userActions = [
  {
    label: "Configure OTP",
    value: "CONFIGURE_TOTP",
  },
  {
    label: "Update Password",
    value: "UPDATE_PASSWORD",
  },
  {
    label: "Update Profile",
    value: "UPDATE_PROFILE",
  },
  {
    label: "Verify Email",
    value: "VERIFY_EMAIL",
  },
  {
    label: "Update User Locale",
    value: "update_user_locale",
  },
];

const allLocale = [
  {
    label: "de",
    value: "de",
  },
  {
    label: "no",
    value: "no",
  },
  {
    label: "ru",
    value: "ru",
  },
  {
    label: "sv",
    value: "sv",
  },
  {
    label: "pt-BR",
    value: "pt-BR",
  },
  {
    label: "lt",
    value: "lt",
  },
  {
    label: "en",
    value: "en",
  },
  {
    label: "it",
    value: "it",
  },
  {
    label: "fr",
    value: "fr",
  },
  {
    label: "hu",
    value: "hu",
  },
  {
    label: "zh-CN",
    value: "zh-CN",
  },
  {
    label: "es",
    value: "es",
  },
  {
    label: "cs",
    value: "cs",
  },
  {
    label: "ja",
    value: "ja",
  },
  {
    label: "sk",
    value: "sk",
  },
  {
    label: "pl",
    value: "pl",
  },
  {
    label: "da",
    value: "da",
  },
  {
    label: "ca",
    value: "ca",
  },
  {
    label: "nl",
    value: "nl",
  },
  {
    label: "tr",
    value: "tr",
  },
];

const AddUser = ({ setShowAddUser, setShowEditUser, fetchAllUsers }) => {
  const token = localStorage.getItem("token");
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedUserAction, setSelectedUserAction] = useState([]);
  const [selectedLocale, setSelectedLocale] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [passwordError, setPasswordErr] = useState("");

  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passwordInput, setPasswordInput] = useState({
    password: "",
    confirmPassword: "",
    currentpassword: "",
  });

  const [userData, setUserData] = useState({
    enabled: true,
    attributes: {
      locale: [],
    },
    groups: [],
    email: "",
    emailVerified: false,
    firstName: "",
    lastName: "",
    requiredActions: [],
    username: "",
    password: "",
  });
  const handlePasswordChange = (evnt) => {
    const passwordInputValue = evnt.target.value.trim();
    const passwordInputFieldName = evnt.target.name;
    const NewPasswordInput = {
      ...passwordInput,
      [passwordInputFieldName]: passwordInputValue,
    };
    setPasswordInput(NewPasswordInput);
  };
  console.log(
    "disableBtn",
    userData.email == "" ||
      userData.username == "" ||
      userData.firstName == "" ||
      userData.password == ""
      ? true
      : false
  );
  const handleValidation = (evnt) => {
    const passwordInputValue = evnt.target.value.trim();
    const passwordInputFieldName = evnt.target.name;

    //for password
    if (passwordInputFieldName === "password") {
      const uppercaseRegExp = /(?=.*?[A-Z])/;
      const lowercaseRegExp = /(?=.*?[a-z])/;
      const digitsRegExp = /(?=.*?[0-9])/;
      const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
      const minLengthRegExp = /.{8,}/;

      const passwordLength = passwordInputValue.length;
      const uppercasePassword = uppercaseRegExp.test(passwordInputValue);
      const lowercasePassword = lowercaseRegExp.test(passwordInputValue);
      const digitsPassword = digitsRegExp.test(passwordInputValue);
      const specialCharPassword = specialCharRegExp.test(passwordInputValue);
      const minLengthPassword = minLengthRegExp.test(passwordInputValue);

      let errMsg = "";
      if (passwordLength === 0) {
        errMsg = "Password is empty";
      } else if (!uppercasePassword) {
        errMsg = "At least one uppercase";
      } else if (!lowercasePassword) {
        errMsg = "At least one lowercase";
      } else if (!digitsPassword) {
        errMsg = "At least one digit";
      } else if (!specialCharPassword) {
        errMsg = "At least one special Character";
      } else if (!minLengthPassword) {
        errMsg = "At least minumum 8 characters";
      } else {
        errMsg = "";
      }
      setPasswordErr(errMsg);
    }

    // for confirm password
    if (
      passwordInputFieldName === "confirmPassword" ||
      (passwordInputFieldName === "password" &&
        passwordInput.confirmPassword.length > 0)
    ) {
      if (passwordInput.confirmPassword !== passwordInput.password) {
        setConfirmPasswordError("Password does not match");
      } else {
        setConfirmPasswordError("");
      }
    }
  };

  const resetPassword = async (token) => {
    token = localStorage.getItem("token");
    var data = {
      userid: localStorage.getItem("id"),
      password: passwordInput.password,
    };
    console.log(data);
    var resetpasswordapi = {
      method: "put",
      url:
        process.env.REACT_APP_IDENTITY_ENDPOINT +
        "IDENTITY/resetpassword/fetchresetpassword",

      headers: {
        access_token: `${token}`,
        "Content-Type": "application/json",
      },

      data: JSON.stringify(data),
    };
    // console.log(resetpasswordapi);
    axios(resetpasswordapi)
      .then(function (response) {
        toast.success("Password Updated Successfully ", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        // console.log("ToastTest", JSON.stringify(response.data));
      })

      .catch(function (error) {
        console.log(error);
      });
  };

  const handleSelectUpdate = () => {
    resetPassword();
  };

  useEffect(() => {
    const groupconfig = {
      method: "get",
      url:
        process.env.REACT_APP_IDENTITY_ENDPOINT +
        "IDENTITY/group/fetchallgroups",
      headers: {
        "Content-Type": "application/json",
        access_token: token,
      },
    };
    axios(groupconfig).then((resp) => {
      const response = [];
      resp.data.map((group) => {
        const data = { label: group.name, value: group.path };
        response.push(data);
      });
      console.log({ response });
      setAllGroups(response);
    });
  }, [0]);
  const renderTooltip = (props, text) => (
    <Tooltip id="button-tooltip" {...props}>
      {text}
    </Tooltip>
  );

  const onHandleChange = (event) => {
    const { name, value } = event.target;
    console.log("name", name, "value", value);
    setUserData({ ...userData, [name]: value });
  };

  const onSelectGroups = (groups) => {
    const selectedGroup = groups.map((resp) => {
      return resp.value;
    });
    setUserData({ ...userData, groups: selectedGroup });
    setSelectedGroups(groups);
  };
  const onSelectUserAction = (actions) => {
    const selectedAction = actions.map((resp) => {
      return resp.value;
    });
    setUserData({ ...userData, requiredActions: selectedAction });
    setSelectedUserAction(actions);
  };
  const onSelectLocale = (locale) => {
    console.log({ locale });
    setUserData({ ...userData, attributes: { locale: [locale.value] } });
    setSelectedLocale(locale);
  };

  const onAddUser = () => {
    console.log({ userData });
    const groupconfig = {
      method: "post",
      url:
        process.env.REACT_APP_IDENTITY_ENDPOINT +
        "IDENTITY/createusers/generateusers",
      headers: {
        "Content-Type": "application/json",
        access_token: token,
        workspace: "Intelliflow",
      },
      data: userData,
    };
    axios(groupconfig)
      .then((resp) => {
        if (resp.data.status) {
          toast.success("User added successfully.");

          setShowAddUser(false);
          fetchAllUsers();
          // setShowEditUser(true);
        }
        console.log({ resp });
      })
      .catch((error) => {
        toast.error("Entered email is already exist", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.log(error);
      });
  };
  console.log({ userData });
  return (
    <div className="add_role">
      <div className="add_role_width">
        <Row>
          <Col lg={6}>
            <div className="adduser_input">
              <label className="secondaryColor">
                Username
                <span className="appdesignerappname secondaryColor">*</span>
              </label>

              <input
                id="addUser-userName-input"
                type="text"
                name="username"
                onChange={onHandleChange}
              />
            </div>

            <div className="adduser_input">
              <label className="secondaryColor">
                Email
                <span className="appdesignerappname secondaryColor">*</span>
              </label>

              <input type="text" name="email" onChange={onHandleChange} />
            </div>
            <div className="adduser_input">
              <label className="secondaryColor">
                First Name{" "}
                <span className="appdesignerappname secondaryColor">*</span>
              </label>

              <input
                id="addUser-firstName-input"
                type="text"
                name="firstName"
                onChange={onHandleChange}
              />
            </div>

            <div className="adduser_input">
              <label className="secondaryColor">Last Name</label>
              <input
                id="addUser-lastName-input"
                type="text"
                name="lastName"
                onChange={onHandleChange}
              />
            </div>
            <div className="toggle_switch_wrap">
              <h6 className="primaryColor">
                User Enabled{" "}
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={(props) =>
                    renderTooltip(props, "User can change the Password")
                  }
                  id="addUser-userEnabled-OverlayTrigger"
                >
                  <Icon icon="eva:question-mark-circle-fill" />
                </OverlayTrigger>
              </h6>
              <BootstrapSwitchButton
                checked={userData.enabled}
                size="sm"
                onChange={(checked) => {
                  setUserData({ ...userData, enabled: checked });
                }}
                id="addUser-userDataEnabled-BootstrapSwitchButton"
                className="BootstrapSwitchButton"
              />
            </div>
            <div className="toggle_switch_wrap">
              <h6 className="primaryColor">
                Email Verified
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={(props) =>
                    renderTooltip(props, "Has the user's email been verified?.")
                  }
                  onChange={(checked) => {
                    setUserData({ ...userData, enabled: checked });
                  }}
                  id="addUser-emailVerified-OverlayTrigger"
                >
                  <Icon icon="eva:question-mark-circle-fill" />
                </OverlayTrigger>
              </h6>
              <BootstrapSwitchButton
                checked={userData.emailVerified}
                size="sm"
                onChange={(checked) => {
                  setUserData({ ...userData, emailVerified: checked });
                }}
                id="addUser-useremailVerified-BootstrapSwitchButton"
                className="BootstrapSwitchButton"
              />
            </div>
          </Col>

          <Col lg={6}>
            <div className="adduser_input">
              <label className="secondaryColor">
                Groups
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={(props) =>
                    renderTooltip(
                      props,
                      "Groups where the user has membership. To leave a group, select it and click Leave."
                    )
                  }
                  id="addUser-groups-OverlayTrigger"
                >
                  <Icon icon="eva:question-mark-circle-fill" />
                </OverlayTrigger>
              </label>
              {console.log("allGroups-407", allGroups)}
              <Select
                classNamePrefix="react-select-adduser"
                isMulti
                value={selectedGroups}
                options={allGroups}
                onChange={onSelectGroups}
                id="addUser-allGroups-select"
              />
            </div>
            <div>
              <label
                className="addusercurrentpasssword-adduser secondaryColor"
                for="psw"
              >
                {" "}
                Create Password
                <span className="appdesignerappname secondaryColor">*</span>
                <PasswordInputField
                  className="currentpassword"
                  handlePasswordChange={handlePasswordChange}
                  handleValidation={handleValidation}
                  passwordValue={userData.password}
                  passwordError={passwordError}
                  updatePasswordvalue={onHandleChange}
                  // id="addUser-password-PasswordInputField"

                  // onChange={(e) => {
                  // // onHandleChange();
                  //  console.log("test", e.target.value);
                  //  }}
                />
              </label>
              {/* <label className="addusercurrentpasssword-adduser" for="psw">
                {" "}
                Confirm Password
                <span className="appdesignerappname">*</span>
                <ConfirmPasswordInputField
                  className="currentpassword"
                  handlePasswordChange={handlePasswordChange}
                  handleValidation={handleValidation}
                  confirmPasswordValue={passwordInput.confirmPassword}
                  confirmPasswordError={confirmPasswordError}
                  id="addUser-confirmpassword-ConfirmPasswordInputField"
                />{" "}
              </label> */}

              {/* <button className="update " onClick={handleSelectUpdate}>
                update
              </button> */}
            </div>
            {/* <div className="add_input">
              <label>
                Require User Actions
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderTooltip}
                >
                  <Icon icon="eva:question-mark-circle-fill" />
                </OverlayTrigger>
              </label>

              <Select
                isMulti
                value={selectedUserAction}
                options={userActions}
                onChange={onSelectUserAction}
              />
            </div> */}
            {/* <div className="add_input">
              <label>Locale</label>
              <Select
                value={selectedLocale}
                options={allLocale}
                onChange={onSelectLocale}
              />
            </div> */}
          </Col>
        </Row>
        <div className="adduser-savebutton">
          <button
            className="primaryButton-adduser primaryButtonColor user-savelink"
            disabled={
              userData.email == "" ||
              userData.username == "" ||
              userData.firstName == "" ||
              userData.password == ""
                ? true
                : false
            }
            onClick={onAddUser}
            id="addUser-save-link"
          >
            Save
          </button>
          <Link
            to="#"
            className="secondaryButton-adduser secondaryButtonColor user-savelink"
            onClick={() => setShowAddUser(false)}
            id="addUser-cancel-link"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};
export default AddUser;
