import React from "react";
import iconSet from "../../../assets/icons.json";
import IcomoonReact from "icomoon-react";
import { Link } from "react-router-dom";
import { LinkIcon } from "../../../assets";
import parse from "html-react-parser";

const LinkUiMock = ({ onClick, item, deleteItem }) => {
  return (
    // <div
    //   className="bg-white"
    //   key={item.id}
    //   // onClick={() => onClick()}
    // >
    <div className="mockElementSpan ">
      {item.fieldName ? parse(item.fieldName) : "Link"}
      {/* <IcomoonReact
        className="mock-ui-del-icon"
        iconSet={iconSet}
        color="#C4C4C4"
        size={20}
        icon="DeleteIcon"
        onClick={(e) => deleteItem(e, item.id)}
        id="linkUiMock-delete-IcomoonReact"
      /> */}
    </div>
    // </div>
  );
};

export default LinkUiMock;
