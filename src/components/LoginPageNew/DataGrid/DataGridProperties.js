import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import axios from "axios";
import json5 from "json5";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";
import AccessibilityPopup from "../../AccessibilityPopup/AccessibilityPopup.js";
import AccessibilityMiniTable from "../../AccessibilityMiniTable/AccessibilityMiniTable.js";

import "./DataGrid.css";
import { isAccordionItemSelected } from "react-bootstrap/esm/AccordionContext.js";
import AccessibilityCol from "../../AccessibilityCol/AccessibilityCol.js";
import ReactTooltip from "react-tooltip";
import { useTranslation } from "react-i18next";
const DataGridProperties = ({
  element,
  layout,
  setLayout,
  handleShow,
  placeholderChange,
}) => {
  const [showAccessibilityPopup, setShowAccessibilityPopup] = useState(false);
  const [showColAccessibilityPopup, setShowColAccessibilityPopup] =
    useState(false);
  const [dataModels, setDataModels] = useState(null);
  const [dataFields, setDataFields] = useState([]);
  const [field, setField] = useState("");
  const [operator, setOperator] = useState("");
  const [value, setValue] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const [t, i18n] = useTranslation("common");

  useEffect(() => {
    getDataModelList();
  }, []);

  const handleAccessibilityPopupClose = () => setShowAccessibilityPopup(false);
  const handleAccessibilityPopupShow = () => setShowAccessibilityPopup(true);
  const handleColAccessibilityPopupClose = () =>
    setShowColAccessibilityPopup(false);
  const handleColAccessibilityPopupShow = () =>
    setShowColAccessibilityPopup(true);
  // const colHandleAccessibilityPopupshow(index)
  var [values, setValues] = useState("");
  const [useSession, setUseSession] = useState(false);
  const [filterErrorMessage, setFilterErrorMessage] = useState(false);

  const handleChange = (evt) => {
    setValues(evt.target.value);
    placeholderChange(evt, "fieldName");
    // console.log("evt", evt);
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

  const [colAccessibilityDataIndex, setColAccessibilityDataIndex] =
    useState(null);

  // const [colaccessibilityData, setColAccessibilityData] = useState(
  //   layout.layout[index].cols.accessibility
  // );

  const displayAccessibility = () => {
    if (showAccessibilityPopup == true) {
      return (
        <AccessibilityPopup
          layout={layout}
          setLayout={setLayout}
          handleHidePopup={handleAccessibilityPopupClose}
          id="dataGridProperties-handleAccessibilityPopupClose-AccessibilityPopup"
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
          id="dataGridProperties-handleColAccessibilityPopupClose-AccessibilityCol"
        />
      );
    }
  };

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

  const changeFieldType = (ev) => {
    const val = ev.target.value;
    const temp = layout.layout.map((item) => {
      if (item.id === element.id) {
        return {
          ...item,
          fieldType: val,
        };
      }
      return item;
    });
    setLayout({ layout: [...temp] });
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
            // console.log(data);
            const jsonData = json5.parse(data);

            const temp = layout.layout.map((item) => {
              if (item.edit) {
                if (item?.stack?.length) {
                  const stackTemp = item.stack.filter(
                    (stack) => stack.edit === true
                  );
                  if (stackTemp?.length) {
                    return {
                      ...item,
                      stack: item.stack?.map((stack) => {
                        if (stack.edit) {
                          return {
                            ...stack,
                            dataGridProperties: {
                              ...stack.dataGridProperties,
                              cols: jsonData?.map((data) => {
                                return {
                                  ...data,
                                  required: false,
                                };
                              }),
                            },
                          };
                        }
                        return stack;
                      }),
                    };
                  } else {
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
                } else {
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
              }
              return item;
            });

            setLayout({ layout: [...temp] });
          } else {
            const temp = layout.layout.map((item) => {
              if (item.edit) {
                if (item?.stack?.length) {
                  const stackTemp = item.stack.filter(
                    (stack) => stack.edit === true
                  );
                  if (stackTemp?.length) {
                    return {
                      ...item,
                      stack: item.stack?.map((stack) => {
                        if (stack.edit) {
                          return {
                            ...stack,
                            dataGridProperties: {
                              ...stack.dataGridProperties,
                              cols: null,
                            },
                          };
                        }
                        return stack;
                      }),
                    };
                  } else {
                    return {
                      ...item,
                      dataGridProperties: {
                        ...item.dataGridProperties,
                        cols: null,
                      },
                    };
                  }
                } else {
                  return {
                    ...item,
                    dataGridProperties: {
                      ...item.dataGridProperties,
                      cols: null,
                    },
                  };
                }
              }
              return item;
            });

            setLayout({ layout: [...temp] });
          }
        })
        .catch((e) => console.log(e.message));
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
                      dataGridProperties: {
                        ...stack.dataGridProperties,
                        cols: null,
                      },
                    };
                  }
                  return stack;
                }),
              };
            } else {
              return {
                ...item,
                dataGridProperties: {
                  ...item.dataGridProperties,
                  cols: null,
                },
              };
            }
          } else {
            return {
              ...item,
              dataGridProperties: {
                ...item.dataGridProperties,
                cols: null,
              },
            };
          }
        }
        return item;
      });

      setLayout({ layout: [...temp] });
    }
  };

  const fetchMetaContentOnForm = (val) => {
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

  const handleDisplayNameChange = (colName, value) => {
    const temp = layout.layout.map((item) => {
      if (item.id === element.id) {
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
                    dataGridProperties: {
                      ...item.dataGridProperties,
                      dataModelName: event.target.value
                        ? event.target.value
                        : null,
                    },
                  };
                }
                return stack;
              }),
            };
          } else {
            return {
              ...item,
              dataGridProperties: {
                ...item.dataGridProperties,
                dataModelName: event.target.value ? event.target.value : null,
              },
            };
          }
        } else {
          return {
            ...item,
            dataGridProperties: {
              ...item.dataGridProperties,
              dataModelName: event.target.value ? event.target.value : null,
            },
          };
        }
      }
      return item;
    });
    layout.layout = [...temp];
    setLayout(layout);
    // console.log("layout222", layout);
    fetchMetaContent(event.target.value);
  };

  const handleRequiredChange = (value) => {
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
                    dataGridProperties: {
                      ...stack.dataGridProperties,
                      cols: stack.dataGridProperties?.cols?.map((col) => {
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
                }
                return stack;
              }),
            };
          } else {
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
          }
        } else {
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
        }
      }
      return item;
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
            id="dataGridProperties-checkbox-input"
          />
          <p className="secondaryColor"
            style={{
              display: "inline-block",
              marginLeft: "7px",
              fontSize: "12px",
              lineHeight: "5px",
            }}
          >
            <span className="secondaryColor" data-tip data-for={value}>
              {" "}
              {value.length > 8 ? value.substring(0, 8) + "..." : value}
            </span>
            {value.length > 8 && (
              <ReactTooltip
                id={value}
                place="bottom"
                className="tooltipCustom"
                arrowColor="rgba(0, 0, 0, 0)"
                effect="float"
              >
                <span style={{ fontSize: "12px" }}>{value}</span>
              </ReactTooltip>
            )}
          </p>
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
                    dataGridProperties: {
                      ...stack.dataGridProperties,
                      cols: tempList,
                    },
                  };
                }
                return stack;
              }),
            };
          } else {
            return {
              ...item,
              dataGridProperties: {
                ...item.dataGridProperties,
                cols: tempList,
              },
            };
          }
        } else {
          return {
            ...item,
            dataGridProperties: {
              ...item.dataGridProperties,
              cols: tempList,
            },
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
                      dataGridProperties: {
                        ...stack.dataGridProperties,
                        filters: tempfilters,
                      },
                    };
                  }
                  return stack;
                }),
              };
            } else {
              return {
                ...item,
                dataGridProperties: {
                  ...item.dataGridProperties,
                  filters: tempfilters,
                },
              };
            }
          } else {
            return {
              ...item,
              dataGridProperties: {
                ...item.dataGridProperties,
                filters: tempfilters,
              },
            };
          }
        }
        return item;
      });

      setLayout({ layout: [...temp] });
      setField("");
      setOperator("");
      setValue("");
    } else {
      setFilterErrorMessage(true);
    }
  };

  const removeFilter = (e, id) => {
    e.preventDefault();
    const tempfilters = element.dataGridProperties.filters.filter(
      (item) => item.id != id
    );

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
                    dataGridProperties: {
                      ...stack.dataGridProperties,
                      filters: tempfilters,
                    },
                  };
                }
                return stack;
              }),
            };
          } else {
            return {
              ...item,
              dataGridProperties: {
                ...item.dataGridProperties,
                filters: tempfilters,
              },
            };
          }
        } else {
          return {
            ...item,
            dataGridProperties: {
              ...item.dataGridProperties,
              filters: tempfilters,
            },
          };
        }
      }
      return item;
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
          style={{
            display: "inline-block",
            fontSize: "18px",
            width: "25px",
            backgroundColor: "transparent",
            color: "black",
            fontWeight: "bolder",
            border: "1px solid black",
          }}
          onClick={(e) => removeFilter(e, item.id)}
          id="dataGridProperties-removeFilter-button"
        >
          -
        </button>
      </div>
    ));

  const handleDataModelChangeOnForm = (e) => {
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

    fetchMetaContentOnForm(e.target.value);
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

  const handleCheckValueChange = (event) => {
    setUseSession((prev) => !prev);
    setValue("");
  };

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
              <label className="secondaryColor">Field Name</label>
              <input
                type={element.fieldType ? element.fieldType : "text"}
                placeholder={element.fieldName}
                value={element.fieldName}
                onChange={(e) => {
                  placeholderChange(e, "fieldName");
                }}
                id="dataGridProperties-fieldName-input"
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
                id="dataGridProperties-labelName-input"
              />
            </div> */}
            <div className="form-input">
              <label className="secondaryColor">{t("description")} </label>
              <input
                placeholder="Type your name here"
                value={element.toolTip}
                onChange={(e) => {
                  placeholderChange(e, "toolTip");
                }}
                type="text"
                id="dataGridProperties-description-input"
              />
            </div>
            <div className="form-input">
              <input
                placeholder="Add Grid Elements"
                type="text"
                id="dataGridProperties-addGridElements-input"
              />
            </div>

            {/* <div className="form-checkbox-wrap">
              <label htmlFor="mandatory">
                <input type="checkbox" id="mandatory" name="form-checkbox" />
                <span>
                  <Icon icon="bx:check" />
                </span>
                <p>Disable</p>
              </label>
              <label htmlFor="mandatory">
                <input type="checkbox" id="mandatory" name="form-checkbox" />
                <span>
                  <Icon icon="bx:check" />
                </span>
                <p>Add</p>
              </label>
              <label htmlFor="mandatory">
                <input type="checkbox" id="mandatory" name="form-checkbox" />
                <span>
                  <Icon icon="bx:check" />
                </span>
                <p>Delete</p>
              </label>
              <label htmlFor="mandatory">
                <input type="checkbox" id="mandatory" name="form-checkbox" />
                <span>
                  <Icon icon="bx:check" />
                </span>
                <p>upload</p>
              </label>
              <label htmlFor="mandatory">
                <input type="checkbox" id="mandatory" name="form-checkbox" />
                <span>
                  <Icon icon="bx:check" />
                </span>
                <p>Fit To Grid</p>
              </label>
            </div> */}
            <div className="accessibility-wrap">
              <div className="accessibility-head-wrap">
                <h6 className="primaryColor">Accessibility</h6>
                <Link
                to="#"
                  onClick={handleAccessibilityPopupShow}
                  id="dataGridProperties-explore-link"
                >
                  {t("explore")}
                </Link>
              </div>
              <div>
                <AccessibilityMiniTable
                  tableData={layout.layout[index].accessibility}
                />
              </div>
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
                  id="dataGridProperties-connectToDataModel"
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
                id="dataGridProperties-enterVariableName-input"
              />
              {isClicked ? (
                <div className="form-input">
                  <label className="secondaryColor">Select a Data Model</label>
                  <select
                    id="dataGridProperties-dataModel-select"
                    onChange={handleDataModelChangeOnForm}
                  >
                    <option value="">Select an option</option>
                    {renderDataModelOptions()}
                  </select>
                  <div>
                    <label className="secondaryColor">Select a Data field</label>
                    <select
                      id="dataGridProperties-dataField-select"
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
          <form>
            <div className="form-input">
              <label className="secondaryColor">Please select a Data-Model</label>
              <select
                id="dataGridProperties-pleasedataModel-select"
                onChange={handleDataModelChange}
              >
                <option value="">Select a Value</option>
                {renderDataModelOptions()}
              </select>
            </div>
            {element.dataGridProperties.cols && (
              <div className="form-input">
                <label className="secondaryColor">Columns Properties</label>
                <div className="columnfields">
                  <div className="columnname">
                    <label className="secondaryColor">Column</label>
                    <SortableList
                      data={element.dataGridProperties.cols}
                      onSortEnd={onSortEnd}
                      id="dataGridProperties-onSortEnd-SortableList"
                    />
                  </div>
                  <div className="displayname">
                    <label className="secondaryColor"> Display Name</label>
                    {element.dataGridProperties.cols.map((cols) => (
                      <>
                        <div
                          className="displayitems"
                          style={{ height: "36px" }}
                        >
                          <input
                            type="text"
                            placeholder={
                              cols.displayName ? cols.displayName : cols.name
                            }
                            value={
                              cols.displayName ? cols.displayName : cols.name
                            }
                            onChange={(e) => {
                              handleDisplayNameChange(
                                cols.name,
                                e.target.value
                              );
                            }}
                            id="dataGridProperties-displayName-input"
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
                          onClick={() => {
                            handleColAccessibilityPopupShow();
                            setColAccessibilityDataIndex(index);
                          }}
                          id="dataGridProperties-explore-link"
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
                  style={{
                    width: "26.66%",
                    display: "inline-block",
                    marginRight: "8px",
                    fontSize: "10px",
                  }}
                  onChange={renderFieldChange}
                  value={field}
                  id="dataGridProperties-renderFieldChange-select"
                >
                  <option value={""}>Select Field</option>
                  {renderFields()}
                </select>

                <select
                  style={{
                    width: "26.66%",
                    display: "inline-block",
                    marginRight: "8px",
                    fontSize: "10px",
                  }}
                  onChange={renderOperatorChange}
                  value={operator}
                  id="dataGridProperties-renderOperatorChange-select"
                >
                  <option>Select Operator</option>
                  {renderOperators()}
                </select>
                {useSession ? (
                  <select
                    style={{
                      width: "26.66%",
                      display: "inline-block",
                      marginRight: "8px",
                      fontSize: "10px",
                    }}
                    value={value}
                    onChange={renderValueChange}
                    id="dataGridProperties-renderValueChange-select"
                  >
                    {renderUseSessionValues()}
                  </select>
                ) : (
                  <input
                    style={{
                      width: "26.66%",
                      display: "inline-block",
                      marginRight: "8px",
                    }}
                    placeholder="value"
                    onChange={renderValueChange}
                    value={value}
                    id="dataGridProperties-renderValueChange-input"
                  />
                )}
                <button
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
                  id="dataGridProperties-addFilter-button"
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
};

export default DataGridProperties;
