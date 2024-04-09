import React, { useState } from "react";
import StyleComponent from "../Label/StyleComponent";

export default function MenuProperties({
  element,
  layout,
  setLayout,
  handleShow,
  placeholderChange,
}) {
  const [values, setValues] = useState(null);
  const handleChange = (evt) => {
    setValues(evt.target.value);
    placeholderChange(evt, "fieldName");
  };
  const handleTypeChange = (e, id) => {
    const temp = layout.layout.map((item) => {
      if (item.i === element.i) {
        return {
          ...item,
          isVertical: !item.isVertical,
        };
      } else {
        return item;
      }
    });
    setLayout({ layout: [...temp] });
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
              <label className="secondaryColor">Label Name</label>
              <input
                id="media-prop-label-input"
                type="text"
                placeholder="Label Name"
                value={element.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                onChange={(e) => {
                  handleChange(e, "fieldName");
                }}
              />
            </div>
            <div className="form-input">
              <label className="secondaryColor">Vertical Menu</label>
              <input
                id="vertical-menu-input"
                type="checkbox"
                checked={element.isVertical}
                onChange={(e) => {
                  handleTypeChange(e, "isVertical");
                }}
              />
            </div>
          </form>
        </div>
        <div
          class="tab-pane fade"
          id="pills-profile"
          role="tabpanel"
          aria-labelledby="pills-profile-tab"
        >
          {/* <StyleComponent
            newValueLabel={values}
            handleChangeValue={handleChange}
            element={element}
          /> */}
        </div>
      </div>
    </>
  );
}
