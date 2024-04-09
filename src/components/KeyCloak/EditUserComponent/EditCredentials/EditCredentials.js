import { Icon } from "@iconify/react";
import React from "react";
import { Link } from "react-router-dom";
import { Tab, Nav, OverlayTrigger, Tooltip, Button } from "react-bootstrap";
import "./EditCredentials.css";
import EditUserDetail from "../EditUserDetail/EditUserDetail";
import BootstrapSwitchButton from "bootstrap-switch-button-react";

const EditCredentials = () => {
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Has the User’s Email been verified
    </Tooltip>
  );
  return (
    <>
      <table className="custom_table mb-4">
        <thead>
          <tr>
            <th>Position</th>
            <th>Type</th>
            <th>User Label</th>
            <th>Data</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div className="positionBtns">
                <Link id="editCredentials-link1" to="/">
                  <Icon icon="dashicons:arrow-up-alt2" />
                </Link>
                <Link id="editCredentials-link2" to="/">
                  <Icon icon="dashicons:arrow-down-alt2" />
                </Link>
              </div>
            </td>
            <td>
              <input
                type="Password"
                placeholder="Password"
                className="InputForm"
                id="editCredentials-password-input"
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="Type something"
                className="InputForm"
                id="editCredentials-text-input"
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="Show data......"
                className="InputForm"
                id="editCredentials-showData-input"
              />
            </td>
            <td>
              <div className="tableActionbtnWrap">
                <Link id="editCredentials-delete-link" to="/" className="btn btn-gray">
                  Delete
                </Link>
                <Link id="editCredentials-save-link" to="/" className="btn btn-gray">
                  Save
                </Link>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="resetPassword-info mb-4">
        <h5 className="primaryColor">Reset Password</h5>
        <div className="add_input">
          <label className="secondaryColor">Password</label>
          <div className="position-relative">
            <input type="password" />
            <Link to="/">
              <Icon icon="emojione-monotone:eye" />
            </Link>
          </div>
        </div>
        <div className="add_input">
          <label className="secondaryColor">Password Conformation</label>
          <div className="position-relative">
            <input id="editCredentials-password-input1" type="password" />
            <Link id="editCredentials-link3" to="/">
              <Icon icon="emojione-monotone:eye" />
            </Link>
          </div>
        </div>
        <div className="toggle_switch_wrap">
          <h6 className="primaryColor">
            Temporary
            <OverlayTrigger
              placement="right"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltip}
              id="editCredentials-temporary-OverlayTrigger"
            >
              <Icon icon="eva:question-mark-circle-fill" />
            </OverlayTrigger>
          </h6>
          <BootstrapSwitchButton checked={true} size="sm" id="editCredentials-BootstrapSwitchButton" />
        </div>
        <Link to="/" className="btn btn-orange text-white opacity-50">
          Reset Password
        </Link>
      </div>
      <div className="resetPassword-info">
        <h5 className="primaryColor">Credential Reset</h5>
        <div className="add_input">
          <label className="secondaryColor">
            Reset Actions{" "}
            <OverlayTrigger
              placement="right"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltip}
              id="editCredentials-resetActions-OverlayTrigger"
            >
              <Icon icon="eva:question-mark-circle-fill" />
            </OverlayTrigger>
          </label>
          <select>
            <option value="">Select an action</option>
            <option value="">Configure OTP (UPDATE_PASSWORD)</option>
            <option value="">Update Profile (UPDATE_PROFILE)</option>
            <option value="">Verify Email (VERIFY_EMAIL)</option>
            <option value="">Update User Locale (Update_user_locale)</option>
          </select>
        </div>
        <div className="add_input-wrap">
          <div className="add_input">
            <label className="secondaryColor">
              Expires In{" "}
              <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip}
                id="editCredentials-expiresIn-OverlayTrigger"
              >
                <Icon icon="eva:question-mark-circle-fill" />
              </OverlayTrigger>
            </label>
            <input id="editCredentials-12-input" type="text" placeholder="12" />
          </div>
          <div className="add_input">
            <label className="opacity-0 secondaryColor">Password</label>
            <select>
              <option value="">Hours</option>
              <option value="">01</option>
              <option value="">02</option>
              <option value="">03</option>
              <option value="">04</option>
              <option value="">05</option>
            </select>
          </div>
        </div>
        <div className="toggle_switch_wrap">
          <h6 className="me-4 secondaryColor">
            Reset Actions Email
            <OverlayTrigger
              placement="right"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltip}
              id="editCredentials-resetAction-OverlayTrigger"
            >
              <Icon icon="eva:question-mark-circle-fill" />
            </OverlayTrigger>
          </h6>
          <Link id="editCredentials-sendEmail-link" to="/" className="btn btn-orange text-white opacity-50">
            Send Email
          </Link>
        </div>
      </div>
    </>
  );
};
export default EditCredentials;
