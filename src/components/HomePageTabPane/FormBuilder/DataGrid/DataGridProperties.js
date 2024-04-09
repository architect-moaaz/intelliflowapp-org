import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import json5 from "json5";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";
import { Icon } from "@iconify/react";

import "./DataGrid.css";
import AccessibilityPopup from "../../../AccessibilityPopup/AccessibilityPopup.js";
import AccessibilityMiniTable from "../../../AccessibilityMiniTable/AccessibilityMiniTable.js";
import AccessibilityCol from "../../../AccessibilityCol/AccessibilityCol.js";
import { useTranslation } from "react-i18next";

export default function DataGridProperties({
  element,
  layout,
  setLayout,
  handleShow,
  placeholderChange,
}) {
  const [t, i18n] = useTranslation("common");
  const [showAccessibilityPopup, setShowAccessibilityPopup] = useState(false);
  const [showColAccessibilityPopup, setShowColAccessibilityPopup] =
    useState(false);
  const [dataModels, setDataModels] = useState(null);
  const [field, setField] = useState("");
  const [operator, setOperator] = useState("");
  const [value, setValue] = useState("");
  const handleAccessibilityPopupClose = () => setShowAccessibilityPopup(false);
  const handleAccessibilityPopupShow = () => setShowAccessibilityPopup(true);
  const [useSession, setUseSession] = useState(false);
  const [filterErrorMessage, setFilterErrorMessage] = useState(false);

  const handleColAccessibilityPopupClose = () =>
    setShowColAccessibilityPopup(false);
  const handleColAccessibilityPopupShow = () =>
    setShowColAccessibilityPopup(true);

  useEffect(() => {
    getDataModelList();
  }, []);

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

  const [colAccessibilityDataIndex, setColAccessibilityDataIndex] =
    useState(null);

  const displayAccessibility = () => {
    if (showAccessibilityPopup == true) {
      return (
        <AccessibilityPopup
          layout={layout}
          setLayout={setLayout}
          handleHidePopup={handleAccessibilityPopupClose}
        />
      );
    }
  };

  const displayColAccessibility = () => {
    if (showColAccessibilityPopup == true) {
      return (
        <AccessibilityCol
          layout={layout}
          setLayout={setLayout}
          handleHidePopup={handleColAccessibilityPopupClose}
          colIndex={colAccessibilityDataIndex}
        />
      );
    }
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

            const temp = layout.layout.map((item) => {
              if (item.i === element.i) {
                return {
                  ...item,
                  dataGridProperties: {
                    ...item.dataGridProperties,
                    cols: jsonData?.map((data) => {
                      return {
                        ...data,
                        required: false,
                      };
                    }),
                  },
                };
              }
              return item;
            });
            setLayout({ layout: [...temp] });
          } else {
            const temp = layout.layout.map((item) => {
              if (item.i === element.i) {
                return {
                  ...item,
                  dataGridProperties: {
                    ...item.dataGridProperties,
                    cols: null,
                  },
                };
              }
              return item;
            });
            setLayout({ layout: [...temp] });
          }
        })
        .catch((e) => console.log(e.message));
    } else {
      const temp = layout.layout.map((item) => {
        if (item.i === element.i) {
          return {
            ...item,
            dataGridProperties: {
              ...item.dataGridProperties,
              cols: null,
            },
          };
        }
        return item;
      });
      setLayout({ layout: [...temp] });
    }
  };

  const handleDisplayNameChange = (colName, value) => {
    const temp = layout.layout.map((item) => {
      if (item.i === element.i) {
        return {
          ...item,
          dataGridProperties: {
            ...item.dataGridProperties,
            cols: item.dataGridProperties.cols.map((col) => {
              if (col.name === colName) {
                return {
                  ...col,
                  displayName: value,
                };
              } else {
                if (col.displayName) {
                  return col;
                } else {
                  return {
                    ...col,
                    displayName: col.name
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, function (str) {
                        return str.toUpperCase();
                      }),
                  };
                }
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

  const handleDataModelChange = (event) => {
    const temp = layout.layout.map((item) => {
      if (item.i === element.i) {
        return {
          ...item,
          dataGridProperties: {
            ...item.dataGridProperties,
            dataModelName: event.target.value ? event.target.value : null,
          },
        };
      }
      return item;
    });
    layout.layout = [...temp];
    setLayout(layout);
    fetchMetaContent(event?.target?.value);
  };

  const handleRequiredChange = (value) => {
    const temp = layout.layout.map((item) => {
      if (item.i === element.i) {
        return {
          ...item,
          dataGridProperties: {
            ...item.dataGridProperties,
            cols: item.dataGridProperties?.cols?.map((col) => {
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

  const SortableItem = SortableElement(({ value }) => {
    const required = element.dataGridProperties?.cols?.filter(
      (item) => item.name == value
    );
    return (
      <div className="form-input">
        <label className="secondaryColor">
          <input
            type="checkbox"
            style={{ height: "15px", width: "15px", display: "inline-block" }}
            checked={required[0].required}
            onChange={() => handleRequiredChange(value)}
          />
          <p className="SortableItemDataGrid ellipsis">{value}</p>
        </label>
      </div>
    );
  });

  const SortableList = SortableContainer(({ data }) => {
    return (
      <div style={{ marginTop: "20px" }}>
        {data?.map((item, index) => (
          <SortableItem key={index} index={index} value={item.name} />
        ))}
        <div
          style={{
            backgroundColor: "black",
            height: "1px",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        />
      </div>
    );
  });

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const tempList = arrayMoveImmutable(
      element.dataGridProperties.cols,
      oldIndex,
      newIndex
    );
    const temp = layout.layout.map((item) => {
      if (item.i === element.i) {
        return {
          ...item,
          dataGridProperties: {
            ...item.dataGridProperties,
            cols: tempList,
          },
        };
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
            item.resourceName === element.dataGridProperties.dataModelName
              ? true
              : false
          }
          value={item.resourceName}
        >
          {item.resourceName.replace(".java", "")}
        </option>
      );
    });
  };

  const renderFields = () =>
    element.dataGridProperties?.cols?.map((item) => {
      if (item.required === true) {
        return <option value={item.name}>{item.name}</option>;
      }
    });

  const renderOperators = () =>
    ["=", ">", "<", ">=", "<=", "!=", "like"].map((op) => (
      <option value={op}>{op}</option>
    ));

  const renderFieldChange = (e) => setField(e.target.value);

  const renderOperatorChange = (e) => setOperator(e.target.value);

  const renderValueChange = (e) => setValue(e.target.value);

  const addFilter = (e) => {
    e.preventDefault();
    if (field && operator && value) {
      setFilterErrorMessage(false);
      const randomNum = Math.round(Math.random() * 999999999);
      let tempfilters = element.dataGridProperties.filters ?? [];
      tempfilters.push({
        id: randomNum,
        field,
        operator,
        value,
        useSession: useSession,
      });
      const temp = layout.layout.map((item) => {
        if (item.i === element.i) {
          return {
            ...item,
            dataGridProperties: {
              ...item.dataGridProperties,
              filters: tempfilters,
            },
          };
        } else {
          return item;
        }
      });
      setLayout({ layout: [...temp] });
      setField("");
      setOperator("");
      setValue("");
    } else {
      setFilterErrorMessage(true);
    }
  };

  const removeFilter = (id) => {
    const tempfilters = element.dataGridProperties.filters.filter(
      (item) => item.id != id
    );
    const temp = layout.layout.map((item) => {
      if (item.i === element.i) {
        return {
          ...item,
          dataGridProperties: {
            ...item.dataGridProperties,
            filters: tempfilters,
          },
        };
      } else {
        return item;
      }
    });
    setLayout({ layout: [...temp] });
  };

  const renderFilters = () =>
    element.dataGridProperties?.filters?.map((item) => (
      <div>
        <div
          style={{
            display: "inline-block",
            marginRight: "5px",
          }}
        >
          {item.field}
        </div>
        <div
          style={{
            display: "inline-block",
            marginRight: "5px",
            color: "red",
          }}
        >
          {item.operator}
        </div>
        <div
          style={{
            display: "inline-block",
            marginRight: "5px",
          }}
        >
          {item.value}
        </div>
        <button
        id="data-grid-filter-plus-btn"
          style={{
            display: "inline-block",
            fontSize: "18px",
            width: "25px",
            backgroundColor: "transparent",
            color: "black",
            fontWeight: "bolder",
            border: "1px solid black",
          }}
          onClick={() => removeFilter(item.id)}
        >
          -
        </button>
      </div>
    ));

  const renderUseSessionValues = () => {
    return (
      <>
        <option value="">Select a value</option>
        <option
          selected={"_sessionEmployeeName" === value ? true : false}
          value="_sessionEmployeeName"
        >
          Logged in Employee Name
        </option>
        <option
          selected={"_sessionEmployeeID" === value ? true : false}
          value="_sessionEmployeeID"
        >
          Logged in Employee ID
        </option>
        <option
          selected={"_sessionEmployeeEmail" === value ? true : false}
          value="_sessionEmployeeEmail"
        >
          Logged in Employee Email
        </option>
      </>
    );
  };

  const handleCheckValueChange = (event) => {
    setUseSession((prev) => !prev);
    setValue("");
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
            Data
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
              <label className="secondaryColor">Grid Name</label>
              <input
                id="data-grid-grid-name"
                type={element.fieldType ? element.fieldType : "text"}
                placeholder={element.fieldName}
                value={element.fieldName}
                onChange={(e) => {
                  placeholderChange(e, "fieldName");
                }}
              />
            </div>
            <div className="accessibility-wrap">
              <div className="accessibility-head-wrap">
                <h6 className="primaryColor">Accessibility</h6>
                <button
                  id="data-grid-accessibility-explore-btn"
                  className="explore-btn"
                  onClick={handleAccessibilityPopupShow}
                >
                  {t("explore")}
                </button>
              </div>
              <div>
                <AccessibilityMiniTable
                  tableData={layout.layout[index].accessibility}
                />
              </div>
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
          <form>
            <div className="form-input">
              <label className="secondaryColor">Please select a Data-Model</label>
              <select id="data-grid-data-model-select" onChange={handleDataModelChange}>
                <option value="">Select a Value</option>
                {renderDataModelOptions()}
              </select>
            </div>
            {element.dataGridProperties.cols && (
              <div className="form-input">
                <label className="secondaryColor" id="data-grid-col-prop" >Columns Properties</label>
                <div className="columnfields">
                  <div className="columnname">
                    <label className="secondaryColor">Column</label>
                    <SortableList
                      data={element.dataGridProperties.cols}
                      onSortEnd={onSortEnd}
                    />
                  </div>
                  <div className="displayname">
                    <label  className="secondaryColor" id="data-grid-display-name"> Display Name</label>
                    {element.dataGridProperties.cols.map((cols) => (
                      <>
                        <div className="displayitems">
                          <input
                            id="data-grid-diaplay-input"
                            type="text"
                            placeholder={
                              cols.displayName ? cols.displayName : cols.name
                            }
                            onChange={(e) => {
                              handleDisplayNameChange(
                                cols.name,
                                e.target.value
                              );
                            }}
                          />
                          {/* {handleDisplayNameChange(cols.name,cols.name)} */}
                        </div>
                      </>
                    ))}
                  </div>

                  <div className="columnaccessiblilty">
                    <label className="secondaryColor">Accessibility</label>
                    {element.dataGridProperties.cols.map((cols, index) => (
                      <div className="accitems">
                        <Link
                        to="#"
                          id="data-grid-accessibility-explore-link"
                          onClick={() => {
                            handleColAccessibilityPopupShow();
                            setColAccessibilityDataIndex(index);
                          }}
                        >
                          {t("explore")}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="form-checkbox-wrap">
              <label className="secondaryColor" htmlFor="useSession">
                <input
                  type="checkbox"
                  id="useSession"
                  name="form-checkbox"
                  checked={useSession}
                  onChange={handleCheckValueChange}
                />
                <span className="secondaryColor">
                  <Icon icon="bx:check" />
                </span>
                <p className="secondaryColor">Use Session</p>
              </label>
            </div>

            <div className="form-input">
              <label className="secondaryColor">Filters</label>
              {filterErrorMessage && (
                <label className="secondaryColor" style={{ fontSize: "10px", color: "red" }}>
                  Please add all fields
                </label>
              )}
              <div>
                <select
                  id="data-grid-filter-select"
                  style={{
                    width: "26.66%",
                    display: "inline-block",
                    marginRight: "8px",
                    fontSize: "10px",
                  }}
                  onChange={renderFieldChange}
                  value={field}
                >
                  <option value={""}>Select Field</option>
                  {renderFields()}
                </select>

                <select
                  id="data-grid-filter-select-2"
                  style={{
                    width: "26.66%",
                    display: "inline-block",
                    marginRight: "8px",
                    fontSize: "10px",
                  }}
                  onChange={renderOperatorChange}
                  value={operator}
                >
                  <option>Select Operator</option>
                  {renderOperators()}
                </select>
                {useSession ? (
                  <select
                    id="use-session-select"
                    style={{
                      width: "26.66%",
                      display: "inline-block",
                      marginRight: "8px",
                      fontSize: "10px",
                    }}
                    value={value}
                    onChange={renderValueChange}
                  >
                    {renderUseSessionValues()}
                  </select>
                ) : (
                  <input
                    id="render-value-change-input"
                    style={{
                      width: "26.66%",
                      display: "inline-block",
                      marginRight: "8px",
                    }}
                    placeholder="value"
                    onChange={renderValueChange}
                    value={value}
                  />
                )}
                <button
                  id="data-grid-filter-plus-btn"
                  style={{
                    display: "inline-block",
                    fontSize: "18px",
                    width: "10%",
                    backgroundColor: "transparent",
                    color: "black",
                    fontWeight: "bolder",
                    border: "1px solid black",
                  }}
                  onClick={addFilter}
                >
                  +
                </button>
              </div>
              {element.dataGridProperties.filters && renderFilters()}
            </div>
          </form>
          {displayColAccessibility()}
        </div>
      </div>
    </>
  );
}
