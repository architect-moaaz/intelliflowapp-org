import { Icon } from "@iconify/react";
import axios from "axios";
import json5 from "json5";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AccessibilityMiniTable from "../../AccessibilityMiniTable/AccessibilityMiniTable.js";
import AccessibilityPopup from "../../AccessibilityPopup/AccessibilityPopup.js";
import Formula from "../Formula/Formula";
import StyleComponent from "../Label/StyleComponent";

const TextBoxProperties = ({
  element,
  layout,
  setLayout,
  handleShow,
  placeholderChange,
}) => {
  const [t, i18n] = useTranslation("common");
  const [showAccessibilityPopup, setShowAccessibilityPopup] = useState(false);
  const [autogenerateEnabled, setAutogenerateEnabled] = useState(false);
  const handleAccessibilityPopupClose = () => setShowAccessibilityPopup(false);
  const handleAccessibilityPopupShow = () => setShowAccessibilityPopup(true);
  var [values, setValues] = useState("");
  const [dataModels, setDataModels] = useState(null);
  const [dataFields, setDataFields] = useState([]);
  const [isClicked, setIsClicked] = useState(false);
  const [condition, setCondition] = useState({});
  const [useSession, setUseSession] = useState(false);
  const [useProcessVariable, setUseProcessVariable] = useState(false);
  const [useNullValue, setUseNullValue] = useState();
  const [selectedDataField, setSelectedDataField] = useState([]);
  const [nestedDataFields, setNestedDataFields] = useState([]);
  const [isDataModelSelected, setIsDataModelSelected] = useState(
    element.selectedDataModel ? true : false
  );
  const [value, setValue] = useState("");
  const [filterErrorMessage, setFilterErrorMessage] = useState(false);
  const [field, setField] = useState("");
  const [operator, setOperator] = useState("");
  const [autoPopulateData, setAutoPopulateData] = useState("");

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

  const getNestedDataFields = async (val) => {
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
  console.log("nestedDataFields", nestedDataFields);

  const handleDataFieldChange = (e) => {
    let value = element.selectedDataModel;
    value = value.charAt(0).toLowerCase() + value.slice(1);
    let receivedObj = dataFields?.filter(
      (item) => item.name === e.target.value
    );
    console.log("receivedObj", receivedObj);
    console.log("datafields", dataFields);
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

  const handleFormulaValue = (callback) => {
    const extractTags = (input) => {
      const regex = /@([\w.]+)/g;
      const matches = input?.match(regex);
      return matches || [];
    };
    const value = callback?.replace(/ /g, "");
    const input = extractTags(callback);
    const output = element?.processVariableName;

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
                    formula: [{ formula: value, input: input, output: output }],
                  };
                }
                return stack;
              }),
            };
          } else {
            return {
              ...item,
              formula: [{ formula: value, input: input, output: output }],
            };
          }
        } else {
          return {
            ...item,
            formula: [{ formula: value, input: input, output: output }],
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

  const RenderUseProcessVariableValues = () => {
    let values = [];

    const temp = layout?.layout?.map((ele) => {
      if (ele.id !== element.id) {
        if (ele?.stack?.length) {
          ele.stack.map((stack) => {
            if (stack?.processVariableName) {
              values.push(stack.processVariableName);
            }
          });
        }
        if (ele?.processVariableName) {
          values.push(ele.processVariableName);
        }
      }
    });

    return (
      <>
        {values?.map((val) => (
          <option value={val}>{val}</option>
        ))}
      </>
    );
  };

  const changeCondition = (e, id) => {
    e.preventDefault();
    setCondition((prev) => {
      return {
        ...prev,
        [id]: e.target.value,
      };
    });
  };

  const handleuseSessionChange = () => {
    setCondition((prev) => {
      return {
        ...prev,
        operand2: "",
      };
    });
    setUseSession(!useSession);

    if (useProcessVariable) {
      setUseProcessVariable(false);
    }
    if (useNullValue) {
      setUseNullValue(false);
    }
  };

  const handleUseProcessVariableChange = () => {
    setCondition((prev) => {
      return {
        ...prev,
        operand2: "",
      };
    });
    setUseProcessVariable(!useProcessVariable);

    if (useSession) {
      setUseSession(false);
    }

    if (useNullValue) {
      setUseNullValue(false);
    }
  };

  const handleUseNullValueChange = () => {
    setCondition((prev) => {
      return {
        ...prev,
        operand2: useNullValue ? "" : "no-value",
        operator: useNullValue ? "" : "=",
      };
    });
    setUseNullValue(!useNullValue);
    if (useSession) {
      setUseSession(false);
    }

    if (useProcessVariable) {
      setUseProcessVariable(false);
    }
  };

  const RenderOperators = () =>
    ["=", ">", "<", ">=", "<=", "!="].map((op) => (
      <option value={op}>{op}</option>
    ));

  const RenderNullValueCheckOperator = () => <option value="=">=</option>;

  const renderUseSessionValues = () => {
    return (
      <>
        <option value="">Select a session value</option>
        <option value="_sessionEmployeeName">Logged in Employee Name</option>
        <option value="_sessionEmployeeID">Logged in Employee ID</option>
        <option value="_sessionEmployeeEmail">Logged in Employee Email</option>
      </>
    );
  };

  const renderOperand2 = () => {
    if (useNullValue) {
      return (
        <select id="useNullValue">
          <option>Null</option>
        </select>
      );
    } else {
      if (useSession) {
        return (
          <select
            value={condition.operand2}
            onChange={(e) => changeCondition(e, "operand2")}
            id="useSession"
          >
            {renderUseSessionValues()}
          </select>
        );
      } else if (useProcessVariable) {
        return (
          <select
            value={condition.operand2}
            onChange={(e) => changeCondition(e, "operand2")}
            id="useProcessVariable"
          >
            <option value="">Select a process variable</option>
            <RenderUseProcessVariableValues />
          </select>
        );
      } else {
        return (
          <input
            id="input"
            placeholder="Operand 2"
            value={condition.operand2}
            onChange={(e) => changeCondition(e, "operand2")}
          />
        );
      }
    }
  };

  const addCondition = (e) => {
    e.preventDefault();
    if (
      condition.operand1 &&
      condition.operand2 &&
      condition.operator &&
      condition.result
    ) {
      let temp = element?.conditions?.length ? [...element.conditions] : [];
      temp.push({
        ...condition,
        useSession,
        useProcessVariable,
        useNullValue,
        id: Math.round(Math.random() * 999999999),
      });
      placeholderChange({ target: { value: [...temp] } }, "conditions");
      setCondition({});
      setUseNullValue(false);
      setUseProcessVariable(false);
      setUseSession(false);
    } else {
      toast.error("All Fields are necessary to add condition", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const removeCondition = (e, id) => {
    e.preventDefault();
    let tempArray = element.conditions.filter((con) => con.id !== id);
    if (tempArray.length) {
      placeholderChange({ target: { value: [...tempArray] } }, "conditions");
    } else {
      placeholderChange({ target: { value: [] } }, "conditions");
    }
  };

  const renderConditions = () => {
    return (
      <div>
        {element?.conditions?.length && element?.condition?.length !== 0 ? (
          <label
            className="secondaryColor"
            style={{ fontSize: "20px", margin: "10px" }}
          >
            Conditions defined
          </label>
        ) : null}
        {element?.conditions?.map((con, index) => {
          return (
            <div key={con?.id}>
              <span
                className="secondaryColor"
                style={{
                  marginLeft: "5px",
                  fontSize: "16px",
                  marginRight: "5px",
                }}
              >
                {index + 1}.
              </span>
              <span
                className="secondaryColor"
                style={{
                  marginRight: "5px",
                  fontSize: "16px",
                }}
              >
                {con.operand1}
              </span>
              <span
                className="secondaryColor"
                style={{ marginRight: "5px", fontSize: "16px", color: "red" }}
              >
                {con.operator}
              </span>
              <span
                className="secondaryColor"
                style={{ marginRight: "5px", fontSize: "16px" }}
              >
                {con.operand2}
              </span>
              <span
                className="secondaryColor"
                style={{ marginRight: "5px", fontSize: "16px", color: "blue" }}
              >
                {con.result}
              </span>
              <button
                style={{
                  marginRight: "15px",

                  width: "20px",
                  height: "20px",
                  borderRadius: "17",
                }}
                onClick={(e) => removeCondition(e, con?.id)}
              >
                -
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  // =================================================================AutoPopulate===========================================================

  const renderOperators = () =>
    ["="].map((op) => <option value={op}>{op}</option>);

  const renderFieldChange = (e) => setField(e.target.value);

  const renderOperatorChange = (e) => setOperator(e.target.value);

  const renderValueChange = (e) => setValue(e.target.value);

  const renderAutoPopulateData = () => {
    const autoData = element.autopopulate;
    return autoData?.autoPopulateFields?.map((item) => (
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
          onClick={(e) => removeAutoPopulateData(e, item.id)}
          id="dataGridProperties-removeFilter-button"
        >
          -
        </button>
      </div>
    ));
  };

  const removeAutoPopulateData = (e, id) => {
    e.preventDefault();
    const tempfilters = element.autopopulate;
    tempfilters.autoPopulateFields = tempfilters?.autoPopulateFields?.filter(
      (item) => item.id !== id
    );
    placeholderChange({ target: { value: tempfilters } }, "autopopulate");
  };

  const useAutoPopulateDataModelselect = (e) => {
    const event = { target: { value: e.target.value?.replace(".java", "") } };
    setAutoPopulateData(e.target.value?.replace(".java", ""));
    placeholderChange(event, "selectedDataModel");
    fetchMetaContent(e.target.value);
    setIsDataModelSelected(
      e.target.value === null || e.target.value === "" ? false : true
    );
  };

  const renderUseProcessVariableValues = () => {
    let values = [];

    const temp = layout?.layout?.map((ele) => {
      if (ele.id !== element.id) {
        if (ele?.stack?.length) {
          ele.stack.map((stack) => {
            if (stack?.processVariableName) {
              values.push(stack.processVariableName);
            }
          });
        }
        if (ele?.processVariableName) {
          values.push(ele.processVariableName);
        }
      }
    });

    return (
      <>
        {values?.map((val) => (
          <option value={val}>{val}</option>
        ))}
      </>
    );
  };

  const handleAutoPopulate = (callback) => {
    const id = Math.round(Math.random() * 999999999);
    const temp = layout.layout.map((item) => {
      if (item.edit) {
        if (item?.stack?.length) {
          const stackTemp = item.stack.filter((stack) => stack.edit === true);
          if (stackTemp?.length) {
            return {
              ...item,
              stack: item.stack?.map((stack) => {
                if (stack.edit) {
                  const autoPopulateFields = [
                    ...(stack.autopopulate?.autoPopulateFields || []),
                  ];
                  autoPopulateFields.push({
                    id,
                    value,
                    operator,
                    field,
                  });
                  return {
                    ...stack,
                    autopopulate: {
                      selectedDataModel: autoPopulateData,
                      autoPopulateFields,
                    },
                  };
                }
                return stack;
              }),
            };
          } else {
            const autoPopulateFields = [
              ...(item.autopopulate?.autoPopulateFields || []),
            ];
            autoPopulateFields.push({
              id,
              value,
              operator,
              field,
            });
            return {
              ...item,
              autopopulate: {
                selectedDataModel: autoPopulateData,
                autoPopulateFields,
              },
            };
          }
        } else {
          const autoPopulateFields = [
            ...(item.autopopulate?.autoPopulateFields || []),
          ];
          autoPopulateFields.push({
            id,
            value,
            operator,
            field,
          });
          return {
            ...item,
            autopopulate: {
              selectedDataModel: autoPopulateData,
              autoPopulateFields,
            },
          };
        }
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
        <li class="nav-item" role="presentation">
          <button
            class="nav-link propertiesPopup"
            id="pills-conditions-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-conditions"
            type="button"
            role="tab"
            aria-controls="pills-conditions"
            aria-selected="false"
          >
            Conditions
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link propertiesPopup"
            id="pills-autoPopulate-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-autoPopulate"
            type="button"
            role="tab"
            aria-controls="pills-autoPopulate"
            aria-selected="false"
          >
            Auto Populate
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
                <option value="email">Email</option>
                {/* <option value="richText">Rich Text</option> */}
                <option value="mathExp">Mathematical Expression</option>
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
            <div className="form-input">
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
              <p className="DescriptionLimit secondaryColor">
                {elementTooltipLength}/50
              </p>
            </div>
            <div className="form-input mt-3">
              <label className="secondaryColor">Default Value </label>
              <input
                type="text"
                value={element.defaultValue}
                onChange={(e) => {
                  placeholderChange(e, "defaultValue");
                }}
                id="textBoxProperties-defaultValue-input"
              />
            </div>
            <div className="form-checkbox-wrap">
              <label className="secondaryColor" htmlFor="required">
                <input
                  type="checkbox"
                  id="required"
                  name="form-checkbox"
                  checked={element?.required ?? false}
                  onChange={(e) => {
                    if (selectedDataField.length) {
                      if (!selectedDataField[0].mandatory) {
                        handleCheckValueChange(e);
                      }
                    } else {
                      handleCheckValueChange(e);
                    }
                  }}
                />
                <span className="secondaryColor">
                  <Icon icon="bx:check" />
                </span>
                <p className="secondaryColor">Mandatory</p>
              </label>
              <label className="secondaryColor" htmlFor="disabled">
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
              </label>
              {/* <label htmlFor="scanner">
                <input type="checkbox" id="scanner" name="form-checkbox" />
                <span>
                  <Icon icon="bx:check" />
                </span>
                <p>enable Scanner</p>
              </label> */}
            </div>
            <div className="accessibility-wrap">
              <div className="accessibility-head-wrap">
                <h6 className="primaryColor">Accessibility</h6>
                <Link
                  to="#"
                  id="textBoxProperties-accessibility-link"
                  onClick={handleAccessibilityPopupShow}
                >
                  {t("explore")}
                </Link>
              </div>

              <AccessibilityMiniTable
                tableData={layout.layout[index].accessibility}
              />
            </div>
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

            <div className="autogenerate mt-3">
              <div className="form-checkbox-wrap">
                <label className="secondaryColor" htmlFor="patternValidation">
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
                  <span className="secondaryColor">
                    <Icon icon="bx:check" />
                  </span>
                  <p className="secondaryColor">Pattern Validation</p>
                </label>
              </div>
              {element.patternValidationEnabled &&
                element.patternValidationEnabled == true && (
                  <div className="form-input" style={{ marginTop: -20 }}>
                    <label className="secondaryColor">Pattern</label>
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
                      <label
                        className="secondaryColor"
                        htmlFor="patternCaseSensitivity"
                      >
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
                        <span className="secondaryColor">
                          <Icon icon="bx:check" />
                        </span>
                        <p className="secondaryColor">Case Sensitivity</p>
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
                  <label className="secondaryColor">Select a Data Model</label>
                  <select
                    id="textBoxProperties-dataModel-select"
                    onChange={handleDataModelChange}
                  >
                    <option value="">Select an option</option>
                    {renderDataModelOptions()}
                  </select>
                  <div>
                    <label className="secondaryColor">
                      Select a Data field
                    </label>
                    <select
                      id="textBoxProperties-dataField-select"
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
            <div className="form-input">
              <label className="secondaryColor">Process Input Variable</label>
              <select
                value={element.processInputVariable}
                onChange={changeProcessInputVariable}
                id="textBoxProperties-processInputVariable-select"
              >
                {renderProcessInputVariableOptions()}
              </select>
            </div>
            {/* <div className="text-btn-wrap">
              <Link className="btn btn-blue-border">Calculate</Link>
              <Link className="btn btn-blue-border" onClick={handleShow}>
                Pattern Validation/Save
              </Link>
            </div> */}
            <div className="form-input">
              <label className="secondaryColor">Formula </label>
              <Formula
                layout={layout}
                formula={handleFormulaValue}
                element={element}
              />
            </div>
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
            id="textBoxProperties-handleChange-StyleComponent"
          />
        </div>
        <div
          class="tab-pane fade"
          id="pills-conditions"
          role="tabpanel"
          aria-labelledby="pills-conditions-tab"
        >
          <div>
            <div className="form-checkbox-wrap">
              <label className="secondaryColor" htmlFor="useSession">
                <input
                  type="radio"
                  id="useSession"
                  name="form-radio"
                  checked={useSession}
                  onClick={handleuseSessionChange}
                />
                <span className="secondaryColor">
                  <Icon icon="bx:check" />
                </span>
                <p className="secondaryColor">Use Session</p>
              </label>
              <label className="secondaryColor" htmlFor="useProcessVariable">
                <input
                  type="radio"
                  id="useProcessVariable"
                  name="form-radio"
                  checked={useProcessVariable}
                  onClick={handleUseProcessVariableChange}
                />
                <span className="secondaryColor">
                  <Icon icon="bx:check" />
                </span>
                <p className="secondaryColor">Use Process Variable</p>
              </label>
              <label className="secondaryColor" htmlFor="useNullValue">
                <input
                  type="radio"
                  id="useNullValue"
                  name="form-radio"
                  checked={useNullValue}
                  onClick={handleUseNullValueChange}
                />
                <span className="secondaryColor">
                  <Icon icon="bx:check" />
                </span>
                <p className="secondaryColor">Use Null Value</p>
              </label>
            </div>
            <div className="custom-grid-formbuilder" id="input-wrap">
              <select
                value={condition.operand1}
                onChange={(e) => changeCondition(e, "operand1")}
              >
                <option value="">Operand 1</option>
                <RenderUseProcessVariableValues />
              </select>
              <select
                value={condition.operator}
                onChange={(e) => changeCondition(e, "operator")}
              >
                <option value="">Operator</option>
                {useNullValue ? (
                  <RenderNullValueCheckOperator />
                ) : (
                  <RenderOperators />
                )}
              </select>
              {renderOperand2()}
              <select
                value={condition.result}
                onChange={(e) => changeCondition(e, "result")}
              >
                <option value="">Result</option>
                <option value="disable">Disable</option>
                <option value="hide">Hide</option>
              </select>
              <button onClick={addCondition}>+</button>
            </div>
            <div>{renderConditions()}</div>
          </div>
        </div>
        <div
          class="tab-pane fade"
          id="pills-autoPopulate"
          role="tabpanel"
          aria-labelledby="pills-autoPopulate-tab"
        >
          <div className="autoPopulate" style={{ padding: "15px" }}>
            <div className="form-input">
              <label className="secondaryColor">Data Modal </label>

              <select
                id="autoPopulate-dataModel-select"
                value={element?.selectedDataModel + ".java"}
                onChange={useAutoPopulateDataModelselect}
              >
                <option value="">Select a Data Model</option>
                {renderDataModelOptions()}
              </select>
            </div>
            {isDataModelSelected && (
              <>
                <div className="form-input">
                  <label className="secondaryColor">Auto Populate</label>
                  {filterErrorMessage && (
                    <label style={{ fontSize: "10px", color: "red" }}>
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
                      id="autoPopulate-renderFieldChange-select"
                    >
                      <option value={""}>Select Field</option>
                      {renderDataFieldOptions()}
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
                      id="autoPopulate-renderOperatorChange-select"
                    >
                      <option>Select Operator</option>
                      {renderOperators()}
                    </select>
                    <select
                      style={{
                        width: "26.66%",
                        display: "inline-block",
                        marginRight: "8px",
                        fontSize: "10px",
                      }}
                      value={value}
                      onChange={renderValueChange}
                      id="autoPopulate-renderValueChange-select"
                    >
                      <option value="">Select a process variable</option>
                      {renderUseProcessVariableValues()}
                    </select>
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
                      onClick={handleAutoPopulate}
                      id="autoPopulate-addFilter-button"
                    >
                      +
                    </button>
                  </div>
                  {element.autopopulate && renderAutoPopulateData()}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TextBoxProperties;
