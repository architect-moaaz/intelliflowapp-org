import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import "./EditUserDetail.css";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";

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

const EditUserDetail = ({
  userData,
  onEditUser,
  setEditUserData,
  setShowEditUser,
}) => {
  const [selectedUserAction, setSelectedUserAction] = useState([]);
  const [selectedLocale, setSelectedUserLocale] = useState([]);
  const token = localStorage.getItem("token");

  // console.log("userdata", userData);
  useEffect(() => {
    // const filterSelectedAction = [];
    // console.log({ requiredActions : userData.requiredActions })
    // userData.requiredActions.forEach(selected => {
    //   userActions.forEach(action => action.value === selected && filterSelectedAction.push(action));
    // });
    // const filterSelectedLocale = [];
    // userData.attributes.locale.forEach(selected => {
    //   allLocale.forEach(lng => lng.value === selected && filterSelectedLocale.push(lng))
    // })
    // console.log({ filterSelectedAction })
    // setSelectedUserAction(filterSelectedAction)
    // setSelectedUserLocale(filterSelectedLocale)
  }, [userData]);

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Has the User’s Email been verified
    </Tooltip>
  );

  const onSelectUserAction = () => {};
  const onSelectLocale = () => {};
  const onHandleChange = (event) => {
    const { name, value } = event.target;
    setEditUserData({ ...userData, [name]: value });
  };
  const onChangeUserEnabled = (val) => {
    setEditUserData({ ...userData, enabled: val });
  };
  const onChangeEmailVerified = (val) => {
    setEditUserData({ ...userData, emailVerified: val });
  };

  return (
    <div className="add_role ">
      <div className="add_role_width m-0">
        <Row>
          <Col lg={6}>
            <div className="add_input">
              <label className="secondaryColor">ID</label>
              <input
                id="editUserDetails-id-input"
                type="text"
                value={userData.id}
                disabled
              />
            </div>
            <div className="add_input">
              <label className="secondaryColor">Created At</label>
              <input
                id="editUserDetails-createdAt-input"
                type="text"
                value={new Date(userData.createdTimestamp)}
              />
            </div>
            <div className="add_input">
              <label className="secondaryColor">Email</label>
              <input
                id="editUserDetails-email-input"
                type="text"
                name="Email"
                value={userData?.email}
                onChange={onHandleChange}
              />
            </div>
            <div className="add_input">
              <label className="secondaryColor">User Name</label>
              <input
                type="text"
                name="username"
                value={userData?.username}
                onChange={onHandleChange}
                id="editUserDetails-userName-input"
              />
            </div>
            <div className="add_input">
              <label className="secondaryColor">First Name</label>
              <input
                type="text"
                name="firstName"
                value={userData?.firstName}
                onChange={onHandleChange}
                id="editUserDetails-firstName-input"
              />
            </div>
            <div className="add_input">
              <label className="secondaryColor">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={userData?.lastName}
                onChange={onHandleChange}
                id="editUserDetails-lastName-input"
              />
            </div>
            <div className="toggle_switch_wrap">
              <h6 className="primaryColor">
                User Enabled{" "}
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderTooltip}
                  id="editUserDetails-userEnabled-OverlayTrigger"
                >
                  <Icon icon="eva:question-mark-circle-fill" />
                </OverlayTrigger>
              </h6>
              <BootstrapSwitchButton
                checked={userData?.enabled}
                size="sm"
                onChange={onChangeUserEnabled}
                id="editUserDetails-enabled-BootstrapSwitchButton"
              />
            </div>
            <div className="toggle_switch_wrap">
              <h6 className="primaryColor">
                Email Verified
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderTooltip}
                  id="editUserDetails-emailVerified-OverlayTrigger"
                >
                  <Icon icon="eva:question-mark-circle-fill" />
                </OverlayTrigger>
              </h6>
              <BootstrapSwitchButton
                checked={userData?.emailVerified}
                size="sm"
                onChange={onChangeEmailVerified}
                id="editUserDetails-emailVerified-BootstrapSwitchButton"
              />
            </div>
            <div className="role_form_btn">
              <Link
                id="editUserDetails-save-link"
                to="#"
                className="btn btn-orange"
                onClick={onEditUser}
              >
                Save
              </Link>
              <Link
                id="editUserDetails-cancel-link"
                to="#"
                className="btn btn-orange-white"
                onClick={() => setShowEditUser(false)}
              >
                Cancel
              </Link>
            </div>
          </Col>
          {/* <Col lg={6}> */}
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
              {console.log({ selectedUserAction })}
              <Select
                isMulti
                value={selectedUserAction}
                options={userActions}
                onChange={onSelectUserAction}
              />
            </div>
            <div className="add_input">
              <label>Locale</label>
              <Select
                value={selectedLocale}
                options={allLocale}
                onChange={onSelectLocale}
              />
            </div>
            <div className="toggle_switch_wrap">
              <h6 className="me-4">
              Impersonate user  
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderTooltip}
                >
                  <Icon icon="eva:question-mark-circle-fill" />
                </OverlayTrigger>
              </h6>
              <Link to="" className="btn btn-orange-white">Impersonate</Link>
            </div> */}
          {/* </Col> */}
        </Row>
      </div>
    </div>
  );
};
export default EditUserDetail;
