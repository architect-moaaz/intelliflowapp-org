import React from "react";
import iconSet from "../../../assets/icons.json";
import IcomoonReact from "icomoon-react";
import { Accordion, Dropdown } from "react-bootstrap";
import parse from "html-react-parser";

const DropDownUiMock = ({ onClick, item, deleteItem }) => {
  const renderChoices = () => {
    if (item.multiSelect) {
      return (
        <div>
          {item.choices.map((item) => {
            return (
              <div key={item.key}>
                <input type="checkbox" id="dropdownUiMock-checkbox-input" />
                <label className="secondaryColor" style={{ marginLeft: "5px" }}>{item.label}</label>
              </div>
            );
          })}
        </div>
      );
    } else {
      return (
        <div>
          {item.choices.map((item) => {
            return (
              <div key={item.key}>
                <input type="radio" id="dropdownUiMock-radio-input" />
                <label className="secondaryColor" style={{ marginLeft: "5px" }}>{item.label}</label>
              </div>
            );
          })}
        </div>
      );
    }
  };
  return (
    // <div
    //   className="bg-white"
    //   key={item.id}
    //   // onClick={() => onClick()}
    // >
    <div className="mockElement">
      <IcomoonReact
        iconSet={iconSet}
        color="#C4C4C4"
        size={20}
        icon="DropDown"
        id="dropdownUiMock-dropdown-IcomoonReact"
      />
      {/* <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header >
              <span style={{color:"#FF5711", padding:"0px"}}>{item.fieldName
                ? parse(item.fieldName)
                : "Please add a field name"}</span>
            </Accordion.Header>
            <Accordion.Body>{renderChoices()}</Accordion.Body>
          </Accordion.Item>
        </Accordion> */}
      <span className="mockElementSpan secondaryColor">
        {item.fieldName
          ? parse(item.fieldName)
          : "Please add a field name for a Dropdown"}
      </span>
      {/* {renderChoices()} */}
      <IcomoonReact
        className="mock-ui-del-icon"
        iconSet={iconSet}
        color="#C4C4C4"
        size={20}
        icon="DeleteIcon"
        onClick={(e) => deleteItem(e, item.id)}
        id="dropdownUiMock-delete-IcomoonReact"
      />
    </div>
    // </div>
  );
};

export default DropDownUiMock;
