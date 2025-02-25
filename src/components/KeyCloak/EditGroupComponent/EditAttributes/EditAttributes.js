import { Icon } from "@iconify/react";
import React from "react";
import { Link } from "react-router-dom";
import "./EditAttributes.css";

const EditAttributes = () => {
  return (
    <>
      <table className="custom_table">
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
                type="text"
                placeholder="Type something"
                className="InputForm"
                id="editAttributes-input1"
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="Type something"
                className="InputForm"
                id="editAttributes-input2"
              />
            </td>
            <td>
              <Link id="editAttributes-add-link" className="btn btn-gray" to="#">
                Add
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="role_form_btn ms-0 mt-4">
        <a className="btn btn-orange" id="editAttributes-save-a">
          Save
        </a>
        <a className="btn btn-orange-white" id="editAttributes-cancel-a">
          Cancel
        </a>
      </div>
    </>
  );
};
export default EditAttributes;
