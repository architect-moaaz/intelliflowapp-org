import React from "react";
import { Link } from "react-router-dom";
import "./EditSetting.css";

const EditSetting = ({ editGroupData, setEditGroupData, onEditGroup, setShowEditGroup }) => {
  const handleInputChange = (event) => {
    const {value} = event.target;
    setEditGroupData({ ...editGroupData, name: value, path: `/${value}`});
  }
  return (
    <div className="add_role add_group">
      <div className="role_form">
        <label className="secondaryColor" >
        Name <span className="secondaryColor">*</span>
        </label>
        <input id="editSettings-name-input" type="text" value={editGroupData.name} onChange={handleInputChange}/>
      </div>
      <div className="role_form_btn">
        <Link id="editSettings-save-link" to="#" className="btn btn-orange" onClick={onEditGroup}>
          Save
        </Link>
        <Link id="editSettings-cancel-link" to="#" className="btn btn-orange-white" onClick={() => setShowEditGroup(false)}>
          Cancel
        </Link>
      </div>
    </div>
  );
};
export default EditSetting;
