import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import {
  Dropdown,
  Row,
  Col,
  Container,
  Form,
  Card,
  DropdownButton,
} from "react-bootstrap";
import axios from "axios";
import json5 from "json5";
import Modal from "react-bootstrap/Modal";
import AccessibilityPopup from "../../AccessibilityPopup/AccessibilityPopup";
import AccessibilityMiniTable from "../../AccessibilityMiniTable/AccessibilityMiniTable";
import StyleComponent from "../Label/StyleComponent";
import { useTranslation } from "react-i18next";
const RadioButtonProperties = ({
  element,
  layout,
  setLayout,
  handleShow,
  placeholderChange,
}) => {
  const [showAccessibilityPopup, setShowAccessibilityPopup] = useState(false);
  const [t, i18n] = useTranslation("common");
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
          id="radioButtonProperties-handleAccessibilityPopupClose-AccessibilityPopup"
        />
      );
    }
  };

  const [key, setKey] = useState(null);
  const [choice, setChoice] = useState(null);

  const choiceChange = (e) => {
    setChoice(e.target.value);
  };
  const keyChange = (e) => {
    setKey(e.target.value);
  };

  const addChoice = () => {
    const randomNum = Math.round(Math.random() * 999999999);

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
                    choices: [
                      ...item.choices,
                      { choice: choice, key: key, id: randomNum },
                    ],
                  };
                }
                return stack;
              }),
            };
          } else {
            return {
              ...item,
              choices: [
                ...item.choices,
                { choice: choice, key: key, id: randomNum },
              ],
            };
          }
        } else {
          return {
            ...item,
            choices: [
              ...item.choices,
              { choice: choice, key: key, id: randomNum },
            ],
          };
        }
      }
      return item;
    });

    setLayout({ layout: [...temp] });
    setChoice("");
    setKey("");
  };

  const onMandateChange = (ev) => {
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

  const removeChoice = (data) => {
    const tempChoices = element.choices.filter((item) => item.id != data.id);

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
                    choices: [...tempChoices],
                  };
                }
                return stack;
              }),
            };
          } else {
            return {
              ...item,
              choices: [...tempChoices],
            };
          }
        } else {
          return {
            ...item,
            choices: [...tempChoices],
          };
        }
      }
      return item;
    });

    setLayout({ layout: [...temp] });
  };

  const changeAxis = (ev) => {
    const value = !element.VAxis;

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
                    VAxis: value,
                  };
                }
                return stack;
              }),
            };
          } else {
            return {
              ...item,
              VAxis: value,
            };
          }
        } else {
          return {
            ...item,
            VAxis: value,
          };
        }
      }
      return item;
    });

    setLayout({ layout: [...temp] });
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
              <label className="secondaryColor">Field Name</label>
              <input
                type="text"
                placeholder={element.fieldName}
                value={element.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                onChange={(e) => {
                  handleChange(e, "fieldName");
                }}
                id="radioButtonProperties-fieldName-input"
              />
            </div>
            <div className="form-input">
              <label className="secondaryColor">Show data in</label>

              <select
                value={element.VAxis}
                id="radioButtonProperties-showDataIn-select"
                onChange={changeAxis}
              >
                <option value="false">Horizontal</option>
                <option value="true">Vertical</option>
              </select>
            </div>

            <div className="form-input">
              <label>Choices</label>
              <div>
                {element.choices?.map((item) => {
                  return (
                    <div>
                      <input
                        className="form-control d-inline"
                        value={item.key}
                        style={{ width: "40%" }}
                        id="radioButtonProperties-itemkey-input"
                      />
                      <input
                        className="form-control d-inline"
                        value={item.choice}
                        style={{ width: "40%" }}
                        id="radioButtonProperties-itemchoice-input"
                      />
                      <label
                        className="d-inline secondaryColor"
                        onClick={() => removeChoice(item)}
                        style={{ width: "20%", fontSize: 25 }}
                        id="radioButtonProperties-removeChoice-label"
                      >
                        {" "}
                        -
                      </label>
                    </div>
                  );
                })}
              </div>
              <div>
                <input
                  className="form-control d-inline"
                  value={key}
                  onChange={keyChange}
                  placeholder="Key"
                  style={{ width: "40%" }}
                  id="radioButtonProperties-key-input"
                />
                <input
                  className="form-control d-inline"
                  value={choice}
                  onChange={choiceChange}
                  placeholder="Choice"
                  style={{ width: "40%" }}
                  id="radioButtonProperties-choice-input"
                />
                <label
                  className="d-inline secondaryColor"
                  onClick={addChoice}
                  style={{ width: "20%", fontSize: 25 }}
                  id="radioButtonProperties-addChoice-label"
                >
                  {" "}
                  +
                </label>
              </div>
            </div>
            <div className="form-checkbox-wrap">
              <label className="secondaryColor" htmlFor="mandatory">
                <input
                  type="checkbox"
                  id="mandatory"
                  name="form-checkbox"
                  checked={element.required}
                  onChange={onMandateChange}
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
                  id="radioButtonProperties-accessibility-link"
                  onClick={handleAccessibilityPopupShow}
                >
                  {t("explore")}
                </Link>
              </div>

              <AccessibilityMiniTable
                tableData={layout.layout[index].accessibility}
              />
            </div>

            {displayAccessibility()}

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
                  id="radioButtonProperties-connectToDataModel"
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
                id="radioButtonProperties-processVariableName-input"
              />
              {isClicked ? (
                <div className="form-input">
                  <label className="secondaryColor">Select a Data Model</label>
                  <select
                    id="radioButtonProperties-dataModel-select"
                    onChange={handleDataModelChange}
                  >
                    <option value="">Select an option</option>
                    {renderDataModelOptions()}
                  </select>
                  <div>
                    <label className="secondaryColor">Select a Data field</label>
                    <select
                      id="radioButtonProperties-dataField-select"
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
              <Link  className="btn btn-blue-border">
                Calculate
              </Link>
              <Link  className="btn btn-blue-border" onClick={handleShow}>
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
            id="radioButtonProperties-handleChange-StyleComponent"
          />
        </div>
      </div>
    </>
  );
};

export default RadioButtonProperties;
