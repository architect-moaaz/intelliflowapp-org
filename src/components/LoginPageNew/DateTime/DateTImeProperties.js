import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import DatePicker from "react-datepicker";
import StyleComponent from "../Label/StyleComponent";
import AccessibilityPopup from "../../AccessibilityPopup/AccessibilityPopup.js";
import AccessibilityMiniTable from "../../AccessibilityMiniTable/AccessibilityMiniTable.js";
import axios from "axios";
import json5 from "json5";
import { useTranslation } from "react-i18next";
import {
  Dropdown,
  Row,
  Col,
  Container,
  Form,
  Card,
  DropdownButton,
  Button,
} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

import "react-datepicker/dist/react-datepicker.css";

const DateTImeProperties = ({
  element,
  layout,
  setLayout,
  handleShow,
  placeholderChange,
}) => {
  const [t, i18n] = useTranslation("common");
  const [showAccessibilityPopup, setShowAccessibilityPopup] = useState(false);
  const handleAccessibilityPopupClose = () => setShowAccessibilityPopup(false);
  const handleAccessibilityPopupShow = () => setShowAccessibilityPopup(true);

  var [values, setValues] = useState("");
  const [dataModels, setDataModels] = useState(null);
  const [dataFields, setDataFields] = useState([]);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    getDataModelList();
  }, []);

  const getDataModelList = () => {
    const postData = {
      workspaceName: localStorage.getItem("workspace"),
      miniAppName: localStorage.getItem("appName"),
    };
    axios
      .post(
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
          "modellerService/getResources",
        postData
      )
      .then((res) => {
        setDataModels(res.data.data.datamodel);
      })
      .catch((e) => console.log(e.message));
  };

  const fetchMetaContent = (val) => {
    if (val) {
      const postData = {
        workspaceName: localStorage.getItem("workspace"),
        miniAppName: localStorage.getItem("appName"),
        fileName: val,
        fileType: "datamodel",
      };
      axios
        .post(
          process.env.REACT_APP_MODELLER_API_ENDPOINT +
            "modellerService/fetchFile/meta",
          postData
        )
        .then((res) => {
          if (res.data.data) {
            const data = res.data.data.replace(/\.[^/.]+$/, "");
            const jsonData = json5.parse(data);
            setDataFields([...jsonData]);
          } else {
            setDataFields([]);
          }
        })
        .catch((e) => console.log(e.message));
    } else {
      setDataFields([]);
    }
  };

  const handleChange = (evt) => {
    setValues(evt.target.value);
    placeholderChange(evt, "fieldName");
  };

  const findIndex = () => {
    var index;
    for (let i = 0; i < layout.layout.length; i++) {
      if (layout.layout[i].edit == true) {
        index = i;
        break;
      }
    }
    return index;
  };

  const index = findIndex();

  const [accessibilityData, setAccessibilityData] = useState(
    layout.layout[index].accessibility
  );

  const displayAccessibility = () => {
    if (showAccessibilityPopup == true) {
      return (
        <AccessibilityPopup
          layout={layout}
          setLayout={setLayout}
          handleHidePopup={handleAccessibilityPopupClose}
          id="dateTimeProperties-handleAccessibilityPopupClose-AccessibilityPopup"
        />
      );
    }
  };

  const today = new Date();
  let in30Days = new Date();
  in30Days.setDate(in30Days.getDate() + 30);
  const [initialDate, setInitialDate] = useState(new Date());
  const [rangeStart, setRangeStart] = useState(new Date());
  const [rangeEnd, setRangeEnd] = useState(new Date());

  useEffect(() => {
    setInitialDate(new Date(element.date));
    setRangeStart(new Date(element.dateRangeStart));
    setRangeEnd(new Date(element.dateRangeEnd));
  }, [element.date, element.dateRangeStart, element.dateRangeEnd]);

  const mandatoryChange = (event) => {
    const value = !element.required;

    const temp = layout.layout.map((item) => {
      if (item.edit) {
        if (item?.stack?.length) {
          const stackTemp = item.stack.filter((stack) => stack.edit === true);
          if (stackTemp?.length) {
            return {
              ...item,
              stack: item.stack?.map((stack) => {
                if (stack.edit) {
                  return {
                    ...stack,
                    required: value,
                  };
                }
                return stack;
              }),
            };
          } else {
            return {
              ...item,
              required: value,
            };
          }
        } else {
          return {
            ...item,
            required: value,
          };
        }
      }
      return item;
    });

    setLayout({ layout: [...temp] });
  };

  const renderDateChange = (val, event) => {
    const temp = layout.layout.map((item) => {
      if (item.edit) {
        if (item?.stack?.length) {
          const stackTemp = item.stack.filter((stack) => stack.edit === true);
          if (stackTemp?.length) {
            return {
              ...item,
              stack: item.stack?.map((stack) => {
                if (stack.edit) {
                  return {
                    ...stack,
                    [event]: val.toISOString(),
                  };
                }
                return stack;
              }),
            };
          } else {
            return {
              ...item,
              [event]: val.toISOString(),
            };
          }
        } else {
          return {
            ...item,
            [event]: val.toISOString(),
          };
        }
      }
      return item;
    });

    setLayout({ layout: [...temp] });

    if (event === "date") {
      setInitialDate(val);
    } else if (event === "dateRangeStart") {
      setRangeStart(val);
    } else {
      setRangeEnd(val);
    }
  };

  const handleDataModelChange = (e) => {
    let value = e.target.value;
    value = value.charAt(0).toLowerCase() + value.slice(1);
    value = value?.replace("java", "");

    const temp = layout.layout.map((item) => {
      if (item.edit) {
        if (item?.stack?.length) {
          const stackTemp = item.stack.filter((stack) => stack.edit === true);
          if (stackTemp?.length) {
            return {
              ...item,
              stack: item.stack?.map((stack) => {
                if (stack.edit) {
                  return {
                    ...stack,
                    processVariableName: value,
                    selectedDataModel: e.target.value?.replace("java", ""),
                  };
                }
                return stack;
              }),
            };
          } else {
            return {
              ...item,
              processVariableName: value,
              selectedDataModel: e.target.value?.replace("java", ""),
            };
          }
        } else {
          return {
            ...item,
            processVariableName: value,
            selectedDataModel: e.target.value?.replace("java", ""),
          };
        }
      }
      return item;
    });

    setLayout({ layout: [...temp] });

    fetchMetaContent(e.target.value);
  };

  const handleDataFieldChange = (e) => {
    let value = element.selectedDataModel;
    value = value.charAt(0).toLowerCase() + value.slice(1);

    const temp = layout.layout.map((item) => {
      if (item.edit) {
        if (item?.stack?.length) {
          const stackTemp = item.stack.filter((stack) => stack.edit === true);
          if (stackTemp?.length) {
            return {
              ...item,
              stack: item.stack?.map((stack) => {
                if (stack.edit) {
                  return {
                    ...stack,
                    processVariableName: `${value}${e.target.value}`,
                    selectedDataField: e.target.value,
                  };
                }
                return stack;
              }),
            };
          } else {
            return {
              ...item,
              processVariableName: `${value}${e.target.value}`,
              selectedDataField: e.target.value,
            };
          }
        } else {
          return {
            ...item,
            processVariableName: `${value}${e.target.value}`,
            selectedDataField: e.target.value,
          };
        }
      }
      return item;
    });

    setLayout({ layout: [...temp] });
  };

  const renderDataModelOptions = () => {
    return dataModels?.map((item) => {
      return (
        <option
          selected={
            item.resourceName === element.selectedDataModel ? true : false
          }
          value={item.resourceName}
        >
          {item.resourceName.replace(".java", "")}
        </option>
      );
    });
  };

  const renderDataFieldOptions = () => {
    return dataFields?.map((item) => {
      return (
        <option
          selected={item.name === element.selectedDataField ? true : false}
          value={item.name}
        >
          {item.name}
        </option>
      );
    });
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
              <label className="secondaryColor">Select Category</label>
              <select>
                <option value="date">Date</option>
              </select>
            </div>
            <div className="form-input">
              <label className="secondaryColor">Field Name </label>
              <input
                type={element.fieldType ? element.fieldType : "text"}
                placeholder={element.fieldName}
                value={element.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                onChange={(e) => {
                  handleChange(e, "fieldName");
                }}
                id="dateTimeProperties-fieldName-input"
              />
            </div>
            {/* <div className="form-checkbox-wrap">
              <label>
                <input
                  type="checkbox"
                  id="selectsRange"
                  checked={element?.selectsRange}
                  onChange={(e) =>
                    placeholderChange(
                      { target: { value: !element.selectsRange } },
                      "selectsRange"
                    )
                  }
                />
                <span>
                  <Icon icon="bx:check" />
                </span>
                <p>Selects Range</p>
              </label>
            </div> */}
            {!element?.selectsRange && (
              <div className="form-checkbox-wrap">
                <label className="secondaryColor">
                  <input
                    type="checkbox"
                    id="useTime"
                    checked={element?.useTime}
                    onChange={(e) =>
                      placeholderChange(
                        { target: { value: !element.useTime } },
                        "useTime"
                      )
                    }
                  />
                  <span className="secondaryColor">
                    <Icon icon="bx:check" />
                  </span>
                  <p className="secondaryColor">Use Time</p>
                </label>
              </div>
            )}
            {element.useTime && (
              <>
                <div className="form-input">
                  <label className="secondaryColor">Time Format</label>
                  <Button
                    className="col-4 d-inline-block text-black border-secondary"
                    onClick={() =>
                      placeholderChange(
                        { target: { value: "hh:mm a" } },
                        "timeFormat"
                      )
                    }
                    style={{
                      backgroundColor:
                        element.timeFormat === "hh:mm a" ? "blue" : "white",
                    }}
                    id="dateTimeProperties-timeFormat12-button"
                  >
                    12 Hrs
                  </Button>
                  <Button
                    className="col-4 d-inline-block text-black border-secondary"
                    onClick={() =>
                      placeholderChange(
                        { target: { value: "hh:mm" } },
                        "timeFormat"
                      )
                    }
                    style={{
                      backgroundColor:
                        element.timeFormat === "hh:mm" ? "blue" : "white",
                    }}
                    id="dateTimeProperties-timeFormat24-button"
                  >
                    24 Hrs
                  </Button>
                </div>
              </>
            )}

            <div className="form-input">
              <label className="secondaryColor">Date Format</label>
              <select
                value={element.dateFormat}
                id="textBoxProperties-fieldType-select"
                onChange={(e) => {
                  placeholderChange(e, "dateFormat");
                }}
              >
                <option selected value="dd MMMM yyyy">
                  DD MMMM YYYY
                </option>
                <option selected value="MMM-yy">
                  MMMM-YY
                </option>
                <option selected value="dd-MM-yy">
                  DD-MM-YY
                </option>
                <option selected value="yyyy-MM">
                  YYYY-MM
                </option>
                <option selected value="MMM/yyyy">
                  MMM/YYYY
                </option>
              </select>
            </div>

            {!element?.selectsRange && (
              <div className="form-input">
                <label className="secondaryColor">Initial value date</label>
                <DatePicker
                  selected={initialDate}
                  onChange={(date) => {
                    renderDateChange(date, "date");
                  }}
                  showTimeSelect={element?.useTime}
                  timeFormat={element.timeFormat}
                  timeIntervals={15}
                  timeCaption="Hour"
                  dateFormat={
                    element.useTime
                      ? element.dateFormat + element.timeFormat
                      : element.dateFormat
                  }
                  todayButton={"Today"}
                  popperPlacement="left"
                  locale="es"
                  id="dateTimeProperties-initialValueDate-DatePicker"
                  // timeClassName={(time) => "text-danger"}
                />
              </div>
            )}

            <div className="form-input">
              <label className="secondaryColor">Range date</label>
              <DatePicker
                selectsStart
                selected={rangeStart}
                onChange={(date) => {
                  renderDateChange(date, "dateRangeStart");
                }}
                dateFormat={element.dateFormat}
                popperPlacement="left"
                id="dateTimeProperties-selectsStart-DatePicker"
              />
              <DatePicker
                selectsEnd
                selected={rangeEnd}
                onChange={(date) => {
                  renderDateChange(date, "dateRangeEnd");
                }}
                dateFormat={element.dateFormat}
                popperPlacement="left"
                id="dateTimeProperties-selectsEnd-DatePicker"
              />
            </div>
            <div className="form-checkbox-wrap">
              <label className="secondaryColor" htmlFor="mandatory">
                <input
                  type="checkbox"
                  id="mandatory"
                  name="form-checkbox"
                  checked={element.required}
                  onChange={mandatoryChange}
                />
                <span className="secondaryColor">
                  <Icon icon="bx:check" />
                </span>
                <p className="secondaryColor">Mandatory</p>
              </label>
            </div>
            <div className="accessibility-wrap">
              <div className="accessibility-head-wrap">
                <h6 className="primaryColor">Accessibility</h6>
                <Link
                to="#"
                  id="dateTimeProperties-explore-link"
                  onClick={handleAccessibilityPopupShow}
                >
                  {t("explore")}
                </Link>
              </div>

              <AccessibilityMiniTable
                tableData={layout.layout[index].accessibility}
              />
            </div>
            <div className="form-input">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <label className="secondaryColor">Process data Variable</label>
                <div
                  style={{
                    height: "25px",
                    width: "110px",
                    display: "inline-block",
                    fontSize: "7px",
                    margin: "0px",
                  }}
                  className="primaryButton primaryButtonColor"
                  onClick={() => setIsClicked(!isClicked)}
                  id="dateTimeProperties-connectToDataModel"
                >
                  Connect to Data Model
                </div>
              </div>

              <input
                type="text"
                placeholder="Enter variable name"
                value={element?.processVariableName}
                onChange={(e) => {
                  placeholderChange(e, "processVariableName");
                }}
                id="dateTimeProperties-enterVariableName-input"
              />
              {isClicked ? (
                <div className="form-input">
                  <label className="secondaryColor">Select a Data Model</label>
                  <select
                    id="dateTimeProperties-dataModel-select"
                    onChange={handleDataModelChange}
                  >
                    <option value="">Select an option</option>
                    {renderDataModelOptions()}
                  </select>
                  <div>
                    <label className="secondaryColor">Select a Data field</label>
                    <select
                      id="dateTimeProperties-dataField-select"
                      onChange={handleDataFieldChange}
                    >
                      <option value="">Select an option</option>
                      {renderDataFieldOptions()}
                    </select>
                  </div>
                </div>
              ) : null}
            </div>
            {/* <div className="text-btn-wrap">
              <Link className="btn btn-blue-border">Calculate/Set Date</Link>
              <Link className="btn btn-blue-border" onClick={handleShow}>
                Pattern Validation/Save
              </Link>
            </div> */}
          </form>
          {displayAccessibility()}
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
            id="dateTimeProperties-handleChange-StyleComponent"
          />
        </div>
      </div>
    </>
  );
};
export default DateTImeProperties;
