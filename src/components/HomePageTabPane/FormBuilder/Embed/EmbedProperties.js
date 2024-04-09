import React, { useState, useEffect } from "react";
import axios from "axios";
import AccessibilityPopup from "../../../AccessibilityPopup/AccessibilityPopup.js";
import AccessibilityMiniTable from "../../../AccessibilityMiniTable/AccessibilityMiniTable.js";
import StyleComponent from "../Label/StyleComponent";

export default function EmbedProperties({
  element,
  layout,
  setLayout,
  handleShow,
  placeholderChange,
}) {
  const [values, setValues] = useState("");

  const handleChange = (evt) => {
    setValues(evt.target.value);
    placeholderChange(evt, "fieldName");
  };

  const handleTypeChange = (event) => {
    const temp = layout.layout.map((item) => {
      if (item.i === element.i) {
        return {
          ...item,
          mediaType: event.target.value,
        };
      }
      return item;
    });
    layout.layout = [...temp];
    setLayout(layout);
  };

  const renderDataModelOptions = () => {
    const types = ["image/jpg", "text/html", "video/webm"];
    return types.map((item) => (
      <option selected={item === element.mediaType ? true : false} value={item}>
        {item}
      </option>
    ));
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
              <label className="secondaryColor">Field Name</label>
              <input
                id="embed-field-name-input"
                type="text"
                placeholder="Action Name"
                value={element.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                onChange={(e) => {
                  handleChange(e, "fieldName");
                }}
              />
            </div>
            <div className="form-input">
              <label className="secondaryColor">Please select a type</label>
              <select id="embed-type-select" value={element?.mediaType} onChange={handleTypeChange}>
                <option value="">Select a Value</option>
                {renderDataModelOptions()}
              </select>
            </div>
            <div className="form-input">
              <label className="secondaryColor">Source Link</label>
              <input
                id="embed-source-link-input"
                type="text"
                placeholder="Source Link"
                value={element.mediaUrl}
                onChange={(e) => {
                  placeholderChange(e, "mediaUrl");
                }}
              />
            </div>
            {/* <div className="text-btn-wrap">
              <button className="btn btn-blue-border">Calculate</button>
              <button className="btn btn-blue-border" onClick={handleShow}>
                Pattern Validation/Save
              </button>
            </div> */}
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
          />
        </div>
      </div>
    </>
  );
}
