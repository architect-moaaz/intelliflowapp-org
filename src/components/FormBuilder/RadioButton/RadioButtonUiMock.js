import React from "react";
import iconSet from "../../../assets/icons.json";
import IcomoonReact from "icomoon-react";
import parse from "html-react-parser";

const RadioButtonUiMock = ({ onClick, item, deleteItem }) => {
  const renderChoices = () => {
    if (item.VAxis) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column"
          }}
        >
          {item.choices?.map((item) => {
            return (
              <div
                className="bg-white col-6"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E5E5E5",
                  "box-sizing": "border-box",
                  "border-radius": "5px",
                  padding: "5px",
                  display: "flex",
                }}
                key={item.key}
              >
                <input id="radioButtonUiMock-vAxis-input" type="radio" />{" "}
                {item.choice}
              </div>
            );
          })}
        </div>
      );
    } else {
      return (
        <div className="secondaryColor" 
          style={{
            display: "flex",
            flexDirection: "row"
          }}
        >
          {item.choices?.map((item) => {
            return (
              <div
                className="bg-white col-6 "
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E5E5E5",
                  "box-sizing": "border-box",
                  "border-radius": "5px",
                  padding: "5px",
                  marginRight: "5px",
                  display: "flex",
                }}
                key={item.key}
              >
                <input
                  style={{ marginRight: "2px" }}
                  id="radioButtonUiMock-else-input"
                  type="radio"
                />{" "}
                {item.choice}
              </div>
            );
          })}
        </div>
      );
    }
  };
  return (
    <div>
      <div className="mockElement ">
        <IcomoonReact
          iconSet={iconSet}
          color="#C4C4C4"
          size={20}
          icon="RadioButton"
          id="radioButtonUiMock-radioButton-IcomoonReact"
        />
        <span className="mockElementSpan secondaryColor">
          {item.fieldName
            ? parse(item.fieldName)
            : "Please add a field name for a Radio Button"}
        </span>

        <IcomoonReact
          className="mock-ui-del-icon"
          iconSet={iconSet}
          color="#C4C4C4"
          size={20}
          icon="DeleteIcon"
          onClick={(e) => deleteItem(e, item.id)}
          id="radioButtonUiMock-delete-IcomoonReact"
        />
      </div>
      {renderChoices()}
    </div>
  );
};

export default RadioButtonUiMock;
