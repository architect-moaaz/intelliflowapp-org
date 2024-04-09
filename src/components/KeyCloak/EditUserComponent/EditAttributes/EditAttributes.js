import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./EditAttributes.css";

const EditAttributes = ({ userData }) => {
  const [attributes, setAttributes] = useState([])
  const [newAttributes, setNewAttributes] = useState({
    key: '',
    value: '',
  })
  useEffect(() => {
    const attrs = []
    let keyValPair = {
      key: "",
      value: "",
      isAdded: false,
    }
    // console.log({ attributes: userData.attributes, lengthz: userData.attributes.length })
    if (Object.keys(userData.attributes).length > 0) {
      Object.keys(userData.attributes).map((key, val) => {
        const oneAttr = { key: key, value: val, isAdded: true }
        attrs.push(oneAttr)
      })
    }
    attrs.push(keyValPair)
    setAttributes(attrs)
  }, [userData]);

  const onHandleChange = (event, index) => {
    const { name, value } = event.target;
    const changeData = [...attributes];
    changeData[index][name] = value;
    setAttributes(changeData);
  }

  const onAddNewAttribute = (index) => {
    const changeData = [...attributes];
    if(changeData[index].key !== "" && changeData[index].value !== "") {
      let keyValPair = {
        key: "",
        value: ""
      }
      changeData[index].isAdded = true
      changeData.push(keyValPair)
      setAttributes(changeData)
    }
  }
  const onDeleteAttributes = (index) => {
    const changeData = [...attributes];
    changeData.splice(index, 1);
    setAttributes(changeData)
  }
  // console.log({ attributes })
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
          {attributes.map((attr, index) => (
            <tr>
              <td>
                <input
                  type="text"
                  value={attr.key}
                  name="key"
                  placeholder="Type something"
                  className="InputForm"
                  onChange={(e) => onHandleChange(e, index)}
                  id="editAttributes-text-input1"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={attr.value}
                  name="value"
                  placeholder="Type something"
                  className="InputForm"
                  onChange={(e) => onHandleChange(e, index)}
                  id="editAttributes-text-input2"
                />
              </td>
              <td>
                {!attr.isAdded ? (
                  <Link id="editAttributes-add-link" to="#" className="btn btn-gray" onClick={() => onAddNewAttribute(index)}>
                    Add
                  </Link>
                ) : (
                  <Link id="editAttributes-delete-link" to="#" className="btn btn-gray" onClick={() => onDeleteAttributes(index)}>
                    Delete
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="role_form_btn ms-0 mt-4">
        <a id="editAttributes-save-a" className="btn btn-orange" href="/">
          Save
        </a>
        <a id="editAttributes-cancel-a" className="btn btn-orange-white" href="/">
          Cancel
        </a>
      </div>
    </>
  );
};
export default EditAttributes;
