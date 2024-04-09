import React, { useEffect, useState } from "react";
import AccessibilityMiniTable from "../../AccessibilityMiniTable/AccessibilityMiniTable";
import { Link } from "react-router-dom";
import AccessibilityPopup from "../../AccessibilityPopup/AccessibilityPopup";
import axios from "axios";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import ReactTooltip from "react-tooltip";
import { arrayMoveImmutable } from "array-move";
import json5 from "json5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ListProperties = ({
  element,
  layout,
  setLayout,
  handleShow,
  placeholderChange,
}) => {
  // console.log("element",element)
  //for accessibility
  const [showAccessibilityPopup, setShowAccessibilityPopup] = useState(false);
  const handleAccessibilityPopupClose = () => setShowAccessibilityPopup(false);
  const handleAccessibilityPopupShow = () => setShowAccessibilityPopup(true);

  const [isClicked, setIsClicked] = useState(false);

  const [dataModels, setDataModels] = useState(null);

  var [values, setValues] = useState("");

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

  const handleChange = (evt) => {
    setValues(evt.target.value);
    placeholderChange(evt, "fieldName");
    // console.log("evt", evt);
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
          id="dataGridProperties-handleAccessibilityPopupClose-AccessibilityPopup"
        />
      );
    }
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

  const SortableList = SortableContainer(({ data }) => {
    return (
      <div style={{ marginTop: "0px" }}>
        {data?.map((item, index) => {
          // console.log("itemmm",item)
          // if(item.type == "String" || item.type == "Integer" || item.type == "Float" || item.type == "Date")
          return <SortableItem key={index} index={index} value={item.name} />;
        })}
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

  const SortableItem = SortableElement(({ value }) => {
    const required = element.dataGridProperties?.cols?.filter(
      (item) => item.name == value
    );
    // const enitiyEntireData = element.dataGridProperties?.cols?.filter(
    //     (item) => item.name == value
    //   );
    return (
      <div className="form-input">
        <label className="secondaryColor">
          <input
            type="checkbox"
            style={{ height: "15px", width: "15px", display: "inline-block" }}
            checked={required[0].required}
            onChange={() => handleRequiredChange(value, required)}
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
                <span className="secondaryColor" style={{ fontSize: "12px" }}>{value}</span>
              </ReactTooltip>
            )}
          </p>
        </label>
      </div>
    );
  });

  const handleRequiredChange = (value, required) => {
    // console.log("handlecheckbox", value, required[0].isCollection);
    if (required[0].isCollection) {
      toast.error(
        "Selected entity is a Data model. Please create another list for Data Models",
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
      return;
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
            addElementIntoList(
              value,
              required,
              item.dataGridProperties.dataModelName
            );
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
          addElementIntoList(
            value,
            required,
            item.dataGridProperties.dataModelName
          );
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

  const addElementIntoList = (
    dataModelEntity,
    dataModelEntityProperties,
    dataModelFullName
  ) => {
    // console.log(
    //   "entiity to be added",
    //   dataModelEntity,
    //   dataModelEntityProperties,
    //   dataModelFullName
    // );

    if (dataModelEntityProperties[0].isCollection) {
      toast.error(
        "Selected entity is a Data model. Please create another list",
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
      return;
    }

    let elementType;
    let processVariableName;

    let dataModelTableName = dataModelFullName.split(".")[0];
    // console.log("dmn",dataModelTableName)

    processVariableName =
      dataModelTableName + ".0." + dataModelEntityProperties[0].name;
    // console.log("pvn",processVariableName)

    if (dataModelEntityProperties[0].type == "String") {
      elementType = "text";
    } else if (dataModelEntityProperties[0].type == "Integer") {
      elementType = "number";
    } else if (dataModelEntityProperties[0].type == "Date") {
      elementType = "date";
    } else if (dataModelEntityProperties[0].isCollection == true) {
      elementType = "list";
    }

    const randomNum = Math.round(Math.random() * 999999999);
    const today = new Date();
    const date = today.toISOString();

    const currentElement = layout.layout.filter(
      (element) => element.edit === true
    );

    // console.log("currentelem", currentElement);

    const renderWidth = (type) => {
      switch (type) {
        case "section":
          return 24;
        case "dataGrid":
          return 12;
        case "qrcode":
          return 5;
        case "button":
          return 4;
        case "link":
          return 8;
        case "location":
          return 4;
        case "intellisheet":
          return 10;
        case "esign":
          return 4;
        default:
          return 8;
      }
    };

    const renderHeight = (type) => {
      switch (type) {
        case "dataGrid":
          return 5;
        case "qrcode":
          return 4;
        case "location":
          return 4;
        case "intellisheet":
          return 6;
        case "esign":
          return 4;
        default:
          return 1;
      }
    };

    const newItem = {
      x: 0,
      y: 0,
      //   w: renderWidth(temp.elementType),
      w: renderWidth("text"),
      h: renderHeight("text"),
      //   h: renderHeight(temp.elementType),
      i: randomNum,
      id: randomNum,
      //   elementType: temp.elementType,
      elementType: elementType,
      fieldType: "text",
      placeholder: null,
      required: false,
      isWholeNumber: null,
      isDecimalNumber: null,
      edit: false,
      multiSelect: false,
      VAxis: false,
      minChoices: null,
      maxChoices: null,
      choices: [],
      fieldName: dataModelEntityProperties[0].name,
      date: date,
      accessibility: {
        writeUsers: [],
        readUsers: [],
        hideUsers: [],
        writeGroups: [],
        readGroups: [],
        hideGroups: [],
      },
      prefix: null,
      suffix: null,
      dateFormat: null,
      ratingType: null,
      ratingScale: 5,
      rating: null,
      fileType: null,
      minFilesLimit: null,
      maxFilesLimit: null,
      minFileSize: null,
      maxFileSize: null,
      processVariableName: processVariableName,
      minLength: null,
      maxLength: null,
      dateRangeStart: date,
      dateRangeEnd: date,
      dataGridProperties: {
        dataModelName: null,
        cols: [],
        filters: [],
      },
      eSignatureProperties: {
        penColor: null,
        width: null,
        height: null,
      },
      isMathExpression: false,
      actionType: null,
      selectedDataModel: null,
      selectedDataField: null,
      bgColor: null,
      toolTip: null,
    };

    // newItem.y = newItem.y++;

    const layoutTemp = layout.layout.map((element) => {
      if (element.edit == true) {
        let elementTemp = { ...element };
        // console.log("elementtemp", elementTemp);

        elementTemp.listTemplate[`${dataModelEntity}`] =
          dataModelEntityProperties[0].type;
        // elementTemp.listTemplate.test="test"
        // console.log("elemtemp",elementTemp.listTemplate)

        if (!elementTemp.stack) {
          elementTemp.stack = [];
        }

        let checkifAlreadyExists = false;
        let checkifAlreadyExistsIndex;
        elementTemp.stack.map((elem, index) => {
          if (elem.processVariableName == processVariableName) {
            checkifAlreadyExists = true;
            checkifAlreadyExistsIndex = index;
          }
        });

        if (checkifAlreadyExists == false) {
          let maxY = 0;
          elementTemp.stack.map((elem) => {
            if (elem.y > maxY) {
              maxY = elem.y;
            }
          });

          newItem.y = maxY + 1;
          if (newItem.elementType == "list") {
            newItem.stack = [];
          }
          elementTemp.listTemplate[`${dataModelEntity}`] =
            dataModelEntityProperties[0].type;
          elementTemp.stack.push(newItem);
          // if(!(`${processVariableName}` in elementTemp.listTemplate)){
          //   console.log("intoifofdelte")
          //   // delete elementTemp.listTemplate[`${processVariableName}`]
          //   elementTemp.listTemplate[`${processVariableName}`]=""
          // }
          // else if(`${processVariableName}` in elementTemp.listTemplate){
          //   console.log("intoelseifofdelte")
          //   delete elementTemp.listTemplate[`${processVariableName}`]
          // }
          // elementTemp.listTemplate[`${processVariableName}`]=""

          let listNewHeight = element.h + newItem.h;
          elementTemp.h = listNewHeight;
        } else {
          elementTemp.stack.splice(checkifAlreadyExistsIndex, 1);
          delete elementTemp.listTemplate[`${dataModelEntity}`];
        }

        return elementTemp;
      } else {
        // console.log("intooo elseee")
        return element;
      }
    });

    // console.log("settting layout", layoutTemp);
    setLayout({ layout: [...layoutTemp] });
  };

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
    fetchMetaContent(event.target.value);
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

  return (
    <>
      <form>
        <div className="form-input">
          <label className="secondaryColor">Field Name</label>
          <input
            type={element.fieldType ? element.fieldType : "text"}
            placeholder={element.fieldName}
            value={element.fieldName}
            onChange={(e) => {
              handleChange(e, "fieldName");
            }}
            id="dataGridProperties-fieldName-input"
          />
        </div>

        <div className="form-input">
          <label className="secondaryColor">Help Text </label>
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
        {/* <div className="form-input">
          <input
            placeholder="Add Grid Elements"
            type="text"
            id="dataGridProperties-addGridElements-input"
          />
        </div> */}

        <div className="form-input mt-3">
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
          <div className="form-input mt-3">
            <label className="secondaryColor">Please select the columns</label>
            <div className="columnfields px-2">
              <div className="columnname">
                {/* <label>Column</label> */}
                <SortableList
                  data={element.dataGridProperties.cols}
                  onSortEnd={onSortEnd}
                  id="dataGridProperties-onSortEnd-SortableList"
                />
              </div>

              {/* <div className="columnaccessiblilty">
                    <label>Accessibility</label>
                    {element.dataGridProperties.cols.map((cols, index) => (
                      <div className="accitems">
                        <Link
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
                  </div> */}
            </div>
          </div>
        )}

        <div className="accessibility-wrap">
          {/* <div className="accessibility-head-wrap">
            <h6>Accessibility</h6>
            <Link
              onClick={handleAccessibilityPopupShow}
              id="dataGridProperties-explore-link"
            >
              
            </Link>
          </div>
          <div>
            <AccessibilityMiniTable
              tableData={layout.layout[index].accessibility}
            />
          </div> */}
        </div>
        {/* <div className="form-input">
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
              <label>Select a Data Model</label>
              <select
                id="dataGridProperties-dataModel-select"
                onChange={handleDataModelChangeOnForm}
              >
                <option value="">Select an option</option>
                {renderDataModelOptions()}
              </select>
              <div>
                <label>Select a Data field</label>
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
        </div> */}
        {/* <div className="text-btn-wrap">
              <Link className="btn btn-blue-border">Calculate</Link>
              <Link className="btn btn-blue-border" onClick={handleShow}>
                Pattern Validation/Save
              </Link>
            </div> */}
      </form>
      {displayAccessibility()}
    </>
  );
};

export default ListProperties;
