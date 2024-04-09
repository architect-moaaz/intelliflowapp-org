import React from "react";
import iconSet from "../../../assets/icons.json";
import IcomoonReact from "icomoon-react";
import parse from "html-react-parser";

const ESignatureUiMock = ({ onClick, item, deleteItem }) => {
  // const miniAppName = localStorage.getItem("appName");
  return (
    // <div
    //   className="bg-white"
    //   key={item.id}
    //   // onClick={() => onClick()}
    // >
    <div className="mockElement ">
      <IcomoonReact
        iconSet={iconSet}
        color="#C4C4C4"
        size={20}
        icon="ImageIcon"
        id="eSignatureUiMock-ImageIcon-IcomoonReact"
      />
      <span className="mockElementSpan secondaryColor">
        {item.fieldName ? parse(item.fieldName) : "E Signature"}
      </span>
      {/* {item.signatureDataUrl ? (
        <img
          className="sigImage"
          src={
            process.env.REACT_APP_CDS_ENDPOINT +
            miniAppName +
            "/image/" +
            item.signatureDataUrl
          }
          alt="This is your Signature"
        />
      ) : null} */}

      <IcomoonReact
        className="mock-ui-del-icon"
        iconSet={iconSet}
        color="#C4C4C4"
        size={20}
        icon="DeleteIcon"
        onClick={(e) => deleteItem(e, item.id)}
        id="eSignatureUiMock-delete-IcomoonReact"
      />
    </div>
    // </div>
  );
};

export default ESignatureUiMock;
