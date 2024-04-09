import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./CrerateGroup.css";

const CrerateGroup = ({ setShowAddGroup, fetchAllGroups }) => {
  const token = localStorage.getItem("token");
  const [groupName, setGroupName] = useState("");
  const onHandleChange = (event) => {
    const { value } = event.target;
    setGroupName(value);
  };
  const onCreateGroup = () => {
    const groupconfig = {
      method: "post",

      url:
        process.env.REACT_APP_IDENTITY_ENDPOINT +
        `IDENTITY/creategroups/generategroups`,
      headers: {
        "Content-Type": "application/json",
        access_token: token,
        workspoace: "Intelliflow",
      },
      data: { name: groupName },
    };
    axios(groupconfig)
      .then((resp) => {
        if (resp.data.status) {
          toast.success("Group added successfully.");
          setShowAddGroup();
          fetchAllGroups();
        }
      })
      .catch((error) => {
        toast.error("Group already exist", {
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
  return (
    <div className="add_role add_group">
      <div className="role_form">
        <label className="secondaryColor">
          Name <span className="secondaryColor">*</span>
        </label>
        <input
          id="createGroup-name-input"
          type="text"
          name="firstName"
          onChange={onHandleChange}
        />
      </div>
      <div className="role_form_btn">
        <Link
          id="createGroup-save-link"
          to="#"
          className="btn btn-orange"
          onClick={onCreateGroup}
          disabled={groupName == "" ? true : false}
        >
          Save
        </Link>
        <Link
        to="#"
          className="btn btn-orange-white"
          onClick={() => setShowAddGroup()}
          id="createGroup-cancel-link"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
};
export default CrerateGroup;
