import React, { useState } from "react";
import { Link } from "react-router-dom";
import StyleComponent from "../Label/StyleComponent";
import { Pointer } from "../../../assets";

export default function LocationProperties({
  element,
  layout,
  setLayout,
  handleShow,
  placeholderChange,
}) {
  const [values, setValues] = useState("");

  const handleChange = (evt) => {
    const key = evt.target?.id ?? null;
    const value = evt.target?.value ?? null;
    setValues(value);
    placeholderChange(evt, key, value);
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
        <li class="nav-item" role="presentation">
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
        </li>
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
              <label className="secondaryColor">Location Name </label>
              <input
                id="fieldName"
                type={element.fieldType ? element.fieldType : "text"}
                placeholder={element.fieldName}
                value={element.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                onChange={handleChange}
              />
            </div>
            <div className="form-input">
              <label className="secondaryColor">Latitude Digits</label>
              <input
                id="lat"
                type={element.fieldType ? element.fieldType : "text"}
                placeholder="Latitude"
                value={element.lat}
                onChange={handleChange}
              />
            </div>
            <div className="form-input">
              <label className="secondaryColor">Longitude Digits</label>
              <input
                id="lng"
                type={element.fieldType ? element.fieldType : "text"}
                placeholder="Longitude"
                value={element.lng}
                onChange={handleChange}
              />
            </div>
            <div className="form-input">
              <label className="secondaryColor">Zoom Level</label>
              <input
                id="zoomLevel"
                type={element.fieldType ? element.fieldType : "text"}
                placeholder="Zoom Level"
                value={element.zoomLevel}
                onChange={handleChange}
              />
            </div>
            {/* <div className="text-btn-wrap">
              <Link  className="btn btn-blue-border">
                Calculate
              </Link>
              <Link  className="btn btn-blue-border" onClick={handleShow}>
                Pattern Validation/Save
              </Link>
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
            id="locationProperties-handleChange-StyleComponent"
          />
        </div>
      </div>
    </>
  );
}
