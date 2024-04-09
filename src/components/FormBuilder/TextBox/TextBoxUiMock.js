import React, { useState } from "react";
import iconSet from "../../../assets/icons.json";
import IcomoonReact from "icomoon-react";
import RichTextEditor from "react-rte";
import parse from "html-react-parser";

const TextBoxUiMock = ({ onClick, item, deleteItem, sortOrder }) => {
  const [val, setVal] = useState(RichTextEditor.createEmptyValue());
  const onChange = (data) => {
    setVal(data);
  };
  const renderType = () => {
    switch (item.fieldType) {
      case "text":
        return item.fieldName
          ? parse(item.fieldName)
          : item.fieldType.charAt(0).toUpperCase() + item.fieldType.slice(1);

      case "email":
        return item.fieldName
          ? parse(item.fieldName)
          : item.fieldType.charAt(0).toUpperCase() + item.fieldType.slice(1);

      case "richText":
        return <RichTextEditor value={val} onChange={onChange} />;

      default:
        return item.fieldName
          ? parse(item.fieldName)
          : item.fieldType.charAt(0).toUpperCase() + item.fieldType.slice(1);
    }
  };
  return (
    // <div
    //   className="bg-white"
    //   // key={item.id}
    //   // onClick={() => onClick()}
    // >
    <div className="mockElement ">
      <IcomoonReact
        iconSet={iconSet}
        color="#C4C4C4"
        size={20}
        icon={item.fieldType === "email" ? "EmailIcon" : "TextBoxIcon"}
        id="textBoxUiMock-fieldType-IcomoonReact"
      />
      <span className="mockElementSpan secondaryColor">{renderType()}</span>
      <IcomoonReact
        className="mock-ui-del-icon"
        iconSet={iconSet}
        color="#C4C4C4"
        size={20}
        icon="DeleteIcon"
        onClick={(e) => deleteItem(e, item.id)}
        EmailIcon
        id="textBoxUiMock-delete-IcomoonReact"
      />
    </div>
    // </div>
  );
};

export default TextBoxUiMock;
