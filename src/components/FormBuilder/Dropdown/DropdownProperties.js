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
  const [filterErrorMessage, setFilterErrorMessage] = useState(false);
  const [field, setField] = useState("");
  const [operator, setOperator] = useState("");
  const [value, setValue] = useState("");
  const [label, setLabel] = useState(null);
  const [useSession, setUseSession] = useState(false);
  const [useProcessVariable, setUseProcessVariable] = useState(false);
  const [nestedDataFields, setNestedDataFields] = useState([]);
  const [selectedDataField, setSelectedDataField] = useState([]);
  const [autoPopulateData, setAutoPopulateData] = useState("");

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

  const removeDataModleFields = (data) => {
    const tempdropDownChoices = element.dropdownProperties.filter(
      (item) => item.id != data.id
    );
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
      const randomNum = Math.round(Math.random() * 999999999);
      let tempfilters = element?.filters?.length ? [...element.filters] : [];

      tempfilters.push({
        id: randomNum,
        field,
        operator,
        value,
        useSession,
        useProcessVariable,
      });

      placeholderChange({ target: { value: [...tempfilters] } }, "filters");

      setFilterErrorMessage(false);
      setField("");
      setOperator("");
      setValue("");
    } else {
      setFilterErrorMessage(true);
    }
  };

  const removeFilter = (e, id) => {
    e.preventDefault();
    const tempfilters = element.filters.filter((item) => item.id != id);
    placeholderChange({ target: { value: [...tempfilters] } }, "filters");
  };

  const renderUseSessionValues = () => {
    return (
      <>
        <option value="">Select a session value</option>
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

  const renderFilters = () =>
    element?.filters?.map((item) => (
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

  const handleuseSessionChange = () => {
    setUseSession(!useSession);
    if (useProcessVariable) {
      setUseProcessVariable(false);
    }
  };

  const handleUseProcessVariableChange = () => {
    setUseProcessVariable(!useProcessVariable);
    if (useSession) {
      setUseSession(false);
    }
  };

  const renderValue = () => {
    if (useSession) {
      return (
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
      );
    } else if (useProcessVariable) {
      return (
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
          <option value="">Select a process variable</option>
          {renderUseProcessVariableValues()}
        </select>
      );
    } else {
      return (
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
      );
    }
  };



 // ================================Auto Populate=============

 const renderOperatorAutopop = () =>
 ["="].map((op) => (
   <option value={op}>{op}</option>
 ));

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
                <label
                  className="secondaryColor"
                  style={{ margin: "2px", fontSize: "12px" }}
                >
                  Use Data model
                </label>
              </div>
              <label>Choices</label>
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
                  <>
                    <div className="">
                      <div className="form-input">
                        <label className="secondaryColor">Data Modal </label>

                        <select
                          id="dropdownProperties-dataModel-select"
                          value={element?.selectedDataModel + ".java"}
                          onChange={useDataModelselect}
                        >
                          <option value="">Select a data-modal</option>
                          {renderDataModelOptions()}
                        </select>
                      </div>
                      {isDataModelSelected && (
                        <>
                          {element.choices.length === 0 && (
                            <div>
                              <select
                                id="dropdownProperties-dataField-select"
                                className="d-inline"
                                style={{ width: "40%" }}
                                onChange={valueChange}
                                value={value}
                              >
                                <option value="">Value</option>
                                {renderDataFieldOptions()}
                              </select>

                              <select
                                id="dropdownProperties-dataField-select"
                                className="d-inline"
                                style={{ width: "40%" }}
                                onChange={labelChange}
                                value={label}
                              >
                                <option value="">Label</option>
                                {renderDataFieldOptions()}
                              </select>
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
                          <div className="form-input">
                            <label className="secondaryColor">Filters</label>
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
                                id="dataGridProperties-renderFieldChange-select"
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
                                id="dataGridProperties-renderOperatorChange-select"
                              >
                                <option>Select Operator</option>
                                {renderOperators()}
                              </select>
                              {renderValue()}
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
                            {element.dataGridProperties.filters &&
                              renderFilters()}
                          </div>
                        </>
                      )}
                    </div>
                  </>
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
              {element.useDataModal && isDataModelSelected && (
                <>
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

                  <label
                    className="secondaryColor"
                    htmlFor="useProcessVariable"
                  >
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
                </>
              )}
              <label htmlFor="mandatory">
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
                    <label className="secondaryColor">
                      Select a Data field
                    </label>
                    <select
                      id="dropdownProperties-dataField-select"
                      onChange={handleDataFieldChange}
                    >
                      <label className="secondaryColor" value="">
                        Select an option
                      </label>
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
        <div
          class="tab-pane fade"
          id="pills-autoPopulate"
          role="tabpanel"
          aria-labelledby="pills-autoPopulate-tab"
        >
          <div className="autoPopulate" style={ {padding: "15px"}}>
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
                      {renderOperatorAutopop()}
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

export default DropdownProperties;
