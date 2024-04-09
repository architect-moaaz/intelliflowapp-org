import React from "react";
import iconSet from "../../../../assets/icons.json";
import IcomoonReact from "icomoon-react";
import parse from "html-react-parser";

export default function LabelUiMock({ onClick, item, deleteItem, Orderkey }) {
  // console.log("check this " + Orderkey);

  return (
    // <div
    //   className="bg-white"
    //   // onClick={() => onClick()}
    // >
    <div className="mockElement ">
      <IcomoonReact
        iconSet={iconSet}
        color="#C4C4C4"
        size={20}
        icon="LabelIcon"
      />
      <span className="mockElementSpan secondaryColor">
        {item.fieldName ? parse(item.fieldName) : "Enter Label Name"}
      </span>
      <IcomoonReact
        className="mock-ui-del-icon"
        iconSet={iconSet}
        color="#C4C4C4"
        size={20}
        icon="DeleteIcon"
        onClick={() => deleteItem()}
        id="label-delete-icon"
        />
    </div>
    // </div>
  );
}
