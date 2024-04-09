import React, { useState } from "react";
import iconSet from "../../../assets/icons.json";
import IcomoonReact from "icomoon-react";
import QRCode from "react-qr-code";
import parse from "html-react-parser";
import "./QRCode.css";

const QRCodeUiMock = ({ onClick, item, deleteItem }) => {
  return (
    <div
      className="QRdiv bg-white"
      key={item.id}
      // onClick={() => onClick()}
    >
      {/* <div className="mockElement ">
        <IcomoonReact
          iconSet={iconSet}
          color="#C4C4C4"
          size={20}
          icon="QRCode"
        /> */}
      <QRCode
        // style={{"height":"10rem", "width":"10rem"}}
        size={156}
        className="Qr-wrap"
        // style={{ height: "auto", maxWidth: "75%", width: "75%" }}
        viewBox={`0 0 156 156`}
        value={
          item.fieldName
            ? parse(item.fieldName)
            : "Please Add Text To Make QR Code"
        }
      />
      <IcomoonReact
        className="mock-ui-del-icon"
        iconSet={iconSet}
        color="#C4C4C4"
        size={20}
        icon="DeleteIcon"
        onClick={(e) => deleteItem(e, item.id)}
        id="qrCodeUi-delete-IcomoonReact"
      />
    </div>
  );
};

export default QRCodeUiMock;
