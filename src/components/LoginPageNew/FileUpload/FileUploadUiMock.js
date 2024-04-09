import React, { useState } from "react";
import iconSet from "../../../assets/icons.json";
import IcomoonReact from "icomoon-react";
import parse from "html-react-parser";

const FileUploadUiMock = ({ onClick, item, deleteItem }) => {
  return (
    // <div className="bg-white">
    <div className="mockElement " key={item.id}>
      <IcomoonReact
        iconSet={iconSet}
        color="#C4C4C4"
        size={20}
        icon="FileUploadIcon"
        id="fileUploadUiMock-FileUploadIcon-IcomoonReact"
      />
      <span className="mockElementSpan secondaryColor">
        {item.fieldName ? parse(item.fieldName) : "File Upload"}
      </span>
      <IcomoonReact
        className="mock-ui-del-icon"
        iconSet={iconSet}
        color="#C4C4C4"
        size={20}
        icon="DeleteIcon"
        onClick={(e) => deleteItem(e, item.id)}
        id="fileUploadUiMock-delete-IcomoonReact"
      />
    </div>
    // </div>
  );
};

export default FileUploadUiMock;
