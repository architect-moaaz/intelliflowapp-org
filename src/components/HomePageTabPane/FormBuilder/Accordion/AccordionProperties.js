import React, { useState } from "react";
import StyleComponent from "../Label/StyleComponent";
import "../Tab/Tab.css";
import { useTranslation } from "react-i18next";

export default function AccordionProperties({
  element,
  layout,
  setLayout,
  handleShow,
  placeholderChange,
}) {
  const [values, setValues] = useState("");
  const [accordionName, setAccordionName] = useState("");
  const [t, i18n] = useTranslation("common");

  const handleChange = (evt) => {
    setValues(evt.target.value);
    placeholderChange(evt, "fieldName");
  };

  const accordionNameChange = (e) => {
    e.preventDefault();
    setAccordionName(e.target.value);
  };

  const addAccord = (e) => {
    e.preventDefault();
    const randomNum = Math.round(Math.random() * 999999999);
    let tempItems = element.accordionProperties ?? [];
    tempItems.push({ accordionName, items: [], id: randomNum });
    const temp = layout.layout.map((item) => {
      if (item.i === element.i) {
        return {
          ...item,
          accordionProperties: [...tempItems],
        };
      } else {
        return item;
      }
    });
    setLayout({ layout: [...temp] });
    setAccordionName("");
  };

  const removeAccord = (e, data) => {
    e.preventDefault();
    let tempItems = element.accordionProperties.filter(
      (item) => item.id !== data.id
    );
    const temp = layout.layout.map((item) => {
      if (item.i === element.i) {
        return {
          ...item,
          accordionProperties: tempItems ? [...tempItems] : [],
        };
      } else {
        return item;
      }
    });
    setLayout({ layout: [...temp] });
  };

  const RenderAccordion = ({ item }) => {
    const [description, setDescription] = useState("");

    const descriptionChange = (e) => {
      e.preventDefault();
      setDescription(e.target.value);
    };

    const addDes = (e) => {
      e.preventDefault();
      const randomNum = Math.round(Math.random() * 999999999);
      const selectedAccord = element.accordionProperties.filter(
        (acc) => acc.id === item.id
      );
      let tempItemList = selectedAccord[0].items ?? [];
      tempItemList.push({ description, id: randomNum });
      const temp = layout.layout.map((lay) => {
        if (lay.i === element.i) {
          return {
            ...lay,
            accordionProperties: lay.accordionProperties.map((acc) => {
              if (acc.id === item.id) {
                return {
                  ...acc,
                  items: [...tempItemList],
                };
              } else {
                return acc;
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
      const selectedAccord = element.accordionProperties.filter(
        (acc) => acc.id === item.id
      );
      let tempItemList = selectedAccord[0].items.filter(
        (item) => item.id !== des.id
      );
      const temp = layout.layout.map((lay) => {
        if (lay.i === element.i) {
          return {
            ...lay,
            accordionProperties: lay.accordionProperties.map((acc) => {
              if (acc.id === item.id) {
                return {
                  ...acc,
                  items: [...tempItemList],
                };
              } else {
                return acc;
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
      <div key={item.id}>
        <div style={{ display: "flex" }}>
          <label id="accordion-prop-acc-name" className="form-control secondaryColor" style={{ flex: 4 }}>
            {item.accordionName}
          </label>
          <button
            id="accord-remove-accord-btn"
            onClick={(e) => removeAccord(e, item)}
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
        {item?.items?.map((des) => {
          return (
            <div key={des.id} style={{ display: "flex" }}>
              <label  id="acc-desc-label" className="form-control secondaryColor" style={{ flex: 4 }}>
                {des.description}
              </label>
              <button
                id="acc-remove-desc-btn"
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
            id="acc-desc-input"
            className="form-control d-inline"
            style={{ flex: 4 }}
            value={description}
            onChange={descriptionChange}
            placeholder={t("description")}
          />
          <button
            id="acc-add-desc-btn"
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
              <label className="secondaryColor">Accordion Container Name</label>
              <input
                id="acc-container-name-input"
                type="text"
                placeholder="Accordion Container Name"
                value={element.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                onChange={(e) => {
                  handleChange(e, "fieldName");
                }}
              />
            </div>

            <div className="form-input">
              <label className="secondaryColor">Items</label>
              <div>
                {element.accordionProperties?.map((item) => (
                  <RenderAccordion item={item} />
                ))}
              </div>
              <div style={{ display: "flex" }}>
                <input
                  id="acc-container-item-input"  
                  className="form-control d-inline"
                  style={{ flex: 4 }}
                  value={accordionName}
                  onChange={accordionNameChange}
                  placeholder="Accordion Header"
                />
                <button
                  id="acc-container-add-btn"
                  className="d-inline"
                  onClick={addAccord}
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
