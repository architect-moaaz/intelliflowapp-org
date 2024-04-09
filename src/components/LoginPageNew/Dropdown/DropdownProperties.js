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
import "./DropdownProperties.css";
import axios from "axios";
import json5 from "json5";
import Modal from "react-bootstrap/Modal";
import AccessibilityPopup from "../../AccessibilityPopup/AccessibilityPopup";
import StyleComponent from "../Label/StyleComponent";
import AccessibilityMiniTable from "../../AccessibilityMiniTable/AccessibilityMiniTable";
import { useTranslation } from "react-i18next";

const DropdownProperties = ({
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
  const [isChecked, setIsChecked] = useState(false);
  const [isDataModelSelected, setIsDataModelSelected] = useState(
    element.selectedDataModel ? true : false
  );
  const [dataFieldKey, setDataFieldKey] = useState("");
  const [dataFieldValue, setDataFieldValue] = useState("");

  useEffect(() => {
    getDataModelList();
  }, []);

  const handlleUseDataCheck = (e) => {
    setIsChecked(!isChecked);

    const dummyevent = {
      target: {
        value: element?.useDataModal ? !element?.useDataModal : true,
      },
    };
    placeholderChange(dummyevent, "useDataModal");
  };

  const dataFieldKeyChange = (e) => {
    // console.log("key",e.target.value);
    setDataFieldKey(e.target.value);
  };

  const dataFieldValueChange = (e) => {
    console.log("value", e.target.value);
    setDataFieldValue(e.target.value);
  };

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
          id="dropdownProperties-handleAccessibilityPopupClose-AccessibilityPopup"
        />
      );
    }
  };

  const [value, setValue] = useState(null);
  const [label, setLabel] = useState(null);

  const labelChange = (e) => {
    setLabel(e.target.value);
  };

  const valueChange = (e) => {
    setValue(e.target.value);
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
                      ...stack.choices,
                      { label: label, value: value, id: randomNum },
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
                { label: label, value: value, id: randomNum },
              ],
            };
          }
        } else {
          return {
            ...item,
            choices: [
              ...item.choices,
              { label: label, value: value, id: randomNum },
            ],
          };
        }
      }
      return item;
    });

    setLayout({ layout: [...temp] });
    setLabel("");
    setValue("");
  };

  // const addDataModleFields = (e) => {
  //   e.preventDefault();
  //   console.log("Called");
  //   const randomNum = Math.round(Math.random() * 999999999);
  //   const temp = layout.layout.map((item) => {
  //     if (item.id === element.id) {
  //       let tempDropdownProperties = item?.dropdownProperties
  //         ? [...item?.dropdownProperties]
  //         : [];
  //       tempDropdownProperties.push({
  //         dataModal: element.selectedDataModel,
  //         choices: [
  //           {
  //             key: value,
  //             value: label,
  //             id: randomNum,
  //           },
  //         ],
  //       });
  //       return {
  //         ...item,
  //         dropdownProperties: [...tempDropdownProperties],
  //       };
  //     } else {
  //       return item;
  //     }
  //   });
  //   console.log({ temp });
  //   setLayout({ layout: [...temp] });
  //   setDataFieldKey("");
  //   setDataFieldValue("");
  // };

  const removeDataModleFields = (data) => {
    console.log("data data", data.id);
    const tempdropDownChoices = element.dropdownProperties.filter(
      (item) => item.id != data.id
    );
    console.log("tempdropDownChoices", tempdropDownChoices);
    const temp = layout.layout.map((item) => {
      if (item.id === element.id) {
        return {
          ...item,
          dropdownProperties: [...tempdropDownChoices],
        };
      } else {
        return item;
      }
    });
    setLayout({ layout: [...temp] });
  };

  const changeCategory = (ev) => {
    const value = !element.multiSelect;

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
                    multiSelect: value,
                  };
                }
                return stack;
              }),
            };
          } else {
            return {
              ...item,
              multiSelect: value,
            };
          }
        } else {
          return {
            ...item,
            multiSelect: value,
          };
        }
      }
      return item;
    });

    setLayout({ layout: [...temp] });
  };

  const onMinChange = (ev) => {
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

  const renderChoiceLimitSetter = () => {
    switch (element.multiSelect) {
      case "true":
        return (
          <div className="form-input">
            <label className="secondaryColor">Choice Limit</label>
            <div className="col-md-12 m-0 p-0">
              <input
                disabled={element.multiSelect ? false : true}
                className="col-6 d-inline-block"
                style={{ width: "45%" }}
                placeholder="MIN"
                value={element.minChoices}
                onChange={onMinChange}
                id="dropdownProperties-minlimit-input"
              />
              <input
                disabled={element.multiSelect ? false : true}
                className="col-6 d-inline-block"
                style={{ width: "45%" }}
                placeholder="Max"
                value={element.maxChoices}
                onChange={onMaxChange}
                id="dropdownProperties-maxlimit-input"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
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

  const useDataModelselect = (e) => {
    const event = { target: { value: e.target.value?.replace(".java", "") } };
    placeholderChange(event, "selectedDataModel");
    fetchMetaContent(e.target.value);
    setIsDataModelSelected(
      e.target.value === null || e.target.value === "" ? false : true
    );
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

  const renderChoices = () => {
    return element.choices?.map((item) => {
      return (
        <div>
          <input
            className="form-control d-inline"
            value={item.value}
            style={{ width: "40%" }}
            id="dropdownProperties-value-input"
          />
          <input
            className="form-control d-inline"
            value={item.label}
            style={{ width: "40%" }}
            id="dropdownProperties-label-input"
          />
          <label
            className="d-inline secondaryColor"
            onClick={() => removeChoice(item)}
            style={{ width: "20%", fontSize: 25 }}
            id="dropdownProperties-removeChoice-label"
          >
            {" "}
            -
          </label>
        </div>
      );
    });
  };

  // const renderUseDataChoices = () => {
  //   return element.choices.map((item) => {
  //     return (
  //       <div
  //         style={{
  //           // display: "flex",
  //           width: "100%",
  //           margin: "3px",
  //           marginLeft: 0,
  //         }}
  //       >
  //         <select
  //           id="dropdownProperties-dataField-select"
  //           className="form-control d-inline"
  //           style={{ width: "40%" }}
  //           // onChange={valueChange}
  //           value={item.value}
  //         >
  //           <option value="">Select an option</option>
  //           {renderDataFieldOptions()}
  //         </select>
  //         <select
  //           id="dropdownProperties-dataField-select"
  //           className="form-control d-inline"
  //           style={{ width: "40%" }}
  //           // onChange={labelChange}
  //           value={item.label}
  //         >
  //           <option value="">Select an option</option>
  //           {renderDataFieldOptions()}
  //         </select>
  //         <label
  //           className="d-inline"
  //           onClick={() => removeChoice(item)}
  //           style={{
  //             width: "20%",
  //             fontSize: 25,
  //             paddingLeft: "8px",
  //           }}
  //           id="dropdownProperties-addChoice-label"
  //         >
  //           {" "}
  //           -
  //         </label>
  //       </div>
  //     );
  //   });
  // };

  const renderDataModelOptions = () => {
    return dataModels?.map((item) => {
      return (
        <option value={item.resourceName}>
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

  console.log({ isDataModelSelected });

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
              <select
                id="dropdownProperties-category-select"
                value={element.multiSelect}
                onChange={changeCategory}
              >
                <option value="false">Single</option>
                <option value="true">Multiple</option>
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
                id="dropdownProperties-fieldName-input"
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
                value={element.toolTip}
                onChange={(e) => {
                  placeholderChange(e, "toolTip");
                }}
                type="text"
                id="dropdownProperties-helpText-input"
              />
            </div>
            <div className="form-input">
              <div class="use-data-model-wrap">
                <input
                  style={{ width: "15px", marginRight: "3px" }}
                  className="use-data-model-input"
                  onChange={handlleUseDataCheck}
                  type="checkbox"
                  checked={
                    element?.useDataModal ? element?.useDataModal : false
                  }
                  id="defaultCheck1"
                />
                <label className="secondaryColor" style={{ margin: "2px", fontSize: "12px" }}>
                  Use Data model
                </label>
              </div>
              <label className="secondaryColor">Choices</label>
              {/* {
                isDataModelSelected && element.choices.length === 0 ? (
                  <div className="form-input">
                    <span htmlFor="">No choices Selected </span>
                  </div>
                ) :
                  <div className="">
                  </div>
                } */}
                {renderChoices()}

              {/* {element.choices?.map((item) => {
                return (
                  <div>
                    <input
                      className="form-control d-inline"
                      value={item.value}
                      style={{ width: "40%" }}
                      id="dropdownProperties-value-input"
                    />
                    <input
                      className="form-control d-inline"
                      value={item.label}
                      style={{ width: "40%" }}
                      id="dropdownProperties-label-input"
                    />
                    <label
                      className="d-inline"
                      onClick={() => removeChoice(item)}
                      style={{ width: "20%", fontSize: 25 }}
                      id="dropdownProperties-removeChoice-label"
                    >
                      {" "}
                      -
                    </label>
                  </div>
                );
              })} */}
              <div className="">
                {element.useDataModal ? (
                  <div className="">
                    <div className="form-input">
                      <label className="secondaryColor">Data Modal </label>

                      <select
                        id="dropdownProperties-dataModel-select"
                        value={element?.selectedDataModel + ".java"}
                        onChange={useDataModelselect}
                      >
                        <option value="">Select an option</option>
                        {renderDataModelOptions()}
                      </select>
                    </div>
                    {isDataModelSelected && element.choices.length === 0 ? (
                      <div
                        style={{
                          // display: "flex",
                          width: "90%",
                          margin: "3px",
                          marginLeft: 0,
                        }}
                      >
                        <div className="" style={{ marginBottom: "5px" }}>
                          <label className="secondaryColor" htmlFor="">Key</label>
                          {/* {element?.dropdownProperties ? ():} */}
                          <select
                            id="dropdownProperties-dataField-select"
                            // className="form-control d-inline"
                            style={{ width: "80%" }}
                            onChange={valueChange}
                            value={value}
                          >
                            <option value="">Select an option</option>
                            {renderDataFieldOptions()}
                          </select>
                        </div>
                        <div className="">
                          <label className="secondaryColor" htmlFor="">
                            Label
                          </label>
                          <select
                            id="dropdownProperties-dataField-select"
                            className="d-inline"
                            style={{ width: "80%" }}
                            onChange={labelChange}
                            value={label}
                          >
                            <option value="">Select an option</option>
                            {renderDataFieldOptions()}
                          </select>
                          <label
                            className="d-inline secondaryColor"
                            // onClick={addDataModleFields}
                            onClick={addChoice}
                            style={{
                              width: "20%",
                              fontSize: 12,
                              paddingLeft: "8px",
                              cursor: "pointer",
                              color: "#ff5711",
                            }}
                            id="dropdownProperties-addChoice-label"
                          >
                            {" "}
                            Add
                          </label>
                          {/* {renderUseDataChoices()} */}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div>
                    <input
                      className="form-control d-inline"
                      value={value}
                      onChange={valueChange}
                      placeholder="Key"
                      style={{ width: "40%" }}
                      id="dropdownProperties-valueChange-input"
                    />
                    <input
                      className="form-control d-inline"
                      value={label}
                      onChange={labelChange}
                      placeholder="Label"
                      style={{ width: "40%" }}
                      id="dropdownProperties-labelChange-input"
                    />
                    <label
                      className="d-inline secondaryColor"
                      onClick={addChoice}
                      style={{ width: "20%", fontSize: 25 }}
                      id="dropdownProperties-addChoice-label"
                    >
                      {" "}
                      +
                    </label>
                  </div>
                )}
              </div>
              <div>
                {/* {element.dropdownProperties?.map((item) => {
                  return (
                    <div
                      style={{
                        display: "flex",
                        width: "90%",
                        margin: "3px",
                        marginLeft: 0,
                      }}
                    >
                      <select
                        id="dropdownProperties-dataField-select"
                        className="form-control d-inline"
                        style={{ width: "40%" }}
                        onChange={dataFieldKeyChange}
                      >
                        <option value="">Select an option</option>
                        {renderDataFieldOptions()}
                      </select>
                      <select
                        id="dropdownProperties-dataField-select"
                        className="form-control d-inline"
                        style={{ width: "40%" }}
                        onChange={dataFieldValueChange}
                      >
                        <option value="">Select an option</option>
                        {renderDataFieldOptions()}
                      </select>
                      <label
                        className="d-inline"
                        onClick={removeDataModleFields}
                        style={{
                          width: "20%",
                          fontSize: 25,
                          paddingLeft: "8px",
                        }}
                        id="dropdownProperties-addChoice-label"
                      >
                        {" "}
                        -
                      </label>
                    </div>
                  )
                })} */}
              </div>
            </div>
            {renderChoiceLimitSetter()}
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
                  id="dropdownProperties-Accessibility-link"
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
                  id="dropdownProperties-connectToDataModel"
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
                id="dropdownProperties-variableName-input"
              />
              {isClicked ? (
                <div className="form-input">
                  <label className="secondaryColor">Select a Data Model</label>
                  <select
                    id="dropdownProperties-dataModel-select"
                    onChange={handleDataModelChange}
                  >
                    <option value="">Select an option</option>
                    {renderDataModelOptions()}
                  </select>
                  <div>
                    <label className="secondaryColor">Select a Data field</label>
                    <select
                      id="dropdownProperties-dataField-select"
                      onChange={handleDataFieldChange}
                    >
                      <label value="">Select an option</label>
                      {renderDataFieldOptions()}
                    </select>
                  </div>
                </div>
              ) : null}
            </div>
            {/* <div className="text-btn-wrap">
              <Link className="btn btn-blue-border">Calculate</Link>
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
            id="dropdownProperties-handleChange-StyleComponent"
          />
        </div>
      </div>
    </>
  );
};

export default DropdownProperties;
