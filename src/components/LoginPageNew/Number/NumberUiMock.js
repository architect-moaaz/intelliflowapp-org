import React from "react";
import iconSet from "../../../assets/icons.json";
import IcomoonReact from "icomoon-react";
import parse from "html-react-parser";

const NumberUiMock = ({ onClick, item, deleteItem, Orderkey }) => {
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
        size={15}
        icon="Number"
        id="numberUiMock-number-IcomoonReact"
      />
      <span className="mockElementSpan secondaryColor">
        {item.fieldName ? parse(item.fieldName) : "Enter Number"}
      </span>
      <IcomoonReact
        className="mock-ui-del-icon"
        iconSet={iconSet}
        color="#C4C4C4"
        size={20}
        icon="DeleteIcon"
        onClick={(e) => deleteItem(e, item.id)}
        id="numberUiMock-delete-IcomoonReact"
      />
    </div>
    // </div>
  );
};

export default NumberUiMock;
