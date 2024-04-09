import React, { useState, useEffect } from "react";
import axios from "axios";
import AccessibilityPopup from "../../../AccessibilityPopup/AccessibilityPopup.js";
import AccessibilityMiniTable from "../../../AccessibilityMiniTable/AccessibilityMiniTable.js";
import StyleComponent from "../Label/StyleComponent";
import { useTranslation } from "react-i18next";
export default function ActionProperties({
  element,
  layout,
  setLayout,
  handleShow,
  placeholderChange,
}) {
  const [t, i18n] = useTranslation("common");
  const [values, setValues] = useState("");
  const [workflows, setWorkflows] = useState(null);
  const [showAccessibilityPopup, setShowAccessibilityPopup] = useState(false);
  const handleAccessibilityPopupClose = () => setShowAccessibilityPopup(false);
  const handleAccessibilityPopupShow = () => setShowAccessibilityPopup(true);

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

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = () => {
    const postData = {
      workspaceName: localStorage.getItem("workspace"),
      miniAppName: localStorage.getItem("appName"),
    };
    axios
      .post(
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
          "modellerService/getResources",
        postData,
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((res) => {
        if (!res.data.data.bpmn[0]) return;
        setWorkflows([...res.data.data.bpmn]);
      })
      .catch((e) => console.log(e.message));
  };

  const handleChange = (evt) => {
    setValues(evt.target.value);
    placeholderChange(evt, "fieldName");
  };

  const handleDataModelChange = (event) => {
    const temp = layout.layout.map((item) => {
      if (item.i === element.i) {
        return {
          ...item,
          workflowName: event.target.value,
        };
      }
      return item;
    });
    layout.layout = [...temp];
    setLayout(layout);
  };

  const renderDataModelOptions = () => {
    return workflows?.map((item) => {
      return (
        <option
          selected={
            item.resourceName === element.dataGridProperties.dataModelName
              ? true
              : false
          }
          value={item.resourceName}
        >
          {item.resourceName.replace(".bpmn", "")}
        </option>
      );
    });
  };

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
              <label className="secondaryColor secondaryButtonColor">
                Button/Action Name
              </label>
              <input
                id="action-name-input"
                type="text"
                placeholder="Action Name"
                value={element.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                onChange={(e) => {
                  handleChange(e, "fieldName");
                }}
              />
            </div>
            <div className="form-input">
              <label className="secondaryColor">Please select a WorkFlow</label>
              <select
                id="action-select-workflow"
                value={element.workflowName}
                onChange={handleDataModelChange}
              >
                <option value="">Select a Value</option>
                {renderDataModelOptions()}
              </select>
            </div>

            <div className="form-input">
              <label className="secondaryColor">Button Color</label>
              <input
                type="color"
                id="buttonProperties-buttonColor-input"
                value={element.bgColor}
                onChange={(e) => {
                  placeholderChange(e, "bgColor");
                }}
              />
            </div>

            <div className="accessibility-wrap">
              <div className="accessibility-head-wrap">
                <h6 className="primaryColor">Accessibility</h6>
                <button
                  id="action-prop-explore-btn"
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
              <button className="btn btn-blue-border">Calculate</button>
              <button className="btn btn-blue-border" onClick={handleShow}>
                Pattern Validation/Save
              </button>
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
            id="buttonProperties-handleChange-StyleComponent"
          />
        </div>
      </div>
    </>
  );
}
