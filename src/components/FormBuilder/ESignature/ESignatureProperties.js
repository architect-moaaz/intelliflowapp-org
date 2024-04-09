import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import SignaturePad from "react-signature-canvas";
import axios from "axios";
import json5 from "json5";
import { toast } from "react-toastify";
import StyleComponent from "../Label/StyleComponent";
import AccessibilityMiniTable from "../../AccessibilityMiniTable/AccessibilityMiniTable";
import AccessibilityPopup from "../../AccessibilityPopup/AccessibilityPopup";
import "./ESignature.css";
import { useTranslation } from "react-i18next";
const ESignatureProperties = ({
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
  const [sigPad, setSigPad] = useState({});
  const [color, setColor] = useState("black");
  const colors = [
    "black",
    "blue",
    "white",
    "red",
    "green",
    "yellow",
    "orange",
    "grey",
  ];
  var [values, setValues] = useState("");
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
          id="eSignatureProperties-handleAccessibilityPopupClose-AccessibilityPopup"
        />
      );
    }
  };

  const handleChange = (evt) => {
    setValues(evt.target.value);
    placeholderChange(evt, "fieldName");
  };

  const clear = () => {
    sigPad.clear();
  };

  const capture = () => {
    const signData = sigPad.getTrimmedCanvas().toDataURL("image/png");
    var file = dataURLtoFile(signData, element.filename ?? "signature.txt");
    var bodyFormData = new FormData();
    bodyFormData.append("file", file);
    const miniAppName = localStorage.getItem("appName");
    axios
      .post(
        `${
          process.env.REACT_APP_CDS_ENDPOINT + miniAppName
        }/upload?Authorization=${localStorage.getItem(
          "token"
        )}&workspace=${localStorage.getItem("workspace")}`,
        bodyFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      )
      .then((res) => {
        toast.success("Signature Uploaded Successfully", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        const temp = layout.layout.map((item) => {
          if (item.id === element.id) {
            return {
              ...item,
              signatureDataUrl: res.data.file.filename,
            };
          }
          return item;
        });
        setLayout({ layout: [...temp] });
      })
      .catch((e) => {
        // console.log(e);
        toast.error("Signature Upload Fail", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  const dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };

  const handleESignaturePropertiesChange = (e) => {
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
                    eSignatureProperties: {
                      ...stack.eSignatureProperties,
                      [e.target.id]: e.target.value,
                    },
                  };
                }
                return stack;
              }),
            };
          } else {
            return {
              ...item,
              eSignatureProperties: {
                ...item.eSignatureProperties,
                [e.target.id]: e.target.value,
              },
            };
          }
        } else {
          return {
            ...item,
            eSignatureProperties: {
              ...item.eSignatureProperties,
              [e.target.id]: e.target.value,
            },
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
              <label className="secondaryColor">Field Name </label>
              <input
                type={element.fieldType ? element.fieldType : "text"}
                placeholder={element.fieldName}
                value={element.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                onChange={(e) => {
                  handleChange(e, "fieldName");
                }}
                id="eSignatureProperties-fieldName-input"
              />
            </div>
            {/* <div className="form-input">
              <label>Label Name </label>
              <input
                type="text"
                placeholder="Label Name"
                value={element.placeholder}
                onChange={(e) => {
                  placeholderChange(e, "placeholder");
                }}
                id="eSignatureProperties-labelName-input"
              />
            </div> */}
            {/* <div className="form-input">
              <label>E Signature</label>
              <select id="eSignatureProperties-signature-select" className="selectpicker">
                <option value="">Select Signature</option>
              </select>
            </div> */}

            <div className="form-input">
              <label className="secondaryColor">Select Pen color</label>
              <select
                id="penColor"
                className="selectpicker"
                value={element.eSignatureProperties.penColor}
                onChange={handleESignaturePropertiesChange}
              >
                <option value="">Select Color</option>
                {colors.map((item) => (
                  <option value={item}>{item.toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div className="form-input">
              <label className="secondaryColor">Width of the Signature</label>
              <input
                id="width"
                type="text"
                placeholder="In Pixels"
                value={element.eSignatureProperties.width}
                onChange={handleESignaturePropertiesChange}
              />
            </div>

            <div className="form-input">
              <label className="secondaryColor">Height of the Signature</label>
              <input
                id="height"
                type="text"
                placeholder="In Pixels"
                value={element.eSignatureProperties.height}
                onChange={handleESignaturePropertiesChange}
              />
            </div>

            <div className="form-input">
              <label className="secondaryColor">
                ** Please Resize the element on the canvas if you wish to
                provide custom width and height to the Element
              </label>
            </div>

            {/* <div>
              <SignaturePad
                canvasProps={{
                  className: "sigPad",
                  width: 250,
                  height: 200,
                }}
                ref={(ref) => {
                  setSigPad(ref);
                }}
                penColor={color}
              />
             
              <div>
                <button
                  type="button"
                  class="btn buttons m-2 p-1"
                  onClick={clear}
                >
                  Clear Board
                </button>
                <button
                  type="button"
                  class="btn buttons m-2 p-1"
                  onClick={capture}
                >
                  Capture
                </button>
              </div>
            </div> */}

            <div className="accessibility-wrap">
              <div className="accessibility-head-wrap">
                <h6 className="primaryColor">Accessibility</h6>
                <Link
                to="#"
                  id="eSignatureProperties-Accessibility-link"
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
                  id="eSignatureProperties-connectToDataModel"
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
                id="eSignatureProperties-variableName-input"
              />
              {isClicked ? (
                <div className="form-input">
                  <label className="secondaryColor">Select a Data Model</label>
                  <select
                    id="eSignatureProperties-dataModel-select"
                    onChange={handleDataModelChange}
                  >
                    <option value="">Select an option</option>
                    {renderDataModelOptions()}
                  </select>
                  <div>
                    <label className="secondaryColor">Select a Data field</label>
                    <select
                      id="eSignatureProperties-dataField-select"
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
              <Link className="btn btn-blue-border">Calculate</Link>
              <Link className="btn btn-blue-border" onClick={handleShow}>
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
            id="eSignatureProperties-handleChange-StyleComponent"
          />
        </div>
      </div>
    </>
  );
};

export default ESignatureProperties;
