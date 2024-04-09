import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import StyleComponent from "../Label/StyleComponent";

import Multiselect from "multiselect-react-dropdown";
import AccessibilityMiniTable from "../../AccessibilityMiniTable/AccessibilityMiniTable";
import AccessibilityPopup from "../../AccessibilityPopup/AccessibilityPopup";
import axios from "axios";
import json5 from "json5";
import { useTranslation } from "react-i18next";
const FileUploadProperties = ({
  element,
  handleShow,
  placeholderChange,
  layout,
  setLayout,
}) => {
    const [t, i18n] = useTranslation("common");
  //Need Clarification on what options we have to provide
  const [options, setOptions] = useState(["pdf", "docx", "jpg"]);

  const [showAccessibilityPopup, setShowAccessibilityPopup] = useState(false);
  const handleAccessibilityPopupClose = () => setShowAccessibilityPopup(false);
  const handleAccessibilityPopupShow = () => setShowAccessibilityPopup(true);

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

  const findIndex = () => {
    let index;
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

  const [selectedFileTypes, setSelectedFileTypes] = useState(
    element?.allowedFileTypes
  );

  const displayAccessibility = () => {
    if (showAccessibilityPopup == true) {
      return (
        <AccessibilityPopup
          layout={layout}
          setLayout={setLayout}
          handleHidePopup={handleAccessibilityPopupClose}
          id="fileUploadProperties-handleAccessibilityPopupClose-AccessibilityPopup"
        />
      );
    }
  };

  const onMinLimitChange = (ev) => {
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
                    minFilesLimit: value,
                  };
                }
                return stack;
              }),
            };
          } else {
            return {
              ...item,
              minFilesLimit: value,
            };
          }
        } else {
          return {
            ...item,
            minFilesLimit: value,
          };
        }
      }
      return item;
    });

    setLayout({ layout: [...temp] });
  };

  const onMaxLimitChange = (ev) => {
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
                    maxFilesLimit: value,
                  };
                }
                return stack;
              }),
            };
          } else {
            return {
              ...item,
              maxFilesLimit: value,
            };
          }
        } else {
          return {
            ...item,
            maxFilesLimit: value,
          };
        }
      }
      return item;
    });

    setLayout({ layout: [...temp] });
  };

  const onMinSizeChange = (ev) => {
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
                    minFileSize: value,
                  };
                }
                return stack;
              }),
            };
          } else {
            return {
              ...item,
              minFileSize: value,
            };
          }
        } else {
          return {
            ...item,
            minFileSize: value,
          };
        }
      }
      return item;
    });

    setLayout({ layout: [...temp] });
  };

  const onMaxSizeChange = (ev) => {
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
                    maxFileSize: value,
                  };
                }
                return stack;
              }),
            };
          } else {
            return {
              ...item,
              maxFileSize: value,
            };
          }
        } else {
          return {
            ...item,
            maxFileSize: value,
          };
        }
      }
      return item;
    });

    setLayout({ layout: [...temp] });
  };
  const onMandateChange = (ev) => {
    const value = !element.required;
    console.log(value);
    const temp = layout.layout.map((item) => {
      if (item.id === element.id) {
        return {
          ...item,
          required: value,
        };
      } else {
        return item;
      }
    });
    setLayout({ layout: [...temp] });
  };

  var [values, setValues] = useState("");

  const handleChange = (evt) => {
    setValues(evt.target.value);
    placeholderChange(evt, "fieldName");
  };

  const updateAllowedFileTypes = (event) => {
    setSelectedFileTypes(event);
    let layoutTemp = layout;
    // layoutTemp.layout.forEach((e) => {
    //   if (e.edit == true) {
    //     e.allowedFileTypes = event;
    //   }
    // });

    layoutTemp.layout.forEach((lay) => {
      if (lay.edit) {
        if (lay.stack.length) {
          lay.stack.forEach((stack) => {
            if (stack.edit) {
              stack.allowedFileTypes = event;
            }
          });
        } else {
          lay.allowedFileTypes = event;
        }
      }
    });
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
                id="fileUploadProperties-fieldName-input"
              />
            </div>
            {/* <div className="form-input">
          <label>Label Name</label>

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
              <label className="secondaryColor">Help Text</label>

              <input
                type="text"
                placeholder="Please enter help text here"
                value={element.toolTip}
                onChange={(e) => {
                  placeholderChange(e, "toolTip");
                }}
                id="fileUploadProperties-helpText-input"
              />
            </div>
            <div className="form-input">
              <label className="secondaryColor">Allowed file type</label>
            </div>

            <Multiselect
              isObject={false}
              // onKeyPressFn={function noRefCheck() {}}
              onRemove={(event) => updateAllowedFileTypes(event)}
              // onSearch={function noRefCheck() {}}
              onSelect={(event) => updateAllowedFileTypes(event)}
              options={options}
              showCheckbox
              selectedValues={selectedFileTypes}
              placeholder={
                selectedFileTypes?.length == 0 ? "pdf,docx,text" : ""
              }
              style={{
                chips: {
                  background: "#0D3C84",
                  borderRadius: 5,
                  fontWeight: "100",
                  fontSize: "12px",
                },
                multiselectContainer: {
                  color: "#000",
                },
                searchBox: {
                  border: "1px solid #E5E5E5",
                  bordeRadius: "0px",
                },
              }}
              id="fileUploadProperties-Multiselect"
            />

            <div className="form-input">By deafult all files are accepted</div>
          
            <div className="form-input">
              <label className="secondaryColor">File upload limit</label>
              <div className="col-md-12 m-0 p-0">
                {/* <input
                  className="col-6 d-inline-block"
                  style={{ width: "45%" }}
                  placeholder="MIN"
                  value={element.minFilesLimit}
                  onChange={onMinLimitChange}
                  id="fileUploadProperties-minfileUploadLimit-input"
                /> */}
                <input
                  className="col-6 d-inline-block"
                  style={{ width: "45%" }}
                  placeholder="Max"
                  value={element.maxFilesLimit}
                  onChange={onMaxLimitChange}
                  id="fileUploadProperties-maxfileUploadLimit-input"
                />
              </div>
            </div>
            <div className="form-input">
              <label className="secondaryColor">File size</label>
              <div className="col-6 d-inline-block">
                <input
                  className="col-6 d-inline-block"
                  // style={{ width: "45%" }}
                  placeholder="MIN"
                  value={element.minFileSize}
                  onChange={onMinSizeChange}
                  id="fileUploadProperties-minFileSize-input"
                />
                <select className="col-4 d-inline-block">
                  <option>KB</option>
                  <option>MB</option>
                </select>
              </div>
              <div className="col-6 d-inline-block">
                <input
                  className="col-6 d-inline-block"
                  // style={{ width: "45%" }}
                  placeholder="MAX"
                  value={element.maxFileSize}
                  onChange={onMaxSizeChange}
                  id="fileUploadProperties-maxFileSize-input"
                />
                <select className="col-4 d-inline-block">
                  <option>KB</option>
                  <option>MB</option>
                </select>
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
                  id="fileUploadProperties-Accessibility-link"
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
                  className="primaryButton"
                  onClick={() => setIsClicked(!isClicked)}
                  id="fileUploadProperties-connectToDataModel"
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
                id="fileUploadProperties-variableName-input"
              />
              {isClicked ? (
                <div className="form-input">
                  <label className="secondaryColor">Select a Data Model</label>
                  <select
                    id="fileUploadProperties-dataModel-select"
                    onChange={handleDataModelChange}
                  >
                    <option value="">Select an option</option>
                    {renderDataModelOptions()}
                  </select>
                  <div>
                    <label className="secondaryColor">Select a Data field</label>
                    <select
                      id="fileUploadProperties-dataField-select"
                      onChange={handleDataFieldChange}
                    >
                      <option value="">Select an option</option>
                      {renderDataFieldOptions()}
                    </select>
                  </div>
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
            id="fileUploadProperties-handleChange-StyleComponent"
          />
        </div>
      </div>
    </>
  );
};

export default FileUploadProperties;
