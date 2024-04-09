import React from "react";
import iconSet from "../../../../assets/icons.json";
import IcomoonReact from "icomoon-react";
import parse from "html-react-parser";

export default function ActionUiMock({ onClick, item, deleteItem, Orderkey }) {
  return (
    <div
      className="mockElement "
      style={{ backgroundColor: item.bgColor ?? null }}
    >
      <span className="mockElementSpan secondaryColor">
        {item.fieldName ? parse(item?.fieldName) : "Action"}
      </span>
      <IcomoonReact
        className="mock-ui-del-icon"
        iconSet={iconSet}
        color="#C4C4C4"
        size={20}
        icon="DeleteIcon"
        onClick={() => deleteItem()}
        id="mock-element-delete-icon"
      />
    </div>
  );
}
