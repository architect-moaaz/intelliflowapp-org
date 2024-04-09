import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import AccessibilityPopup from "../../AccessibilityPopup/AccessibilityPopup.js";
import AccessibilityMiniTable from "../../AccessibilityMiniTable/AccessibilityMiniTable.js";
import StyleComponent from "../Label/StyleComponent";
import axios from "axios";
import json5 from "json5";

const TextBoxProperties = ({
  element,
  layout,
  setLayout,
  handleShow,
  placeholderChange,
}) => {
  const [showAccessibilityPopup, setShowAccessibilityPopup] = useState(false);
  const [autogenerateEnabled, setAutogenerateEnabled] = useState(false);
  const handleAccessibilityPopupClose = () => setShowAccessibilityPopup(false);
  const handleAccessibilityPopupShow = () => setShowAccessibilityPopup(true);
  var [values, setValues] = useState("");
  const [dataModels, setDataModels] = useState(null);
  const [dataFields, setDataFields] = useState([]);
  const [isClicked, setIsClicked] = useState(false);

  const [elementTooltipLength, setElementTooltipLength] = useState(
    element.toolTip?.length ? element.toolTip.length : 0
  );

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

  // const handleConnect = () => {
  //   changeProcessDataVariable(selectedDataField);
  //   setOpenProcessModal(!openProcessModal);
  // };

  const handleChange = (evt, key) => {
    setValues(evt.target.value);
    placeholderChange(evt, "fieldName");
  };

  const handleChanges = (evt, key) => {
    if (key !== null) placeholderChange(evt, key);
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
          id="textBoxProperties-handleAccessibilityPopupClose-AccessibilityPopup"
        />
      );
    }
  };

  const handleCheckValueChange = (event) => {
    const id = event.target.id;
    const value = element[id] ?? false;

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
                    [id]: !value,
                  };
                }
                return stack;
              }),
            };
          } else {
            return {
              ...item,
              [id]: !value,
            };
          }
        } else {
          return {
            ...item,
            [id]: !value,
          };
        }
      }
      return item;
    });

    setLayout({ layout: [...temp] });
  };

  const changeFieldType = (ev) => {
    const val = ev.target.value;

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
                    fieldType: val,
                  };
                }
                return stack;
              }),
            };
          } else {
            return {
              ...item,
              fieldType: val,
            };
          }
        } else {
          return {
            ...item,
            fieldType: val,
          };
        }
      }
      return item;
    });

    setLayout({ layout: [...temp] });
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

  const changeProcessDataVariable = (value) => {
    const temp = layout.layout.map((item) => {
      if (item.id === element.id) {
        return {
          ...item,
          processVariableName: value,
        };
      }
      return item;
    });
    setLayout({ layout: [...temp] });
  };

  const handlePatternValidationFieldChange = (ev) => {
    const val = ev.target.value;

    const temp = layout.layout.map((item) => {
      if (item.edit) {
        if (item?.stack?.length) {
          const stackTemp = item.stack.filter((stack) => stack.edit === true);
          if (stackTemp?.length) {
            return {
              ...item,
              stack: item.stack?.map((stack) => {
                if (stack.edit) {
                  if (stack.patternValidationEnabled) {
                    return {
                      ...stack,
                      patternValidationEnabled: !stack.patternValidationEnabled,
                    };
                  } else {
                    return {
                      ...stack,
                      patternValidationEnabled: true,
                    };
                  }
                }
                return stack;
              }),
            };
          } else {
            if (item.patternValidationEnabled) {
              return {
                ...item,
                patternValidationEnabled: !item.patternValidationEnabled,
              };
            } else {
              return {
                ...item,
                patternValidationEnabled: true,
              };
            }
          }
        } else {
          if (item.patternValidationEnabled) {
            return {
              ...item,
              patternValidationEnabled: !item.patternValidationEnabled,
            };
          } else {
            return {
              ...item,
              patternValidationEnabled: true,
            };
          }
        }
      }
      return item;
    });

    setLayout({ layout: [...temp] });
  };

  const handlePatternValidationCaseSensitivity = (ev) => {
    const val = ev.target.value;

    const temp = layout.layout.map((item) => {
      if (item.edit) {
        if (item?.stack?.length) {
          const stackTemp = item.stack.filter((stack) => stack.edit === true);
          if (stackTemp?.length) {
            return {
              ...item,
              stack: item.stack?.map((stack) => {
                if (stack.edit) {
                  if (stack.patternCaseSensitivity) {
                    return {
                      ...stack,
                      patternCaseSensitivity: !stack.patternCaseSensitivity,
                    };
                  } else {
                    return {
                      ...stack,
                      patternCaseSensitivity: true,
                    };
                  }
                }
                return stack;
              }),
            };
          } else {
            if (item.patternCaseSensitivity) {
              return {
                ...item,
                patternCaseSensitivity: !item.patternCaseSensitivity,
              };
            } else {
              return {
                ...item,
                patternCaseSensitivity: true,
              };
            }
          }
        } else {
          if (item.patternCaseSensitivity) {
            return {
              ...item,
              patternCaseSensitivity: !item.patternCaseSensitivity,
            };
          } else {
            return {
              ...item,
              patternCaseSensitivity: true,
            };
          }
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

  const handleRequiredChange = (value) => {
    const temp = layout.layout.map((item) => {
      if (item.id === element.id) {
        return {
          ...item,
          dataGridProperties: {
            ...item.dataGridProperties,
            cols: item.dataGridProperties.cols.map((col) => {
              if (col.name === value) {
                return {
                  ...col,
                  required: !col.required,
                };
              } else {
                return col;
              }
            }),
          },
        };
      } else {
        return item;
      }
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

  const renderProcessInputVariableOptions = () => {
    return (
      <>
        <option value="">Select a value</option>
        <option
          selected={
            "_sessionEmployeeName" === element?.processInputVariable
              ? true
              : false
          }
          value="_sessionEmployeeName"
        >
          Logged in Employee Name
        </option>
        <option
          selected={
            "_sessionEmployeeID" === element?.processInputVariable
              ? true
              : false
          }
          value="_sessionEmployeeID"
        >
          Logged in Employee ID
        </option>
        <option
          selected={
            "_sessionEmployeeEmail" === element?.processInputVariable
              ? true
              : false
          }
          value="_sessionEmployeeEmail"
        >
          Logged in Employee Email
        </option>
      </>
    );
  };

  const changeProcessInputVariable = (e) => {
    e.preventDefault();
    placeholderChange(e, "processInputVariable");
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
              <label className="secondaryColor">Field Type </label>
              <select
                value={element.fieldType}
                id="textBoxProperties-fieldType-select"
                onChange={changeFieldType}
              >
                <option selected value="text">
                  Text
                </option>
                {/* <option value="email">Email</option> */}
                {/* <option value="richText">Rich Text</option> */}
                {/* <option value="mathExp">Mathematical Expression</option> */}
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
                id="textBoxProperties-fieldName-input"
              />
            </div>
            <div className="form-input">
              <label className="secondaryColor">Placeholder Name </label>
              <input
                type="text"
                placeholder="Place your text here"
                value={element.placeholder}
                onChange={(e) => {
                  placeholderChange(e, "placeholder");
                }}
                id="textBoxProperties-placeholder-input"
              />
            </div>
            {/* <div className="form-input">
              <label className="secondaryColor">Help Text </label>
              <input
                placeholder="Please enter help text here"
                maxLength="50"
                value={element?.toolTip}
                onChange={(e) => {
                  placeholderChange(e, "toolTip");
                  setElementTooltipLength(e.target.value.length);
                }}
                type="text"
                id="textBoxProperties-helpText-input"
              />
              <p className="DescriptionLimit">{elementTooltipLength}/50</p>
            </div> */}
            {/* <div className="form-input mt-3">
              <label className="secondaryColor">Default Value </label>
              <input
                type="text"
                value={element.defaultValue}
                onChange={(e) => {
                  placeholderChange(e, "defaultValue");
                }}
                id="textBoxProperties-defaultValue-input"
              />
            </div> */}
            <div className="form-checkbox-wrap">
              <label className="secondaryColor" htmlFor="required">
                <input
                  type="checkbox"
                  id="required"
                  name="form-checkbox"
                  checked={true}
                  onChange={handleCheckValueChange}
                />
                <span className="secondaryColor">
                  <Icon icon="bx:check" />
                </span>
                <p className="secondaryColor">Mandatory</p>
              </label>
              {/* <label htmlFor="disabled">
                <input
                  type="checkbox"
                  id="disabled"
                  name="form-checkbox"
                  checked={element?.disabled ?? false}
                  onChange={handleCheckValueChange}
                />
                <span className="secondaryColor">
                  <Icon icon="bx:check" />
                </span>
                <p className="secondaryColor">Disabled</p>
              </label>
              <label className="secondaryColor" htmlFor="hidden">
                <input
                  type="checkbox"
                  id="hidden"
                  name="form-checkbox"
                  checked={element?.hidden ?? false}
                  onChange={handleCheckValueChange}
                />
                <span className="secondaryColor">
                  <Icon icon="bx:check" />
                </span>
                <p className="secondaryColor">Hidden</p>
              </label> */}
              {/* <label htmlFor="scanner">
                <input type="checkbox" id="scanner" name="form-checkbox" />
                <span>
                  <Icon icon="bx:check" />
                </span>
                <p>enable Scanner</p>
              </label> */}
            </div>
            {/* <div className="accessibility-wrap">
              <div className="accessibility-head-wrap">
                <h6>Accessibility</h6>
                <Link
                  id="textBoxProperties-accessibility-link"
                  onClick={handleAccessibilityPopupShow}
                >
                  
                </Link>
              </div>

              <AccessibilityMiniTable
                tableData={layout.layout[index].accessibility}
              />
            </div> */}
            {/* <div className="autogenerate">
              <div className="form-checkbox-wrap">
                <label htmlFor="autogenerate">
                  <input
                    type="checkbox"
                    id="autogenerate"
                    name="form-checkbox"
                    checked={autogenerateEnabled}
                    onChange={() =>
                      setAutogenerateEnabled(!autogenerateEnabled)
                    }
                  />
                  <span>
                    <Icon icon="bx:check" />
                  </span>
                  <p>Autogenerate</p>
                </label>
              </div>
              <ul className="">
                <li>
                  <div className="form-input">
                    <label>Prefix </label>
                    <input
                      type={element.fieldType ? element.fieldType : "text"}
                      placeholder={element.prefix}
                      disabled={!autogenerateEnabled}
                      value={element.prefix}
                      onChange={(e) => {
                        placeholderChange(e, "prefix");
                      }}
                    />
                  </div>
                </li>
                <li>
                  <div className="form-input">
                    <label>Suffix </label>
                    <input
                      type={element.fieldType ? element.fieldType : "text"}
                      placeholder={element.suffix}
                      disabled={!autogenerateEnabled}
                      value={element.suffix}
                      onChange={(e) => {
                        placeholderChange(e, "suffix");
                      }}
                    />
                  </div>
                </li>
                <li>
                  <div className="form-input">
                    <label>Starts From </label>
                    <input
                      type="text"
                      disabled={!autogenerateEnabled}
                      value={element.startsFrom}
                      onChange={(e) => {
                        placeholderChange(e, "startsFrom");
                      }}
                    />
                  </div>
                </li>
              </ul>
            </div> */}

            {/* <div className="autogenerate mt-3">
              <div className="form-checkbox-wrap">
                <label htmlFor="patternValidation">
                  <input
                    type="checkbox"
                    id="patternValidation"
                    name="form-checkbox"
                    checked={
                      element.patternValidationEnabled
                        ? element.patternValidationEnabled
                        : false
                    }
                    onChange={(e) => handlePatternValidationFieldChange(e)}
                  />
                  <span>
                    <Icon icon="bx:check" />
                  </span>
                  <p>Pattern Validation</p>
                </label>
              </div>
              {element.patternValidationEnabled &&
                element.patternValidationEnabled == true && (
                  <div className="form-input" style={{ marginTop: -20 }}>
                    <label>Pattern</label>
                    <input
                      placeholder="Enter your pattern here"
                      value={element.pattern}
                      onChange={(e) => {
                        let evt = e;
                        evt.target.value = e.target.value;
                        placeholderChange(evt, "pattern");
                      }}
                      type="text"
                      id="textBoxProperties-pattern-input"
                    />
                    <div className="form-checkbox-wrap mt-1">
                      <label htmlFor="patternCaseSensitivity">
                        <input
                          type="checkbox"
                          id="patternCaseSensitivity"
                          name="form-checkbox"
                          checked={
                            element.patternCaseSensitivity
                              ? element.patternCaseSensitivity
                              : false
                          }
                          onChange={(e) =>
                            handlePatternValidationCaseSensitivity(e)
                          }
                        />
                        <span>
                          <Icon icon="bx:check" />
                        </span>
                        <p>Case Sensitivity</p>
                      </label>
                    </div>
                  </div>
                )}
            </div>
            <div className="form-input">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <label>Process data Variable</label>
                <div
                  style={{
                    height: "25px",
                    width: "110px",
                    display: "inline-block",
                    fontSize: "7px",
                    margin: "0px",
                  }}
                  className="primaryButton"
                  onClick={() => setIsClicked(!isClicked)}
                  id="textBoxProperties-connectToDataModel"
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
                id="textBoxProperties-processVariableName-input"
              />
              {isClicked ? (
                <div className="form-input">
                  <label>Select a Data Model</label>
                  <select
                    id="textBoxProperties-dataModel-select"
                    onChange={handleDataModelChange}
                  >
                    <option value="">Select an option</option>
                    {renderDataModelOptions()}
                  </select>
                  <div>
                    <label>Select a Data field</label>
                    <select
                      id="textBoxProperties-dataField-select"
                      onChange={handleDataFieldChange}
                    >
                      <option value="">Select an option</option>
                      {renderDataFieldOptions()}
                    </select>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="form-input">
              <label>Process Input Variable</label>
              <select
                value={element.processInputVariable}
                onChange={changeProcessInputVariable}
                id="textBoxProperties-processInputVariable-select"
              >
                {renderProcessInputVariableOptions()}
              </select>
            </div> */}
            {/* <div className="text-btn-wrap">
              <Link className="btn btn-blue-border">Calculate</Link>
              <Link className="btn btn-blue-border" onClick={handleShow}>
                Pattern Validation/Save
              </Link>
            </div> */}
          </form>

          {/* {displayAccessibility()} */}
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
            id="textBoxProperties-handleChange-StyleComponent"
          />
        </div>
      </div>
    </>
  );
};

export default TextBoxProperties;
