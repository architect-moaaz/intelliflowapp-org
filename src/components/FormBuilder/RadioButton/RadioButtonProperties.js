import { Icon } from "@iconify/react";
import axios from "axios";
import json5 from "json5";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  Form,
  Row,
} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AccessibilityMiniTable from "../../AccessibilityMiniTable/AccessibilityMiniTable";
import AccessibilityPopup from "../../AccessibilityPopup/AccessibilityPopup";
import StyleComponent from "../Label/StyleComponent";

const RadioButtonProperties = ({
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
  const [nestedDataFields, setNestedDataFields] = useState([]);
  const [selectedDataField, setSelectedDataField] = useState([]);
  const [isDataModelSelected, setIsDataModelSelected] = useState(
    element.selectedDataModel ? true : false
  );
  const [value, setValue] = useState("");
  const [filterErrorMessage, setFilterErrorMessage] = useState(false);
  const [field, setField] = useState("");
  const [operator, setOperator] = useState("");
  const [autoPopulateData, setAutoPopulateData] = useState("");

  const [condition, setCondition] = useState({});
  const [useSession, setUseSession] = useState(false);
  const [useProcessVariable, setUseProcessVariable] = useState(false);
  const [useNullValue, setUseNullValue] = useState();

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

    let receivedObj = dataFields?.filter(
      (item) => item.name === e.target.value
    );
    console.log("receivedObjreceivedObj", receivedObj);
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

  console.log("nestedDataFields", nestedDataFields);

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
              <label className="secondaryColor">Choices</label>
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
                    <label className="secondaryColor">
                      Select a Data field
                    </label>
                    <select
                      id="radioButtonProperties-dataField-select"
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
                      <RenderUseProcessVariableValues />
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

export default RadioButtonProperties;