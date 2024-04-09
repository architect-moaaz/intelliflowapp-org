import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import StyleComponent from "../Label/StyleComponent";
import AccessibilityMiniTable from "../../AccessibilityMiniTable/AccessibilityMiniTable";
import AccessibilityPopup from "../../AccessibilityPopup/AccessibilityPopup";
import axios from "axios";
import json5 from "json5";
import { useTranslation } from "react-i18next";
const CheckboxProperties = ({
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
  const [dataModels, setDataModels] = useState(null);
  const [dataFields, setDataFields] = useState([]);
  const [isClicked, setIsClicked] = useState(false);
  const [selectedDataField, setSelectedDataField] = useState([]);
  const [nestedDataFields, setNestedDataFields] = useState([]);


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
          id="checkBoxProperties-handleAccessibilityPopupClose-AccessibilityPopup"
        />
      );
    }
  };

  const [key, setKey] = useState(null);
  const [choice, setChoice] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [showColumn, setShowColumn] = useState("")
  const choiceChange = (e) => {
    setChoice(e.target.value);
  };

  const keyChange = (e) => {
    setKey(e.target.value);
  };

  var [values, setValues] = useState("");

  const handleChange = (evt) => {
    setValues(evt.target.value);
    placeholderChange(evt, "fieldName");
  };

  const handleColumnChange = (e)=>{
    setShowColumn(e.target.value)
    placeholderChange(e, "showDataCols");
  }

  const addChoice = () => {
    const randomNum = Math.round(Math.random() * 999999999);
    const maxChoice = element.maxChoices;

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
    if (element.choices.length == maxChoice - 1) {
      setDisabled(!disabled);
    }
  };

  const onLimitChange = (ev) => {
    const value = ev.target.value;

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
                    minChoices: value,
                  };
                }
                return stack;
              }),
            };
          } else {
            return {
              ...item,
              minChoices: value,
            };
          }
        } else {
          return {
            ...item,
            minChoices: value,
          };
        }
      }
      return item;
    });

    setLayout({ layout: [...temp] });
  };
  const onMaxChange = (ev) => {
    const value = ev.target.value;

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
                    maxChoices: value,
                  };
                }
                return stack;
              }),
            };
          } else {
            return {
              ...item,
              maxChoices: value,
            };
          }
        } else {
          return {
            ...item,
            maxChoices: value,
          };
        }
      }
      return item;
    });

    setLayout({ layout: [...temp] });
    const key = ev.target.id;
    const sign = Math.sign(value);

    if (sign === 1) {
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
                      [key]: value,
                    };
                  }
                  return stack;
                }),
              };
            } else {
              return {
                ...item,
                [key]: value,
              };
            }
          } else {
            return {
              ...item,
              [key]: value,
            };
          }
        }
        return item;
      });

      setLayout({ layout: [...temp] });
    } else {
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
                      [key]: 0,
                    };
                  }
                  return stack;
                }),
              };
            } else {
              return {
                ...item,
                [key]: 0,
              };
            }
          } else {
            return {
              ...item,
              [key]: 0,
            };
          }
        }
        return item;
      });

      setLayout({ layout: [...temp] });
    }
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

    let receivedObj = dataFields?.filter(
      (item) => item.name === e.target.value
    );
    let mandatory;
    if (receivedObj.length) {
      mandatory = receivedObj[0]?.mandatory ? receivedObj[0]?.mandatory : false;
      setSelectedDataField([...receivedObj]);
    } else {
      mandatory = false;
    }
    

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
                    required: mandatory,
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
              required: mandatory,
            };
          }
        } else {
          return {
            ...item,
            processVariableName: `${value}${e.target.value}`,
            selectedDataField: e.target.value,
            required: mandatory,
          };
        }
      }
      return item;
    });

    setLayout({ layout: [...temp] });
    dataFields?.map((field) => {
      if (field?.name === e.target.value)
        if (field?.isCollection) getNestedDataFields(field?.type);
    });
  };
  const handleNestedDataFieldChange = (e) => {
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
                    processVariableName: `${value}${element.selectedDataField}.${e.target.value}`,
                    selectedNestedDataField: e.target.value,
                  };
                }
                return stack;
              }),
            };
          } else {
            return {
              ...item,
              processVariableName: `${value}${element.selectedDataField}.${e.target.value}`,
              selectedNestedDataField: e.target.value,
            };
          }
        } else {
          return {
            ...item,
            processVariableName: `${value}${element.selectedDataField}.${e.target.value}`,
            selectedNestedDataField: e.target.value,
          };
        }
      }
      return item;
    });
    setLayout({ layout: [...temp] });
  };

  const getNestedDataFields = async (val) => {
    console.log("called");
    const postData = {
      workspaceName: localStorage.getItem("workspace"),
      miniAppName: localStorage.getItem("appName"),
      fileName: val,
      fileType: "datamodel",
    };
    await axios
      .post(
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
          "modellerService/fetchFile/meta",
        postData
      )
      .then((res) => {
        const data = res.data.data?.replace(/\.[^/.]+$/, "");
        const jsonData = json5.parse(data);
        setNestedDataFields([...jsonData]);
      })
      .catch((e) => console.log(e.message));
  };


  const renderNestedDataFieldOptions = () => {
    return nestedDataFields?.map((item) => {
      return (
        <option
          selected={
            item.name === element?.selectedNestedDataField ? true : false
          }
          value={item.name}
        >
          {item.name}
        </option>
      );
    });
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
            class="nav-link"
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
                type={element.fieldType ? element.fieldType : "text"}
                placeholder={element.fieldName}
                value={element.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                onChange={(e) => {
                  handleChange(e, "fieldName");
                }}
                id="checkBoxProperties-fieldName-input"
              />
            </div>
            {/* <div className="form-input">
          <label>Label Name </label>
          <input
            type="text"
            placeholder="PlaceHolder"
            value={element.placeholder}
            onChange={(e) => {
              placeholderChange(e, "placeholder");
            }}
          />
        </div> */}
            <div className="form-input">
              <label className="secondaryColor">Help Text </label>
              <input
                placeholder="Please enter help text here"
                id="checkBoxProperties-helpText-input"
                value={element.toolTip}
                onChange={(e) => {
                  placeholderChange(e, "toolTip");
                }}
                type="text"
              />
            </div>
            <div className="form-input">
              <label className="secondaryColor">Show data in </label>
              <input
                placeholder="1 Column"
                type="text"
                id="checkBoxProperties-showDataIn-input"
                onChange={(e) =>{
                  handleColumnChange(e, "showDataCols");
                }}
                value={element?.showDataCols}
              />
            </div>

            <div className="form-input">
              <label className="secondaryColor">Choices</label>
              <div>
                {element.choices?.map((item) => {
                  //   const maxChoice = element.maxChoices
                  //   console.log("maxChoice",maxChoice);
                  //   console.log("Choices",element.choices);
                  //   console.log("Choices length",element.choices.length);
                  //  if (element.choices.length == maxChoice){
                  //     console.log("inside if stmt");

                  //   }
                  //   setDisabled(!disabled);

                  return (
                    <div>
                      <input
                        className="form-control d-inline"
                        id="checkBoxProperties-choiceKey-input"
                        value={item.key}
                        style={{ width: "40%" }}
                      />
                      <input
                        className="form-control d-inline"
                        id="checkBoxProperties-choice-input"
                        value={item.choice}
                        style={{ width: "40%" }}
                      />
                      <label
                        className="d-inline secondaryColor"
                        id="checkBoxProperties-removeChoice-label"
                        onClick={() => removeChoice(item)}
                        style={{ width: "20%", fontSize: 25 }}
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
                  id="checkBoxProperties-key-input"
                  onChange={keyChange}
                  placeholder="Key"
                  style={{ width: "40%" }}
                  disabled={disabled}
                />
                <input
                  disabled={disabled}
                  className="form-control d-inline"
                  value={choice}
                  id="checkBoxProperties-choice-input"
                  onChange={choiceChange}
                  placeholder="Choice"
                  style={{ width: "40%" }}
                />
                <label
                  // disabled={disabled}
                  className="d-inline secondaryColor"
                  id="checkBoxProperties-addChoice-label"
                  onClick={addChoice}
                  style={{ width: "20%", fontSize: 25 }}
                >
                  {" "}
                  +
                </label>
              </div>
            </div>
            <div className="form-input">
              <label className="secondaryColor">Choice Limit</label>
              <div className="col-md-12 m-0 p-0">
                <input
                  type="number"
                  id="minChoices"
                  // disabled={element.multiSelect ? false : true}
                  className="col-6 d-inline-block"
                  style={{ width: "45%" }}
                  placeholder="MIN"
                  value={element.minChoices}
                  onChange={onLimitChange}
                />
                <input
                  // disabled={element.multiSelect ? false : true}
                  disabled={disabled}
                  type="number"
                  id="maxChoices"
                  // disabled={element.multiSelect ? false : true}
                  className="col-6 d-inline-block"
                  style={{ width: "45%" }}
                  placeholder="Max"
                  value={element.maxChoices}
                  onChange={onMaxChange}
                />
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
                  onClick={handleAccessibilityPopupShow}
                  id="checkBoxProperties-accessibility-link"
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
                  id="checkBoxProperties-connectToDataModel-div"
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
                id="checkBoxProperties-processVariableName-input"
              />
              {isClicked ? (
                <div className="form-input">
                  <label className="secondaryColor">Select a Data Model</label>
                  <select
                    id="checkBoxProperties-dataModel-select"
                    onChange={handleDataModelChange}
                  >
                    <option value="">Select an option</option>
                    {renderDataModelOptions()}
                  </select>
                  <div>
                    <label className="secondaryColor">Select a Data field</label>
                    <select
                      id="checkBoxProperties-dataField-select"
                      onChange={handleDataFieldChange}
                    >
                      <option value="">Select an option</option>
                      {renderDataFieldOptions()}
                    </select>
                  </div>
                  {nestedDataFields?.length ? (
                    <div>
                      <label className="secondaryColor">
                        Select a Nested Data field
                      </label>
                      <select
                        id="textBoxProperties-dataField-select"
                        onChange={handleNestedDataFieldChange}
                      >
                        <option value="">Select an option</option>
                        {renderNestedDataFieldOptions()}
                      </select>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>

            {displayAccessibility()}

            {/* <div className="text-btn-wrap">
              <Link  className="btn btn-blue-border">
                Calculate
              </Link>
              <Link  className="btn btn-blue-border" onClick={handleShow}>
                Pattern Validation/Save
              </Link>
            </div>
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
            id="checkBoxProperties-handleChange-StyleComponent"
          />
        </div>
      </div>
    </>
  );
};

export default CheckboxProperties;
