import React, { useState } from "react";
import { Link } from "react-router-dom";
import StyleComponent from "../Label/StyleComponent";

export default function LinkProperties({
  element,
  layout,
  setLayout,
  handleShow,
  placeholderChange,
}) {
  const [values, setValues] = useState("");

  const handleChange = (evt) => {
    setValues(evt.target.value);
    placeholderChange(evt, evt.target.id, evt.target.value);
  };

  return (
    <>
      <ul class="nav nav-pills label-pills" id="pills-tab" role="tablist">
        <li class="nav-item" role="presentation">
          <button
            class="nav-link active propertiesPopup"
            id="pills-home-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-home"
            type="button"
            role="tab"
            aria-controls="pills-home"
            aria-selected="true"
          >
            Property
          </button>
        </li>
        {/* <li class="nav-item" role="presentation">
          <button
            class="nav-link propertiesPopup"
            id="pills-profile-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-profile"
            type="button"
            role="tab"
            aria-controls="pills-profile"
            aria-selected="false"
          >
            Style
          </button>
        </li> */}
      </ul>
      <div class="tab-content" id="pills-tabContent">
        <div
          class="tab-pane fade show active"
          id="pills-home"
          role="tabpanel"
          aria-labelledby="pills-home-tab"
        >
          <form>
            <div className="form-input">
              <label className="secondaryColor">field Name</label>
              <input
                id="fieldName"
                type={element.fieldType ? element.fieldType : "text"}
                placeholder={element.fieldName}
                value={element.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                onChange={handleChange}
              />
            </div>
            <div className="form-input">
              <label className="secondaryColor">URL</label>
              <input
                id="linkUrl"
                type="url"
                placeholder="link URL"
                value={element.linkUrl}
                onChange={handleChange}
              />
            </div>
            <div className="text-btn-wrap">
              {/* <button className="btn btn-blue-border">Calculate</button>
              <button className="btn btn-blue-border" onClick={handleShow}>
                Pattern Validation/Save
              </button> */}
            </div>
          </form>
        </div>
        <div
          class="tab-pane fade"
          id="pills-profile"
          role="tabpanel"
          aria-labelledby="pills-profile-tab"
        >
          <StyleComponent
            newValueLabel={values}
            handleChangeValue={handleChange}
            element={element}
            id="linkProperties-handleChange-StyleComponent"
          />
        </div>
      </div>
    </>
  );
}
