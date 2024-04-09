import React, { useState } from "react";
import StyleComponent from "../Label/StyleComponent";
import "./Tab.css";
import { useTranslation } from "react-i18next";
export default function TabProperties({
  element,
  layout,
  setLayout,
  handleShow,
  placeholderChange,
}) {
  const [values, setValues] = useState("");
  const [tabName, setTabName] = useState(null);
  const [t, i18n] = useTranslation("common");

  const handleChange = (evt) => {
    setValues(evt.target.value);
    placeholderChange(evt, "fieldName");
  };

  const tabNameChange = (e) => {
    e.preventDefault();
    setTabName(e.target.value);
  };

  const addTab = (e) => {
    e.preventDefault();
    const randomNum = Math.round(Math.random() * 999999999);
    let tempTabs = element.tabProperties ?? [];
    tempTabs.push({
      id: randomNum,
      tabName,
      items: [],
    });
    const temp = layout.layout.map((item) => {
      if (item.i === element.i) {
        return {
          ...item,
          tabProperties: [...tempTabs],
        };
      } else {
        return item;
      }
    });
    setLayout({ layout: [...temp] });
    setTabName("");
  };

  const removeTab = (e, item) => {
    e.preventDefault();
    const tempTabList = element.tabProperties.filter(
      (tab) => tab.id !== item.id
    );
    const temp = layout.layout.map((item) => {
      if (item.i === element.i) {
        return {
          ...item,
          tabProperties: [...tempTabList],
        };
      } else {
        return item;
      }
    });
    setLayout({ layout: [...temp] });
  };

  const RenderTabs = ({ tab }) => {
    const [description, setDescription] = useState("");

    const descriptionChange = (e) => {
      e.preventDefault();
      setDescription(e.target.value);
    };

    const addDes = (e) => {
      e.preventDefault();
      const randomNum = Math.round(Math.random() * 999999999);
      const selectedTab = element.tabProperties.filter(
        (item) => item.id === tab.id
      );
      let tempItemList = selectedTab[0].items ?? [];
      tempItemList.push({ description, id: randomNum });
      const temp = layout.layout.map((lay) => {
        if (lay.i === element.i) {
          return {
            ...lay,
            tabProperties: lay.tabProperties.map((item) => {
              if (item.id === tab.id) {
                return {
                  ...item,
                  items: [...tempItemList],
                };
              } else {
                return item;
              }
            }),
          };
        } else {
          return lay;
        }
      });
      setLayout({ layout: [...temp] });
      setDescription("");
    };

    const removeDes = (e, des) => {
      e.preventDefault();
      const selectedTab = element.tabProperties.filter(
        (item) => item.id === tab.id
      );
      let tempItemList = selectedTab[0].items.filter(
        (item) => item.id !== des.id
      );
      const temp = layout.layout.map((lay) => {
        if (lay.i === element.i) {
          return {
            ...lay,
            tabProperties: lay.tabProperties.map((item) => {
              if (item.id === tab.id) {
                return {
                  ...item,
                  items: [...tempItemList],
                };
              } else {
                return item;
              }
            }),
          };
        } else {
          return lay;
        }
      });
      setLayout({ layout: [...temp] });
    };

    return (
      <div key={tab.id}>
        <div style={{ display: "flex" }}>
          <label id="tab-prop-tab-name" className="form-control secondaryColor" style={{ flex: 4 }}>
            {tab.tabName}
          </label>
          <button
            id="tab-name-minus-btn"
            onClick={(e) => removeTab(e, tab)}
            style={{
              flex: 1,
              backgroundColor: "transparent",
              color: "black",
              fontSize: 25,
            }}
          >
            {" "}
            -
          </button>
        </div>
        {tab?.items?.map((des) => {
          return (
            <div key={des.id} style={{ display: "flex" }}>
              <label id="tab-prop-tab-description" className="form-control secondaryColor" style={{ flex: 4 }}>
                {des.description}
              </label>
              <button
                id="tab-prop-tab-desc-minus"
                onClick={(e) => removeDes(e, des)}
                style={{
                  flex: 1,
                  backgroundColor: "transparent",
                  color: "black",
                  fontSize: 25,
                }}
              >
                {" "}
                -
              </button>
            </div>
          );
        })}
        <div style={{ display: "flex" }}>
          <input
            id="tab-prop-desc-input"            
            className="form-control d-inline"
            style={{ flex: 4 }}
            value={description}
            onChange={descriptionChange}
            placeholder={t("description")}
          />
          <button
            id="tab-prop-desc-plus-btn"            
            className="d-inline"
            onClick={addDes}
            style={{
              flex: 1,
              fontSize: 25,
              backgroundColor: "transparent",
              color: "black",
            }}
          >
            {" "}
            +
          </button>
        </div>
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
      </ul>
      <div class="tab-content" id="pills-tabContent">
        <div
          class="tab-pane fade show active"
          id="pills-home"
          role="tabpanel"
          aria-labelledby="pills-home-tab"
        >
          <form style={{ overflow: "hidden" }}>
            <div className="form-input">
              <label className="secondaryColor">Tab Container Header</label>
              <input
                id="tab-header-input"
                type="text"
                placeholder="Tab Container Name"
                value={element.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                onChange={(e) => {
                  handleChange(e, "fieldName");
                }}
              />
            </div>

            <div className="form-input">
              <label className="secondaryColor">Tabs</label>
              <div>
                {element.tabProperties?.map((tab) => (
                  <RenderTabs tab={tab} />
                ))}
              </div>
              <div style={{ display: "flex" }}>
                <input
                 id="tab-tab-name-input"
                  style={{ flex: 4 }}
                  value={tabName}
                  onChange={tabNameChange}
                  placeholder="Tab Name"
                />
                <button
                  id="tab-add-tab-btn"
                  onClick={addTab}
                  style={{
                    flex: 1,
                    fontSize: 25,
                    backgroundColor: "transparent",
                    color: "black",
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* <div className="text-btn-wrap">
              <button className="btn btn-blue-border">Calculate</button>
              <button className="btn btn-blue-border" onClick={handleShow}>
                Pattern Validation/Save
              </button>
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
          />
        </div>
      </div>
    </>
  );
}
