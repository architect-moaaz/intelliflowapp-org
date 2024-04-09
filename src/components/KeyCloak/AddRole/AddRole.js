import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./AddRole.css";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const AddRole = ({ setShowAddRoles, fetchAllRoles }) => {
  const token = localStorage.getItem("token");
  const [roleName, setRoleName] = useState("");
  const [descriptionName, setDescriptionName] = useState("");
  const [t, i18n] = useTranslation("common");

  const onHandleChange = (event) => {
    const { value } = event.target;
    setRoleName(value);
  };

  const onHandleDescriptionChange = (event) => {
    const { value } = event.target;
    setDescriptionName(value);
    const truncatedValue = value.slice(0, 40);
    setDescriptionName(truncatedValue);
  };
  const remainingCharacters = 40 - descriptionName.length;
  const createrole = () => {
    var axios = require("axios");
    var data = JSON.stringify({
      name: roleName,
      composite: false,
      clientRole: true,
      description: descriptionName,
      containerId: "Intelliflow",
    });

    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url:
        process.env.REACT_APP_IDENTITY_ENDPOINT + "IDENTITY/roles/createrole",
      headers: {
        "Content-Type": "application/json",
        access_token: token,
        workspace: "Intelliflow",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      data: data,
    };

    axios(config)
      .then((response) => {
        if (response.data.status == 409) {
          toast.error("Role already exist", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          toast.success("Role added Successfully", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setShowAddRoles();
          fetchAllRoles();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="add_role">
      <div className="role_form">
        <label className="secondaryColor">
          Role Name <span>*</span>
        </label>
        <input
          id="-addRole-addRole-roleName-input"
          type="text"
          onChange={onHandleChange}
          required
        />
      </div>
      <div className="role_form">
        <label className="secondaryColor">{t("description")}</label>
        <textarea
          rows="6"
          id="-addRole-addRole-descriptionName-input"
          onChange={onHandleDescriptionChange}
          value={descriptionName}
          type="text"
        ></textarea>
        <p> {remainingCharacters}/40</p>
      </div>
      <div className="role_form_btn">
        <Link
          to="#"
          id="addRole-addRole-save-link"
          className="btn btn-orange"
          disabled={roleName == "" ? true : false}
          onClick={() => createrole()}
        >
          Save
        </Link>
        <Link
          to="#"
          className="btn btn-orange-white"
          onClick={() => setShowAddRoles()}
          id="-addRole-addRole-cancel-link"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
};
export default AddRole;
