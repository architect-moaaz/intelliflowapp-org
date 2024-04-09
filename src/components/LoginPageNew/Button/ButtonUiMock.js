import React from "react";
import iconSet from "../../../assets/icons.json";
import IcomoonReact from "icomoon-react";
import parse from "html-react-parser";

export default function ButtonUiMock({ onClick, item, deleteItem }) {
  return (
    <div
      className="mockElement "
      style={{ backgroundColor: item.bgColor ?? null }}
    >
      {/* <IcomoonReact
          iconSet={iconSet}
          color="#C4C4C4"
          size={20}
          icon="RadioButton"
        /> */}
      <span className="mockElementSpan secondaryColor">
        {item.fieldName ? parse(item?.fieldName) : "Button"}
      </span>
      {/* <IcomoonReact
        className="mock-ui-del-icon"
        id="buttonUiMock-delete-icon"
        iconSet={iconSet}
        color="#C4C4C4"
        size={20}
        icon="DeleteIcon"
        onClick={(e) => deleteItem(e, item.id)}
      /> */}
    </div>
  );
}
