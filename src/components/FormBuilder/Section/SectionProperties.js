import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import StyleComponent from "../Label/StyleComponent";
import AccessibilityMiniTable from "../../AccessibilityMiniTable/AccessibilityMiniTable";
import AccessibilityPopup from "../../AccessibilityPopup/AccessibilityPopup";
import { useTranslation } from "react-i18next";
const SectionProperties = ({
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

  const displayAccessibility = () => {
    if (showAccessibilityPopup == true) {
      return (
        <AccessibilityPopup
          layout={layout}
          setLayout={setLayout}
          handleHidePopup={handleAccessibilityPopupClose}
          id="sectionProperties-handleAccessibilityPopupClose-AccessibilityPopup"
        />
      );
    }
  };

  const mandatoryChange = (event) => {
    const value = !element.required;
    // console.log(value);
    const temp = layout.layout.map((item) => {
      if (item.id === element.id) {
        return {
          ...item,
          required: value,
        };
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
                id="sectionProperties-fieldName-input"
              />
            </div>
            <div className="form-input">
              <label className="secondaryColor">Help Text </label>
              <input
                placeholder="Please enter help text here"
                value={element.toolTip}
                onChange={(e) => {
                  placeholderChange(e, "toolTip");
                }}
                type="text"
                id="sectionProperties-helpText-input"
              />
            </div>
            {/* <div className="form-checkbox-wrap">
              <label htmlFor="mandatory">
                <input
                  type="checkbox"
                  id="mandatory"
                  name="form-checkbox"
                  checked={element.required}
                  onChange={mandatoryChange}
                />
                <span>
                  <Icon icon="bx:check" />
                </span>
                <p>Mandatory</p>
              </label>
              <label htmlFor="scanner">
                <input type="checkbox" id="scanner" name="form-checkbox" />
                <span>
                  <Icon icon="bx:check" />
                </span>
                <p>enable Scanner</p>
              </label>
            </div> */}
            <div className="accessibility-wrap">
              <div className="accessibility-head-wrap">
                <h6 className="primaryColor">Accessibility</h6>
                <Link
                  to="#"
                  id="sectionProperties-accessibility-link"
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
            id="sectionProperties-handleChange-StyleComponent"
          />
        </div>
      </div>
    </>
  );
};

export default SectionProperties;
