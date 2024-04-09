import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import DatePicker from "react-datepicker";
import StyleComponent from "../Label/StyleComponent";
import { Button } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";

export default function TimerProperties({
  element,
  layout,
  setLayout,
  handleShow,
  placeholderChange,
}) {
  const [values, setValues] = useState("");
  const initialDate = new Date();
  const initialTime = new Date(new Date().setHours(0, 0));
  const finalTime = new Date(new Date().setHours(23, 59, 59));

  const handleChange = (evt) => {
    setValues(evt.target.value);
    placeholderChange(evt, "fieldName");
  };

  const renderDateChange = (val, event) => {
    const temp = layout.layout.map((item) => {
      if (item.i === element.i) {
        return {
          ...item,
          [event]: val.toISOString(),
        };
      }
      return item;
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
              <label className="secondaryColor">Field Name </label>
              <input
                id="timer-prop-field-input"
                type={element.fieldType ? element.fieldType : "text"}
                placeholder={element.fieldName}
                value={element.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                onChange={(e) => {
                  handleChange(e, "fieldName");
                }}
              />
            </div>
            <div className="form-input">
              <label className="secondaryColor">Select Timer/Countdown</label>
              <DatePicker
                selected={element.date ? new Date(element.date) : initialDate}
                onChange={(date) => {
                  renderDateChange(date, "date");
                }}
                showTimeSelect
                timeFormat="hh:mm"
                timeIntervals={15}
                timeCaption="Hour"
                todayButton={"Today"}
                dateFormat="dd MMMM yyyy hh:mm aa"
                minDate={initialDate}
                minTime={initialTime}
                maxTime={finalTime}
                popperPlacement="left"
              />
            </div>

            {/* <div className="text-btn-wrap">
              <Link  className="btn btn-blue-border">
                Calculate/Set Date
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
          />
        </div>
      </div>
    </>
  );
}
