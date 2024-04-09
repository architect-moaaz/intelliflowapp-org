import React, { useState } from "react";
import StyleComponent from "../Label/StyleComponent";

export default function ToDoProperties({
  element,
  layout,
  setLayout,
  handleShow,
  placeholderChange,
}) {
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
          <div
            style={{
              display: "flex",
              minHeight: "250px",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "25px",
              fontWeight: "bold",
            }}
          >
            Re-Size your To-Do List
          </div>
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
