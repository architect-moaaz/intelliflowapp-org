import React from "react";
import iconSet from "../../../assets/icons.json";
import IcomoonReact from "icomoon-react";
import MathView, { MathViewRef } from "react-math-view";

const MathExpUiMock = ({ onClick, item, deleteItem, Orderkey }) => {
  // console.log("check this " + Orderkey);

  return (
    // <div
    //   className="bg-white"
    //   // onClick={() => onClick()}
    // >
    <div className="mockElement ">
      <span className="mockElementSpan secondaryColor">
        <div className="disabled">
          <MathView value={item.fieldName} />
        </div>
      </span>
      <IcomoonReact
        className="mock-ui-del-icon"
        iconSet={iconSet}
        color="#C4C4C4"
        size={20}
        icon="DeleteIcon"
        onClick={(e) => deleteItem(e, item.id)}
        id="mathExpUiMock-delete-IcomoonReact"
      />
    </div>
    // </div>
  );
};

export default MathExpUiMock;
