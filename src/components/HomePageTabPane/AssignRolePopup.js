import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import CommonModelContainer from "../CommonModel/CommonModelContainer";
import { toast } from "react-toastify";
import "./AssignRolePopup.css";
import { useTranslation } from "react-i18next";

const AssignRolePopup = ({
  data,
  layout,
  setLayout,
  handleHidePopup,
  showAssignRolePopup,
  displaymappinginfo,
}) => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [t, i18n] = useTranslation("common");
{t("mobile")}
  useEffect(() => {
    getRoles();
    //   const storedSelectedRole = localStorage.getItem("selectedRole");
    // if (storedSelectedRole) {
    //   setSelectedRole(storedSelectedRole);
    // }
  }, []);
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
  const clearAllSelections = (e) => {
    e.preventDefault();
    // handleHidePopup();
    setSelectedRole("");
  };
  const RenderRolesOptions = () => {
    return roles.map((role) => (
      <option value={role.value}>{role.title}</option>
    ));
  };
  const renderRoleChange = (e) => {
    e.preventDefault();
    const selectedRoleValue = e.target.value;
    setSelectedRole(selectedRoleValue);
    localStorage.setItem("selectedRoleValue", selectedRoleValue);
    // console.log("2o",selectedRoleValue)
  };
  const mapRole = async (e) => {
    e.preventDefault();
    if (selectedRole == "") {
      toast.error("Please select a role", {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        isLoading: false,
      });
    } else {
      await axios
        .post(
          process.env.REACT_APP_MODELLER_API_ENDPOINT +
            "modellerService/page/mapping",
          {
            workspaceName: localStorage.getItem("workspace"),
            miniAppName: localStorage.getItem("appName"),
            fileName: data.resourceName,
            roleId: selectedRole,
          }
        )
        .then((res) => {
          if (res.status === 200) {
            setSelectedRole("");
            handleHidePopup();
            toast.success(t("Assigned successfully"), {
              position: "bottom-right",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              isLoading: false,
            });
          }
        });
    }
  };
  return (
    <CommonModelContainer
      modalTitle={t("Assign User role")}
      show={showAssignRolePopup}
      handleClose={handleHidePopup}
      className="accessibility-modal-assignrole"
      id="accessibilityPopup-Accessibility-CommonModelContainer"
    >
      <Modal.Body className="modal-scroll">
        <form>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "5%",
            }}
          >
            <label>
              <h5>{t("Role")}</h5>
            </label>
            <select
              style={{
                width: "fit-content",
                padding: "9px",
                borderRadius: "8px",
                border: "2px solid #0d3c84",
                marginLeft: "5%",
                fontFamily: "Lato !important",
                letterSpacing: "0.02rem",
                fontSize: "14px",
              }}
              value={selectedRole}
              onChange={renderRoleChange}
            >
              <option value="" disabled>
               {t("Select the Role")}
              </option>
              <RenderRolesOptions />
            </select>
          </div>
          <div className="mx-4 accessibility-clearandsave">
            <button
              id="accessibilityPopup-clearAll"
              type="button"
              className="primaryButton primaryButtonColor"
              onClick={mapRole}
            >
              {t("Save")}
            </button>
            <button
              id="accessibilityPopup-saveAndApply"
              type="button"
              className="secondaryButton secondaryButtonColor ml-3"
              onClick={clearAllSelections}
            >
              {t("Clear")}
            </button>
          </div>
        </form>
      </Modal.Body>
    </CommonModelContainer>
  );
};

export default AssignRolePopup;
